import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  Autocomplete,
  FormLabel,
  CircularProgress
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import ClearIcon from '@mui/icons-material/Clear';

import { getApi, postApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';

const CreateBillForm = ({ 
  open, 
  onClose, 
  payload, 
  onSuccess 
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [propertyData, setPropertyData] = useState([]);

  // Fetch property data for dropdown
  useEffect(() => {
    if (open) {
      fetchPropertyData();
    }
  }, [open]);

  const fetchPropertyData = async () => {
    try {
      const response = await getApi(urls.AccountsReceivable.Property, { 
        companyId: payload._id 
      });
      setPropertyData(response?.data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  // Form validation schema
  const validationSchema = Yup.object({
    tenantId: Yup.string().required(t('Tenant is required')),
    propertyId: Yup.string().required(t('Property is required')),
    billingMonth: Yup.date().required(t('Billing month is required')),
    totalBillAmount: Yup.number()
      .required(t('Total amount is required'))
      .min(0, t('Amount must be positive'))
  });

  // Initial form values
  const initialValues = {
    tenantId: '',
    propertyId: '',
    bookingId: '',
    billingMonth: new Date().toISOString().split('T')[0],
    totalBillAmount: 0,
    description: '',
    createdBy: payload?.companyId || ''
  };

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const updatedValues = {
        ...values,
        companyId: payload.companyId,
        billingMonth: new Date(values.billingMonth).toISOString().split('T')[0],
        totalBillAmount: values.totalBillAmount,
        createdBy: values.createdBy,
      };

      const response = await postApi(urls.bill.createBill, updatedValues);

      if (response.success) {
        toast.success(t('Bill generated successfully'));
        resetForm();
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error('Error creating bill:', error);
      toast.error(t('Failed to generate bill'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {t('Generate Monthly Bill')}
          </Typography>
          <ClearIcon onClick={onClose} sx={{ cursor: 'pointer' }} />
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <Grid container spacing={2}>
                {/* Tenant Name */}
                <Grid item xs={12} sm={6}>
                  <FormLabel>{t('Tenant Name')}</FormLabel>
                  <TextField 
                    size="small" 
                    fullWidth 
                    placeholder={t('Enter tenant name')}
                    value={values.tenantId}
                    onChange={(e) => setFieldValue('tenantId', e.target.value)}
                    error={touched.tenantId && !!errors.tenantId}
                    helperText={touched.tenantId && errors.tenantId}
                    required
                  />
                </Grid>

                {/* Property Name */}
                <Grid item xs={12} sm={6}>
                  <FormLabel>{t('Property Name')}</FormLabel>
                  <Autocomplete
                    size="small"
                    fullWidth
                    options={propertyData || []}
                    getOptionLabel={(option) => option?.propertyname || option?.displayName || ""}
                    value={propertyData?.find(prop => 
                      prop._id === values.propertyId || 
                      prop.id === values.propertyId
                    ) || null}
                    onChange={(event, newValue) => {
                      setFieldValue('propertyId', newValue?._id || newValue?.id || '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Search properties..."
                        variant="outlined"
                        error={touched.propertyId && !!errors.propertyId}
                        helperText={touched.propertyId && errors.propertyId}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {option.propertyname || option.displayName}
                          </Typography>
                          {option.propertyCode && (
                            <Typography variant="caption" color="text.secondary">
                              Code: {option.propertyCode}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    )}
                  />
                </Grid>

                {/* Billing Month */}
                <Grid item xs={12} sm={6}>
                  <FormLabel>{t('Month')}</FormLabel>
                  <Field
                    as={TextField}
                    name="billingMonth"
                    type="date"
                    size="small"
                    fullWidth
                    error={touched.billingMonth && errors.billingMonth}
                    helperText={touched.billingMonth && errors.billingMonth}
                    required
                  />
                </Grid>

                {/* Bill Description */}
                <Grid item xs={12} sm={6}>
                  <FormLabel>{t('Bill Description')}</FormLabel>
                  <Field
                    as={TextField}
                    name='description'
                    type="text" 
                    placeholder='Bill Description'
                    size="small" 
                    fullWidth 
                    error={touched.description && !!errors.description}
                    helperText={touched.description && !!errors.description}
                  />
                </Grid>

                {/* Total Amount */}
                <Grid item xs={12} sm={6}>
                  <FormLabel>{t('Total Amount')}</FormLabel>
                  <Field
                    as={TextField} 
                    name='totalBillAmount'
                    type="number"
                    size="small" 
                    fullWidth
                    error={touched.totalBillAmount && !!errors.totalBillAmount}
                    helperText={touched.totalBillAmount && !!errors.totalBillAmount}
                    required
                  />
                </Grid>
              </Grid>

              <DialogActions sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={onClose}>
                  {t('Cancel')}
                </Button>
                
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  disabled={loading}
                >
                  {loading ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <CircularProgress size={16} color="inherit" />
                      {t('Generating...')}
                    </Box>
                  ) : (
                    t('Generate Bill')
                  )}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBillForm;
