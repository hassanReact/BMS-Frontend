/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  Button,
  Dialog,
  FormLabel,
  Grid,
  TextField,
  Typography,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { updateApi, getApi } from '@/core/apis/api';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { urls } from '@/core/Constant/urls';
import { tokenPayload } from '@/helper';
import currencyCodes from 'currency-codes';

const EditCompany = ({ open, handleClose, data }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const payload = tokenPayload();

  const currencyOptions = currencyCodes.data.map((currency) => ({
    code: currency.code,
    name: currency.currency,
  }));

  const validationSchema = yup.object({
    companyName: yup
      .string()
      .matches(/^[A-Za-z\s]+$/, t('Company Name can only contain letters and spaces'))
      .max(50, t('Company Name cannot exceed 50 characters'))
      .required(t('Company Name is required')),
    email: yup.string().email(t('Invalid email address')).required(t('Email is required')),
    phoneNo: yup
      .string()
      .matches(/^[0-9]{10}$/, t('Phone Number must be exactly 10 digits'))
      .required(t('Phone Number is required')),
    address: yup
      .string()
      .max(80, t('Address cannot exceed 80 characters'))
      .required(t('Address is required')),
    currencyCode: yup.string().required(t('Currency is required')),
    gstnumber: yup.string().max(15, t('GST number cannot exceed 15 characters')),
  });

  const formik = useFormik({
    initialValues: {
      companyName: data?.companyName || '',
      email: data?.email || '',
      phoneNo: data?.phoneNo || '',
      address: data?.address || '',
      currencyCode: data?.currencyCode || '',
      gstnumber: data?.gstnumber || '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const response = await updateApi(urls.company.edit, values, { id: data._id });
        if (response.success) {
          toast.success(t('Company updated successfully'));
          resetForm();
          handleClose();
        } else {
          toast.error(t('Update failed'));
        }
      } catch (err) {
        console.error('Error updating company:', err);
        toast.error(t('Something went wrong'));
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{t('Edit Company')}</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
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
                size="small"
                type="number"
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
              <FormLabel>{t('Currency')}</FormLabel>
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
                  {t('Select Currency')}
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
        <Button
          onClick={formik.handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? t('Saving...') : t('Save')}
        </Button>
        <Button
          onClick={() => {
            formik.resetForm();
            handleClose();
          }}
          variant="outlined"
          color="error"
        >
          {t('Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditCompany.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    _id: PropTypes.string,
    companyName: PropTypes.string,
    email: PropTypes.string,
    phoneNo: PropTypes.string,
    address: PropTypes.string,
    currencyCode: PropTypes.string,
    gstnumber: PropTypes.string,
  }).isRequired,
};

export default EditCompany;
