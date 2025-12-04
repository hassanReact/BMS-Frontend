// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Container, Box, Typography, Grid, Card, CardContent, TextField, Button, Snackbar, Alert, Fade, Paper } from '@mui/material';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import VendorIcon from '@mui/icons-material/Store';
// import SaveIcon from '@mui/icons-material/Save';
// import InventoryIcon from '@mui/icons-material/Inventory';
// import { deleteApi, getApi, updateApi } from '@/core/apis/api';
// import { urls } from '@/core/Constant/urls';
// import { tokenPayload } from '@/helper';

// const VendorManagement = () => {
//   const [formData, setFormData] = useState({
//     vendorName: '',
//     vendorContact: '',
//     vendorEmail: '',
//     BankAccountNo: '',
//     productDescription: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [registeredVendors, setRegisteredVendors] = useState([]);
//   const [editingVendor, setEditingVendor] = useState(null);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [loading, setLoading] = useState(true);
//   const payload = tokenPayload();

//   useEffect(() => {
//     fetchVendors();
//   }, []);

//   const handleInputChange = (field) => (e) => {
//     setFormData({ ...formData, [field]: e.target.value });
//     setErrors({ ...errors, [field]: '' });
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.vendorName.trim()) newErrors.vendorName = 'Vendor name is required';
//     if (!formData.vendorContact.trim()) newErrors.vendorContact = 'Contact is required';
//     if (!formData.vendorEmail.trim()) newErrors.vendorEmail = 'Email is required';
//     if (!formData.BankAccountNo.trim()) newErrors.BankAccountNo = 'Account number is required';
//     // if (!formData.productDescription.trim()) newErrors.productDescription = 'Description is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const showSnackbar = (message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     const finalData = {
//       ...formData,
//       productDescription: !formData.productDescription || formData.productDescription === ""
//       ? "No description available"
//       : formData.productDescription
//     }

//     try {
//       if (editingVendor) {
//         const { _id, ...rest } = editingVendor;
//         await updateApi(`${urls.Vendors.editVendor}/${_id}`, finalData);
//         showSnackbar('Vendor updated successfully');
//       } else {
//         await axios.post(`${urls.Vendors.create}?companyId=${payload._id}`, finalData);
//         showSnackbar('Vendor registered successfully');
//       }

//       fetchVendors();
//       setFormData({
//         vendorName: '',
//         vendorContact: '',
//         vendorEmail: '',
//         BankAccountNo: '',
//         productDescription: ''
//       });
//       setEditingVendor(null);
//     } catch (error) {
//       const message = error.response?.data?.message || 'An error occurred';
//       showSnackbar(message, 'error');
//     }
//   };

//   const fetchVendors = async () => {
//     setLoading(true);
//     try {
//       const response = await getApi(`${urls.Vendors.getAllVendors}?companyId=${payload._id}`);
//       if (response.data.length === 0) {
//         showSnackbar('No vendors registered yet', 'info');
//       }
//       setRegisteredVendors(Array.isArray(response.data) ? response.data : []);
//     } catch (error) {
//       // showSnackbar('Failed to fetch vendors', 'error');
//       setRegisteredVendors([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (vendor) => {
//     setEditingVendor(vendor);
//     setFormData({
//       vendorName: vendor.vendorName,
//       vendorContact: vendor.vendorContact,
//       vendorEmail: vendor.vendorEmail,
//       BankAccountNo: vendor.vendorAccountNo,
//       productDescription: vendor.description
//     });
//   };

//   const handleCancelEdit = () => {
//     setEditingVendor(null);
//     setFormData({
//       vendorName: '',
//       vendorContact: '',
//       vendorEmail: '',
//       BankAccountNo: '',
//       productDescription: ''
//     });
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteApi(`${urls.Vendors.deleteVendor}/${id}`);
//       showSnackbar('Vendor deleted successfully');
//       setTimeout(fetchVendors, 200); // slight delay for better UX
//     } catch (error) {
//       const message = error.response?.data?.message || 'Failed to delete vendor';
//       showSnackbar(message, 'error');
//     }
//   };

//   if (loading) {
//     return <div>loading...</div>;
//   }

//   const registeredVendorsColumns = [
//     { field: 'vendorName', headerName: 'Name', flex: 1 },
//     { field: 'vendorContact', headerName: 'Contact', flex: 1 },
//     { field: 'vendorEmail', headerName: 'Email', flex: 1 },
//     { field: 'vendorAccountNo', headerName: 'Account No', flex: 1 },
//     { field: 'description', headerName: 'Description', flex: 1.5 },
//     {
//       field: 'actions',
//       headerName: 'Actions',
//       sortable: false,
//       flex: 1,
//       renderCell: (params) => (
//         <Box>
//           <Button size="small" onClick={() => handleEdit(params.row)} sx={{ mr: 1 }}>
//             Edit
//           </Button>
//           <Button size="small" color="error" onClick={() => handleDelete(params.row._id)}>
//             Delete
//           </Button>
//         </Box>
//       )
//     }
//   ];

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       <Fade in={true} timeout={800}>
//         <Box>
//           {/* Header */}
//           <Box textAlign="center" mb={4}>
//             {/* <VendorIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} /> */}
//             <Typography
//               variant="h3"
//               component="h1"
//               gutterBottom
//               sx={{
//                 fontWeight: 700,
//                 background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
//                 backgroundClip: 'text',
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent'
//               }}
//             >
//               Vendor Management
//             </Typography>
//             <Typography variant="h6" color="text.secondary" sx={{ marginBottom: '40px' }}>
//               {editingVendor ? 'Update vendor information' : 'Register new vendors with complete details'}
//             </Typography>
//           </Box>

