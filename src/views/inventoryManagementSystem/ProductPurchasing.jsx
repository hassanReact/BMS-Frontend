// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   Paper,
//   TextField,
//   IconButton,
//   Alert,
//   Fade,
//   Autocomplete,
//   Divider,
//   Chip,
//   Zoom,
//   TableContainer,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Tooltip,
//   Dialog,
//   DialogContent
// } from '@mui/material';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Inventory as InventoryIcon } from '@mui/icons-material';
// import ProductIcon from '@mui/icons-material/Category';
// import { ShoppingCart, CloudUpload, Delete, Edit, CheckCircle, Receipt, PictureAsPdf } from '@mui/icons-material';
// import { urls } from '@/core/Constant/urls';
// import { getApi, postApi, updateApi, deleteApi } from '@/core/apis/api';
// import { tokenPayload } from '@/helper';

// const unitOptions = [
//   { value: 'number', label: 'Number (pcs)' },
//   { value: 'kg', label: 'Kilogram (kg)' },
//   { value: 'meter', label: 'Meter (m)' },
//   { value: 'feet', label: 'Feet (ft)' }
// ];

// const ProductPurchaseComponent = () => {
//   const [formData, setFormData] = useState({
//     productId: '',
//     productName: '',
//     vendorId: '',
//     vendorName: '',
//     unit: '',
//     quantity: '',
//     price: '',
//     billNumber: ''
//   });

//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [vendors, setVendors] = useState([]);
//   const [purchaseList, setPurchaseList] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [previewType, setPreviewType] = useState(null);
//   const payload = tokenPayload();
  
//   const inputStyling = {
//     '& .MuiOutlinedInput-root': {
//       borderRadius: 2,
//       '&:hover fieldset': {
//         borderColor: '#667eea'
//       }
//     }
//   };

//   useEffect(() => {
//     fetchDropdowns();
//     fetchPurchases();
//   }, []);

//   const fetchDropdowns = async () => {
//     try {
//       const response = await getApi(`${urls.Inventory.dropDowns}?companyId=${payload._id}`);
//       const { productName, vendorName } = response.data;
//       setProducts(
//         productName.map((p) => ({
//           productId: p._id,
//           productName: p.productName
//         }))
//       );
//       setVendors(
//         vendorName.map((v) => ({
//           vendorId: v._id,
//           vendorName: v.vendorName
//         }))
//       );
//     } catch {
//       setSnackbar({ open: true, message: 'Failed to fetch dropdowns.', severity: 'error' });
//     }
//   };

//   const fetchPurchases = async () => {
//     try {
//       const response = await getApi(`${urls.Inventory.getAllPurchaseDetails}?companyId=${payload._id}`);
//       console.log("All Purchased :", response?.data);
//       setPurchaseList(response.data);
//     } catch {
//       setSnackbar({ open: true, message: 'Failed to fetch purchase records.', severity: 'error' });
//     }
//   };

//   // Generate voucher for new purchases (not for edits)
//   const generateVoucher = async () => {
//     try {
//       setLoading(true);
//       const response = await getApi(urls.Voucher.createVoucher, { prefix: "AP" });
//       console.log("Generated voucher:", response?.data);
//       return response?.data?.voucherNo || response?.data || '';
//     } catch (error) {
//       console.error('Error generating voucher:', error);
//       setSnackbar({ open: true, message: 'Failed to generate bill number.', severity: 'error' });
//       return '';
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       let billNumber = formData.billNumber;
      
//       // Generate new voucher only for new purchases (not edits)
//       if (!editingId) {
//         billNumber = await generateVoucher();
//         if (!billNumber) {
//           setSnackbar({ open: true, message: 'Failed to generate bill number.', severity: 'error' });
//           return;
//         }
//       }

//       console.log('Using billNumber:', billNumber);

//       const form = new FormData();
//       form.append('productId', formData.productId);
//       form.append('productName', formData.productName);
//       form.append('vendorId', formData.vendorId);
//       form.append('vendorName', formData.vendorName);
//       form.append('unit', formData.unit);
//       form.append('quantity', formData.quantity);
//       form.append('price', formData.price);
//       form.append('billNumber', billNumber);
      
