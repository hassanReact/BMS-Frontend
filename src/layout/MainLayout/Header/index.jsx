// import PropTypes from 'prop-types';
// import { useTheme, styled } from '@mui/material/styles';
// import { AppBar, Toolbar, Box, Typography, Tooltip,Avatar } from '@mui/material';
// import ProfileSection from './ProfileSection';
// import { useState, useEffect } from 'react';
// import { getApi } from '@/core/apis/api';
// import { urls } from '@/core/Constant/urls';
// import { tokenPayload } from '@/helper';
// import BMSLogo from '@/assets/images/BMS.png';


// // constants
// import { drawerWidth } from '@/store/constant';
// const collapsedWidth = 72;

// // Styled AppBar that adjusts width based on sidebar state
// const MainAppBar = styled(AppBar, {
//   shouldForwardProp: (prop) => prop !== 'open'
// })(({ theme, open }) => ({
//   zIndex: theme.zIndex.drawer + 1,
//   transition: theme.transitions.create(['width', 'margin'], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.standard
//   }),
//   marginLeft: open ? drawerWidth : collapsedWidth,
//   width: `calc(100% - ${open ? drawerWidth : collapsedWidth}px)`,
//   backgroundColor: theme.palette.background.paper,
//   boxShadow: 'none',
//   borderBottom: `1px solid ${theme.palette.divider}`
// }));

// const Header = ({ drawerOpen }) => {
//   const payload = tokenPayload();
//   const [company, setCompany] = useState('');
//   const theme = useTheme();

//   const userRole = payload.role;

//   const fetchCompanyData = async () => {
//     const response = await getApi(urls.company.getCompanyById, { id: payload.companyId });
//     setCompany(response?.data?.companyName || '');
//   };

//   useEffect(() => {
//     if (userRole !== 'admin') {
//       fetchCompanyData();
//     }
//   }, [userRole]);

//   const [currentTime, setCurrentTime] = useState('');

//   useEffect(() => {
//     const updateTime = () => {
//       const now = new Date();
//       const day = now.toLocaleDateString('en-US', { weekday: 'long' });
//       const date = now.toLocaleDateString();
//       const time = now.toLocaleTimeString();
//       setCurrentTime(`${day}, ${date} ${time}`);
//     };

//     updateTime();
//     const timer = setInterval(updateTime, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <MainAppBar position="fixed" open={drawerOpen}>
//       <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

// {/* add co mpany logo here */}





//   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//  <img 
//   src={BMSLogo} 
//   alt="Company Logo" 
//   style={{ width: 80, height: 'auto', objectFit: 'contain' }} 
// />

// </Box>



//         {/* Left side: Company Name */}
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//           {company && (
//             <Box sx={{ textAlign: 'center', flexGrow: 1 }}>
//               {/* <Typography
//                 variant="body2"
//                 sx={{
//                   fontWeight: 400,
//                   fontSize: '1.2rem',
//                   color: theme.palette.text.secondary
//                 }}
//               >
//                 Welcome to
//               </Typography> */}
//               <Tooltip title="Click to view company profile" arrow>
//                 {/* <Typography
//                   variant="h4"
//                   noWrap
//                   sx={{
//                     fontWeight: 700,
//                     fontSize: '2rem',
//                     color: theme.palette.primary.main,
//                     maxWidth: '400px',
//                     margin: 'auto',
//                     overflow: 'hidden',
//                     textOverflow: 'ellipsis',
//                     cursor: 'pointer',
//                     transition: 'all 0.3s ease',
//                     '&:hover': {
//                       color: theme.palette.primary.dark,
//                       transform: 'scale(1.05)'
//                     }
//                   }}
//                 >
//                   {company}
//                 </Typography> */}
//               </Tooltip>
//             </Box>
//           )}
//         </Box>

//         {/* Right side: Date + Profile */}
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
//           <Box sx={{ textAlign: 'right' }}>
//            <Typography
//               variant="subtitle1"
//               sx={{
//                 fontSize: '1.1rem',
//                 fontWeight: 600,
//                 color: theme.palette.text.primary
//               }}
              
