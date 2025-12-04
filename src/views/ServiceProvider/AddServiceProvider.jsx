/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import { postApi } from '@/core/apis/api';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { Box, Chip, Divider, Fade, FormLabel, IconButton, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import { urls } from '@/core/Constant/urls';
import { useTranslation } from 'react-i18next';
import { tokenPayload } from '@/helper';
import { useCallback } from 'react';
import { debounce } from 'lodash';
import { useState } from 'react';
import { useEffect } from 'react';
import { getApi } from '@/core/apis/api';
import InputAdornment from '@mui/material/InputAdornment';
import { CloudUpload, Delete, Receipt } from '@mui/icons-material';

const AddServiceProvider = (props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState();
  const [uploadedFile, setUploadedFile] = useState(null);

  const FILE_SIZE = 5 * 1024 * 1024;
  const SUPPORTED_FORMATS = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

  const fetchCurrencyData = async () => {
    const response = await getApi(urls.company.getCompanyById, { id: payload._id });
    setCurrency(response?.data.currencyCode || [] );
  };

  const { open, handleClose } = props;

  useEffect(() => {
    if (open) {
      fetchCurrencyData();
    }
  }, [open]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      console.log(file);
      setUploadedFile(file);
      formik.setFieldValue('agreement', file);
    }
  };

  const removeFile = () => {
  setUploadedFile(null);
  formik.setFieldValue('agreement', null);
};

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
    phoneNo: yup
    .string()
    .trim()
    .matches(/^0[0-9]{10}$/, t('Phone Number must be exactly 11 digits and start with 0'))
    .required(t('Phone Number is required')),
    workType: yup
      .string()
      .max(80, t('Worktype cannot exceed 80 characters'))
      .required(t('Worktype is required')),
    monthlyCharges: yup
      .number()
      .typeError(t('Monthly Charges must be a number'))
      .min(1, t('Monthly Charges must be positive'))
      .max(9999999999, t('Monthly Charges must be greater than zero'), (value) => value > 0)
      .required(t('Monthly Charges are required')),
    address: yup
      .string()
      .max(80, t('Address cannot exceed 80 characters'))
      .required(t('Address is required')),
    agreement: yup
    .mixed()
    .required(t('Agreement file is required'))
    .test('fileSize', t('File is too large (max 5MB)'), (value) => {
      return value && value.size <= FILE_SIZE
    })
    .test('fileTest', t('Unsupported file format'), (value) => {
      return value && SUPPORTED_FORMATS.includes(value.type);
    })
  });

  const payload = tokenPayload();

  const initialValues = {
    name: '',
    numOfStaff: '',
    phoneNo: '',
    workType: '',
    monthlyCharges: '',
    address: '',
    // agreement: null
  };

 const AddServiceProvider = async (values, resetForm) => {
  setLoading(true);
  values.companyId = payload.companyId;

  try {
    // Build FormData
    const formData = new FormData();

    // Append all fields except the file
    for (const [key, val] of Object.entries(values)) {
      if (key !== 'agreement') {
    formData.append(key, val);
  }
    }

    // Add the file separately — must match multer field name
    if (uploadedFile) {
      formData.append('agreement', uploadedFile); // 👈 critical!
    } else {
      toast.error(t('Agreement file is required'));
      setLoading(false);
      return;
    }

    const response = await postApi(urls.serviceProvider.create, formData
    // , {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // }
    );

    if (response.success) {
      toast.success(t('Successfully registered'));
      resetForm();
      setUploadedFile(null); // clear file
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
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      AddServiceProvider(values, resetForm);
    }
  });

  // const debounceSubmit =  useCallback(debounce(formik.handleSubmit, 500), [formik.handleSubmit]);


  return (
    <div>
      <Dialog open={open} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <DialogTitle
          id="scroll-dialog-title"
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h6">{t('Add Service Provider')}</Typography>
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
                  type="text"
                  fullWidth
                  value={formik.values.phoneNo}
                  onChange={formik.handleChange}
                  error={formik.touched.phoneNo && Boolean(formik.errors.phoneNo)}
                  helperText={formik.touched.phoneNo && formik.errors.phoneNo}
                  inputProps={{ maxLength: 11 }}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
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

              <Grid item xs={12}>
                    <Divider sx={{ my: 2 }}>
                      <Chip label="Service Upload" />
                    </Divider>
                    <Box sx={{ textAlign: 'center' }}>
                      <input hidden accept="image/*,.pdf" id="file-upload" type="file" onChange={handleFileUpload} />
                      <label htmlFor="file-upload">
                        <Button variant="outlined" component="span" startIcon={<CloudUpload />}>
                          Service Agreement
                        </Button>
                      </label>
                      {!uploadedFile && (
  <Typography color="error" variant="body2" mt={1}>
    {t('Agreement file is required')}
  </Typography>
)}
                    </Box>
                    {uploadedFile && (
                      <Fade in={true}>
                        <Paper sx={{ mt: 2, p: 2, borderRadius: 2, backgroundColor: '#e8f5e9' }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2">
                              <Receipt /> {uploadedFile.name}
                            </Typography>
                            <IconButton onClick={removeFile} color="error">
                              <Delete />
                            </IconButton>
                          </Box>
                        </Paper>
                      </Fade>
                    )}
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
    </div>
  );
};

AddServiceProvider.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default AddServiceProvider;
