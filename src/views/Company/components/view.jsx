/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Card,
  Box,
  Breadcrumbs,
  Paper,
  Grid,
  Divider,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { IconHome } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import Tab from '@mui/material/Tab';
import { getApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { tokenPayload } from '@/helper';
import TableStyle from '../../../ui-component/TableStyle';

const CompanyView = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const payload = tokenPayload();
  const queryParams = new URLSearchParams(location.search);
  const companyId = queryParams.get('id');

  const [tabValue, setTabValue] = useState('1');
  const [companyData, setCompanyData] = useState({});
  const [propertyData, setPropertyData] = useState([]);
  const [agentData, setAgentData] = useState({});
  const [tenant, setTenantData] = useState({});
  

  useEffect(() => {
    fetchCompanyData();
    fetchAgentData();
    fetchPropertyData();
    fetchTennatData();
  }, [companyId]);

  const fetchCompanyData = async () => {
    try {
      const response = await getApi(urls.company.getCompanyById, { id: companyId });
      setCompanyData(response.data);
    } catch (err) {
      console.error('Error fetching company data', err);
    }
  };

  const fetchPropertyData = async () => {
    try {
      const response = await getApi(urls.property.propertyDataAll, { id: companyId });
      setPropertyData(response.data);
    } catch (err) {
      console.error('Error fetching property data', err);
    }
  };

  const fetchAgentData = async () => {
    try {
      const response = await getApi(urls.agent.agentdata, { id: companyId });
      setAgentData(response.data);
    } catch (err) {
      console.error('Error fetching property data', err);
    }
  };

  const fetchTennatData = async () => {
    try {
      const response = await getApi(urls.tenant.getAllTenants, { id: companyId });
      setTenantData(response.data);
    } catch (err) {
      console.error('Error fetching property data', err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // const breadcrumbs = [
  //   <Link key="home" to="/dashboard/SADashboard" style={{ color: 'inherit', textDecoration: 'none' }}>
  //     <IconHome />
  //   </Link>,
  //   <Typography key="companyProfile" color="text.primary">
  //     {t('Company Profile')}
  //   </Typography>,
  // ];

    const breadcrumbs = [
      <Link key="home" to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
        <IconHome />
      </Link>,
      <Link key="company management" to="/dashboard/company" style={{ color: 'inherit', textDecoration: 'none' }}>
      {t('Company Management')}
    </Link>,
      <Typography key="company" color="text.primary">
        {t('view')}
      </Typography>,
    ];

  const columnsproperty = [
    { field: 'propertyname', headerName: t('Property Name'), flex: 1 },
    { field: 'area', headerName: t('Area in sqft'), flex: 1 },
    { field: 'address', headerName: t('Address'), flex: 1 },
    { field: 'rent', headerName: t('Rent'), flex: 1 },
      {
          field: 'isVacant',
          headerName: t('Vacant'),
          flex: 1,
          renderCell: (params) => (
            <Typography
              style={{
                color: params.row.isVacant ? 'red' : 'green',
                fontWeight: 'bold'
              }}
            >
              {params.row.isVacant ? t('Vacant') : t('Occupied')}
            </Typography>
          )
        },
  ];

  const columnsagent = [
    { field: 'agentName', headerName: t('Agent Name'), flex: 1 },
    { field: 'email', headerName: t('Email'), flex: 1 },
    { field: 'phoneNo', headerName: t('Phone No'), flex: 1 },
    { field: 'address', headerName: t('address'), flex: 1 }
  ];

  
  const columnsTenant = [
    { field: 'tenantName', headerName: t('Tenant Name'), flex: 1 },
    { field: 'email', headerName: t('Email'), flex: 1 },
    { field: 'phoneno', headerName: t('Phone No'), flex: 1 },
    { field: 'address', headerName: t('address'), flex: 1 },
      {
          field: 'isOccupied',
          headerName: t('Occupied/unOccupied'),
          flex: 1,
          renderCell: (params) => (
            <Typography
              style={{
                color: params.row.isOccupied ? 'green' : 'blue',
                fontWeight: 'bold',
              }}
            >
              {params.row.isOccupied ? t('Occupied') : t('Not Occupied')}
            </Typography>
          ),
        },
  ];
  
  return (
    <Container>
      {/* Breadcrumb and Heading */}
      <Card sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {t('Company Details')}
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              {breadcrumbs}
            </Breadcrumbs>
          </Typography>
        </Stack>
      </Card>

      {/* Tabs Card */}
      <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleTabChange} aria-label="Company Tabs">
              <Tab label={t('Company Details')} value="1" />
              <Tab label={t('Property Details')} value="2" />
              <Tab label={t('Agent Details')} value="3" />
              <Tab label={t('Tenant Details')} value="4" />
            </TabList>
          </Box>

          {/* Company Details Tab */}
          <TabPanel value="1">
            <Grid container spacing={3}>
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
                    {t('Company Information')}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Typography variant="h6">{t('Company Name')}</Typography>
                      <Typography>{companyData.companyName || t('not_available')}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6">{t('Email')}</Typography>
                      <Typography>{companyData.email || t('not_available')}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6">{t('Phone No')}</Typography>
                      <Typography>{companyData.phoneNo || t('not_available')}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6">{t('Address')}</Typography>
                      <Typography>{companyData.address || t('not_available')}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6">{t('GST Number')}</Typography>
                      <Typography>{companyData.gstnumber || t('not_available')}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6">{t('Currency Code')}</Typography>
                      <Typography>{companyData.currencyCode || t('not_available')}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6">{t('Onboarding Date')}</Typography>
                      <Typography>
                        {companyData.createdAt
                          ? new Date(companyData.createdAt).toLocaleDateString()
                          : t('not_available')}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Property Details Tab */}
          <TabPanel value="2">
            <TableStyle>
              <Box width="100%">
                <Card style={{ height: '600px', paddingTop: '15px' }}>
                  <DataGrid
                    rows={propertyData}
                    columns={columnsproperty}
                    getRowId={(row) => row._id || row.id}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{ toolbar: { showQuickFilter: true } }}
                  />
                </Card>
              </Box>
            </TableStyle>
          </TabPanel>

          <TabPanel value="3">
            <TableStyle>
              <Box width="100%">
                <Card style={{ height: '600px', paddingTop: '15px' }}>
                  <DataGrid
                    rows={agentData}
                    columns={columnsagent}
                    getRowId={(row) => row._id || row.id}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{ toolbar: { showQuickFilter: true } }}
                  />
                </Card>
              </Box>
            </TableStyle>
          </TabPanel>

          <TabPanel value="4">
            <TableStyle>
              <Box width="100%">
                <Card style={{ height: '600px', paddingTop: '15px' }}>
                  <DataGrid
                    rows={tenant}
                    columns={columnsTenant}
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
    </Container>
  );
};

export default CompanyView;
