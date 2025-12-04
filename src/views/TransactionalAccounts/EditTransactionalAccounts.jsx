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
import { updateApi } from '@/core/apis/api';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { urls } from '@/core/Constant/urls';
import { tokenPayload } from '@/helper';

const EditTransactionalAccounts = ({ open, handleClose, data }) => {
  const { t } = useTranslation();
  const payload = tokenPayload();
  const [loading, setLoading] = useState(false);

  const EditTransactionalAccounts = async (values, resetForm) => {
    setLoading(true);
    try {
      const updatedValues = { ...values, companyId: payload._id };
      const response = await updateApi(urls.transactionalAccounts.updateTransactionalAccounts, updatedValues, { id: data._id });

      if (response.success) {
        toast.success(t('Transactional Account updated successfully!'));
        resetForm();
        handleClose();
      }
    } catch (error) {
      console.error('Error updating Transactional Account:', error);
      toast.error(t('An unexpected error occurred!'));
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = yup.object({
    accountName: yup
      .string()
      .max(30, t('Account Name cannot exceed 30 characters'))
      .required(t('Account Name is required')),
    accountNumber: yup
      .string()
      .max(30, t('Account Number cannot exceed 30 characters')),
    details: yup
      .string()
      .max(200, t('Details cannot exceed 200 characters')),
  });

  const formik = useFormik({
    initialValues: {
      accountName: data?.accountName || '',
      accountNumber: data?.accountNumber || '',
      details: data?.details || '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      await EditTransactionalAccounts(values, resetForm);
    },
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="edit-property-dialog-title"
      aria-describedby="edit-property-dialog-description"
    >
      <DialogTitle id="edit-property-dialog-title">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">{t('Edit Transactional Account')}</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </div>
      </DialogTitle>
      <DialogContent dividers id="edit-property-dialog-description">
        <form onSubmit={formik.handleSubmit}>
          <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
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

EditTransactionalAccounts.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

export default EditTransactionalAccounts;