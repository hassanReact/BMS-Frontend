// import { useEffect, useState, useMemo } from 'react';
// import {
//   Card, CardContent, Typography, TextField, FormControl, FormLabel, RadioGroup,
//   FormControlLabel, Radio, Box, Button, Paper, Grid, Autocomplete, Table, TableBody,
//   TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip
// } from '@mui/material';
// import {
//   ShoppingCart, Person, Business, Save, Delete, Edit
// } from '@mui/icons-material';
// import { getApi, postApi, deleteApi, updateApi } from '@/core/apis/api';
// import { urls } from '@/core/Constant/urls';
// import { tokenPayload } from '@/helper';

// const defaultForm = {
//   productId: '', productName: '', quantity: '', usedFor: 'general',
//   generalInput: '', residentId: '', residentName: "", billingType: 'foc', price: '', description: ''
// };

// const ProductUseComponent = () => {
//   const [formData, setFormData] = useState(defaultForm);
//   const [dropdowns, setDropdowns] = useState({ products: [], residents: [] });
//   const [usageRecords, setUsageRecords] = useState([]);
//   const [editModeId, setEditModeId] = useState(null);
//   const token = tokenPayload()
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await getApi(`${urls.Inventory.dropDowns}?companyId=${token._id}`);
//         setDropdowns({
//           products: res.data.productName.map(p => ({ label: p.productName, id: p._id })),
//           residents: res.data.residents.map(r => ({ label: r.tenantName, id: r._id, address: r.address, phoneNo: r.phoneno }))
//         });
//       } catch (error) {
//         console.error('Dropdown fetch failed:', error);
//       }
//     })();
//     fetchUsages();
//   }, []);

//   const fetchUsages = async () => {
//     try {
//       const { data } = await getApi(`${urls.Inventory.getAllUsage}?companyId=${token._id}`);
//       setUsageRecords(data || []);
//     } catch (error) {
//       console.error('Fetching usages failed:', error);
//     }
//   };

//   const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

//   const handleAutoChange = (fieldId, fieldName, option) => {
//     setFormData(prev => ({
//       ...prev,
//       [fieldId]: option?.id || '',
//       [fieldName]: option?.label || ''
//     }));
//   };

//   const resetForm = () => {
//     setFormData(defaultForm);
//     setEditModeId(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const payload = {
//       ...formData,
//       ...(formData.usedFor === 'resident' ? { residentId: formData.residentId, residentName: formData.residentName } : { generalInput: formData.generalInput }),
//       ...(formData.billingType === 'price' ? { price: formData.price } : {})
//     };
//     try {
//       if (editModeId) await updateApi(`${urls.Inventory.editUsageDetails}/${editModeId}`, payload);
//       else await postApi(`${urls.Inventory.usageDetails}?companyId=${token._id}`, payload);
//       fetchUsages();
//       resetForm();
//     } catch (error) {
//       console.error('Submit failed:', error);
//     }
//   };

//   const handleEdit = (row) => {
//     setFormData({
//       productId: row.productId, productName: row.productName,
//       quantity: row.productQuantity, usedFor: row.usedFor,
//       generalInput: row.generalDescription || '',
//       residentId: row.residentId?._id || '',
//       billingType: row.billingType,
//       price: row.productPrice || '',
//       description: row.focDescription || row.priceDescription || ''
//     });
//     setEditModeId(row._id);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteApi(`${urls.Inventory.deleteUsageDetails}/${id}`);
//       fetchUsages();
//     } catch (error) {
//       console.error('Delete failed:', error);
//     }
//   };

//   const inputStyling = {
//     '& .MuiOutlinedInput-root': {
//       '&:hover fieldset': {
//         borderColor: '#667eea'
//       },
//       '&.Mui-focused fieldset': {
//         borderColor: '#667eea'
//       }
//     }
//   };

//   const total = useMemo(() => (+formData.quantity * +formData.price).toFixed(2), [formData.quantity, formData.price]);

//   return (
//     <>
//       <Paper elevation={3} sx={{ maxWidth: 800, mx: 'auto', mt: 3, borderRadius: 3, overflow: 'hidden' }}>
//         <Box sx={{ p: 3, bgcolor: "primARY", color: 'primary' }}>
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             {/* <ShoppingCart sx={{ mr: 2, fontSize: 32 }} /> */}
//             <Typography variant="h4" fontWeight="bold">Product Usage Form</Typography>
//           </Box>
//         </Box>