//       if (uploadedFile) {
//         form.append('bill', uploadedFile);
//       }

//       if (editingId) {
//         await updateApi(`${urls.Inventory.editPurchaseDetails}/${editingId}`, form);
//         setSnackbar({ open: true, message: 'Purchase updated successfully.', severity: 'success' });
//       } else {
//         await postApi(`${urls.Inventory.postPurchaseDetails}?companyId=${payload._id}`, form);
//         setSnackbar({ open: true, message: 'Purchase submitted successfully.', severity: 'success' });
//       }

//       // Refresh data and reset form
//       await fetchPurchases();
//       resetForm();
//       setShowSuccess(true);
//       setTimeout(() => setShowSuccess(false), 3000);

//     } catch (error) {
//       console.error('Submit error:', error);
//       setSnackbar({ open: true, message: 'Operation failed. Please try again.', severity: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({ 
//       productId: '', 
//       productName: '', 
//       vendorId: '', 
//       vendorName: '', 
//       unit: '', 
//       quantity: '', 
//       price: '', 
//       billNumber: '' 
//     });
//     setUploadedFile(null);
//     setEditingId(null);
//   };

//   const handleDelete = async (id) => {
//     try {
//       setLoading(true);
//       await deleteApi(`${urls.Inventory.deletePurchaseDetails}/${id}`);
//       await fetchPurchases();
//       setSnackbar({ open: true, message: 'Deleted successfully.', severity: 'success' });
//     } catch {
//       setSnackbar({ open: true, message: 'Delete failed.', severity: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (record) => {
//     setFormData({
//       productId: record.productId,
//       productName: record.productName,
//       vendorId: record.vendorId,
//       vendorName: record.vendorName,
//       unit: record.unit,
//       quantity: String(record.quantity ?? ''),
//       price: String(record.unitPerPrice ?? ''),
//       billNumber: record.billNumber || '' // Keep existing bill number for edits
//     });
//     setEditingId(record._id);

//     if (record.bill) {
//       setUploadedFile({ name: record.bill, preview: `http://localhost:7200/${record.bill}` });
//     } else {
//       setUploadedFile(null);
//     }
//   };

//   const handleChange = (field) => (e) => {
//     const value = e.target.value;

//     // Only allow digits or decimal for quantity and price
//     if (field === 'quantity' || field === 'price') {
//       if (!/^\d*\.?\d*$/.test(value)) return; // Reject invalid chars
//     }

//     console.log('Raw value:', value);
//     setFormData({ ...formData, [field]: value });
//   };

//   const handleProductChange = (e, value) => {
//     setFormData({ ...formData, productId: value?.productId || '', productName: value?.productName || '' });
//   };

//   const handleVendorChange = (e, value) => {
//     setFormData({ ...formData, vendorId: value?.vendorId || '', vendorName: value?.vendorName || '' });
//   };

//   const handleUnitChange = (e, value) => {
//     setFormData({ ...formData, unit: value?.value || '' });
//   };

//   const calculateTotal = () => {
//     const price = parseFloat(formData.price);
//     const qty = parseFloat(formData.quantity);
//     if (isNaN(price) || isNaN(qty)) return 0;
//     return Math.round(price * qty);
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
//       console.log(file);
//       setUploadedFile(file);
//     }
//   };

//   const removeFile = () => setUploadedFile(null);

//   const isFormValid =
//     formData.productId &&
//     formData.vendorId &&
//     formData.unit &&
//     formData.quantity !== '' &&
//     formData.price !== '' &&
//     !isNaN(Number(formData.quantity)) &&
//     !isNaN(Number(formData.price)) &&
//     Number(formData.quantity) > 0 &&
//     Number(formData.price) > 0;

//   const handlePreviewImage = (billPath) => {
//     const fullUrl = `http://localhost:7200/${billPath}`;
//     const isPDF = fullUrl.toLowerCase().endsWith('.pdf');
//     setPreviewImage(fullUrl);
//     setPreviewType(isPDF ? 'pdf' : 'image');
//     setPreviewOpen(true);
//   };

