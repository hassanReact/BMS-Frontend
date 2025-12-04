// /* eslint-disable prettier/prettier */
// import { useEffect, useState } from 'react';
// import { urls } from '@/core/Constant/urls';
// import { getApi } from '@/core/apis/api';
// import {
//   Grid,
//   Typography,
//   Box,
//   Avatar,
//   Paper
// } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
// import { gridSpacing } from '@/store/constant';
// import SingleBedIcon from '@mui/icons-material/SingleBed';
// import KingBedIcon from '@mui/icons-material/KingBed';
// import { useNavigate } from 'react-router';
// import { useTranslation } from 'react-i18next';
// import { tokenPayload } from '@/helper';
// import TotalGrowthBarChart from './BarChart';
// import PopularCard from './PopularCard';
// import InfoCard from '@/views/DashboardAT/InfoCard';
// import { Book, CommentBank, Payment, Person, Person2 } from '@mui/icons-material';
// import { IconFileUpload } from '@tabler/icons';

// // import {
// //   HomeWork, 
// //   MeetingRoom, 
// //   CommentBank,
// //   Book, 
// //   People,
// //   ReceiptLong, 
// //   AttachMoney, 
// //   ReportProblem 
// // } from '@mui/icons-material';



// const RoomTypeIcons = {
//   single: <SingleBedIcon sx={{ fontSize: '2.5rem' }} />,
//   double: <KingBedIcon sx={{ fontSize: '2.5rem' }} />,
//   triple: <KingBedIcon sx={{ fontSize: '2.5rem' }} />,
//   family: <KingBedIcon sx={{ fontSize: '2.5rem' }} />
// };

// const MainDashboard = () => {
//   const { t } = useTranslation();
//   const theme = useTheme();
//   const payload = tokenPayload();
//   const [isLoading, setLoading] = useState(true);
//   const [openReserveRoom, setOpenReserveRoom] = useState(false);
//   const [roomPropsData, setRoomPropsData] = useState([]);
//   const navigate = useNavigate();

//   const [agent, setAgent] = useState([]);
//   const [tenant, setTenant] = useState([]);
//   const [customerData, setcustomerData] = useState([]);
//   const [property, setProperty] = useState([]);
//   const [vacantpropertyData, setVacantpropertyData] = useState([]);
//   const [complainData, setComplainData] = useState([]);
//   const [booking, setBooking] = useState([]);
//   const [pendingBill, setPendingBill] = useState([]);
//   const [paidBill, setPaidBill] = useState([]);

//   useEffect(() => {
//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     fetchAgentData();
//     fetchPaidData();
//     fetchPropertyData();
//     fetchPendingBillData();
//     fetchTenantData();
//     fetchVacantPropertyData();
//     fetchComplainData();
//     fetchBookingData();
//   }, [openReserveRoom]);

//   const fetchAgentData = async () => {
//     try {
//       const response = await getApi(urls.agent.agentdata, { id: payload.companyId });
//       setAgent(response?.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const fetchBookingData = async () => {
//     try {
//       const response = await getApi(urls.booking.allbooking, { id: payload.companyId });
//       setBooking(response?.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const fetchPaidData = async () => {
//     try {
//       const response = await getApi(urls.bill.paidBillCounts, { id: payload.companyId });
//       setPaidBill(response?.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const fetchVacantPropertyData = async () => {
//     try {
//       const response = await getApi(urls.property.getVacantProperty, { id: payload.companyId });
//       setVacantpropertyData(response?.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const fetchPropertyData = async () => {
//     try {
//       const response = await getApi(urls.property.propertyDataAll, { id: payload.companyId });
//       setProperty(response?.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const fetchTenantData = async () => {
//     try {
//       const response = await getApi(urls.tenant.getAllTenants, { id: payload.companyId });
//       setTenant(response?.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const fetchComplainData = async () => {
//     try {
//       const response = await getApi(urls.Complaints.allComplainForCompany, { id: payload.companyId });
//       setComplainData(response?.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const fetchPendingBillData = async () => {
//     try {
//       const response = await getApi(urls.bill.pendingBillCounts, { id: payload.companyId });
//       setPendingBill(response?.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleCloseReservationDialog = () => {
//     setOpenReserveRoom(false);
//   };