//         <Card sx={{ m: 3, mt: 0, borderRadius: 2 }}>
//           <CardContent>
//             <form onSubmit={handleSubmit}>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} sm={6}>
//                   <Autocomplete
//                     options={dropdowns.products}
//                     getOptionLabel={(opt) => opt.label || ''}
//                     onChange={(e, val) => handleAutoChange('productId', 'productName', val)}
//                     value={dropdowns.products.find(p => p.id === formData.productId) || null}
//                     renderInput={(params) => <TextField {...params} label="Product" required sx={inputStyling} />} />
//                 </Grid>

//                 <Grid item xs={12} sm={6}>
//                   <TextField fullWidth label="Quantity" type="number" value={formData.quantity} required
//                     onChange={(e) => handleChange('quantity', e.target.value)} sx={inputStyling} />
//                 </Grid>

//                 <Grid item xs={12}>
//                   <FormControl>
//                     <FormLabel>Used For</FormLabel>
//                     <RadioGroup row value={formData.usedFor} onChange={(e) => handleChange('usedFor', e.target.value)}>
//                       <FormControlLabel value="general" control={<Radio />} label={<Box display="flex" alignItems="center"><Business sx={{ mr: 1 }} />General</Box>} />
//                       <FormControlLabel value="resident" control={<Radio />} label={<Box display="flex" alignItems="center"><Person sx={{ mr: 1 }} />Resident</Box>} />
//                     </RadioGroup>
//                     {formData.usedFor === 'general' ? (
//                       <TextField fullWidth label="General Description" value={formData.generalInput}
//                         onChange={(e) => handleChange('generalInput', e.target.value)} sx={{ mt: 2, ...inputStyling }} />
//                     ) : (
//                       <Autocomplete
//                         options={dropdowns.residents}
//                         getOptionLabel={(opt) => opt.label || ''}
//                         onChange={(e, val) => handleAutoChange('residentId', 'residentName', val)}
//                         value={dropdowns.residents.find(r => r.id === formData.residentId) || null}
//                         renderOption={(props, option) => (
//                           <Box component="li" {...props} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
//                             <Typography fontWeight="bold">{option.label}</Typography>
//                             <Typography variant="body2" color="text.secondary">
//                               {option.address}
//                             </Typography>
//                             <Typography variant="body2" color="text.secondary">
//                               📞 {option.phoneNo}
//                             </Typography>
//                           </Box>
//                         )}
//                         renderInput={(params) => <TextField {...params} label="Resident" sx={inputStyling} />}
//                       />
//                     )}
//                   </FormControl>
//                 </Grid>

//                 <Grid item xs={12}>
//                   <FormControl>
//                     <FormLabel>Billing Type</FormLabel>
//                     <RadioGroup row value={formData.billingType} onChange={(e) => handleChange('billingType', e.target.value)}>
//                       <FormControlLabel value="foc" control={<Radio />} label="FOC (Free of Cost)" />
//                       <FormControlLabel value="price" control={<Radio />} label="Price (Generate Bill)" />
//                     </RadioGroup>
//                   </FormControl>
//                 </Grid>

//                 {formData.billingType === 'price' && (
//                   <Grid item xs={12} md={6}>
//                     <TextField fullWidth label="Product Price" type="number" value={formData.price}
//                       onChange={(e) => handleChange('price', e.target.value)} sx={inputStyling} required />
//                   </Grid>
//                 )}

//                 <Grid item xs={12} md={formData.billingType === 'price' ? 6 : 12}>
//                   <TextField fullWidth multiline label="Description" value={formData.description}
//                     onChange={(e) => handleChange('description', e.target.value)} rows={2} sx={inputStyling} />
//                 </Grid>

//                 {formData.billingType === 'price' && formData.price && formData.quantity && (
//                   <Grid item xs={12}>
//                     <Paper sx={{ p: 2, bgcolor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
//                       <Typography variant="h6">📋 Bill Preview</Typography>
//                       <Box display="flex" justifyContent="space-between"><Typography>Qty: {formData.quantity}</Typography><Typography>Total: Rs. {total}</Typography></Box>
//                     </Paper>
//                   </Grid>
//                 )}

