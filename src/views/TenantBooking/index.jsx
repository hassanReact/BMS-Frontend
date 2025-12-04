/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
// @mui
import {
  Stack,
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Popover,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { IconHome } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import { urls } from '@/core/Constant/urls';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { getApi } from '@/core/apis/api';
import { tokenPayload } from '@/helper';
import TableStyle from '../../ui-component/TableStyle';

const TenantBooking = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [bookingData, setBookingData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);

  const payload = tokenPayload();

  // Fetch tenant booking data
  const fetchBookingData = async () => {
    const response = await getApi(urls.tenant.tenantBookingData, { id: payload._id });

    if (response?.data && Array.isArray(response.data)) {
      const formattedData = response.data.map((item) => ({
        ...item,
        tenantName: item.tenantId?.tenantName || 'N/A',
        propertyname: item.propertyId?.propertyname || 'N/A',
        startingDate: item.startingDate
          ? new Date(item.startingDate).toLocaleDateString()
          : 'N/A',
        endingDate: item.endingDate
          ? new Date(item.endingDate).toLocaleDateString()
          : 'N/A',
      }));
      setBookingData(formattedData);
    } else {
      setBookingData([]);
    }
  };

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const handleOpenView = () => {
    if (currentRow) {
      navigate(`/dashboard/booking/tenant/view?id=${currentRow._id}&reporterName=${currentRow.name}`);
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, []);

  const columns = [
    {
      field: 'serialNo',
      headerName: 'S.No.',
      width: 30,
      renderCell: (params) => {
        const rowIndex = bookingData.findIndex((row) => row._id === params.row._id);
        return rowIndex + 1; 
      },
    },
    // { field: 'propertyname', headerName: t('Property Name'), flex: 1,
    //    renderCell: (params) => (
    //                 <Button
    //                   variant="text"
    //                   color="primary"
    //                   onClick={() =>
    //                     navigate(`/dashboard/property/view?id=${params.row._id}`) 
    //                   }
    //                 >
    //                   {params.row.propertyname}  
    //                 </Button>
    //               ),
    //  },
     { field: 'propertyname', headerName: t('Property Name'), flex: 1 },

    { field: 'tenantName', headerName: t('Tenant Name'), flex: 1 },
    // { field: 'tenantName', headerName: t('Resident Name'), flex: 1 },

    // { field: 'startingDate', headerName: t('Starting Date'), flex: 1 },
    { field: 'startingDate', headerName: t('Date'), flex: 1 },
    // { field: 'endingDate', headerName: t('Ending Date'), flex: 1 },
    // { field: 'rentAmount', headerName: t('Rent Amount'), flex: 1 },
    // { field: 'rentAmount', headerName: t('Maintenance Amount'), flex: 1 },
    { field: 'name', headerName: t('Created By'), flex: 1 },
    {
      field: 'action',
      headerName: t('Action'),
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            aria-describedby={params?.row._id}
            onClick={(event) => handleClick(event, params?.row)}
          >
            <MoreVertIcon />
          </IconButton>
          <Popover
            id={params?.row._id}
            open={Boolean(anchorEl) && currentRow?._id === params?.row._id}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <MenuItem onClick={handleOpenView} disableRipple>
              <VisibilityIcon style={{ marginRight: '8px', color: 'green' }} />
              {t('View')}
            </MenuItem>
            {/* <MenuItem
              onClick={() => {
                handleClose();
              }}
              disableRipple
            >
              <EditIcon style={{ marginRight: '8px' }} />
              {t('Edit')}
            </MenuItem>
            <MenuItem
              sx={{ color: 'red' }}
              onClick={() => {
                handleClose();
               
              }}
              disableRipple
            >
              <DeleteIcon style={{ marginRight: '8px', color: 'red' }} />
              {t('Delete')}
            </MenuItem> */}
          </Popover>
        </>
      ),
    },
  ];

  // Breadcrumbs
  const breadcrumbs = [
    <Link
      underline="hover"
      key="home"
      to="/dashboard/default"
      style={{ color: 'inherit' }}
    >
      <IconHome />
    </Link>,
    <Typography key="mybooking" color="text.primary">
      {t('My Booking')}
    </Typography>,
  ];

  return (
    <Container>
      <Card sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {t('My Bookings')}
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              {breadcrumbs}
            </Breadcrumbs>
          </Typography>
        </Stack>
      </Card>

      <TableStyle>
        <Box width="100%">
          <Card style={{ height: '600px', paddingTop: '15px' }}>
            <DataGrid
              rows={bookingData}
              columns={columns}
              // checkboxSelection
              getRowId={(row) => row._id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{ toolbar: { showQuickFilter: true } }}
            />
          </Card>
        </Box>
      </TableStyle>
    </Container>
  );
};

export default TenantBooking;
