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
  DialogActions,
  MenuItem,
  Chip
} from '@mui/material';
import {
  Build as BuildIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Assignment as AssignIcon,
  Add as AddIcon,
  RequestPage as RequestIcon
} from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const ServicesManagement = () => {
  const [formData, setFormData] = useState({
    serviceRequest: '',
    serviceType: '',
    requestedBy: '',
    description: '',
    assignedTo: '',
    status: 'pending'
  });
  const [errors, setErrors] = useState({});
  const [registeredServices, setRegisteredServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [viewingService, setViewingService] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const serviceTypes = ['IT Support', 'Maintenance', 'Cleaning', 'Security', 'Catering', 'Transportation', 'Equipment Repair', 'Other'];

  const statusOptions = ['pending', 'approved', 'rejected'];

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.serviceRequest.trim()) {
      newErrors.serviceRequest = 'Service request is required';
    } else if (formData.serviceRequest.length < 3) {
      newErrors.serviceRequest = 'Service request must be at least 3 characters';
    }

    if (!formData.serviceType.trim()) {
      newErrors.serviceType = 'Service type is required';
    }

    if (!formData.requestedBy.trim()) {
      newErrors.requestedBy = 'Requested by field is required';
    } else if (formData.requestedBy.length < 2) {
      newErrors.requestedBy = 'Requested by must be at least 2 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.assignedTo.trim()) {
      newErrors.assignedTo = 'Assigned to field is required';
    } else if (formData.assignedTo.length < 2) {
      newErrors.assignedTo = 'Assigned to must be at least 2 characters';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setFormData({
      serviceRequest: '',
      serviceType: '',
      requestedBy: '',
      description: '',
      assignedTo: '',
      status: 'pending'
    });
    setErrors({});
  };

  const handleOpenViewModal = (service) => {
    setViewingService(service);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingService(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      const newService = {
        id: editingService ? editingService.id : Date.now().toString(),
        serviceRequest: formData.serviceRequest,
        serviceType: formData.serviceType,
        requestedBy: formData.requestedBy,
        description: formData.description,
        assignedTo: formData.assignedTo,
        status: formData.status,
        createdAt: editingService ? editingService.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingService) {
        // Update existing service
        setRegisteredServices((prev) => prev.map((service) => (service.id === editingService.id ? newService : service)));
        setSnackbar({
          open: true,
          message: 'Service updated successfully!',
          severity: 'success'
        });
        setEditingService(null);
      } else {
        // Add new service
        setRegisteredServices((prev) => [newService, ...prev]);
        setSnackbar({
          open: true,
          message: 'Service added successfully!',
          severity: 'success'
        });
      }

      // Reset form and close modal
      setFormData({
        serviceRequest: '',
        serviceType: '',
        requestedBy: '',
        description: '',
        assignedTo: '',
        status: 'pending'
      });
      setIsModalOpen(false);
    } else {
      setSnackbar({
        open: true,
        message: 'Please fix the errors in the form',
        severity: 'error'
      });
    }
  };

  const handleEditService = (service) => {
    setFormData({
      serviceRequest: service.serviceRequest,
      serviceType: service.serviceType,
      requestedBy: service.requestedBy,
      description: service.description,
      assignedTo: service.assignedTo,
      status: service.status
    });
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleDeleteService = (serviceId) => {
    setRegisteredServices((prev) => prev.filter((service) => service.id !== serviceId));
    setSnackbar({
      open: true,
      message: 'Service deleted successfully!',
      severity: 'info'
    });
  };

  const handleAssignService = (service) => {
    // For now, just open edit modal - you can customize this behavior
    handleEditService(service);
    setSnackbar({
      open: true,
      message: 'Opening assignment dialog...',
      severity: 'info'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  // DataGrid columns for registered services
  const registeredServicesColumns = [
    {
      field: 'serialNo',
      headerName: 'S.No.',
      width: 80,
      renderCell: (params) => {
        const rowIndex = registeredServices.findIndex((row) => row.id === params.row.id);
        return rowIndex + 1;
      }
    },
    {
      field: 'serviceRequest',
      headerName: 'Service Request',
      flex: 1.5,
      renderCell: (params) => (
        <Typography fontWeight="bold" color="primary">
          {params.row.serviceRequest}
        </Typography>
      )
    },
    {
      field: 'serviceType',
      headerName: 'Service Type',
      flex: 1,
      renderCell: (params) => <Typography variant="body2">{params.row.serviceType}</Typography>
    },
    {
      field: 'requestedBy',
      headerName: 'Requested By',
      flex: 1,
      renderCell: (params) => <Typography variant="body2">{params.row.requestedBy}</Typography>
    },
    {
      field: 'assignedTo',
      headerName: 'Assigned To',
      flex: 1,
      renderCell: (params) => <Typography variant="body2">{params.row.assignedTo}</Typography>
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      renderCell: (params) => (
        <Chip
          label={params.row.status.charAt(0).toUpperCase() + params.row.status.slice(1)}
          color={getStatusColor(params.row.status)}
          size="small"
          variant="outlined"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.2,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton size="small" onClick={() => handleOpenViewModal(params.row)} sx={{ mr: 0.5, color: 'info.main' }} title="View">
            <ViewIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleEditService(params.row)} sx={{ mr: 0.5, color: 'primary.main' }} title="Edit">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDeleteService(params.row.id)} sx={{ mr: 0.5, color: 'error.main' }} title="Delete">
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleAssignService(params.row)} sx={{ color: 'success.main' }} title="Assign">
            <AssignIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in={true} timeout={800}>
        <Box>
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <BuildIcon
              sx={{
                fontSize: 48,
                color: 'primary.main',
                mb: 2
              }}
            />
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Services Management
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ marginBottom: '40px' }}>
              Manage and track all service requests efficiently
            </Typography>
          </Box>

          {/* Registered Services Data Table */}
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Box sx={{ width: '100%' }}>
              <Card
                elevation={8}
                sx={{
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <RequestIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
                      <Typography variant="h5" fontWeight="bold" color="primary">
                        Service Requests ({registeredServices.length})
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
                        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                        boxShadow: '0 4px 12px rgba(25,118,210,0.4)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                          boxShadow: '0 6px 16px rgba(25,118,210,0.5)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Add New Service
                    </Button>
                  </Box>

                  {registeredServices.length === 0 ? (
                    <Paper
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        backgroundColor: '#f5f5f5',
                        borderRadius: 2
                      }}
                    >
                      <BuildIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No Service Requests Yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Get started by adding your first service request
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenModal}
                        sx={{
                          mt: 2,
                          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)'
                        }}
                      >
                        Add New Service
                      </Button>
                    </Paper>
                  ) : (
                    <DataGrid
                      rows={registeredServices}
                      columns={registeredServicesColumns}
                      getRowId={(row) => row.id}
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
                        '& .MuiDataGrid-root': {
                          border: 'none'
                        },
                        '& .MuiDataGrid-cell': {
                          borderBottom: '1px solid #f0f0f0',
                          py: 1
                        },
                        '& .MuiDataGrid-columnHeaders': {
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #dee2e6',
                          fontWeight: 'bold'
                        },
                        '& .MuiDataGrid-row:hover': {
                          backgroundColor: '#f5f5f5'
                        }
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Fade>

      {/* Service Add/Edit Modal */}
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
            <BuildIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h5" fontWeight="bold" color="primary">
              {editingService ? 'Update Service Request' : 'Add New Service Request'}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {editingService ? 'Update service request information' : 'Fill in the details to create a new service request'}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {editingService && (
            <Box sx={{ mb: 3, p: 2, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
              <Typography variant="body2" color="primary" fontWeight="bold">
                Editing: {editingService.serviceRequest}
              </Typography>
            </Box>
          )}

          <form onSubmit={handleSubmit} id="service-form">
            <Grid container spacing={3}>
              {/* Service Request */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Service Request"
                  value={formData.serviceRequest}
                  onChange={handleInputChange('serviceRequest')}
                  error={!!errors.serviceRequest}
                  helperText={errors.serviceRequest}
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

              {/* Service Type */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Service Type"
                  value={formData.serviceType}
                  onChange={handleInputChange('serviceType')}
                  error={!!errors.serviceType}
                  helperText={errors.serviceType}
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
                  {serviceTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Requested By */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Requested By"
                  value={formData.requestedBy}
                  onChange={handleInputChange('requestedBy')}
                  error={!!errors.requestedBy}
                  helperText={errors.requestedBy}
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

              {/* Assigned To */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Assigned To"
                  value={formData.assignedTo}
                  onChange={handleInputChange('assignedTo')}
                  error={!!errors.assignedTo}
                  helperText={errors.assignedTo}
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

              {/* Status */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={formData.status}
                  onChange={handleInputChange('status')}
                  error={!!errors.status}
                  helperText={errors.status}
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
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  error={!!errors.description}
                  helperText={errors.description}
                  variant="outlined"
                  multiline
                  rows={4}
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

              {/* Preview Card */}
              {(formData.serviceRequest || formData.serviceType || formData.requestedBy || formData.description) && (
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
                          {formData.serviceRequest && (
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              <strong>Request:</strong> {formData.serviceRequest}
                            </Typography>
                          )}
                          {formData.serviceType && (
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              <strong>Type:</strong> {formData.serviceType}
                            </Typography>
                          )}
                          {formData.requestedBy && (
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              <strong>Requested By:</strong> {formData.requestedBy}
                            </Typography>
                          )}
                          {formData.assignedTo && (
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              <strong>Assigned To:</strong> {formData.assignedTo}
                            </Typography>
                          )}
                          {formData.status && (
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              <strong>Status:</strong> {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                            </Typography>
                          )}
                          {formData.description && (
                            <Typography variant="body1">
                              <strong>Description:</strong> {formData.description}
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
            form="service-form"
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              px: 4,
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: 600,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              boxShadow: '0 4px 12px rgba(25,118,210,0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                boxShadow: '0 6px 16px rgba(25,118,210,0.5)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            {editingService ? 'Update Service' : 'Add Service'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Service View Modal */}
      <Dialog
        open={isViewModalOpen}
        onClose={handleCloseViewModal}
        maxWidth="sm"
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
            <ViewIcon sx={{ mr: 2, color: 'info.main', fontSize: 28 }} />
            <Typography variant="h5" fontWeight="bold" color="primary">
              Service Request Details
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {viewingService && (
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Service Request:</strong> {viewingService.serviceRequest}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Type:</strong> {viewingService.serviceType}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Status:</strong>
                      <Chip
                        label={viewingService.status.charAt(0).toUpperCase() + viewingService.status.slice(1)}
                        color={getStatusColor(viewingService.status)}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Requested By:</strong> {viewingService.requestedBy}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Assigned To:</strong> {viewingService.assignedTo}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Description:</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ pl: 2, fontStyle: 'italic' }}>
                      {viewingService.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Created:</strong> {new Date(viewingService.createdAt).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleCloseViewModal}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3
            }}
          >
            Close
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

export default ServicesManagement;
