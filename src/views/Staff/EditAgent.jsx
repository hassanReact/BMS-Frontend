/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
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

const EditAgent = ({ open, handleClose, data }) => {
  const { t } = useTranslation();
  const [loading , setIsLoading] = useState(false);

  const payload = tokenPayload();

  useEffect(() => {
    if (open) {
      fetchOwnerData();
    }
  }, [open]);

  const fetchOwnerData = async () => {
    try {
      const response = await getApi(urls.owner.ownerdata, { id: payload._id });
    } catch (err) {
      console.error('Error fetching owner data:', err);
      toast.error(t('Failed to fetch owner data!'));
    }
  };

  const editAgent = async (values, resetForm) => {
    setIsLoading(true);
    const updatedValues = { ...values, companyId: payload._id };

    try {
      const response = await updateApi(urls.agent.edit, updatedValues, { id: data._id });

      if (response.success) {
    
        toast.success(t('Agent updated successfully!'));
        handleClose();
        resetForm();
      }
    } catch (error) {
      console.error('Error in AddPropertyTypes:', error);
      toast.error(t('Failed to update agent!'));
    } finally {
      handleClose();
      resetForm();
      setIsLoading(false); 
    }
  };

  const validationSchema = yup.object({
    agentName: yup.string()
    .matches(/^[A-Za-z\s]*$/, t('Agent Name cannot contain special characters or numbers'))
    .max(50, t('Agent Name cannot exceed 50 characters'))
    .required(t('Agent Name is required')),  
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
      agentName: data?.agentName || '',
      email: data?.email || '',
      phoneNo: data?.phoneNo || '',
      address: data?.address || '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      editAgent(values, resetForm);
    },
  });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">{t('Edit Agent')}</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Agent Name')}</FormLabel>
              <TextField
                id="agentName"
                name="agentName"
                size="small"
                fullWidth
                value={formik.values.agentName}
                onChange={formik.handleChange}
                error={formik.touched.agentName && Boolean(formik.errors.agentName)}
                helperText={formik.touched.agentName && formik.errors.agentName}
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
                type="number"
                size="small"
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

EditAgent.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default EditAgent;
