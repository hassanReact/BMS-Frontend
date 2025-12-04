// import { useDispatch, useSelector } from 'react-redux';
// import { Outlet } from 'react-router-dom';

// // material-ui
// import { styled, useTheme } from '@mui/material/styles';
// import { Box, CssBaseline, useMediaQuery } from '@mui/material';

// // project imports
// import Breadcrumbs from '@/ui-component/extended/Breadcrumbs';
// import Header from './Header';
// import Sidebar from './Sidebar';
// import Customization from '../Customization';
// import { SET_MENU } from '@/store/actions';

// // assets
// import { IconChevronRight } from '@tabler/icons';

// const Main = styled('main')(({ theme }) => ({
//   flexGrow: 1,
//   padding: theme.spacing(3),
//   marginTop: theme.spacing(9),   // keeps offset for AppBar
//   paddingTop: theme.spacing(5),  // extra breathing space
//   backgroundColor: theme.palette.background.default,
//   minHeight: '100vh',
//   transition: theme.transitions.create(['margin', 'width'], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.standard
//   })
// }));

// // ==============================|| MAIN LAYOUT ||============================== //

// const MainLayout = () => {
//   const theme = useTheme();
//   const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

//   const leftDrawerOpened = useSelector((state) => state.customization.opened);
//   const dispatch = useDispatch();

//   const handleLeftDrawerToggle = () => {
//     dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
//   };

//   // pass this to Header so it knows whether to shift AppBar
//   const isDrawerOpen = !matchDownMd ? leftDrawerOpened : false;

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <CssBaseline />

//       {/* header (already has AppBar inside Header.jsx) */}
//       <Header drawerOpen={isDrawerOpen} handleLeftDrawerToggle={handleLeftDrawerToggle} />

//       {/* drawer */}
//       <Sidebar
//         drawerOpen={isDrawerOpen}
//         drawerToggle={handleLeftDrawerToggle}
//       />

//       {/* main content */}
//       <Main>
//         <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
//         <Outlet />
//       </Main>

//       <Customization />
//     </Box>
//   );
// };

// export default MainLayout;



import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, CssBaseline, useMediaQuery } from '@mui/material';

// project imports
import Breadcrumbs from '@/ui-component/extended/Breadcrumbs';
import Header from './Header';
import Sidebar from './Sidebar';
import Customization from '../Customization';
import { SET_MENU } from '@/store/actions';

// assets
import { IconChevronRight } from '@tabler/icons';

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: theme.spacing(9),   // keeps offset for AppBar
  paddingTop: theme.spacing(5),  // extra breathing space
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.standard
  })
}));





// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

  const leftDrawerOpened = useSelector((state) => state.customization.opened);
  const dispatch = useDispatch();

  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
  };

  // pass this to Header so it knows whether to shift AppBar
  const isDrawerOpen = !matchDownMd ? leftDrawerOpened : false;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* header (already has AppBar inside Header.jsx) */}
      <Header drawerOpen={isDrawerOpen} handleLeftDrawerToggle={handleLeftDrawerToggle} />

      {/* drawer */}
      <Sidebar
        drawerOpen={isDrawerOpen}
        drawerToggle={handleLeftDrawerToggle}
      />

      {/* main content */}
      <Main>
        <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
        <Outlet />
      </Main>

      <Customization />
    </Box>
  );
};

export default MainLayout;
