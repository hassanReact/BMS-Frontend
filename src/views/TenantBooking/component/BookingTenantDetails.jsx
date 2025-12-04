/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import { Box, Grid, Typography, TextField, Paper, Button,  Card, Divider,   Container, Breadcrumbs, Switch, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router';
import { getApi, patchApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { useFormik } from 'formik';
import SendIcon from '@mui/icons-material/Send';
import { Link } from 'react-router-dom';
import * as Yup from 'yup'; 
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { IconHome } from '@tabler/icons';



const BookingDetailsTenantPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const label = { inputProps: { 'aria-label': 'Color switch demo' } };
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get('id');
  const reporterName = queryParams.get('reporterName')

  const [bookingData, setBookingData] = useState({});
  const [tenantData, setTenantData] = useState({});
  const [propertyData, setPropertyData] = useState({});
  const [status, setStatus] = useState(false);


  const fetchBookingData = async () => {
      const response = await getApi(urls.booking.getBookingById, { id: bookingId });
      setBookingData(response.data);
      setTenantData(response.data.tenantId);
      setPropertyData(response.data.propertyId);
      setStatus(response.data.status); 
  };

  useEffect(() => {
    fetchBookingData();
  }, [bookingId]);

   const breadcrumbs = [
      <Link underline="hover" key="home" to="/dashboard/default" style={{ color: 'inherit' }}>
        <IconHome />
      </Link>,
      <Link underline="hover" key="property-management" to="/dashboard/booking" style={{ color: 'inherit' }}>
        {t('My Booking')}
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

        {/* Tenant Info Section */}
        <Grid item xs={12} >
          <Paper
            sx={{
              padding: 3,
              border: '1px solid #333',
              borderRadius: '8px',
              backgroundColor: '#fff',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="h4" gutterBottom>
              {/*{t('tenant_information')}*/}
              {t('Resident Information')}

            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                {/* <Typography variant="h5">{t('tenant_name')}</Typography> */}
                <Typography variant="h5">{t('Resident Name')}</Typography>
                <Typography>{tenantData.tenantName || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">{t('email')}</Typography>
                <Typography>{tenantData.email || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">{t('phone_number')}</Typography>
                <Typography>{tenantData.phoneno || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">{t('Address')}</Typography>
                <Typography>{tenantData.address || t('not_available')}</Typography>
              </Grid>
              {/* <Grid item xs={6}>
                <Typography variant="h5">{t('EmergencyNo')}</Typography>
                <Typography>{tenantData.emergencyNo || t('not_available')}</Typography>
              </Grid> */}
              <Grid item xs={6}>
                <Typography variant="h5">{t('Reported By')}</Typography>
                <Typography>{reporterName || t('not_available')}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Property Info Section */}
        <Grid item xs={12} >
          <Paper
            sx={{
              padding: 3,
              border: '1px solid #333',
              borderRadius: '8px',
              backgroundColor: '#fff',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
           <Typography variant="h4" gutterBottom>
  {t('property_information')}

  {propertyData.maplink ? (
    <a 
      href={propertyData.maplink} 
      target="_blank" 
      rel="noopener noreferrer" 
      style={{
        color: '#3f51b5', 
        textDecoration: 'none', 
        display: 'inline-flex', 
        alignItems: 'left', 
        marginLeft: '150px',
      }}
    >
      {t('Location On Map')} <MyLocationIcon sx={{ ml: 1 }} />
    </a>
  ) : (
    //t('not_available')
    t('')
  )}
</Typography>

            <Divider sx={{ marginBottom: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h5">{t('property_name')}</Typography>
                <Typography>{propertyData.propertyname || t('not_available')}</Typography>
              </Grid>
              {/* <Grid item xs={6}>
                <Typography variant="h5">{t('property_address')}</Typography>
                <Typography>{propertyData.address || t('not_available')}</Typography>
              </Grid> */}
              {/* <Grid item xs={6}>
                <Typography variant="h5">{t('property_rent')}</Typography>
                <Typography>{propertyData.rent || t('not_available')}</Typography>
              </Grid> */}
              {/* <Grid item xs={6}>
                <Typography variant="h5">{t('Property Maintenance')}</Typography>
                <Typography>{propertyData.rent || t('not_available')}</Typography>
              </Grid> */}
              <Grid item xs={6}>
                <Typography variant="h5">{t('Description')}</Typography>
                <Typography>{propertyData.description || t('not_available')}</Typography>
              </Grid>
              {/* <Grid item xs={6}>
                <Typography variant="h5">{t('zipcode')}</Typography>
                <Typography>{propertyData.zipcode || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">{t('Address')}</Typography>
                <Typography>{propertyData.address || t('not_available')}</Typography>
              </Grid> */}
            </Grid>
          </Paper>
        </Grid>

    {/* Booking Details and Comment Section */}
<Grid item xs={12}>
  <Paper
    sx={{
      padding: 3,
      border: '1px solid #333',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    }}
  >
    <Typography variant="h4" gutterBottom>
      {t('booking_details')}
    </Typography>
    <Divider sx={{ marginBottom: 2 }} />
    <Grid container spacing={2}>
      {/* Booking Date */}
      <Grid item xs={12} sm={6}>
        <Typography variant="h5" gutterBottom>
          {t('booking_date')}
        </Typography>
        <Typography variant="body1">
          {new Date(bookingData.bookingDate).toLocaleDateString() || t('not_available')}
        </Typography>
      </Grid>

      {/* Advance Amount */}
      {/* <Grid item xs={12} sm={6}>
        <Typography variant="h5" gutterBottom>
          {t('advance_amount')}
        </Typography>
        <Typography variant="body1">
          {bookingData.advanceAmount || t('not_available')}
        </Typography>
      </Grid> */}

      {/* Starting Date */}
      {/* <Grid item xs={12} sm={6}>
        <Typography variant="h5" gutterBottom>
          {t('starting_date')}
          
        </Typography>
        <Typography variant="body1">
          {new Date(bookingData.startingDate).toLocaleDateString() || t('not_available')}
        </Typography>
      </Grid> */}
      

      {/* Ending Date */}
      {/* <Grid item xs={12} sm={6}>
        <Typography variant="h5" gutterBottom>
          {t('ending_date')}
        </Typography>
        <Typography variant="body1">
          {new Date(bookingData.endingDate).toLocaleDateString() || t('not_available')}
        </Typography>
      </Grid> */}
    </Grid>
  </Paper>
</Grid>

      </Grid>
    </Container>
  );
};

export default BookingDetailsTenantPage;