//           {/* Form */}
//           <Grid container spacing={4}>
//             <Grid item xs={12}>
//               <Card
//                 elevation={8}
//                 sx={{
//                   borderRadius: 3,
//                   background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
//                   border: '1px solid',
//                   borderColor: 'divider'
//                 }}
//               >
//                 <CardContent sx={{ p: 4 }}>
//                   {editingVendor && (
//                     <Box sx={{ mb: 3, p: 2, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
//                       <Typography variant="body2" color="primary" fontWeight="bold">
//                         Editing: {editingVendor.vendorName}
//                       </Typography>
//                       <Button size="small" onClick={handleCancelEdit} sx={{ mt: 1 }}>
//                         Cancel Edit
//                       </Button>
//                     </Box>
//                   )}

//                   <form onSubmit={handleSubmit}>
//                     <Grid container spacing={3}>
//                       {/* Form Fields */}
//                       {[
//                         { label: 'Vendor Name', field: 'vendorName' },
//                         { label: 'Vendor Contact', field: 'vendorContact' },
//                         { label: 'Vendor Email', field: 'vendorEmail', type: 'email' },
//                         { label: 'Bank Account Number', field: 'BankAccountNo' }
//                       ].map(({ label, field, type = 'text' }) => (
//                         <Grid item xs={12} md={6} key={field}>
//                           <TextField
//                             fullWidth
//                             label={label}
//                             type={type}
//                             value={formData[field]}
//                             onChange={handleInputChange(field)}
//                             error={!!errors[field]}
//                             helperText={errors[field]}
//                             variant="outlined"
//                           />
//                         </Grid>
//                       ))}

//                       <Grid item xs={12}>
//                         <TextField
//                           fullWidth
//                           label="Product Description"
//                           value={formData.productDescription}
//                           onChange={handleInputChange('productDescription')}
//                           error={!!errors.productDescription}
//                           helperText={errors.productDescription}
//                           variant="outlined"
//                           multiline
//                           rows={4}
//                         />
//                       </Grid>

//                       <Grid item xs={12}>
//                         <Box display="flex" justifyContent="center">
//                           <Button type="submit" variant="contained" size="large" startIcon={<SaveIcon />}>
//                             {editingVendor ? 'Update Vendor' : 'Register Vendor'}
//                           </Button>
//                         </Box>
//                       </Grid>
//                     </Grid>
//                   </form>
//                 </CardContent>
//               </Card>
//             </Grid>

//             {/* Table */}
//             <Grid item xs={12}>
//               <Card
//                 elevation={8}
//                 sx={{
//                   borderRadius: 3,
//                   background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
//                   border: '1px solid',
//                   borderColor: 'divider'
//                 }}
//               >
//                 <CardContent sx={{ p: 4 }}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                     <InventoryIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
//                     <Typography variant="h5" fontWeight="bold" color="primary">
//                       Registered Vendors ({registeredVendors.length})
//                     </Typography>
//                   </Box>

//                   {registeredVendors.length === 0 ? (
//                     <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: 2 }}>
//                       <VendorIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
//                       <Typography variant="h6" color="text.secondary">
//                         No Vendors Registered Yet
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Register your first vendor using the form above
//                       </Typography>
//                     </Paper>
//                   ) : (
//                     <DataGrid
//                       rows={registeredVendors}
//                       columns={registeredVendorsColumns}
//                       getRowId={(row) => row._id}
//                       slots={{ toolbar: GridToolbar }}
//                       slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 500 } } }}
//                       autoHeight
//                       pageSizeOptions={[5, 10, 25]}
//                     />
//                   )}
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </Box>
//       </Fade>

//       <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
//         <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} sx={{ width: '100%' }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default VendorManagement;







// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Container,
//   Box,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   TextField,
//   Button,
//   Snackbar,
//   Alert,
//   Paper,
// } from '@mui/material';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import VendorIcon from '@mui/icons-material/Store';
// import SaveIcon from '@mui/icons-material/Save';
// import InventoryIcon from '@mui/icons-material/Inventory';
// import { deleteApi, getApi, updateApi } from '@/core/apis/api';
// import { urls } from '@/core/Constant/urls';
// import { tokenPayload } from '@/helper';

// const VendorManagement = () => {
//   const [formData, setFormData] = useState({
//     vendorName: '',
//     vendorContact: '',
//     vendorEmail: '',
//     BankAccountNo: '',
//     productDescription: '',
//   });

