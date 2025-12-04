import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText
} from '@mui/material';

import { getApi, postApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { tokenPayload } from '@/helper';
import { toast } from 'react-toastify';

const InvoicePopup = ({ open, handleClose, data }) => {
  const [amount, setAmount] = useState('');
  const [voucher, setVoucher] = useState('');
  const [month, setMonth] = useState('');
  const [errors, setErrors] = useState({});

  const payload = tokenPayload()
  // Fetch voucher when dialog opens
  console.log(data);
  useEffect(() => {
    const fetchVoucher = async () => {
      if (open) {
        try {
          const res = await getApi(urls.Voucher.createVoucher, {
            prefix: "SP"
          });
          setAmount(data.monthlyCharges)
          setVoucher(res.data || '');
        } catch (err) {
          setVoucher('');
        }
      }
    };
    fetchVoucher();
  }, [open]);

  // Clear form when dialog closes
  useEffect(() => {
    if (!open) {
      setAmount('');
      setMonth('');
      setErrors({});
    }
  }, [open]);

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
    // Clear error when user starts typing
    if (errors.month) {
      setErrors({
        ...errors,
        month: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!amount || amount <= 0) {
      newErrors.amount = 'Amount is required and must be greater than 0';
    }

    if (!month) {
      newErrors.month = 'month is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Validation
    if (!validateForm()) {
      return;
    }

    // Example: send amount, month, and service provider ID
    const payloads = {
      companyId: payload._id,
      payment: amount,
      serviceId: data?._id,
      voucherNo: voucher,
      month
    };

    console.log('Submitting invoice:', {
      serviceProviderName: data?.name,
      ...payloads,
    });

    try {

      await postApi(urls.serviceProvider.postInvoice, payloads)

        toast.success('Invoice Created Successfully')
      handleClose(); // Close popup on success
    } catch (error) {
      alert('Invoice Not Created')
      console.error('Error submitting invoice:', error);
      // Handle error appropriately
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Send Invoice</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Service Provider Name"
            value={data?.name || ''}
            InputProps={{ readOnly: true }}
            fullWidth
          />
          <TextField
            label="Voucher"
            value={voucher}
            InputProps={{ readOnly: true }}
            disabled
            fullWidth
          />
          <FormControl fullWidth variant="outlined" error={!!errors.month}>
            <InputLabel shrink htmlFor="maintenance-month">Month</InputLabel>
            <OutlinedInput
              id="month"
              type="month"
              value={month}
              onChange={handleMonthChange}
              label="Month"
              notched
              sx={{
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                },
                '&.Mui-focused': {
                  boxShadow: '0 4px 12px rgba(25,118,210,0.3)'
                }
              }}
            />
            {errors.month && (
              <FormHelperText>{errors.month}</FormHelperText>
            )}
          </FormControl>
          <TextField
            label="Amount"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (errors.amount) {
                setErrors({ ...errors, amount: '' });
              }
            }}
            type="number"
            required
            fullWidth
            error={!!errors.amount}
            helperText={errors.amount}
            inputProps={{ min: 0, step: "0.01" }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!amount || !month}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoicePopup;