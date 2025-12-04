/* eslint-disable prettier/prettier */
import { useState } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useTheme } from '@mui/material/styles';
import { postApi } from '@/core/apis/api';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Divider,
  InputLabel,
  OutlinedInput,
  Typography
} from '@mui/material';
import { Formik } from 'formik';
import AnimateButton from '@/ui-component/extended/AnimateButton';
import { toast } from 'react-toastify';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { urls } from '@/core/Constant/urls';

const FirebaseLogin = ({ ...others }) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleCredentialClick = async (email, password, setFieldValue, handleSubmit) => {
    setFieldValue('email', email);
    setFieldValue('password', password);
    setTimeout(() => {
      handleSubmit();
    }, 500);
  };

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12} container alignItems="center" justifyContent="center"></Grid>
      </Grid>

      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Valid Email Required').max(255).required('Email Required'),
          password: Yup.string().max(255).required('Password Required')
        })}
        onSubmit={async (values) => {
          try {
            const loginUrl = values.email === 'admin@samyotech.com' ? urls.user.login : urls.company.login;
          
            const response = await postApi(loginUrl, values);

            if (response.success === true) {
              toast.success('Login Successful');
              localStorage.setItem('$2b$10$ehdPSDmr6P', response.data.accessToken);
              const Role = response.data.role;

              console.log(Role);

              if (Role === 'admin') {
                window.location.replace('/dashboard/SADashboard');
              } else if (Role === 'companyAdmin') {
                window.location.replace('/dashboard/default');
              } else if (Role === 'tenant') {
                window.location.replace('/dashboard/TDashboard');
              } else if (Role === 'staff') {
                window.location.replace('/dashboard/myjobs');
              } else if (Role === 'owner') {
                window.location.replace('/dashboard/myjobs');
              }
            }
          } catch (error) {
            if (error.response) {
              toast.error(error.response.data.error || 'Unexpected error');
            } else {
              toast.error('Unexpected Error Occurred');
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values,setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-login">Email</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Enter Email"
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Enter Password"
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            <Box sx={{ width: '100%' }}>
              <Box
                sx={{
                  cursor: 'pointer',
                  p: 2
                }}
                onClick={() => handleCredentialClick('admin@samyotech.com', '1234', setFieldValue, handleSubmit)}
              >
                <Typography variant="h5">Super Admin Credentials</Typography>
              </Box>
              <Divider />
              <Box
                sx={{
                  cursor: 'pointer',
                  p: 2
                }}
                onClick={() => handleCredentialClick('company.admin@gmail.com', '1234', setFieldValue, handleSubmit)}
              >
                <Typography variant="h5">Company Admin Credentials</Typography>
              </Box>
            </Box>


            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation fullWidth size="large" type="submit" variant="contained" color="secondary">
                  Sign In
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseLogin;