//   const [errors, setErrors] = useState({});
//   const [registeredVendors, setRegisteredVendors] = useState([]);
//   const [editingVendor, setEditingVendor] = useState(null);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [loading, setLoading] = useState(true);
//   const payload = tokenPayload();

//   useEffect(() => {
//     fetchVendors();
//   }, []);

//   const handleInputChange = (field) => (e) => {
//     setFormData({ ...formData, [field]: e.target.value });
//     setErrors({ ...errors, [field]: '' });
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.vendorName.trim()) newErrors.vendorName = 'Vendor name is required';
//     if (!formData.vendorContact.trim()) newErrors.vendorContact = 'Contact is required';
//     if (!formData.vendorEmail.trim()) newErrors.vendorEmail = 'Email is required';
//     if (!formData.BankAccountNo.trim()) newErrors.BankAccountNo = 'Account number is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const showSnackbar = (message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     const finalData = {
//       ...formData,
//       productDescription:
//         !formData.productDescription || formData.productDescription === ''
//           ? 'No description available'
//           : formData.productDescription,
//     };

//     try {
//       if (editingVendor) {
//         const { _id, ...rest } = editingVendor;
//         await updateApi(`${urls.Vendors.editVendor}/${_id}`, finalData);
//         showSnackbar('Vendor updated successfully');
//       } else {
//         await axios.post(`${urls.Vendors.create}?companyId=${payload._id}`, finalData);
//         showSnackbar('Vendor registered successfully');
//       }

//       fetchVendors();
//       setFormData({
//         vendorName: '',
//         vendorContact: '',
//         vendorEmail: '',
//         BankAccountNo: '',
//         productDescription: '',
//       });
//       setEditingVendor(null);
//     } catch (error) {
//       const message = error.response?.data?.message || 'An error occurred';
//       showSnackbar(message, 'error');
//     }
//   };

//   const fetchVendors = async () => {
//     setLoading(true);
//     try {
//       const response = await getApi(`${urls.Vendors.getAllVendors}?companyId=${payload._id}`);
//       if (response.data.length === 0) {
//         showSnackbar('No vendors registered yet', 'info');
//       }
//       setRegisteredVendors(Array.isArray(response.data) ? response.data : []);
//     } catch {
//       setRegisteredVendors([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (vendor) => {
//     setEditingVendor(vendor);
//     setFormData({
//       vendorName: vendor.vendorName,
//       vendorContact: vendor.vendorContact,
//       vendorEmail: vendor.vendorEmail,
//       BankAccountNo: vendor.vendorAccountNo,
//       productDescription: vendor.description,
//     });
//   };

//   const handleCancelEdit = () => {
//     setEditingVendor(null);
//     setFormData({
//       vendorName: '',
//       vendorContact: '',
//       vendorEmail: '',
//       BankAccountNo: '',
//       productDescription: '',
//     });
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteApi(`${urls.Vendors.deleteVendor}/${id}`);
//       showSnackbar('Vendor deleted successfully');
//       setTimeout(fetchVendors, 200);
//     } catch (error) {
//       const message = error.response?.data?.message || 'Failed to delete vendor';
//       showSnackbar(message, 'error');
//     }
//   };

//   if (loading) {
//     return <div>loading...</div>;
//   }

//   const registeredVendorsColumns = [
//     { field: 'vendorName', headerName: 'Name', flex: 1 },
//     { field: 'vendorContact', headerName: 'Contact', flex: 1 },
//     { field: 'vendorEmail', headerName: 'Email', flex: 1 },
//     { field: 'vendorAccountNo', headerName: 'Account No', flex: 1 },
//     { field: 'description', headerName: 'Description', flex: 1.5 },
//     {
//       field: 'actions',
//       headerName: 'Actions',
//       sortable: false,
//       flex: 1,
//       renderCell: (params) => (
//         <Box>
//           <Button size="small" onClick={() => handleEdit(params.row)} sx={{ mr: 1 }}>
//             Edit
//           </Button>
//           <Button size="small" color="error" onClick={() => handleDelete(params.row._id)}>
//             Delete
//           </Button>
//         </Box>
//       ),
//     },
//   ];

//   return (
//     <Container maxWidth="xl">
//       {/* Form Card */}
//       <Card
//         sx={{
//           p: 4,
//           mt: 2,
//           boxShadow: 4,
//           borderRadius: 3,
//           background: 'linear-gradient(135deg, #ffffff, #fafafa)',
//           minHeight: '450px',
//           width: '100%',
//         }}
//       >
//         {/* Header */}
//         <Box sx={{ mb: 3, textAlign: 'center', borderBottom: '2px solid #eee', pb: 2 }}>
//           <Typography
//             variant="h4"
//             sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '24px' }}
//             gutterBottom
//           >
//             Vendor Management
//           </Typography>
//           <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
//             {editingVendor ? 'Update vendor information' : 'Register new vendors with complete details'}
//           </Typography>
//         </Box>

