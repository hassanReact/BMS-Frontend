/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState, useEffect } from 'react';
import React from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Card,
  Box,
  Breadcrumbs,
  Paper,
  Grid,
  Dialog,
  DialogContent,
  IconButton,
  Divider, 
} from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Close } from '@mui/icons-material';
import { getApi } from '@/core/apis/api';
import Tab from '@mui/material/Tab';
import { useTranslation } from 'react-i18next';
import { urls } from '@/core/Constant/urls';
import { useLocation, Link } from 'react-router-dom';
import { IconHome } from '@tabler/icons';
import AddImageDialog from './AddPropertyImages';
import { tokenPayload } from '@/helper';
import DeleteImage from './DeleteImage';

const PropertyView = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const payload = tokenPayload();
  const userRole = payload.role;
  const queryParams = new URLSearchParams(location.search);
  const propertyId = queryParams.get('id');

  const [value, setValue] = useState('1');
  const [propertyData, setPropertyData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [ownerData, setOwnerData] = useState({});
  const [tenantData, setTenantData] = useState({});
  const [projectData, setProjectData] = useState({});
  const [blockData, setBlockData] = useState({});
  const [typeData, setTypeData] = useState({});
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [images, setImages] = useState([]);
  const [imageToDelete, setImageToDelete] = useState(null);
  const imagepath = urls.property.image;

  useEffect(() => {
    if (propertyId) {
      fetchPropertyData();
      fetchImageData();
    }
  }, [propertyId, openAdd,openDelete]);

  const fetchPropertyData = async () => {
    const response = await getApi(urls.property.getPropertyById, { id: propertyId });
    // console.log("Property Data:", response.data);
    setPropertyData(response.data);
    setOwnerData(response.data?.ownerId || {});
    setTenantData(response.data?.tenantId || {});
    setProjectData(response.data?.projectId || {});
    setBlockData(response.data?.blockId || {});
    setTypeData(response.data?.typeId || {});
  };

  const fetchImageData = async () => {
    const response = await getApi(urls.property.getAllImgByPropertyId, { id: propertyId });
    setImages(response?.data || []);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDeleteImage = (imageId) => {
    setImageToDelete(imageId);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setImageToDelete(null);
  };

  const handleCloseDialog = () => {
    setSelectedImage(null);
  };

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const breadcrumbs = [
    <Link key="home" to="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>
      <IconHome />
    </Link>,
    <Link key="property-management" to="/dashboard/property" style={{ color: 'inherit', textDecoration: 'none' }}>
      {t('Property Management')}
    </Link>,
    <Typography key="view" color="text.primary">
      {t('View')}
    </Typography>,
  ];

  return (
    <>
      <DeleteImage open={openDelete} handleClose={handleCloseDelete} id={imageToDelete} onDeleteSuccess={fetchImageData} />
      <Container>
        {/* Breadcrumb and Heading */}
        <Card sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {t('Property Details')}
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                {breadcrumbs}
              </Breadcrumbs>
            </Typography>
          </Stack>
        </Card>

        <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleTabChange} aria-label="Property tabs">
                <Tab label={t('Property Details')} value="1" />
                <Tab label={t('Property Images')} value="2" />
              </TabList>
            </Box>

            {/* Property Details Tab */}
            <TabPanel value="1">
              <Grid container spacing={3}>
                {/* Property Information Section */}
                <Grid item xs={12}>
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
                    <Divider sx={{ marginBottom: 2 }} />
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('Property Name')}</Typography>
                        <Typography>{propertyData.propertyname || t('not_available')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('Property Type')}</Typography>
                        <Typography>{typeData.name || t('not_available')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('Project')}</Typography>
                        <Typography>{projectData.projectName || t('not_available')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('Block')}</Typography>
                        <Typography>{blockData.blockName || t('not_available')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('Description')}</Typography>
                        <Typography>{propertyData.description || t('not_available')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('Area in sq.ft')}</Typography>
                        <Typography>{propertyData.area || t('not_available')}</Typography>
                      </Grid>
                      {/*<Grid item xs={6}>
                        <Typography variant="h5">{t('Rent')}</Typography>
                        <Typography>{propertyData.rent || t('not_available')}</Typography>
                      </Grid>*/}
                      {/* <Grid item xs={6}>
                        <Typography variant="h5">{t('Maintenance')}</Typography>
                        <Typography>{propertyData.rent || t('not_available')}</Typography>
                      </Grid> */}
                      {/*<Grid item xs={6}>
                        <Typography variant="h5">{t('Maintenance')}</Typography>
                        <Typography>{propertyData.maintenance || t('not_available')}</Typography>
                      </Grid>*/}
                      {/*<Grid item xs={6}>
                        <Typography variant="h5">{t('Zipcode')}</Typography>
                        <Typography>{propertyData.zipcode || t('not_available')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('Address')}</Typography>
                        <Typography>{propertyData.address || t('not_available')}</Typography>
                        <Typography variant="body2">
                          <a
                            href={propertyData.maplink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#1976d2', textDecoration: 'none' }}
                          >
                            {t('View on Map')}
                          </a>
                        </Typography>
                      </Grid>*/}
                    </Grid>
                  </Paper>
                </Grid>

                {/* Owner Information Section */}
                <Grid item xs={12}>
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
                      {t('Owner Information')}
                    </Typography>
                    <Divider sx={{ marginBottom: 2 }} />
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('Owner Name')}</Typography>
                        <Typography>{ownerData.ownerName || t('not_available')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('Phone No')}</Typography>
                        <Typography>{ownerData.phoneNo || t('not_available')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('Email')}</Typography>
                        <Typography>{ownerData.email || t('not_available')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('Address')}</Typography>
                        <Typography>{ownerData.address || t('not_available')}</Typography>
                      </Grid>
                    </Grid>
                    </Paper>
                    </Grid>
                    <Grid item xs={12}>
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
                      {t('Resident Information')}
                    </Typography>
                    <Divider sx={{ marginBottom: 2 }} />
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('Resident Name')}</Typography>
                        <Typography>{tenantData.tenantName || t('not_available')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('Phone No')}</Typography>
                        <Typography>{tenantData.phoneno || t('not_available')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('Email')}</Typography>
                        <Typography>{tenantData.email || t('not_available')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('Address')}</Typography>
                        <Typography>{tenantData.address || t('not_available')}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                </Grid>
              
            </TabPanel>

            {/* Property Images Tab */}
            <TabPanel value="2">
              <AddImageDialog open={openAdd} handleClose={handleCloseAdd} />
              {userRole === 'companyAdmin' && (
                <Button variant="contained" onClick={handleOpenAdd} sx={{ mb: 3 }}>
                  {t('Add Images')}
                </Button>
              )}

              {images.length > 0 ? (
                <ImageList cols={3} gap={8}>
                  {images.map((doc, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={`${imagepath}${doc.url}`}
                        alt={doc.documentName}
                        loading="lazy"
                        style={{ borderRadius: '8px', cursor: 'pointer' }}
                        onClick={() => setSelectedImage(`${imagepath}${doc.url}`)}
                      />
                      <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
                        {doc.documentName}
                      </Typography>

                      {/* Delete Button */}
                      {userRole === 'companyAdmin' && (<Button
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={() => handleDeleteImage(doc._id)}
                      >
                        {t('Delete')}
                      </Button>)}
                    </ImageListItem>
                  ))}
                </ImageList>
              ) : (
                <Typography variant="body2" sx={{ textAlign: 'center' }}>
                  {t('No Images available.')}
                </Typography>
              )}
            </TabPanel>
          </TabContext>
        </Card>

        {/* Image Popup Dialog */}
        <Dialog open={Boolean(selectedImage)} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogContent sx={{ position: 'relative' }}>
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <Close />
            </IconButton>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Selected Property"
                style={{ width: '100%', borderRadius: '8px' }}
              />
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </>
  );
};

export default PropertyView;