import { Typography } from '@mui/material';
import NavGroup from './NavGroup';
import menuItem from '@/menu-items';
import { useState } from 'react';

const MenuList = ({ collapsed }) => {
  const [openModule, setOpenModule] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const handleToggle = (id) => {
    setOpenModule((prev) => (prev === id ? null : id));
    setSelectedId(id);
  };

  return (
    <>
      {menuItem.items.map((item, index) => {
        const key = item.id || `nav-item-${index}`;
        switch (item.type) {
          case 'group':
            return (
              <NavGroup
                key={key}
                item={item}
                openModule={openModule}
                selectedId={selectedId}
                onToggle={handleToggle}
                collapsed={collapsed}
              />
            );
          default:
            return (
              <Typography key={key} variant="h6" color="error" align="center">
                Menu Items Error
              </Typography>
            );
        }
      })}
    </>
  );
};



export default MenuList;