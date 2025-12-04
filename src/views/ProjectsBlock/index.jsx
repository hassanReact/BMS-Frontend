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
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   FormLabel,
//   Autocomplete,
//   Zoom,
//   Select,
//   MenuItem
// } from '@mui/material';
// import {
//   AccountTree,
//   Save as SaveIcon,
//   Delete as DeleteIcon,
//   Edit as EditIcon,
//   FolderOpen as FolderIcon,
//   Add as AddIcon
// } from '@mui/icons-material';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { useEffect } from 'react';
// import { getApi, postApi, updateApi, patchApi } from '@/core/apis/api';
// import { tokenPayload } from '@/helper';
// import { toast } from 'react-toastify';
// import { useTranslation } from 'react-i18next';
// import { urls } from '@/core/Constant/urls';

// const ProjectsBlocks = () => {
//   const { t } = useTranslation();
//   const [formData, setFormData] = useState({
//     //projectName: '',
//     projectId: '',
//     blockName: '',
//     description: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [createdBlocks, setCreatedBlocks] = useState([]);
//   const [projectData, setProjectData] = useState([]);
//   const [openAdd, setOpenAdd] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [openDelete, setOpenDelete] = useState(false);
//   const [editingBlock, setEditingBlock] = useState(null);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success'
//   });

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const payload = tokenPayload();

//   const fetchProjectData = async () => {
//     const response = await getApi(urls.project.getAll, { id: payload._id });
//     setProjectData(response?.data || []);
//   };

//   useEffect(() => {
//     if (isModalOpen) {
//       fetchProjectData();
//     }
//   }, [isModalOpen]);

//   const fetchBlockData = async () => {
//     try {
//       const response = await getApi(urls.block.getAll, { id: payload.companyId });

//       if (response?.data) {
//         const formattedData = response.data.map((item) => ({
//           ...item,
//           projectName: item.projectId?.projectName
//         }));
//         setCreatedBlocks(formattedData);
//       } else {
//         setCreatedBlocks([]);
//       }
//     } catch (error) {
//       setCreatedBlocks([]);
//     }
//   };

//   useEffect(() => {
//     fetchBlockData();
//   }, [openAdd, isModalOpen, openDelete, openEdit]);


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

//   const AddBlock = async (formData) => {
//     formData.companyId = payload.companyId;
//     try {
//       const response = await postApi(urls.block.create, formData);
//       if (response.success && response.data) {
//         toast.success(t('Successfully registered'));
//         return response.data;
//       } else {
//         toast.error(t('Failed to register block'));
//         return null;
//       }
//     } catch (err) {
//       console.error(err);
//       //setLoading(false);
//       toast.error(t('Something went wrong!'));
//       return null;
//     }

//   };

//   const editBlock = async (formData) => {
//     //setLoading(true);
//     formData.companyId = payload.companyId;
//     try {
//       const response = await updateApi(urls.block.updateBlock, formData, { id: formData._id });
//       if (response.success) {
//         toast.success(t('Block updated Successfully'));
//         //resetForm();
//         //handleClose();
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error('Something went wrong!');
//       //setLoading(false);
//     }

//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.projectId.trim()) {
//       newErrors.projectId = 'Project selection is required';
//     }
//     if (!formData.blockName.trim()) {
//       newErrors.blockName = 'Block name is required';
//     } else if (formData.blockName.length < 1) {
//       newErrors.blockName = 'Block name must be at least 3 characters';
//     }
  
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleOpenModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingBlock(null);
//     setFormData({
//       projectId: '',
//       blockName: '',
//       description: ''
//     });
//     setErrors({});
//   };



//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!validateForm()) {
//       setSnackbar({ open: true, message: 'Please fix the errors', severity: 'error' });
//       return;
//     }

//     const finalData = {
//       ...formData,
//       description: formData.description.trim() === ""
//       ? "No description available"
//       : formData.description
//     }

//     if (editingBlock) {
//       // ✅ EDIT FLOW
//       const updatedBlock = await editBlock({ ...finalData, _id: editingBlock._id });

//       if (updatedBlock) {
//         setCreatedBlocks((prev) => prev.map((block) => (block._id === updatedBlock._id ? updatedBlock : block)));
//         setSnackbar({ open: true, message: 'Block updated!', severity: 'success' });
//       }
//     } else {
//       // ✅ CREATE FLOW
//       const newBlock = await AddBlock(finalData);
//       if (newBlock) {
//         setCreatedBlocks((prev) => [newBlock, ...prev]);
//         setSnackbar({ open: true, message: 'Block created!', severity: 'success' });
//       }
//     }

