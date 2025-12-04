/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
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
  IconButton,
  TextareaAutosize
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { postApi, patchApi } from '@/core/apis/api'; // Added putApi for updates
import { tokenPayload } from '@/helper';
import { urls } from '@/core/Constant/urls';
import AddIcon from '@mui/icons-material/Add';
import { useCallback } from 'react';
import { Description } from '@mui/icons-material';

const GenerateMonthlyBill = ({ open, handleClose, data, mode = 'create' }) => {
  const { t } = useTranslation();
  const payload = tokenPayload();
  const [property, setProperty] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Determine if we're in edit mode
  const isEditMode = mode === 'edit';

  useEffect(() => {
    if (data?.propertyId) {
      // Handle both object and string propertyId
      setProperty(typeof data.propertyId === 'object' ? data.propertyId : { _id: data.propertyId, propertyname: data.propertyName });
    }
    if (data?.tenantId) {
      // Handle both object and string tenantId
      setTenant(typeof data.tenantId === 'object' ? data.tenantId : { _id: data.tenantId, tenantName: data.tenantName });
    }
  }, [data]);

  const validationSchema = yup.object({
    tenantId: yup.string().required(t('Tenant is required')),
    propertyId: yup.string().required(t('Property is required')),
    billingMonth: yup.date().required(t('Billing Month is required')),
    totalBillAmount: yup.number().required(t('Total Amount is required')).min(0, t('Amount can not be negative')),
    description: yup.string()
  });

  const initialValues = {
    tenantId: tenant?._id || '',
    propertyId: property?._id || '',
    bookingId: data?._id || data?.bookingId || '',
    billingMonth: isEditMode && data?.billingMonth 
      ? new Date(data.billingMonth).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
    totalBillAmount: Number(data?.totalBillAmount) || 0,
    description: data?.description || '',
    createdBy: data?.createdBy || payload.companyId
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            {isEditMode ? t('Update Monthly Bill') : t('Generate Monthly Bill')}
          </Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            console.log('Form submitted with values:', values);
            setLoading(true);
            const startTime = Date.now();

            const updatedValues = {
              ...values,
              companyId: payload.companyId,
              bookingId: data?._id || data?.bookingId,
              billingMonth: new Date(values.billingMonth).toISOString().split('T')[0],
              totalBillAmount: values.totalBillAmount,
              createdBy: values.createdBy,
            };

            try {
              let response;
              if (isEditMode) {
                // Update existing bill
                response = await patchApi(`${urls.bill.updateBill}/${data._id}`, updatedValues);
              } else {
                // Create new bill
                response = await postApi(urls.bill.createBill, updatedValues);
              }

              if (response.success) {
                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, 1000 - elapsedTime);
                setTimeout(() => {
                  setLoading(false);
                  handleClose();
                }, remainingTime);
                
                toast.success(
                  isEditMode 
                    ? t('Bill updated successfully') 
                    : t('Bill generated successfully')
                );
                resetForm();
              }
            } catch (error) {
              setLoading(false);
              toast.error(
                isEditMode 
                  ? t('Failed to update bill') 
                  : t('Failed to generate bill')
              );
            }
          }}
        >
          {({ values, errors, touched }) => {
            return (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormLabel>{t('Tenant Name')}</FormLabel>
                    <TextField 
                      size="small" 
                      fullWidth 
                      value={tenant?.tenantName || data?.tenantName || 'N/A'} 
                      disabled 
                    />
                    <Field type="hidden" name="tenantId" value={values.tenantId} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormLabel>{t('Property Name')}</FormLabel>
                    <TextField 
                      size="small" 
                      fullWidth 
                      value={property?.propertyname || data?.propertyName || 'N/A'} 
                      disabled 
                    />
                    <Field type="hidden" name="propertyId" value={values.propertyId} />
                  </Grid>

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
                      disabled={isEditMode} // Optionally disable month editing in edit mode
                    />
                  </Grid>

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

                  {/* Show additional info in edit mode */}
                  {isEditMode && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <FormLabel>{t('Invoice Number')}</FormLabel>
                        <TextField 
                          size="small" 
                          fullWidth 
                          value={data?.invoiceNo || 'N/A'} 
                          disabled 
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <FormLabel>{t('Payment Status')}</FormLabel>
                        <TextField 
                          size="small" 
                          fullWidth 
                          value={data?.status ? 'Paid' : 'Pending'} 
                          disabled 
                          style={{
                            color: data?.status ? 'green' : 'red'
                          }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>

                <DialogActions>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    disabled={loading}
                  >
                    {loading 
                      ? (isEditMode ? t('Updating...') : t('Generating...'))
                      : (isEditMode ? t('Update Bill') : t('Generate Bill'))
                    }
                  </Button>
                  <Button variant="outlined" onClick={handleClose}>
                    {t('Cancel')}
                  </Button>
                </DialogActions>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateMonthlyBill;