/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  MenuItem,
  Select,
  Button,
  Dialog,
  FormControl,
  FormLabel,
  Grid,
  Chip,
  TextField,
  Typography,
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText
} from '@mui/material';

import ClearIcon from '@mui/icons-material/Clear';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { updateApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { useState } from 'react';
import { useCallback } from 'react';
import { throttle } from 'lodash';
import { tokenPayload } from '@/helper';



const EditTenant = ({ open, handleClose, data }) => {
  const { t } = useTranslation();
  const payload = tokenPayload();
    const [attachments, setAttachments] = useState([]);
    const [loading , setIsLoading] = useState(false);
      
  
  // const company = JSON.parse(localStorage.getItem('companyData'));

  const updateTenant = async (values, resetForm) => {
    setIsLoading(true);
    const updatedValues = {
      ...values,
      companyId: payload?.companyId,
      reporterId: payload?._id,
    };
    try {
      // const queryParams = { id: data?._id };
      const response = await updateApi(urls.tenant.editdata, updatedValues, {id: data?._id });

      if (response.success) {
  
        // toast.success(t('Resident updated successfully!'));
        toast.success(t('Tenant updated successfully!'));

        handleClose()
        resetForm()
      }
    } catch (err) {
      console.error('Error updating tenant:', err);
      // console.error('Error updating resident:', err);

      toast.error(t('Something went wrong!'));
    } finally {
      handleClose();
      resetForm()
      setIsLoading(false); 
    }
  };

   const validationSchema = yup.object({
    tenantName: yup
  .string()
  .max(50, t('Tenant Name must be at most 50 characters'))
  .matches(/^[A-Za-z\s]*$/, t('Tenant Name cannot contain numbers or special characters'))
  .required(t('Tenant Name is required')),
  // .max(50, t('Resident Name must be at most 50 characters'))
  // .matches(/^[A-Za-z\s]*$/, t('Resident Name cannot contain numbers or special characters'))
  // .required(t('Resident Name is required')),
      email: yup.string().email(t('Invalid email')).required(t('Email is required')),
      // password: yup.string().required(t('Password is required')),
      phoneno: yup
        .string()
        //.matches(/^[0-9]{10}$/, t('Phone number must be 10 digits'))
        .required(t('Phone number is required')),
      identityCardType: yup.string().required(t('Identity Card Type is required')),
      identityNo: yup.string() .max(12, t('Identity No. should be smaller than 14 characters')).required(t('Identity Number is required')),
      identityImage: yup.mixed().nullable(),
      // emergencyNo: yup
      //   .string()
      //   .matches(/^[0-9]{10}$/, t('Emergency number must be 10 digits'))
      //   .required(t('Emergency number is required')),
      address: yup
        .string()
        .max(100, t('Address must be at most 100 characters'))
        .required(t('Address is required')),
    });

  const formik = useFormik({
    initialValues: {
      tenantName: data?.tenantName || '',
      email: data?.email || '',
      phoneno: data?.phoneno || '',
      identityCardType: data?.identityCardType || '',
      identityNo: data?.identityNo || '',
      identityImage: null,
      // emergencyNo: data?.emergencyNo || '',
      address: data?.address || '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      updateTenant(values, resetForm);
    },
  });

  
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length) {
      setAttachments((prev) => [...prev, ...files]);
    }
  };

  const handleFileRemove = (fileName) => {
    setAttachments((prev) => prev.filter((file) => file.name !== fileName));
  };
  // const throttledSubmit = useCallback(throttle(formik.handleSubmit, 4000), [formik.handleSubmit]);
  

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/*<Typography variant="h6">{t('EditTenant')}</Typography>*/}
        <Typography variant="h6">{t('Edit Resident')}</Typography>

        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>
     <DialogContent dividers>
     <form onSubmit={formik.handleSubmit}>
          <Typography variant="h6" style={{ marginBottom: '15px' }}>
            {t('Tenant Information')}
            {/* {t('Resident Information')} */}

          </Typography>
          <Grid container spacing={3}>
            {/* Tenant Name */}
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Tenant Name')}</FormLabel>
              {/* <FormLabel>{t('Resident Name')}</FormLabel> */}

              <TextField
                id="tenantName"
                name="tenantName"
                size="small"
                fullWidth
                value={formik.values.tenantName}
                onChange={formik.handleChange}
                error={formik.touched.tenantName && Boolean(formik.errors.tenantName)}
                helperText={formik.touched.tenantName && formik.errors.tenantName}
                required
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Email')}</FormLabel>
              <TextField
                id="email"
                name="email"
                type="email"
                size="small"
                fullWidth
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                required
              />
            </Grid>

            {/* Phone Number */}
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Phone Number')}</FormLabel>
              <TextField
                id="phoneno"
                name="phoneno"
                type="number"
                size="small"
                fullWidth
                value={formik.values.phoneno}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 10 && /^[0-9]*$/.test(value)) {
                    formik.handleChange(e);
                  }
                }}
                error={formik.touched.phoneno && Boolean(formik.errors.phoneno)}
                helperText={formik.touched.phoneno && formik.errors.phoneno}
                required
              />
            </Grid>

            {/* Identity Card Type */}
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Identity Card Type')}</FormLabel>
              <FormControl fullWidth size="small" error={formik.touched.identityCardType && Boolean(formik.errors.identityCardType)}>
                <Select
                  id="identityCardType"
                  name="identityCardType"
                  value={formik.values.identityCardType}
                  onChange={formik.handleChange}
                  required
                >
                  <MenuItem value="" disabled>
                    {t('Select Identity Card Type')}
                  </MenuItem>
                  {/*<MenuItem value="Aadhar">{t('Aadhar')}</MenuItem>*/}
                  <MenuItem value="Aadhar">{t('CNIC')}</MenuItem>

                  <MenuItem value="Passport">{t('Passport')}</MenuItem>
                  {/*<MenuItem value="DriverLicense">{t('Driver License')}</MenuItem>*/}
                </Select>
                {formik.touched.identityCardType && formik.errors.identityCardType && (
                  <FormHelperText>{formik.errors.identityCardType}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Identity Number */}
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Identity Number')}</FormLabel>
              <TextField
                id="identityNo"
                name="identityNo"
                size="small"
                fullWidth
                value={formik.values.identityNo}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 15 && /^[0-9]*$/.test(value)) {
                    formik.handleChange(e);
                  }
                }}
                error={formik.touched.identityNo && Boolean(formik.errors.identityNo)}
                helperText={formik.touched.identityNo && formik.errors.identityNo}
                required
              />
            </Grid>

         

            {/* Address */}
            <Grid item xs={12}>
              <FormLabel>{t('Address')}</FormLabel>
              <TextField
                id="address"
                name="address"
                multiline
                rows={4}
                size="small"
                fullWidth
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                required
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={formik.handleSubmit} variant="contained" color="primary"  type="submit"  disabled={loading}>
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

EditTenant.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default EditTenant;
