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
const BillT = () => {
  const { t } = useTranslation();
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [billData, setBillData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
   const payload = tokenPayload();
   
   const navigate = useNavigate();



   const fetchBillData = async () => {
      const response = await getApi(urls.bill.getBillByT,  { id: payload._id });
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
    fetchBillData();
  }, [openAdd, openEdit, openDelete]);

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

  const handleCloseDeleteCompany = () => setOpenDelete(false);

  const handleOpenDeleteCompany = () => {
    setRowData(currentRow);
    setOpenDelete(true);
    handleClose();
  };

  const handleCloseEditCompany = () => setOpenEdit(false);

  const handleOpenEditCompany = () => {
    setRowData(currentRow);
    setOpenEdit(true);
    handleClose();
  };

  const breadcrumbs = [
    <Link key="home" to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
      <IconHome />
    </Link>,
    <Typography key="company" color="text.primary">
      {t('bill Management')}
    </Typography>,
    // <Link key="bill" style={{ color: 'inherit', textDecoration: 'none' }}>
    //   {t('Bill Management')}
    // </Link>
  ];
  

    // const breadcrumbs = [
    //       <Link underline="hover" key="home" to="/dashboard/default" style={{ color: 'inherit' }}>
    //         <IconHome />
    //       </Link>,
    //       <Link underline="hover" key="property-management" to="/dashboard/booking" style={{ color: 'inherit' }}>
    //         {t('Booking Management')}
    //       </Link>,
    //       <Typography key="view" color="text.primary">
    //         {t('View')}
    //       </Typography>,
    //     ];
    // <Link key="bill" style={{ color: 'inherit', textDecoration: 'none' }}>
    //   {t('Bill Management')}
    // </Link>
  // ];
  

    // const breadcrumbs = [
    //       <Link underline="hover" key="home" to="/dashboard/default" style={{ color: 'inherit' }}>
    //         <IconHome />
    //       </Link>,
    //       <Link underline="hover" key="property-management" to="/dashboard/booking" style={{ color: 'inherit' }}>
    //         {t('Booking Management')}
    //       </Link>,
    //       <Typography key="view" color="text.primary">
    //         {t('View')}
    //       </Typography>,
    //     ];

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

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
            {/* <MenuItem onClick={handleOpenEditCompany} disableRipple>
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
          {/* <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleOpenAdd}
          >
            {t('Add Company')}
          </Button> */}
        </Stack>
      </Card>
      <TableStyle>
        <Box width="100%">
          <Card style={{ height: '600px', paddingTop: '15px' }}>
            <DataGrid
              rows={billData}
              columns={columns}
              // checkboxSelection
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

export default BillT;