//         {/* Form */}
//         <Box component="form" onSubmit={handleSubmit} noValidate>
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Vendor Name"
//                 value={formData.vendorName}
//                 onChange={handleInputChange('vendorName')}
//                 error={!!errors.vendorName}
//                 helperText={errors.vendorName}
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Vendor Contact"
//                 value={formData.vendorContact}
//                 onChange={handleInputChange('vendorContact')}
//                 error={!!errors.vendorContact}
//                 helperText={errors.vendorContact}
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Vendor Email"
//                 type="email"
//                 value={formData.vendorEmail}
//                 onChange={handleInputChange('vendorEmail')}
//                 error={!!errors.vendorEmail}
//                 helperText={errors.vendorEmail}
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Bank Account Number"
//                 value={formData.BankAccountNo}
//                 onChange={handleInputChange('BankAccountNo')}
//                 error={!!errors.BankAccountNo}
//                 helperText={errors.BankAccountNo}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 multiline
//                 rows={3}
//                 label="Product Description"
//                 value={formData.productDescription}
//                 onChange={handleInputChange('productDescription')}
//                 error={!!errors.productDescription}
//                 helperText={errors.productDescription}
//               />
//             </Grid>

//             {editingVendor && (
//               <Grid item xs={12}>
//                 <Box
//                   display="flex"
//                   justifyContent="space-between"
//                   alignItems="center"
//                   p={2}
//                   bgcolor="#e3f2fd"
//                   borderRadius={2}
//                 >
//                   <Typography variant="body2" color="primary" fontWeight="bold">
//                     Editing: {editingVendor.vendorName}
//                   </Typography>
//                   <Button size="small" onClick={handleCancelEdit}>
//                     Cancel Edit
//                   </Button>
//                 </Box>
//               </Grid>
//             )}

//             <Grid item xs={12}>
//               <Box textAlign="center">
//                 <Button type="submit" variant="contained" size="large" startIcon={<SaveIcon />}>
//                   {editingVendor ? 'Update Vendor' : 'Register Vendor'}
//                 </Button>
//               </Box>
//             </Grid>
//           </Grid>
//         </Box>
//       </Card>

//       {/* Table Card */}
//       <Card
//         sx={{
//           p: 4,
//           mt: 4,
//           boxShadow: 4,
//           borderRadius: 3,
//           background: 'linear-gradient(135deg, #ffffff, #fafafa)',
//           minHeight: '430px',
//           width: '100%',
//         }}
//       >
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//           <InventoryIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
//           <Typography variant="h6" fontWeight="bold" color="primary">
//             Registered Vendors ({registeredVendors.length})
//           </Typography>
//         </Box>

//         {registeredVendors.length === 0 ? (
//           <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: 2 }}>
//             <VendorIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
//             <Typography variant="h6" color="text.secondary" gutterBottom>
//               No Vendors Registered Yet
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Register your first vendor using the form above
//             </Typography>
//           </Paper>
//         ) : (
//           <DataGrid
//             rows={registeredVendors}
//             columns={registeredVendorsColumns}
//             getRowId={(row) => row._id}
//             slots={{ toolbar: GridToolbar }}
//             slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 500 } } }}
//             autoHeight
//             pageSizeOptions={[5, 10, 25]}
//           />
//         )}
//       </Card>

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ borderRadius: 2 }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default VendorManagement;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Container, Box, Typography, Card, Button, Snackbar, Alert,
//   Stack, Paper, Dialog, DialogTitle, DialogContent, DialogActions,
//   TextField, Grid
// } from '@mui/material';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { IconHome } from '@tabler/icons';
// import StoreIcon from '@mui/icons-material/Store';
// import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import SaveIcon from '@mui/icons-material/Save';
// import { deleteApi, getApi, updateApi } from '@/core/apis/api';
// import { urls } from '@/core/Constant/urls';
// import { tokenPayload } from '@/helper';
// import { Link } from 'react-router-dom';

// const VendorManagement = () => {
//   const [formData, setFormData] = useState({
//     vendorName: '',
//     vendorContact: '',
//     vendorEmail: '',
//     BankAccountNo: '',
//     productDescription: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [registeredVendors, setRegisteredVendors] = useState([]);
//   const [editingVendor, setEditingVendor] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [loading, setLoading] = useState(true);
//   const payload = tokenPayload();

//   useEffect(() => {
//     fetchVendors();
//   }, []);

//   const handleInputChange = (field) => (e) => {
//     setFormData({ ...formData, [field]: e.target.value });
//     setErrors({ ...errors, [field]: '' });
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.vendorName.trim()) newErrors.vendorName = 'Vendor name is required';
//     if (!formData.vendorContact.trim()) newErrors.vendorContact = 'Contact is required';
//     if (!formData.vendorEmail.trim()) newErrors.vendorEmail = 'Email is required';
//     if (!formData.BankAccountNo.trim()) newErrors.BankAccountNo = 'Account number is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const showSnackbar = (message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     const finalData = {
//       ...formData,
//       productDescription: !formData.productDescription
//         ? 'No description available'
//         : formData.productDescription,
//     };

