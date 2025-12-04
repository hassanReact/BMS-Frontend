/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Card,
  Box,
  IconButton,
  Popover,
  Breadcrumbs,
  MenuItem,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getApi } from '@/core/apis/api';
import { Link } from 'react-router-dom';
import TableStyle from '../../ui-component/TableStyle';
import { IconHome } from '@tabler/icons';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTranslation } from 'react-i18next';
import { urls } from '@/core/Constant/urls';
import { tokenPayload } from '@/helper';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

const BillA = () => {
  const { t } = useTranslation();
  const [billData, setBillData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const [currentRow, setCurrentRow] = useState(null);
   const payload = tokenPayload();
   const navigate = useNavigate();


   const fetchBillData = async () => {
      const response = await getApi(urls.bill.getBillByAgentId,  { id: payload._id });
      const formattedData = response.data.map((item) => {
        const billingDate = new Date(item.billingMonth);
        const formattedBillingMonth = `${billingDate.toLocaleString('default', { month: 'long' })} ${billingDate.getFullYear()}`;  
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
    fetchBillData();
  }, []);

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const handleOpenView = () => {
    navigate(`/dashboard/billC/view?id=${currentRow._id}`);
  };

  const breadcrumbs = [
    <Link key="home" to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
      <IconHome />
    </Link>,
    <Typography key="company" color="text.primary">
      {t('bill Management')}
    </Typography>,

  ];

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
      cellClassName: 'name-column--cell name-column--cell--capitalize',
      renderCell: (params) => (
        <Button
          variant="text"
          color="primary"
          onClick={() =>
            navigate(`/dashboard/billC/view?id=${params.row._id}`) 
          }
        >
          {params.row.tenantName}  
        </Button>
      ),
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
       
             <MenuItem onClick={handleOpenView}>
                          <VisibilityIcon style={{ marginRight: '8px', color: 'green' }} />
                          {t('view')}
            </MenuItem>
          </Popover>
        </>
      ),
    },
  ];

  return (
    <Container>
      <Card sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {t('Bill / Invoice Management')}
          </Typography>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
     
        </Stack>
      </Card>
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
    </Container>
  );
};

export default BillA;