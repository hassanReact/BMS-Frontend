/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
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
import { postApi } from '@/core/apis/api';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { urls } from '@/core/Constant/urls';
import { tokenPayload } from '@/helper';

const AddTransactionalAccounts = ({ open, handleClose }) => {
  const { t } = useTranslation();
  const payload = tokenPayload();
  const [loading, setIsLoading] = useState(false); 

const AddTransactionalAccounts = async (values, resetForm) => {
  setIsLoading(true);
  try {
    values.companyId = payload._id;
    const response = await postApi(urls.transactionalAccounts.create, values);

    if (response.success) {
      toast.success(t('Successfully registered transactional Account!'));
      handleClose();
      resetForm();
    }
  } catch (error) {
    console.error('Error in TransactionalAccounts:', error);
    toast.error(t('Failed to register Transactional Account!'));
  } finally {
    handleClose();
    resetForm();
    setIsLoading(false); 
  }
};
  
  const validationSchema = yup.object({
    accountName: yup
      .string()
      .max(30, t('Account Name must be at most 30 characters'))
      .required(t('Account Name is required')),
    accountNumber: yup
      .string()
      .max(30, t('Account Name must be at most 36 characters')),  
    // details: yup
    //   .string()
    //   .max(200, t('Description must be at most 200 characters'))
  });

  const initialValues = {
    accountName: '',
    accountNumber: '',
    details: ''
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const finalValues = {
        ...values,
        details: !values.details || values.details === ""
        ? "No description available"
        : values.details
      }
      AddTransactionalAccounts(finalValues, resetForm);
    },
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        id="scroll-dialog-title"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">{t('Add Transactional Account')}</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Typography variant="h6" style={{ marginBottom: '15px' }}>
            {t('Transactional Accounts')}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Account Name')}</FormLabel>
              <TextField
                id="accountName"
                name="accountName"
                size="small"
                fullWidth
                value={formik.values.accountName}
                onChange={formik.handleChange}
                error={formik.touched.accountName && Boolean(formik.errors.accountName)}
                helperText={formik.touched.accountName && formik.errors.accountName}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Account Number')}</FormLabel>
              <TextField
                id="accountNumber"
                name="accountNumber"
                size="small"
                fullWidth
                value={formik.values.accountNumber}
                onChange={formik.handleChange}
                error={formik.touched.accountNumber && Boolean(formik.errors.accountNumber)}
                helperText={formik.touched.accountNumber && formik.errors.accountNumber}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Details')}</FormLabel>
              <TextField
                id="details"
                name="details"
                size="small"
                fullWidth
                value={formik.values.details}
                onChange={formik.handleChange}
                error={formik.touched.details && Boolean(formik.errors.details)}
                helperText={formik.touched.details && formik.errors.details}
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

AddTransactionalAccounts.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default AddTransactionalAccounts;