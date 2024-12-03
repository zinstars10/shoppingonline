import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme"; // Assuming your theme file
import Header from "../../components/admin/Header";
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import SystemUpdateAltOutlinedIcon from '@mui/icons-material/SystemUpdateAltOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
const Categories = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [products, setCategories] = useState([]);
  const navigate = useNavigate(); 
  const [successMessage, setSuccessMessage] = useState(null);

  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories/all_categories');
        setCategories(response.data.map((product) => ({
          ...product,
          id: product._id, // Assuming your product data has an _id property
        })));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchCategories();
  }, []);
  const handleEditClick = (categorie_id) => {
    navigate(`/admin/category/edit/${categorie_id}`); // Navigate to edit page with ID
  };

  const handleDelete = (categorie_id) => {
    const fetchCategories = async () => {
      try {
        const response = await axios.delete(`http://localhost:5000/api/categories/delete/${categorie_id}`);
        console.log(response)
 
 

          setSuccessMessage('Detele Categories!');
          toast.success('Detele Categories Succesfull', {
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
   
      } catch (error) {
        setSuccessMessage('Have Product!');
        toast.error('Have Product can not delete!', {
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
    };

    fetchCategories();
  }

  const columns = [
    {
      field: "name",
      headerName: "Categories Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "createdAt",
      headerName: "Create Time",
      flex: 1,
    },
    {
      field: "",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]} style={{justifyContent: "center"}}>
         <Button style={{color:"#B5FBDD", marginRight: "5px"}}
 
          
            size="small"
            onClick={() => handleEditClick(params.row._id)} // Pass ID on click
          >
            <SystemUpdateAltOutlinedIcon />
          </Button>
          <Button    onClick={() => handleDelete(params.row._id)} style={{ color:"#FF756B"}} ><DeleteOutlineOutlinedIcon/></Button>
        </Typography>
      ),
    },
  ];

  return (
    <Box m="20px">
      <ToastContainer></ToastContainer>
      <Header title="PRODUCTS" subtitle="List of Categories" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={products}
          columns={columns}
          getRowId={(row) => row.id} // Provide a unique identifier for each row
        />
      </Box>
    </Box>
  );
};

export default Categories;