//                 {formData.billingType === 'foc' && (
//                   <Grid item xs={12}>
//                     <Paper sx={{ p: 2, bgcolor: "blue", color: 'white', textAlign: 'center' }}>
//                       <Typography variant="h6">✅ Free of Cost - No Bill Generated</Typography>
//                     </Paper>
//                   </Grid>
//                 )}

//                 <Grid item xs={12}>
//                   <Box display="flex" justifyContent="flex-end" gap={2}>
//                     <Button variant="outlined" onClick={resetForm}>Reset</Button>
//                     <Button variant="contained" type="submit" startIcon={<Save />}>
//                       {formData.billingType === 'price' ? 'Save & Generate Bill' : 'Save'}
//                     </Button>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </form>
//           </CardContent>
//         </Card>
//       </Paper>

//       <Paper elevation={3} sx={{ maxWidth: 1100, mx: 'auto', my: 4, p: 3, borderRadius: 3 }}>
//         <Typography variant="h6" gutterBottom fontWeight="bold">All Product Usage Records</Typography>
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>#</TableCell>
//                 <TableCell>Product</TableCell>
//                 <TableCell>Qty</TableCell>
//                 <TableCell>Used For</TableCell>
//                 <TableCell>Billing</TableCell>
//                 <TableCell>Price</TableCell>
//                 <TableCell>Description</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {usageRecords.length === 0 ? (
//                 <TableRow><TableCell colSpan={8} align="center">No usage records found.</TableCell></TableRow>
//               ) : usageRecords.map((row, i) => (
//                 <TableRow key={row._id}>
//                   <TableCell>{i + 1}</TableCell>
//                   <TableCell>{row.productName}</TableCell>
//                   <TableCell>{row.productQuantity}</TableCell>
//                   <TableCell>{row.usedFor === 'general' ? 'General' : row.residentId?.tenantName}</TableCell>
//                   <TableCell>{row.billingType.toUpperCase()}</TableCell>
//                   <TableCell>{row.billingType === 'price' ? `Rs. ${row.productPrice}` : 'FOC'}</TableCell>
//                   <TableCell>{row.billingType === 'foc' ? row.focDescription : row.priceDescription}</TableCell>
//                   <TableCell>
//                     <Tooltip title="Edit"><IconButton onClick={() => handleEdit(row)}><Edit color="primary" /></IconButton></Tooltip>
//                     <Tooltip title="Delete"><IconButton onClick={() => handleDelete(row._id)}><Delete color="error" /></IconButton></Tooltip>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>
//     </>
//   );
// };

// export default ProductUseComponent;






// // import React, { useState } from "react";
// // import {
// //   Container,
// //   Card,
// //   Box,
// //   Typography,
// //   Grid,
// //   TextField,
// //   Button,
// //   Snackbar,
// //   Alert,
// //   Tooltip,
// //   IconButton,
// //   Paper,
// // } from "@mui/material";
// // import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// // import SaveIcon from "@mui/icons-material/Save";
// // import InventoryIcon from "@mui/icons-material/Inventory";
// // import NoteIcon from "@mui/icons-material/Note";

// // const ProductUseComponent = () => {
// //   const [formData, setFormData] = useState({
// //     productName: "",
// //     usageDescription: "",
// //   });

// //   const [errors, setErrors] = useState({});
// //   const [productUses, setProductUses] = useState([]);
// //   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

// //   const handleInputChange = (field) => (event) => {
// //     setFormData({ ...formData, [field]: event.target.value });
// //   };

// //   const handleSubmit = (event) => {
// //     event.preventDefault();

// //     let newErrors = {};
// //     if (!formData.productName) newErrors.productName = "Product Name is required";
// //     if (!formData.usageDescription) newErrors.usageDescription = "Usage Description is required";

// //     if (Object.keys(newErrors).length > 0) {
// //       setErrors(newErrors);
// //       return;
// //     }

// //     setProductUses([
// //       ...productUses,
// //       { id: productUses.length + 1, ...formData },
// //     ]);
// //     setFormData({ productName: "", usageDescription: "" });
// //     setErrors({});
// //     setSnackbar({ open: true, message: "Product use registered successfully!", severity: "success" });
// //   };