//     handleCloseModal();
//   };

//   const handleEditBlock = (block) => {
//     setFormData({
//       //projectName: block.projectName,
//       projectId: block.projectId._id,
//       blockName: block.blockName,
//       description: block.description
//     });
//     setEditingBlock(block);
//     setIsModalOpen(true);
//   };

//   const handleDeleteBlock = async (blockId) => {
//     setCreatedBlocks((prev) => prev.filter((block) => block._id !== blockId));
//     try {
//       const result = await patchApi(urls.block.delete, { isDeleted: true }, { id: blockId });

//       if (result?.success) {
//         toast.success(t('Block Deleted Successfully'));
//         //handleClose();
//       }
//     } catch (error) {
//       console.error('Error deleting Block:', error);
//       toast.error(t('Error deleting Block'));
//       //setLoading(false);
//     }
//     setSnackbar({
//       open: true,
//       message: 'Block deleted successfully!',
//       severity: 'info'
//     });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   // Common styling for all inputs
//   const inputStyling = {
//     '& .MuiOutlinedInput-root': {
//       borderRadius: 2,
//       transition: 'all 0.3s ease',
//       '&:hover': {
//         boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
//       },
//       '&.Mui-focused': {
//         boxShadow: '0 4px 12px rgba(102,126,234,0.3)'
//       },
//       '&:hover fieldset': {
//         borderColor: '#667eea'
//       }
//     }
//   };

//   // DataGrid columns for created blocks
//   const createdBlocksColumns = [
//     {
//       field: 'serialNo',
//       headerName: 'S.No.',
//       width: 80,
//       renderCell: (params) => {
//         const rowIndex = createdBlocks.findIndex((row) => row._id === params.row._id);
//         return rowIndex + 1;
//       }
//     },
//     {
//       field: 'projectName',
//       headerName: 'Project Name',
//       flex: 1.2,
//       renderCell: (params) => (
//         <Typography fontWeight="bold" color="primary">
//           {params.row.projectName}
//         </Typography>
//       )
//     },
//     {
//       field: 'blockName',
//       headerName: 'Block Name',
//       flex: 1,
//       renderCell: (params) => (
//         <Typography variant="body2" fontWeight="medium">
//           {params.row.blockName}
//         </Typography>
//       )
//     },

    
//     {
//       field: 'description',
//       headerName: 'Description',
//       flex: 1.5,
//       renderCell: (params) => (
//         <Typography
//           variant="body2"
//           sx={{
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap'
//           }}
//         >
//           {params.row.description}
//         </Typography>
//       )
//     },
//     {
//       field: 'actions',
//       headerName: 'Actions',
//       flex: 0.8,
//       sortable: false,
//       renderCell: (params) => (
//         <Box>
//           <IconButton size="small" onClick={() => handleEditBlock(params.row)} sx={{ mr: 1, color: 'primary.main' }}>
//             <EditIcon fontSize="small" />
//           </IconButton>
//           <IconButton size="small" onClick={() => handleDeleteBlock(params.row._id)} sx={{ color: 'error.main' }}>
//             <DeleteIcon fontSize="small" />
//           </IconButton>
//         </Box>
//       )
//     }
//   ];

//   return (
//     <Container maxWidth="lg" sx={{ py: 3 }}>
//       <Fade in={true} timeout={800}>
//         <Box>
//           {/* Header */}
//           <Box textAlign="center" mb={3}>
//             {/* <AccountTree
//               sx={{
//                 fontSize: 48,
//                 color: 'primary.main',
//                 mb: 2
//               }}
//             /> */}
//             <Typography
//               variant="h3"
//               component="h1"
//               gutterBottom
//               sx={{
//                 fontWeight: 700,
//                 background: '#2196f3',
//                 backgroundClip: 'text',
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent'
//               }}
//             >
//               Projects Blocks
//             </Typography>
//             <Typography variant="h6" color="text.secondary" sx={{ marginBottom: '40px' }}>
//               Create and manage project blocks efficiently
//             </Typography>
//           </Box>

