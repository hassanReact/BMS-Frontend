// import React, { useState } from 'react';
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
//   DialogActions
// } from '@mui/material';
// import {
//   AccountTree as ProjectIcon,
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

// const Projects = () => {
//   const { t } = useTranslation();
//   const [formData, setFormData] = useState({
//     projectName: '',
//     projectDetails: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [registeredProjects, setRegisteredProjects] = useState([]);
//   const [openAdd, setOpenAdd] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [openDelete, setOpenDelete] = useState(false);
//   const [editingProject, setEditingProject] = useState(null);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success'
//   });
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const payload = tokenPayload();

//   const fetchProjectData = async () => {
//     try {
//       const response = await getApi(urls.project.getAll, { id: payload.companyId });

//       if (response?.data) {
//         setRegisteredProjects(response.data);
//       } else {
//         setRegisteredProjects([]);
//       }
//     } catch (error) {
//       setRegisteredProjects([]);
//     }
//   };

//   useEffect(() => {
//     fetchProjectData();
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

//   const AddProject = async (formData) => {
//     formData.companyId = payload.companyId;
//     try {
//       const response = await postApi(urls.project.create, formData);
//       if (response.success && response.data) {
//         toast.success(t('Successfully registered'));
//         console.log('Response data', response.data);
//         console.log('FormData:', formData);
//         return response.data; // Return the saved object
//         //resetForm();
//         //handleClose();
//       } else {
//         toast.error(t('Failed to register project'));
//         return null;
//       }
//     } catch (err) {
//       console.error(err);
//       //setLoading(false);
//       toast.error(t('Something went wrong!'));
//       return null;
//     }
 
//   };

//   const editProject = async (formData) => {
 
//     formData.companyId = payload.companyId;
//     try {
//       const response = await updateApi(urls.project.updateProject, formData, { id: formData._id });
//       if (response.success) {
//         toast.success(t('Project updated Successfully'));
      
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error('Something went wrong!');
   
