/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import { updateApi, getApi } from '@/core/apis/api';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { FormLabel } from '@mui/material';
import { toast } from 'react-toastify';
import { urls } from '@/core/Constant/urls';
import { useTranslation } from 'react-i18next';
import { tokenPayload } from '@/helper';
import { useCallback } from 'react';
import { debounce } from 'lodash';
import { useState, useEffect } from 'react';
import InputAdornment from '@mui/material/InputAdornment';


const EditServiceProvider = ({ open, handleClose, data }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState();
  
    const fetchCurrencyData = async () => {
      const response = await getApi(urls.company.getCompanyById, { id: payload._id });
      setCurrency(response?.data.currencyCode || [] );
    };

    useEffect(() => {
        if (open) {
          fetchCurrencyData();
        }
      }, [open]);

  const validationSchema = yup.object({
    name: yup
    .string()
    .max(50, t('Service Provider Name cannot exceed 50 characters'))
    .matches(/^[a-zA-Z0-9\s]*$/, t('Service Provider Name cannot contain special characters'))
    .required(t('Service Provider Name is required')),
    numOfStaff: yup
          .number()
          .min(1, t('Monthly Charges must be positive'))
          .required(t('Service Provider Number of Staff is required')),  
      phoneNo: yup.string().matches(/^[0-9]{11}$/, t('Phone Number must be exactly 11 digits')).required(t('Phone Number is required')),
    workType: yup.string().max(80, t('Work Type cannot exceed 80 characters')).required(t('Work Type is required')),
    monthlyCharges: yup
          .number()
          .typeError(t('Monthly Charges must be a number'))
          .min(1, t('Monthly Charges must be positive'))
          .max(9999999999, t('Monthly Charges must be greater than zero'), (value) => value > 0)
          .required(t('Monthly Charges are required')),
    address: yup.string().max(80, t('Address cannot exceed 80 characters')).required(t('Address is required')),
  });

  const payload = tokenPayload();

  const initialValues = {
    name: data?.name || '',
    numOfStaff: data?.numOfStaff || '',
    phoneNo: data?.phoneNo || '',
    workType: data?.workType || '',
    monthlyCharges: data?.monthlyCharges || '',
    address: data?.address || ''
  };

  const editServiceProvider = async (values, resetForm) => {
    setLoading(true);
    values.companyId = payload.companyId;
    try {
      const response = await updateApi(urls.serviceProvider.updateServiceProvider, values,{ id: data._id },);
      if (response.success) {
                toast.success(t('Service provider updated Successfully'));
                resetForm();
                handleClose();
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
      setLoading(false);
    } finally {
      handleClose();
      setLoading(false); 
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      editServiceProvider(values, resetForm);
    },
    enableReinitialize: true
  });


  return (
    <Dialog open={open} aria-labelledby="scroll-dialog-title">
      <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">{t('Edit Service Provider')}</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Service Provider Name')}</FormLabel>
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
                <FormLabel>{t('Number of Staff')}</FormLabel>
                <TextField
                  id="numOfStaff"
                  name="numOfStaff"
                  size="small"
                  type="number"
                  fullWidth
                  value={formik.values.numOfStaff}
                  onChange={formik.handleChange}
                  error={formik.touched.numOfStaff && Boolean(formik.errors.numOfStaff)}
                  helperText={formik.touched.numOfStaff && formik.errors.numOfStaff}
                  //inputProps={{ maxLength: 10 }}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
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
                onChange={formik.handleChange}
                error={formik.touched.phoneNo && Boolean(formik.errors.phoneNo)}
                helperText={formik.touched.phoneNo && formik.errors.phoneNo}
                inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Work Type')}</FormLabel>
              <TextField
                id="workType"
                name="workType"
                size="small"
                fullWidth
                value={formik.values.workType}
                onChange={formik.handleChange}
                error={formik.touched.workType && Boolean(formik.errors.workType)}
                helperText={formik.touched.workType && formik.errors.workType}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormLabel>{t('Monthly Charges')}</FormLabel>
                <TextField
                  id="monthlyCharges"
                  name="monthlyCharges"
                  type="number"
                  size="small"
                  fullWidth
                  value={formik.values.monthlyCharges}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers and prevent adding if more than 8 digits
                    if (value.length <= 10 && /^[0-9]*$/.test(value)) {
                      formik.handleChange(e);
                    }
                  }}
                  error={formik.touched.monthlyCharges && Boolean(formik.errors.monthlyCharges)}
                  helperText={formik.touched.monthlyCharges && formik.errors.monthlyCharges}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{currency}</InputAdornment>,
                  }}
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
        <Button type="submit" variant="contained" disabled={loading} onClick={formik.handleSubmit} style={{ textTransform: 'capitalize' }} color="secondary">
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

EditServiceProvider.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

export default EditServiceProvider;
