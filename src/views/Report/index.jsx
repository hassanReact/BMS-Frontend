/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Stack, Button, Container, Typography, Box, Breadcrumbs, Card } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import { IconHome } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import { urls } from '@/core/Constant/urls';
import { getApi } from '@/core/apis/api';
import { tokenPayload } from '@/helper';

const payload = tokenPayload();
const userRole = payload?.role;

const Reports = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [reportData, setReportData] = useState([]);

  const fetchReportData = async () => {
    try {
      const response = await getApi(urls.company.getSubcriptionDetails);
      console.log(response?.data,"response?.data")
      setReportData(response?.data || []);

    } catch (error) {
      setReportData([]);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const columns = [
    {
      field: 'serialNo',
      headerName: t('S.No.'),
      width: 80,
      renderCell: (params) => {
        const rowIndex = reportData.findIndex((row) => row._id === params.row._id);
        return rowIndex + 1;
      },
    },
    {
      field: 'subcriptionBuyDate',
      headerName: t('Order Date'),
      flex: 1,
      valueGetter: (params) =>
        params.row.subcriptionBuyDate
          ? new Date(params.row.subcriptionBuyDate).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          : '-'
    },

    {
      field: 'endDate',
      headerName: t('End Date'),
      flex: 1,
      valueGetter: (params) => {
        const startDate = new Date(params.row.subcriptionBuyDate);
        const daysToAdd = parseInt(params.row.subcriptionId?.noOfDays, 10);
    
        if (!startDate || isNaN(startDate) || isNaN(daysToAdd)) return '-';
    
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + daysToAdd);
    
        return endDate.toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    },
    
    
    
    {
      field: 'companyName',
      headerName: t('Company Name'),
      flex: 1,
    },
    {
      field: 'subcriptionId.title',
      headerName: t('Subscription Plan'),
      flex: 1,
      valueGetter: (params) => params.row.subcriptionId?.title || '-',
    },
    {
      field: 'subcriptionId.discount',
      headerName: t('Discount (%)'),
      flex: 1,
      valueGetter: (params) => params.row.subcriptionId?.discount || '-',
    },
    
    {
      field: 'subcriptionId.noOfDays',
      headerName: t('No Of Days'),
      flex: 1,
      valueGetter: (params) => params.row.subcriptionId?.noOfDays || '-',
    },
    {
      field: 'amount',
      headerName: t('Amount'),
      flex: 1,
      valueGetter: (params) => {
        const amount = params.row.subcriptionId?.amount;
        const currency = params.row.currencyCode ; 
        return amount ? `${currency} ${amount}` : '-';
      },
    }
  ];

  const breadcrumbs = [
    <Link key="home" to="/dashboard/SADashboard" style={{ color: 'inherit', textDecoration: 'none' }}>
      <IconHome />
    </Link>,
    <Typography key="reports" color="text.primary">
      {t('Company Active Plan')}
    </Typography>,
  ];

  return (
    <Container>
      <Card sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {t('Company Active Plan')}
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              {breadcrumbs}
            </Breadcrumbs>
          </Typography>
        </Stack>
      </Card>

      <TableStyle>
        <Box width="100%">
          <Card sx={{ height: 600, pt: 2 }}>
            <DataGrid
             rows={reportData.filter((item) => item.subcriptionId)}
              columns={columns}
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

export default Reports;
