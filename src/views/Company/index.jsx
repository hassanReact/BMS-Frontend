/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
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
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getApi, patchApi } from '@/core/apis/api';
import { Link, useNavigate } from 'react-router-dom';
import TableStyle from '../../ui-component/TableStyle';
import { IconHome } from '@tabler/icons';
import AddCompany from './AddCompany';
import Iconify from '../../ui-component/iconify';
import { Navigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTranslation } from 'react-i18next';
import { urls } from '@/core/Constant/urls';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditCompany from './EditCompany';
import DeleteCompany from './DeleteCompany';
import Switch from '@mui/material/Switch';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

const label = { inputProps: { 'aria-label': 'Switch demo' } };


// ----------------------------------------------------------------------

const Company = () => {
 
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [status , setStatus] = useState([]);


  const updateCompanyStatus = async (id) => {
    try {
      const response = await patchApi(urls.company.changestatus,{},{id:id} );
      if (response?.data ) {
        setStatus(response.data);
      } else {
        setStatus([]);
      }
    } catch (error) {
      console.error(t('Error changing company status:'), error);
    }
  };

  const fetchCompanyData = async () => {
    try {
      const response = await getApi(urls.company.companydata);
      if (response?.data && Array.isArray(response.data)) {
        setCompanyData(response.data);
      } else {
        setCompanyData([]);
      }
    } catch (error) {
      console.error(t('Error fetching company data:'), error);
    }
  };

  useEffect(() => {
    fetchCompanyData();
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
    navigate(`/dashboard/company/view?id=${currentRow._id}`);
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
      {t('Company Management')}
    </Typography>,
  ];

  const handleChangePassword =()=>{
    navigate(`/dashboard/company/changepassword?id=${currentRow._id}`);
  }

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const columns = [
    {
      field: 'serialNo',
      headerName: 'S.No.',
      width: 30,
      renderCell: (params) => {
        const rowIndex = companyData.findIndex((row) => row._id === params.row._id);
        return rowIndex + 1; 
      }},
    {
      field: 'companyName',
      headerName: t('Company Name'),
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
    },
    {
      field: 'email',
      headerName: t('Email'),
      flex: 1,
    },
    {
      field: 'phoneNo',
      headerName: t('Phone No'),
      flex: 1,
    },
    {
      field: 'address',
      headerName: t('Address'),
      flex: 1,
      cellClassName: 'name-column--cell--capitalize',
    },
    {
      field: 'status',
      headerName: t('Status'),
      flex: 1,
      renderCell: (params) => {
        const [status, setStatus] = useState(params.row.status === true);
    
        const handleStatusChange = async (event) => {
          const newStatus = event.target.checked ? true : false;
          setStatus(event.target.checked);
    
   
          try {
            await updateCompanyStatus(params.row._id, newStatus);

            fetchCompanyData();
          } catch (error) {
            console.error(t('Error updating company status:'), error);
          }
        };
    
        return (
          <Switch
            checked={status}
            onChange={handleStatusChange}
            color="primary"
            inputProps={{ 'aria-label': 'company status' }}
          />
        );
      },
    },
    {
      field: 'action',
      headerName: t('Action'),
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            aria-describedby={params?.row._id}
            onClick={(event) => handleClick(event, params?.row)}
          >
            <MoreVertIcon />
          </IconButton>
          <Popover
            id={params?.row._id}
            open={Boolean(anchorEl) && currentRow?._id === params?.row._id}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <MenuItem onClick={handleOpenEditCompany} disableRipple>
              <EditIcon style={{ marginRight: '8px' }} />
              {t('Edit')}
            </MenuItem>
            <MenuItem
              onClick={handleOpenDeleteCompany}
              sx={{ color: 'red' }}
              disableRipple
            >
              <DeleteIcon style={{ marginRight: '8px', color: 'red' }} />
              {t('Delete')}
            </MenuItem>
                     <MenuItem onClick={handleOpenView}>
                                      <VisibilityIcon style={{ marginRight: '8px', color: 'green' }} />
                                      {t('view')}
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

  return (
    <>
      <AddCompany open={openAdd} handleClose={handleCloseAdd} />
      <EditCompany open={openEdit} handleClose={handleCloseEditCompany} data={rowData} />
      <DeleteCompany open={openDelete} handleClose={handleCloseDeleteCompany} id={rowData?._id} />

      <Container>
        <Card sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {t('Company Management')}
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                {breadcrumbs}
              </Breadcrumbs>
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenAdd}
            >
              {t('Add Company')}
            </Button>
          </Stack>
        </Card>
        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              <DataGrid
                rows={companyData}
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

export default Company;
