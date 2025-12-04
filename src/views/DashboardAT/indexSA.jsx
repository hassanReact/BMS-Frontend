/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import { urls } from '@/core/Constant/urls';
import { getApi } from '@/core/apis/api';
// material-ui
import { Grid, Typography, Box, Avatar, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { gridSpacing } from '@/store/constant';
// import { getApi } from '@/views/services/api';
// import TotalAgent from './TotalAgent'
// import TotalCompanies from './TotalCompanies';
// import TotalProperties from './TotalProperties';
import TotalTenants from './TotalTenants';
import SingleBedIcon from '@mui/icons-material/SingleBed';
import KingBedIcon from '@mui/icons-material/KingBed';

import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { tokenPayload } from '@/helper';
import TotalVacantProperties from './TotalVacantProperty';
// import TotalComplains from './TotalComplains';
import TotalBooking from './TotalSubcription';
// import TotalGrowthBarChart from './TotalGrowthBarChart';
import TotalGrowthBarChart from './BarchartSA';
import TotalServiceProvider from './TotalActiveCompany';
import TotalPendingBill from './TotalPendingBills';
import TotalCompany from './TotalCompany';
import TotalSubcription from './TotalSubcription';
import TotalActiveCompany from './TotalActiveCompany';
import InfoCard from './InfoCard';
import ApartmentIcon from '@mui/icons-material/Apartment';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import PopularCard from './PopularCardSA';
// import TotalTable from './TotalTable';
// import PopularCard from './PopularCard';
// import TotalPaidBill from './TotalPaidBill';

const RoomTypeIcons = {
  single: <SingleBedIcon sx={{ fontSize: '2.5rem' }} />,
  double: <KingBedIcon sx={{ fontSize: '2.5rem' }} />,
  triple: <KingBedIcon sx={{ fontSize: '2.5rem' }} />,
  family: <KingBedIcon sx={{ fontSize: '2.5rem' }} />
};

const SADashboard = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const payload = tokenPayload();
  const [isLoading, setLoading] = useState(true);
  const [openReserveRoom, setOpenReserveRoom] = useState(false);
  const [roomPropsData, setRoomPropsData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, []);

  const [agent, setAgent] = useState([]);
  const [company, setCompany] = useState([]);
  const [tenant, setTenant] = useState([]);
  const [SubscriptionData, setSubcriptionData] = useState([]);
  const [property, setProperty] = useState([]);
  const [vacantpropertyData, setVacantpropertyData] = useState([]);
  const [complainData, setComplainData] = useState([]);
  // const [booking,setBooking] = useState([]);
  const [pendingBill, setPendingBill] = useState([]);
  const [paidBill, setPaidBill] = useState([]);
  const [activeCompany, setTotalActiveComapny] = useState([]);


  const fetchSubcriptionData = async () => {
    try {
      const response = await getApi(urls.Subscribe.getAllSubscription);
      setSubcriptionData(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCompanyData = async () => {
    try {
      const response = await getApi(urls.company.companydata, { id: payload.companyId });
      setCompany(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  // const fetchBookingData = async () => {
  //   try {
  //     const response = await getApi( urls.tenant.tenantBookingData, { id: payload._id });
  //     setBooking(response?.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const fetchPaidData = async () => {
    try {
      const response = await getApi(urls.bill.getBillByT, { id: payload._id });
      setPaidBill(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchServiceProviderData = async () => {
    try {
      const response = await getApi(urls.serviceProvider.getAll, { id: payload.companyId });
      setServicePrvider(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchVacantPropertyData = async () => {
    try {
      const response = await getApi(urls.property.getVacantProperty, { id: payload.companyId });
      setVacantpropertyData(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPropertyData = async () => {
    try {
      const response = await getApi(urls.property.propertyDataAll, { id: payload.companyId });
      setProperty(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  // const fetchcustomerData = async () => {
  //   try {
  //     const response = await getApi(`api/customer/viewallcustomer/${hotel?.hotelId}`);
  //     setcustomerData(response?.data?.customerData);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const fetchTotalActiveCompany = async () => {
    try {
      const response = await getApi(urls.company.activeCompany);
      setTotalActiveComapny(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchComplainData = async () => {
    try {
      const response = await getApi(urls.Complaints.allComplainForCompany, { id: payload.companyId });
      setComplainData(response?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchPendingBillData = async () => {
    try {
      const response = await getApi(urls.bill.getBillForTPending, { id: payload._id });
      setPendingBill(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCompanyData();
    // fetchAgentData();
    fetchPaidData();
    fetchPropertyData();
    fetchTotalActiveCompany();
    fetchServiceProviderData();
    // fetchcustomerData();
    fetchSubcriptionData();
    // fetchTenantData();
    fetchVacantPropertyData();
    fetchComplainData();
    // fetchBookingData();
  }, [openReserveRoom]);

  // Function to handle dialog closing
  const handleCloseReservationDialog = () => {
    setOpenReserveRoom(false);
  };

  // Room click handling
  const handleRoomClick = (roominfo) => {
    setTimeout(() => {
      if (roominfo.bookingStatus === 'active') {
        fetchReservationIdForActiveRooms(roominfo.roomNo);
      } else {
        setOpenReserveRoom(true);
      }
      setRoomPropsData(roominfo);
    }, 300);
  };

  return (
    <>
      {/* <ReserveRoom open={openReserveRoom} handleClose={handleCloseReservationDialog} roomDataByProps={roomPropsData} /> */}
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid
              item
              lg={3}
              md={6}
              sm={6}
              xs={12}
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                navigate('/dashboard/company');
              }}
            >
              {/* <TotalCompany isLoading={isLoading} company={company} /> */}
              <InfoCard isLoading={isLoading} cardName="Total Company" length={company.length} icon={ApartmentIcon} />
              
            </Grid>

            <Grid
              item
              sm={6}
              xs={12}
              md={6}
              lg={3}
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                navigate('/dashboard/Subsciption');
              }}
            >
              {/* <TotalSubcription isLoading={isLoading} SubscriptionData={SubscriptionData} /> */}
              <InfoCard isLoading={isLoading} cardName="Total Subcriptions" length={SubscriptionData.length} icon={CardMembershipIcon} />

            </Grid>
            <Grid
              item
              sm={6}
              xs={12}
              md={6}
              lg={3}
              sx={{ cursor: 'pointer' }}
              // onClick={() => {
              //   navigate('/dashboard/booking');
              // }}
            >
              <InfoCard isLoading={isLoading} cardName="Active Company" length={activeCompany.length} icon={ApartmentIcon} />
              {/* <TotalActiveCompany isLoading={isLoading} activeCompany={activeCompany} /> */}
            </Grid>
            {/* <Grid
              item
              sm={6}
              xs={12}
              md={6}
              lg={3}
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                navigate('/dashboard/tenents');
              }}
            >
              <TotalTenants isLoading={isLoading} tenant={tenant} />
            </Grid> */}
            {/* <Grid
              item
              lg={3}
              md={6}
              sm={6}
              xs={12}
              sx={{ cursor: 'pointer' }} */}
            {/* // onClick={() => { */}
            {/* //   navigate('/dashboard/billC');
              // }} */}
            {/* >
              <TotalPendingBill isLoading={isLoading} TotalPendingBill={pendingBill} />
            </Grid> */}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={8}>
              <TotalGrowthBarChart isLoading={isLoading} />
            </Grid>
            <Grid item xs={12} md={4}>
              <PopularCard isLoading={isLoading} />
            </Grid>
          </Grid>
        </Grid>

        {/* <TotalTable/> */}

        {/* <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={12}>
              <Typography variant="h5" sx={{ marginBottom: '10px' }}>
                {t('Total Vacant Properties')} ({agent?.length || 0})
              </Typography>
              <hr />
              {vacantpropertyData?.length > 0 ? (
                <Grid container spacing={gridSpacing} sx={{ marginTop: '10px' }}>
                  {agent?.map((room) => (
                    <Grid
                      item
                      key={room.id}
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      sx={{
                        cursor: 'pointer'
                      }}
                      onClick={() => handleRoomClick(room)}
                    >
                      <Box sx={{ p: 2.25 }}>
                        <Paper
                          elevation={3}
                          sx={{
                            borderRadius: '12px',
                            backgroundColor: room.bookingStatus === 'active' ? '#ffcccc' : '#fff',
                            transition: 'background-color 0.3s'
                          }}
                        >
                          <Box sx={{ p: 2 }}>
                            <Grid container direction="column">
                              <Grid item>
                                <Grid container alignItems="center" justifyContent="center">
                                  <Grid item>
                                    <Avatar
                                      sx={{
                                        cursor: 'pointer',
                                        ...theme.typography.smallAvatar,
                                        backgroundColor: room.bookingStatus === 'active' ? 'white' : theme.palette.primary[200],
                                        color: room.bookingStatus === 'active' ? 'black' : theme.palette.primary.dark,
                                        width: '53px',
                                        height: '53px'
                                      }}
                                    >
                                    </Avatar>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item sx={{ mb: 1.25, marginTop: '10px' }}>
                                <Typography
                                  sx={{
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    color: room.bookingStatus === 'active' ? 'black' : theme.palette.primary[200],
                                    textAlign: 'center'
                                  }}
                                >
                                  {room.roomType}
                                </Typography>
                              </Grid>
                              <Grid item sx={{ mb: 1.25, marginTop: '10px' }}>
                                <Typography
                                  sx={{
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    color: room.bookingStatus === 'active' ? 'white' : 'black',
                                    textAlign: 'center',
                                    backgroundColor: room.bookingStatus === 'active' ? 'red' : 'transparent',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '8px',
                                    display: 'inline-block'
                                  }}
                                >
                                  {room.roomNo}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        </Paper>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="h5" sx={{ textAlign: 'center', color: 'grey', marginTop: '5rem' }}>
                  {t('noRoomsExist')}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid> */}
      </Grid>
    </>
  );
};

export default SADashboard;