//           {/* Created Blocks Data Table */}
//           <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
//             <Box sx={{ width: '100%' }}>
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
//                   <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                       <FolderIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
//                       <Typography variant="h5" fontWeight="bold" color="primary">
//                         Created Blocks ({createdBlocks.length})
//                       </Typography>
//                     </Box>
//                     <Button
//                       variant="contained"
//                       startIcon={<AddIcon />}
//                       onClick={handleOpenModal}
//                       sx={{
//                         px: 3,
//                         py: 1,
//                         borderRadius: 2,
//                         fontSize: '1rem',
//                         fontWeight: 600,
//                         background: '#2196f3',
//                         boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
//                         transition: 'all 0.3s ease',
//                         '&:hover': {
//                           background: '#1e88e5',
//                           boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
//                           transform: 'translateY(-2px)'
//                         }
//                       }}
//                     >
//                       Add New Block
//                     </Button>
//                   </Box>

//                   {createdBlocks.length === 0 ? (
//                     <Paper
//                       sx={{
//                         p: 4,
//                         textAlign: 'center',
//                         backgroundColor: '#f5f5f5',
//                         borderRadius: 2
//                       }}
//                     >
//                       <AccountTree sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
//                       <Typography variant="h6" color="text.secondary" gutterBottom>
//                         No Blocks Created Yet
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                         Get started by creating your first project block
//                       </Typography>
//                       <Button
//                         variant="contained"
//                         startIcon={<AddIcon />}
//                         onClick={handleOpenModal}
//                         sx={{
//                           mt: 2,
//                           background: '#2196f3'
//                         }}
//                       >
//                         Add New Block
//                       </Button>
//                     </Paper>
//                   ) : (
//                     <DataGrid
//                       rows={createdBlocks}
//                       columns={createdBlocksColumns}
//                       getRowId={(row) => row._id}
//                       slots={{ toolbar: GridToolbar }}
//                       slotProps={{
//                         toolbar: {
//                           showQuickFilter: true,
//                           quickFilterProps: { debounceMs: 500 }
//                         }
//                       }}
//                       autoHeight
//                       initialState={{
//                         pagination: {
//                           paginationModel: { page: 0, pageSize: 10 }
//                         }
//                       }}
//                       pageSizeOptions={[5, 10, 25, 50]}
//                       sx={{
//                         '& .MuiDataGrid-root': {
//                           border: 'none'
//                         },
//                         '& .MuiDataGrid-cell': {
//                           borderBottom: '1px solid #f0f0f0',
//                           py: 1
//                         },
//                         '& .MuiDataGrid-columnHeaders': {
//                           backgroundColor: '#f8f9fa',
//                           borderBottom: '2px solid #dee2e6',
//                           fontWeight: 'bold'
//                         },
//                         '& .MuiDataGrid-row:hover': {
//                           backgroundColor: '#f5f5f5'
//                         }
//                       }}
//                     />
//                   )}
//                 </CardContent>
//               </Card>
//             </Box>
//           </Box>
//         </Box>
//       </Fade>

      // {/* Block Creation Modal */}
      // <Dialog
      //   open={isModalOpen}
      //   onClose={handleCloseModal}
      //   maxWidth="md"
      //   fullWidth
      //   PaperProps={{
      //     sx: {
      //       borderRadius: 3,
      //       background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
      //     }
      //   }}
      // >
      //   <DialogTitle sx={{ pb: 1 }}>
      //     <Box sx={{ display: 'flex', alignItems: 'center' }}>
      //       <AccountTree sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
      //       <Typography variant="h5" fontWeight="bold" color="primary">
      //         {editingBlock ? 'Update Block' : 'Create New Block'}
      //       </Typography>
      //     </Box>
      //     <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
      //       {editingBlock ? 'Update block information' : 'Fill in the details to create your new project block'}
      //     </Typography>
      //   </DialogTitle>

      //   <DialogContent sx={{ pt: 2 }}>
      //     {editingBlock && (
      //       <Box sx={{ mb: 3, p: 2, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
      //         <Typography variant="body2" color="primary" fontWeight="bold">
      //           Editing: {editingBlock.blockName}
      //         </Typography>
      //       </Box>
      //     )}

      //     <form onSubmit={handleSubmit} id="block-form">
      //       <Grid container spacing={3}>
      //         {/* Project Name - Autocomplete */}
      //         <Grid item xs={12} sm={6}>
      //           <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Project Name</FormLabel>
      //           <Select
      //             id="projectId"
      //             name="projectId"
      //             //size="small"
      //             fullWidth
              
      //             value={formData.projectId}
      //             onChange={handleInputChange('projectId')}
      //             error={!!errors.projectId}
      //             helperText={errors.projectId}
      //             variant="outlined"
      //             sx={{
      //               '& .MuiOutlinedInput-root': {
      //                 borderRadius: 2,
      //                 transition: 'all 0.3s ease',
      //                 '&:hover': {
      //                   boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      //                 },
      //                 '&.Mui-focused': {
      //                   boxShadow: '0 4px 12px rgba(25,118,210,0.3)'
      //                 }
      //               }
      //             }}
      //           >
      //             {/* <MenuItem value="" disabled>{t('Select Project')}</MenuItem> */}
      //             {projectData.map((project) => (
      //               <MenuItem key={project._id} value={project._id}>
      //                 {project.projectName}
      //                 {console.log('project name', project.projectName)}
      //               </MenuItem>
      //             ))}
      //           </Select>
      //         </Grid>

      //         {/* Block Name */}
      //         <Grid item xs={12} sm={6}>
      //           <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Block Name</FormLabel>
      //           <TextField
      //             fullWidth
      //             //label="Block Name"
      //             variant="outlined"
      //             value={formData.blockName}
      //             onChange={handleInputChange('blockName')}
      //             required
      //             error={!!errors.blockName}
      //             helperText={errors.blockName}
      //             placeholder="Enter block name"
      //             sx={inputStyling}
      //           />
      //         </Grid>

           
      //         <Grid item xs={12}>
      //           <TextField
      //             fullWidth
      //             label="Description"
      //             variant="outlined"
      //             multiline
      //             rows={4}
      //             value={formData.description}
      //             onChange={handleInputChange('description')}
      //             error={!!errors.description}
      //             helperText={errors.description}
      //             placeholder="No Description Available"
      //             sx={inputStyling}
      //           />
      //         </Grid>

          
      //       </Grid>
      //     </form>
      //   </DialogContent>

      //   <DialogActions sx={{ p: 3, pt: 1 }}>
      //     <Button
      //       onClick={handleCloseModal}
      //       variant="outlined"
      //       sx={{
      //         borderRadius: 2,
      //         px: 3
      //       }}
      //     >
      //       Cancel
      //     </Button>
      //     <Button
      //       type="submit"
      //       form="block-form"
      //       variant="contained"
      //       startIcon={<SaveIcon />}
      //       sx={{
      //         px: 4,
      //         borderRadius: 2,
      //         fontSize: '1rem',
      //         fontWeight: 600,
      //         background: '#2196f3',
      //         boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
      //         transition: 'all 0.3s ease',
      //         '&:hover': {
      //           background: '#1e88e5',
      //           boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
      //           transform: 'translateY(-2px)'
      //         }
      //       }}
      //     >
      //       {editingBlock ? 'Update Block' : 'Create Block'}
      //     </Button>
      //   </DialogActions>
      // </Dialog>

      // <Snackbar
      //   open={snackbar.open}
      //   autoHideDuration={4000}
      //   onClose={handleCloseSnackbar}
      //   anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      // >
      //   <Alert
      //     onClose={handleCloseSnackbar}
      //     severity={snackbar.severity}
      //     sx={{
      //       width: '100%',
      //       borderRadius: 2,
      //       boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
      //     }}
      //   >
      //     {snackbar.message}
      //   </Alert>
      // </Snackbar>