//     try {
//       if (editingVendor) {
//         const { _id } = editingVendor;
//         await updateApi(`${urls.Vendors.editVendor}/${_id}`, finalData);
//         showSnackbar('Vendor updated successfully');
//       } else {
//         await axios.post(`${urls.Vendors.create}?companyId=${payload._id}`, finalData);
//         showSnackbar('Vendor registered successfully');
//       }

//       fetchVendors();
//       handleCloseDialog();
//     } catch (error) {
//       const message = error.response?.data?.message || 'An error occurred';
//       showSnackbar(message, 'error');
//     }
//   };

//   const fetchVendors = async () => {
//     setLoading(true);
//     try {
//       const response = await getApi(`${urls.Vendors.getAllVendors}?companyId=${payload._id}`);
//       setRegisteredVendors(Array.isArray(response.data) ? response.data : []);
//     } catch {
//       setRegisteredVendors([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (vendor) => {
//     setEditingVendor(vendor);
//     setFormData({
//       vendorName: vendor.vendorName,
//       vendorContact: vendor.vendorContact,
//       vendorEmail: vendor.vendorEmail,
//       BankAccountNo: vendor.vendorAccountNo,
//       productDescription: vendor.description
//     });
//     setOpenDialog(true);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteApi(`${urls.Vendors.deleteVendor}/${id}`);
//       showSnackbar('Vendor deleted successfully');
//       fetchVendors();
//     } catch (error) {
//       const message = error.response?.data?.message || 'Failed to delete vendor';
//       showSnackbar(message, 'error');
//     }
//   };

//   const handleOpenDialog = () => {
//     setEditingVendor(null);
//     setFormData({ vendorName: '', vendorContact: '', vendorEmail: '', BankAccountNo: '', productDescription: '' });
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setEditingVendor(null);
//     setFormData({ vendorName: '', vendorContact: '', vendorEmail: '', BankAccountNo: '', productDescription: '' });
//     setOpenDialog(false);
//   };

//   if (loading) return <div>Loading...</div>;

//   const registeredVendorsColumns = [
//     { field: 'vendorName', headerName: 'Name', flex: 1 },
//     { field: 'vendorContact', headerName: 'Contact', flex: 1 },
//     { field: 'vendorEmail', headerName: 'Email', flex: 1 },
//     { field: 'vendorAccountNo', headerName: 'Account No', flex: 1 },
//     { field: 'description', headerName: 'Description', flex: 1.5 },
//     {
//       field: 'actions',
//       headerName: 'Actions',
//       flex: 1,
//       renderCell: (params) => (
//         <Stack direction="row" spacing={1}>
//           <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(params.row)}>
//             Edit
//           </Button>
//           <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(params.row._id)}>
//             Delete
//           </Button>
//         </Stack>
//       ),
//     },
//   ];

//   return (
//     <Container maxWidth="lg">
//       <Card
//         sx={{
//           p: 2,
//           mt: 2,
//           borderRadius: 3,
//           boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
//           display: "flex",
//           flexDirection: "column",
//           minHeight: "700px",
//         }}
//       >
//         {/* Header with Add Button */}
//         <Stack
//           direction="row"
//           alignItems="center"
//           justifyContent="space-between"
//           sx={{ mb: 2, pb: 1, borderBottom: "2px solid", borderColor: "divider" }}
//         >
//           <Stack direction="row" alignItems="center" spacing={1.5}>
//             <Box
//               sx={{
//                 width: 42,
//                 height: 42,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 borderRadius: "50%",
//                 backgroundColor: "rgba(25, 118, 210, 0.1)",
//               }}
//             >
//               <Link to="/" style={{ textDecoration: "none" }}>
//                 <IconHome style={{ color: "#1976d2", fontSize: "1.5rem" }} />
//               </Link>
//             </Box>
//             <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main", fontSize: "24px" }}>
//               Vendor Management
//             </Typography>
//           </Stack>
//           <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>
//             Add Vendor
//           </Button>
//         </Stack>

//         {/* Vendors Table */}
//         <Box sx={{ flexGrow: 1 }}>
//           {registeredVendors.length === 0 ? (
//             <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: 2 }}>
//               <StoreIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
//               <Typography variant="h6" color="text.secondary">
//                 No Vendors Registered Yet
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Register your first vendor using the button above
//               </Typography>
//             </Paper>
//           ) : (
//             <DataGrid
//               rows={registeredVendors}
//               columns={registeredVendorsColumns}
//               getRowId={(row) => row._id}
//               slots={{ toolbar: GridToolbar }}
//               slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 500 } } }}
//               sx={{
//                 border: "none",
//                 "& .MuiDataGrid-columnHeaders": {
//                   backgroundColor: "rgba(25, 118, 210, 0.08)",
//                   fontWeight: "bold",
//                 },
//               }}
//             />
//           )}
//         </Box>
//       </Card>

