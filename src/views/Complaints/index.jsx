
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Breadcrumbs,
  Box,
  Card,
  IconButton,
  Popover,
  MenuItem,
  Badge
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';
import { Link } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import AddComplaints from './AddComplaints';
import { IconHome } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import { urls } from '@/core/Constant/urls';
import { useNavigate } from 'react-router';
import { getApi } from '@/core/apis/api';
import { tokenPayload } from '@/helper';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditComplain from './EditComplain';
import DeleteComplain from './DeleteCompalain';
import AddComplaintsByTenants from './AddComplaintByTenants';
import CommentDialog from '@/views/Comments';

const Complaints = () => {
  const { t } = useTranslation();
  const payload = tokenPayload();
  const navigate = useNavigate();

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openComments, setOpenComments] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [complaintData, setComplaintData] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);

  const fetchComplaintData = async () => {
    try {
      const response = await getApi(urls.Complaints.getComplain, { id: payload._id });
      const complaints = response.data;
      setComplaintData(complaints);

      const counts = {};
      for (const complaint of complaints) {
        const res = await getApi(`${urls.Comments.newMessages}/${complaint._id}/${payload._id}`);
        console.log(res.data);
        counts[complaint._id] = res.data?.unreadCount || 0;
      }
      setUnreadCounts(counts);
    } catch (error) {
      console.error(t('Error fetching complaints data:'), error);
    }
  };

  useEffect(() => {
    fetchComplaintData();
  }, [openAdd, openEdit, openDelete, openComments]);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const handleCloseEditComplain = () => setOpenEdit(false);
  const handleCloseDeleteComplain = () => setOpenDelete(false);

  const handleCloseComments = () => {
    setOpenComments(false);
    setCurrentRow(null);
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
    const userRole = payload?.role;
    if (userRole === 'agent') {
      navigate(`/dashboard/complain/agent/view?id=${currentRow._id}&reporterName=${currentRow.reporterName}`);
    } else {
      navigate(`/dashboard/complain/tenant/view?id=${currentRow._id}&reporterName=${currentRow.reporterName}`);
    }
  };

  const handleEditComplaint = () => {
    setRowData(currentRow);
    setOpenEdit(true);
    handleClose();
  };

  const handleDeleteComplaint = () => {
    setRowData(currentRow);
    setOpenDelete(true);
    handleClose();
  };

  const handleOpenComments = (row) => {
    setRowData(row);
    setCurrentRow(row);
    setOpenComments(true);
    handleClose();
  };

  const columns = [
    {
      field: 'serialNo',
      headerName: 'S.No.',
      width: 30,
      renderCell: (params) => {
        const rowIndex = complaintData.findIndex((row) => row._id === params.row._id);
        return rowIndex + 1;
      }
    },
    {
      field: 'concernTopic',
      headerName: t('Topic'),
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="text"
          color="primary"
          onClick={() => {
            const userRole = payload?.role;
            if (userRole === 'agent') {
              navigate(`/dashboard/complain/agent/view?id=${params.row._id}&reporterName=${params.row.reporterName}`);
            } else {
              navigate(`/dashboard/complain/tenant/view?id=${params.row._id}&reporterName=${params.row.reporterName}`);
            }
          }}
        >
          {params.row.concernTopic}
        </Button>
      )
    },
    {
      field: 'comment',
      headerName: t('Comment'),
      flex: 1,
      renderCell: (params) => {
        const unread = unreadCounts[params.row._id] || 0;
        return (
          <MenuItem onClick={() => handleOpenComments(params.row)} disableRipple>
            <Badge badgeContent={unread} color="error" invisible={unread === 0}>
              <CommentIcon style={{ marginRight: '8px', color: 'blue' }} />
            </Badge>
            {t('Comments')}
          </MenuItem>
        );
      }
    },
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
          {params.row.status ? t('Resolved') : t('Pending')}
        </Typography>
      )
    },
    {
      field: 'action',
      headerName: t('Action'),
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton aria-describedby={params.row._id} onClick={(event) => handleClick(event, params.row)}>
            <MoreVertIcon />
          </IconButton>
          <Popover
            id={params.row._id}
            open={Boolean(anchorEl) && currentRow?._id === params.row._id}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
          >
            <MenuItem onClick={handleOpenView} disableRipple>
              <VisibilityIcon style={{ marginRight: '8px', color: 'green' }} />
              {t('view')}
            </MenuItem>
            <MenuItem onClick={handleDeleteComplaint} sx={{ color: 'red' }} disableRipple>
              <DeleteIcon style={{ marginRight: '8px', color: 'red' }} />
              {t('Delete')}
            </MenuItem>
          </Popover>
        </>
      )
    }
  ];

  const breadcrumbs = [
    <Link key="home" to="/" style={{ color: 'inherit' }}>
      <IconHome />
    </Link>,
    <Link key="property-management" to="/dashboard/companyComplaints" style={{ color: 'inherit' }}>
      {t('Complain Management')}
    </Link>
  ];

  return (
    <>
      {payload.role === 'tenant' ? (
        <AddComplaintsByTenants open={openAdd} handleClose={handleCloseAdd} />
      ) : (
        <AddComplaints open={openAdd} handleClose={handleCloseAdd} />
      )}

      <EditComplain open={openEdit} handleClose={handleCloseEditComplain} data={rowData} />
      <DeleteComplain open={openDelete} handleClose={handleCloseDeleteComplain} id={rowData?._id || ''} />

      <CommentDialog
        open={openComments}
        onClose={handleCloseComments}
        complaintId={rowData?._id || ''}
        user={payload || {}}
      />

      <Container>
        <Card sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {t('Complaints')}
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                {breadcrumbs}
              </Breadcrumbs>
            </Typography>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              {t('Add New Complaints')}
            </Button>
          </Stack>
        </Card>

        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              <DataGrid
                rows={complaintData}
                columns={columns}
                getRowId={(row) => row.id || row._id}
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

export default Complaints;
