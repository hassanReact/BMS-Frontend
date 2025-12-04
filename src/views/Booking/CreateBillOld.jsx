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
  TextareaAutosize,
  Autocomplete,
  Box,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { postApi, patchApi, getApi } from '@/core/apis/api'; // Added getApi
import { tokenPayload } from '@/helper';
import { urls } from '@/core/Constant/urls';
import AddIcon from '@mui/icons-material/Add';
import { useCallback } from 'react';
import { Description } from '@mui/icons-material';
import PaymentIcon from '@mui/icons-material/Payment';

const GenerateMonthlyBill = ({ open, handleClose, data, mode = 'create', onSuccess }) => {
  const { t } = useTranslation();
  const payload = tokenPayload();
  const [property, setProperty] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const [transactionAccounts, setTransactionAccounts] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentDataLoaded, setPaymentDataLoaded] = useState(false); // NEW: Prevent multiple API calls
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    description: '',
    debitAccountId: '',
    voucherNo: ''
  });

  // Determine if we're in edit mode
  const isEditMode = mode === 'edit';
  const isPaymentMode = mode === 'payment';

  useEffect(() => {
    if (data?.propertyId) {
      // Handle both object and string propertyId
      setProperty(typeof data.propertyId === 'object' ? data.propertyId : { _id: data.propertyId, propertyname: data.propertyName });
    }
    if (data?.tenantId || data?.debit?.accountId) {
      // Handle both object and string tenantId, also check debit.accountId for bill data
      const tenantId = data.tenantId || data.debit?.accountId;
      const tenantName = data.tenantName || data.debit?.accountName;
      setTenant(typeof tenantId === 'object' ? tenantId : { _id: tenantId, tenantName: tenantName });
    }
  }, [isEditMode]);

  // FIXED: Auto-open payment modal when in payment mode with proper guard
  useEffect(() => {
    if (isPaymentMode && open && data && !paymentDataLoaded) {
      const preparePaymentModal = async () => {
        try {
          console.log("=== PAYMENT MODE - PREPARING PAYMENT MODAL ===");
          setPaymentDataLoaded(true); // Set immediately to prevent multiple calls

          const transactionAccountsResponse = await getApi(urls.transactionalAccounts.getAll, { id: payload._id });
          console.log("transactionAccountsResponse: ", transactionAccountsResponse);
          console.log("transactionAccounts data: ", transactionAccountsResponse?.data);
          setTransactionAccounts(transactionAccountsResponse?.data || []);
          console.log("transactionAccounts state set to: ", transactionAccountsResponse?.data || []);

          const voucherResponse = await getApi(urls.Voucher.createVoucher, {
            prefix: "JV"
          });

          setPaymentData(prev => ({
            ...prev,
            amount: data?.amount?.balance || data?.totalBillAmount || 0,
            voucherNo: voucherResponse?.data // Temporary voucher number
          }));

          console.log("Payment modal is ready - no need to set showPaymentForm in payment mode");
        } catch (error) {
          console.error("Error fetching transaction accounts for payment:", error);
          toast.error(t('Failed to load payment form'));
          setPaymentDataLoaded(false); // Reset on error so it can retry
        }
      };

      preparePaymentModal();
    }

    // Reset when modal closes
    if (!open) {
      setPaymentDataLoaded(false);
    }
  }, [isPaymentMode, open, data, paymentDataLoaded, payload._id, t]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // Only fetch properties
        const properties = await getApi(urls.AccountsReceivable.Property, { companyId: payload._id });
        console.log("properties.data: ", properties.data);
        
        setPropertyData(properties?.data || []); 
      } catch (error) {
        console.error("Error fetching dropdown data", error);
      }
    };

    fetchDropdownData();
  }, [payload._id]);

  console.log("Property Data: ", propertyData);

  const validationSchema = yup.object({
    tenantId: yup.string().required(t('Tenant is required')),
    propertyId: yup.string().required(t('Property is required')),
    billingMonth: yup.date().required(t('Billing Month is required')),
    totalBillAmount: yup.number().required(t('Total Amount is required')).min(0, t('Amount can not be negative')),
    description: yup.string()
  });

  const initialValues = {
    tenantId: tenant?._id || data?.tenantId || data?.debit?.accountId || '',
    propertyId: property?._id || data?.propertyId || '',
    bookingId: data?._id || data?.bookingId || '',
    billingMonth: isEditMode && data?.billingMonth
      ? new Date(data.billingMonth).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    totalBillAmount: Number(data?.totalBillAmount) || 0,
    description: data?.description || '',
    createdBy: data?.createdBy || payload.companyId
  };

  console.log("transactionAccounts: ", transactionAccounts);
  // Pay Bill functionality
  const handlePaymentSubmit = async () => {
    try {
      setPaymentLoading(true);

      // Validate payment amount
      if (!paymentData.amount || paymentData.amount <= 0) {
        toast.error(t('Please enter a valid payment amount'));
        return;
      }

      if (paymentData.amount > (data?.amount?.balance || data?.totalBillAmount || 0)) {
        toast.error(t('Payment amount cannot exceed outstanding balance'));
        return;
      }
      // Format billing month
      const billingMonth = new Date().toISOString();

      // Create payment details
      const paymentDetails = {
        amount: paymentData.amount,
        method: paymentData.paymentMethod,
        date: paymentData.paymentDate,
        description: paymentData.description
      };

      // Find selected transaction account
      const selectedDebitAccount = transactionAccounts.find(acc => acc._id === paymentData.debitAccountId);

      // Create payment payload for billVoucher API
      const paymentPayload = {
        _id: data._id, // Bill ID
        voucherType: 'JV',
        voucherNo: paymentData.voucherNo,
        companyId: payload.companyId,
        date: new Date().toISOString(),
        month: billingMonth,
        particulars: `Payment for bill ${data?.invoiceNo || data?.voucherNo || ''}`,
        debit: {
          accountId: paymentData.debitAccountId,
          accountType: 'TransactionAccount',
          accountName: selectedDebitAccount?.accountName || 'Cash/Bank'
        },
        credit: {
          accountId: data?.debit?.accountId || data?.tenantId,
          accountType: 'Customer',
          accountName: data?.debit?.accountName || data?.tenantName || 'Customer Account'
        },
        amount: paymentData.amount,
        sourceDocument: {
          referenceId: data._id,
          referenceModel: 'Bill'
        },
        status: 'approved',
        tags: ['Payment', 'Bill'],
        Details: paymentData.description || `Payment for bill ${data?.invoiceNo || data?.voucherNo || ''}`
      };

      // Create the payment voucher using billVoucher API
      const response = await postApi(urls.bill.billVoucher, paymentPayload);

      if (response?.success || response?.data) {
        toast.success(t('Payment recorded successfully!'));
        setShowPaymentForm(false);
        setPaymentData({
          amount: 0,
          paymentMethod: 'cash',
          paymentDate: new Date().toISOString().split('T')[0],
          description: '',
          debitAccountId: '',
          voucherNo: ''
        });

        // If in payment mode, close the entire modal
        if (isPaymentMode) {
          handleClose();
        }

        // Call onSuccess callback to refresh data
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess();
        }
      } else {
        throw new Error(response?.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(t('Failed to record payment'));
    } finally {
      setPaymentLoading(false);
    }
  };



  return (
    <>
      {/* Main Dialog - Only show if payment form is not open AND not in payment mode */}
      {!showPaymentForm && !isPaymentMode && (
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
            console.log('=== FORM SUBMISSION DEBUG ===');
            console.log('Form submitted with values:', values);
                console.log('isEditMode:', isEditMode);
                console.log('data._id:', data?._id);
                console.log('payload.companyId:', payload.companyId);
            
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

                console.log('updatedValues:', updatedValues);

            try {
              let response;
                  if (isEditMode) {
                    console.log('Calling PATCH API for update...');
                    console.log('API URL:', `${urls.bill.updateBill}/${data._id}`);
                    // Update existing bill using the new API endpoint
                    response = await patchApi(`${urls.bill.updateBill}/${data._id}`, updatedValues);
                    console.log('PATCH API response:', response);
              } else {
                    console.log('Calling POST API for create...');
                    // Create new bill
                response = await postApi(urls.bill.createBill, updatedValues);
                    console.log('POST API response:', response);
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

                    // Call onSuccess callback to refresh data
                    if (onSuccess && typeof onSuccess === 'function') {
                      onSuccess();
                    }
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
              {({ values, errors, touched, setFieldValue, isValid, dirty }) => {
                console.log('=== FORM VALIDATION DEBUG ===');
                console.log('Form errors:', errors);
                console.log('Form touched:', touched);
                console.log('Form isValid:', isValid);
                console.log('Form dirty:', dirty);
                console.log('Form values:', values);
                console.log('tenantId value:', values.tenantId);
                console.log('tenant state:', tenant);
                console.log('data structure:', data);

            return (
                  <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormLabel>{t('Tenant Name')}</FormLabel>
                    <TextField
                      size="small"
                      fullWidth
                          value={tenant?.tenantName || data?.tenantName || data?.debit?.accountName || 'N/A'}
                      disabled
                    />
                    <Field type="hidden" name="tenantId" value={values.tenantId} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormLabel>{t('Property Name')}</FormLabel>
                    <Autocomplete
                      size="small"
                      fullWidth
                      options={propertyData || []}
                      getOptionLabel={(option) => option?.propertyname || option?.displayName || ""}
                      value={
                        // Find the current property object from dropdown data
                        propertyData?.find(prop => 
                          prop._id === values.propertyId || 
                          prop.id === values.propertyId
                        ) || null
                      }
                      onChange={(event, newValue) => {
                        // Update the form field
                        setFieldValue('propertyId', newValue?._id || newValue?.id || '');
                        // Update local property state if needed
                        setProperty(newValue);
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
                            {/* Show additional property info if available */}
                            {option.propertyCode && (
                              <Typography variant="caption" color="text.secondary">
                                Code: {option.propertyCode}
                              </Typography>
                            )}
                            {option.address && (
                              <Typography variant="caption" color="text.secondary">
                                {option.address}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      )}
                      filterOptions={(options, { inputValue }) =>
                        options.filter((option) =>
                          option.propertyname?.toLowerCase().includes(inputValue.toLowerCase()) ||
                          option.displayName?.toLowerCase().includes(inputValue.toLowerCase()) ||
                          (option.propertyCode && option.propertyCode.toLowerCase().includes(inputValue.toLowerCase())) ||
                          (option.address && option.address.toLowerCase().includes(inputValue.toLowerCase()))
                        )
                      }
                      noOptionsText="No properties found"
                      isOptionEqualToValue={(option, value) => {
                        // Handle comparison for finding selected option
                        return option._id === value._id || 
                               option.id === value.id;
                      }}
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
                      // disabled={isEditMode} Optionally disable month editing in edit mode
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
                      <Button variant="outlined" onClick={handleClose}>
                        {t('Cancel')}
                      </Button>

                      {/* Pay Bill button - only show in edit mode and if bill is not paid */}
                      {isEditMode && !data?.status && (
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<PaymentIcon />}
                          onClick={async () => {
                            try {
                              console.log("=== PAY BILL BUTTON CLICKED ===");
                              console.log("Before - open state:", open);
                              console.log("Before - showPaymentForm state:", showPaymentForm);
                              console.log("Current transactionAccounts length:", transactionAccounts.length);

                              // Fetch transaction accounts if not already loaded
                              if (transactionAccounts.length === 0) {
                                console.log("Fetching transaction accounts...");
                                const transactionAccountsResponse = await getApi(urls.transactionalAccounts.getAll, { id: payload._id });
                                console.log("Pay Bill - transactionAccountsResponse:", transactionAccountsResponse);
                                setTransactionAccounts(transactionAccountsResponse?.data || []);
                                console.log("Pay Bill - transactionAccounts set to:", transactionAccountsResponse?.data || []);
                              }

                              setPaymentData(prev => ({
                                ...prev,
                                amount: data?.amount?.balance || data?.totalBillAmount || 0,
                              }));

                              console.log("Opening payment form...");
                              setShowPaymentForm(true);
                              console.log("After setShowPaymentForm(true) - showPaymentForm should be true");
                            } catch (error) {
                              console.error("Error fetching transaction accounts:", error);
                              toast.error(t('Failed to load payment form'));
                            }
                          }}
                          disabled={paymentLoading}
                        >
                          {paymentLoading ? t('Loading...') : t('Pay Bill')}
                        </Button>
                      )}

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
                </DialogActions>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
      )}

       {/* Payment Form Dialog - Clean Modern Design */}
              <Dialog
         open={showPaymentForm || isPaymentMode}
         disableEscapeKeyDown={false}
         disableBackdropClick={false}
         onClose={() => {
          setShowPaymentForm(false);
          // Reset payment data when closing
          setPaymentData({
            amount: 0,
            paymentMethod: 'cash',
            paymentDate: new Date().toISOString().split('T')[0],
            description: '',
            debitAccountId: '',
            voucherNo: ''
          });
          // If in payment mode, close the entire modal
          if (isPaymentMode) {
            handleClose();
          }
          // Note: Don't call handleClose() here for edit mode since main modal is already closed
        }}
        maxWidth="sm"
        fullWidth
                 sx={{
           zIndex: 9999, // Much higher z-index to ensure visibility
           '& .MuiBackdrop-root': {
             backgroundColor: 'rgba(0, 0, 0, 0.7)',
             zIndex: 9998
           },
           '& .MuiDialog-paper': {
             borderRadius: '12px',
             boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
             zIndex: 9999,
             position: 'relative'
           }
         }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
              {t('Record Payment')}
            </Typography>
            <ClearIcon
              onClick={() => {
                setShowPaymentForm(false);
                // Reset payment data when closing
                setPaymentData({
                  amount: 0,
                  paymentMethod: 'cash',
                  paymentDate: new Date().toISOString().split('T')[0],
                  description: '',
                  debitAccountId: ''
                });
                // If in payment mode, close the entire modal
                if (isPaymentMode) {
                  handleClose();
                }
                // Note: Don't call handleClose() here for edit mode since main modal is already closed
              }}
              sx={{ cursor: 'pointer', color: '#666', '&:hover': { color: '#333' } }}
            />
          </div>
        </DialogTitle>

                 <DialogContent sx={{ px: 3, py: 2 }}>
           <Grid container spacing={2}>
            {/* Voucher No */}
            <Grid item xs={6}>
              <FormLabel sx={{ fontSize: '14px', fontWeight: 500, color: '#333', mb: 1, display: 'block' }}>
                {t('Voucher No')}
              </FormLabel>
              <TextField
                size="small"
                fullWidth
                value={paymentData.voucherNo || `JV-${Date.now().toString().slice(-4)}`}
                disabled
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              />
            </Grid>

            {/* Payment Date */}
            <Grid item xs={6}>
              <FormLabel sx={{ fontSize: '14px', fontWeight: 500, color: '#333', mb: 1, display: 'block' }}>
                {t('Payment Date')}
              </FormLabel>
              <TextField
                size="small"
                fullWidth
                type="date"
                value={paymentData.paymentDate}
                onChange={(e) => setPaymentData(prev => ({ ...prev, paymentDate: e.target.value }))}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              />
            </Grid>


            {/* Credit Account (Bill/Customer) */}
            <Grid item xs={6}>
              <FormLabel sx={{ fontSize: '14px', fontWeight: 500, color: '#333', mb: 1, display: 'block' }}>
                {t('Credit')}
              </FormLabel>
              <TextField
                size="small"
                fullWidth
                value={data?.debit?.accountName || data?.tenantName || 'Customer Account'}
                disabled
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#f5f5f5'
                  }
                }}
              />
            </Grid>


            {/* Debit Account */}
            <Grid item xs={6}>
              <FormLabel sx={{ fontSize: '14px', fontWeight: 500, color: '#333', mb: 1, display: 'block' }}>
                {t('Debit')}
              </FormLabel>
              <Autocomplete
                size="small"
                options={transactionAccounts || []}
                getOptionLabel={(option) => option?.accountName || ''}
                onChange={(event, option) => {
                  console.log("Autocomplete onChange - option:", option);
                  setPaymentData(prev => ({
                    ...prev,
                    debitAccountId: option?._id || '',
                    debitAccountName: option?.accountName || ''
                  }));
                }}
                value={transactionAccounts?.find(acc => acc._id === paymentData.debitAccountId) || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t('Select account')}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px'
                      }
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props} key={option._id}>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {option.accountName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.accountNumber} - {option.details}
                      </Typography>
                    </Box>
                  </Box>
                )}
                isOptionEqualToValue={(option, value) => option._id === value._id}
              />
            </Grid>

            {/* Amount */}
            <Grid item xs={12}>
              <FormLabel sx={{ fontSize: '14px', fontWeight: 500, color: '#333', mb: 1, display: 'block' }}>
                {t('Amount')}
              </FormLabel>
              <TextField
                size="small"
                fullWidth
                type="number"
                value={paymentData.amount}
                onChange={(e) => setPaymentData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                placeholder={t('Enter payment amount')}
                inputProps={{ min: 0, max: data?.amount?.balance || data?.totalBillAmount || 0 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              />
            </Grid>

            {/* Details */}
            <Grid item xs={12}>
              <FormLabel sx={{ fontSize: '14px', fontWeight: 500, color: '#333', mb: 1, display: 'block' }}>
                {t('Details')}
              </FormLabel>
              <TextField
                size="small"
                fullWidth
                multiline
                rows={3}
                value={paymentData.description}
                onChange={(e) => setPaymentData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={t('Payment description or notes')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button
            onClick={() => {
              setShowPaymentForm(false);
              // Reset payment data when closing
              setPaymentData({
                amount: 0,
                paymentMethod: 'cash',
                paymentDate: new Date().toISOString().split('T')[0],
                description: '',
                debitAccountId: ''
              });
              // If in payment mode, close the entire modal
              if (isPaymentMode) {
                handleClose();
              }
              // Note: Don't call handleClose() here for edit mode since main modal is already closed
            }}
            variant="text"
            sx={{
              color: '#1976d2',
              borderRadius: '8px',
              px: 3,
              py: 1
            }}
          >
            {t('Cancel')}
          </Button>
          <Button
            onClick={handlePaymentSubmit}
            variant="contained"
            sx={{
              backgroundColor: '#1976d2',
              borderRadius: '8px',
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
            disabled={paymentLoading || !paymentData.amount || !paymentData.debitAccountId}
          >
            {paymentLoading ? t('Processing...') : t('Submit')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GenerateMonthlyBill;