//   const purchaseDetailColumns = [
//     { field: 'billNumber', headerName: 'Bill Number', flex: 1 },
//     { field: 'productName', headerName: 'Product', flex: 1 },
//     { field: 'vendorName', headerName: 'Vendor', flex: 1 },
//     { field: 'quantity', headerName: 'Quantity', flex: 1 },
//     { field: 'unit', headerName: 'Unit', flex: 1 },
//     { field: 'unitPerPrice', headerName: 'Price', flex: 1 },
//     { field: 'total', headerName: 'Total', flex: 1, valueGetter: (params) => (params.row.unitPerPrice * params.row.quantity).toFixed(2) },
//     {
//       field: 'bill',
//       headerName: 'Bill',
//       flex: 1,
//       renderCell: (params) => {
//         const bill = params.row.bill;

//         if (!bill) return '-';

//         if (bill.toLowerCase().endsWith('.pdf')) {
//           return (
//             <Tooltip title="View PDF">
//               <IconButton onClick={() => handlePreviewImage(bill)}>
//                 <PictureAsPdf color="action" />
//               </IconButton>
//             </Tooltip>
//           );
//         }

//         return (
//           <Box
//             role="button"
//             tabIndex={0}
//             onClick={() => handlePreviewImage(bill)}
//             onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handlePreviewImage(bill)}
//             sx={{
//               width: 60,
//               height: 60,
//               cursor: 'pointer',
//               outline: 'none',
//               borderRadius: 1,
//               overflow: 'hidden',
//               display: 'inline-block'
//             }}
//             aria-label="Preview bill image"
//           >
//             <img src={`http://localhost:7200/${bill}`} alt="Bill" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//           </Box>
//         );
//       }
//     },
//     {
//       field: 'actions',
//       headerName: 'Actions',
//       flex: 0.8,
//       sortable: false,
//       renderCell: (params) => (
//         <Box>
//           <IconButton 
//             size="small" 
//             onClick={() => handleEdit(params.row)} 
//             sx={{ mr: 1, color: 'primary.main' }}
//             disabled={loading}
//           >
//             <EditIcon fontSize="small" />
//           </IconButton>
//           <IconButton 
//             size="small" 
//             onClick={() => handleDelete(params.row._id)} 
//             sx={{ color: 'error.main' }}
//             disabled={loading}
//           >
//             <DeleteIcon fontSize="small" />
//           </IconButton>
//         </Box>
//       )
//     }
//   ];

//   return (
//     <>
    
//       <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
//         {/* Form Card */}
//         <Paper elevation={8} sx={{ borderRadius: 3 , p: 0.2 }}>
//           <Card sx={{ borderRadius: 3 }}>
//             <Box sx={{ background: 'primary', color: 'primary', p: 3, textAlign: 'center' }}>
             
//               <Typography variant="h4" fontWeight="bold" sx={{color: 'white'}}>
//                 Product Purchases
//               </Typography>
//               <Typography variant="subtitle1" sx={{color: 'white'}}>Upload purchase bill with details</Typography>
//             </Box>
            

//             <CardContent sx={{ p: 4 }}>
//               {showSuccess && (
//                 <Fade in={showSuccess}>
//                   <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 3, borderRadius: 2 }}>
//                     Purchase {editingId ? 'updated' : 'submitted'} successfully!
//                   </Alert>
//                 </Fade>
//               )}

