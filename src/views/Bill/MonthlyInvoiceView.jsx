/* eslint-disable no-constant-condition */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  Select,
  Breadcrumbs,
  TableContainer,
  TableHead,
  MenuItem,
  TableRow,
  FormControl,
  InputLabel
} from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getApi, patchApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { useTranslation } from 'react-i18next';
import { tokenPayload } from '@/helper';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { IconHome } from '@tabler/icons';

const printStyles = `
  @media print {
    .no-print {
      display: none !important;
    }
    .print-only {
      display: block !important;
    }
    body {
      visibility: hidden;
    }
    .invoice-container {
      visibility: visible;
      position: absolute;
      left: 0;
      top: 0;
      width: 120%;
    }
  }
`;

const InvoiceDetails = ({ value }) => <Typography variant="subtitle1">{value}</Typography>;

const InvoiceTable = ({ items, t }) => (
  <TableContainer component={Paper} sx={{ marginY: 2, boxShadow: 3, borderRadius: 2 }}>
    <Table sx={{ minWidth: 650 }}>
      <TableHead>
        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
          <TableCell><b>{t('Description')}</b></TableCell>
          <TableCell align="right"><b>{t('Amount')} ({items?.companyId?.currencyCode})</b></TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        <TableRow>
          {/*<TableCell>{t('Rent Amount')}</TableCell>*/}
          <TableCell>{t('Bill Amount')}</TableCell>

          <TableCell align="right">{Number(items.rentAmount).toFixed(2)}</TableCell>
        </TableRow>

        {items?.extraCharges?.map((item) => (
          <TableRow key={item._id}>
            <TableCell>{item.serviceName}</TableCell>
            <TableCell align="right">{Number(item.price).toFixed(2)}</TableCell>
          </TableRow>
        ))}

        <TableRow>
          <TableCell colSpan={2} sx={{ borderBottom: '2px solid #000' }} />
        </TableRow>

        <TableRow>
          <TableCell><b>{t('Total Amount')}</b></TableCell>
          <TableCell align="right"><b>{items?.companyId?.currencyCode}  {Number(items.totalBillAmount).toFixed(2)}</b></TableCell>
        </TableRow>

        <TableRow>
          <TableCell>{t('GST Amount')} ({Number(items.gstpercent).toFixed(2)}%)</TableCell>
          <TableCell align="right">{Number(items.totalgst).toFixed(2)}</TableCell>
        </TableRow>

        <TableRow sx={{ backgroundColor: '#e0f7fa' }}>
          <TableCell><b>{t('Total Amount After GST')}</b></TableCell>
          <TableCell align="right"><b>{items?.companyId?.currencyCode}  {Number(items.totalBillAmountAfterGST).toFixed(2)}</b></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
);

