import { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccountBalance as AccountBalanceIcon,
  Close as CloseIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getApi, deleteApi, updateApi } from '@/core/apis/api';
import { tokenPayload } from '@/helper';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { urls } from '@/core/Constant/urls';

const VoucherManagement = () => {
  const { t } = useTranslation();
  const payload = tokenPayload();

  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    voucherType: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Edit Modal State
  const [editModal, setEditModal] = useState({
    open: false,
    loading: false,
    data: null
  });

  const [editFormData, setEditFormData] = useState({
    voucherNo: '',
    voucherType: '',
    date: '',
    particulars: '',
    amount: '',
    details: '',
    credit: {
      id: '',
      model: ''
    },
    debit: {
      id: '',
      model: ''
    }
  });

  // Fetch vouchers from API
  const fetchVouchers = async (pageNum = 1, limit = 10, searchFilters = filters) => {
    if (!payload?.companyId) {
      toast.error('Company ID not found');
      return;
    }

    setLoading(true);
    try {
      const queryParams = {
        page: pageNum,
        limit: limit,
        companyId: payload.companyId,
        ...searchFilters
      };

      // Remove empty filters
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
          delete queryParams[key];
        }
      });

      const response = await getApi(urls.Voucher?.getAllVoucher || '/api/vouchers', queryParams);
      
      console.log('Voucher API Response:', response);

      if (response?.success && response?.data) {
        // Handle the response structure
        const voucherData = response.data.data;
        const paginationData = response.pagination || response;

        // Process voucher data to handle your current data structure
        const processedVouchers = voucherData.map((voucher, index) => ({
          ...voucher,
          id: voucher._id, // DataGrid needs 'id' field
          serialNo: ((pageNum - 1) * limit) + index + 1,
          creditName: getEntityName(voucher.credit),
          debitName: getEntityName(voucher.debit),
          companyName: voucher.companyId?.companyName || 'N/A',
          formattedDate: formatDate(voucher.date),
          formattedCreatedAt: formatDate(voucher.createdAt),
          formattedAmount: formatCurrency(voucher.amount),
          voucherTypeLabel: getVoucherTypeLabel(voucher.voucherType),
          hasDetails: voucher.details && voucher.details.trim() !== ''
        }));

        setVouchers(processedVouchers);
        setPagination({
          page: pageNum,
          limit: limit,
          totalCount: paginationData.totalCount || 0,
          totalPages: paginationData.totalPages || 0
        });
        console.log(processedVouchers);
      } else {
        console.error('Invalid response structure:', response);
        setVouchers([]);
        toast.error('Failed to fetch vouchers');
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      setVouchers([]);
      toast.error('Error loading vouchers');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getEntityName = (entity) => {
    if (!entity || !entity.id) return 'N/A';

    // Check if it's null or empty string
    if (entity.id === null || entity.id === '') return 'N/A';

    // If populated, return the name (this won't work with your current setup, but keeping for future)
    if (typeof entity.id === 'object' && entity.id !== null) {
      if (entity.id.accountName) return entity.id.accountName;
      if (entity.id.name) return entity.id.name;
      if (entity.id.vendorName) return entity.id.vendorName;
      if (entity.id.productName) return entity.id.productName;
      if (entity.id.companyName) return entity.id.companyName;
      if (entity.id.propertyName) return entity.id.propertyName;
    }

    // If not populated (which is your current case), show the model type and partial ID
    if (entity.model && entity.id) {
      const modelLabels = {
        'Transaction': 'Transaction',
        'Vendor': 'Vendor',
        'Product': 'Product',
        'Property': 'Property',
        'ServiceProvider': 'Service Provider',
        'Staff': 'Staff',
        'Customer': 'Customer'
      };
      const modelLabel = modelLabels[entity.model] || entity.model;
      const shortId = entity.id.toString().slice(-6); // Last 6 characters of ID
      return `${modelLabel} (...${shortId})`;
    }

    return 'Unknown';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getVoucherTypeLabel = (type) => {
    const types = {
      'AP': 'Accounts Payable',
      'PUR': 'Purchase',
      'VCH': 'Voucher'
    };
    return types[type] || type;
  };

  const getVoucherTypeColor = (type) => {
    const colors = {
      'AP': 'error',
      'PUR': 'warning',
      'VCH': 'info'
    };
    return colors[type] || 'default';
  };

  // Event handlers
  const handleFilterChange = (field) => (event) => {
    setFilters({
      ...filters,
      [field]: event.target.value
    });
  };

  const handleSearch = () => {
    fetchVouchers(1, pagination.limit, filters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      voucherType: '',
      startDate: '',
      endDate: ''
    };
    setFilters(resetFilters);
    fetchVouchers(1, pagination.limit, resetFilters);
  };

  const handlePageChange = (newPage) => {
    fetchVouchers(newPage + 1, pagination.limit, filters); // DataGrid uses 0-based indexing
  };

  const handlePageSizeChange = (newPageSize) => {
    fetchVouchers(1, newPageSize, filters);
  };

  const handleDeleteVoucher = async (voucherId) => {
    try {
      const result = await deleteApi(`${urls.Voucher?.deleteVoucherById}/${voucherId}` || `/api/vouchers/${voucherId}`, {
        companyId: payload
      });
      if (result?.success) {
        toast.success('Voucher deleted successfully');
        fetchVouchers(pagination.page, pagination.limit, filters);
      } else {
        toast.error('Failed to delete voucher');
      }
    } catch (error) {
      console.error('Error deleting voucher:', error);
      toast.error('Error deleting voucher');
    }
  };

  // Edit Modal Functions
  const handleOpenEditModal = (voucher) => {
    setEditFormData({
      voucherNo: voucher.voucherNo || '',
      voucherType: voucher.voucherType || '',
      date: formatDateForInput(voucher.date) || '',
      particulars: voucher.particulars || '',
      amount: voucher.amount || '',
      details: voucher.details || '',
      credit: {
        id: voucher.credit?.id || '',
        model: voucher.credit?.model || ''
      },
      debit: {
        id: voucher.debit?.id || '',
        model: voucher.debit?.model || ''
      }
    });
    
    setEditModal({
      open: true,
      loading: false,
      data: voucher
    });
  };

  const handleCloseEditModal = () => {
    setEditModal({
      open: false,
      loading: false,
      data: null
    });
    setEditFormData({
      voucherNo: '',
      voucherType: '',
      date: '',
      particulars: '',
      amount: '',
      details: '',
      credit: { id: '', model: '' },
      debit: { id: '', model: '' }
    });
  };

  const handleEditFormChange = (field) => (event) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: event.target.value
        }
      }));
    } else {
      setEditFormData(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    }
  };

  const handleUpdateVoucher = async () => {
    if (!editModal.data?._id) {
      toast.error('Invalid voucher ID');
      return;
    }

    // Basic validation
    if (!editFormData.voucherNo || !editFormData.voucherType || !editFormData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    setEditModal(prev => ({ ...prev, loading: true }));

    try {
      const updateData = {
        voucherNo: editFormData.voucherNo,
        voucherType: editFormData.voucherType,
        date: editFormData.date,
        particulars: editFormData.particulars,
        amount: parseFloat(editFormData.amount),
        details: editFormData.details,
        credit: {
          id: editFormData.credit.id || null,
          model: editFormData.credit.model || ''
        },
        debit: {
          id: editFormData.debit.id || null,
          model: editFormData.debit.model || ''
        }
      };

      console.log('Update data:', updateData);
      console.log('Voucher ID:', editModal.data._id);

      const response = await updateApi(
        `${urls.Voucher?.updateVoucherById}/${editModal.data._id}`,
        updateData
      );

      console.log('Update response:', response);

      if (response?.success) {
        toast.success(response.message || 'Voucher updated successfully');
        handleCloseEditModal();
        fetchVouchers(pagination.page, pagination.limit, filters);
      } else {
        toast.error(response?.message || 'Failed to update voucher');
      }
    } catch (error) {
      console.error('Error updating voucher:', error);
      
      // Handle different error types
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Error updating voucher');
      }
    } finally {
      setEditModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Load data on component mount
  useEffect(() => {
    fetchVouchers();
  }, []);

  // DataGrid columns
  const columns = [
    {
      field: 'serialNo',
      headerName: 'S.No.',
      width: 80,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'voucherNo',
      headerName: 'Voucher No',
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          variant="outlined" 
          color="primary"
        />
      )
    },
    {
      field: 'voucherType',
      headerName: 'Type',
      width: 100,
      renderCell: (params) => (
        <Chip 
          label={params.row.voucherTypeLabel} 
          size="small" 
          color={getVoucherTypeColor(params.value)}
        />
      )
    },
    {
      field: 'formattedDate',
      headerName: 'Date',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'particulars',
      headerName: 'Particulars',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Tooltip title={params.value || 'No particulars'}>
          <Typography 
            variant="body2" 
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {params.value || 'No particulars'}
          </Typography>
        </Tooltip>
      )
    },
    {
      field: 'creditName',
      headerName: 'Credit',
      width: 150,
      renderCell: (params) => (
        <Tooltip title={`Credit: ${params.value}`}>
          <Typography 
            variant="body2" 
            color="error.main"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {params.value}
          </Typography>
        </Tooltip>
      )
    },
    {
      field: 'debitName',
      headerName: 'Debit',
      width: 150,
      renderCell: (params) => (
        <Tooltip title={`Debit: ${params.value}`}>
          <Typography 
            variant="body2" 
            color="success.main"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {params.value}
          </Typography>
        </Tooltip>
      )
    },
    {
      field: 'formattedAmount',
      headerName: 'Amount',
      width: 120,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold" color="primary">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'companyName',
      headerName: 'Company',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton 
              size="small" 
              color="primary"
              onClick={() => console.log('View voucher:', params.row)}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton 
              size="small" 
              color="warning"
              onClick={() => handleOpenEditModal(params.row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton 
              size="small" 
              color="error"
              onClick={() => handleDeleteVoucher(params.row._id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in={true} timeout={800}>
        <Box>
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <AccountBalanceIcon
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
              Voucher Management
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Manage and track all your accounting vouchers
            </Typography>
          </Box>

          {/* Filters */}
          <Card sx={{ mb: 3, borderRadius: 3 }}>
            <CardContent>
              <Grid container spacing={3} alignItems="end">
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Search"
                    placeholder="Search by voucher no, particulars..."
                    value={filters.search}
                    onChange={handleFilterChange('search')}
                    InputProps={{
                      startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Voucher Type</InputLabel>
                    <Select
                      value={filters.voucherType}
                      onChange={handleFilterChange('voucherType')}
                      label="Voucher Type"
                    >
                      <MenuItem value="">All Types</MenuItem>
                      <MenuItem value="AP">Accounts Payable</MenuItem>
                      <MenuItem value="PUR">Purchase</MenuItem>
                      <MenuItem value="VCH">Voucher</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    value={filters.startDate}
                    onChange={handleFilterChange('startDate')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    value={filters.endDate}
                    onChange={handleFilterChange('endDate')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      startIcon={<FilterIcon />}
                      onClick={handleSearch}
                      sx={{ flexGrow: 1 }}
                    >
                      Filter
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleReset}
                    >
                      Reset
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Data Grid */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ height: 600, width: '100%' }}>
                {vouchers.length === 0 && !loading ? (
                  <Paper sx={{ p: 4, textAlign: 'center', margin: 2 }}>
                    <ReceiptIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Vouchers Found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {filters.search || filters.voucherType || filters.startDate || filters.endDate 
                        ? 'Try adjusting your filters' 
                        : 'No vouchers have been created yet'
                      }
                    </Typography>
                  </Paper>
                ) : (
                  <DataGrid
                    rows={vouchers}
                    columns={columns}
                    loading={loading}
                    paginationMode="server"
                    rowCount={pagination.totalCount}
                    page={pagination.page - 1} // DataGrid uses 0-based indexing
                    pageSize={pagination.limit}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    pageSizeOptions={[5, 10, 25, 50, 100]}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                      toolbar: {
                        showQuickFilter: false // We have custom filters
                      }
                    }}
                    sx={{
                      '& .MuiDataGrid-root': {
                        border: 'none'
                      },
                      '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid #f0f0f0'
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
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Fade>

      {/* Edit Modal */}
      <Dialog
        open={editModal.open}
        onClose={handleCloseEditModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 2
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <EditIcon color="primary" />
            <Typography variant="h6" component="div">
              Edit Voucher
            </Typography>
          </Box>
          <IconButton
            onClick={handleCloseEditModal}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <Divider />
        
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom>
                Basic Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Voucher Number *"
                value={editFormData.voucherNo}
                onChange={handleEditFormChange('voucherNo')}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Voucher Type *</InputLabel>
                <Select
                  value={editFormData.voucherType}
                  onChange={handleEditFormChange('voucherType')}
                  label="Voucher Type *"
                >
                  <MenuItem value="AP">Accounts Payable</MenuItem>
                  <MenuItem value="PUR">Purchase</MenuItem>
                  <MenuItem value="VCH">Voucher</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date *"
                type="date"
                value={editFormData.date}
                onChange={handleEditFormChange('date')}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount *"
                type="number"
                value={editFormData.amount}
                onChange={handleEditFormChange('amount')}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Particulars"
                multiline
                rows={2}
                value={editFormData.particulars}
                onChange={handleEditFormChange('particulars')}
                placeholder="Enter voucher particulars..."
              />
            </Grid>

            {/* Credit and Debit Information */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                Credit & Debit Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Credit Model</InputLabel>
                <Select
                  value={editFormData.credit.model}
                  onChange={handleEditFormChange('credit.model')}
                  label="Credit Model"
                >
                  <MenuItem value="">Select Model</MenuItem>
                  <MenuItem value="Transaction">Transaction</MenuItem>
                  <MenuItem value="Vendor">Vendor</MenuItem>
                  <MenuItem value="Product">Product</MenuItem>
                  <MenuItem value="Property">Property</MenuItem>
                  <MenuItem value="ServiceProvider">Service Provider</MenuItem>
                  <MenuItem value="Staff">Staff</MenuItem>
                  <MenuItem value="Customer">Customer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Credit ID"
                value={editFormData.credit.id}
                onChange={handleEditFormChange('credit.id')}
                placeholder="Enter credit entity ID"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Debit Model</InputLabel>
                <Select
                  value={editFormData.debit.model}
                  onChange={handleEditFormChange('debit.model')}
                  label="Debit Model"
                >
                  <MenuItem value="">Select Model</MenuItem>
                  <MenuItem value="Transaction">Transaction</MenuItem>
                  <MenuItem value="Vendor">Vendor</MenuItem>
                  <MenuItem value="Product">Product</MenuItem>
                  <MenuItem value="Property">Property</MenuItem>
                  <MenuItem value="ServiceProvider">Service Provider</MenuItem>
                  <MenuItem value="Staff">Staff</MenuItem>
                  <MenuItem value="Customer">Customer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Debit ID"
                value={editFormData.debit.id}
                onChange={handleEditFormChange('debit.id')}
                placeholder="Enter debit entity ID"
              />
            </Grid>

            {/* Additional Details */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                Additional Details
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Details"
                multiline
                rows={3}
                value={editFormData.details}
                onChange={handleEditFormChange('details')}
                placeholder="Enter additional details..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <Divider />
        
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleCloseEditModal}
            variant="outlined"
            disabled={editModal.loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateVoucher}
            variant="contained"
            startIcon={editModal.loading ? <CircularProgress size={16} /> : <SaveIcon />}
            disabled={editModal.loading}
          >
            {editModal.loading ? 'Updating...' : 'Update Voucher'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VoucherManagement;