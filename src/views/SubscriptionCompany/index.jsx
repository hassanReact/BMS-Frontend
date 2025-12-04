/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { IconHome } from '@tabler/icons';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { urls } from '@/core/Constant/urls';
import { getApi } from '@/core/apis/api';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AddSubscriptions from '@/views/Subscription/AddSubscription';
import BuySubscription from './BuySubscription';

const subscriptionStyles = [
  {
    icon: <StarOutlineIcon sx={{ color: '#FFA726', fontSize: 30 }} />,
    borderColor: '#FFA726',
    buttonColor: '#FFA726',
    hoverColor: '#FB8C00'
  },
  {
    icon: <TrendingUpIcon sx={{ color: '#29B6F6', fontSize: 30 }} />,
    borderColor: '#29B6F6',
    buttonColor: '#29B6F6',
    hoverColor: '#0288D1'
  },
  {
    icon: <EmojiEventsIcon sx={{ color: '#7E57C2', fontSize: 30 }} />,
    borderColor: '#7E57C2',
    buttonColor: '#7E57C2',
    hoverColor: '#5E35B1'
  },
  {
    icon: <WorkspacePremiumIcon sx={{ color: '#4CAF50', fontSize: 30 }} />,
    borderColor: '#4CAF50',
    buttonColor: '#4CAF50',
    hoverColor: '#388E3C'
  }
];

const SubscriptionCards = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openAdd, setOpenAdd] = useState(false);
  const [rowData, setRowData] = useState(false);
  const [serviceData, setServiceData] = useState([]);

  const fetchServiceData = async () => {
    try {
      const response = await getApi(urls.Subscribe.getAllSubscription);
      console.log(response?.data,"response.data");
      if (response?.data) {
        setServiceData(response.data);
      } else {
        setServiceData([]);
      }
    } catch (error) {
      toast.error('Failed to fetch subscriptions');
    }
  };

  useEffect(() => {
    fetchServiceData();
  }, []);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleBuyNow = (item) => {

    setRowData(item);
    setOpenAdd(true);  
  };

  const breadcrumbs = [
    <Link key="home" to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
      <IconHome />
    </Link>,
    <Typography key="serviceprovider" to="/dashboard/serviceprovider" color="text.primary">
      {t('Subscription Plan')}
    </Typography>
  ];

  return (
    <>
          <BuySubscription open={openAdd} handleClose={handleCloseAdd} data={rowData}/>
    <Container>
      {/* <Card sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4">{t('Subscriptions')}</Typography>
          <Breadcrumbs separator="›">
            <Link to="/" style={{ color: 'inherit' }}>
              <IconHome />
            </Link>
            <Typography color="text.primary">{t('Subscriptions')}</Typography>
          </Breadcrumbs>
        </Stack>
      </Card> */}
        <Card sx={{ p: 2, mb: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {t('Subcription Plan')}
                    <Breadcrumbs separator="›" aria-label="breadcrumb">
                      {breadcrumbs}
                    </Breadcrumbs>
                  </Typography>
      
                  {/* {userRole !== "tenant" && (
        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
          {t('Add Subscriptions')}
        </Button>
      )} */}
                </Stack>
              </Card>

      <Grid container spacing={3}>
        {serviceData.map((item, index) => {
          const styleIndex = index % subscriptionStyles.length;
          const styles = subscriptionStyles[styleIndex];
          const discountedPrice = item.amount - (item.amount * item.discount) / 100;
          const savedAmount = item.amount - discountedPrice;
          const descriptionPoints = item.discription?.split('.') || [];

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 4,
                  padding: 2,
                  position: 'relative',
                  height: '350px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: `2px solid ${styles.borderColor}`,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 8
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="center" mb={2}>
                    {styles.icon}
                    <Typography variant="h5" sx={{ fontWeight: 'bold', ml: 1 }}>
                      {item.title}
                    </Typography>
                  </Box>

                  <Box textAlign="center" mt={2}>
                    <Typography variant="body1" sx={{ textDecoration: 'line-through', color: 'gray', fontWeight: 'bold' }}>
                      ₹{item.amount}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: styles.borderColor }}>
                      ₹{discountedPrice.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" mt={1}>
                      You save: ₹{savedAmount.toFixed(2)} ({item.discount}% Off)
                    </Typography>
                  </Box>

                  <Box mt={2}>
                    {descriptionPoints.map((point, idx) =>
                      point.trim() ? (
                        <Typography key={idx} variant="body2">
                          • {point.trim()}
                        </Typography>
                      ) : null
                    )}
                  </Box>
                </CardContent>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleBuyNow(item)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 'bold',
                    backgroundColor: styles.buttonColor,
                    '&:hover': {
                      backgroundColor: styles.hoverColor
                    }
                  }}
                >
                  {t('Buy Now')}
                </Button>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
    </>
  );
};

export default SubscriptionCards;
