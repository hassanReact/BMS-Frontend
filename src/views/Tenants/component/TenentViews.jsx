/* eslint-disable react/jsx-key */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Card,
  Box,
  Chip,
  Breadcrumbs,
  Divider,
  Grid,
  ListItemIcon,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CardContent,
    Popover,
  DialogContent,
  List,
    MenuItem,
  ListItem,
  IconButton,
  
  ListItemText,

  Dialog,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';

import DescriptionIcon from '@mui/icons-material/Description';
import TabContext from '@mui/lab/TabContext';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import { IconHome } from '@tabler/icons';
import { getApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { ConsoleView } from 'react-device-detect';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import AddDocumentDialog from './AddDocument';
import TableStyle from '../../../ui-component/TableStyle';
import DeleteFile from './DeleteFile';


const imagepath = urls.tenant.image;

const TenantView = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const tenantId = queryParams.get('id');

  const [value, setValue] = useState('1');
  const [tenantData, setTenantData] = useState({});
  const [propertyData, setPropertyData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
  
    const [rowData, setRowData] = useState(null);
  
  const [tenantDocs, setTenantDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [document, setDocument] = useState(false);
    const [currentRow, setCurrentRow] = useState([]);
  
  const fetchTenantData = async () => {
    try {
      setLoading(true);
      const response = await getApi(urls.tenant.getTenantById, { id: tenantId });
      // console.log('Tenant Data:', response?.data);
      setTenantData(response?.data?.tenant);
      setPropertyData(response?.data?.booking);
      setTenantDocs(response?.data?.tenant?.files);
      // setTenantDocs(response?.data?.tenant)
    } catch (error) {
      console.error('Error fetching tenant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentData = async () => {
    try {
      const response = await getApi(urls.tenant.getAllDocByTenantId, { id: tenantId });
      setDocument(response.data);
    } catch (error) {
      setDocument([]);
    }
  };
  useEffect(() => {
    if (tenantId) {
      fetchDocumentData();
    }
  }, [tenantId,openAdd,openDelete]);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const handleCloseDeleteTenant = () => {
    setOpenDelete(false);
  };



  useEffect(() => {
    if (tenantId) {
      fetchTenantData();
    }
  }, [tenantId]);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCloseDialog = () => {
    setSelectedImage(null);
  };

  const handleImageClick = (img) => {
    setSelectedImage(`${imagepath}${img}`);
  };

  const handleOpenDeleteDialog = () => {
    setRowData(currentRow);
    setOpenDelete(true);
    handleClose();
  };

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  
 const columns = [
  {
    field: 'documentName',
    headerName: t('Document Name'),
    flex: 1,
    cellClassName: 'name-column--cell name-column--cell--capitalize',
  },
  {
    field: 'url',
    headerName: t('URL'),
    flex: 1,
    renderCell: (params) => (
      <>
        <a 
          href={urls?.tenant?.image+params?.row?.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ textDecoration: 'none', color: 'blue' }}
        >
          {t('View Document')}
        </a>
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
          {/* <MenuItem onClick={handleOpenEditTenant} disableRipple>
            <EditIcon style={{ marginRight: '8px' }} />
            {t('Edit')}
          </MenuItem>
          <MenuItem onClick={() => window.open(params.row.url, '_blank')} >
            <VisibilityIcon style={{ marginRight: '8px', color: 'green' }} />
            {t('View')}
          </MenuItem> */}
          <MenuItem
            onClick={handleOpenDeleteDialog}
            sx={{ color: 'red' }}
            disableRipple
          >
            <DeleteIcon style={{ marginRight: '8px', color: 'red' }} />
            {t('Delete')}
          </MenuItem>
        </Popover>
      </>
    ),
  },
];



  const breadcrumbs = [
    <Link key="home" to="/dashboard/default" style={{ color: 'inherit' }}>
      <IconHome />
    </Link>,
    <Link key="tenant-management" to="/dashboard/tenents" style={{ color: 'inherit' }}>
      {t('Tenant Management')}
    </Link>,
    <Typography key="view" color="text.primary">
      {t('View')}
    </Typography>
  ];

  return (
    <>
    <DeleteFile open={openDelete} handleClose={handleCloseDeleteTenant} id={rowData?._id} />
    
    <Container>
      <Card sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {t('Tenant Details')}
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              {breadcrumbs}
            </Breadcrumbs>
          </Typography>
        </Stack>
      </Card>

      <Card sx={{ p: 2, mb: 2 }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleTabChange} aria-label="Tenant tabs">
              <Tab label={t('Tenant Details')} value="1" />
              <Tab label={t('Tenant Documents')} value="2" />
            </TabList>
          </Box>

          <TabPanel value="1">
          <Grid item xs={12} sx={{ mt: 3 }}>
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
      {t('Tenant Information')}
    </Typography>
    <Divider sx={{ marginBottom: 3 }} />
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Typography variant="h5">{t('Tenant Name')}</Typography>
        <Typography>{tenantData.tenantName || t('not_available')}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h5">{t('Email')}</Typography>
        <Typography>{tenantData.email || t('not_available')}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h5">{t('Phone No')}</Typography>
        <Typography>{tenantData.phoneno || t('not_available')}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h5">{t('Identity Card Type')}</Typography>
        <Typography>{tenantData.identityCardType || t('not_available')}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h5">{t('Identity Card No.')}</Typography>
        <Typography>{tenantData.identityNo || t('not_available')}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h5">{t('Address')}</Typography>
        <Typography>{tenantData.address || t('not_available')}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h5">{t('Is Occupied')}</Typography>
        <Typography
          style={{
            color: tenantData.isOccupied ? 'green' : 'red',
          }}
        >
          {tenantData.isOccupied ? t('Yes') : t('No')}
        </Typography>
      </Grid>
    </Grid>
  </Paper>
</Grid>

{Array.isArray(propertyData) && propertyData.length ? (
  propertyData.map((property, index) => (
    <Grid item xs={12} sx={{ mt: 3 }} key={index}>
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
          {t('Property Information')}
        </Typography>
        <Divider sx={{ marginBottom: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="h5">{t('Property Name')}</Typography>
            <Typography>{property.propertyName || t('not_available')}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5">{t('Description')}</Typography>
            <Typography>{property.description || t('not_available')}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5">{t('Address')}</Typography>
            <Typography>{property.address || t('not_available')}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5">{t('Rent')}</Typography>
            <Typography>{property.rent || t('not_available')}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  ))
) : (
  <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
    {t('No property details are available for this Tenant.')}
  </Typography>
)}
</TabPanel>

<TabPanel value="2">
  <Box width="100%" sx={{ display: "flex", justifyContent: "flex-end" }}>
    <AddDocumentDialog open={openAdd} handleClose={handleCloseAdd} />
    <Button variant="contained" onClick={handleOpenAdd}>
      {t('Add Documents')}
    </Button>
  </Box>
  <TableStyle>
    <Box width="100%">
      <Card sx={{ height: '600px', pt: 2 }}>
        <DataGrid
          rows={document}
          columns={columns}
          checkboxSelection
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

      {/* Image Popup Dialog */}
      {/* <Dialog open={Boolean(selectedImage)} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogContent sx={{ position: 'relative' }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Selected Property"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
              }}
            />
          )}
        </DialogContent>
      </Dialog> */}
    </Container>
    </>
  );
};

export default TenantView;
