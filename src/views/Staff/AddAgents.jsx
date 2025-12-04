<<<<<<<< HEAD:src/views/Staff/AddAgents.jsx
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { FormLabel, Grid, TextField } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import { postApi } from '@/core/apis/api';
import { useState } from 'react';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { tokenPayload } from '@/helper';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { urls } from '@/core/Constant/urls';
import { useCallback } from 'react';
import { debounce } from 'lodash';

const AddAgents = (props) => {
  const { t } = useTranslation();
  const [loading, setIsLoading] = useState(false);
  const { open, handleClose } = props;

  const payload = tokenPayload();

  const AddAgent = async (values, resetForm) => {
    setIsLoading(true);
    // const startTime = Date.now();
    values.companyId = payload._id;
    try {
      const response = await postApi(urls.agent.create, values);
      if (response.data.success) {
        toast.success(t('Successfully registered Agent'));
        handleClose();
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      toast.error(t('Registration failed'));
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
      email: yup.string().email(t('Invalid email address')).required(t('Email is required')),
    phoneNo: yup
      .string()
      .matches(/^[0-9]{10}$/, t('Phone Number must be exactly 10 digits'))
      .required(t('Phone Number is required')),
    address: yup.string().max(80, t('Address cannot exceed 80 characters')).required(t('Address is required')),
    password: yup.string().max(6, t('Password cannot exceed 6 characters')).required(t('Password is required'))
  });

  const initialValues = {
    agentName: '',
    email: '',
    phoneNo: '',
    address: '',
    password: ''
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      AddAgent(values, resetForm);
    }
  });

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="scroll-dialog-title">
      <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">{t('Create Agent')}</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
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
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Password')}</FormLabel>
              <TextField
                id="password"
                name="password"
                type="password"
                size="small"
                fullWidth
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
          </Grid>
          <DialogActions>
            <Button type="submit" variant="contained" disabled={loading} color="secondary">
            {loading ? t('Saving...') : t('Save')} 
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => {
                formik.resetForm();
                handleClose();
              }}
              color="error"
            >
              {t('Cancel')}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

AddAgents.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default AddAgents;
========
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import * as React from 'react';
import {
  Button, Dialog, FormLabel, Grid, TextField, Typography,
  DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { MenuItem } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { postApi } from '@/core/apis/api';
import { useState } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { tokenPayload } from '@/helper';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { urls } from '@/core/Constant/urls';

const AddStaffs = ({ open, handleClose }) => {
  const { t } = useTranslation();
  const [loading, setIsLoading] = useState(false);
  const payload = tokenPayload();

  const Addstaff = async (values, resetForm) => {
    setIsLoading(true);
    values.companyId = payload._id;
    try {
      const response = await postApi(urls.staff.create, values);
      if (response.success) {
        toast.success(t('Successfully registered staff'));
        resetForm();
        handleClose();
      }
    } catch (err) {
      console.error(err);
      toast.error(t('Registration failed'));
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
      .matches(/^[0-9]{10}$/, t('Phone Number must be exactly 10 digits'))
      .required(t('Phone Number is required')),
    cnic: yup
      .string()
      .matches(/^\d{5}-\d{7}-\d{1}$/, t('CNIC must be in xxxxx-xxxxxxx-x format'))
      .required(t('CNIC is required')),
    address: yup.string().max(80, t('Address cannot exceed 80 characters')).required(t('Address is required')),
    password: yup.string().max(6, t('Password cannot exceed 6 characters')).required(t('Password is required')),
    designation: yup.string().max(50, t('Designation cannot exceed 50 characters')).required(t('Designation is required')),
    salary: yup.number().typeError(t('Salary must be a number')).min(0, t('Salary must be non-negative')).required(t('Salary is required')),
  });

  const initialValues = {
    staffName: '',
    email: '',
    phoneNo: '',
    cnic: '',
    address: '',
    password: '',
    designation: '',
    salary: ''
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      Addstaff(values, resetForm);
    }
  });

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="scroll-dialog-title">
      <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">{t('Create Staff')}</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
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
                size="small"
                fullWidth
                type="number"
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
              <FormLabel>{t('Password')}</FormLabel>
              <TextField
                id="password"
                name="password"
                type="password"
                size="small"
                fullWidth
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
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

          <DialogActions>
            <Button type="submit" variant="contained" disabled={loading} color="secondary">
              {loading ? t('Saving...') : t('Save')}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => {
                formik.resetForm();
                handleClose();
              }}
              color="error"
            >
              {t('Cancel')}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

AddStaffs.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default AddStaffs;
>>>>>>>> d9b2da8ff556c2c70aa8c310fb13232da691f214:src/views/Staff/AddStaff.js
