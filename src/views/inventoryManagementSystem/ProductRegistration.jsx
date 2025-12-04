// import React, { useState, useEffect } from 'react';
// import {
//   Container, Grid, Typography, Box, TextField, Button, Card, CardContent, Snackbar,
//   Alert, IconButton, Fade, Paper
// } from '@mui/material';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Inventory as InventoryIcon } from '@mui/icons-material';
// import ProductIcon from '@mui/icons-material/Category';
// import { postApi, getApi, updateApi, deleteApi } from '@/core/apis/api';
// import { urls } from '@/core/Constant/urls';
// import { tokenPayload } from '@/helper';

// const ProductRegistration = () => {
//   const [formData, setFormData] = useState({ productName: '', productModel: '', productDescription: '' });
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [registeredProducts, setRegisteredProducts] = useState([]);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const payload = tokenPayload()
//   useEffect(() => {
//     fetchRegisteredProducts();
//   }, []);

//   const fetchRegisteredProducts = async () => {
//     try {
//       const data = await getApi(`${urls.Inventory.getAllProducts}?companyId=${payload._id}`);
//       const formatted = data.data.map((item, index) => ({ ...item, id: item._id || index }));
//       setRegisteredProducts(formatted);
//     } catch (error) {
//       setSnackbar({ open: true, message: 'Failed to fetch products.', severity: 'error' });
//     }
//   };

//   const handleInputChange = (field) => (event) => {
//     setFormData({ ...formData, [field]: event.target.value });
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.productName) newErrors.productName = 'Product name is required';
//     if (!formData.productModel) newErrors.productModel = 'Product model is required';
//     if (!formData.productDescription) newErrors.productDescription = 'Product description is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       if (editingProduct) {
//         const url = urls.Inventory.editProduct
//         await updateApi(`${url}/${editingProduct._id}`, formData);
//         setSnackbar({ open: true, message: 'Product updated successfully!', severity: 'success' });
//       } else {
//         await postApi(`${urls.Inventory.productRegistration}?companyId=${payload._id}`, formData);
//         setSnackbar({ open: true, message: 'Product registered successfully!', severity: 'success' });
//       }

//       setFormData({ productName: '', productModel: '', productDescription: '' });
//       setEditingProduct(null);
//       fetchRegisteredProducts();
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error?.response?.data?.message || error.message || 'Error occurred.',
//         severity: 'error'
//       });
//     }
//   };

//   const handleEditProduct = (product) => {
//     setEditingProduct(product);
//     setFormData({
//       productName: product.productName,
//       productModel: product.productModel,
//       productDescription: product.productDescription
//     });
//   };

//   const handleDeleteProduct = async (id) => {
//     try {
//       await deleteApi(`${urls.Inventory.deleteProduct}/${id}`);
//       setSnackbar({ open: true, message: 'Product deleted successfully!', severity: 'success' });
//       fetchRegisteredProducts();
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error?.response?.data?.message || error.message || 'Failed to delete product.',
//         severity: 'error'
//       });
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingProduct(null);
//     setFormData({ productName: '', productModel: '', productDescription: '' });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   const registeredProductsColumns = [
//     { field: 'productName', headerName: 'Product Name', flex: 1 },
//     { field: 'productModel', headerName: 'Product Model', flex: 1 },
//     { field: 'productDescription', headerName: 'Description', flex: 1.5 },
//     {
//       field: 'actions',
//       headerName: 'Actions',
//       flex: 0.8,
//       sortable: false,
//       renderCell: (params) => (
//         <Box>
//           <IconButton size="small" onClick={() => handleEditProduct(params.row)} sx={{ mr: 1, color: 'primary.main' }}>
//             <EditIcon fontSize="small" />
//           </IconButton>
//           <IconButton size="small" onClick={() => handleDeleteProduct(params.row._id)} sx={{ color: 'error.main' }}>
//             <DeleteIcon fontSize="small" />
//           </IconButton>
//         </Box>
//       )
//     }
//   ];

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       <Fade in={true} timeout={800}>
//         <Box>
//           <Box textAlign="center" mb={4}>
//             {/* <ProductIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} /> */}
//             <Typography variant="h3" component="h1" gutterBottom sx={{
//               fontWeight: 700,
//               background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
//               backgroundClip: 'text',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent'
//             }}>
//               Product Registration
//             </Typography>
//             <Typography variant="h6" color="text.secondary" sx={{ marginBottom: '40px' }}>
//               {editingProduct ? 'Update product information' : 'Register your new product with detailed information'}
//             </Typography>
//           </Box>