//               <form onSubmit={handleSubmit}>
//                 <Grid container spacing={3}>
//                   <Grid item xs={6}>
//                     <Autocomplete
//                       options={products}
//                       getOptionLabel={(option) => option.productName}
//                       value={products.find((p) => p.productId === formData.productId) || null}
//                       onChange={handleProductChange}
//                       disabled={loading}
//                       renderInput={(params) => <TextField {...params} label="Product" required sx={inputStyling} />}
//                     />
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Autocomplete
//                       options={vendors}
//                       getOptionLabel={(option) => option.vendorName}
//                       value={vendors.find((v) => v.vendorId === formData.vendorId) || null}
//                       onChange={handleVendorChange}
//                       disabled={loading}
//                       renderInput={(params) => <TextField {...params} label="Vendor" required sx={inputStyling} />}
//                     />
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Autocomplete
//                       options={unitOptions}
//                       getOptionLabel={(option) => option.label}
//                       value={unitOptions.find((u) => u.value === formData.unit) || null}
//                       onChange={handleUnitChange}
//                       disabled={loading}
//                       renderInput={(params) => <TextField {...params} label="Unit" required sx={inputStyling} />}
//                     />
//                   </Grid>
//                   <Grid item xs={6}>
//                     <TextField
//                       label="Quantity"
//                       type="text"
//                       value={formData.quantity}
//                       onChange={handleChange('quantity')}
//                       inputProps={{ min: 1, step: 'any' }}
//                       fullWidth
//                       required
//                       disabled={loading}
//                       sx={inputStyling}
//                     />
//                   </Grid>
//                   <Grid item xs={6}>
//                     <TextField
//                       label="Unit Price"
//                       type="text"
//                       value={formData.price}
//                       onChange={handleChange('price')}
//                       inputProps={{ min: 0, step: 'any' }}
//                       fullWidth
//                       required
//                       disabled={loading}
//                       sx={inputStyling}
//                     />
//                   </Grid>

//                   {isFormValid && (
//                     <Grid item xs={12}>
//                       <Zoom in={true}>
//                         <Paper
//                           sx={{ p: 2, borderRadius: 2, textAlign: 'center', background: 'linear-gradient(to right, #f093fb, #f5576c)' }}
//                         >
//                           <Typography variant="h5" color="white" fontWeight="bold">
//                             Total: Rs. {calculateTotal()}
//                           </Typography>
//                         </Paper>
//                       </Zoom>
//                     </Grid>
//                   )}

//                   <Grid item xs={12}>
//                     <Divider sx={{ my: 2 }}>
//                       <Chip label="Bill Upload" />
//                     </Divider>
//                     <Box sx={{ textAlign: 'center' }}>
//                       <input hidden accept="image/*,.pdf" id="file-upload" type="file" onChange={handleFileUpload} />
//                       <label htmlFor="file-upload">
//                         <Button variant="outlined" component="span" startIcon={<CloudUpload />} disabled={loading}>
//                           Upload Bill
//                         </Button>
//                       </label>
//                     </Box>
//                     {uploadedFile && (
//                       <Fade in={true}>
//                         <Paper sx={{ mt: 2, p: 2, borderRadius: 2, backgroundColor: '#e8f5e9' }}>
//                           <Box display="flex" justifyContent="space-between" alignItems="center">
//                             <Typography variant="body2">
//                               <Receipt /> {uploadedFile.name}
//                             </Typography>
//                             <IconButton onClick={removeFile} color="error" disabled={loading}>
//                               <Delete />
//                             </IconButton>
//                           </Box>
//                         </Paper>
//                       </Fade>
//                     )}
//                   </Grid>

//                   <Grid item xs={12}>
//                     <Button 
//                       type="submit" 
//                       fullWidth 
//                       variant="contained" 
//                       disabled={!isFormValid || loading}
//                     >
//                       {loading 
//                         ? 'Processing...' 
//                         : editingId 
//                           ? 'Update Purchase' 
//                           : 'Submit Purchase'
//                       }
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </form>
//             </CardContent>
//           </Card>
//         </Paper>

//         {/* Preview Dialog */}
//         <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
//           <DialogContent sx={{ p: 0 }}>
//             {previewType === 'pdf' ? (
//               <embed src={previewImage} type="application/pdf" width="100%" height="600px" />
//             ) : (
//               <img src={previewImage} alt="Bill Preview" style={{ width: '100%', height: 'auto' }} />
//             )}
//           </DialogContent>
//         </Dialog>
//       </Box>

