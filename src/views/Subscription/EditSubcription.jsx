/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Grid,
  TextField,
  FormLabel
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { updateApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { useTranslation } from 'react-i18next';
import { tokenPayload } from '@/helper';

const EditSubscription = ({ open, handleClose, data }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const payload = tokenPayload();

  const validationSchema = yup.object({
    title: yup
      .string()
      .max(50, t('Title cannot exceed 50 characters'))
      .matches(/^[a-zA-Z0-9\s]*$/, t('Title cannot contain special characters'))
      .required(t('Title is required')),
    noOfDays: yup
      .number()
      .typeError(t('Number of days must be a number'))
      .positive(t('Number of days must be positive'))
      .integer(t('Number of days must be an integer'))
      .required(t('Number of days is required')),
    amount: yup
      .number()
      .typeError(t('Amount must be a number'))
      .positive(t('Amount must be positive'))
      .required(t('Amount is required')),
    discount: yup
      .number()
      .typeError(t('Discount must be a number'))
      .min(0, t('Discount cannot be negative'))
      .max(100, t('Discount cannot exceed 100'))
      .required(t('Discount is required')),
    discription: yup
      .string()
      .max(200, t('Description cannot exceed 200 characters'))
      .required(t('Description is required'))
  });

  const initialValues = {
    title: data?.title || '',
    noOfDays: data?.noOfDays || '',
    amount: data?.amount || '',
    discount: data?.discount || '',
    discription: data?.discription || ''
  };

  const handleSubmit = async (values, resetForm) => {
    setLoading(true);
    try {
      const response = await updateApi(urls.Subscribe.edit, { ...values, companyId: payload.companyId }, { id: data._id });
      if (response.success) {
        toast.success(t('Subscription updated successfully'));
        resetForm();
        handleClose();
      } else {
        toast.error(t('Failed to update subscription'));
      }
    } catch (error) {
      console.error(error);
      toast.error(t('Something went wrong!'));
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      await handleSubmit(values, resetForm);
    }
  });

  return (
    <Dialog open={open} aria-labelledby="scroll-dialog-title" fullWidth maxWidth="md">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">{t('Edit Subscription')}</Typography>
        <ClearIcon onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Title')}</FormLabel>
              <TextField
                name="title"
                fullWidth
                size="small"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Number of Days')}</FormLabel>
              <TextField
                name="noOfDays"
                type="number"
                fullWidth
                size="small"
                value={formik.values.noOfDays}
                onChange={formik.handleChange}
                error={formik.touched.noOfDays && Boolean(formik.errors.noOfDays)}
                helperText={formik.touched.noOfDays && formik.errors.noOfDays}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Amount')}</FormLabel>
              <TextField
                name="amount"
                type="number"
                fullWidth
                size="small"
                value={formik.values.amount}
                onChange={formik.handleChange}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Discount (%)')}</FormLabel>
              <TextField
                name="discount"
                type="number"
                fullWidth
                size="small"
                value={formik.values.discount}
                onChange={formik.handleChange}
                error={formik.touched.discount && Boolean(formik.errors.discount)}
                helperText={formik.touched.discount && formik.errors.discount}
              />
            </Grid>

            <Grid item xs={12}>
              <FormLabel>{t('Description')}</FormLabel>
              <TextField
                name="discription"
                multiline
                rows={3}
                fullWidth
                size="small"
                value={formik.values.discription}
                onChange={formik.handleChange}
                error={formik.touched.discription && Boolean(formik.errors.discription)}
                helperText={formik.touched.discription && formik.errors.discription}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={formik.handleSubmit}
          variant="contained"
          color="secondary"
          disabled={loading}
          style={{ textTransform: 'capitalize' }}
        >
          {loading ? t('Saving...') : t('Save')}
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            formik.resetForm();
            handleClose();
          }}
          color="error"
          style={{ textTransform: 'capitalize' }}
        >
          {t('Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditSubscription.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

export default EditSubscription;
