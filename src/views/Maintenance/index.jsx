// import { useState } from 'react';
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   Snackbar,
//   Alert,
//   Fade,
//   IconButton,
//   Paper,
//   Autocomplete,
//   FormControl,
//   FormLabel,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   InputLabel,
//   OutlinedInput,
//   FormHelperText
// } from '@mui/material';
// import {
//   ProductionQuantityLimits as ProductIcon,
//   Save as SaveIcon,
//   Delete as DeleteIcon,
//   Edit as EditIcon,
//   Inventory as InventoryIcon
// } from '@mui/icons-material';
// import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { useEffect } from 'react';
// import { getApi, postApi, updateApi, patchApi } from '@/core/apis/api';
// import { tokenPayload } from '@/helper';
// import { toast } from 'react-toastify';
// import { useTranslation } from 'react-i18next';
// import { urls } from '@/core/Constant/urls';
// // import { property } from 'lodash';

// const getCurrentDate = () => {
//   const today = new Date();
//   return today.toISOString().split('T')[0];
// };

// const Maintenance = () => {
//   const { t } = useTranslation();

//   const [formData, setFormData] = useState({
//     maintenanceAmount: '',
//     surchargeAmount: '',
//     propertyType: 'Vacant',
//     dueDate: '',
//     date: getCurrentDate(),
//     maintenanceMonth: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [registeredMaintenance, setRegisteredMaintenance] = useState([]);
//   const [editingMaintenance, setEditingMaintenance] = useState(null);
//   const [openAdd, setOpenAdd] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [openDelete, setOpenDelete] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success'
//   });

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const payload = tokenPayload();

//   const fetchMaintenanceData = async () => {
//     try {
//       const response = await getApi(urls.maintenance.getAll, { id: payload.companyId });
//       console.log(response.data)
//       if (response?.data) {
//         const formattedData = response.data.map((item) => {
//           const maintenanceDate = new Date(item.maintenanceMonth);
//           const formattedMaintenanceMonth = maintenanceDate.toISOString().slice(0, 7); // Format as "Month Year"
//           return {
//             ...item,
//             dueDate: item.dueDate
//               ? new Date(item.dueDate).toISOString().slice(0, 10)
//               : 'N/A',
//             date: item.date
//               ? new Date(item.date).toISOString().slice(0, 10)
//               : 'N/A',
//             maintenanceMonth: formattedMaintenanceMonth,
//           }

//         });
//         console.log("formatted Data:", formattedData)
//         setRegisteredMaintenance(formattedData);
//       } else {
//         setRegisteredMaintenance([]);
//       }
//     } catch (error) {
//       setRegisteredMaintenance([]);
//     }
//   };

//   useEffect(() => {
//     fetchMaintenanceData();
//   }, [openAdd, openDelete, openEdit]);



//   const handleInputChange = (field) => (event) => {
//     setFormData({
//       ...formData,
//       [field]: event.target.value
//     });
//     if (errors[field]) {
//       setErrors({
//         ...errors,
//         [field]: ''
//       });
//     }
//   };



//   const AddMaintenance = async (formData) => {
//     //setLoading(true);
//     formData.companyId = payload.companyId;
//     try {
//       const response = await postApi(urls.maintenance.create, formData);
//       if (response.success && response.data) {
//         toast.success(t('Successfully registered'));
//         console.log("Response data", response.data)
//         console.log("FormData:", formData)
//         return response.data; // Return the saved object
//         //resetForm();
//         //handleClose();
//       }
//       else {
//         toast.error(t('Failed to register maintenance'));
//         return null;
//       }
//     } catch (err) {
//       console.error(err);
//       //setLoading(false);
//       toast.error(t('Something went wrong!'));
//       return null;
//     }

//   };

//   const editMaintenance = async (formData) => {
//     //setLoading(true);
//     formData.companyId = payload.companyId;
//     try {
//       const response = await updateApi(urls.maintenance.updateMaintenance, formData, { id: formData._id },);
//       //console.log(response);
//       if (response.success) {
//         console.log('✅ Response from updateApi:', response);

//         toast.success(t('Maintenance updated Successfully'));
//         return response.updatedMaintenance || response.data || response; // ✅ return the actual updated object

