/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Button, Dialog, FormLabel, Grid, TextField, Typography,
  DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { MenuItem } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { updateApi } from '@/core/apis/api';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { urls } from '@/core/Constant/urls';
import { tokenPayload } from '@/helper';

const EditStaff = ({ open, handleClose, data }) => {
  const { t } = useTranslation();
  const [loading, setIsLoading] = useState(false);
  const payload = tokenPayload();

  const editStaff = async (values, resetForm) => {
    setIsLoading(true);
    const updatedValues = { ...values, companyId: payload._id };

    try {
      const response = await updateApi(urls.staff.edit, updatedValues, { id: data._id });

      if (response.success) {
        toast.success(t('Staff updated successfully!'));
        handleClose();
        resetForm();
      }
    } catch (error) {
      console.error('Error updating staff:', error);
      toast.error(t('Failed to update staff!'));
    } finally {
      setIsLoading(false);
    }
  };

  const validationSchema = yup.object({
    staffName: yup
      .string()
      .matches(/^[A-Za-z\s]*$/, t('Staff name cannot contain special characters or numbers'))
      .max(50, t('Staff name cannot exceed 50 characters'))
      .required(t('Staff name is required')),
    email: yup.string().email(t('Invalid email address')).required(t('Email is required')),
    phoneNo: yup
      .string()
      .matches(/^[0-9]{10}$/, t('Phone number must be exactly 10 digits'))
      .required(t('Phone number is required')),
    cnic: yup
      .string()
      .matches(/^\d{5}-\d{7}-\d{1}$/, t('CNIC must be in xxxxx-xxxxxxx-x format'))
      .required(t('CNIC is required')),
    address: yup.string().max(80, t('Address cannot exceed 80 characters')).required(t('Address is required')),
    designation: yup.string().max(50, t('Designation cannot exceed 50 characters')).required(t('Designation is required')),
    salary: yup.number().typeError(t('Salary must be a number')).min(0, t('Salary must be non-negative')).required(t('Salary is required')),
  });

  const formik = useFormik({
    initialValues: {
      staffName: data?.staffName || '',
      email: data?.email || '',
      phoneNo: data?.phoneNo || '',
      cnic: data?.cnic || '',
      address: data?.address || '',
      designation: data?.designation || '',
      salary: data?.Salary || '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      editStaff(values, resetForm);
    },
  });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">{t('Edit Staff')}</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </div>
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Staff Name')}</FormLabel>
              <TextField
                id="staffName"
                name="staffName"
                size="small"
                fullWidth
                value={formik.values.staffName}
                onChange={formik.handleChange}
                error={formik.touched.staffName && Boolean(formik.errors.staffName)}
                helperText={formik.touched.staffName && formik.errors.staffName}
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
                    formik.setFieldValue("phoneNo", value);
                  }
                }}
                error={formik.touched.phoneNo && Boolean(formik.errors.phoneNo)}
                helperText={formik.touched.phoneNo && formik.errors.phoneNo}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('CNIC')}</FormLabel>
              <TextField
                id="cnic"
                name="cnic"
                size="small"
                fullWidth
                value={formik.values.cnic}
                onChange={formik.handleChange}
                error={formik.touched.cnic && Boolean(formik.errors.cnic)}
                helperText={formik.touched.cnic && formik.errors.cnic}
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
              <FormLabel>{t('Designation')}</FormLabel>
              <TextField
                id="designation"
                name="designation"
                select
                size="small"
                fullWidth
                value={formik.values.designation}
                onChange={formik.handleChange}
                error={formik.touched.designation && Boolean(formik.errors.designation)}
                helperText={formik.touched.designation && formik.errors.designation}
              >
                {[
                  'Electrician',
                  'Plumber',
                  'Sweeper',
                  'Carpenter',
                  'Security Guard',
                  'Mason',
                  'Receptionist',
                  'CCTV Operator',
                ].map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>

            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Salary')}</FormLabel>
              <TextField
                id="salary"
                name="salary"
                size="small"
                type="number"
                fullWidth
                value={formik.values.salary}
                onChange={formik.handleChange}
                error={formik.touched.salary && Boolean(formik.errors.salary)}
                helperText={formik.touched.salary && formik.errors.salary}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={formik.handleSubmit} variant="contained" color="primary" disabled={loading}>
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

EditStaff.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default EditStaff;
