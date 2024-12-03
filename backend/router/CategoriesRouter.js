const express = require("express");
const router = express.Router();
const CategoriesModel = require("../models/CategoriesModel");
const { check, validationResult } = require("express-validator/check");
const ProductsModel = require("../models/ProductsModel");

router.get("/all_categories", async (req, res) => {
  const category = await CategoriesModel.find({});
  res.json(category);
});
router.get("/get_category/:id", async (req, res) => {
  const { id } = req.params;

  const category = await CategoriesModel.findById(id);

  if (!category) {
    res.json({ message: "categories not found", status: 0 });
    return;
  }

  res.json(category);
});



router.post(
  "/add",
  check("name", "Enter category Name").not().isEmpty(),
  async (req, res) => {
    const { name } = req.body;

    const error = validationResult(req);

    // 1. Check for validation errors
    if (!error.isEmpty()) {
      res.json({ error: error.array(), status: 0 });
      return;
    }

    try {
      // 2. Check for existing category with same name
      const existingCategory = await CategoriesModel.findOne({ name });

      if (existingCategory) {
        console.log(`Category with name "${name}" already exists.`); // Log message
        res.status(400).json({ message: "Category name already exists", status: 0 });
        return;
      }

      // 3. Create new category if name doesn't exist
      const newCategory = new CategoriesModel({ name });
      await newCategory.save();

      res.send({ message: "Category added successfully", status: 1 });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error", status: 0 });
    }
  }
);
router.put('/edit/:id', 
check("name", "Enter Name Category").not().isEmpty(),
async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedCategory = await CategoriesModel.findByIdAndUpdate(id, { name }, { new: true });

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category updated successfully', category: updatedCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({   message: 'Server Error' });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Find the category by ID
    const category = await CategoriesModel.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // 2. Check if the category has any products
    const hasProducts = await ProductsModel.exists({ category_id: id }); // Assuming you have a ProductsModel with a 'category' field

    if (hasProducts) {
      console.log("Cannot delete category with associated products")
      return res.status(400).json({ message: "Cannot delete category with associated products" , status: 4 })
  
    }
    else {
      await CategoriesModel.findByIdAndDelete(id);

      res.json({ message: "Category deleted successfully", status: 1 });
    }

    // 3. Delete the category if it has no products

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error"   
 });
  }
});

module.exports = router;