//         //resetForm();
//         //handleClose();
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error('Something went wrong!');
//       //setLoading(false);
//     }
//     // finally {
//     //   handleClose();
//     //   setLoading(false); 
//     // }
//   };


//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.propertyType.trim()) {
//       newErrors.propertyType = 'Property Type is required';
//     } else if (formData.propertyType.length < 3) {
//       newErrors.propertyType = 'Property Type must be at least 3 characters';
//     }
//     if (!String(formData.maintenanceAmount).trim()) {
//       newErrors.maintenanceAmount = 'Maintenance Amount is required';
//     } else if (formData.maintenanceAmount.length < 3) {
//       newErrors.maintenanceAmount = 'Maintenance Amount must be at least 3 characters';
//     }
//     if (!String(formData.maintenanceAmount).trim()) {
//       newErrors.surchargeAmount = 'Surcharge Amount is required';
//     } else if (formData.surchargeAmount.length < 3) {
//       newErrors.surchargeAmount = 'Surcharge Amount must be at least 3 characters';
//     }
//     if (!formData.dueDate.trim()) {
//       newErrors.dueDate = 'Due Date is required';
//     } else if (formData.dueDate.length < 1) {
//       newErrors.dueDate = 'Due Date must be at least 1 characters';
//     }
//     if (!formData.maintenanceMonth.trim()) {
//       newErrors.maintenanceMonth = 'Maintenance Month is required';
//     } else if (formData.maintenanceMonth.length < 1) {
//       newErrors.maintenanceMonth = 'Maintenance Month must be at least 1 characters';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleOpenModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingMaintenance(null);
//     setFormData({
//       maintenanceAmount: '',
//       surchargeAmount: '',
//       propertyType: 'Vacant',
//       dueDate: '',
//       date: getCurrentDate(),
//       maintenanceMonth: ''
//     });
//     setErrors({});
//   };

 

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!validateForm()) {
//       setSnackbar({ open: true, message: 'Please fix the errors', severity: 'error' });
//       return;
//     }

//     if (editingMaintenance) {
//       // ✅ EDIT FLOW
//       const updatedMaintenance = await editMaintenance({ ...formData, _id: editingMaintenance._id });

//       if (updatedMaintenance) {
//         setRegisteredMaintenance((prev) =>
//           prev.map((proj) => (proj._id === updatedMaintenance._id ? updatedMaintenance : proj))
//         );
//         setSnackbar({ open: true, message: 'Maintenance updated!', severity: 'success' });
//       }
//     } else {
//       // ✅ CREATE FLOW
//       const newMaintenance = await AddMaintenance(formData);
//       if (newMaintenance) {
//         setRegisteredMaintenance((prev) => [newMaintenance, ...prev]);
//         setSnackbar({ open: true, message: 'Maintenance created!', severity: 'success' });
//       }
//     }

//     handleCloseModal();
//   };

//   const handleEditMaintenance = (maintenance) => {
//     setFormData({
//       maintenanceAmount: maintenance.maintenanceAmount,
//       surchargeAmount: maintenance.surchargeAmount,
//       propertyType: maintenance.propertyType,
//       dueDate: maintenance.dueDate,
//       date: maintenance.date,
//       maintenanceMonth: maintenance.maintenanceMonth
//     });
//     setEditingMaintenance(maintenance);
//     // Scroll to form
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//     //setIsModalOpen(true);
//   };

//   const handleDeleteMaintenance = async (maintenanceId) => {
//     setRegisteredMaintenance((prev) => prev.filter((maintenance) => maintenance._id !== maintenanceId));
//     try {
//       const result = await patchApi(urls.maintenance.delete, { isDeleted: true }, { id: maintenanceId });

//       if (result?.success) {
//         toast.success(t('Maintenance Deleted Successfully'));
//         //handleClose();
//       }
//     } catch (error) {
//       console.error('Error deleting Maintenance:', error);
//       toast.error(t('Error deleting Maintenance'));
//       //setLoading(false);
//     }
//     // finally {
//     //   setLoading(false); 
//     // }
//     setSnackbar({
//       open: true,
//       message: 'Maintenance deleted successfully!',
//       severity: 'info'
//     });
//   };

//   const applyForOccupiedProperties = async (data) => {
//     try {
//       const response = await getApi(urls.Voucher.createVoucher); // Get voucher number

//       const maintenanceData = {
//         maintenanceAmount: data.maintenanceAmount,
//         surchargeAmount: data.surchargeAmount,
//         date: data.date,
//         dueDate: data.dueDate,
//         maintenanceMonth: data.maintenanceMonth,
//         companyId: data.companyId,
//         _id: data._id,
//         voucherNo: response.data, // Attach voucher number
//       };

//       await postApi(urls.maintenance.apply, maintenanceData); // ✅ Send the correct object
//       toast.success('Applied Successfully');
//     } catch (error) {
//       toast.error('Already Applied');
//     }
//   };

//   // Common styling for all inputs
//   const inputStyling = {
//     '& .MuiOutlinedInput-root': {
//       borderRadius: 2,
//       '&:hover fieldset': {
//         borderColor: '#667eea'
//       }
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingMaintenance(null);
//     setFormData({
//       maintenanceAmount: '',
//       surchargeAmount: '',
//       propertyType: 'Vacant',
//       dueDate: '',
//       date: getCurrentDate(),
//       maintenanceMonth: ''

//     });
//     setErrors({});
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   // DataGrid columns for registered products
//   const registeredMaintenanceColumns = [
//     {
//       field: 'serialNo',
//       headerName: 'S.No.',
//       width: 80,
//       renderCell: (params) => {
//         const rowIndex = registeredMaintenance.findIndex((row) => row._id === params.row._id);
//         return rowIndex + 1;
//       }
//     },
//     {
//       field: 'maintenanceAmount',
//       headerName: 'Maintenance Amount',
//       flex: 1,
//       renderCell: (params) => (
//         <Typography fontWeight="bold" color="primary">
//           {params.row.maintenanceAmount}
//         </Typography>
//       )
//     },
//     {
//       field: 'surchargeAmount',
//       headerName: 'Surcharge Amount',
//       flex: 1,
//       renderCell: (params) => (
//         <Typography variant="body2" color="text.secondary">
//           {params.row.surchargeAmount}
//         </Typography>
//       )
//     },
//     {
//       field: 'propertyType',
//       headerName: 'Property Type',
//       flex: 1,
//       renderCell: (params) => (
//         <Typography variant="body2" color="text.secondary">
//           {params.row.propertyType}
//         </Typography>
//       )
//     },
//     {
//       field: 'date',
//       headerName: 'Date',
//       flex: 0.8,
//       renderCell: (params) => (
//         <Typography
//           variant="body2"
//           sx={{
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap'
//           }}
//         >
//           {params.row.date}
//         </Typography>
//       )
//     },
//     {
//       field: 'dueDate',
//       headerName: 'Due Date',
//       flex: 0.8,
//       renderCell: (params) => (
//         <Typography
//           variant="body2"
//           sx={{
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap'
//           }}
//         >
//           {params.row.dueDate}
//         </Typography>
//       )
//     },
  
//     {
//       field: 'maintenanceMonth',
//       headerName: 'Maintenance Month',
//       flex: 0.6,
//       renderCell: (params) => (
//         <Typography fontWeight="500" color="text.primary">
//           {params.row.maintenanceMonth}
//         </Typography>
//       )
//     },
 
//     {
//       field: 'actions',
//       headerName: 'Actions',
//       flex: 0.7,
//       sortable: false,
//       renderCell: (params) => (
//         <Box>
//           <IconButton size="small" onClick={() => handleEditMaintenance(params.row)} sx={{ mr: 1, color: 'primary.main' }}>
//             <EditIcon fontSize="small" />
//           </IconButton>
//           <IconButton size="small" onClick={() => handleDeleteMaintenance(params.row._id)} sx={{ color: 'error.main' }}>
//             <DeleteIcon fontSize="small" />
//           </IconButton>
//         </Box>
//       )
//     },
//     {
//       field: 'applyamount',
//       headerName: 'Apply Amount',
//       flex: 1,
//       sortable: false,
//       renderCell: (params) => (
//         <Box>
//           <Button onClick={() => applyForOccupiedProperties(params.row)} variant="outlined">Apply</Button>
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
//             <ManageAccountsIcon
//               sx={{
//                 fontSize: 48,
//                 color: 'primary.main',
//                 mb: 2
//               }}
//             />
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
//               Maintenance
//             </Typography>
//             <Typography variant="h6" color="text.secondary" sx={{ marginBottom: '40px' }}>
//               {editingMaintenance ? 'Update Maintenance Information' : 'Register your new maintenance with detailed information'}
//             </Typography>
//           </Box>

//           <Grid container spacing={4}>
//             {/* Registration Form */}
//             <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', width: '100%' }}>
//               <Box sx={{ width: '100%', maxWidth: '800px' }}>
//                 <Card
//                   elevation={8}
//                   sx={{
//                     borderRadius: 3,
//                     background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
//                     border: '1px solid',
//                     borderColor: 'divider'
//                   }}
//                 >
//                   <CardContent sx={{ p: 4 }}>
//                     {editingMaintenance && (
//                       <Box sx={{ mb: 3, p: 2, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
//                         <Typography variant="body2" color="primary" fontWeight="bold">
//                           Editing: {editingMaintenance.maintenanceAmount}
//                         </Typography>
//                         <Button size="small" onClick={handleCancelEdit} sx={{ mt: 1 }}>
//                           Cancel Edit
//                         </Button>
//                       </Box>
//                     )}

//                     <form onSubmit={handleSubmit}>
//                       <Grid container spacing={3}>
//                         <Grid item xs={12} md={10} sx={{ display: 'flex' }}>
//                           <FormControl component="fieldset">
//                             <RadioGroup
//                               row
//                               name="radio-buttons-group"
//                               value={formData.propertyType}
//                               onChange={handleInputChange('propertyType')}
//                             >
//                               <FormControlLabel value="Vacant" control={<Radio />} label="Vacant" />
//                               <FormControlLabel value="Occupied" control={<Radio />} label="Occupied" />
//                             </RadioGroup>
//                           </FormControl>
//                         </Grid>

//                         {/* Product Name */}
//                         <Grid item xs={12} md={6}>
//                           <TextField
//                             fullWidth
//                             label="Maintenance Amount"
//                             value={formData.maintenanceAmount}
//                             onChange={handleInputChange('maintenanceAmount')}
//                             error={!!errors.maintenanceAmount}
//                             helperText={errors.maintenanceAmount}
//                             variant="outlined"
//                             sx={{
//                               '& .MuiOutlinedInput-root': {
//                                 borderRadius: 2,
//                                 transition: 'all 0.3s ease',
//                                 '&:hover': {
//                                   boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
//                                 },
//                                 '&.Mui-focused': {
//                                   boxShadow: '0 4px 12px rgba(25,118,210,0.3)'
//                                 }
//                               }
//                             }}
//                           />
//                         </Grid>

//                         {/* Product Model */}
//                         <Grid item xs={12} md={6}>
//                           <TextField
//                             fullWidth
//                             label="Surcharge Amount"
//                             value={formData.surchargeAmount}
//                             onChange={handleInputChange('surchargeAmount')}
//                             error={!!errors.surchargeAmount}
//                             helperText={errors.surchargeAmount}
//                             variant="outlined"
//                             sx={{
//                               '& .MuiOutlinedInput-root': {
//                                 borderRadius: 2,
//                                 transition: 'all 0.3s ease',
//                                 '&:hover': {
//                                   boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
//                                 },
//                                 '&.Mui-focused': {
//                                   boxShadow: '0 4px 12px rgba(25,118,210,0.3)'
//                                 }
//                               }
//                             }}
//                           />
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                           <TextField
//                             fullWidth
//                             label="Date"
//                             value={formData.date}
//                             onChange={handleInputChange('date')}
//                             error={!!errors.date}
//                             helperText={errors.date}
//                             variant="outlined"
//                             disabled
//                             //multiline
//                             //rows={4}
//                             sx={{
//                               '& .MuiOutlinedInput-root': {
//                                 borderRadius: 2,
//                                 transition: 'all 0.3s ease',
//                                 '&:hover': {
//                                   boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
//                                 },
//                                 '&.Mui-focused': {
//                                   boxShadow: '0 4px 12px rgba(25,118,210,0.3)'
//                                 }
//                               }
//                             }}
//                           />
//                         </Grid>
              
//                         <Grid item xs={12} md={6}>
//                           <FormControl fullWidth variant="outlined" error={!!errors.dueDate}>
//                             <InputLabel shrink htmlFor="due-date">Due Date</InputLabel>
//                             <OutlinedInput
//                               id="dueDate"
//                               type="date"
//                               value={formData.dueDate}
//                               onChange={handleInputChange('dueDate')}
//                               label="Due Date"
//                               notched
//                               sx={{
//                                 borderRadius: 2,
//                                 transition: 'all 0.3s ease',
//                                 '&:hover': {
//                                   boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
//                                 },
//                                 '&.Mui-focused': {
//                                   boxShadow: '0 4px 12px rgba(25,118,210,0.3)'
//                                 }
//                               }}
//                             />
//                             {errors.dueDate && (
//                               <FormHelperText>{errors.dueDate}</FormHelperText>
//                             )}
//                           </FormControl>
//                         </Grid>
                       
                      
                     
                      
                        


//                         <Grid item xs={12} md={6}>
//                           <FormControl fullWidth variant="outlined" error={!!errors.maintenanceMonth}>
//                             <InputLabel shrink htmlFor="maintenance-month">Maintenance Month</InputLabel>
//                             <OutlinedInput
//                               id="maintenance-month"
//                               type="month"
//                               value={formData.maintenanceMonth}
//                               onChange={handleInputChange('maintenanceMonth')}
//                               label="Maintenance Month"
//                               notched
//                               sx={{
//                                 borderRadius: 2,
//                                 transition: 'all 0.3s ease',
//                                 '&:hover': {
//                                   boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
//                                 },
//                                 '&.Mui-focused': {
//                                   boxShadow: '0 4px 12px rgba(25,118,210,0.3)'
//                                 }
//                               }}
//                             />
//                             {errors.maintenanceMonth && (
//                               <FormHelperText>{errors.maintenanceMonth}</FormHelperText>
//                             )}
//                           </FormControl>
//                         </Grid>

//                         {/* Submit Button */}
//                         <Grid item xs={12}>
//                           <Box display="flex" justifyContent="center" mt={2}>
//                             <Button
//                               type="submit"
//                               variant="contained"
//                               size="large"
//                               startIcon={<SaveIcon />}
//                               sx={{
//                                 px: 4,
//                                 py: 1.5,
//                                 borderRadius: 3,
//                                 fontSize: '1.1rem',
//                                 fontWeight: 600,
//                                 background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
//                                 boxShadow: '0 4px 12px rgba(25,118,210,0.4)',
//                                 transition: 'all 0.3s ease',
//                                 '&:hover': {
//                                   background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
//                                   boxShadow: '0 6px 16px rgba(25,118,210,0.5)',
//                                   transform: 'translateY(-2px)'
//                                 }
//                               }}
//                             >
//                               {editingMaintenance ? 'Update Maintenance' : 'Add Maintenance'}
//                             </Button>
//                           </Box>
//                         </Grid>
//                       </Grid>
//                     </form>
//                   </CardContent>
//                 </Card>
//               </Box>
//             </Box>

//             {/* Preview Card */}
//             {(formData.maintenanceAmount ||
//               formData.surchargeAmount ||
//               formData.propertyType ||
//               formData.date ||
//               formData.dueDate ||
//               // formData.monthName ||
//               // formData.yearName ||
//               formData.maintenanceMonth) && (
//                 <Fade in={true} timeout={600}>
//                   <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', width: '100%' }}>
//                     <Box sx={{ width: '100%', maxWidth: '800px' }}>
//                       <Card
//                         elevation={4}
//                         sx={{
//                           borderRadius: 3,
//                           background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
//                         }}
//                       >
//                         <CardContent>
//                           <Typography variant="h6" gutterBottom color="primary" fontWeight={600}>
//                             Preview
//                           </Typography>
//                           <Box sx={{ pl: 2 }}>
//                             {formData.maintenanceAmount && (
//                               <Typography variant="body1" sx={{ mb: 1 }}>
//                                 <strong>Maintenance Amount:</strong> {formData.maintenanceAmount}
//                               </Typography>
//                             )}
//                             {formData.surchargeAmount && (
//                               <Typography variant="body1" sx={{ mb: 1 }}>
//                                 <strong>Surcharge Amount:</strong> {formData.surchargeAmount}
//                               </Typography>
//                             )}
//                             {formData.propertyType && (
//                               <Typography variant="body1" sx={{ mb: 1 }}>
//                                 <strong>Property Type:</strong> {formData.propertyType}
//                               </Typography>
//                             )}
//                             {formData.date && (
//                               <Typography variant="body1" sx={{ mb: 1 }}>
//                                 <strong>Date:</strong> {formData.date}
//                               </Typography>
//                             )}
//                             {formData.dueDate && (
//                               <Typography variant="body1" sx={{ mb: 1 }}>
//                                 <strong>Due Date:</strong> {formData.dueDate}
//                               </Typography>
//                             )}
                         
//                             {formData.maintenanceMonth && (
//                               <Typography variant="body1" sx={{ mb: 1 }}>
//                                 <strong>Maintenance Month:</strong> {formData.maintenanceMonth}
//                               </Typography>
//                             )}
//                           </Box>
//                         </CardContent>
//                       </Card>
//                     </Box>
//                   </Box>
//                 </Fade>
//               )}

//             {/* Registered Products Data Table */}
//             <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
//               <Box sx={{ width: '100%' }}>
//                 <Card
//                   elevation={8}
//                   sx={{
//                     borderRadius: 3,
//                     background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
//                     border: '1px solid',
//                     borderColor: 'divider'
//                   }}
//                 >
//                   <CardContent sx={{ p: 4 }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                       <ManageAccountsIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
//                       <Typography variant="h5" fontWeight="bold" color="primary">
//                         Added Maintenance ({registeredMaintenance.length})
//                       </Typography>
//                     </Box>

//                     {registeredMaintenance.length === 0 ? (
//                       <Paper
//                         sx={{
//                           p: 4,
//                           textAlign: 'center',
//                           backgroundColor: '#f5f5f5',
//                           borderRadius: 2
//                         }}
//                       >
//                         <ManageAccountsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
//                         <Typography variant="h6" color="text.secondary" gutterBottom>
//                           No Maintenance Added Yet
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           Add Maintenance using the form above
//                         </Typography>
//                       </Paper>
//                     ) : (
//                       <DataGrid
//                         rows={registeredMaintenance}
//                         columns={registeredMaintenanceColumns}
//                         getRowId={(row) => row._id}
//                         slots={{ toolbar: GridToolbar }}
//                         slotProps={{
//                           toolbar: {
//                             showQuickFilter: true,
//                             quickFilterProps: { debounceMs: 500 }
//                           }
//                         }}
//                         autoHeight
//                         initialState={{
//                           pagination: {
//                             paginationModel: { page: 0, pageSize: 10 }
//                           }
//                         }}
//                         pageSizeOptions={[5, 10, 25, 50]}
//                         sx={{
//                           '& .MuiDataGrid-root': {
//                             border: 'none'
//                           },
//                           '& .MuiDataGrid-cell': {
//                             borderBottom: '1px solid #f0f0f0',
//                             py: 1
//                           },
//                           '& .MuiDataGrid-columnHeaders': {
//                             backgroundColor: '#f8f9fa',
//                             borderBottom: '2px solid #dee2e6',
//                             fontWeight: 'bold'
//                           },
//                           '& .MuiDataGrid-row:hover': {
//                             backgroundColor: '#f5f5f5'
//                           }
//                         }}
//                       />
//                     )}
//                   </CardContent>
//                 </Card>
//               </Box>
//             </Box>
//           </Grid>
//         </Box>
//       </Fade>

//       {/* Snackbar for notifications */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={snackbar.severity}
//           sx={{
//             width: '100%',
//             borderRadius: 2,
//             boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
//           }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default Maintenance;







import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Card,
  Snackbar,
  Alert,
  Paper,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import BuildIcon from "@mui/icons-material/Build";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { getApi, postApi, updateApi, patchApi } from "@/core/apis/api";
import { tokenPayload } from "@/helper";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { urls } from "@/core/Constant/urls";

const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const Maintenance = () => {
  const { t } = useTranslation();
  const payload = tokenPayload();

  const [formData, setFormData] = useState({
    maintenanceAmount: "",
    surchargeAmount: "",
    propertyType: "Vacant",
    dueDate: "",
    date: getCurrentDate(),
    maintenanceMonth: "",
  });
  const [errors, setErrors] = useState({});
  const [registeredMaintenance, setRegisteredMaintenance] = useState([]);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchMaintenanceData = async () => {
    try {
      const response = await getApi(urls.maintenance.getAll, {
        id: payload.companyId,
      });
      if (response?.data) {
        const formattedData = response.data.map((item) => {
          const maintenanceDate = new Date(item.maintenanceMonth);
          const formattedMaintenanceMonth =
            maintenanceDate.toISOString().slice(0, 7);
          return {
            ...item,
            dueDate: item.dueDate
              ? new Date(item.dueDate).toISOString().slice(0, 10)
              : "N/A",
            date: item.date
              ? new Date(item.date).toISOString().slice(0, 10)
              : "N/A",
            maintenanceMonth: formattedMaintenanceMonth,
          };
        });
        setRegisteredMaintenance(formattedData);
      } else {
        setRegisteredMaintenance([]);
      }
    } catch {
      setRegisteredMaintenance([]);
    }
  };

  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  const handleInputChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.propertyType) newErrors.propertyType = "Property Type is required";
    if (!formData.maintenanceAmount) newErrors.maintenanceAmount = "Maintenance Amount is required";
    if (!formData.surchargeAmount) newErrors.surchargeAmount = "Surcharge Amount is required";
    if (!formData.dueDate) newErrors.dueDate = "Due Date is required";
    if (!formData.maintenanceMonth) newErrors.maintenanceMonth = "Maintenance Month is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const AddMaintenance = async (data) => {
    data.companyId = payload.companyId;
    try {
      const response = await postApi(urls.maintenance.create, data);
      if (response.success && response.data) {
        toast.success(t("Successfully registered"));
        return response.data;
      } else {
        toast.error(t("Failed to register maintenance"));
        return null;
      }
    } catch {
      toast.error(t("Something went wrong!"));
      return null;
    }
  };

  const editMaintenance = async (data) => {
    data.companyId = payload.companyId;
    try {
      const response = await updateApi(
        urls.maintenance.updateMaintenance,
        data,
        { id: data._id }
      );
      if (response.success) {
        toast.success(t("Maintenance updated Successfully"));
        return response.updatedMaintenance || response.data;
      }
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "Please fix the errors",
        severity: "error",
      });
      return;
    }
    if (editingMaintenance) {
      const updated = await editMaintenance({
        ...formData,
        _id: editingMaintenance._id,
      });
      if (updated) {
        setRegisteredMaintenance((prev) =>
          prev.map((m) => (m._id === updated._id ? updated : m))
        );
        setSnackbar({
          open: true,
          message: "Maintenance updated!",
          severity: "success",
        });
      }
    } else {
      const newM = await AddMaintenance(formData);
      if (newM) {
        setRegisteredMaintenance((prev) => [newM, ...prev]);
        setSnackbar({
          open: true,
          message: "Maintenance created!",
          severity: "success",
        });
      }
    }
    setFormData({
      maintenanceAmount: "",
      surchargeAmount: "",
      propertyType: "Vacant",
      dueDate: "",
      date: getCurrentDate(),
      maintenanceMonth: "",
    });
    setEditingMaintenance(null);
  };

  const handleEditMaintenance = (m) => {
    setFormData({ ...m });
    setEditingMaintenance(m);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteMaintenance = async (id) => {
    setRegisteredMaintenance((prev) => prev.filter((m) => m._id !== id));
    try {
      await patchApi(urls.maintenance.delete, { isDeleted: true }, { id });
      toast.success(t("Maintenance Deleted Successfully"));
    } catch {
      toast.error(t("Error deleting Maintenance"));
    }
    setSnackbar({
      open: true,
      message: "Maintenance deleted successfully!",
      severity: "info",
    });
  };

  const registeredMaintenanceColumns = [
    { field: "serialNo", headerName: "S.No.", width: 80, renderCell: (params) => registeredMaintenance.findIndex((row) => row._id === params.row._id) + 1 },
    { field: "maintenanceAmount", headerName: "Maintenance Amount", flex: 1 },
    { field: "surchargeAmount", headerName: "Surcharge Amount", flex: 1 },
    { field: "propertyType", headerName: "Property Type", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "dueDate", headerName: "Due Date", flex: 1 },
    { field: "maintenanceMonth", headerName: "Maintenance Month", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Button size="small" onClick={() => handleEditMaintenance(params.row)} startIcon={<EditIcon />}>Edit</Button>
          <Button size="small" color="error" onClick={() => handleDeleteMaintenance(params.row._id)} startIcon={<DeleteIcon />}>Delete</Button>
        </Box>
      ),
    },
  ];

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

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
          width: "100%",
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 3, textAlign: "center", borderBottom: "2px solid #eee", pb: 2 }}>

       <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "primary.main", fontSize: "24px" }}
                  gutterBottom
                >
                  Maintenance Management
                </Typography>


          <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
            {editingMaintenance ? "Update maintenance details" : "Register new maintenance with details"}
          </Typography>
        </Box>

        {/* Editing Banner */}
        {editingMaintenance && (
          <Box display="flex" justifyContent="space-between" alignItems="center" p={2} bgcolor="#e3f2fd" borderRadius={2} mb={3}>
            <Typography variant="body2" color="primary" fontWeight="bold">
              Editing: {editingMaintenance.maintenanceAmount}
            </Typography>
            <Button size="small" onClick={() => setEditingMaintenance(null)}>
              Cancel Edit
            </Button>
          </Box>
        )}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl>
                <RadioGroup row value={formData.propertyType} onChange={handleInputChange("propertyType")}>
                  <FormControlLabel value="Vacant" control={<Radio />} label="Vacant" />
                  <FormControlLabel value="Occupied" control={<Radio />} label="Occupied" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Maintenance Amount" value={formData.maintenanceAmount} onChange={handleInputChange("maintenanceAmount")} error={!!errors.maintenanceAmount} helperText={errors.maintenanceAmount} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Surcharge Amount" value={formData.surchargeAmount} onChange={handleInputChange("surchargeAmount")} error={!!errors.surchargeAmount} helperText={errors.surchargeAmount} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth disabled label="Date" value={formData.date} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.dueDate}>
                <InputLabel shrink>Due Date</InputLabel>
                <OutlinedInput type="date" value={formData.dueDate} onChange={handleInputChange("dueDate")} />
                {errors.dueDate && <FormHelperText>{errors.dueDate}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.maintenanceMonth}>
                <InputLabel shrink>Maintenance Month</InputLabel>
                <OutlinedInput type="month" value={formData.maintenanceMonth} onChange={handleInputChange("maintenanceMonth")} />
                {errors.maintenanceMonth && <FormHelperText>{errors.maintenanceMonth}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box textAlign="center">
                <Button type="submit" variant="contained" size="large" startIcon={<SaveIcon />}>
                  {editingMaintenance ? "Update Maintenance" : "Add Maintenance"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Card>
     


      {/* Preview Card */}
      {(formData.maintenanceAmount ||
        formData.surchargeAmount ||
        formData.propertyType ||
        formData.date ||
        formData.dueDate ||
        formData.maintenanceMonth) && (
        <Card
          sx={{
            p: 4,
            mt: 4,
            // boxShadow: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #ffffff, #fafafa)",
            width: "100%",
          }}
        >
          <Box sx={{ mb: 2, textAlign: "center", borderBottom: "2px solid #eee", pb: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="primary" fontSize="14px">
              Preview Maintenance Details
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography><strong>Property Type:</strong> {formData.propertyType}</Typography>
            </Grid>
          
            <Grid item xs={12} md={6}>
              <Typography><strong>Date:</strong> {formData.date || "—"}</Typography>
            </Grid>
           
          </Grid>
        </Card>
      )}


      {/* Table Card */}
      <Card
        sx={{
          p: 4,
          mt: 4,
          // boxShadow: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #ffffff, #fafafa)",
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            Added Maintenance ({registeredMaintenance.length})
          </Typography>
        </Box>

        {registeredMaintenance.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center", backgroundColor: "#f5f5f5", borderRadius: 2 }}>
            <BuildIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Maintenance Added Yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add maintenance using the form above
            </Typography>
          </Paper>
        ) : (
          <DataGrid
            rows={registeredMaintenance}
            columns={registeredMaintenanceColumns}
            getRowId={(row) => row._id}
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
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Maintenance;