//             >
//               Welcome to {company}
//             </Typography>

//             <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: 400,
//                 fontSize: '1rem',
//                 color: theme.palette.text.secondary
//               }}
//             >
//               {currentTime}
//             </Typography>
//           </Box>
//           <ProfileSection />
//         </Box>
//       </Toolbar>
//     </MainAppBar>
//   );
// };

// Header.propTypes = {
//   drawerOpen: PropTypes.bool
// };

// export default Header;




import PropTypes from 'prop-types';
import { useTheme, styled } from '@mui/material/styles';
import { AppBar, Toolbar, Box, Typography, Tooltip,Avatar } from '@mui/material';
import ProfileSection from './ProfileSection';
import { useState, useEffect } from 'react';
import { getApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { tokenPayload } from '@/helper';
import BMSLogo from '@/assets/images/BMS.png';


// constants
import { drawerWidth } from '@/store/constant';
const collapsedWidth = 72;

// Styled AppBar that adjusts width based on sidebar state
// const MainAppBar = styled(AppBar, {
//   shouldForwardProp: (prop) => prop !== 'open'
// })(({ theme, open }) => ({
//   zIndex: theme.zIndex.drawer + 1,
//   transition: theme.transitions.create(['width', 'margin'], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.standard
//   }),
//   marginLeft: open ? drawerWidth : collapsedWidth,
//   width: `calc(100% - ${open ? drawerWidth : collapsedWidth}px)`,
//   backgroundColor: theme.palette.background.paper,
//   boxShadow: 'none',
//   borderBottom: `1px solid ${theme.palette.divider}`
// }));


const MainAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create('all', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.standard
  }),
  width: '100%',          
  marginLeft: 0,          // don’t shift when sidebar opens
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const Header = ({ drawerOpen }) => {
  const payload = tokenPayload();
  const [company, setCompany] = useState('');
  const theme = useTheme();

  const userRole = payload.role;

  const fetchCompanyData = async () => {
    const response = await getApi(urls.company.getCompanyById, { id: payload.companyId });
    setCompany(response?.data?.companyName || '');
  };

  useEffect(() => {
    if (userRole !== 'admin') {
      fetchCompanyData();
    }
  }, [userRole]);

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const day = now.toLocaleDateString('en-US', { weekday: 'long' });
      const date = now.toLocaleDateString();
      const time = now.toLocaleTimeString();
      setCurrentTime(`${day}, ${date} ${time}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <MainAppBar position="fixed" open={drawerOpen}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

{/* add co mpany logo here */}





  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
 <img 
  src={BMSLogo} 
  alt="Company Logo" 
  style={{ width: 80, height: 'auto', objectFit: 'contain' }} 
/>

</Box>



        {/* Left side: Company Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {company && (
            <Box sx={{ textAlign: 'center', flexGrow: 1 }}>
              {/* <Typography
                variant="body2"
                sx={{
                  fontWeight: 400,
                  fontSize: '1.2rem',
                  color: theme.palette.text.secondary
                }}
              >
                Welcome to
              </Typography> */}
              <Tooltip title="Click to view company profile" arrow>
                {/* <Typography
                  variant="h4"
                  noWrap
                  sx={{
                    fontWeight: 700,
                    fontSize: '2rem',
                    color: theme.palette.primary.main,
                    maxWidth: '400px',
                    margin: 'auto',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: theme.palette.primary.dark,
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  {company}
                </Typography> */}
              </Tooltip>
            </Box>
          )}
        </Box>

        {/* Right side: Date + Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ textAlign: 'right' }}>
           <Typography
              variant="subtitle1"
              sx={{
                fontSize: '1.1rem',
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
              
            >
              Welcome to {company}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                fontSize: '1rem',
                color: theme.palette.text.secondary
              }}
            >
              {currentTime}
            </Typography>
          </Box>
          <ProfileSection />
        </Box>
      </Toolbar>
    </MainAppBar>
  );
};

Header.propTypes = {
  drawerOpen: PropTypes.bool
};

export default Header;
