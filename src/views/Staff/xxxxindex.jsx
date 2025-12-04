/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Stack, Button, Container, Typography, Box, Card, Breadcrumbs, IconButton, Popover, MenuItem } from '@mui/material';
import { IconHome } from '@tabler/icons';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useNavigate } from 'react-router';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import AddAgents from './AddAgents';
import { useTranslation } from 'react-i18next';
import { getApi } from '@/core/apis/api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { urls } from '@/core/Constant/urls';
import EditAgent from './EditAgent';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteAgent from './DeleteAgent';
import { tokenPayload } from '@/helper';
import { Link } from 'react-router-dom';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';


const Agents = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [agentData, setAgentData] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [rowData, setRowData] = useState([]);
  const payload = tokenPayload();

  const fetchAgentData = async () => {
    try {
      const response = await getApi(urls.agent.agentdata, { id: payload._id });
      const data = Array.isArray(response.data) ? response.data : [response.data];
      setAgentData(data);
    } catch (error) {
      console.error(t('errorFetchingData'), error);
      setAgentData([]);
    }
  };

  const handleChangePassword =()=>{
    navigate(`/dashboard/agent/changepassword?id=${currentRow._id}`);
  }

  useEffect(() => {
    fetchAgentData();
  }, [openAdd, openEdit, openDelete]);

  const handleOpenView = () => {
    navigate(`/dashboard/agent/view?id=${currentRow._id}`);
  };

  const handleOpenEditAgent = () => {
    setRowData(currentRow);
    setOpenEdit(true);
    handleClose();
  };

  const handleOpenDeleteAgent = () => {
    setRowData(currentRow);
    setOpenDelete(true);
    handleClose();
  };

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const columns = [
    {
      field: 'serialNo',
      headerName: 'S.No.',
      width: 30,
      renderCell: (params) => {
        const rowIndex = agentData.findIndex((row) => row._id === params.row._id);
        return rowIndex + 1; 
      },
    },
    {
      field: 'agentName',
      headerName: t('agentName'),
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="text"
          color="primary"
          onClick={() =>
            navigate(`/dashboard/agent/view?id=${params.row._id}`) 
          }
        >
          {params.row.agentName}  
        </Button>
      ),
    },
    { field: 'email', headerName: t('email'), flex: 1 },
    { field: 'phoneNo', headerName: t('phoneNo'), flex: 1 },
    { field: 'address', headerName: t('address'), flex: 1 },
    {
      field: 'action',
      headerName: t('action'),
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={(event) => handleClick(event, params.row)}>
            <MoreVertIcon />
          </IconButton>
          <Popover
            open={Boolean(anchorEl) && currentRow?._id === params.row._id}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <MenuItem onClick={handleOpenEditAgent}>
              <EditIcon style={{ marginRight: '8px' }} /> {t('edit')}
            </MenuItem>
            <MenuItem onClick={handleOpenView}>
              <VisibilityIcon style={{ marginRight: '8px', color: 'green' }} /> {t('view')}
            </MenuItem>
            <MenuItem onClick={handleOpenDeleteAgent} sx={{ color: 'red' }}>
              <DeleteIcon style={{ marginRight: '8px', color: 'red' }} /> {t('delete')}
            </MenuItem>
               <MenuItem onClick={handleChangePassword}>
                          <ChangeCircleIcon style={{ marginRight: '8px', color: 'green' }} />
                          {t('Change Password')}
                        </MenuItem>
          </Popover>
        </>
      ),
    },
  ];

  // const breadcrumbs = [
  //   <Link key="1" color="primary" href="/">
  //     <IconHome />
  //   </Link>,
  //   <Link key="2" color="primary" href="/dashboard/agents">
  //     {t('addAgents')}
  //   </Link>,
  //   // <Typography key="3" sx={{ color: 'text.primary' }}>
  //   //   {t('items')}
  //   // </Typography>,
  // ];

    const breadcrumbs = [
      <Link key="home" to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
        <IconHome />
      </Link>,
      <Typography key="agent" color="text.primary">
      {t('Agents Management')} 
      </Typography>,
    ];

  return (
    <>
      <AddAgents open={openAdd} handleClose={() => setOpenAdd(false)} />
      <EditAgent open={openEdit} handleClose={() => setOpenEdit(false)} data={rowData} />
      <DeleteAgent open={openDelete} handleClose={() => setOpenDelete(false)} id={rowData?._id} />
      
      <Container>
        <Card sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
               <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
               {t('Agents Management')} 
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              {breadcrumbs}
            </Breadcrumbs>
            </Typography>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setOpenAdd(true)}>
              {t('addNewAgent')}
            </Button>
          </Stack>
        </Card>
        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              <DataGrid
                rows={agentData}
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

export default Agents;