//       <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
//         <Box sx={{ width: '100%' }}>
//           <Card
//             elevation={8}
//             sx={{
//               borderRadius: 3,
//               background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
//               border: '1px solid',
//               borderColor: 'divider'
//             }}
//           >
//             <CardContent sx={{ p: 4 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                 <InventoryIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
//                 <Typography variant="h5" fontWeight="bold" color="primary">
//                   Purchase Details ({purchaseList.length})
//                 </Typography>
//               </Box>
//               {purchaseList.length === 0 ? (
//                 <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: 2 }}>
//                   <ProductIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
//                   <Typography variant="h6" color="text.secondary" gutterBottom>
//                     No Products Registered Yet
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Register your first product using the form above
//                   </Typography>
//                 </Paper>
//               ) : (
//                 <DataGrid
//                   rows={purchaseList}
//                   columns={purchaseDetailColumns}
//                   getRowId={(row) => row._id}
//                   slots={{ toolbar: GridToolbar }}
//                   slotProps={{
//                     toolbar: {
//                       showQuickFilter: true,
//                       quickFilterProps: { debounceMs: 500 }
//                     }
//                   }}
//                   loading={loading}
//                   autoHeight
//                   pageSizeOptions={[5, 10, 25, 50]}
//                 />
//               )}
//             </CardContent>
//           </Card>
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default ProductPurchaseComponent;




import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Snackbar,
  CardContent,
  Typography,
  Grid,
  Paper,
  TextField,
  IconButton,
  Alert,
  Fade,
  Autocomplete,
  Divider,
  Chip,
  Zoom,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  Dialog,
  DialogContent
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Inventory as InventoryIcon } from '@mui/icons-material';
import ProductIcon from '@mui/icons-material/Category';
import { ShoppingCart, CloudUpload, Delete, Edit, CheckCircle, Receipt, PictureAsPdf } from '@mui/icons-material';
import { urls } from '@/core/Constant/urls';
import { getApi, postApi, updateApi, deleteApi } from '@/core/apis/api';
import { tokenPayload } from '@/helper';

const unitOptions = [
  { value: 'number', label: 'Number (pcs)' },
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'meter', label: 'Meter (m)' },
  { value: 'feet', label: 'Feet (ft)' }
];