//   const fetchReservationIdForActiveRooms = async (roomNo) => {
//     try {
//       const response = await getApi(`api/room/activroomreservationid/${roomNo}`);
//       navigate(`/dashboard/reservation/view/${response?.data[0]?.reservationId}`);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleRoomClick = (roominfo) => {
//     setTimeout(() => {
//       if (roominfo.bookingStatus === 'active') {
//         fetchReservationIdForActiveRooms(roominfo.roomNo);
//       } else {
//         setOpenReserveRoom(true);
//       }
//       setRoomPropsData(roominfo);
//     }, 300);
//   };

//   return (
//     <Grid container spacing={gridSpacing}>
//       <Grid item xs={12}>
//         <Grid container spacing={gridSpacing}>
//           {/*<Grid item lg={3} md={6} sm={6} xs={12} sx={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/agents')}>
//             <InfoCard isLoading={isLoading} cardName={t('Total Agents')} length={agent.length} icon={Person} />
//           </Grid>*/}
//           <Grid item lg={3} md={6} sm={6} xs={12} sx={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/property')}>
//             <InfoCard isLoading={isLoading} cardName={t('Vacant Property')} length={vacantpropertyData.length} icon={IconFileUpload} />
//           </Grid>
//           <Grid item sm={6} xs={12} md={6} lg={3} sx={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/property')}>
//             <InfoCard isLoading={isLoading} cardName={t('Total Property')} length={property.length} icon={IconFileUpload} />
//           </Grid>
//           <Grid item sm={6} xs={12} md={6} lg={3} sx={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/companyComplaints')}>
//             <InfoCard isLoading={isLoading} cardName={t('Total Complaints')} length={complainData.length} icon={CommentBank} />
//           </Grid>
//           <Grid item sm={6} xs={12} md={6} lg={3} sx={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/booking')}>
//             <InfoCard isLoading={isLoading} cardName={t('Total Bookings')} length={booking.length} icon={Book} />
//           </Grid>
//           <Grid item sm={6} xs={12} md={6} lg={3} sx={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/tenents')}>
//             <InfoCard isLoading={isLoading} cardName={t('Total Tenants')} length={tenant.length} icon={Person2} />
//             {/* <InfoCard isLoading={isLoading} cardName={t('Total Residents')} length={tenant.length} icon={Person2} /> */}

//           </Grid>
//           <Grid item lg={3} md={6} sm={6} xs={12} sx={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/billC')}>
//             <InfoCard isLoading={isLoading} cardName={t('Total Pending Bills')} length={pendingBill.length} icon={Payment} />
//           </Grid>
//           <Grid item lg={3} md={6} sm={6} xs={12} sx={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/billC')}>
//             <InfoCard isLoading={isLoading} cardName={t('Total Bills Paid')} length={paidBill.length} icon={Payment} />
//           </Grid>
//           <Grid item lg={3} md={6} sm={6} xs={12} sx={{ cursor: 'pointer' }} 
//           onClick={() => navigate('/dashboard/defaulters')}
//           >
//             <InfoCard isLoading={isLoading} cardName={t('Defaulters')} length={1} icon={Payment} />
//           </Grid>
//         </Grid>
//       </Grid>

//       <Grid item xs={12}>
//         <Grid container spacing={gridSpacing}>
//           <Grid item xs={8}>
//             <TotalGrowthBarChart isLoading={isLoading} />
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <PopularCard isLoading={isLoading} />
//           </Grid>
//         </Grid>
//       </Grid>
//     </Grid>
//   );
// };

// export default MainDashboard;




