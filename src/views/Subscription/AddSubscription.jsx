/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import * as React from 'react';
import { useState, useCallback } from 'react';
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
import { postApi } from '@/core/apis/api';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { urls } from '@/core/Constant/urls';
import { useTranslation } from 'react-i18next';
import { tokenPayload } from '@/helper';

const AddSubscriptions = ({ open, handleClose }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const payload = tokenPayload();

  const initialValues = {
    title: '',
    noOfDays: '',
    amount: '',
    discount: '',
    discription: ''
  };

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

  const AddSubscription = async (values, resetForm) => {
    setLoading(true);
    values.companyId = payload.companyId;
    try {
      const response = await postApi(urls.Subscribe.create, values);
      if (response.success) {
        toast.success(t('Successfully registered'));
        resetForm();
        handleClose();
      }
    } catch (err) {
      console.error(err);
      toast.error(t('Something went wrong!'));
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      AddSubscription(values, resetForm);
    }
  });

  return (
    <Dialog open={open} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
      <DialogTitle
        id="scroll-dialog-title"
        sx={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Typography variant="h6">{t('Add Subscription')}</Typography>
        <ClearIcon onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Title')}</FormLabel>
              <TextField
                id="title"
                name="title"
                size="small"
                fullWidth
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Number of Days')}</FormLabel>
              <TextField
                id="noOfDays"
                name="noOfDays"
                size="small"
                type="number"
                fullWidth
                value={formik.values.noOfDays}
                onChange={formik.handleChange}
                error={formik.touched.noOfDays && Boolean(formik.errors.noOfDays)}
                helperText={formik.touched.noOfDays && formik.errors.noOfDays}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Amount')}</FormLabel>
              <TextField
                id="amount"
                name="amount"
                size="small"
                type="number"
                fullWidth
                value={formik.values.amount}
                onChange={formik.handleChange}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Discount (%)')}</FormLabel>
              <TextField
                id="discount"
                name="discount"
                size="small"
                type="number"
                fullWidth
                value={formik.values.discount}
                onChange={formik.handleChange}
                error={formik.touched.discount && Boolean(formik.errors.discount)}
                helperText={formik.touched.discount && formik.errors.discount}
              />
            </Grid>

            <Grid item xs={12}>
              <FormLabel>{t('Description')}</FormLabel>
              <TextField
                id="discription"
                name="discription"
                size="small"
                fullWidth
                multiline
                rows={3}
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
          type="submit"
          variant="contained"
          onClick={formik.handleSubmit}
          style={{ textTransform: 'capitalize' }}
          color="secondary"
          disabled={loading}
        >
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
  );
};

AddSubscriptions.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default AddSubscriptions;