//       {/* Dialog for Add/Edit Vendor */}
//       <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
//         <DialogTitle>{editingVendor ? "Edit Vendor" : "Add Vendor"}</DialogTitle>
//         <DialogContent dividers>
//           <form onSubmit={handleSubmit}>
//             <Grid container spacing={2}>
//               {[
//                 { label: 'Vendor Name', field: 'vendorName' },
//                 { label: 'Vendor Contact', field: 'vendorContact' },
//                 { label: 'Vendor Email', field: 'vendorEmail', type: 'email' },
//                 { label: 'Bank Account Number', field: 'BankAccountNo' }
//               ].map(({ label, field, type = 'text' }) => (
//                 <Grid item xs={12} key={field}>
//                   <TextField
//                     fullWidth
//                     label={label}
//                     type={type}
//                     value={formData[field]}
//                     onChange={handleInputChange(field)}
//                     error={!!errors[field]}
//                     helperText={errors[field]}
//                   />
//                 </Grid>
//               ))}
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Product Description"
//                   value={formData.productDescription}
//                   onChange={handleInputChange('productDescription')}
//                   multiline
//                   rows={3}
//                 />
//               </Grid>
//             </Grid>
//           </form>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog}>Cancel</Button>
//           <Button onClick={handleSubmit} variant="contained" startIcon={<SaveIcon />}>
//             {editingVendor ? "Update Vendor" : "Save Vendor"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
//         <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} sx={{ width: '100%' }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default VendorManagement;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Container, Box, Typography, Card, Button, Snackbar, Alert,
//   Stack, Dialog, DialogTitle, DialogContent, DialogActions,
//   TextField, Grid
// } from '@mui/material';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { IconHome } from '@tabler/icons';
// import StoreIcon from '@mui/icons-material/Store';
// import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import SaveIcon from '@mui/icons-material/Save';
// import { deleteApi, getApi, updateApi } from '@/core/apis/api';
// import { urls } from '@/core/Constant/urls';
// import { tokenPayload } from '@/helper';
// import { Link } from 'react-router-dom';

// const VendorManagement = () => {
//   const [formData, setFormData] = useState({
//     vendorName: '',
//     vendorContact: '',
//     vendorEmail: '',
//     BankAccountNo: '',
//     productDescription: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [registeredVendors, setRegisteredVendors] = useState([]);
//   const [editingVendor, setEditingVendor] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [loading, setLoading] = useState(true);
//   const payload = tokenPayload();

//   useEffect(() => {
//     fetchVendors();
//   }, []);

//   const handleInputChange = (field) => (e) => {
//     setFormData({ ...formData, [field]: e.target.value });
//     setErrors({ ...errors, [field]: '' });
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.vendorName.trim()) newErrors.vendorName = 'Vendor name is required';
//     if (!formData.vendorContact.trim()) newErrors.vendorContact = 'Contact is required';
//     if (!formData.vendorEmail.trim()) newErrors.vendorEmail = 'Email is required';
//     if (!formData.BankAccountNo.trim()) newErrors.BankAccountNo = 'Account number is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const showSnackbar = (message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     const finalData = {
//       ...formData,
//       productDescription: !formData.productDescription
//         ? 'No description available'
//         : formData.productDescription,
//     };

//     try {
//       if (editingVendor) {
//         const { _id } = editingVendor;
//         await updateApi(`${urls.Vendors.editVendor}/${_id}`, finalData);
//         showSnackbar('Vendor updated successfully');
//       } else {
//         await axios.post(`${urls.Vendors.create}?companyId=${payload._id}`, finalData);
//         showSnackbar('Vendor registered successfully');
//       }
//       fetchVendors();
//       handleCloseDialog();
//     } catch (error) {
//       const message = error.response?.data?.message || 'An error occurred';
//       showSnackbar(message, 'error');
//     }
//   };

//   const fetchVendors = async () => {
//     setLoading(true);
//     try {
//       const response = await getApi(`${urls.Vendors.getAllVendors}?companyId=${payload._id}`);
//       setRegisteredVendors(Array.isArray(response.data) ? response.data : []);
//     } catch {
//       setRegisteredVendors([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (vendor) => {
//     setEditingVendor(vendor);
//     setFormData({
//       vendorName: vendor.vendorName,
//       vendorContact: vendor.vendorContact,
//       vendorEmail: vendor.vendorEmail,
//       BankAccountNo: vendor.vendorAccountNo,
//       productDescription: vendor.description
//     });
//     setOpenDialog(true);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteApi(`${urls.Vendors.deleteVendor}/${id}`);
//       showSnackbar('Vendor deleted successfully');
//       fetchVendors();
//     } catch (error) {
//       const message = error.response?.data?.message || 'Failed to delete vendor';
//       showSnackbar(message, 'error');
//     }
//   };

//   const handleOpenDialog = () => {
//     setEditingVendor(null);
//     setFormData({ vendorName: '', vendorContact: '', vendorEmail: '', BankAccountNo: '', productDescription: '' });
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setEditingVendor(null);
//     setFormData({ vendorName: '', vendorContact: '', vendorEmail: '', BankAccountNo: '', productDescription: '' });
//     setOpenDialog(false);
//   };