//     }
  
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.projectName.trim()) {
//       newErrors.projectName = 'Project name is required';
//     } 

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleOpenModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingProject(null);
//     setFormData({
//       projectName: '',
//       projectDetails: ''
//     });
//     setErrors({});
//   };



//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!validateForm()) {
//       setSnackbar({ open: true, message: 'Please fix the errors', severity: 'error' });
//       return;
//     }

//   const finalData = {
//     ...formData,
//     projectDetails: formData.projectDetails.trim() === "" 
//       ? "No description available" 
//       : formData.projectDetails
//   };

//     if (editingProject) {
//       const updatedProject = await editProject({ ...finalData, _id: editingProject._id });

//       if (updatedProject) {
//         setRegisteredProjects((prev) => prev.map((proj) => (proj._id === updatedProject._id ? updatedProject : proj)));
//         setSnackbar({ open: true, message: 'Project updated!', severity: 'success' });
//       }
//     } else {
//       const newProject = await AddProject(finalData);
//       if (newProject) {
//         setRegisteredProjects((prev) => [newProject, ...prev]);
//         setSnackbar({ open: true, message: 'Project created!', severity: 'success' });
//       }
//     }

//     handleCloseModal();
//   };



//   const handleEditProject = (project) => {
//     setFormData({
//       projectName: project.projectName,
//       projectDetails: project.projectDetails
//     });
//     setEditingProject(project);
//     setIsModalOpen(true);
//   };

//   const handleDeleteProject = async (projectId) => {
//     setRegisteredProjects((prev) => prev.filter((project) => project._id !== projectId));
//     try {
//       const result = await patchApi(urls.project.delete, { isDeleted: true }, { id: projectId });

//       if (result?.success) {
//         toast.success(t('Project Deleted Successfully'));
       
//       }
//     } catch (error) {
//       console.error('Error deleting Project:', error);
//       toast.error(t('Error deleting Project'));
//       //setLoading(false);
//     }
   
//     setSnackbar({
//       open: true,
//       message: 'Project deleted successfully!',
//       severity: 'info'
//     });
//   };

//   const handleCancelEdit = () => {
//     setEditingProject(null);
//     setFormData({
//       projectName: '',
//       projectDetails: ''
//     });
//     setErrors({});
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   const registeredProjectsColumns = [
//     {
//       field: 'serialNo',
//       headerName: 'S.No.',
//       width: 80,

//       renderCell: (params) => {
//         const rowIndex = registeredProjects.findIndex((row) => row._id === params.row._id);
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
//       field: 'projectDetails',
//       headerName: 'Project Details',
//       flex: 2,
//       renderCell: (params) => (
//         <Typography
//           variant="body2"
//           sx={{
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap'
//           }}
//         >
//           {params.row.projectDetails}
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
//           <IconButton size="small" onClick={() => handleEditProject(params.row)} sx={{ mr: 1, color: 'primary.main' }}>
//             <EditIcon fontSize="small" />
//           </IconButton>
//           <IconButton size="small" onClick={() => handleDeleteProject(params.row._id)} sx={{ color: 'error.main' }}>
//             <DeleteIcon fontSize="small" />
//           </IconButton>
//         </Box>
//       )
//     }
//   ];
// return (
//   <Container maxWidth="lg" sx={{ p: 0}}>
//     <Fade in={true} timeout={800}>
//       <Box>
//         {/* Main Card – Entire Content */}
//         <Card
//           elevation={0}
//           sx={{
//             borderRadius: 3,
//          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
           
//             borderColor: 'divider',
//             minHeight: "440px",
//           }}
//         >
//           <CardContent sx={{ p: 1 }}>
//             {/* Header (inside Card now) */}
//             <Box textAlign="center" mb={5}>
//               <Typography
//                 variant="h3"
//                 component="h1"
//                 gutterBottom
//                 sx={{
//                   fontWeight: 700,
//                   background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
//                   backgroundClip: 'text',
//                   WebkitBackgroundClip: 'text',
//                   WebkitTextFillColor: 'transparent',
//                   fontSize:"22px"
//                 }}
//               >
//                 Project Management
//               </Typography>
//               <Typography
//                 variant="h6"
//                 color="text.secondary"
//                 sx={{ marginBottom: '30px' }}
//               >
//                 Manage and organize your projects efficiently
//               </Typography>
//             </Box>

//             {/* Title + Add button */}
//             <Box
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 mb: 3
//               }}
//             >
//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <FolderIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
//                 <Typography variant="h5" fontWeight="bold" color="primary">
//                   Registered Projects ({registeredProjects.length})
//                 </Typography>
//               </Box>
//               <Button
//                 variant="contained"
//                 startIcon={<AddIcon />}
//                 onClick={handleOpenModal}
//                 sx={{
//                   px: 3,
//                   py: 1,
//                   borderRadius: 2,
//                   fontSize: '1rem',
//                   fontWeight: 600,
//                   background: '#2196f3',
//                   boxShadow: '0 4px 12px rgba(25,118,210,0.4)',
//                   transition: 'all 0.3s ease',
//                   '&:hover': {
//                     background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
//                     boxShadow: '0 6px 16px rgba(25,118,210,0.5)',
//                     transform: 'translateY(-2px)'
//                   }
//                 }}
//               >
//                 Add New Project
//               </Button>
//             </Box>

//             {/* Table or Empty State */}
//             {registeredProjects.length === 0 ? (
//               <Paper
//                 sx={{
//                   p: 4,
//                   textAlign: 'center',
//                   backgroundColor: '#f5f5f5',
//                   borderRadius: 2
//                 }}
//               >
//                 <ProjectIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
//                 <Typography variant="h6" color="text.secondary" gutterBottom>
//                   No Projects Registered Yet
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                   Get started by adding your first project
//                 </Typography>
//                 <Button
//                   variant="contained"
//                   startIcon={<AddIcon />}
//                   onClick={handleOpenModal}
//                   sx={{
//                     mt: 2,
//                     background: '#2196f3'
//                   }}
//                 >
//                   Add New Project
//                 </Button>
//               </Paper>
//             ) : (
//               <DataGrid
//                 rows={registeredProjects}
//                 columns={registeredProjectsColumns}
//                 getRowId={(row) => row._id}
//                 slots={{ toolbar: GridToolbar }}
//                 slotProps={{
//                   toolbar: {
//                     showQuickFilter: true,
//                     quickFilterProps: { debounceMs: 500 }
//                   }
//                 }}
//                 autoHeight
//                 initialState={{
//                   pagination: {
//                     paginationModel: { page: 0, pageSize: 10 }
//                   }
//                 }}
//                 pageSizeOptions={[5, 10, 25, 50]}
//                 sx={{
//                   '& .MuiDataGrid-root': { border: 'none' },
//                   '& .MuiDataGrid-cell': {
//                     borderBottom: '1px solid #f0f0f0',
//                     py: 1
//                   },
//                   '& .MuiDataGrid-columnHeaders': {
//                     backgroundColor: '#f8f9fa',
//                     borderBottom: '2px solid #dee2e6',
//                     fontWeight: 'bold'
//                   },
//                   '& .MuiDataGrid-row:hover': { backgroundColor: '#f5f5f5' }
//                 }}
//               />
//             )}
//           </CardContent>
//         </Card>
//       </Box>
//     </Fade>

//          {/* Project Registration Modal */}
//       <Dialog
//         open={isModalOpen}
//         onClose={handleCloseModal}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: 3,
//             background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
//           }
//         }}
//       >
//         <DialogTitle sx={{ pb: 1 }}>
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <ProjectIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
//             <Typography variant="h5" fontWeight="bold" color="primary">
//               {editingProject ? 'Update Project' : 'Register New Project'}
//             </Typography>
//           </Box>
//           <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//             {editingProject ? 'Update project information' : 'Fill in the details to register your new project'}
//           </Typography>
//         </DialogTitle>

//         <DialogContent sx={{ pt: 2 }}>
//           {editingProject && (
//             <Box sx={{ mb: 3, p: 2, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
//               <Typography variant="body2" color="primary" fontWeight="bold">
//                 Editing: {editingProject.projectName}
//               </Typography>
//             </Box>
//           )}

//           <form onSubmit={handleSubmit} id="project-form">
//             <Grid container spacing={3}>
//               {/* Project Name */}
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Project Name"
//                   value={formData.projectName}
//                   onChange={handleInputChange('projectName')}
//                   error={!!errors.projectName}
//                   helperText={errors.projectName}
//                   variant="outlined"
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: 2,
//                       transition: 'all 0.3s ease',
//                       '&:hover': {
//                         boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
//                       },
//                       '&.Mui-focused': {
//                         boxShadow: '0 4px 12px rgba(25,118,210,0.3)'
//                       }
//                     }
//                   }}
//                 />
//               </Grid>

//               {/* Project Details */}
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Project Details"
//                   value={formData.projectDetails}
//                   onChange={handleInputChange('projectDetails')}
//                   error={!!errors.projectDetails}
//                   helperText={errors.projectDetails}
//                   variant="outlined"
//                   multiline
//                   rows={4}
//                   placeholder="No description available"
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: 2,
//                       transition: 'all 0.3s ease',
//                       '&:hover': {
//                         boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
//                       },
//                       '&.Mui-focused': {
//                         boxShadow: '0 4px 12px rgba(25,118,210,0.3)'
//                       }
//                     }
//                   }}
//                 />
//               </Grid>

//               {/* Preview Card */}
//               {(formData.projectName || formData.projectDetails) && (
//                 <Grid item xs={12}>
//                   <Fade in={true} timeout={600}>
//                     <Card
//                       elevation={2}
//                       sx={{
//                         borderRadius: 2,
//                         background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
//                       }}
//                     >
//                       <CardContent>
//                         <Typography variant="h6" gutterBottom color="primary" fontWeight={600}>
//                           Preview
//                         </Typography>
//                         <Box sx={{ pl: 2 }}>
//                           {formData.projectName && (
//                             <Typography variant="body1" sx={{ mb: 1 }}>
//                               <strong>Name:</strong> {formData.projectName}
//                             </Typography>
//                           )}
//                           {formData.projectDetails && (
//                             <Typography variant="body1">
//                               <strong>Details:</strong> {formData.projectDetails}
//                             </Typography>
//                           )}
//                         </Box>
//                       </CardContent>
//                     </Card>
//                   </Fade>
//                 </Grid>
//               )}
//             </Grid>
//           </form>
//         </DialogContent>

//         <DialogActions sx={{ p: 3, pt: 1 }}>
//           <Button
//             onClick={handleCloseModal}
//             variant="outlined"
//             sx={{
//               borderRadius: 2,
//               px: 3
//             }}
//           >
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             form="project-form"
//             variant="contained"
//             startIcon={<SaveIcon />}
//             sx={{
//               px: 4,
//               borderRadius: 2,
//               fontSize: '1rem',
//               fontWeight: 600,
//               background: '#2196f3',
//               boxShadow: '0 4px 12px rgba(25,118,210,0.4)',
//               transition: 'all 0.3s ease',
//               '&:hover': {
//                 background: '#1e88e5',
//                 boxShadow: '0 6px 16px rgba(25,118,210,0.5)',
//                 transform: 'translateY(-2px)'
//               }
//             }}
//           >
//             {editingProject ? 'Update Project' : 'Register Project'}
//           </Button>
//         </DialogActions>
//       </Dialog>

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
//   </Container>
// );
// };
// export default Projects;





import React, { useState } from 'react';
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
  DialogActions
} from '@mui/material';
import {
  AccountTree as ProjectIcon,
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

const Projects = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    projectName: '',
    projectDetails: ''
  });
  const [errors, setErrors] = useState({});
  const [registeredProjects, setRegisteredProjects] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const payload = tokenPayload();

  const fetchProjectData = async () => {
    try {
      const response = await getApi(urls.project.getAll, { id: payload.companyId });

      if (response?.data) {
        setRegisteredProjects(response.data);
      } else {
        setRegisteredProjects([]);
      }
    } catch (error) {
      setRegisteredProjects([]);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [openAdd, openDelete, openEdit]);

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

  const AddProject = async (formData) => {
    formData.companyId = payload.companyId;
    try {
      const response = await postApi(urls.project.create, formData);
      if (response.success && response.data) {
        toast.success(t('Successfully registered'));
        console.log('Response data', response.data);
        console.log('FormData:', formData);
        return response.data; // Return the saved object
        //resetForm();
        //handleClose();
      } else {
        toast.error(t('Failed to register project'));
        return null;
      }
    } catch (err) {
      console.error(err);
      //setLoading(false);
      toast.error(t('Something went wrong!'));
      return null;
    }
 
  };

  const editProject = async (formData) => {
 
    formData.companyId = payload.companyId;
    try {
      const response = await updateApi(urls.project.updateProject, formData, { id: formData._id });
      if (response.success) {
        toast.success(t('Project updated Successfully'));
      
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
   
    }
  
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    } 

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({
      projectName: '',
      projectDetails: ''
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
    projectDetails: formData.projectDetails.trim() === "" 
      ? "No description available" 
      : formData.projectDetails
  };

    if (editingProject) {
      const updatedProject = await editProject({ ...finalData, _id: editingProject._id });

      if (updatedProject) {
        setRegisteredProjects((prev) => prev.map((proj) => (proj._id === updatedProject._id ? updatedProject : proj)));
        setSnackbar({ open: true, message: 'Project updated!', severity: 'success' });
      }
    } else {
      const newProject = await AddProject(finalData);
      if (newProject) {
        setRegisteredProjects((prev) => [newProject, ...prev]);
        setSnackbar({ open: true, message: 'Project created!', severity: 'success' });
      }
    }

    handleCloseModal();
  };



  const handleEditProject = (project) => {
    setFormData({
      projectName: project.projectName,
      projectDetails: project.projectDetails
    });
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (projectId) => {
    setRegisteredProjects((prev) => prev.filter((project) => project._id !== projectId));
    try {
      const result = await patchApi(urls.project.delete, { isDeleted: true }, { id: projectId });

      if (result?.success) {
        toast.success(t('Project Deleted Successfully'));
       
      }
    } catch (error) {
      console.error('Error deleting Project:', error);
      toast.error(t('Error deleting Project'));
      //setLoading(false);
    }
   
    setSnackbar({
      open: true,
      message: 'Project deleted successfully!',
      severity: 'info'
    });
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setFormData({
      projectName: '',
      projectDetails: ''
    });
    setErrors({});
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const registeredProjectsColumns = [
    {
      field: 'serialNo',
      headerName: 'S.No.',
      width: 80,

      renderCell: (params) => {
        const rowIndex = registeredProjects.findIndex((row) => row._id === params.row._id);
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
      field: 'projectDetails',
      headerName: 'Project Details',
      flex: 2,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {params.row.projectDetails}
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
          <IconButton size="small" onClick={() => handleEditProject(params.row)} sx={{ mr: 1, color: 'primary.main' }}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDeleteProject(params.row._id)} sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    }
  ];
return (
  <Container maxWidth="lg" sx={{ p: 0}}>
    <Fade in={true} timeout={800}>
      <Box>
        {/* Main Card – Entire Content */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
        //  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
           
            borderColor: 'divider',
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
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize:"22px"
                }}
              >
                Project Management
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ marginBottom: '30px' }}
              >
                Manage and organize your projects efficiently
              </Typography>
            </Box>

            {/* Title + Add button */}

            {registeredProjects.length > 0 && (
             <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FolderIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
                <Typography variant="h5" fontWeight="bold" color="primary">
                  Registered Projects ({registeredProjects.length})
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
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: '#2196f3',
                  boxShadow: '0 4px 12px rgba(25,118,210,0.4)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                    boxShadow: '0 6px 16px rgba(25,118,210,0.5)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Add New Project
              </Button>
            </Box> 
            )}


            

            {/* Table or Empty State */}
            {registeredProjects.length === 0 ? (
              <Paper
                sx={{
                  p: 4,
                  textAlign: 'center',
                  backgroundColor: '#f5f5f5',
                  borderRadius: 2
                }}
              >
                <ProjectIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Projects Registered Yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Get started by adding your first project
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenModal}
                  sx={{
                    mt: 2,
                    background: '#2196f3'
                  }}
                >
                  Add New Project
                </Button>
              </Paper>
            ) : (
              <DataGrid
                rows={registeredProjects}
                columns={registeredProjectsColumns}
                getRowId={(row) => row._id}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 }
                  }
                }}
                autoHeight
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 }
                  }
                }}
                pageSizeOptions={[5, 10, 25, 50]}
                sx={{
                  '& .MuiDataGrid-root': { border: 'none' },
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid #f0f0f0',
                    py: 1
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f8f9fa',
                    borderBottom: '2px solid #dee2e6',
                    fontWeight: 'bold'
                  },
                  '& .MuiDataGrid-row:hover': { backgroundColor: '#f5f5f5' }
                }}
              />
            )}
          </CardContent>
        </Card>
      </Box>
    </Fade>

         {/* Project Registration Modal */}
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
            <ProjectIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h5" fontWeight="bold" color="primary">
              {editingProject ? 'Update Project' : 'Register New Project'}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {editingProject ? 'Update project information' : 'Fill in the details to register your new project'}
          </Typography>
        </DialogTitle>
 
        <DialogContent sx={{ pt: 2 }}>
          {editingProject && (
            <Box sx={{ mb: 3, p: 2, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
              <Typography variant="body2" color="primary" fontWeight="bold">
                Editing: {editingProject.projectName}
              </Typography>
            </Box>
          )}

          <form onSubmit={handleSubmit} id="project-form">
            <Grid container spacing={3}>
              {/* Project Name */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Project Name"
                  value={formData.projectName}
                  onChange={handleInputChange('projectName')}
                  error={!!errors.projectName}
                  helperText={errors.projectName}
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
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Project Details"
                  value={formData.projectDetails}
                  onChange={handleInputChange('projectDetails')}
                  error={!!errors.projectDetails}
                  helperText={errors.projectDetails}
                  variant="outlined"
                  multiline
                  rows={4}
                  placeholder="No description available"
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
                />
              </Grid>

              {(formData.projectName || formData.projectDetails) && (
                <Grid item xs={12}>
                  <Fade in={true} timeout={600}>
                    <Card
                      elevation={2}
                      sx={{
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary" fontWeight={600}>
                          Preview
                        </Typography>
                        <Box sx={{ pl: 2 }}>
                          {formData.projectName && (
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              <strong>Name:</strong> {formData.projectName}
                            </Typography>
                          )}
                          {formData.projectDetails && (
                            <Typography variant="body1">
                              <strong>Details:</strong> {formData.projectDetails}
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              )}
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
            form="project-form"
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              px: 4,
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: 600,
              background: '#2196f3',
              boxShadow: '0 4px 12px rgba(25,118,210,0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: '#1e88e5',
                boxShadow: '0 6px 16px rgba(25,118,210,0.5)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            {editingProject ? 'Update Project' : 'Register Project'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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
export default Projects;