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
import PaymentIcon from '@mui/icons-material/Payment';

import { getApi, patchApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import PaymentModal from './PaymentModal';

const EditBillForm = ({ 
  open, 
  onClose, 
  data, 
  payload, 
  onSuccess 
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
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
    tenantId: data?.debit?.accountId || '',
    propertyId: data?.propertyId || '',
    bookingId: data?._id || data?.bookingId || '',
    billingMonth: data?.billingMonth 
      ? new Date(data.billingMonth).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
    totalBillAmount: Number(data?.totalBillAmount) || 0,
    description: data?.particulars || '',
    createdBy: payload?.companyId || ''
  };

  const handleSubmit = async (values, { resetForm }) => {
    console.log('EditBillForm: handleSubmit called with values:', values);
    console.log('EditBillForm: data._id:', data._id);
    console.log('EditBillForm: payload:', payload);
    
    setLoading(true);
    try {
      const updatedValues = {
        ...values,
        companyId: payload.companyId,
        bookingId: data?._id || data?.bookingId,
        billingMonth: new Date(values.billingMonth).toISOString().split('T')[0],
        totalBillAmount: values.totalBillAmount,
        createdBy: values.createdBy,
      };

      console.log('EditBillForm: Sending update request with:', updatedValues);
      const response = await patchApi(`${urls.bill.updateBill}/${data._id}`, updatedValues);
      console.log('EditBillForm: Update response:', response);

      if (response?.success || response?.data) {
        console.log('EditBillForm: Update successful, closing modal');
        toast.success(t('Bill updated successfully'));
        resetForm();
        onSuccess?.();
        onClose();
      } else {
        console.log('EditBillForm: Update failed - no success flag');
        toast.error(t('Failed to update bill'));
      }
    } catch (error) {
      console.error('EditBillForm: Error updating bill:', error);
      toast.error(t('Failed to update bill'));
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    onSuccess?.();
    setShowPaymentModal(false);
    onClose();
  };

  // Debug: Log modal state
  console.log('EditBillForm: Modal render - open:', open);
  console.log('EditBillForm: Modal render - onClose function:', typeof onClose);

  return (
    <>
      <Dialog 
        open={open} 
        onClose={(event, reason) => {
          console.log('EditBillForm: Dialog onClose called with reason:', reason);
          onClose();
        }} 
        fullWidth 
        maxWidth="md"
        disableEscapeKeyDown={false}
        disableBackdropClick={false}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {t('Update Monthly Bill')}
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
                       {({ values, errors, touched, setFieldValue, isValid, dirty }) => {
             console.log('EditBillForm: Form state - isValid:', isValid, 'dirty:', dirty);
             console.log('EditBillForm: Form errors:', errors);
             console.log('EditBillForm: Form values:', values);
             return (
             <Form>
                <Grid container spacing={2}>
                  {/* Tenant Name */}
                  <Grid item xs={12} sm={6}>
                    <FormLabel>{t('Tenant Name')}</FormLabel>
                    <TextField 
                      size="small" 
                      fullWidth 
                      value={data?.debit?.accountName || data?.tenantName || 'N/A'} 
                      disabled 
                    />
                    <Field type="hidden" name="tenantId" value={values.tenantId} />
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
                    <Field type="hidden" name="propertyId" value={values.propertyId} />
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

                  {/* Show additional info in edit mode */}
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
                </Grid>

                                 <DialogActions sx={{ mt: 2 }}>
                   <Button variant="outlined" onClick={onClose}>
                     {t('Cancel')}
                   </Button>
                   
                   {/* Debug: Manual close button */}
                   <Button 
                     variant="outlined" 
                     color="warning"
                     onClick={() => {
                       console.log('EditBillForm: Manual close clicked');
                       console.log('EditBillForm: onClose function:', onClose);
                       onClose();
                     }}
                   >
                     Debug Close
                   </Button>
                   
                   {/* Debug: Force close with window.location */}
                   <Button 
                     variant="outlined" 
                     color="error"
                     onClick={() => {
                       console.log('EditBillForm: Force close clicked');
                       // Try to force close by refreshing or other means
                       window.location.reload();
                     }}
                   >
                     Force Close
                   </Button>
                   
                   {/* Debug: Test API call */}
                   <Button 
                     variant="outlined" 
                     color="info"
                     onClick={async () => {
                       console.log('EditBillForm: Testing API call directly');
                       try {
                         const testValues = {G
                           tenantId: data?.debit?.accountId || '',
                           propertyId: data?.propertyId || '',
                           bookingId: data?._id || data?.bookingId || '',
                           billingMonth: new Date().toISOString().split('T')[0],
                           totalBillAmount: Number(data?.totalBillAmount) || 0,
                           description: data?.particulars || '',
                           createdBy: payload?.companyId || '',
                           companyId: payload.companyId
                         };
                         console.log('EditBillForm: Test values:', testValues);
                         const response = await patchApi(`${urls.bill.updateBill}/${data._id}`, testValues);
                         console.log('EditBillForm: Test API response:', response);
                         if (response?.success || response?.data) {
                           console.log('EditBillForm: Test API success - closing modal');
                           onClose();
                         }
                       } catch (error) {
                         console.error('EditBillForm: Test API error:', error);
                       }
                     }}
                   >
                     Test API
                   </Button>
                  
                  {/* Pay Bill button - only show if bill is not paid */}
                  {!data?.status && (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<PaymentIcon />}
                      onClick={() => setShowPaymentModal(true)}
                      disabled={loading}
                    >
                      {t('Pay Bill')}
                    </Button>
                  )}
                  
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    disabled={loading}
                    onClick={(e) => {
                      console.log('EditBillForm: Update Bill button clicked');
                      console.log('EditBillForm: Form isValid:', isValid);
                      console.log('EditBillForm: Form dirty:', dirty);
                      console.log('EditBillForm: Form errors:', errors);
                      // Don't prevent default - let formik handle it
                    }}
                  >
                    {loading ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={16} color="inherit" />
                        {t('Updating...')}
                      </Box>
                    ) : (
                      t('Update Bill')
                    )}
                  </Button>
                </DialogActions>
                             </Form>
             );
           }}
           </Formik>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        billData={data}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default EditBillForm;