//   if (loading) return <div>Loading...</div>;

//   const registeredVendorsColumns = [
//     { field: 'vendorName', headerName: 'Name', flex: 1 },
//     { field: 'vendorContact', headerName: 'Contact', flex: 1 },
//     { field: 'vendorEmail', headerName: 'Email', flex: 1 },
//     { field: 'vendorAccountNo', headerName: 'Account No', flex: 1 },
//     { field: 'description', headerName: 'Description', flex: 1.5 },
//     {
//       field: 'actions',
//       headerName: 'Actions',
//       flex: 1,
//       renderCell: (params) => (
//         <Stack direction="row" spacing={1}>
//           <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(params.row)}>
            
//           </Button>
//           <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(params.row._id)}>
            
//           </Button>
//         </Stack>
//       ),
//     },
//   ];

//   return (
//     <Container maxWidth="lg">
//       <Card
//         sx={{
//           p: 0,
//           mt: 0,
//           height: "700px",
//           borderRadius: 3,
//           // boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         {/* Header */}
//         <Stack
//           direction="row"
//           alignItems="center"
//           justifyContent="space-between"
//           sx={{ mb: 1, pb: 1, borderBottom: "2px solid", borderColor: "divider" }}
//         >
//           <Stack direction="row" alignItems="center" spacing={1.5}>
//             <Box
//               sx={{
//                 width: 42,
//                 height: 42,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 borderRadius: "50%",
//                 backgroundColor: "rgba(25, 118, 210, 0.1)",
//               }}
//             >
//               <Link to="/" style={{ textDecoration: "none" }}>
//                 <IconHome style={{ color: "#1976d2", fontSize: "1.5rem" }} />
//               </Link>
//             </Box>
//             <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main", fontSize: "24px" }}>
//               Vendor Management
//             </Typography>
//           </Stack>
//           <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>
//             Add Vendor
//           </Button>
//         </Stack>

//         {/* Vendors DataGrid */}
//         <Box sx={{ flexGrow: 1 }}>
//           <DataGrid
//             rows={registeredVendors}
//             columns={registeredVendorsColumns}
//             getRowId={(row) => row._id}
//             slots={{
//               toolbar: GridToolbar,
            
//             }}
//             slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 500 } } }}
//             sx={{
//               border: "none",
//               "& .MuiDataGrid-columnHeaders": {
//                 backgroundColor: "rgba(25, 118, 210, 0.08)",
//                 fontWeight: "bold",
//               },
//             }}
//           />
//         </Box>
//       </Card>

//       {/* Dialog for Add/Edit Vendor */}
//       <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
//         <DialogTitle>{editingVendor ? "Edit Vendor" : "Add Vendor"}</DialogTitle>
//         <DialogContent dividers>
//           <form onSubmit={handleSubmit}>
//             <Grid container spacing={2}>
//               {[
//                 { label: 'Vendor Name', field: 'vendorName' },
//                 { label: 'Vendor Contact', field: 'vendorContact' },
//                 { label: 'Vendor Email', field: 'vendorEmail', type: 'email' },
//                 { label: 'Bank Account Number', field: 'BankAccountNo' }
//               ].map(({ label, field, type = 'text' }) => (
//                 <Grid item xs={12} key={field}>
//                   <TextField
//                     fullWidth
//                     label={label}
//                     type={type}
//                     value={formData[field]}
//                     onChange={handleInputChange(field)}
//                     error={!!errors[field]}
//                     helperText={errors[field]}
//                   />
//                 </Grid>
//               ))}
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Product Description"
//                   value={formData.productDescription}
//                   onChange={handleInputChange('productDescription')}
//                   multiline
//                   rows={3}
//                 />
//               </Grid>
//             </Grid>
//           </form>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog}>Cancel</Button>
//           <Button onClick={handleSubmit} variant="contained" startIcon={<SaveIcon />}>
//             {editingVendor ? "Update Vendor" : "Save Vendor"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
//         <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} sx={{ width: '100%' }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default VendorManagement;




import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  Card,
  Button,
  Snackbar,
  Alert,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Paper,
  IconButton,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { IconHome } from "@tabler/icons";
import StoreIcon from "@mui/icons-material/Store";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { deleteApi, getApi, updateApi } from "@/core/apis/api";
import { urls } from "@/core/Constant/urls";
import { tokenPayload } from "@/helper";
import { Link } from "react-router-dom";

