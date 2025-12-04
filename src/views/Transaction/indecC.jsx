/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Card,
  Box,
  Breadcrumbs,
  Popover,
  MenuItem,
  IconButton,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useNavigate , useLocation} from 'react-router';
import { getApi } from '@/core/apis/api';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
// import AddOwner from './AddOwner';
// import EditOwner from './EditOwner';
// import DeleteOwner from './DeleteOwner';
import TableStyle from '../../ui-component/TableStyle';
import Iconify from '../../ui-component/iconify';
import { urls } from '@/core/Constant/urls';
import { IconHome } from '@tabler/icons';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { tokenPayload } from '@/helper';
// import BulkUploadOwner from './BulkUploadOwner';


const Transaction = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openBulkUploadDialog, setOpenBulkUploadDialog] = useState(false);
  const [dialogState, setDialogState] = useState({ add: false, edit: false, delete: false });
  const [rowData, setRowData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [data, setData] = useState([]);
  const payload = tokenPayload();

  const fetchTransactions = async () => {
    // try {
      const response = await getApi(urls.Subscribe.getSubTransaction, { id: payload.companyId });
      console.log(response.data,"response.data")
      setData(response.data);
    // } catch (error) {
    //   console.error('Error fetching owner data:', error);
    //   toast.error(t('Failed to fetch owner data!'));
    // }
  };

  useEffect(() => {
    fetchTransactions();
  }, [dialogState]);

  const openDialog = (type, row = null) => {
    setRowData(row);
    setDialogState((prev) => ({ ...prev, [type]: true }));
  };

  const bulkDialogOpen = () => {
    setOpenBulkUploadDialog(true);
  };

  const handleBulkDialogClose = () => {
    setOpenBulkUploadDialog(false); 
  };

  const closeDialog = (type) => {
    setDialogState((prev) => ({ ...prev, [type]: false }));
    setRowData(null);
  };

  const handleOpenView = () => {
    navigate(`/dashboard/owner/view?id=${rowData._id}`);
  };

  const handlePopoverOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setRowData(row);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setRowData(null);
  };

  const breadcrumbs = [
    <Link key="home" to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
      <IconHome />
    </Link>,
    <Typography key="owners" color="text.primary">
      {t('Transaction')}
    </Typography>,
  ];

  const columns = [
    {
      field: 'serialNo',
      headerName: t('S.No.'), // Translated
      width: 80,
      renderCell: (params) => data.findIndex((row) => row._id === params.row._id) + 1,
    },
    {
      field: 'subscriptionTitle',
      headerName: t('Subscription Plan Name'),
      flex: 1,
      valueGetter: (params) => params.row.subscriptionId?.title?.trim() || t('N/A'),
    },
    {
      field: 'noOfDays',
      headerName: t('No. of Days'),
      flex: 1,
      valueGetter: (params) => params.row.subscriptionId?.noOfDays || t('N/A'),
    },
    {
      field: 'transactionDate',
      headerName: t('Purchase Date'),
      flex: 1,
      valueGetter: (params) =>
        params.row.transactionDate
          ? new Date(params.row.transactionDate).toLocaleDateString()
          : t('N/A'),
    },
    {
      field: 'amount',
      headerName: t('Amount'),
      flex: 1,
      valueGetter: (params) => `₹${params.row.amount}`,
    },
  ];
  

  return (
    <>
  
      {/* <AddOwner open={dialogState.add} handleClose={() => closeDialog('add')} />
      <EditOwner open={dialogState.edit} handleClose={() => closeDialog('edit')} data={rowData} />
      <DeleteOwner open={dialogState.delete} handleClose={() => closeDialog('delete')} id={rowData?._id} />
      <BulkUploadOwner open={openBulkUploadDialog} data={payload} onClose={handleBulkDialogClose} /> */}
      <Container>
        {/* Breadcrumbs and Header */}
        <Card sx={{ p: 2, mb: 2 }}>
  <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
    <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    {t('Transaction')}
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        {breadcrumbs}
      </Breadcrumbs>
    </Typography>
    
  
  </Stack>
</Card>

        {/* Data Table */}
        <TableStyle>
          <Box width="100%">
            <Card sx={{ height: '600px', pt: 2 }}>
              <DataGrid
                rows={data}
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
    </>
  );
};

export default Transaction;
