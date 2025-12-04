/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
// @mui
import { Stack, Button, Container, Typography, Card, Box,Popover, Breadcrumbs, MenuItem, IconButton } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { toast } from 'react-toastify'; 
import { Link } from 'react-router-dom';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import TableStyle from '../../ui-component/TableStyle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddDocuments from './AddDocuments';
import { getApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { tokenPayload } from '@/helper';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { IconHome } from '@tabler/icons';

const VacantProperties = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [openAdd, setOpenAdd] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState([])
  const Payload = tokenPayload()

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const response = await getApi(urls.property.getVacantProperty, { id: Payload.companyId }); 
        setPropertyData(response.data);

      } catch (error) {
        console.error('Error fetching Vacant Property:', error);
        toast.error('Failed to fetch Vacant Property');
      }
    };

    fetchOwnerData();
  }, []);

    const breadcrumbs = [
      <Link underline="hover" key="home" to="/dashboard/default" style={{ color: 'inherit', textDecoration: 'none' }}>
        <IconHome />
      </Link>,
      <Link underline="hover" key="property-management" to="/dashboard/vacantproperty" style={{ color: 'inherit', textDecoration: 'none' }}>
        {t('Vacant Properties')}
      </Link>,
      // <Typography key="view" color="text.primary">
      //   {t('View')}
      // </Typography>,
    ];

  const handleOpenView = () => {
    navigate(`/dashboard/vacantproperty/view?id=${currentRow._id}`);
  };

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const columns = [
    {
      field: 'serialNo',
      headerName: 'S.No.',
      width: 30,
      renderCell: (params) => {
        const rowIndex = propertyData.findIndex((row) => row._id === params.row._id);
        return rowIndex + 1; 
      },
    },
    {
      field: 'propertyname',
      headerName: t('Property Name'),
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
          renderCell: (params) => (
              <Button
                variant="text"
                color="primary"
                onClick={() =>
                  navigate(`/dashboard/vacantproperty/view?id=${params.row._id}`) 
                }
              >
                {params.row.propertyname}  
              </Button>
            ),
    },
    {
      field: 'description',
      headerName: 'Discription',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'rent',
      headerName: 'Rent Amount',
      flex: 1
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
                open={Boolean(anchorEl) && currentRow?._id === params?.row._id}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <MenuItem onClick={handleOpenView} >
                  <VisibilityIcon style={{ marginRight: '8px', color: 'green' }} />
                  {t('view')}
                </MenuItem>
              </Popover>
            </>
          ),
        }
  ];

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };



  return (
    <>
      <AddDocuments open={openAdd} handleClose={handleCloseAdd} />
      <Container>
      <Card sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {t('Vacant Property')}
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              {breadcrumbs}
            </Breadcrumbs>
          </Typography>
        </Stack>
      </Card>
        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
                <DataGrid
                              rows={propertyData}
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

export default VacantProperties;
