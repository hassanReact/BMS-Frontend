/* eslint-disable prettier/prettier */
import { Container, Card, Typography, Button, Grid, TextField, Stack, Breadcrumbs, Box, Divider, Paper } from '@mui/material';
import { Home as HomeIcon, PeopleAlt } from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState, useEffect } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Tab from '@mui/material/Tab';
import AddHomeIcon from '@mui/icons-material/AddHome';
import BookIcon from '@mui/icons-material/Book';

import { getApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { tokenPayload } from '@/helper';
import InfoCard from './CardReportInfo';
import { People } from '@mui/icons-material';
import Person2Icon from '@mui/icons-material/Person2';


const CompanyReport = () => {
  const { t } = useTranslation();
  const payload = tokenPayload();

  const [companyData, setCompanyData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const [agentData, setAgentData] = useState([]);
  const [tenant, setTenant] = useState([]);
  const [bill, setBill] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState('1');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchCompanyData = async () => {
    setLoading(true);
    try {
      const response = await getApi(urls.CompanyReport.getBillSummaryBetweenDates, {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        companyId: payload.companyId
      });

      console.log(response.data, 'response data');
      console.log(response.data, 'response data');

      if (response?.data) {
        setCompanyData(response.data.company || {});
        setPropertyData(response.data.properties || []);
        setAgentData(response.data.agents || []);
        setTenant(response.data.tenants || []);
        // setBill(response?.data?.bills || []);

        console.log(response.data.bills, 'billsxyz');

        const formattedData = response?.data?.bills.map((item) => {
          const billingDate = new Date(item.billingMonth);
          const formattedBillingMonth = `${billingDate.toLocaleString('default', { month: 'long' })} ${billingDate.getFullYear()}`;
          return {
            ...item,
            tenantName: item.tenantId?.tenantName,
            propertyName: item.propertyId?.propertyname,
            billingMonth: formattedBillingMonth
          };
        });

        setBill(formattedData);
    
      } else {
        setCompanyData([]);
        setPropertyData([]);
        setAgentData([]);
        setTenant([]);
      }
    } catch (error) {
      console.error(t('Error fetching company data:'), error);
    } finally {
      setLoading(false);
    }
  };

  console.log(bill, 'bills');

  const columns = [
    { field: 'serialNo', headerName: 'S.No.', width: 60 },
    { field: 'companyName', headerName: t('Company Name'), flex: 1 },
    { field: 'email', headerName: t('Email'), flex: 1 },
    { field: 'phoneNo', headerName: t('Phone No'), flex: 1 },
    { field: 'address', headerName: t('Address'), flex: 1 },
    { field: 'status', headerName: t('Status'), flex: 1 }
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
        <Typography color={params.row.isVacant ? 'red' : 'green'} fontWeight="bold">
          {params.row.isVacant ? t('Vacant') : t('Occupied')}
        </Typography>
      )
    }
  ];

  const billColumns = [
    {
      field: 'serialNo',
      headerName: 'S.No.',
      width: 30,
      renderCell: (params) => {
        const rowIndex = bill.findIndex((row) => row._id === params.row._id);
        return rowIndex + 1;
      }
    },
    {
      field: 'tenantName',
      headerName: t('Tenant Name'),
      flex: 1
      // renderCell: (params) => (
      //   <Button
      //     variant="text"
      //     color="primary"
      //     onClick={() => navigate(`/dashboard/billC/view?id=${params.row._id}`)}
      //   >
      //     {params.row.tenantName}
      //   </Button>
      // ),
    },
    {
      field: 'propertyName',
      headerName: t('Property Name'),
      flex: 1
    },
    {
      field: 'paymentType',
      headerName: t('Payment Type'),
      flex: 1
    },
    {
      field: 'billingMonth',
      headerName: t('Billing Month'),
      flex: 1
    },
    {
      field: 'totalBillAmount',
      headerName: t('Total Bill Amount'),
      flex: 1
    },
    // {
    //   field: 'name',
    //   headerName: t('Booking Creator'),
    //   flex: 1,
    // },
    {
      field: 'status',
      headerName: t('Status'),
      flex: 1,
      renderCell: (params) => (
        <Typography
          style={{
            color: params.row.status ? 'green' : 'red',
            fontWeight: 'bold'
          }}
        >
          {params.row.status ? t('Paid') : t('Pending')}
        </Typography>
      )
    }
    // {
    //   field: 'action',
    //   headerName: t('Action'),
    //   flex: 1,
    //   renderCell: (params) => (
    //     <>
    //       <IconButton
    //         aria-describedby={params.row._id}
    //         onClick={(event) => handleClick(event, params.row)}
    //       >
    //         <MoreVertIcon />
    //       </IconButton>
    //       <Popover
    //         id={params.row._id}
    //         open={Boolean(anchorEl) && currentRow?._id === params.row._id}
    //         anchorEl={anchorEl}
    //         onClose={handleClose}
    //         anchorOrigin={{
    //           vertical: 'bottom',
    //           horizontal: 'left',
    //         }}
    //       >
    //         <MenuItem onClick={handleOpenView}>
    //           <VisibilityIcon style={{ marginRight: '8px', color: 'green' }} />
    //           {t('view')}
    //         </MenuItem>
    //         {userRole === 'companyAdmin' && (
    //           <MenuItem onClick={handleOpenDeleteBill} sx={{ color: 'red' }} disableRipple>
    //             <DeleteIcon style={{ marginRight: '8px', color: 'red' }} />
    //             {t('Delete')}
    //           </MenuItem>
    //         )}
    //       </Popover>
    //     </>
    //   ),
    // },
  ];

  const columnsagent = [
    { field: 'agentName', headerName: t('Agent Name'), flex: 1 },
    { field: 'email', headerName: t('Email'), flex: 1 },
    { field: 'phoneNo', headerName: t('Phone No'), flex: 1 },
    { field: 'address', headerName: t('Address'), flex: 1 }
  ];

  const columnsTenant = [
    { field: 'tenantName', headerName: t('Tenant Name'), flex: 1 },
    { field: 'email', headerName: t('Email'), flex: 1 },
    { field: 'phoneno', headerName: t('Phone No'), flex: 1 },
    { field: 'address', headerName: t('Address'), flex: 1 },
    {
      field: 'isOccupied',
      headerName: t('Occupied/Unoccupied'),
      flex: 1,
      renderCell: (params) => (
        <Typography color={params.row.isOccupied ? 'green' : 'blue'} fontWeight="bold">
          {params.row.isOccupied ? t('Occupied') : t('Not Occupied')}
        </Typography>
      )
    }
  ];

  useEffect(() => {
    if (startDate && endDate) {
      fetchCompanyData();
    }
  }, [startDate, endDate]);

  return (
    <Container>
      {/* Page Header */}
      <Card sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {t('Company Reports')}
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                <HomeIcon sx={{ fontSize: 24 }} />
              </Link>
              <Typography color="text.primary">{t('Company Reports')}</Typography>
            </Breadcrumbs>
          </Typography>
        </Stack>
      </Card>

      {/* Filter and Table */}
      <Card sx={{ p: 2, mb: 4 }}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
  {t('Select a date range below to generate a comprehensive company report.')}
</Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t('From')}
            </Typography>
            <ReactDatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText={t('Start Date')}
              customInput={<TextField fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t('To')}
            </Typography>
            <ReactDatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText={t('End Date')}
              customInput={<TextField fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              onClick={fetchCompanyData}
              disabled={loading || !startDate || !endDate}
              sx={{ height: '70%', mt: { xs: 3, sm: 0 } }}
            >
              {t('Generate Report')}
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Tab Panels */}
      <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
        <TabContext value={tabValue}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2, // spacing between cards
              justifyContent: 'space-between', // or 'flex-start'
              mt: 2
            }}
          >
 <InfoCard isLoading={false} cardName={t('Property')} length={propertyData.length} Icon={AddHomeIcon} />
