import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, capacities } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/admin/Header";
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import { useParams } from 'react-router-dom';
const CategoriesEdit = () => {
  const { id } = useParams();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [categoryData, setCategoryData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission state
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/categories/get_category/${id}`);
        setCategoryData(response.data);
        setIsLoading(false)
        console.log(response.data.name)
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };
  
    fetchCategoryData();
  }, [id]);
  const initialValues = {
    name: categoryData.name || '',
  };



  const handleProductSubmit = async (values) => {
    setIsSubmitting(true);
    const jsonString = JSON.stringify(values);
    console.log("values", values)



    // Add other capacity properties as needed

    try {
      const response = await axios.put(`http://localhost:5000/api/categories/edit/${id}`, jsonString, {
        headers: {
          "Content-type": "application/json",
        },
      });

      console.log('Product creation response:', response.data.error);
      if (!response.data.error) {
        setSuccessMessage('Product added successfully!');
        toast.success('Product added successfully!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick:
            true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        window.location.reload();
      }
      else {
        setErrorMessage('Product added failed!');
        toast.error('Product added failed! Check field again', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick:
            true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

      }

      // Handle successful submission (e.g., reset form, show success message)
      // ...

    } catch (error) {
      console.error('Error submitting categories:', error);
      setErrorMessage('Name exits failed!');
      toast.error('Name exits failed Check field again', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick:
          true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      // Handle errors (e.g., display error message)
      // ...
    } finally {
      setIsSubmitting(false); // Reset form submission state to 'false' after completion
    }
  };



  return (
    <Box m="20px">
      <Header title="Add Categories" subtitle="Add New Categories" />
      <ToastContainer />
      <Formik
        onSubmit={handleProductSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        

        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit

        }) => (
          <form onSubmit={handleSubmit}>
                  <p>{categoryData.name}</p> <br></br>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField

                variant="filled"
                type="text"
                color="success"
                label="Categories Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={isLoading ? '' : values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 2" }}
              />
             

            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Edit Caterogy
              </Button>
            </Box>
          </form >
        )}
      </Formik >
    </Box >
  );
};



const checkoutSchema = yup.object().shape({

  name: yup.string().required("required"),
 
});


export default CategoriesEdit;