// //   const handleCloseSnackbar = () => {
// //     setSnackbar({ ...snackbar, open: false });
// //   };

// //   // DataGrid columns
// //   const productUseColumns = [
// //     { field: "id", headerName: "ID", width: 90 },
// //     { field: "productName", headerName: "Product Name", flex: 1 },
// //     { field: "usageDescription", headerName: "Usage Description", flex: 2 },
// //   ];

// //   return (
// //     <Container maxWidth="xl">
// //       {/* Form Card */}
// //       <Card
// //         sx={{
// //           p: 4,
// //           mt: 2,
// //           boxShadow: 4,
// //           borderRadius: 3,
// //           background: "linear-gradient(135deg, #ffffff, #fafafa)",
// //           minHeight: "400px",
// //           width: "100%",
// //         }}
// //       >
// //         <Box sx={{ mb: 3, textAlign: "center", borderBottom: "2px solid #eee", pb: 2 }}>
// //           <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main", fontSize: "24px" }} gutterBottom>
// //             Product Use
// //           </Typography>
// //           <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
// //             Register product usage details for tracking and analysis
// //           </Typography>
// //         </Box>

// //         <Box component="form" onSubmit={handleSubmit} noValidate>
// //           <Grid container spacing={3}>
// //             <Grid item xs={12} md={6}>
// //               <TextField
// //                 fullWidth
// //                 label="Product Name"
// //                 value={formData.productName}
// //                 onChange={handleInputChange("productName")}
// //                 error={!!errors.productName}
// //                 helperText={errors.productName}
// //               />
// //             </Grid>
// //             <Grid item xs={12} md={6}>
// //               <TextField
// //                 fullWidth
// //                 label="Usage Description"
// //                 value={formData.usageDescription}
// //                 onChange={handleInputChange("usageDescription")}
// //                 error={!!errors.usageDescription}
// //                 helperText={errors.usageDescription}
// //               />
// //             </Grid>
// //             <Grid item xs={12}>
// //               <Box textAlign="center">
// //                 <Button type="submit" variant="contained" size="large" startIcon={<SaveIcon />}>
// //                   Register Use
// //                 </Button>
// //               </Box>
// //             </Grid>
// //           </Grid>
// //         </Box>
// //       </Card>

// //       {/* Table Card */}
// //       <Card
// //         sx={{
// //           p: 4,
// //           mt: 4,
// //           boxShadow: 4,
// //           borderRadius: 3,
// //           background: "linear-gradient(135deg, #ffffff, #fafafa)",
// //           minHeight: "400px",
// //           width: "100%",
// //         }}
// //       >
// //         <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
// //           <NoteIcon sx={{ mr: 2, color: "primary.main", fontSize: 28 }} />
// //           <Typography variant="h6" fontWeight="bold" color="primary">
// //             Product Usage Records ({productUses.length})
// //           </Typography>
// //         </Box>

// //         {productUses.length === 0 ? (
// //           <Paper sx={{ p: 4, textAlign: "center", backgroundColor: "#f5f5f5", borderRadius: 2 }}>
// //             <InventoryIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
// //             <Typography variant="h6" color="text.secondary" gutterBottom>
// //               No Usage Records Yet
// //             </Typography>
// //             <Typography variant="body2" color="text.secondary">
// //               Register product usage using the form above
// //             </Typography>
// //           </Paper>
// //         ) : (
// //           <DataGrid
// //             rows={productUses}
// //             columns={productUseColumns}
// //             getRowId={(row) => row.id}
// //             slots={{ toolbar: GridToolbar }}
// //             slotProps={{
// //               toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 500 } },
// //             }}
// //             autoHeight
// //             pageSizeOptions={[5, 10, 25]}
// //           />
// //         )}
// //       </Card>

// //       {/* Snackbar */}
// //       <Snackbar
// //         open={snackbar.open}
// //         autoHideDuration={4000}
// //         onClose={handleCloseSnackbar}
// //         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
// //       >
// //         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ borderRadius: 2 }}>
// //           {snackbar.message}
// //         </Alert>
// //       </Snackbar>
// //     </Container>
// //   );
// // };

