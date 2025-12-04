/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper, Divider, Container,  IconButton, Card, Breadcrumbs, Stack ,  Popover,  MenuItem,} from '@mui/material';
import { useNavigate, useLocation } from 'react-router';
import { getApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IconHome } from '@tabler/icons';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TableStyle from '@/ui-component/TableStyle';
// import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';



const BookingDetailsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get('id');
  const reporterName = queryParams.get('reporterName');
  const [rowData, setRowData] = useState([]);

  const [bookingData, setBookingData] = useState({});
  const [tenantData, setTenantData] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
    const [billData, setBillData] = useState([]);
  const [currentRow, setCurrentRow] = useState(null);
    
  
  const [propertyData, setPropertyData] = useState({});
  const [value, setValue] = useState('1'); 

  const fetchBookingData = async () => {
    try {
      const response = await getApi(urls.booking.getBookingById, { id: bookingId });
      setBookingData(response.data);
      setTenantData(response.data.tenantId);
      setPropertyData(response.data.propertyId);
    } catch (error) {
      console.error('Error fetching booking data:', error);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue); 
  };
  const handleClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };
  useEffect(() => {
    fetchBookingData();
  }, [bookingId]);

     const fetchBillDataByBookingId = async () => {
        const response = await getApi(urls.bill.getBillByBookingId, { id: bookingId});
        const formattedData = response.data.map((item) => {
          const billingDate = new Date(item.billingMonth);
          const formattedBillingMonth = `${billingDate.toLocaleString('default', { month: 'long' })} ${billingDate.getFullYear()}`; // Format as "Month Year"
    
          return {
            ...item,
            tenantName: item.tenantId?.tenantName,
            propertyName: item.propertyId?.propertyname,
            billingMonth: formattedBillingMonth,
          };
        });
          setBillData(formattedData);
      };
  
    useEffect(() => {
      fetchBillDataByBookingId();
    }, []);

      const columns = [
        {
          field: 'serialNo',
          headerName: 'S.No.',
          width: 30,
          renderCell: (params) => {
            const rowIndex = billData.findIndex((row) => row._id === params.row._id);
            return rowIndex + 1; 
          }},
        {
          field: 'tenantName',
          headerName: t('Tenant Name'),
          // headerName: t('Resident Name'),
          flex: 1,
          // cellClassName: 'name-column--cell name-column--cell--capitalize',
        },
        {
          field: 'propertyName',
          headerName: t('Property Name'),
          flex: 1,
        },
        {
          field: 'billingMonth',
          headerName: t('Billing Month'),
          flex: 1,
        },
        {
          field: 'totalBillAmount',
          headerName: t('Total Bill Amount'),
          flex: 1,
          cellClassName: 'name-column--cell--capitalize',
        },
        {
          field: 'status',
          headerName: t('Status'),
          flex: 1,
          cellClassName: 'name-column--cell--capitalize',
          renderCell: (params) => (
            <Typography 
              style={{ 
                color: params.row.status ? 'green' : 'red', 
                fontWeight: 'bold' 
              }}
            >
              {params.row.status ? t('Resolved') : t('Pending')}
            </Typography>
          ),
        },
        {
          field: 'action',
          headerName: t('Action'),
          flex: 1,
          renderCell: (params) => (
            <>
              <IconButton
                aria-describedby={params.row._id}
                onClick={(event) => handleClick(event, params.row)}
              >
                <MoreVertIcon />
              </IconButton>
              <Popover
                id={params.row._id}
                open={Boolean(anchorEl) && currentRow?._id === params.row._id}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                {/* <MenuItem onClick={handleOpenEditCompany} disableRipple>
                  <EditIcon style={{ marginRight: '8px' }} />
                  {t('Edit')}
                </MenuItem> */}
                 <MenuItem onClick={handleOpenView}>
                              <VisibilityIcon style={{ marginRight: '8px', color: 'green' }} />
                              {t('view')}
                            </MenuItem>
                {/* <MenuItem
                  onClick={handleOpenDeleteCompany}
                  sx={{ color: 'red' }}
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

      const handleClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setCurrentRow(row);
        setRowData(row);  
      };

      
  // const handleOpenView = () => {
  //   navigate(`/dashboard/booking/view?id=${currentRow._id}&reporterName=${currentRow.name}`);
  // };
  const handleOpenView = () => {
    navigate(`/dashboard/billC/view?id=${currentRow._id}`);
  };

  const breadcrumbs = [
    <Link underline="hover" key="home" to="/dashboard/default" style={{ color: 'inherit' }}>
      <IconHome />
    </Link>,
    <Link underline="hover" key="property-management" to="/dashboard/booking" style={{ color: 'inherit' }}>
      {t('Booking Management')}
    </Link>,
    <Typography key="view" color="text.primary">
      {t('View')}
    </Typography>,
  ];

  return (
    <Container>
      <Grid container spacing={3}>
        {/* Booking Title Section */}
        <Grid item xs={12}>
          <Card sx={{ p: 2, mb: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {t('Booking Details')}
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                  {breadcrumbs}
                </Breadcrumbs>
              </Typography>
            </Stack>
          </Card>
        </Grid>

        {/* Tab Section */}
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label={t('Booking Information')} value="1" />
                  {/*<Tab label={t('Tenant Bills')} value="2" />*/}
                  <Tab label={t('Resident Bills')} value="2" />
                </TabList>
              </Box>

              {/* TabPanel 1 - Booking Information */}
              <TabPanel value="1">
                <Grid container spacing={3}>
                  {/* Tenant Information */}
                  <Grid item xs={12} >
                    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="h5" gutterBottom>{t('tenant_information')}</Typography>
                    {/* <Typography variant="h5" gutterBottom>{t('Resident Information')}</Typography> */}
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6">{t('tenant_name')}</Typography>
                          {/* <Typography variant="h6">{t('Resident Name')}</Typography> */}
                          <Typography>{tenantData.tenantName || t('not_available')}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6">{t('email')}</Typography>
                          <Typography>{tenantData.email || t('not_available')}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6">{t('phone_number')}</Typography>
                          <Typography>{tenantData.phoneno || t('not_available')}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6">{t('Address')}</Typography>
                          <Typography>{tenantData.address || t('not_available')}</Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>

                  {/* Property Information */}
                  <Grid item xs={12} >
                    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                      <Typography variant="h5" gutterBottom>{t('property_information')}</Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6">{t('property_name')}</Typography>
                          <Typography>{propertyData.propertyname || t('not_available')}</Typography>
                        </Grid>
                        {/*<Grid item xs={12} sm={6}>
                          <Typography variant="h6">{t('property_address')}</Typography>
                          <Typography>{propertyData.address || t('not_available')}</Typography>
                        </Grid>*/}
                        {/* <Grid item xs={12} sm={6}> */}
                          {/*<Typography variant="h6">{t('property_rent')}</Typography>*/}
                          {/* <Typography variant="h6">{t('Property Maintenance')}</Typography>
                          <Typography>{propertyData.rent || t('not_available')}</Typography>
                        </Grid> */}
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6">{t('description')}</Typography>
                          <Typography>{propertyData.description || t('not_available')}</Typography>
                        </Grid>
                        {/*<Grid item xs={12} sm={6}>
                          <Typography variant="h6">{t('zipcode')}</Typography>
                          <Typography>{propertyData.zipcode || t('not_available')}</Typography>
                        </Grid>*/}
                      </Grid>
                    </Paper>
                  </Grid>

                  {/* Booking Details */}
                  <Grid item xs={12}>
                    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                      <Typography variant="h5" gutterBottom>{t('booking_details')}</Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6">{t('booking_date')}</Typography>
                          <Typography>{new Date(bookingData.bookingDate).toLocaleDateString() || t('not_available')}</Typography>
                        </Grid>
                        {/*<Grid item xs={12} sm={6}>
                          <Typography variant="h6">{t('advance_amount')}</Typography>
                          <Typography>{bookingData.advanceAmount || t('not_available')}</Typography>
                        </Grid>*/}
                        {/*<Grid item xs={12} sm={6}>
                          <Typography variant="h6">{t('starting_date')}</Typography>
                          <Typography>{new Date(bookingData.startingDate).toLocaleDateString() || t('not_available')}</Typography>
                        </Grid>*/}
                        {/*<Grid item xs={12} sm={6}>
                          <Typography variant="h6">{t('ending_date')}</Typography>
                          <Typography>{new Date(bookingData.endingDate).toLocaleDateString() || t('not_available')}</Typography>
                        </Grid>*/}
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </TabPanel>

              {/* TabPanel 2 - Tenant Bills (Empty for now) */}
              <TabPanel value="2">
                 <TableStyle>
                        <Box width="100%">
                          <Card style={{ height: '600px', paddingTop: '15px' }}>
                            <DataGrid
                              rows={billData}
                              columns={columns}
                              // checkboxSelection
                              getRowId={(row) => row._id || row.id}
                              slots={{ toolbar: GridToolbar }}
                              slotProps={{ toolbar: { showQuickFilter: true } }}
                            />
                          </Card>
                        </Box>
                      </TableStyle>
              </TabPanel>
            </TabContext>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookingDetailsPage;