/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import { urls } from '@/core/Constant/urls';
import { getApi } from '@/core/apis/api';
import {
  Grid,
  Typography,
  Box,
  Avatar,
  Paper
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { gridSpacing } from '@/store/constant';
import SingleBedIcon from '@mui/icons-material/SingleBed';
import KingBedIcon from '@mui/icons-material/KingBed';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { tokenPayload } from '@/helper';
import TotalGrowthBarChart from './BarChart';
import PopularCard from './PopularCard';
import InfoCard from '@/views/DashboardAT/InfoCard';
// import { Book, CommentBank, Payment, Person, Person2 } from '@mui/icons-material';
import { IconFileUpload } from '@tabler/icons';

import {
  HomeWork, 
  MeetingRoom, 
  CommentBank,
  Book, 
  People,
  ReceiptLong, 
  AttachMoney, 
  ReportProblem 
} from '@mui/icons-material';



const RoomTypeIcons = {
  single: <SingleBedIcon sx={{ fontSize: '2.5rem' }} />,
  double: <KingBedIcon sx={{ fontSize: '2.5rem' }} />,
  triple: <KingBedIcon sx={{ fontSize: '2.5rem' }} />,
  family: <KingBedIcon sx={{ fontSize: '2.5rem' }} />
};

const MainDashboard = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const payload = tokenPayload();
  const [isLoading, setLoading] = useState(true);
  const [openReserveRoom, setOpenReserveRoom] = useState(false);
  const [roomPropsData, setRoomPropsData] = useState([]);
  const navigate = useNavigate();

  const [agent, setAgent] = useState([]);
  const [tenant, setTenant] = useState([]);
  const [customerData, setcustomerData] = useState([]);
  const [property, setProperty] = useState([]);
  const [vacantpropertyData, setVacantpropertyData] = useState([]);
  const [complainData, setComplainData] = useState([]);
  const [booking, setBooking] = useState([]);
  const [pendingBill, setPendingBill] = useState([]);
  const [paidBill, setPaidBill] = useState([]);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAgentData();
    fetchPaidData();
    fetchPropertyData();
    fetchPendingBillData();
    fetchTenantData();
    fetchVacantPropertyData();
    fetchComplainData();
    fetchBookingData();
  }, [openReserveRoom]);

  const fetchAgentData = async () => {
    try {
      const response = await getApi(urls.agent.agentdata, { id: payload.companyId });
      setAgent(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBookingData = async () => {
    try {
      const response = await getApi(urls.booking.allbooking, { id: payload.companyId });
      setBooking(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPaidData = async () => {
    try {
      const response = await getApi(urls.bill.paidBillCounts, { id: payload.companyId });
      setPaidBill(response?.data);
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

  const fetchTenantData = async () => {
    try {
      const response = await getApi(urls.tenant.getAllTenants, { id: payload.companyId });
      setTenant(response?.data);
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
      const response = await getApi(urls.bill.pendingBillCounts, { id: payload.companyId });
      setPendingBill(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseReservationDialog = () => {
    setOpenReserveRoom(false);
  };

  const fetchReservationIdForActiveRooms = async (roomNo) => {
    try {
      const response = await getApi(`api/room/activroomreservationid/${roomNo}`);
      navigate(`/dashboard/reservation/view/${response?.data[0]?.reservationId}`);
    } catch (error) {
      console.log(error);
    }
  };

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
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          {/*<Grid item lg={3} md={6} sm={6} xs={12} sx={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/agents')}>
            <InfoCard isLoading={isLoading} cardName={t('Total Agents')} length={agent.length} icon={Person} />
          </Grid>*/}
          <Grid item lg={3} md={6} sm={6} xs={12} sx={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/property')}>
            <InfoCard isLoading={isLoading} cardName={t('Vacant Property')} length={vacantpropertyData.length} icon={MeetingRoom} />
          </Grid>
          <Grid item sm={6} xs={12} md={6} lg={3} sx={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/property')}>
            <InfoCard isLoading={isLoading} cardName={t('Total Property')} length={property.length} icon={HomeWork} />
          </Grid>
          <Grid item sm={6} xs={12} md={6} lg={3} sx={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/companyComplaints')}>
            <InfoCard isLoading={isLoading} cardName={t('Total Complaints')} length={complainData.length} icon={CommentBank} />
          </Grid>
          <Grid item sm={6} xs={12} md={6} lg={3} sx={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/booking')}>
            <InfoCard isLoading={isLoading} cardName={t('Total Bookings')} length={booking.length} icon={Book} />
          </Grid>
          <Grid item sm={6} xs={12} md={6} lg={3} sx={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/tenents')}>
            <InfoCard isLoading={isLoading} cardName={t('Total Tenants')} length={tenant.length} icon={People} />
            {/* <InfoCard isLoading={isLoading} cardName={t('Total Residents')} length={tenant.length} icon={Person2} /> */}

          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={12} sx={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/billC')}>
            <InfoCard isLoading={isLoading} cardName={t('Total Pending Bills')} length={pendingBill.length} icon={ReceiptLong} />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={12} sx={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/billC')}>
            <InfoCard isLoading={isLoading} cardName={t('Total Bills Paid')} length={paidBill.length} icon={AttachMoney} />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={12} sx={{ cursor: 'pointer' }} 
          onClick={() => navigate('/dashboard/defaulters')}
          >
            <InfoCard isLoading={isLoading} cardName={t('Defaulters')} length={1} icon={ReportProblem} />
          </Grid>
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
    </Grid>
  );
};

export default MainDashboard;
