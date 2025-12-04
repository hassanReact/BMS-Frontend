/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/img-redundant-alt */
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
  Table,
  TableBody,
  TableRow,
  TableCell,
  Grid,
  Dialog,
  DialogContent,
  IconButton,
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
// import AddImageDialog from './AddPropertyImages';

const VacantPropertyView = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const propertyId = queryParams.get('id');

  const [value, setValue] = useState('1');
  const [propertyData, setPropertyData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [ownerData, setOwnerData] = useState({});
  const [typeData, setTypeData] = useState({});
  const [openAdd, setOpenAdd] = useState(false);
  const [images, setImages] = useState([]);

  const imagepath = urls.property.image;

  useEffect(() => {
    if (propertyId) {
      fetchPropertyData();
      fetchImageData();
    }
    
  }, [propertyId]);

  const fetchPropertyData = async () => {
    const response = await getApi(urls.property.getPropertyById, { id: propertyId });
    setPropertyData(response.data);
    setOwnerData(response.data?.ownerId || {});
    setTypeData(response.data?.typeId || {});
  };

  const fetchImageData = async () => {
    const response = await getApi(urls.property.getAllImgByPropertyId, { id: propertyId });
    setImages(response?.data || []);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
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
    <Link key="property-management" to="/dashboard/vacantproperty" style={{ color: 'inherit', textDecoration: 'none' }}>
      {t('Vacant Properties')}
    </Link>,
    <Typography key="view" color="text.primary">
      {t('View')}
    </Typography>,
  ];

  return (
    <Container>
      {/* Breadcrumb and Heading */}
      <Card sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 3 }}>
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
            {Object.keys(propertyData).length ? (
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                  {t('Property Information')}
                </Typography>
                <Table>
                  <TableBody>
                    {[
                      { label: t('Property Name'), value: propertyData.propertyname },
                      { label: t('Property Type'), value: typeData?.name || 'N/A' },
                      { label: t('Property Type Description'), value: typeData?.description || 'N/A' },
                      { label: t('Description'), value: propertyData.description },
                      { label: t('Property Size in sq.ft'), value: propertyData.area },
                      { label: t('Address'), value: propertyData.address },
                      { label: t('Rent'), value: propertyData.rent },
                      { label: t('Zipcode'), value: propertyData.zipcode },
                      {
                        label: t('Google Map Location'),
                        value: (
                          <a href={propertyData.maplink} target="_blank" rel="noopener noreferrer">
                            {t('View on Map')}
                          </a>
                        ),
                      },
                      // { label: t('Owner Name'), value: ownerData?.ownerName || 'N/A' },
                      // { label: t('Owner Address'), value: ownerData?.address || 'N/A' },
                      // { label: t('Owner Email'), value: ownerData?.email || 'N/A' },
                      // { label: t('Owner Phone No.'), value: ownerData?.phoneNo || 'N/A' },
                    ].map((row, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%', color: 'text.secondary' }}>
                          {row.label}
                        </TableCell>
                        <TableCell sx={{ color: 'text.primary' }}>{row.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
                {t('No property details available.')}
              </Typography>
            )}
          </TabPanel>

          {/* Property Images Tab */}
          <TabPanel value="2">
            {/* <AddImageDialog open={openAdd} handleClose={handleCloseAdd} /> */}
            {/* <Button variant="contained" onClick={handleOpenAdd} sx={{ mb: 2 }}>
              {t('Add Images')}
            </Button> */}
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
          <IconButton aria-label="close" onClick={handleCloseDialog} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <Close />
          </IconButton>
          {selectedImage && <img src={selectedImage} alt="Selected Property" style={{ width: '100%', borderRadius: '8px' }} />}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default VacantPropertyView;
