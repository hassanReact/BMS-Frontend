import { useState, useEffect } from "react";
import * as React from "react";
import {
  Stack,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { getApi, postApi } from "@/core/apis/api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { urls } from "@/core/Constant/urls";
import { tokenPayload } from "@/helper";
import PaymentIcon from "@mui/icons-material/Payment";
import { AccountTree } from "@mui/icons-material";

const AccountsPayable = () => {
  const { t } = useTranslation();
  const payload = tokenPayload();
  const navigate = useNavigate();

  // --- State ---
  const [openPayAmount, setOpenPayAmount] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [purchaseList, setPurchaseList] = useState([]);
  const [transactionalAccountsData, setTransactionalAccountsData] = useState([]);
  const [accountsPayable, setCreatedAccountsPayable] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payAmountForm, setPayAmountForm] = useState({
    voucherNo: "",
    date: "",
    debit: "",
    credit: "",
    amount: "",
    details: "",
  });

  // --- Fetch APIs ---
  const fetchTransactionalAccountsData = async () => {
    try {
      const response = await getApi(
        `${urls.transactionalAccounts.getAll}?id=${payload._id}`
      );
      setTransactionalAccountsData(response?.data || []);
    } catch (error) {
      console.error("Error fetching transactional accounts data:", error);
    }
  };

  const fetchAccountsPayableData = async () => {
    try {
      setLoading(true);
      const response = await getApi(
        `${urls.AccountsPayable.getAll}?id=${payload.companyId}`
      );
      console.log("API Response:", response.data);

      if (response?.data) {
        // For debugging: log each item and its referenceId
        response.data.forEach((item, idx) => {
          console.log(`Item[${idx}] type:`, item.sourceDocument?.referenceModel, "referenceId:", item.sourceDocument?.referenceId);
        });

        const formattedData = response.data.map((item) => {
          const ref = item.sourceDocument?.referenceId || {};
          if (item.sourceDocument?.referenceModel === "PurchaseDetails") {
            const quantity = ref.quantity || 0;
            const unitPerPrice = ref.unitPerPrice || 0;
            return {
              ...item,
              totalPrice: quantity * unitPerPrice,
            };
          } else if (item.sourceDocument?.referenceModel === "ServiceProvider") {
            const monthlyCharges = ref.monthlyCharges || 0;
            return {
              ...item,
              totalPrice: monthlyCharges,
            };
          }
          return item;
        });

        setCreatedAccountsPayable(formattedData);
        setPurchaseList(response?.data);

        // Enhanced transformation logic to handle both PurchaseDetails and ServiceProvider
        const transformedData = response.data.map((item) => {
          const baseData = {
            _id: item._id,
            companyId: item.companyId,
            Date: item.createdAt || item.date,
            status: item.status || "pending",
            type: item.sourceDocument?.referenceModel || "PurchaseDetails",
            // Add payment information from the API response
            totalAmount: item.amount?.total || 0,
            balanceAmount: item.amount?.balance || 0,
            paidAmount: (item.amount?.total || 0) - (item.amount?.balance || 0),
            outstandingAmount: item.outstandingAmount || item.amount?.balance || 0,
            paymentStatus: item.paymentStatus || "pending",
          };

          // Get reference data from the new structure
          const ref = item.sourceDocument?.referenceId || {};
          const creditData = item.credit || {};

          if (item.sourceDocument?.referenceModel === "PurchaseDetails") {
            return {
              ...baseData,
              billNumber: ref.billNumber || item.voucherNo || "N/A",
              id: baseData._id,
              amount: (ref.quantity || 0) * (ref.unitPerPrice || 0),
              productId: ref._id || ref.productId || null,
              vendorName: ref.vendorName || creditData.accountName || "Unknown Vendor",
              productName: ref.productName || "Unknown Product",
              quantity: ref.quantity || 0,
              unitPerPrice: ref.unitPerPrice || 0,
              vendorId: ref.vendorId || creditData.accountId?._id,
              details: ref.details || `Purchase: ${ref.productName || "Product"}`,
              unit: ref.unit || "pcs",
            };
          } else if (item.sourceDocument?.referenceModel === "ServiceProvider") {
            return {
              ...baseData,
              billNumber: item.voucherNo || "N/A",
              amount: ref.monthlyCharges || 0,
              vendorName: ref.name || creditData.accountName || "Unknown Service Provider",
              productName: `${ref.workType || "Service"} (${ref.numOfStaff || 0} staff)`,
              quantity: 1,
              id: baseData._id,
              productId: ref._id || null,
              unitPerPrice: ref.monthlyCharges || 0,
              vendorId: ref.vendorId || creditData.accountId?._id,
              details: `Service: ${ref.workType || "Service"} by ${ref.name || "Provider"}`,
              unit: "month",
              serviceType: ref.workType,
              numOfStaff: ref.numOfStaff,
              phoneNo: ref.phoneNo,
              address: ref.address,
            };
          }

          // Fallback for unknown types
          return {
            ...baseData,
            billNumber: item.voucherNo || "N/A",
            amount: item.amount?.total || 0,
            vendorName: creditData.accountName || "Unknown",
            productName: creditData.accountName || "Unknown",
            quantity: 1,
            unitPerPrice: item.amount?.total || 0,
            vendorId: creditData.accountId?._id,
            productId: ref._id || null,
            details: item.particulars || `${item.sourceDocument?.referenceModel}: ${creditData.accountName || "Unknown"}`,
          };
        });

        setBookingData(transformedData);
      } else {
        setCreatedAccountsPayable([]);
        setPurchaseList([]);
        setBookingData([]);
      }
    } catch (error) {
      console.error(error);
      setCreatedAccountsPayable([]);
      setPurchaseList([]);
      setBookingData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionalAccountsData();
    fetchAccountsPayableData();
  }, []);

  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  const handleOpenPayAmount = async (row) => {
    if (!row) {
      console.error("Row is null or undefined");
      return;
    }

    if (!row.billNumber) {
      console.error("Row does not have billNumber:", row);
      return;
    }

    try {
      setLoading(true);

      // Create voucher using getApi (as per your original code)
      const voucherResponse = await getApi(urls.Voucher.createVoucher, {
        prefix: row.type === "ServiceProvider" ? "AP" : "AP",
      });

      // Enhanced auto details string based on type
      let autoDetails;
      if (row.type === "ServiceProvider") {
        autoDetails = `Payment for ${row.serviceType || "Service"} to ${row.vendorName
          } - Monthly charges (${row.numOfStaff} staff)`;
      } else {
        autoDetails = `Payment for Bill #${row.billNumber} to ${row.vendorName
          } for ${row.productName} (${row.quantity} x ${row.unitPerPrice})`;
      }

      setCurrentRow(row);
      setPayAmountForm({
        voucherNo: voucherResponse?.data?.voucherNo || voucherResponse?.data || "",
        date: getCurrentDate(),
        debit: row.vendorName,
        credit: "",
        amount: row.balanceAmount?.toString() || row.amount?.toString() || "",
        details: autoDetails,
      });

      setOpenPayAmount(true);
    } catch (error) {
      console.error("Error creating voucher:", error);
      alert("Failed to generate voucher number. Please try again.");
      setCurrentRow(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePayAmount = () => {
    setOpenPayAmount(false);
    setCurrentRow(null);
    setPayAmountForm({
      voucherNo: "",
      date: "",
      debit: "",
      credit: "",
      amount: "",
      details: "",
    });
  };

  const handlePayAmountFormChange = (field, value) => {
    setPayAmountForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitPayAmount = async () => {
    try {
      setLoading(true);

      if (!payAmountForm.credit) {
        alert("Please select a credit account");
        return;
      }

      if (!payAmountForm.voucherNo) {
        alert("Voucher number is required. Please close and reopen the form.");
        return;
      }

      let apiEndpoint;
      let payloadData;

      if (currentRow.type === "PurchaseDetails") {
        // Use vendor payment API for PurchaseDetails
        apiEndpoint =
          urls.AccountsPayable.postVoucherForVendor ||
          `${urls.AccountsPayable.base}/postVoucherForVendor`;
        payloadData = {
          voucherNo: payAmountForm.voucherNo,
          VendorId: currentRow.vendorId,
          productId: currentRow.productId,
          id: currentRow.id,
          companyId: currentRow.companyId,
          amount: parseFloat(payAmountForm.amount) || currentRow.amount,
          Date: payAmountForm.date || currentRow.Date,
          details: payAmountForm.details,
          TransactionId: payAmountForm.credit,
        };
      } else if (currentRow.type === "ServiceProvider") {
        // Use service provider payment API for ServiceProvider
        apiEndpoint =
          urls.AccountsPayable.postVoucherForServiceProvider ||
          `${urls.AccountsPayable.base}/postVoucherForServiceProvider`;
        payloadData = {
          voucherNo: payAmountForm.voucherNo,
          ServiceProviderId: currentRow.productId, // vendorId contains the ServiceProvider ID
          companyId: currentRow.companyId,
          id: currentRow.id,
          amount: parseFloat(payAmountForm.amount) || currentRow.amount,
          Date: payAmountForm.date || currentRow.Date,
          details: payAmountForm.details,
          TransactionId: payAmountForm.credit,
        };
      } else {
        // Fallback to original API if type is unknown
        apiEndpoint = urls.AccountsPayable.payAmount;
        payloadData = {
          voucherNo: payAmountForm.voucherNo,
          VendorId: currentRow.vendorId,
          companyId: currentRow.companyId,
          amount: parseFloat(payAmountForm.amount) || currentRow.amount,
          quantity: currentRow.quantity || 1,
          Date: payAmountForm.date || currentRow.Date,
          details: payAmountForm.details,
          TransactionId: payAmountForm.credit,
          type: currentRow.type,
        };
      }

      console.log("Using endpoint:", apiEndpoint);
      console.log("Payload:", payloadData);

      const response = await postApi(apiEndpoint, payloadData);

      if (response) {
        console.log("Payment successful:", response);
        handleClosePayAmount();
        await fetchAccountsPayableData();
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- DataGrid Columns ---
  const generalBillsColumns = [
    {
      field: "serialNo",
      headerName: "S.No.",
      width: 80,
      renderCell: (params) =>
        bookingData.findIndex((row) => row._id === params.row._id) + 1,
    },
    {
      field: "type",
      headerName: t("Type"),
      width: 120,
      renderCell: (params) => (
        <Typography
          sx={{
            color: params.row.type === "PurchaseDetails" ? "blue" : "green",
            fontWeight: "bold",
            fontSize: "0.75rem",
          }}
        >
          {params.row.type === "PurchaseDetails" ? "Purchase" : "Service"}
        </Typography>
      ),
    },
    {
      field: "vendorName",
      headerName: t("Vendor/Provider"),
      flex: 1,
      renderCell: (params) => (
        <button
          type="button"
          style={{
            color: "#1976d2",
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: 0,
            font: "inherit",
          }}
          onClick={() =>
            navigate(`/dashboard/accounts-payable/view?id=${params.row._id}`)
          }
        >
          {params.row.vendorName}
        </button>
      ),
    },
    {
      field: "billNumber",
      headerName: t("Bill/Reference"),
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ fontSize: "0.875rem" }}>
          {params.row.billNumber}
        </Typography>
      ),
    },
    {
      field: "productName",
      headerName: t("Product/Service"),
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ fontSize: "0.875rem" }}>
          {params.row.productName}
        </Typography>
      ),
    },
    {
      field: "totalAmount",
      headerName: t("Total Amount"),
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: "bold" }}>
          Rs: {params.row.totalAmount?.toLocaleString() || 0}
        </Typography>
      ),
    },
    {
      field: "paidAmount",
      headerName: t("Paid Amount"),
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: "bold", color: "green" }}>
          Rs: {params.row.paidAmount?.toLocaleString() || 0}
        </Typography>
      ),
    },
    {
      field: "balanceAmount",
      headerName: t("Balance Amount"),
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: "bold", color: "red" }}>
          Rs: {params.row.balanceAmount?.toLocaleString() || 0}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: t("Status"),
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            color:
              params.row.paymentStatus === "paid" || params.row.status === "approved"
                ? "green"
                : params.row.paymentStatus === "pending" || params.row.status === "pending"
                  ? "red"
                  : "orange",
            fontWeight: "bold",
            textTransform: "capitalize",
          }}
        >
          {params.row.paymentStatus || params.row.status}
        </Typography>
      ),
    },
    {
      field: "action",
      headerName: t("Action"),
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<PaymentIcon />}
          onClick={() => handleOpenPayAmount(params.row)}
          disabled={loading || (params.row.balanceAmount || 0) <= 0}
        >
          {loading ? t("Loading...") : t("Pay Amount")}
        </Button>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ p: 0 }}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          borderColor: "divider",
          minHeight: "440px",
        }}
      >
        <CardContent sx={{ p: 2 }}>
          {/* Gradient Header */}
          <Box textAlign="center" mb={5}>
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "22px",
              }}
            >
              {t("Accounts Payable")}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ marginBottom: "30px" }}
            >
              {t("Manage vendor and service provider payments")}
            </Typography>
          </Box>

          {/* Created Section */}
          {accountsPayable.length > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccountTree
                  sx={{ mr: 2, color: "primary.main", fontSize: 32 }}
                />
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {t("Created Payables")} ({accountsPayable.length})
                </Typography>
              </Box>
            </Box>
          )}

          {/* Empty State or Table */}
          {accountsPayable.length === 0 ? (
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
              }}
            >
              <AccountTree
                sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {t("No Accounts Payable Records Yet")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("Once you create purchase or service bills, they appear here.")}
              </Typography>
            </Paper>
          ) : (
            <DataGrid
              rows={bookingData}
              columns={generalBillsColumns}
              getRowId={(row) => row._id || row.id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{ toolbar: { showQuickFilter: true } }}
              autoHeight
              loading={loading}
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f8f9fa",
                  borderBottom: "2px solid #dee2e6",
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Pay Amount Dialog */}
      <Dialog
        open={openPayAmount}
        onClose={handleClosePayAmount}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: "1.3rem" }}>
          {t("Pay Amount")} - {currentRow?.billNumber}
          {currentRow?.type && (
            <Typography variant="caption" sx={{ ml: 1, color: "text.secondary" }}>
              ({currentRow.type === "PurchaseDetails" ? "Purchase" : "Service"})
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {/* Payment Summary */}
          {currentRow && (
            <Box sx={{ mb: 3, p: 2, backgroundColor: "#f8f9fa", borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                {t("Payment Summary")}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    {t("Total Amount")}:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    Rs: {currentRow.totalAmount?.toLocaleString() || 0}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    {t("Paid Amount")}:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color="green">
                    Rs: {currentRow.paidAmount?.toLocaleString() || 0}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    {t("Balance Amount")}:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color="red">
                    Rs: {currentRow.balanceAmount?.toLocaleString() || 0}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("Voucher No")}
                value={payAmountForm.voucherNo}
                disabled
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("Date")}
                type="date"
                value={payAmountForm.date}
                onChange={(e) => handlePayAmountFormChange("date", e.target.value)}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("Debit")}
                value={payAmountForm.debit}
                variant="outlined"
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={transactionalAccountsData}
                getOptionLabel={(option) =>
                  option?.accountName ? `${option.accountName} - ${option.accountNumber}` : ""
                }
                value={
                  transactionalAccountsData.find(
                    (a) => a._id?.toString() === payAmountForm.credit?.toString()
                  ) || null
                }
                onChange={(e, value) =>
                  handlePayAmountFormChange("credit", value?._id || "")
                }
                isOptionEqualToValue={(option, value) =>
                  option._id?.toString() === value?._id?.toString()
                }
                renderInput={(params) => (
                  <TextField {...params} label={t("Credit")} required variant="outlined" />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t("Amount")}
                type="number"
                value={payAmountForm.amount}
                onChange={(e) => handlePayAmountFormChange("amount", e.target.value)}
                variant="outlined"
                helperText={currentRow && `Max: Rs ${currentRow.balanceAmount?.toLocaleString() || 0}`}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t("Details")}
                multiline
                rows={3}
                value={payAmountForm.details}
                onChange={(e) => handlePayAmountFormChange("details", e.target.value)}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleClosePayAmount}
            variant="outlined"
            color="secondary"
            disabled={loading}
          >
            {t("Cancel")}
          </Button>
          <Button
            onClick={handleSubmitPayAmount}
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? t("Processing...") : t("Submit Payment")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AccountsPayable;