import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Select,
  FormControl,
  Typography,
  Breadcrumbs,
  Link,
  InputAdornment,
  Toolbar,
  AppBar
} from '@mui/material';
import { Home, ViewColumn, FilterList, GridView, FileDownload, Search, MoreVert, NavigateNext } from '@mui/icons-material';

// Sample data for defaulters
const defaulterData = [
  {
    id: 1,
    residentName: 'Danish Khan',
    propertyName: '406',
    paymentType: 'cash',
    billingMonth: 'June 2025',
    totalBillAmount: 6000,
    bookingCreator: 'Lakhani Builders',
    status: 'Defaulter'
  }
];

export default function Defaulter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)' }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ color: 'text.secondary' }}>
            <Link underline="hover" color="inherit" href="#" sx={{ display: 'flex', alignItems: 'center' }}>
              <Home sx={{ mr: 0.5, fontSize: 16 }} />
            </Link>
            <Typography color="text.primary" fontWeight="medium">
              Defaulter
            </Typography>
          </Breadcrumbs>
          <Typography variant="body2" color="text.secondary">
            Saturday, 6/21/2025 4:00:47 PM
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <Paper elevation={1} sx={{ borderRadius: 2 }}>
          {/* Page Title */}
          <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ color: 'text.secondary' }}>
              <Home sx={{ fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="h6" fontWeight="semibold" color="text.primary">
                Defaulter
              </Typography>
            </Breadcrumbs>
          </Box>

          {/* Controls */}
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
              backgroundColor: 'grey.50',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" size="small" startIcon={<ViewColumn />} sx={{ backgroundColor: 'white' }}>
                Columns
              </Button>
              <Button variant="outlined" size="small" startIcon={<FilterList />} sx={{ backgroundColor: 'white' }}>
                Filters
              </Button>
              <Button variant="outlined" size="small" startIcon={<GridView />} sx={{ backgroundColor: 'white' }}>
                Density
              </Button>
              <Button variant="outlined" size="small" startIcon={<FileDownload />} sx={{ backgroundColor: 'white' }}>
                Export
              </Button>
            </Box>
            <TextField
              size="small"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 250 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                )
              }}
            />
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>S.No.</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Resident Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Property Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Payment Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Billing Month</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Total Bill Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Booking Creator</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {defaulterData.map((item, index) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      '&:hover': { backgroundColor: 'grey.50' },
                      cursor: 'pointer'
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'medium' }}>{index + 1}</TableCell>
                    <TableCell>
                      <Link
                        href="#"
                        underline="hover"
                        sx={{
                          color: 'primary.main',
                          fontWeight: 'medium',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        {item.residentName}
                      </Link>
                    </TableCell>
                    <TableCell>{item.propertyName}</TableCell>
                    <TableCell>{item.paymentType}</TableCell>
                    <TableCell>{item.billingMonth}</TableCell>
                    <TableCell sx={{ fontWeight: 'medium' }}>{item.totalBillAmount}</TableCell>
                    <TableCell>{item.bookingCreator}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        color="error"
                        variant="outlined"
                        size="small"
                        sx={{
                          backgroundColor: 'error.light',
                          color: 'error.dark',
                          fontWeight: 'medium'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={handleMenuClick} sx={{ color: 'text.secondary' }}>
                        <MoreVert />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right'
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right'
                        }}
                      >
                        <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
                        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
                        <MenuItem onClick={handleMenuClose}>Send Reminder</MenuItem>
                        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
                          Mark as Resolved
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: 'divider',
              backgroundColor: 'grey.50',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Rows per page:
              </Typography>
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <Select value={rowsPerPage} onChange={(e) => setRowsPerPage(e.target.value)} sx={{ height: 32 }}>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Typography variant="body2" color="text.secondary">
              1–1 of 1
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