//     </Container>
//   );
// };

// export default ProjectsBlocks;






import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Fade,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormLabel,
  Autocomplete,
  Zoom,
  Select,
  MenuItem
} from '@mui/material';
import {
  AccountTree,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FolderOpen as FolderIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect } from 'react';
import { getApi, postApi, updateApi, patchApi } from '@/core/apis/api';
import { tokenPayload } from '@/helper';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { urls } from '@/core/Constant/urls';

const ProjectsBlocks = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    //projectName: '',
    projectId: '',
    blockName: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [createdBlocks, setCreatedBlocks] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const payload = tokenPayload();

  const fetchProjectData = async () => {
    const response = await getApi(urls.project.getAll, { id: payload._id });
    setProjectData(response?.data || []);
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchProjectData();
    }
  }, [isModalOpen]);

  const fetchBlockData = async () => {
    try {
      const response = await getApi(urls.block.getAll, { id: payload.companyId });

      if (response?.data) {
        const formattedData = response.data.map((item) => ({
          ...item,
          projectName: item.projectId?.projectName
        }));
        setCreatedBlocks(formattedData);
      } else {
        setCreatedBlocks([]);
      }
    } catch (error) {
      setCreatedBlocks([]);
    }
  };

  useEffect(() => {
    fetchBlockData();
  }, [openAdd, isModalOpen, openDelete, openEdit]);


  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  const AddBlock = async (formData) => {
    formData.companyId = payload.companyId;
    try {
      const response = await postApi(urls.block.create, formData);
      if (response.success && response.data) {
        toast.success(t('Successfully registered'));
        return response.data;
      } else {
        toast.error(t('Failed to register block'));
        return null;
      }
    } catch (err) {
      console.error(err);
      //setLoading(false);
      toast.error(t('Something went wrong!'));
      return null;
    }

  };

  const editBlock = async (formData) => {
    //setLoading(true);
    formData.companyId = payload.companyId;
    try {
      const response = await updateApi(urls.block.updateBlock, formData, { id: formData._id });
      if (response.success) {
        toast.success(t('Block updated Successfully'));
        //resetForm();
        //handleClose();
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
      //setLoading(false);
    }

  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.projectId.trim()) {
      newErrors.projectId = 'Project selection is required';
    }
    if (!formData.blockName.trim()) {
      newErrors.blockName = 'Block name is required';
    } else if (formData.blockName.length < 1) {
      newErrors.blockName = 'Block name must be at least 3 characters';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBlock(null);
    setFormData({
      projectId: '',
      blockName: '',
      description: ''
    });
    setErrors({});
  };



  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      setSnackbar({ open: true, message: 'Please fix the errors', severity: 'error' });
      return;
    }

    const finalData = {
      ...formData,
      description: formData.description.trim() === ""
      ? "No description available"
      : formData.description
    }

    if (editingBlock) {
      // ✅ EDIT FLOW
      const updatedBlock = await editBlock({ ...finalData, _id: editingBlock._id });

      if (updatedBlock) {
        setCreatedBlocks((prev) => prev.map((block) => (block._id === updatedBlock._id ? updatedBlock : block)));
        setSnackbar({ open: true, message: 'Block updated!', severity: 'success' });
      }
    } else {
      const newBlock = await AddBlock(finalData);
      if (newBlock) {
        setCreatedBlocks((prev) => [newBlock, ...prev]);
        setSnackbar({ open: true, message: 'Block created!', severity: 'success' });
      }
    }

    handleCloseModal();
  };

  const handleEditBlock = (block) => {
    setFormData({
      //projectName: block.projectName,
      projectId: block.projectId._id,
      blockName: block.blockName,
      description: block.description
    });
    setEditingBlock(block);
    setIsModalOpen(true);
  };

  const handleDeleteBlock = async (blockId) => {
    setCreatedBlocks((prev) => prev.filter((block) => block._id !== blockId));
    try {
      const result = await patchApi(urls.block.delete, { isDeleted: true }, { id: blockId });

      if (result?.success) {
        toast.success(t('Block Deleted Successfully'));
        //handleClose();
      }
    } catch (error) {
      console.error('Error deleting Block:', error);
      toast.error(t('Error deleting Block'));
      //setLoading(false);
    }
    setSnackbar({
      open: true,
      message: 'Block deleted successfully!',
      severity: 'info'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Common styling for all inputs
  const inputStyling = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      },
      '&.Mui-focused': {
        boxShadow: '0 4px 12px rgba(102,126,234,0.3)'
      },
      '&:hover fieldset': {
        borderColor: '#667eea'
      }
    }
  };

  // DataGrid columns for created blocks
  const createdBlocksColumns = [
    {
      field: 'serialNo',
      headerName: 'S.No.',
      width: 80,
      renderCell: (params) => {
        const rowIndex = createdBlocks.findIndex((row) => row._id === params.row._id);
        return rowIndex + 1;
      }
    },
    {
      field: 'projectName',
      headerName: 'Project Name',
      flex: 1.2,
      renderCell: (params) => (
        <Typography fontWeight="bold" color="primary">
          {params.row.projectName}
        </Typography>
      )
    },
    {
      field: 'blockName',
      headerName: 'Block Name',
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          {params.row.blockName}
        </Typography>
      )
    },

    
    {
      field: 'description',
      headerName: 'Description',
      flex: 1.5,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {params.row.description}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton size="small" onClick={() => handleEditBlock(params.row)} sx={{ mr: 1, color: 'primary.main' }}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDeleteBlock(params.row._id)} sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    }
  ];


  return (
  <Container maxWidth="lg" sx={{ p: 0 }}>
    <Fade in={true} timeout={800}>
      <Box>
        {/* Main Card – Entire Content */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            // border: "1px solid",
            borderColor: "divider",
            minHeight: "440px",
          }}
        >
          <CardContent sx={{ p: 1 }}>
            {/* Header (inside Card now) */}
            <Box textAlign="center" mb={5}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: "22px",
                }}
              >
                Project Blocks
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ marginBottom: "30px" }}
              >
                Create and manage project blocks efficiently
              </Typography>
            </Box>

            {/* Title + Add button */}

                 {createdBlocks.length > 0 && (

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FolderIcon sx={{ mr: 2, color: "primary.main", fontSize: 32 }} />
                <Typography variant="h5" fontWeight="bold" color="primary">
                  Created Blocks ({createdBlocks.length})
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenModal}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  fontSize: "1rem",
                  fontWeight: 600,
                  background: "#2196f3",
                  boxShadow: "0 4px 12px rgba(25,118,210,0.4)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
                    boxShadow: "0 6px 16px rgba(25,118,210,0.5)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Add New Block
              </Button>
            </Box>
                 )}
            {/* Table or Empty State */}
            {createdBlocks.length === 0 ? (
              <Paper
                sx={{
                  p: 4,
                  textAlign: "center",
                  backgroundColor: "#f5f5f5",
                  borderRadius: 2,
                }}
              >
                <AccountTree
                  sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Blocks Created Yet
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Get started by creating your first project block
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenModal}
                  sx={{
                    mt: 2,
                    background: "#2196f3",
                  }}
                >
                  Add New Block
                </Button>
              </Paper>
            ) : (
              <DataGrid
                rows={createdBlocks}
                columns={createdBlocksColumns}
                getRowId={(row) => row._id}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                  },
                }}
                autoHeight
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[5, 10, 25, 50]}
                sx={{
                  "& .MuiDataGrid-root": { border: "none" },
                  "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid #f0f0f0",
                    py: 1,
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f8f9fa",
                    borderBottom: "2px solid #dee2e6",
                    fontWeight: "bold",
                  },
                  "& .MuiDataGrid-row:hover": { backgroundColor: "#f5f5f5" },
                }}
              />
            )}
          </CardContent>
        </Card>
      </Box>
    </Fade>

  {/* Block Creation Modal */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccountTree sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h5" fontWeight="bold" color="primary">
              {editingBlock ? 'Update Block' : 'Create New Block'}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {editingBlock ? 'Update block information' : 'Fill in the details to create your new project block'}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {editingBlock && (
            <Box sx={{ mb: 3, p: 2, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
              <Typography variant="body2" color="primary" fontWeight="bold">
                Editing: {editingBlock.blockName}
              </Typography>
            </Box>
          )}

          <form onSubmit={handleSubmit} id="block-form">
            <Grid container spacing={3}>
              {/* Project Name - Autocomplete */}
              <Grid item xs={12} sm={6}>
                <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Project Name</FormLabel>
                <Select
                  id="projectId"
                  name="projectId"
                  //size="small"
                  fullWidth
              
                  value={formData.projectId}
                  onChange={handleInputChange('projectId')}
                  error={!!errors.projectId}
                  helperText={errors.projectId}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 12px rgba(25,118,210,0.3)'
                      }
                    }
                  }}
                >
                  {/* <MenuItem value="" disabled>{t('Select Project')}</MenuItem> */}
                  {projectData.map((project) => (
                    <MenuItem key={project._id} value={project._id}>
                      {project.projectName}
                      {console.log('project name', project.projectName)}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              {/* Block Name */}
              <Grid item xs={12} sm={6}>
                <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Block Name</FormLabel>
                <TextField
                  fullWidth
                  //label="Block Name"
                  variant="outlined"
                  value={formData.blockName}
                  onChange={handleInputChange('blockName')}
                  required
                  error={!!errors.blockName}
                  helperText={errors.blockName}
                  placeholder="Enter block name"
                  sx={inputStyling}
                />
              </Grid>

           
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  error={!!errors.description}
                  helperText={errors.description}
                  placeholder="No Description Available"
                  sx={inputStyling}
                />
              </Grid>

          
            </Grid>
          </form>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleCloseModal}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="block-form"
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              px: 4,
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: 600,
              background: '#2196f3',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: '#1e88e5',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            {editingBlock ? 'Update Block' : 'Create Block'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
  </Container>
);

};

export default ProjectsBlocks;
