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

const AddPropertyTypes = ({ open, handleClose }) => {
  const { t } = useTranslation();
  const payload = tokenPayload();
  const [loading, setIsLoading] = useState(false); 

const AddPropertyTypes = async (values, resetForm) => {
  setIsLoading(true);
  try {
    values.companyId = payload._id;
    const response = await postApi(urls.propertyTypes.create, values);

    if (response.success) {
      toast.success(t('Successfully registered property type!'));
      handleClose();
      resetForm();
    }
  } catch (error) {
    console.error('Error in AddPropertyTypes:', error);
    toast.error(t('Failed to register property type!'));
  } finally {
    handleClose();
    resetForm();
    setIsLoading(false); 
  }
};
  
  const validationSchema = yup.object({
    name: yup
      .string()
      .max(30, t('Property Name must be at most 30 characters'))
      .required(t('Property Name is required')),
    description: yup
      .string()
      .max(200, t('Description must be at most 200 characters'))
  });

  const initialValues = {
    name: '',
    description: ''
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const finalValues = {
        ...values,
        description: !values.description || values.description.trim() === ""
        ? "No description available"
        : values.description
      }
      AddPropertyTypes(finalValues, resetForm);
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
        <Typography variant="h6">{t('Add Property Types')}</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          {/* <Typography variant="h6" style={{ marginBottom: '15px' }}>
            {t('Property Types')}
          </Typography> */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Name')}</FormLabel>
              <TextField
                id="name"
                name="name"
                size="small"
                fullWidth
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Description')}</FormLabel>
              <TextField
                id="description"
                name="description"
                size="small"
                placeholder='No Description Available'
                fullWidth
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
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

AddPropertyTypes.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default AddPropertyTypes;
