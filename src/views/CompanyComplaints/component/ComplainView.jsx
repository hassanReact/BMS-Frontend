/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import { Box, Grid, Stack, Typography, TextField, Paper, Button, Divider, Card, Switch, Breadcrumbs, Container } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router';
import { getApi, patchApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { useFormik } from 'formik';
import SendIcon from '@mui/icons-material/Send';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { IconHome } from '@tabler/icons';
import { Link } from 'react-router-dom';

const ComplainDetailsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const label = { inputProps: { 'aria-label': 'Color switch demo' } };
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const complainId = queryParams.get('id');

  const [complainData, setComplainData] = useState({});
  const [tenantData, setTenantData] = useState({});
  const [agentData, setAgentData] = useState({});
  const [propertyData, setPropertyData] = useState({});
  const [status, setStatus] = useState(false);
  const [comment, setComment] = useState(false);

  const fetchComplainData = async () => {
    try {
      const response = await getApi(urls.Complaints.getComplainById, { id: complainId });
      setComplainData(response.data[0]);
      setTenantData(response.data[0].tenantId || {});
      setAgentData(response.data[0].agentId || {});
      setPropertyData(response.data[0].propertyId || {});
      setStatus(response.data[0].status);
    } catch (error) {
      console.error('Error fetching complain data:', error);
    }
  };

  useEffect(() => {
    fetchComplainData();
  }, [complainId, comment]);

  const validationSchema = Yup.object({
    comment: Yup.string().required(t('comment_required')),
  });

  const initialValues = {
    comment: '',
  };

  const addComment = async (values, resetForm) => {
    try {
      const response = await patchApi(
        urls.Complaints.addCommentToComplain,
        { comment: values.comment },
        { id: complainId }
      );

      if (response.success) {
        toast.success(t('comment_added_successfully'));
        setComment(true);
        resetForm();
      } else {
        toast.error(t('something_went_wrong'));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error(t('something_went_wrong'));
    }
  };

  const handleStatusChange = async (event) => {
    setStatus(event.target.checked);

    try {
      const response = await patchApi(
        urls.Complaints.resolveComplain,
        { status: event.target.checked },
        { id: complainId }
      );

      if (response.success) {
        toast.success(t('complain_status_updated'));
      } else {
        toast.error(t('something_went_wrong'));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(t('something_went_wrong'));
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      await addComment(values, resetForm);
    },
  });

  const breadcrumbs = [
    <Link underline="hover" key="home" to="/dashboard/default" style={{ color: 'inherit' }}>
      <IconHome />
    </Link>,
    <Link underline="hover" key="property-management" to="/dashboard/companyComplaints" style={{ color: 'inherit' }}>
      {t('Complain Management')}
    </Link>,
    <Typography key="view" color="text.primary">
      {t('View')}
    </Typography>,
  ];

  // Determine which data to display (tenant or agent)
  const userData = tenantData?.tenantName ? tenantData : agentData;
  const userType = tenantData?.tenantName ? 'Tenant' : 'Agent';

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card sx={{ p: 2, mb: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {t('Complaints')}
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                  {breadcrumbs}
                </Breadcrumbs>
              </Typography>
            </Stack>
          </Card>
        </Grid>

        {/* User Info Section (Tenant or Agent) */}
        <Grid item xs={12} md={6}>
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
              {/*{t('agent_information')}*/}
              {t('Resident Information')}
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                {/*<Typography variant="h5">{t('Agent Name')}</Typography>*/}
                <Typography variant="h5">{t('Resident Name')}</Typography>
                <Typography>{userData?.tenantName || userData?.agentName || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">{t('property_name')}</Typography>
                <Typography>{propertyData?.propertyname || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">{t('email')}</Typography>
                <Typography>{userData?.email || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">{t('phone_number')}</Typography>
                <Typography>{userData?.phoneno || t('not_available')}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Property Info Section */}
        {/*<Grid item xs={12} md={6}>
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
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h5">{t('property_name')}</Typography>
                <Typography>{propertyData?.propertyname || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">{t('property_address')}</Typography>
                <Typography>{propertyData?.address || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">{t('property_rent')}</Typography>
                <Typography>{propertyData?.rent || t('not_available')}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>*/}

        {/* Complain Info Section */}
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
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h5">{t('concern_topic')}</Typography>
                  <Typography>{complainData?.concernTopic || t('not_available')}</Typography>

                  <br />
                  <Typography variant="h5">{t('complain_description')}</Typography>
                  <Typography>{complainData?.description || t('not_available')}</Typography>

                  <br />
                  <Typography variant="h5">{t('complain_date')}</Typography>
                  <Typography>{new Date(complainData?.createdAt).toLocaleDateString() || t('not_available')}</Typography>
                  <br />
                  <Typography variant="h5">{t('Previous Comment Added by you')}</Typography>
                  <Typography>{complainData?.comment || t('not_available')}</Typography>
                </Grid>

                {/* Right-aligned Section */}
                <Grid item xs={6}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <Typography variant="h5">{t('Add Comment')}</Typography>
                    <TextField
                      id="comment"
                      name="comment"
                      size="small"
                      fullWidth
                      multiline
                      rows={2}
                      value={formik.values.comment}
                      onChange={formik.handleChange}
                      error={formik.touched.comment && Boolean(formik.errors.comment)}
                      helperText={formik.touched.comment && formik.errors.comment}
                      sx={{ width: '100%' }}
                    />

                    <Button
                      variant="contained"
                      endIcon={<SendIcon />}
                      type="submit"
                      sx={{ alignSelf: 'flex-end' }}
                    >
                      {t('add_comment')}
                    </Button>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          color: status ? 'green' : 'red',
                          fontWeight: 'bold',
                        }}
                      >
                        {status ? t('Resolved') : t('Pending')}
                      </Typography>
                      <Switch
                        {...label}
                        checked={status}
                        onChange={handleStatusChange}
                        inputProps={{ 'aria-label': 'Resolved complaint' }}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ComplainDetailsPage;