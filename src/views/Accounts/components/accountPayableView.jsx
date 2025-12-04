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
  Divider
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
// import AddImageDialog from './AddPropertyImages';
import { tokenPayload } from '@/helper';
// import DeleteImage from './DeleteImage';

const AccountsPayableView = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const payload = tokenPayload();
  const userRole = payload.role;
  const queryParams = new URLSearchParams(location.search);
  const purchaseId = queryParams.get('id');
  // console.log("Property ID:", propertyId);

  const [value, setValue] = useState('1');
  const [purchasedData, setPurchasedData] = useState({});
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
  const [open, setOpen] = useState(false);
  const billImageUrl = `${process.env.REACT_APP_BASE_URL}/${purchasedData.bill}`;

  useEffect(() => {
    if (purchaseId) {
      fetchAccountsPayableData();
      // fetchImageData();
    }
  }, [purchaseId, openAdd, openDelete]);

  const fetchAccountsPayableData = async () => {
    const response = await getApi(urls.AccountsPayable.getById, { id: purchaseId });
    console.log('Purchase Data Response:', response);

    const rawData = response?.data;

    if (!rawData) {
      setPurchasedData(null);
      return;
    }

    const quantity = rawData.quantity || 0;
    const unitPerPrice = rawData.unitPerPrice || 0;

    const formattedData = {
      ...rawData,
      totalPrice: quantity * unitPerPrice
    };

    setPurchasedData(formattedData);
    // console.log("Purchase Formatted Detail:", formattedData);
  };

  // const fetchImageData = async () => {
  //   const response = await getApi(urls.property.getAllImgByPropertyId, { id: propertyId });
  //   setImages(response?.data || []);
  // };

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
    <Link key="accounts-payable" to="/dashboard/accounts-payable" style={{ color: 'inherit', textDecoration: 'none' }}>
      {t('Accounts Payable')}
    </Link>,
    <Typography key="view" color="text.primary">
      {t('View')}
    </Typography>
  ];

  return (
    <>
      {/* <DeleteImage open={openDelete} handleClose={handleCloseDelete} id={imageToDelete} onDeleteSuccess={fetchImageData} /> */}
      <Container>
        {/* Breadcrumb and Heading */}
        <Card sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {t('Transaction Details')}
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
                <Tab label={t('Transaction Details')} value="1" />
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
                      // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <Typography variant="h4" gutterBottom>
                      {t('Accounts Payable')}
                    </Typography>
                    <Divider sx={{ marginBottom: 2 }} />
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('Vendor Name')}</Typography>
                        <Typography>{purchasedData.vendorName || t('not_available')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('Bill No')}</Typography>
                        <Typography>{purchasedData.billNumber || t('not_available')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('Amount')}</Typography>
                        <Typography>{purchasedData.totalPrice || t('not_available')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('Bill Image')}</Typography>
                        {purchasedData.bill ? (
                          <>
                            <Box
                              mt={2}
                              sx={{
                                width: '100%',
                                height: '100%',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                              }}
                              onClick={() => setOpen(true)}
                            >
                              <img src={billImageUrl} alt="Bill Thumbnail" style={{ width: '40%', height: 'auto', objectFit: 'cover' }} />
                            </Box>
                            {/* Dialogue for bill image */}
                            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                              <DialogContent sx={{ position: 'relative' }}>
                                <IconButton onClick={() => setOpen(false)} style={{ position: 'absolute', top: 8, right: 8 }}>
                                  <CloseIcon />
                                </IconButton>
                                <img src={billImageUrl} alt="Bill Full View" style={{ width: '100%', borderRadius: 8, marginTop: 28 }} />
                              </DialogContent>
                            </Dialog>
                          </>
                        ) : (
                          <Typography>{t('not_available')}</Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
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
    </>
  );
};

export default AccountsPayableView;
