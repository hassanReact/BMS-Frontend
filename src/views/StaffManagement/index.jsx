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
  People as PeopleIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PersonAdd as PersonAddIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const StaffManagement = () => {
  const [formData, setFormData] = useState({
    staffName: '',
    contactNumber: '',
    designation: '',
    salary: ''
  });
  const [errors, setErrors] = useState({});
  const [registeredStaff, setRegisteredStaff] = useState([]);
  const [editingStaff, setEditingStaff] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

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

    if (!formData.staffName.trim()) {
      newErrors.staffName = 'Staff name is required';
    } else if (formData.staffName.length < 2) {
      newErrors.staffName = 'Staff name must be at least 2 characters';
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\+?[\d\s\-$$$$]{10,15}$/.test(formData.contactNumber.trim())) {
      newErrors.contactNumber = 'Please enter a valid contact number';
    }

    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    } else if (formData.designation.length < 2) {
      newErrors.designation = 'Designation must be at least 2 characters';
    }

    if (!formData.salary.trim()) {
      newErrors.salary = 'Salary is required';
    } else if (isNaN(Number(formData.salary)) || Number(formData.salary) <= 0) {
      newErrors.salary = 'Salary must be a valid positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
    setFormData({
      staffName: '',
      contactNumber: '',
      designation: '',
      salary: ''
    });
    setErrors({});
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      const newStaff = {
        id: editingStaff ? editingStaff.id : Date.now().toString(),
        staffName: formData.staffName,
        contactNumber: formData.contactNumber,
        designation: formData.designation,
        salary: Number(formData.salary),
        registeredAt: editingStaff ? editingStaff.registeredAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingStaff) {
        // Update existing staff
        setRegisteredStaff((prev) => prev.map((staff) => (staff.id === editingStaff.id ? newStaff : staff)));
        setSnackbar({
          open: true,
          message: 'Staff member updated successfully!',
          severity: 'success'
        });
        setEditingStaff(null);
      } else {
        // Add new staff
        setRegisteredStaff((prev) => [newStaff, ...prev]);
        setSnackbar({
          open: true,
          message: 'Staff member added successfully!',
          severity: 'success'
        });
      }

      // Reset form and close modal
      setFormData({
        staffName: '',
        contactNumber: '',
        designation: '',
        salary: ''
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

  const handleEditStaff = (staff) => {
    setFormData({
      staffName: staff.staffName,
      contactNumber: staff.contactNumber,
      designation: staff.designation,
      salary: staff.salary.toString()
    });
    setEditingStaff(staff);
    setIsModalOpen(true);
  };

  const handleDeleteStaff = (staffId) => {
    setRegisteredStaff((prev) => prev.filter((staff) => staff.id !== staffId));
    setSnackbar({
      open: true,
      message: 'Staff member deleted successfully!',
      severity: 'info'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR'
    }).format(salary);
  };

  // DataGrid columns for registered staff
  const registeredStaffColumns = [
    {
      field: 'serialNo',
      headerName: 'S.No.',
      width: 80,
      renderCell: (params) => {
        const rowIndex = registeredStaff.findIndex((row) => row.id === params.row.id);
        return rowIndex + 1;
      }
    },
    {
      field: 'staffName',
      headerName: 'Staff Name',
      flex: 1.2,
      renderCell: (params) => (
        <Typography fontWeight="bold" color="primary">
          {params.row.staffName}
        </Typography>
      )
    },
    {
      field: 'contactNumber',
      headerName: 'Contact Number',
      flex: 1.2,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {params.row.contactNumber}
        </Typography>
      )
    },
    {
      field: 'designation',
      headerName: 'Designation',
      flex: 1.2,
      renderCell: (params) => <Typography variant="body2">{params.row.designation}</Typography>
    },
    {
      field: 'salary',
      headerName: 'Salary',
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold" color="success.main">
          {formatSalary(params.row.salary)}
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
          <IconButton size="small" onClick={() => handleEditStaff(params.row)} sx={{ mr: 1, color: 'primary.main' }}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDeleteStaff(params.row.id)} sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" />
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
            <PeopleIcon
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
              Staff Management
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ marginBottom: '40px' }}>
              Manage and organize your staff members efficiently
            </Typography>
          </Box>

          {/* Registered Staff Data Table */}
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
                      <PeopleIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
                      <Typography variant="h5" fontWeight="bold" color="primary">
                        Registered Staff ({registeredStaff.length})
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
                      Add New Staff
                    </Button>
                  </Box>

                  {registeredStaff.length === 0 ? (
                    <Paper
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        backgroundColor: '#f5f5f5',
                        borderRadius: 2
                      }}
                    >
                      <PersonAddIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No Staff Members Registered Yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Get started by adding your first staff member
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
                        Add New Staff
                      </Button>
                    </Paper>
                  ) : (
                    <DataGrid
                      rows={registeredStaff}
                      columns={registeredStaffColumns}
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

      {/* Staff Registration Modal */}
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
            <PeopleIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h5" fontWeight="bold" color="primary">
              {editingStaff ? 'Update Staff Member' : 'Add New Staff Member'}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {editingStaff ? 'Update staff member information' : 'Fill in the details to add a new staff member'}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {editingStaff && (
            <Box sx={{ mb: 3, p: 2, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
              <Typography variant="body2" color="primary" fontWeight="bold">
                Editing: {editingStaff.staffName}
              </Typography>
            </Box>
          )}

          <form onSubmit={handleSubmit} id="staff-form">
            <Grid container spacing={3}>
              {/* Staff Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Staff Name"
                  value={formData.staffName}
                  onChange={handleInputChange('staffName')}
                  error={!!errors.staffName}
                  helperText={errors.staffName}
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

              {/* Contact Number */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  value={formData.contactNumber}
                  onChange={handleInputChange('contactNumber')}
                  error={!!errors.contactNumber}
                  helperText={errors.contactNumber}
                  variant="outlined"
                  placeholder="e.g., +92 123456789"
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

              {/* Designation */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Designation"
                  value={formData.designation}
                  onChange={handleInputChange('designation')}
                  error={!!errors.designation}
                  helperText={errors.designation}
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

              {/* Salary */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleInputChange('salary')}
                  error={!!errors.salary}
                  helperText={errors.salary}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>PKR</Typography>
                  }}
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
            form="staff-form"
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
            {editingStaff ? 'Update Staff' : 'Add Staff'}
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

export default StaffManagement;

