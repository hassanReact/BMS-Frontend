// import { Drawer, IconButton, Box } from '@mui/material';
// import { styled, useTheme } from '@mui/material/styles';
// import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
// import MenuList from './MenuList';
// import { drawerWidth } from '@/store/constant';

// // 👉 Import your logo (optional)

// const collapsedWidth = 60;

// const SidebarDrawer = styled(Drawer, {
//   shouldForwardProp: (prop) => prop !== 'open'
// })(({ theme, open }) => ({
//   width: open ? drawerWidth : collapsedWidth,
//   flexShrink: 0,
//   whiteSpace: 'nowrap',
//   '& .MuiDrawer-paper': {
//     width: open ? drawerWidth : collapsedWidth,
//     transition: theme.transitions.create('width', {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.standard
//     }),
//     overflowX: 'hidden',
//     backgroundColor: 'transparent',
//     borderRight: 'none',
//     boxShadow: 'none'
//   }
// }));

// const Sidebar = ({ drawerOpen, drawerToggle }) => {
//   const theme = useTheme();

//   return (
//     <>
//       <SidebarDrawer variant="permanent" open={drawerOpen}>
//         <Box
//           sx={{
//             width: '100%',
//             height: '100%',
//             bgcolor: theme.palette.background.paper,
//             borderRight: `1px solid ${theme.palette.divider}`,
//             display: 'flex',
//             flexDirection: 'column'
//           }}
//         >
//           {/* Push sidebar below the Header */}
//           {/* <Box sx={theme.mixins.toolbar} /> */}

//          <Box sx={{ minHeight: '40px' }} />  


//           {/* Menu Items */}
//           <MenuList collapsed={!drawerOpen} />
//         </Box>
//       </SidebarDrawer>

 
//    <IconButton
//   onClick={drawerToggle}
//   sx={{
//     position: 'fixed',
//     top: '50%',
//     left: drawerOpen ? drawerWidth - 1 : collapsedWidth - 1,
//     transform: 'translateY(-50%)',
//     bgcolor: theme.palette.primary.main,
//     color: '#fff',
//     border: '1px solid',
//     borderColor: theme.palette.primary.main,
//     boxShadow: 1,
//     zIndex: 2000,

//     borderRadius: drawerOpen ? '0 6px 6px 0' : '6px 0 0 6px',

//     borderLeft: drawerOpen ? 'none' : '1px solid',
//     borderRight: drawerOpen ? '1px solid' : 'none',

//     padding: '4px 6px',
//     minWidth: '28px',
//     minHeight: '28px',

//     '&:hover': {
//       bgcolor: theme.palette.primary.dark
//     }
//   }}
// >
//   {drawerOpen ? <IconChevronLeft size={18} /> : <IconChevronRight size={18} />}
// </IconButton>

//     </>
//   );
// };

// export default Sidebar;



import { Drawer, IconButton, Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import MenuList from './MenuList';
import { drawerWidth } from '@/store/constant';

const collapsedWidth = 60;

const SidebarDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  width: open ? drawerWidth : collapsedWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  '& .MuiDrawer-paper': {
    width: open ? drawerWidth : collapsedWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard
    }),
    overflowX: 'hidden',
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none',

    marginTop: theme.spacing(12),
    height: `calc(100% - ${theme.spacing(9)})`
  }
}));

const Sidebar = ({ drawerOpen, drawerToggle }) => {
  const theme = useTheme();

  return (
    <>
      <SidebarDrawer variant="permanent" open={drawerOpen}>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Menu Items */}
          <MenuList collapsed={!drawerOpen} />
        </Box>
      </SidebarDrawer>

      {/* Collapse/Expand Toggle Button */}
      <IconButton
        onClick={drawerToggle}
        sx={{
          position: 'fixed',
          top: '20%',
          left: drawerOpen ? drawerWidth - 1 : collapsedWidth - 1,
          transform: 'translateY(-50%)',
          bgcolor: theme.palette.primary.main,
          color: '#fff',
          border: '1px solid',
          borderColor: theme.palette.primary.main,
          boxShadow: 1,
          zIndex: 1200,

          borderRadius: drawerOpen ? '0 6px 6px 0' : '6px 0 0 6px',

          borderLeft: drawerOpen ? 'none' : '1px solid',
          borderRight: drawerOpen ? '1px solid' : 'none',

          padding: '4px 6px',
          minWidth: '28px',
          minHeight: '28px',

          '&:hover': {
            bgcolor: theme.palette.primary.dark
          }
        }}
      >
        {drawerOpen ? <IconChevronLeft size={18} /> : <IconChevronRight size={18} />}
      </IconButton>
    </>
  );
};

export default Sidebar;
