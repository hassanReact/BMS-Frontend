/* eslint-disable prettier/prettier */
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

import { ButtonBase } from '@mui/material';

import config from '@/config';
import Logo from '@/ui-component/Logo';
import { MENU_OPEN } from '@/store/actions';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  const defaultId = useSelector((state) => state.customization.defaultId);
  const dispatch = useDispatch();

  return (
    <ButtonBase disableRipple onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })} to={config.defaultPath}>
      <Logo />
    </ButtonBase>
  );
};

export default LogoSection;
