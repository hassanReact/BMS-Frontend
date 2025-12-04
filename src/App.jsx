/* eslint-disable prettier/prettier */
import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// routing
import Routes from './routes';

// defaultTheme
import themes from './themes';

// project imports
import NavigationScroll from './layout/NavigationScroll';
import { useLocation, useNavigate } from 'react-router';
import { useEffect } from 'react';

// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.customization);
  const token = localStorage.getItem('$2b$10$ehdPSDmr6P');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const publicPaths = ['/register', '/login'];

    if (!token && !publicPaths.includes(location.pathname)) {
      navigate('/login');
    }
  }, [token, navigate, location.pathname]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <ToastContainer />
        <NavigationScroll>
          <Routes />
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
