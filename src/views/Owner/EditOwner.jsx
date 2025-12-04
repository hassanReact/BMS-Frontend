/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  MenuItem,
  Select,
  Button,
  Dialog,
  FormControl,
  FormLabel,
  Grid,
  TextField,
  Typography,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { useCallback } from 'react';
import { debounce, throttle } from 'lodash';

const EditOwner = ({ open, handleClose, data }) => {
  const { t } = useTranslation();
  const [ownerName, setOwnerData] = useState([]);
  const [loading, setIsLoading] = useState(false);

  const payload = tokenPayload();

  useEffect(() => {
    if (open) {
      fetchOwnerData();
    }
  }, [open]);

  const fetchOwnerData = async () => {
    try {
      const response = await getApi(urls.owner.ownerdata, { id: payload.companyId });
      setOwnerData(response.data);
    } catch (err) {
      console.error('Error fetching owner data:', err);
      toast.error(t('Failed to fetch owner data!'));
    }
  };

  const editProperty = async (values, resetForm) => {
    setIsLoading(true);
    // const startTime = Date.now();
    const updatedValues = { ...values, companyId: payload._id };

    try {
      const response = await updateApi(urls.owner.edit, updatedValues, { id: data._id });

      if (response.success) {
        toast.success(t('Owner updated successfully!'));
        handleClose();
        resetForm();
      }
    } catch (err) {
      console.error('Error updating property:', err);
      toast.error(t('Something went wrong!'));
    } finally {
      handleClose();
      resetForm();
      setIsLoading(false);
    }
  };

  const validationSchema = yup.object({
    ownerName: yup
      .string()
      .max(50, t('Owner Name cannot exceed 50 characters'))
      .required(t('Owner Name is required')),
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
  });

  const formik = useFormik({
    initialValues: {
      ownerName: data?.ownerName || '',
      email: data?.email || '',
      phoneNo: data?.phoneNo || '',
      address: data?.address || '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      editProperty(values, resetForm);
    },
  });

  // const throttledSubmit = useCallback(debounce(formik.handleSubmit, 500), [formik.handleSubmit]);



  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">{t('Edit Owner')}</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Owner Name')}</FormLabel>
              <TextField
                id="ownerName"
                name="ownerName"
                size="small"
                fullWidth
                value={formik.values.ownerName}
                onChange={formik.handleChange}
                error={formik.touched.ownerName && Boolean(formik.errors.ownerName)}
                helperText={formik.touched.ownerName && formik.errors.ownerName}
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
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 10 && /^[0-9]*$/.test(value)) {
                    formik.handleChange(e);
                  }
                }}
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
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={formik.handleSubmit}
          variant="contained"
          color="primary"
          type="submit"
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

EditOwner.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default EditOwner;