const MonthlyInvoiceView = () => {
  const { t } = useTranslation();
  const [invoiceData, setInvoiceData] = useState({});
  const [isPrinted, setIsPrinted] = useState(false);
  const [paymentType, setPaymentType] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const payload = tokenPayload();
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = payload?.role;
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get('id');

  const fetchInvoiceData = async () => {
    try {
      const response = await getApi(urls.bill.getBillById, { id: bookingId });
      setInvoiceData(response?.data || {});
      setIsPaid(response.data.status);
    } catch (error) {
      console.error('Error fetching invoice:', error);
    }
  };

  useEffect(() => {
    fetchInvoiceData();
  }, [bookingId]);

  const handlePaymentSubmit = async () => {
    try {
      setLoading(true);
      const response = await patchApi(urls.bill.changeBillStatus, { paymentType }, { id: bookingId });

      if (response?.success) {
        setIsPaid(true); 
        toast.success(t("Bill status updated successfully!"));
      } else {
        toast.error(t("Failed to update bill status."));
      }
    } catch (error) {
      console.error("Error updating bill:", error);
      toast.error(t("An error occurred. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentChange = (event) => {
    setPaymentType(event.target.value);
  };

  const handlePrint = () => {
    setIsPrinted(true);
    window.print();
  };

  const breadcrumbs = [
    <Link underline="hover" key="home" to="/dashboard/default" style={{ color: 'inherit' }} className="no-print">
      <IconHome />
    </Link>,
    <Link underline="hover" key="property-management" to={userRole === "companyAdmin" || "agent" ? "/dashboard/billC" : "/dashboard/billT"} style={{ color: 'inherit' }} className="no-print">
      {t('Bill Management')}
    </Link>,
    <Typography key="view" color="text.primary" className="no-print">
      {t('View')}
    </Typography>,
  ];

  const currentDate = new Date().toLocaleDateString();

  return (
    <Grid container justifyContent="center" sx={{ padding: '20px' }}>
      <style>{printStyles}</style>
      <Grid item xs={12} className="no-print">
        <Card sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {t('Bill Management')}
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                {breadcrumbs}
              </Breadcrumbs>
            </Typography>
          </Stack>
        </Card>
      </Grid>

      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Paper elevation={2} sx={{ padding: '20px', maxWidth: '800px', marginTop: '12px' }} className="invoice-container">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h3" align="center" gutterBottom>
                {invoiceData?.companyId?.companyName}
              </Typography>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Typography variant="h6" gutterBottom>
                    {t('GST Number')}: {invoiceData?.companyId?.gstnumber}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1" gutterBottom>
                    {t('Date')}: {currentDate}
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="h3" align="center" gutterBottom>
                {/*{t('Rent Invoice')}*/}
                {t('Bill Invoice')}
              </Typography>
              <Divider />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h4" gutterBottom>{t('Property Details')}</Typography>
              <InvoiceDetails value={invoiceData?.propertyId?.propertyname} />
              <InvoiceDetails value={invoiceData?.propertyId?.address} />
              <InvoiceDetails value={invoiceData?.propertyId?.zipcode} />
            </Grid>

            <Grid item xs={12} md={4}>
              {/*<Typography variant="h4" gutterBottom>{t('Tenant Details')}</Typography>*/}
              <Typography variant="h4" gutterBottom>{t('Resident Details')}</Typography>
              <InvoiceDetails value={invoiceData?.tenantId?.tenantName} />
              <InvoiceDetails value={invoiceData?.tenantId?.email} />
              <InvoiceDetails value={invoiceData?.tenantId?.phoneno} />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h4" gutterBottom>
                {t('Reporter Details')}
              </Typography>
              <InvoiceDetails value={invoiceData?.companyId?.email} />
              <InvoiceDetails value={invoiceData?.companyId?.phoneNo} />
            </Grid>

            <Grid item xs={12}>
              <InvoiceTable items={invoiceData} t={t} />
            </Grid>

            <Grid item xs={12} sx={{ marginTop: '20px' }}>
              <Divider />
              {invoiceData?.totalAmount && (
                <Typography sx={{ textAlign: 'left', marginTop: '10px' }}>
                  <b>{t('Total Amount')}:</b> Rs {invoiceData?.totalAmount}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sx={{ textAlign: 'end', marginTop: '20px' }}>
              <Typography sx={{ fontSize: '15px' }} variant="subtitle1">{t('Signature')}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={12} sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }} className="no-print">
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {userRole === "companyAdmin" && !isPaid && (
            <>
              <FormControl variant="outlined" size="small">
                <InputLabel>{t("Payment Type")}</InputLabel>
                <Select value={paymentType} onChange={handlePaymentChange} label={t("Payment Type")}>
                  <MenuItem value="cash">{t("Cash")}</MenuItem>
                  <MenuItem value="credit_card">{t("Credit Card")}</MenuItem>
                  {/*<MenuItem value="upi">{t("UPI")}</MenuItem>*/}
                  <MenuItem value="bank_transfer">{t("Bank Transfer")}</MenuItem>
                </Select>
              </FormControl>

              <Button variant="contained" onClick={handlePaymentSubmit} disabled={loading || isPaid}>
                {loading ? t("Processing...") : t("Paid")}
              </Button>
            </>
          )}

          <Button variant="contained" onClick={handlePrint}>
            {t("Print")}
          </Button>
        </div>
      </Grid>
    </Grid>
  );
};

export default MonthlyInvoiceView;
