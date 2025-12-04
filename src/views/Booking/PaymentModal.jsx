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
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import ClearIcon from '@mui/icons-material/Clear';

import { getApi, postApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';

const PaymentModal = ({ 
  open, 
  onClose, 
  billData, 
  onSuccess 
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [transactionAccounts, setTransactionAccounts] = useState([]);
  const [paymentForm, setPaymentForm] = useState({
    voucherNo: '',
    paymentDate: new Date().toISOString().split('T')[0],
    debitAccountId: '',
    amount: 0,
    description: ''
  });

  // Initialize form when billData changes
  useEffect(() => {
    if (billData) {
      setPaymentForm(prev => ({
        ...prev,
        amount: billData?.amount?.balance || billData?.totalBillAmount || 0
      }));
    }
  }, [billData]);

  // Fetch transaction accounts when modal opens
  useEffect(() => {
    if (open) {
      fetchTransactionAccounts();
      generateVoucherNumber();
    }
  }, [open]);

  const fetchTransactionAccounts = async () => {
    try {
      console.log('PaymentModal: Fetching transaction accounts for companyId:', billData?.companyId);
      const response = await getApi(urls.transactionalAccounts.getAll, { 
        id: billData?.companyId 
      });
      console.log('PaymentModal: Transaction accounts response:', response);
      setTransactionAccounts(response?.data || []);
    } catch (error) {
      console.error('Error fetching transaction accounts:', error);
      toast.error(t('Failed to load transaction accounts'));
    }
  };

  const generateVoucherNumber = async () => {
    try {
      const response = await getApi(urls.Voucher.createVoucher, { 
        prefix: "JV" 
      });
      setPaymentForm(prev => ({
        ...prev,
        voucherNo: response?.data || `JV-${Date.now().toString().slice(-4)}`
      }));
    } catch (error) {
      console.error('Error generating voucher:', error);
      setPaymentForm(prev => ({
        ...prev,
        voucherNo: `JV-${Date.now().toString().slice(-4)}`
      }));
    }
  };

  const handleSubmit = async () => {
    if (!paymentForm.debitAccountId || !paymentForm.amount) {
      toast.error(t('Please fill all required fields'));
      return;
    }

    setLoading(true);
    try {
      const selectedAccount = transactionAccounts.find(
        acc => acc._id === paymentForm.debitAccountId
      );

      const paymentPayload = {
        _id: billData._id,
        voucherType: 'JV',
        voucherNo: paymentForm.voucherNo,
        companyId: billData.companyId,
        date: paymentForm.paymentDate,
        month: new Date().toISOString().slice(0, 7),
        particulars: paymentForm.description || `Payment for bill ${billData.invoiceNo || billData.voucherNo}`,
        debit: {
          accountId: paymentForm.debitAccountId,
          accountType: 'TransactionAccount',
          accountName: selectedAccount?.accountName || 'Cash/Bank'
        },
        credit: {
          accountId: billData.debit?.accountId,
          accountType: 'Customer',
          accountName: billData.debit?.accountName || billData.tenantName
        },
        amount: parseFloat(paymentForm.amount),
        sourceDocument: {
          referenceId: billData._id,
          referenceModel: 'Bill'
        },
        status: 'approved',
        paymentStatus: 'paid',
        tags: ['Payment', 'Bill'],
        Details: paymentForm.description || `Payment for bill ${billData.invoiceNo || billData.voucherNo}`
      };

      const response = await postApi(urls.bill.billVoucher, paymentPayload);
      
      if (response?.success || response?.data) {
        toast.success(t('Payment recorded successfully!'));
        onSuccess?.();
        onClose();
      } else {
        toast.error(t('Failed to record payment'));
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error(t('Failed to record payment'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        zIndex: 9999,
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
            {t('Record Payment')}
          </Typography>
          <ClearIcon 
            onClick={onClose} 
            sx={{ cursor: 'pointer', color: '#666', '&:hover': { color: '#333' } }} 
          />
        </Box>
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
              value={paymentForm.voucherNo}
              disabled
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
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
              value={paymentForm.paymentDate}
              onChange={(e) => setPaymentForm(prev => ({ 
                ...prev, 
                paymentDate: e.target.value 
              }))}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>

          {/* Credit Account (Customer) */}
          <Grid item xs={6}>
            <FormLabel sx={{ fontSize: '14px', fontWeight: 500, color: '#333', mb: 1, display: 'block' }}>
              {t('Credit')}
            </FormLabel>
            <TextField
              size="small"
              fullWidth
              value={billData?.debit?.accountName || billData?.tenantName || 'Customer Account'}
              disabled
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: '8px',
                  backgroundColor: '#f5f5f5'
                }
              }}
            />
          </Grid>

          {/* Debit Account (Transaction Account) */}
          <Grid item xs={6}>
            <FormLabel sx={{ fontSize: '14px', fontWeight: 500, color: '#333', mb: 1, display: 'block' }}>
              {t('Debit')}
            </FormLabel>
            <FormControl size="small" fullWidth>
              <Select
                value={paymentForm.debitAccountId || ''}
                onChange={(e) => {
                  console.log('PaymentModal: Select onChange - value:', e.target.value);
                  setPaymentForm(prev => ({
                    ...prev,
                    debitAccountId: e.target.value
                  }));
                }}
                displayEmpty
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              >
                <MenuItem value="" disabled>
                  <em>{t('Select account')}</em>
                </MenuItem>
                {transactionAccounts?.map((option) => {
                  console.log('PaymentModal: Rendering MenuItem for:', option.accountName);
                  return (
                    <MenuItem key={option._id} value={option._id}>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {option.accountName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.accountNumber} - {option.details}
                        </Typography>
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
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
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm(prev => ({ 
                ...prev, 
                amount: parseFloat(e.target.value) || 0 
              }))}
              placeholder={t('Enter payment amount')}
              inputProps={{ 
                min: 0, 
                max: billData?.amount?.balance || billData?.totalBillAmount || 0 
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
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
              value={paymentForm.description}
              onChange={(e) => setPaymentForm(prev => ({ 
                ...prev, 
                description: e.target.value 
              }))}
              placeholder={t('Payment description or notes')}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button 
          onClick={onClose} 
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
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !paymentForm.debitAccountId || !paymentForm.amount}
          sx={{ 
            backgroundColor: '#1976d2',
            borderRadius: '8px',
            px: 3,
            py: 1,
            '&:hover': { backgroundColor: '#1565c0' }
          }}
        >
          {loading ? (
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={16} color="inherit" />
              {t('Processing...')}
            </Box>
          ) : (
            t('Submit')
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;