const ProductPurchaseComponent = () => {
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    vendorId: '',
    vendorName: '',
    unit: '',
    quantity: '',
    price: '',
    billNumber: ''
  });

  const [uploadedFile, setUploadedFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [purchaseList, setPurchaseList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const payload = tokenPayload();
  
  const inputStyling = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '&:hover fieldset': {
        borderColor: '#667eea'
      }
    }
  };

  useEffect(() => {
    fetchDropdowns();
    fetchPurchases();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const response = await getApi(`${urls.Inventory.dropDowns}?companyId=${payload._id}`);
      const { productName, vendorName } = response.data;
      setProducts(
        productName.map((p) => ({
          productId: p._id,
          productName: p.productName
        }))
      );
      setVendors(
        vendorName.map((v) => ({
          vendorId: v._id,
          vendorName: v.vendorName
        }))
      );
    } catch {
      setSnackbar({ open: true, message: 'Failed to fetch dropdowns.', severity: 'error' });
    }
  };

  const fetchPurchases = async () => {
    try {
      const response = await getApi(`${urls.Inventory.getAllPurchaseDetails}?companyId=${payload._id}`);
      console.log("All Purchased :", response?.data);
      setPurchaseList(response.data);
    } catch {
      setSnackbar({ open: true, message: 'Failed to fetch purchase records.', severity: 'error' });
    }
  };

  // Generate voucher for new purchases (not for edits)
  const generateVoucher = async () => {
    try {
      setLoading(true);
      const response = await getApi(urls.Voucher.createVoucher, { prefix: "AP" });
      console.log("Generated voucher:", response?.data);
      return response?.data?.voucherNo || response?.data || '';
    } catch (error) {
      console.error('Error generating voucher:', error);
      setSnackbar({ open: true, message: 'Failed to generate bill number.', severity: 'error' });
      return '';
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let billNumber = formData.billNumber;
      
      // Generate new voucher only for new purchases (not edits)
      if (!editingId) {
        billNumber = await generateVoucher();
        if (!billNumber) {
          setSnackbar({ open: true, message: 'Failed to generate bill number.', severity: 'error' });
          return;
        }
      }

      console.log('Using billNumber:', billNumber);

      const form = new FormData();
      form.append('productId', formData.productId);
      form.append('productName', formData.productName);
      form.append('vendorId', formData.vendorId);
      form.append('vendorName', formData.vendorName);
      form.append('unit', formData.unit);
      form.append('quantity', formData.quantity);
      form.append('price', formData.price);
      form.append('billNumber', billNumber);
      
      if (uploadedFile) {
        form.append('bill', uploadedFile);
      }

      if (editingId) {
        await updateApi(`${urls.Inventory.editPurchaseDetails}/${editingId}`, form);
        setSnackbar({ open: true, message: 'Purchase updated successfully.', severity: 'success' });
      } else {
        await postApi(`${urls.Inventory.postPurchaseDetails}?companyId=${payload._id}`, form);
        setSnackbar({ open: true, message: 'Purchase submitted successfully.', severity: 'success' });
      }

      // Refresh data and reset form
      await fetchPurchases();
      resetForm();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      console.error('Submit error:', error);
      setSnackbar({ open: true, message: 'Operation failed. Please try again.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ 
      productId: '', 
      productName: '', 
      vendorId: '', 
      vendorName: '', 
      unit: '', 
      quantity: '', 
      price: '', 
      billNumber: '' 
    });
    setUploadedFile(null);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteApi(`${urls.Inventory.deletePurchaseDetails}/${id}`);
      await fetchPurchases();
      setSnackbar({ open: true, message: 'Deleted successfully.', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Delete failed.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setFormData({
      productId: record.productId,
      productName: record.productName,
      vendorId: record.vendorId,
      vendorName: record.vendorName,
      unit: record.unit,
      quantity: String(record.quantity ?? ''),
      price: String(record.unitPerPrice ?? ''),
      billNumber: record.billNumber || '' // Keep existing bill number for edits
    });
    setEditingId(record._id);

    if (record.bill) {
      setUploadedFile({ name: record.bill, preview: `http://localhost:7200/${record.bill}` });
    } else {
      setUploadedFile(null);
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;

    // Only allow digits or decimal for quantity and price
    if (field === 'quantity' || field === 'price') {
      if (!/^\d*\.?\d*$/.test(value)) return; // Reject invalid chars
    }

    console.log('Raw value:', value);
    setFormData({ ...formData, [field]: value });
  };

  const handleProductChange = (e, value) => {
    setFormData({ ...formData, productId: value?.productId || '', productName: value?.productName || '' });
  };

  const handleVendorChange = (e, value) => {
    setFormData({ ...formData, vendorId: value?.vendorId || '', vendorName: value?.vendorName || '' });
  };

  const handleUnitChange = (e, value) => {
    setFormData({ ...formData, unit: value?.value || '' });
  };

  const calculateTotal = () => {
    const price = parseFloat(formData.price);
    const qty = parseFloat(formData.quantity);
    if (isNaN(price) || isNaN(qty)) return 0;
    return Math.round(price * qty);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      console.log(file);
      setUploadedFile(file);
    }
  };

  const removeFile = () => setUploadedFile(null);

  const isFormValid =
    formData.productId &&
    formData.vendorId &&
    formData.unit &&
    formData.quantity !== '' &&
    formData.price !== '' &&
    !isNaN(Number(formData.quantity)) &&
    !isNaN(Number(formData.price)) &&
    Number(formData.quantity) > 0 &&
    Number(formData.price) > 0;

  const handlePreviewImage = (billPath) => {
    const fullUrl = `http://localhost:7200/${billPath}`;
    const isPDF = fullUrl.toLowerCase().endsWith('.pdf');
    setPreviewImage(fullUrl);
    setPreviewType(isPDF ? 'pdf' : 'image');
    setPreviewOpen(true);
  };

  const purchaseDetailColumns = [
    { field: 'billNumber', headerName: 'Bill Number', flex: 1 },
    { field: 'productName', headerName: 'Product', flex: 1 },
    { field: 'vendorName', headerName: 'Vendor', flex: 1 },
    { field: 'quantity', headerName: 'Quantity', flex: 1 },
    { field: 'unit', headerName: 'Unit', flex: 1 },
    { field: 'unitPerPrice', headerName: 'Price', flex: 1 },
    { field: 'total', headerName: 'Total', flex: 1, valueGetter: (params) => (params.row.unitPerPrice * params.row.quantity).toFixed(2) },
    {
      field: 'bill',
      headerName: 'Bill',
      flex: 1,
      renderCell: (params) => {
        const bill = params.row.bill;

        if (!bill) return '-';

        if (bill.toLowerCase().endsWith('.pdf')) {
          return (
            <Tooltip title="View PDF">
              <IconButton onClick={() => handlePreviewImage(bill)}>
                <PictureAsPdf color="action" />
              </IconButton>
            </Tooltip>
          );
        }

        return (
          <Box
            role="button"
            tabIndex={0}
            onClick={() => handlePreviewImage(bill)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handlePreviewImage(bill)}
            sx={{
              width: 60,
              height: 60,
              cursor: 'pointer',
              outline: 'none',
              borderRadius: 1,
              overflow: 'hidden',
              display: 'inline-block'
            }}
            aria-label="Preview bill image"
          >
            <img src={`http://localhost:7200/${bill}`} alt="Bill" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton 
            size="small" 
            onClick={() => handleEdit(params.row)} 
            sx={{ mr: 1, color: 'primary.main' }}
            disabled={loading}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => handleDelete(params.row._id)} 
            sx={{ color: 'error.main' }}
            disabled={loading}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    }
  ];

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
          Product Purchases
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
          Upload purchase bill with details
        </Typography>
      </Box>

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={products}
              getOptionLabel={(option) => option.productName}
              value={products.find((p) => p.productId === formData.productId) || null}
              onChange={handleProductChange}
              renderInput={(params) => (
                <TextField {...params} label="Product" required sx={inputStyling} />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={vendors}
              getOptionLabel={(option) => option.vendorName}
              value={vendors.find((v) => v.vendorId === formData.vendorId) || null}
              onChange={handleVendorChange}
              renderInput={(params) => (
                <TextField {...params} label="Vendor" required sx={inputStyling} />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={unitOptions}
              getOptionLabel={(option) => option.label}
              value={unitOptions.find((u) => u.value === formData.unit) || null}
              onChange={handleUnitChange}
              renderInput={(params) => (
                <TextField {...params} label="Unit" required sx={inputStyling} />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Quantity"
              type="text"
              value={formData.quantity}
              onChange={handleChange("quantity")}
              required
              sx={inputStyling}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Unit Price"
              type="text"
              value={formData.price}
              onChange={handleChange("price")}
              required
              sx={inputStyling}
            />
          </Grid>

          {/* Total */}
          {isFormValid && (
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 2,
                  textAlign: "center",
                  background: "linear-gradient(to right, #f093fb, #f5576c)",
                }}
              >
                <Typography variant="h6" color="white" fontWeight="bold">
                  Total: Rs. {calculateTotal()}
                </Typography>
              </Paper>
            </Grid>
          )}

          {/* Bill Upload */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }}>
              <Chip label="Bill Upload" />
            </Divider>
            <Box sx={{ textAlign: "center" }}>
              <input
                hidden
                accept="image/*,.pdf"
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
              />
              <label htmlFor="file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                >
                  Upload Bill
                </Button>
              </label>
            </Box>
            {uploadedFile && (
              <Paper
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#e8f5e9",
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">
                    <Receipt /> {uploadedFile.name}
                  </Typography>
                  <IconButton onClick={removeFile} color="error">
                    <Delete />
                  </IconButton>
                </Box>
              </Paper>
            )}
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box textAlign="center">
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                disabled={!isFormValid}
              >
                {editingId ? "Update Purchase" : "Submit Purchase"}
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
          Purchase Details ({purchaseList.length})
        </Typography>
      </Box>

      {purchaseList.length === 0 ? (
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
            No Purchases Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Submit your first purchase using the form above
          </Typography>
        </Paper>
      ) : (
        <DataGrid
          rows={purchaseList}
          columns={purchaseDetailColumns}
          getRowId={(row) => row._id}
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

export default ProductPurchaseComponent;












