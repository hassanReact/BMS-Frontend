// import { useTheme } from '@mui/material/styles';
// import { Divider, Grid, Stack, Typography, Box } from '@mui/material';
// import AuthWrapper1 from '../AuthWrapper1';
// import AuthCardWrapper from '../AuthCardWrapper';
// // import AuthLogin from '../auth-forms/AuthLogin';
// import Logo from '@/layout/MainLayout/LogoSection';

// import InventoryImage from '@/assets/images/mklp.png';
// import FirebaseLogin from '../auth-forms/AuthLogin';
// const Login = () => {
//   const theme = useTheme();
//   return (
//     <AuthWrapper1>
//       <Grid container sx={{ minHeight: '100vh', backgroundColor: '#441572' }}>
//         <Grid
//           item
//           xs={12}
//           md={6}
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center'
//           }}
//         >
//           <AuthCardWrapper
//             sx={{
//               maxWidth: 400,
//               width: '100%',
//               boxShadow: theme.shadows[3],
//               borderRadius: 2,
//               backgroundColor: theme.palette.background.paper
//             }}
//           >
//             <Grid container spacing={2} alignItems="center">
//               <Grid item sx={{ mb: 2, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
//                 <Box
//                   sx={{
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     marginTop: '2px',
//                     marginLeft: 12
//                   }}
//                 >
//                   <Logo />
//                 </Box>
//               </Grid>
//               <Grid item xs={12} sx={{ marginTop: '-20px' }}>
//                 <Stack alignItems="center">
//                   <Typography variant="h3" sx={{ fontWeight: 700, textAlign: 'center', color: '#240046' }}>
//                     Welcome to MAK BMS
//                   </Typography>
                  
//                 </Stack>
//               </Grid>
//               <Grid item xs={12}>
//                 <FirebaseLogin />
//               </Grid>
//               <Grid item xs={12}>
//                 <Divider sx={{ backgroundColor: '#FFFFFF' }} />
//               </Grid>
//             </Grid>
//           </AuthCardWrapper>
//         </Grid>
//         <Grid
//           item
//           xs={12}
//           md={6}
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center'
//           }}
//         >
//           <Box
//             sx={{
//               width: '100%',
//               height: '100%',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               backgroundColor: '#2F124C',
//               padding: '4px',
//               flexDirection: 'column'
//             }}
//           >
//             <Box
//               component="img"
//               src={InventoryImage}
//               alt="Inventory Management"
//               sx={{
//                 maxWidth: '60%',
//                 maxHeight: '60%',
//                 objectFit: 'contain',
//                 borderRadius: '20px'
//               }}
//             />
//             <Typography
//               variant="h2"
//               sx={{
//                 color: 'white',
//                 fontWeight: 'bold',
//                 textAlign: 'center',
//                 marginTop: '16px'
//               }}
//             >
//               Building Management System <br />
//             </Typography>
//           </Box>
//         </Grid>
//       </Grid>
//     </AuthWrapper1>
//   );
// };
// export default Login;


import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Typography, Box, Button } from '@mui/material';
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from '@/layout/MainLayout/LogoSection';
import FirebaseLogin from '../auth-forms/AuthLogin';

// Import your background image
import BgImage from '@/assets/images/mklp.png';

const Login = () => {
  const theme = useTheme();

  return (
    <AuthWrapper1>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          minHeight: '100vh',
          backgroundImage: `linear-gradient(rgba(0, 71, 187, 0.75), rgba(0, 132, 255, 0.75)), url(${BgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          p: 2,
        }}
      >
        <AuthCardWrapper
          sx={{
            maxWidth: 380,
            width: '100%',
            p: 1.5,
            textAlign: 'center',
            borderRadius: 3,
            backgroundColor: 'rgba(255,255,255,0.95)',
            boxShadow: '0px 8px 32px rgba(0,0,0,0.25)',
          }}
        >
          {/* Logo */}
          {/* <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.8 }}>
            <Logo />
          </Box> */}

          {/* Title */}
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 1, color: theme.palette.text.primary }}
          >
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Please sign in to continue
          </Typography>

          {/* Form Fields */}
          <FirebaseLogin />

          {/* Divider */}
          <Divider sx={{ my: 2 }} />

        

          
        </AuthCardWrapper>
      </Grid>
    </AuthWrapper1>
  );
};

export default Login;

// import { useTheme } from '@mui/material/styles';
// import { Divider, Grid, Stack, Typography, Box } from '@mui/material';
// import AuthWrapper1 from '../AuthWrapper1';
// import AuthCardWrapper from '../AuthCardWrapper';
// // import Logo from '@/layout/MainLayout/LogoSection';

// import InventoryImage from '@/assets/images/mklp.png';
// import FirebaseLogin from '../auth-forms/AuthLogin';

// const Login = () => {
//   const theme = useTheme();
//   return (
//     <AuthWrapper1>
//       <Grid container sx={{ minHeight: '100vh', backgroundColor: '#441572' }}>
//         {/* Left: Login Form */}
//         <Grid
//           item
//           xs={12}
//           md={6}
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center'
//           }}
//         >
//           <AuthCardWrapper
//             sx={{
//               maxWidth: 400,
//               width: '100%',
//               boxShadow: theme.shadows[3],
//               borderRadius: 2,
//               backgroundColor: theme.palette.background.paper
//             }}
//           >
//             <Grid container spacing={2} alignItems="center">
//               {/* Removed duplicate Logo */}

//               {/* Welcome Text */}
//               <Grid item xs={12}>
//                 <Stack alignItems="center">
//                   <Typography
//                     variant="h3"
//                     sx={{ fontWeight: 700, textAlign: 'center', color: '#240046' }}
//                   >
                    
//                   </Typography>
//                 </Stack>
//               </Grid>

//               {/* Login Form */}
//               <Grid item xs={12}>
//                 <FirebaseLogin />
//               </Grid>

//               {/* Divider */}
//               <Grid item xs={12}>
//                 <Divider sx={{ backgroundColor: '#FFFFFF' }} />
//               </Grid>
//             </Grid>
//           </AuthCardWrapper>
//         </Grid>

//         {/* Right: Illustration */}
//         <Grid
//           item
//           xs={12}
//           md={6}
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center'
//           }}
//         >
//           <Box
//             sx={{
//               width: '100%',
//               height: '100%',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               backgroundColor: '#2F124C',
//               padding: '4px',
//               flexDirection: 'column'
//             }}
//           >
//             <Box
//               component="img"
//               src={InventoryImage}
//               alt="Inventory Management"
//               sx={{
//                 maxWidth: '60%',
//                 maxHeight: '60%',
//                 objectFit: 'contain',
//                 borderRadius: '20px'
//               }}
//             />
//             <Typography
//               variant="h2"
//               sx={{
//                 color: 'white',
//                 fontWeight: 'bold',
//                 textAlign: 'center',
//                 marginTop: '16px'
//               }}
//             >
//               Building Management System<br />
//             </Typography>
//           </Box>
//         </Grid>
//       </Grid>
//     </AuthWrapper1>
//   );
// };

// export default Login;
