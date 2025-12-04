/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Rating,
  Select,
  TextField
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
// import { useState,useEffect } from 'react';
// import { apiget, apipost } from '../../service/api';
import Palette from '../../ui-component/ThemePalette';
import { useTranslation } from 'react-i18next';

const AddUnits = (props) => {
  const { t } = useTranslation();
  const { open, handleClose } = props;
  
  // -----------  validationSchema
  const validationSchema = yup.object({
    unitNo: yup.string().required(t('Unit No is required')),
    type: yup.string().required(t('Unit Type is required')),
    rentamount: yup.number().required(t('Rent Amount is required')),
    status: yup.string().required(t('Status is required')),
    tenants: yup.string().required(t('Tenants are required')),
    building: yup.string().required(t('Building Name is required')),
    discription: yup.string().required(t('Description is required'))
  });

  // -----------   initialValues
  const initialValues = {
    unitNo: '',
    type: '',
    rentamount: '',
    status: '',
    tenants: '',
    building: '',
    discription: ''
  };

  // formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      console.log('Unit Values:', values);
      handleClose();
      toast.success(t('Unit added successfully'));
    }
  });

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">{t('Add New')}</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <form>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <Typography style={{ marginBottom: '15px' }} variant="h6">
                {t('Unit Information')}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>{t('Unit No')}</FormLabel>
                  <TextField
                    id="unitNo"
                    name="unitNo"
                    size="small"
                    fullWidth
                    value={formik.values.unitNo}
                    onChange={formik.handleChange}
                    error={formik.touched.unitNo && Boolean(formik.errors.unitNo)}
                    helperText={formik.touched.unitNo && formik.errors.unitNo}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>{t('Type')}</FormLabel>
                  <TextField
                    id="type"
                    name="type"
                    size="small"
                    fullWidth
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    error={formik.touched.type && Boolean(formik.errors.type)}
                    helperText={formik.touched.type && formik.errors.type}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <FormLabel>{t('Rent Amount')}</FormLabel>
                  <TextField
                    id="rentamount"
                    name="rentamount"
                    type="number"
                    size="small"
                    fullWidth
                    value={formik.values.rentamount}
                    onChange={formik.handleChange}
                    error={formik.touched.rentamount && Boolean(formik.errors.rentamount)}
                    helperText={formik.touched.rentamount && formik.errors.rentamount}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>{t('Status')}</FormLabel>
                  <TextField
                    id="status"
                    name="status"
                    size="small"
                    fullWidth
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    error={formik.touched.status && Boolean(formik.errors.status)}
                    helperText={formik.touched.status && formik.errors.status}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>{t('Tenants')}</FormLabel>
                  <TextField
                    id="tenants"
                    name="tenants"
                    size="small"
                    fullWidth
                    value={formik.values.tenants}
                    onChange={formik.handleChange}
                    error={formik.touched.tenants && Boolean(formik.errors.tenants)}
                    helperText={formik.touched.tenants && formik.errors.tenants}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>{t('Building Name')}</FormLabel>
                  <TextField
                    id="building"
                    name="building"
                    size="small"
                    fullWidth
                    value={formik.values.building}
                    onChange={formik.handleChange}
                    error={formik.touched.building && Boolean(formik.errors.building)}
                    helperText={formik.touched.building && formik.errors.building}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>{t('Description')}</FormLabel>
                  <TextField
                    id="discription"
                    name="discription"
                    size="small"
                    fullWidth
                    value={formik.values.discription}
                    onChange={formik.handleChange}
                    error={formik.touched.discription && Boolean(formik.errors.discription)}
                    helperText={formik.touched.discription && formik.errors.discription}
                  />
                </Grid>
              </Grid>
            </DialogContentText>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={formik.handleSubmit} variant="contained" color="primary" type="submit">
            {t('Save')}
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
    </div>
  );
};

export default AddUnits;