//           {/* Form */}
//           <Grid container spacing={4}>
//             <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', width: '100%' }}>
//               <Box sx={{ width: '100%', maxWidth: '800px' }}>
//                 <Card elevation={8} sx={{
//                   borderRadius: 3,
//                   background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
//                   border: '1px solid', borderColor: 'divider'
//                 }}>
//                   <CardContent sx={{ p: 4 }}>
//                     {editingProduct && (
//                       <Box sx={{ mb: 3, p: 2, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
//                         <Typography variant="body2" color="primary" fontWeight="bold">
//                           Editing: {editingProduct.productName}
//                         </Typography>
//                         <Button size="small" onClick={handleCancelEdit} sx={{ mt: 1 }}>
//                           Cancel Edit
//                         </Button>
//                       </Box>
//                     )}
//                     <form onSubmit={handleSubmit}>
//                       <Grid container spacing={3}>
//                         <Grid item xs={12} md={6}>
//                           <TextField fullWidth label="Product Name" value={formData.productName}
//                             onChange={handleInputChange('productName')} error={!!errors.productName}
//                             helperText={errors.productName} variant="outlined"
//                           />
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                           <TextField fullWidth label="Product Model" value={formData.productModel}
//                             onChange={handleInputChange('productModel')} error={!!errors.productModel}
//                             helperText={errors.productModel} variant="outlined"
//                           />
//                         </Grid>
//                         <Grid item xs={12}>
//                           <TextField fullWidth label="Product Description" multiline rows={4}
//                             value={formData.productDescription} onChange={handleInputChange('productDescription')}
//                             error={!!errors.productDescription} helperText={errors.productDescription}
//                             variant="outlined"
//                           />
//                         </Grid>
//                         <Grid item xs={12}>
//                           <Box display="flex" justifyContent="center" mt={2}>
//                             <Button type="submit" variant="contained" size="large" startIcon={<SaveIcon />}>
//                               {editingProduct ? 'Update Product' : 'Register Product'}
//                             </Button>
//                           </Box>
//                         </Grid>
//                       </Grid>
//                     </form>
//                   </CardContent>
//                 </Card>
//               </Box>
//             </Box>

//             {/* Table */}
//             <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
//               <Box sx={{ width: '100%' }}>
//                 <Card elevation={8} sx={{
//                   borderRadius: 3,
//                   background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
//                   border: '1px solid', borderColor: 'divider'
//                 }}>
//                   <CardContent sx={{ p: 4 }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                       <InventoryIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
//                       <Typography variant="h5" fontWeight="bold" color="primary">
//                         Registered Products ({registeredProducts.length})
//                       </Typography>
//                     </Box>
//                     {registeredProducts.length === 0 ? (
//                       <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: 2 }}>
//                         <ProductIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
//                         <Typography variant="h6" color="text.secondary" gutterBottom>
//                           No Products Registered Yet
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           Register your first product using the form above
//                         </Typography>
//                       </Paper>
//                     ) : (
//                       <DataGrid
//                         rows={registeredProducts}
//                         columns={registeredProductsColumns}
//                         getRowId={(row) => row.id}
//                         slots={{ toolbar: GridToolbar }}
//                         slotProps={{
//                           toolbar: {
//                             showQuickFilter: true,
//                             quickFilterProps: { debounceMs: 500 }
//                           }
//                         }}
//                         autoHeight
//                         pageSizeOptions={[5, 10, 25, 50]}
//                       />
//                     )}
//                   </CardContent>
//                 </Card>
//               </Box>
//             </Box>
//           </Grid>
//         </Box>
//       </Fade>

//       {/* Snackbar */}
//       <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
//         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{
//           width: '100%', borderRadius: 2,
//           boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
//         }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default ProductRegistration;






