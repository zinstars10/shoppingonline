import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid,GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme"; // Assuming your theme file
import Header from "../../components/admin/Header";
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import SystemUpdateAltOutlinedIcon from '@mui/icons-material/SystemUpdateAltOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DeliveryDiningOutlinedIcon from '@mui/icons-material/DeliveryDiningOutlined';
import { ToastContainer, toast } from 'react-toastify';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
const Orders = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [orders, setOrders] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/oders/all_orders');
        setOrders(response.data.map((order) => ({
          ...order,
          id: order._id, // Assuming your product data has an _id property
        })));
      } catch (error) {
        console.error('Error fetching Orders:', error);
      }
    };

    fetchProducts();
  }, []);
  const handleCheckout = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/oders/editOrderStatus/${id}`,
        { status: 2 }); // Send updated status in request body
      const updatedOrders = orders.map((order) => (order._id === id ? response.data.order : order));
      setOrders(updatedOrders);
      if (response.data.status === 1) {

        setSuccessMessage('Approve successfully!');
        toast.success('Approve added successfully!', {
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

        // Keep the item added to the cart state
      } else {
        // Server-side addition failed, remove from cart state

        alert(`Error Approve item to cart: ${response.data.message}`);  // More specific message
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/oders/editOrderStatus/${id}`,
        { status: 3 }); // Send updated status in request body
      const updatedOrders = orders.map((order) => (order._id === id ? response.data.order : order));
      setOrders(updatedOrders);
      if (response.data.status === 1) {

        setSuccessMessage('Approve successfully!');
        toast.success('Approve added successfully!', {
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

        // Keep the item added to the cart state
      } else {
        // Server-side addition failed, remove from cart state

        alert(`Error Approve item to cart: ${response.data.message}`);  // More specific message
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

const handleDelivery = async (id) => {
  try {
    // 1. Make the Axios PUT request
    const response = await axios.put(`http://localhost:5000/api/oders/editOrderStatus/${id}`, { status: 4 });

    // 2. Update Orders State (Client-Side Optimization)
    setOrders(prevOrders => prevOrders.map(order => order._id === id ? response.data.order : order));

    // 3. Handle Success (Status Code 200)
    if (response.status === 200) { // Check response status code
      setSuccessMessage('Delivery approved successfully!');
      toast.success('Delivery approved successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,   

        progress: undefined,
        theme: "light"
      });
      window.location.reload();
    } else   
 { // Handle errors from server (status code != 200)
      throw new Error(`Server error: ${response.statusText}`); // More specific error handling
    }

  } catch (error) {
    console.error('Error updating order status:', error);
    alert(`Error approving delivery: ${error.message}`); // Informative error message for user
  }
};

  const columns = [
    {
      field: "order",
      headerName: "Order ID",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: 'product_name',
      headerName: 'Product Name',
      flex: 1,
      renderCell: (params) => {
        const { product } = params.row;
        return (
          <div>
            {product.product_name}
          </div>
        );
      },
    },
    {
      field: 'product_price',
      headerName: 'Price',
      flex: 1,
      renderCell: (params) => {
        const { product } = params.row;
        return (
          <div>
            {product.price.toLocaleString('vi-VN', { minimumFractionDigits: 0 })}
          </div>
        );
      },
    },
    {
      field: "qty",
      headerName: "Quantity",
      flex: 1,
    },
    {
      field: 'total_price',
      headerName: 'Total',
      flex: 1,
      renderCell: (params) => {
        const { product, qty } = params.row;
        const totalPrice = product.price * qty;
        return (
          <div>
            {totalPrice.toLocaleString('vi-VN', { minimumFractionDigits: 0 })}
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const { status } = params.row;
        let statusText = "";
        switch (status) {
          case 1:
            statusText = "Wating";
            break;
          case 2:
            statusText = "Approve";
            break;
          case 3:
            statusText = "Delete";
            break;
          case 4:
            statusText = "Delivery";
            break;
          default:
            statusText = "Unknown";
        }
        return (
          <div>
            {statusText}
          </div>
        );
      },
    },

    {
      field: "",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => {
        const { status } = params.row;
        return (
          <Typography color={colors.greenAccent[500]} style={{ justifyContent: "center" }}>
            {status === 1 && (
              <>
                <Button onClick={() => handleCheckout(params.row.order)} style={{ color: "#B5FBDD", marginRight: "5px" }}>
                  <SystemUpdateAltOutlinedIcon />
                </Button>
                <Button onClick={() => handleReject(params.row.order)} style={{ color: "#FF756B", marginRight: "5px" }}>
                  <DeleteOutlineOutlinedIcon />
                </Button>
                <Button disabled style={{ color: "grey", marginRight: "5px" }}>
                  <DeliveryDiningOutlinedIcon />
                </Button>
              </>

            )}
            {status === 2 && (
              <>
                <Button disabled style={{ color: "grey", marginRight: "5px" }}>
                  <SystemUpdateAltOutlinedIcon />
                </Button>
                <Button disabled style={{ color: "grey" }}>
                  <DeleteOutlineOutlinedIcon />
                </Button>
                <Button onClick={() => handleDelivery(params.row.order)} style={{ color: "#B5FBDD", marginRight: "5px" }}>
                  <DeliveryDiningOutlinedIcon />
                </Button>
              </>
            )}
            {status === 3 && (
              <>
                <Button disabled style={{ color: "grey", marginRight: "5px" }}>
                  <SystemUpdateAltOutlinedIcon />
                </Button>
                <Button disabled style={{ color: "grey" }}>
                  <DeleteOutlineOutlinedIcon />
                </Button>
                <Button disabled style={{ color: "grey", marginRight: "5px" }}>
                  <DeliveryDiningOutlinedIcon />
                </Button>
              </>
            )}
                        {status === 4 && (
              <>
                <Button disabled style={{ color: "green", marginRight: "5px" }}>
                  <CheckCircleOutlineOutlinedIcon />
                </Button>
              </>
            )}

          </Typography>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <ToastContainer />
      <Header title="Orders" subtitle="List of Orders" />
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={orders}
          columns={columns}
          getRowId={(row) => row.order}
          components={{ Toolbar: GridToolbar }} // Provide a unique identifier for each row
        />
      </Box>
    </Box>
  );
};

export default Orders;