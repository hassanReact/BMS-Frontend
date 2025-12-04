import React, { useState, useEffect } from 'react';
import {
  Button, Container, Typography, Card, TextField, Grid,Box
} from '@mui/material';
import { getApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';

const GeneralVoucher = () => {
  const [currentRow, _setCurrentRow] = useState(null);
  const [payAmountForm, setPayAmountForm] = useState({
    voucherNo: '',
    date: '',
    debit: '',
    credit: '',
    amount: '',
    details: ''
  });


  const getCurrentDate = () => new Date().toISOString().split('T')[0];

  // On mount, set the form to show directly with dummy data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const voucherResponse = await getApi(urls.Voucher.createVoucher, {
      prefix: 'GV',
    });
    const uniqueVoucherNo = voucherResponse?.data || `GV-${Math.floor(1000 + Math.random() * 9000)}`;

    // console.log(response);
    setPayAmountForm({
      voucherNo: uniqueVoucherNo,
      date: getCurrentDate(),
      debit: '',
      credit: '',
      amount: "",
      details: ''
    });
  };

  const handleChange = (field, value) => {
    setPayAmountForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitPayAmount = () => {
    console.log('Submitted:', payAmountForm);
    alert('Amount paid successfully!');
    // Optionally reset form or keep as is
  };

  const handleCancel = () => {
    // Optionally reset form or keep as is
  };





  return (
  <Container maxWidth="xl"> {/* Wider form for better spacing */}
    <Card
    
     sx={{
    p: 0,
    mt: 0,
    // boxShadow: 4,
    borderRadius: 3,
    width:"100%",
    background: "linear-gradient(135deg, #ffffff, #fafafa)",
    minHeight: "500px", 
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  }}

    
    >
      {/* Header */}
      {/* <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
       sx={{ fontWeight: 'bold', color: 'primary.main',textAlign: "center", fontSize: '24px' ,}}
          gutterBottom
        >
          General Voucher
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: 'text.secondary' }}
          gutterBottom
        >
          Pay Amount — <strong>{currentRow?.billNumber}</strong>
        </Typography>
      </Box> */}
      <Box sx={{ mb: 3, textAlign: "center", borderBottom: "2px solid #eee", pb: 2 }}>
  <Typography
    variant="h4"
    sx={{
      fontWeight: "bold",
      color: "primary.main",
      fontSize: "24px",
    }}
    gutterBottom
  >
    General Voucher
  </Typography>
  <Typography
    variant="subtitle1"
    sx={{ color: "text.secondary" }}
    gutterBottom
  >
    Pay Amount — <strong>{currentRow?.billNumber}</strong>
  </Typography>
</Box>
      {/* Form */}
      <Grid container spacing={3}>
        {[
          { label: 'Voucher No', field: 'voucherNo', type: 'text', disabled: true },
          { label: 'Date', field: 'date', type: 'date' },
          { label: 'Debit', field: 'debit' },
          { label: 'Credit', field: 'credit' },
          { label: 'Amount', field: 'amount', type: 'number' },
          { label: 'Details', field: 'details', multiline: true, rows: 3 },
        ].map(({ label, field, ...props }) => (
          <Grid item xs={12} sm={field === 'details' ? 12 : 6} key={field}>
            <TextField
              fullWidth
              label={label}
              value={payAmountForm[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: '#fff' },
              }}
              {...props}
            />
          </Grid>
        ))}

        {/* Actions */}
        <Grid
          item
          xs={12}
          sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}
        >
          <Button
            onClick={handleCancel}
            variant="outlined"
            color="secondary"
            sx={{
              px: 3,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitPayAmount}
            variant="contained"
            color="primary"
            sx={{
              px: 3,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: 2,
              '&:hover': { boxShadow: 4 },
            }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Card>
  </Container>
);

};

export default GeneralVoucher;
