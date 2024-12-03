import React, { useState, useEffect } from "react";
import axios from "axios";
import ShopCart from "./ShopCart";
import "./style.css";
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, capacities } from "@mui/material";
const Shop = ({ addToCart }) => {
  const [categories, setCategories] = useState([]); // State to store fetched categories
  const [error, setError] = useState(null); // State to handle errors
  const [selectedCategory, setSelectedCategory] = useState(0); // Initial category (All Products)
  const [products, setProducts] = useState([]); // State to store filtered products

  // Fetch categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      setError(null); // Clear any previous errors

      try {
        const response = await axios.get("http://localhost:5000/api/categories/all_categories");
        setCategories(response.data);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, []);

  // Fetch products based on selected category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url;
        if (selectedCategory === 0) {
          // Fetch all products if "All Products" is selected
          url = "http://localhost:5000/api/products/all_products";
        } else {
          // Fetch products for the selected category
          url = `http://localhost:5000/api/products/all_products?category_id=${selectedCategory}`;
        }

        const response = await axios.get(url);
        const processedProducts = response.data.map((product) => {
          const imagePath = product.image_preview?.toString(); // Convert to string for consistent type
          const filename = imagePath?.match(/[^\\\/]+$/)[0] || '';
          const desiredPath = filename; // Construct desired path

          return { ...product, image_preview: desiredPath }; // Create a new product object with updated image path
        });
        setProducts(processedProducts);

      } catch (error) {
        setError(error); // Handle potential server errors here (e.g., display an error message)
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value); // Convert to number for API call
  };

  // Display categories conditionally based on loading state and error
  return (
    <>
      <section className="shop background">
        <div className="container d_flex">
          <div className="category">
            <div className="chead d_flex">

              <h1>Brands </h1>
              <h1>Shops </h1>
            </div>
            {categories.length > 0 ? (
              <Select

                value={selectedCategory}


                onChange={handleCategoryChange}
                sx={{width: 250}}

              > <MenuItem value={0}>
                 ----- All Products ----
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>


            ) : (
              <p>Loading categories...</p>

            )}
            {error && <p>Error fetching categories: {error.message}</p>}
          </div>

          <div className="contentWidth">
            <div className="heading d_flex">
              <div className="heading-left row f_flex">
                <h2>New Products</h2>
              </div>
              <div className="heading-right row ">
                <span>View all</span>
                <i className="fa-solid fa-caret-right"></i>
              </div>
            </div>
            <div
              className="product-content grid1">
              {products.length
                > 0 ? (
                <ShopCart addToCart={addToCart} products={products} />
              ) : (
                <p>{selectedCategory === 0 ? "Showing all products..." : "No products found in this category."}</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Shop;