const VendorManagement = () => {
  const [formData, setFormData] = useState({
    vendorName: "",
    vendorContact: "",
    vendorEmail: "",
    BankAccountNo: "",
    productDescription: "",
  });
  const [errors, setErrors] = useState({});
  const [registeredVendors, setRegisteredVendors] = useState([]);
  const [editingVendor, setEditingVendor] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(true);
  const payload = tokenPayload();

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    setErrors({ ...errors, [field]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.vendorName.trim())
      newErrors.vendorName = "Vendor name is required";
    if (!formData.vendorContact.trim())
      newErrors.vendorContact = "Contact is required";
    if (!formData.vendorEmail.trim()) newErrors.vendorEmail = "Email is required";
    if (!formData.BankAccountNo.trim())
      newErrors.BankAccountNo = "Account number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const finalData = {
      ...formData,
      productDescription: !formData.productDescription
        ? "No description available"
        : formData.productDescription,
    };

    try {
      if (editingVendor) {
        const { _id } = editingVendor;
        await updateApi(`${urls.Vendors.editVendor}/${_id}`, finalData);
        showSnackbar("Vendor updated successfully");
      } else {
        await axios.post(
          `${urls.Vendors.create}?companyId=${payload._id}`,
          finalData
        );
        showSnackbar("Vendor registered successfully");
      }
      fetchVendors();
      handleCloseDialog();
    } catch (error) {
      const message = error.response?.data?.message || "An error occurred";
      showSnackbar(message, "error");
    }
  };

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await getApi(
        `${urls.Vendors.getAllVendors}?companyId=${payload._id}`
      );
      setRegisteredVendors(Array.isArray(response.data) ? response.data : []);
    } catch {
      setRegisteredVendors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      vendorName: vendor.vendorName,
      vendorContact: vendor.vendorContact,
      vendorEmail: vendor.vendorEmail,
      BankAccountNo: vendor.vendorAccountNo,
      productDescription: vendor.description,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteApi(`${urls.Vendors.deleteVendor}/${id}`);
      showSnackbar("Vendor deleted successfully");
      fetchVendors();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete vendor";
      showSnackbar(message, "error");
    }
  };

  const handleOpenDialog = () => {
    setEditingVendor(null);
    setFormData({
      vendorName: "",
      vendorContact: "",
      vendorEmail: "",
      BankAccountNo: "",
      productDescription: "",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setEditingVendor(null);
    setFormData({
      vendorName: "",
      vendorContact: "",
      vendorEmail: "",
      BankAccountNo: "",
      productDescription: "",
    });
    setOpenDialog(false);
  };

  const registeredVendorsColumns = [
    { field: "vendorName", headerName: "Name", flex: 1 },
    { field: "vendorContact", headerName: "Contact", flex: 1 },
    { field: "vendorEmail", headerName: "Email", flex: 1 },
    { field: "vendorAccountNo", headerName: "Account No", flex: 1 },
    { field: "description", headerName: "Description", flex: 1.5 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row)}
            sx={{ color: "primary.main" }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(params.row._id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <Container maxWidth="lg" sx={{ p: 0 }}>
      <Card
        sx={{
          borderRadius: 3,
          borderColor: "divider",
          minHeight: "500px",
          display: "flex",
          flexDirection: "column",
          p: 3,
        }}
      >
        {/* Gradient Header */}
        <Box textAlign="center" mb={5}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background:
                "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "22px",
            }}
          >
            Vendor Management
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ marginBottom: "30px" }}
          >
            Manage and register vendors for your company
          </Typography>
        </Box>

        {/* Created Vendors + Add Button */}
        {registeredVendors.length > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <StoreIcon
                sx={{ mr: 2, color: "primary.main", fontSize: 32 }}
              />
              <Typography
                variant="h5"
                fontWeight="bold"
                color="primary"
              >
                Created Vendors ({registeredVendors.length})
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
              sx={{ px: 3, py: 1, borderRadius: 2 }}
            >
              Add New Vendor
            </Button>
          </Box>
        )}

        {/* Empty State OR Table */}
        {registeredVendors.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              backgroundColor: "#f5f5f5",
              borderRadius: 2,
            }}
          >
            <StoreIcon
              sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Vendors Registered Yet
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Get started by adding your first vendor
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
              sx={{ mt: 2 }}
            >
              Add New Vendor
            </Button>
          </Paper>
        ) : (
          <DataGrid
            rows={registeredVendors}
            columns={registeredVendorsColumns}
            getRowId={(row) => row._id}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            autoHeight
            pageSizeOptions={[5, 10, 25]}
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "rgba(25, 118, 210, 0.08)",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f9f9f9",
              },
            }}
          />
        )}
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingVendor ? "Edit Vendor" : "Add Vendor"}
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {[
                { label: "Vendor Name", field: "vendorName" },
                { label: "Vendor Contact", field: "vendorContact" },
                { label: "Vendor Email", field: "vendorEmail", type: "email" },
                { label: "Bank Account Number", field: "BankAccountNo" },
              ].map(({ label, field, type = "text" }) => (
                <Grid item xs={12} key={field}>
                  <TextField
                    fullWidth
                    label={label}
                    type={type}
                    value={formData[field]}
                    onChange={handleInputChange(field)}
                    error={!!errors[field]}
                    helperText={errors[field]}
                  />
                </Grid>
              ))}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Description"
                  value={formData.productDescription}
                  onChange={handleInputChange("productDescription")}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<SaveIcon />}
          >
            {editingVendor ? "Update Vendor" : "Save Vendor"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VendorManagement;