import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Typography, Box, TextField, Button, Card, CardContent,
  Snackbar, Alert, IconButton, Paper
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Inventory as InventoryIcon
} from '@mui/icons-material';
import ProductIcon from '@mui/icons-material/Category';
import { postApi, getApi, updateApi, deleteApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { tokenPayload } from '@/helper';

const ProductRegistration = () => {
  const [formData, setFormData] = useState({ productName: '', productModel: '', productDescription: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [errors, setErrors] = useState({});
  const [registeredProducts, setRegisteredProducts] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const payload = tokenPayload();

  useEffect(() => {
    fetchRegisteredProducts();
  }, []);

  const fetchRegisteredProducts = async () => {
    try {
      const data = await getApi(`${urls.Inventory.getAllProducts}?companyId=${payload._id}`);
      const formatted = data.data.map((item, index) => ({ ...item, id: item._id || index }));
      setRegisteredProducts(formatted);
    } catch {
      setSnackbar({ open: true, message: 'Failed to fetch products.', severity: 'error' });
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.productName) newErrors.productName = 'Product name is required';
    if (!formData.productModel) newErrors.productModel = 'Product model is required';
    if (!formData.productDescription) newErrors.productDescription = 'Product description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingProduct) {
        await updateApi(`${urls.Inventory.editProduct}/${editingProduct._id}`, formData);
        setSnackbar({ open: true, message: 'Product updated successfully!', severity: 'success' });
      } else {
        await postApi(`${urls.Inventory.productRegistration}?companyId=${payload._id}`, formData);
        setSnackbar({ open: true, message: 'Product registered successfully!', severity: 'success' });
      }

      setFormData({ productName: '', productModel: '', productDescription: '' });
      setEditingProduct(null);
      fetchRegisteredProducts();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.response?.data?.message || error.message || 'Error occurred.',
        severity: 'error'
      });
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      productModel: product.productModel,
      productDescription: product.productDescription
    });
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteApi(`${urls.Inventory.deleteProduct}/${id}`);
      setSnackbar({ open: true, message: 'Product deleted successfully!', severity: 'success' });
      fetchRegisteredProducts();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.response?.data?.message || error.message || 'Failed to delete product.',
        severity: 'error'
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setFormData({ productName: '', productModel: '', productDescription: '' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const registeredProductsColumns = [
    { field: 'productName', headerName: 'Product Name', flex: 1 },
    { field: 'productModel', headerName: 'Product Model', flex: 1 },
    { field: 'productDescription', headerName: 'Description', flex: 1.5 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton size="small" onClick={() => handleEditProduct(params.row)} sx={{ mr: 1, color: 'primary.main' }}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDeleteProduct(params.row._id)} sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    }
  ];

  // return (
  //   <Container maxWidth="xl">
  //     <Card
  //       sx={{
  //         p: 4,
  //         mt: 2,
  //         boxShadow: 4,
  //         borderRadius: 3,
  //         background: "linear-gradient(135deg, #ffffff, #fafafa)",
  //         minHeight: "500px",
  //         display: "flex",
  //         flexDirection: "column",
  //         justifyContent: "flex-start",
  //         width: "100%",
  //       }}
  //     >
  //       {/* Header */}
  //       <Box sx={{ mb: 3, textAlign: "center", borderBottom: "2px solid #eee", pb: 2 }}>
  //         <Typography
  //           variant="h4"
  //           sx={{
  //             fontWeight: "bold",
  //             color: "primary.main",
  //             fontSize: "24px",
  //           }}
  //           gutterBottom
  //         >
  //           Product Registration
  //         </Typography>
  //         <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
  //           {editingProduct ? 'Update product information' : 'Register your new product with detailed information'}
  //         </Typography>
  //       </Box>

  //       {/* Form */}
  //       <Box component="form" onSubmit={handleSubmit} noValidate>
  //         <Grid container spacing={3}>
  //           <Grid item xs={12} md={6}>
  //             <TextField
  //               fullWidth
  //               label="Product Name"
  //               value={formData.productName}
  //               onChange={handleInputChange('productName')}
  //               error={!!errors.productName}
  //               helperText={errors.productName}
  //             />
  //           </Grid>
  //           <Grid item xs={12} md={6}>
  //             <TextField
  //               fullWidth
  //               label="Product Model"
  //               value={formData.productModel}
  //               onChange={handleInputChange('productModel')}
  //               error={!!errors.productModel}
  //               helperText={errors.productModel}
  //             />
  //           </Grid>
  //           <Grid item xs={12}>
  //             <TextField
  //               fullWidth
  //               multiline
  //               rows={3}
  //               label="Product Description"
  //               value={formData.productDescription}
  //               onChange={handleInputChange('productDescription')}
  //               error={!!errors.productDescription}
  //               helperText={errors.productDescription}
  //             />
  //           </Grid>
  //           {editingProduct && (
  //             <Grid item xs={12}>
  //               <Box display="flex" justifyContent="space-between" alignItems="center" p={2} bgcolor="#e3f2fd" borderRadius={2}>
  //                 <Typography variant="body2" color="primary" fontWeight="bold">
  //                   Editing: {editingProduct.productName}
  //                 </Typography>
  //                 <Button size="small" onClick={handleCancelEdit}>Cancel Edit</Button>
  //               </Box>
  //             </Grid>
  //           )}
  //           <Grid item xs={12}>
  //             <Box textAlign="center">
  //               <Button type="submit" variant="contained" size="large" startIcon={<SaveIcon />}>
  //                 {editingProduct ? 'Update Product' : 'Register Product'}
  //               </Button>
  //             </Box>
  //           </Grid>
  //         </Grid>
  //       </Box>

  //       {/* Table */}
  //       <Box mt={5}>
  //         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
  //           <InventoryIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
  //           <Typography variant="h6" fontWeight="bold" color="primary">
  //             Registered Products ({registeredProducts.length})
  //           </Typography>
  //         </Box>
  //         {registeredProducts.length === 0 ? (
  //           <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: 2 }}>
  //             <ProductIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
  //             <Typography variant="h6" color="text.secondary" gutterBottom>
  //               No Products Registered Yet
  //             </Typography>
  //             <Typography variant="body2" color="text.secondary">
  //               Register your first product using the form above
  //             </Typography>
  //           </Paper>
  //         ) : (
  //           <DataGrid
  //             rows={registeredProducts}
  //             columns={registeredProductsColumns}
  //             getRowId={(row) => row.id}
  //             slots={{ toolbar: GridToolbar }}
  //             slotProps={{
  //               toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 500 } }
  //             }}
  //             autoHeight
  //             pageSizeOptions={[5, 10, 25, 50]}
  //           />
  //         )}
  //       </Box>
  //     </Card>

  //     {/* Snackbar */}
  //     <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}
  //       anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
  //       <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ borderRadius: 2 }}>
  //         {snackbar.message}
  //       </Alert>
  //     </Snackbar>
  //   </Container>
  // );
  return (
  <Container maxWidth="xl">
    {/* Form Card */}
    <Card
      sx={{
        p: 0,
        mt: 0,
        // boxShadow: 4,
        borderRadius: 3,
        background: "linear-gradient(135deg, #ffffff, #fafafa)",
        minHeight: "450px",
        width: "100%",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 2, textAlign: "center", borderBottom: "2px solid #eee", pb: 2 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            fontSize: "24px",
          }}
          gutterBottom
        >
          Product Registration
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
          {editingProduct
            ? "Update product information"
            : "Register your new product with detailed information"}
        </Typography>
      </Box>

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Product Name"
              value={formData.productName}
              onChange={handleInputChange("productName")}
              error={!!errors.productName}
              helperText={errors.productName}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Product Model"
              value={formData.productModel}
              onChange={handleInputChange("productModel")}
              error={!!errors.productModel}
              helperText={errors.productModel}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Product Description"
              value={formData.productDescription}
              onChange={handleInputChange("productDescription")}
              error={!!errors.productDescription}
              helperText={errors.productDescription}
            />
          </Grid>

          {editingProduct && (
            <Grid item xs={12}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={2}
                bgcolor="#e3f2fd"
                borderRadius={2}
              >
                <Typography variant="body2" color="primary" fontWeight="bold">
                  Editing: {editingProduct.productName}
                </Typography>
                <Button size="small" onClick={handleCancelEdit}>
                  Cancel Edit
                </Button>
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Box textAlign="center">
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
              >
                {editingProduct ? "Update Product" : "Register Product"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Card>

    {/* Table Card */}
    <Card
      sx={{
        p: 4,
        mt: 4,
        // boxShadow: 4,
        borderRadius: 3,
        background: "linear-gradient(135deg, #ffffff, #fafafa)",
        minHeight: "430px",
        width: "100%",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <InventoryIcon sx={{ mr: 2, color: "primary.main", fontSize: 28 }} />
        <Typography variant="h6" fontWeight="bold" color="primary">
          Registered Products ({registeredProducts.length})
        </Typography>
      </Box>

      {registeredProducts.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
          }}
        >
          <ProductIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Products Registered Yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Register your first product using the form above
          </Typography>
        </Paper>
      ) : (
        <DataGrid
          rows={registeredProducts}
          columns={registeredProductsColumns}
          getRowId={(row) => row.id}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 500 } },
          }}
          autoHeight
          pageSizeOptions={[5, 10, 25, 50]}
        />
      )}
    </Card>

    {/* Snackbar */}
    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={handleCloseSnackbar}
        severity={snackbar.severity}
        sx={{ borderRadius: 2 }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  </Container>
);

};

export default ProductRegistration;

