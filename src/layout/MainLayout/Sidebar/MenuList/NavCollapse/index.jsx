// import PropTypes from 'prop-types';
// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router';

// // material-ui
// import { useTheme } from '@mui/material/styles';
// import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

// // project imports
// import NavItem from '../NavItem';

// // assets
// import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
// import { IconChevronDown, IconChevronUp } from '@tabler/icons';

// const NavCollapse = ({ menu, level, isOpen, selectedId, onToggle, collapsed }) => {
//   const theme = useTheme();
//   const [selected, setSelected] = useState(null);

//   const handleClick = () => {
//     onToggle(menu.id);
//     setSelected(selected === menu.id ? null : menu.id);
//   };

//   const Icon = menu.icon;
//   const menuIcon = menu.icon ? (
//     <Icon strokeWidth={1.5} size="1.3rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
//   ) : (
//     <FiberManualRecordIcon
//       sx={{
//         width: selected === menu.id ? 8 : 6,
//         height: selected === menu.id ? 8 : 6
//       }}
//       fontSize={level > 0 ? 'inherit' : 'medium'}
//     />
//   );

//   return (
//     <>
//       {/* <ListItemButton
//         onClick={handleClick}
//         sx={{
// pl: collapsed ? 0 : `${level * 24}px`,
//    justifyContent: collapsed ? 'center' : 'flex-start',
          
         
//           minHeight: 48
//         }}
//       >

        
//         <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : 36, display: 'flex', justifyContent: 'center' }}>
//   {menuIcon}
// </ListItemIcon>

//         {!collapsed && (
//           <ListItemText
//             primary={
//               <Typography variant={selected === menu.id ? 'h5' : 'body1'} color="inherit">
//                 {menu.title}
//               </Typography>
//             }
//           />
//         )}
//         {!collapsed && (isOpen ? <IconChevronUp size="1rem" /> : <IconChevronDown size="1rem" />)}
//       </ListItemButton> */}


//       <ListItemButton
//   onClick={handleClick}
//   sx={{
//     pl: collapsed ? 0 : `${level * 24}px`,
//     justifyContent: collapsed ? 'center' : 'flex-start',
//     minHeight: 48,
//     px: collapsed ? -1 : 2 // ✅ reduce horizontal padding when collapsed
//   }}
// >
//   <ListItemIcon
//     sx={{
//       minWidth: collapsed ? 0 : 36, // ✅ remove extra minWidth in collapsed mode
//       mr: collapsed ? -1 : 1,        // ✅ no margin-right when collapsed
//       display: 'flex',
//       justifyContent: 'center'
//     }}
//   >
//     {menuIcon}
//   </ListItemIcon>

//   {!collapsed && (
//     <ListItemText
//       primary={
//         <Typography
//           variant={selected === menu.id ? 'h5' : 'body1'}
//           color="inherit"
//         >
//           {menu.title}
//         </Typography>
//       }
//     />
//   )}
//   {!collapsed && (isOpen ? <IconChevronUp size="1rem" /> : <IconChevronDown size="1rem" />)}
// </ListItemButton>

     
// <Collapse in={isOpen} timeout="auto" unmountOnExit>

//         <List component="div" disablePadding>
//           {menu.children?.map((item) =>
//             item.type === 'collapse' ? (
//               <NavCollapse
//                 key={item.id}
//                 menu={item}
//                 level={level + 1}
//                 isOpen={isOpen && selected === item.id}
//                 selectedId={selectedId}
//                 onToggle={onToggle}
//                 collapsed={collapsed}
//               />
//             ) : (
//               <NavItem key={item.id} item={item} level={level + 1} collapsed={collapsed} />
//             )
//           )}
//         </List>
//       </Collapse>
//     </>
//   );
// };
// export default NavCollapse;




import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

// project imports
import NavItem from '../NavItem';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { IconChevronDown, IconChevronUp } from '@tabler/icons';

const NavCollapse = ({ menu, level, isOpen, selectedId, onToggle, collapsed }) => {
  const theme = useTheme();
  const [selected, setSelected] = useState(null);

  const handleClick = () => {
    onToggle(menu.id);
    setSelected(selected === menu.id ? null : menu.id);
  };

 


  const Icon = menu.icon;
const menuIcon = menu.icon ? (
  <Icon
    strokeWidth={1.5}
    size={20} 
    style={{
      margin: 'auto',
      display: 'block'
    }}
  />
) : (
  <FiberManualRecordIcon
    sx={{
      fontSize: 20, 
      margin: 'auto',
      display: 'block'
    }}
  />
);

  return (
    <>
    

<ListItemButton
  onClick={handleClick}
  sx={{
    mb: 0.5,
    alignItems: 'center',
    py: 1,
    px: 2,
    pl: collapsed ? (level > 1 ? 3 : 1) : `${level * 20}px`, 
    justifyContent: collapsed ? 'center' : 'flex-start',
    minHeight: 40 
  }}
>
  <ListItemIcon
    sx={{
      minWidth: 0,
      width: level > 1 ? 24 : 36,   
      height: level > 1 ? 24 : 36,
      mr: collapsed ? 0 : 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    {menuIcon}
  </ListItemIcon>

  {!collapsed && (
    <ListItemText
      primary={
        // <Typography
        //   variant={selected === menu.id ? 'h5' : 'body1'}
        //   color="inherit"
        // >
        //   {menu.title}
        // </Typography>


      //   <Typography
      //   variant={
      //     level > 1
      //       ? 'body2' 
      //       : selected === menu.id
      //         ? 'h6'   
      //         : 'body1' 
      //   }
      //   sx={{
      //     fontSize: level > 1 ? '0.8rem' : '0.95rem'
         
      //   }}
      //   color="inherit"
      // >
      //   {menu.title}
      // </Typography>


      <Typography
  variant={level > 1 ? 'body2' : 'body1'}
  sx={{
    fontSize: level > 1 ? '0.8rem' : '0.95rem',
    fontWeight: 400   // always normal weight
  }}
  color="inherit"
>
  {menu.title}
</Typography>

      }
    />
  )}
  {!collapsed && (isOpen ? <IconChevronUp size="1rem" /> : <IconChevronDown size="1rem" />)}
</ListItemButton>


    <Collapse in={isOpen} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>
    {menu.children?.map((item) =>
      item.type === 'collapse' ? (
        <NavCollapse
          key={item.id}
          menu={item}
          level={level + 1}  
          isOpen={isOpen && selected === item.id}
          selectedId={selectedId}
          onToggle={onToggle}
          collapsed={collapsed}
        />
      ) : (
        <NavItem
          key={item.id}
          item={item}
          level={level + 1}   
          collapsed={collapsed}
        />
      )
    )}
  </List>
</Collapse>


    </>
  );
};
export default NavCollapse;
