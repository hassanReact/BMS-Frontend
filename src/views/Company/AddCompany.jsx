/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import { postApi } from '@/core/apis/api';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { FormLabel } from '@mui/material';
import { toast } from 'react-toastify';
import { urls } from '@/core/Constant/urls';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { useState } from 'react';
import {Select,MenuItem} from '@mui/material';
import currencyCodes from 'currency-codes';

const AddCompany = (props) => {
  const { t } = useTranslation();
  const { open, handleClose } = props;
  const [loading , setLoading] = useState(false);

  const validationSchema = yup.object({
    companyName: yup
       .string()
       .matches(/^[A-Za-z\s]+$/, t('Company Name can only contain letters and spaces'))
       .max(50, t('Company Name cannot exceed 50 characters'))
       .required(t('Company Name is required')),
    email: yup
      .string()
      .email(t('Invalid email address'))
      .required(t('Email is required')),
    phoneNo: yup
      .string()
      .matches(/^[0-9]{10}$/, t('Phone Number must be exactly 10 digits'))
      .required(t('Phone Number is required')),
    address: yup
      .string()
      .max(80, t('Address cannot exceed 80 characters'))
      .required(t('Address is required')),
    password: yup.string().required(t('Password is required')),
    currencyCode: yup.string().required(t('Currency is required')),
    gstnumber: yup
      .string()
      .max(15, t("Gst number cannot exceed 15 character."))
  });

  const initialValues = {
    companyName: '',
    email: '',
    phoneNo: '',
    address: '',
    password: '',
    currencyCode:'',
    gstnumber:''
  };

  const AddCompany = async (values, resetForm) => {
    setLoading(true);
    try {
      const response = await postApi(urls.company.create, values);

      if (response.success){
        toast.success(t(' Company Successfully registered'));
        handleClose();
        resetForm();
      }
       } catch {
         toast.error(t('Failed to register Company!'));
      } finally {
         handleClose();
         resetForm()
         setLoading(false); 
      }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      values.email = values.email.toLowerCase();
      AddCompany(values, resetForm);
    },
  });

  const currencyOptions = currencyCodes.data.map((currency) => ({
    code: currency.code,
    name: currency.currency,
  }));

  return (
    <div>
      <Dialog open={open} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <DialogTitle
          id="scroll-dialog-title"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6">{t('Create Company')}</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={6}>
                <FormLabel>{t('Company Name')}</FormLabel>
                <TextField
                  id="companyName"
                  name="companyName"
                  size="small"
                  fullWidth
                  value={formik.values.companyName}
                  onChange={formik.handleChange}
                  error={formik.touched.companyName && Boolean(formik.errors.companyName)}
                  helperText={formik.touched.companyName && formik.errors.companyName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormLabel>{t('Email')}</FormLabel>
                <TextField
                  id="email"
                  name="email"
                  type='email'
                  size="small"
                  fullWidth
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormLabel>{t('Phone No')}</FormLabel>
                <TextField
                  id="phoneNo"
                  name="phoneNo"
                  type="number"
                  size="small"
                  fullWidth
                  value={formik.values.phoneNo}
                  onChange={formik.handleChange}
                  error={formik.touched.phoneNo && Boolean(formik.errors.phoneNo)}
                  helperText={formik.touched.phoneNo && formik.errors.phoneNo}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormLabel>{t('Address')}</FormLabel>
                <TextField
                  id="address"
                  name="address"
                  size="small"
                  fullWidth
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormLabel>{t('Password')}</FormLabel>
                <TextField
                  id="password"
                  name="password"
                  type="password"
                  size="small"
                  fullWidth
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormLabel>{t('currency_code')}</FormLabel>
                <Select
                  id="currencyCode"
                  name="currencyCode"
                  size="small"
                  fullWidth
                  value={formik.values.currencyCode}
                  onChange={formik.handleChange}
                  error={formik.touched.currencyCode && Boolean(formik.errors.currencyCode)}
                >
                  <MenuItem value="" disabled>
                  {t('select_currency_code')}
                  </MenuItem>
                  {currencyOptions.map((currency) => (
                    <MenuItem key={currency.code} value={currency.code}>
                      {`${currency.code} - ${currency.name}`}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormLabel>{t('GST Number')}</FormLabel>
                <TextField
                  id="gstnumber"
                  name="gstnumber"
                  size="small"
                  fullWidth
                  value={formik.values.gstnumber}
                  onChange={formik.handleChange}
                  error={formik.touched.gstnumber && Boolean(formik.errors.gstnumber)}
                  helperText={formik.touched.gstnumber && formik.errors.gstnumber}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" onClick={formik.handleSubmit} style={{ textTransform: 'capitalize' }} color="secondary" disable={loading}>
          {loading ? t('Saving...') : t('Save')} 
          </Button>
          <Button
            type="button"
            variant="outlined"
            style={{ textTransform: 'capitalize' }}
            onClick={() => {
              formik.resetForm();
              handleClose();
            }}
            color="error"
          >
            {t('Cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

AddCompany.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default AddCompany;
