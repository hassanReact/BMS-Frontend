/* eslint-disable prettier/prettier */
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { getApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { tokenPayload } from '@/helper';

import defaultLogo from '@/assets/images/rms-removebg-preview.png'; 

const Logo = () => {
  const [companyLogo, setCompanyLogo] = useState('');
  const theme = useTheme();
  const payload = tokenPayload();
  const imagepath = urls.logo.logoImage;

  const fetchCompanyData = async () => {
    try {
      const response = await getApi(urls.company.getCompanyById, { id: payload.companyId });
      const logoPath = response?.data?.companyLogo;
      setCompanyLogo(logoPath || '');
    } catch (err) {
      console.error('Failed to fetch company logo:', err);
      setCompanyLogo(''); 
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const logoSrc = companyLogo
    ? `${imagepath}${companyLogo}`
    : defaultLogo;

  return (
    <img
      src={logoSrc}
      alt="CRM"
      // width="175"
      // height="65"
      style={{
        width: 'auto',
        height: '80px',
        display: 'block',
        // backgroundColor: '#f0f0f0', 
        overflow: 'hidden',
        margin: '0 auto'
      }}
    />
  );
};

export default Logo;