<InfoCard isLoading={false} cardName={t('Tenants')} length={tenant.length} Icon={Person2Icon} />
<InfoCard isLoading={false} cardName={t('Agents')} length={agentData.length} Icon={Person2Icon} />
<InfoCard isLoading={false} cardName={t('Bills')} length={bill.length} Icon={BookIcon} />
     </Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleTabChange}>
              {/* <Tab label={t('Company Details')} value="1" /> */}
              <Tab label={t('Property Details')} value="1" />
              <Tab label={t('Agent Details')} value="2" />
              <Tab label={t('Tenant Details')} value="3" />
              <Tab label={t('Bills Details')} value="4" />
            </TabList>
          </Box>

          <TabPanel value="1">
            <DataGrid
              rows={propertyData}
              columns={columnsproperty}
              loading={loading}
              getRowId={(row) => row._id || row.id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{ toolbar: { showQuickFilter: true } }}
              autoHeight
            />
            {/* <DataGrid rows={propertyData} columns={columnsproperty} getRowId={(row) => row._id || row.id} autoHeight /> */}
          </TabPanel>

          <TabPanel value="2">
            <DataGrid
              rows={agentData}
              columns={columnsagent}
              loading={loading}
              getRowId={(row) => row._id || row.id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{ toolbar: { showQuickFilter: true } }}
              autoHeight
            />
            {/* <DataGrid rows={agentData} columns={columnsagent} getRowId={(row) => row._id || row.id} autoHeight /> */}
          </TabPanel>

          <TabPanel value="3">
            <DataGrid
              rows={tenant}
              columns={columnsTenant}
              loading={loading}
              getRowId={(row) => row._id || row.id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{ toolbar: { showQuickFilter: true } }}
              autoHeight
            />
            {/* <DataGrid rows={tenant} columns={columnsTenant} getRowId={(row) => row._id || row.id} autoHeight /> */}
          </TabPanel>
          <TabPanel value="4">
            <DataGrid
              rows={bill}
              columns={billColumns}
              loading={loading}
              getRowId={(row) => row._id || row.id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{ toolbar: { showQuickFilter: true } }}
              autoHeight
            />
            {/* <DataGrid rows={tenant} columns={columnsTenant} getRowId={(row) => row._id || row.id} autoHeight /> */}
          </TabPanel>
        </TabContext>
      </Card>
    </Container>
  );
};

export default CompanyReport;