// // export default ProductUseComponent;


import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Button,
  Paper,
  Grid,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import { Save, Delete, Edit, Business, Person, Inventory } from "@mui/icons-material";
import { getApi, postApi, deleteApi, updateApi } from "@/core/apis/api";
import { urls } from "@/core/Constant/urls";
import { tokenPayload } from "@/helper";

const defaultForm = {
  productId: "",
  productName: "",
  quantity: "",
  usedFor: "general",
  generalInput: "",
  residentId: "",
  residentName: "",
  billingType: "foc",
  price: "",
  description: "",
};

const ProductUseComponent = () => {
  const [formData, setFormData] = useState(defaultForm);
  const [dropdowns, setDropdowns] = useState({ products: [], residents: [] });
  const [usageRecords, setUsageRecords] = useState([]);
  const [editModeId, setEditModeId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const token = tokenPayload();

  useEffect(() => {
    (async () => {
      try {
        const res = await getApi(`${urls.Inventory.dropDowns}?companyId=${token._id}`);
        setDropdowns({
          products: res.data.productName.map((p) => ({ label: p.productName, id: p._id })),
          residents: res.data.residents.map((r) => ({
            label: r.tenantName,
            id: r._id,
            address: r.address,
            phoneNo: r.phoneno,
          })),
        });
      } catch (error) {
        console.error("Dropdown fetch failed:", error);
      }
    })();
    fetchUsages();
  }, []);

  const fetchUsages = async () => {
    try {
      const { data } = await getApi(`${urls.Inventory.getAllUsage}?companyId=${token._id}`);
      setUsageRecords(data || []);
    } catch (error) {
      console.error("Fetching usages failed:", error);
    }
  };

  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleAutoChange = (fieldId, fieldName, option) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: option?.id || "",
      [fieldName]: option?.label || "",
    }));
  };

  const resetForm = () => {
    setFormData(defaultForm);
    setEditModeId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      ...(formData.usedFor === "resident"
        ? { residentId: formData.residentId, residentName: formData.residentName }
        : { generalInput: formData.generalInput }),
      ...(formData.billingType === "price" ? { price: formData.price } : {}),
    };
    try {
      if (editModeId) {
        await updateApi(`${urls.Inventory.editUsageDetails}/${editModeId}`, payload);
        setSnackbar({ open: true, message: "Usage updated successfully!", severity: "success" });
      } else {
        await postApi(`${urls.Inventory.usageDetails}?companyId=${token._id}`, payload);
        setSnackbar({ open: true, message: "Usage saved successfully!", severity: "success" });
      }
      fetchUsages();
      resetForm();
    } catch (error) {
      console.error("Submit failed:", error);
      setSnackbar({ open: true, message: "Failed to save usage", severity: "error" });
    }
  };

  const handleEdit = (row) => {
    setFormData({
      productId: row.productId,
      productName: row.productName,
      quantity: row.productQuantity,
      usedFor: row.usedFor,
      generalInput: row.generalDescription || "",
      residentId: row.residentId?._id || "",
      billingType: row.billingType,
      price: row.productPrice || "",
      description: row.focDescription || row.priceDescription || "",
    });
    setEditModeId(row._id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteApi(`${urls.Inventory.deleteUsageDetails}/${id}`);
      fetchUsages();
      setSnackbar({ open: true, message: "Usage deleted", severity: "info" });
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const total = useMemo(
    () => (+formData.quantity * +formData.price).toFixed(2),
    [formData.quantity, formData.price]
  );

  return (
    <Container maxWidth="xl">
      {/* Form Card */}
      <Card
        sx={{
          p: 0,
          mt: 0,
          // boxShadow: 1,
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
            Product Usage
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
            {editModeId
              ? "Update existing product usage details"
              : "Record new product usage details"}
          </Typography>
        </Box>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={dropdowns.products}
                getOptionLabel={(opt) => opt.label || ""}
                onChange={(e, val) => handleAutoChange("productId", "productName", val)}
                value={dropdowns.products.find((p) => p.id === formData.productId) || null}
                renderInput={(params) => <TextField {...params} label="Product" required />}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={formData.quantity}
                required
                onChange={(e) => handleChange("quantity", e.target.value)}
              />
            </Grid>

            {/* Used For */}
            <Grid item xs={12}>
              <FormControl>
                <FormLabel>Used For</FormLabel>
                <RadioGroup
                  row
                  value={formData.usedFor}
                  onChange={(e) => handleChange("usedFor", e.target.value)}
                >
                  <FormControlLabel
                    value="general"
                    control={<Radio />}
                    label={
                      <Box display="flex" alignItems="center">
                        <Business sx={{ mr: 1 }} /> General
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="resident"
                    control={<Radio />}
                    label={
                      <Box display="flex" alignItems="center">
                        <Person sx={{ mr: 1 }} /> Resident
                      </Box>
                    }
                  />
                </RadioGroup>

                {formData.usedFor === "general" ? (
                  <TextField
                    fullWidth
                    label="General Description"
                    value={formData.generalInput}
                    onChange={(e) => handleChange("generalInput", e.target.value)}
                    sx={{ mt: 2 }}
                  />
                ) : (
                  <Autocomplete
                    options={dropdowns.residents}
                    getOptionLabel={(opt) => opt.label || ""}
                    onChange={(e, val) => handleAutoChange("residentId", "residentName", val)}
                    value={dropdowns.residents.find((r) => r.id === formData.residentId) || null}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        {...props}
                        sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
                      >
                        <Typography fontWeight="bold">{option.label}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {option.address}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          📞 {option.phoneNo}
                        </Typography>
                      </Box>
                    )}
                    renderInput={(params) => <TextField {...params} label="Resident" />}
                  />
                )}
              </FormControl>
            </Grid>

            {/* Billing Type */}
            <Grid item xs={12}>
              <FormControl>
                <FormLabel>Billing Type</FormLabel>
                <RadioGroup
                  row
                  value={formData.billingType}
                  onChange={(e) => handleChange("billingType", e.target.value)}
                >
                  <FormControlLabel value="foc" control={<Radio />} label="FOC (Free of Cost)" />
                  <FormControlLabel value="price" control={<Radio />} label="Price (Generate Bill)" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {formData.billingType === "price" && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Product Price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  required
                />
              </Grid>
            )}

            <Grid item xs={12} md={formData.billingType === "price" ? 6 : 12}>
              <TextField
                fullWidth
                multiline
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={2}
              />
            </Grid>

            {/* Bill Preview */}
            {formData.billingType === "price" && formData.price && formData.quantity && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: "#e3f2fd", color: "primary.main" }}>
                  <Typography variant="h6">📋 Bill Preview</Typography>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>Qty: {formData.quantity}</Typography>
                    <Typography>Total: Rs. {total}</Typography>
                  </Box>
                </Paper>
              </Grid>
            )}

            {formData.billingType === "foc" && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: "#f5f5f5", textAlign: "center" }}>
                  <Typography variant="h6">Free of Cost - No Bill Generated</Typography>
                </Paper>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box textAlign="center">
                <Button type="submit" variant="contained" startIcon={<Save />}>
                  {editModeId ? "Update Usage" : "Save Usage"}
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
          //boxShadow: 2,
          borderRadius: 3,
          background: "linear-gradient(135deg, #ffffff, #fafafa)",
          minHeight: "430px",
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Inventory sx={{ mr: 2, color: "primary.main", fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold" color="primary">
            Product Usage Records ({usageRecords.length})
          </Typography>
        </Box>

        {usageRecords.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              backgroundColor: "#f5f5f5",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Usage Records Yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add your first product usage using the form above
            </Typography>
          </Paper>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Used For</TableCell>
                  <TableCell>Billing</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usageRecords.map((row, i) => (
                  <TableRow key={row._id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{row.productName}</TableCell>
                    <TableCell>{row.productQuantity}</TableCell>
                    <TableCell>
                      {row.usedFor === "general" ? "General" : row.residentId?.tenantName}
                    </TableCell>
                    <TableCell>{row.billingType.toUpperCase()}</TableCell>
                    <TableCell>
                      {row.billingType === "price" ? `Rs. ${row.productPrice}` : "FOC"}
                    </TableCell>
                    <TableCell>
                      {row.billingType === "foc" ? row.focDescription : row.priceDescription}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(row)}>
                          <Edit color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(row._id)}>
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductUseComponent;
