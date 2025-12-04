
// import { useState, useEffect } from "react"
// import {
//   Stack,
//   Button,
//   Container,
//   Typography,
//   Card,
//   Box,
//   Breadcrumbs,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Grid,
//   CircularProgress,
// } from "@mui/material"
// import { DataGrid, GridToolbar } from "@mui/x-data-grid"
// import { Link, useNavigate } from "react-router-dom"
// import TableStyle from "@/ui-component/TableStyle"
// import { IconHome } from "@tabler/icons"
// import PaymentIcon from "@mui/icons-material/Payment"
// import { useTranslation } from "react-i18next"
// import { MenuItem } from "@mui/material"
// import { tokenPayload } from "@/helper"
// import Tab from "@mui/material/Tab"
// import TabContext from "@mui/lab/TabContext"
// import TabList from "@mui/lab/TabList"
// import TabPanel from "@mui/lab/TabPanel"
// import { urls } from "@/core/Constant/urls"
// import { getApi, postApi } from "@/core/apis/api"
// import { toast } from "react-toastify"


// const useFetchAccountsReceivable = (companyId, setData, setError, setLoading) => {
//   const fetch = async () => {
//     try {
//       setLoading(true)
//       setError(null)
//       const response = await getApi(`${urls.AccountsReceivable.getAllReceives}?companyId=${companyId}`)
//       console.log(response.data)
//       const dataArray = Array.isArray(response.data) ? response.data : response.results || [response.data]

//       const maintenanceItems = dataArray.filter((item) => item.type !== "Bill")

//       const formatted = maintenanceItems.map((item) => {
//         const reference = item.referenceId || {}
//         const dueDate = reference.dueDate ? new Date(reference.dueDate) : null

//         const baseAmount = reference.maintenanceAmount || reference.amount || 0
//         const baseSurcharge = reference.surchargeAmount || 0

//         let totalAmount = baseAmount + baseSurcharge
//         let dailySurcharge = 0

//         if (dueDate && new Date() > dueDate && item.status !== "Paid") {
//           const today = new Date()
//           const daysLate = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))
//           dailySurcharge = daysLate * baseSurcharge
//           totalAmount = baseAmount + dailySurcharge
//         }

//         return {
//           _id: item._id?.toString() || Math.random().toString(36),
//           propertyName: item.propertyName || "N/A",
//           propertyId: item.propertyId?.toString(),
//           companyId: item.companyId?.toString(),

//           maintenanceId: reference._id,
//           month: item.month || reference.maintenanceMonth || "N/A",
//           amount: baseAmount,
//           surchargeAmount: dailySurcharge,
//           dueDate: dueDate,

//           status: item.status || "Pending",
//           isDeleted: item.isDeleted || false,
//           createdAt: new Date(item.createdAt),
//           updatedAt: new Date(item.updatedAt),
//           __v: item.__v || 0,
//         }
//       })
//       setData(formatted)
//     } catch (err) {
//       setError(err?.response?.data?.message || err.message || "Unknown error")
//       setData([])
//     } finally {
//       setLoading(false)
//     }
//   }
//   return fetch
// }

// const useFetchGeneralBills = (companyId, setData, setError, setLoading) => {
//   const fetch = async () => {
//     try {
//       setLoading(true)
//       setError(null)
//       const response = await getApi(`${urls.AccountsReceivable.getAllReceives}?companyId=${companyId}`)
//       console.log("General Bills Response:", response.data)

//       const dataArray = Array.isArray(response.data) ? response.data : response.results || [response.data]

//       const billItems = dataArray.filter((item) => item.type === "Bill")

//       // const getCorrectMonth = (item) => {
//       //   const reference = item.referenceId || {}

//       //   // Check if reference has billingMonth or any date field with correct month
//       //   if (reference.billingMonth) {
//       //     const date = new Date(reference.billingMonth)
//       //     const monthNames = [
//       //       "JANUARY",
//       //       "FEBRUARY",
//       //       "MARCH",
//       //       "APRIL",
//       //       "MAY",
//       //       "JUNE",
//       //       "JULY",
//       //       "AUGUST",
//       //       "SEPTEMBER",
//       //       "OCTOBER",
//       //       "NOVEMBER",
//       //       "DECEMBER",
//       //     ]
//       //     return monthNames[date.getMonth()]
//       //   }

//       //   // Check createdAt as fallback - if bill was created in August, it's likely for August
//       //   if (item.createdAt) {
//       //     const createdDate = new Date(item.createdAt)
//       //     const monthNames = [
//       //       "JANUARY",
//       //       "FEBRUARY",
//       //       "MARCH",
//       //       "APRIL",
//       //       "MAY",
//       //       "JUNE",
//       //       "JULY",
//       //       "AUGUST",
//       //       "SEPTEMBER",
//       //       "OCTOBER",
//       //       "NOVEMBER",
//       //       "DECEMBER",
//       //     ]
//       //     const derivedMonth = monthNames[createdDate.getMonth()]

//       //     // Log for debugging
//       //     console.log(
//       //       `[v0] Bill ${item._id}: stored month="${item.month}", created in="${derivedMonth}", createdAt="${item.createdAt}"`,
//       //     )

//       //     // If stored month doesn't match creation month, use creation month
//       //     if (item.month !== derivedMonth) {
//       //       console.log(`[v0] Month mismatch detected! Using ${derivedMonth} instead of ${item.month}`)
//       //       return derivedMonth
//       //     }
//       //   }

//       //   return item.month || "N/A"
//       // }

//       const formatMonth = (dateString) => {
//         if (!dateString) return "N/A";
//         try {
//           const date = new Date(dateString);
//           const options = { year: 'numeric', month: 'short', day: 'numeric' };
//           return date.toLocaleDateString('en-US', options).replace(',', '');
//         } catch (error) {
//           console.error("Date formatting error:", error);
//           return dateString; // Return original if formatting fails
//         }
//       };

//       const formatted = billItems.map((item) => {
//         const reference = item.referenceId || {}

//         return {
//           _id: item._id?.toString() || Math.random().toString(36),
//           propertyName: item.propertyName || "N/A",
//           propertyId: item.propertyId?.toString(),
//           companyId: item.companyId?.toString(),

//           billId: reference._id || item._id,
//           month: formatMonth(item.month), // Using corrected month logic
//           amount: item.amount || reference.totalBillAmount || 0,
//           surchargeAmount: 0, // General bills typically don't have surcharge
//           dueDate: reference.dueDate ? new Date(reference.dueDate) : new Date(),

//           status: item.status === false ? "Pending" : item.status === true ? "Paid" : item.status || "Pending",
//           type: item.type || "Bill",
//           invoiceNo: reference.invoiceNo || "N/A",
//           isDeleted: item.isDeleted || false,
//           createdAt: new Date(item.createdAt),
//           updatedAt: new Date(item.updatedAt),
//           __v: item.__v || 0,
//         }
//       })
//       setData(formatted)
//     } catch (err) {
//       setError(err?.response?.data?.message || err.message || "Unknown error")
//       setData([])
//     } finally {
//       setLoading(false)
//     }
//   }
//   return fetch
// }

// const AccountsReceivable = () => {
//   const { t } = useTranslation()
//   const payload = tokenPayload()
//   const [open, setOpen] = useState(false)
//   const [currentRow, setCurrentRow] = useState(null)
//   const [form, setForm] = useState({
//     voucherNo: "",
//     date: "",
//     debit: "",
//     credit: "",
//     amount: "",
//     details: "",
//     month: "",
//   })
//   const [bookingData, setBookingData] = useState([])
//   const [generalBillsData, setGeneralBillsData] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [submitting, setSubmitting] = useState(false)
//   const [transaction, setTransaction] = useState([])
//   const [error, setError] = useState(null)
//   const [value, setValue] = useState("1")
//   const isAdmin = payload?.role === "companyAdmin"
//   const fetchData = useFetchAccountsReceivable(payload._id, setBookingData, setError, setLoading)
//   const fetchGeneralBills = useFetchGeneralBills(payload._id, setGeneralBillsData, setError, setLoading)
//   const navigate = useNavigate()

//   useEffect(() => {
//     if (value === "1" || value === "3") {
//       fetchData()
//     } else if (value === "2") {
//       fetchGeneralBills()
//     }
//   }, [value, payload._id])

//   const getFilteredData = () => {
//     if (value === "2") {
//       return generalBillsData
//     }
//     return bookingData.filter((item) => value === "1" || value === "3")
//   }

//   const filteredData = getFilteredData()

//   const formatMonthYear = (monthString) => {
//     // If month is already in format like "June-2025", return as is
//     if (monthString && monthString.includes("-")) {
//       return monthString
//     }

//     // If it's just month name or number, add current year
//     const currentYear = new Date().getFullYear()
//     const currentMonth = new Date().getMonth()

//     // If it's a month name
//     if (monthString && isNaN(monthString)) {
//       return `${monthString}-${currentYear}`
//     }

//     // If it's a month number (1-12)
//     if (monthString && !isNaN(monthString)) {
//       const monthNames = [
//         "January",
//         "February",
//         "March",
//         "April",
//         "May",
//         "June",
//         "July",
//         "August",
//         "September",
//         "October",
//         "November",
//         "December",
//       ]
//       const monthIndex = Number.parseInt(monthString) - 1
//       const monthName = monthNames[monthIndex] || monthNames[currentMonth]
//       return `${monthName}-${currentYear}`
//     }

//     // Default to current month-year
//     const monthNames = [
//       "January",
//       "February",
//       "March",
//       "April",
//       "May",
//       "June",
//       "July",
//       "August",
//       "September",
//       "October",
//       "November",
//       "December",
//     ]
//     return `${monthNames[currentMonth]}-${currentYear}`
//   }

//   const handleOpen = async (row) => {
//     try {
//       setLoading(true)

//       // 1. Fetch transaction accounts for debit dropdown
//       const transactionResponse = await getApi(urls.transactionalAccounts.getAll, {
//         id: payload._id,
//       })
//       setTransaction(transactionResponse.data || [])

//       // 2. Generate unique voucher number
//       const voucherResponse = await getApi(urls.Voucher.createVoucher, {
//         prefix: "VCH",
//       })
//       const uniqueVoucherNo = voucherResponse?.data || `VCH-${Math.floor(1000 + Math.random() * 9000)}`

//       // 3. Format month-year
//       const formattedMonth = formatMonthYear(row.month)

//       // 4. Set current row and form data
//       setCurrentRow(row)

//       const billType = value === "2" ? "general bill" : "maintenance"
//       const invoiceInfo = row.invoiceNo && row.invoiceNo !== "N/A" ? ` (Invoice: ${row.invoiceNo})` : ""

//       setForm({
//         voucherNo: uniqueVoucherNo,
//         date: new Date().toISOString().split("T")[0],
//         debit: "", // This will store transaction ID
//         credit: row.propertyId, // Store property ID, not name
//         amount: ((row.amount || 0) + (row.surchargeAmount || 0)).toString(),
//         details: `${billType.charAt(0).toUpperCase() + billType.slice(1)} payment received for property ${row.propertyName} for the month of ${formattedMonth}${invoiceInfo}. Amount includes base ${billType} fee of Rs.${row.amount || 0}${row.surchargeAmount ? ` plus surcharge of Rs.${row.surchargeAmount}` : ""}. Total amount received: Rs.${(row.amount || 0) + (row.surchargeAmount || 0)}.`,
//         month: formattedMonth, // Add month to form state
//       })

//       setOpen(true)
//     } catch (error) {
//       console.error("Error in handleOpen:", error)
//       alert(t("Error loading payment form. Please try again."))
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleChange = (field, val) => {
//     setForm((prev) => ({ ...prev, [field]: val }))
//   }

//   const handleClose = () => {
//     setOpen(false)
//     setCurrentRow(null)
//     setForm({
//       voucherNo: "",
//       date: "",
//       debit: "",
//       credit: "",
//       amount: "",
//       details: "",
//       month: "",
//     })
//   }

//   const validateForm = () => {
//     const { voucherNo, date, debit, amount } = form

//     if (!voucherNo.trim()) {
//       alert(t("Voucher number is required"))
//       return false
//     }
//     if (!date) {
//       alert(t("Date is required"))
//       return false
//     }
//     if (!debit) {
//       alert(t("Please select a debit account"))
//       return false
//     }
//     if (!amount || Number.parseFloat(amount) <= 0) {
//       alert(t("Please enter a valid amount"))
//       return false
//     }

//     return true
//   }

//   const submitPayment = async () => {
//     if (!validateForm()) return

//     try {
//       setSubmitting(true)

//       const voucherData = {
//         voucherNo: form.voucherNo,
//         Date: form.date,
//         TransactionId: form.debit, // debit account ID
//         propertyId: form.credit, // property ID
//         amount: Number.parseFloat(form.amount),
//         Details: form.details,
//         companyId: payload._id,
//         month: form.month, // Add formatted month like "June-2025"
//         type: value === "2" ? "Bill" : "Maintenance", // Add type field for backend
//         ...(value === "2" ? { billId: currentRow?.billId } : { maintenanceId: currentRow?.maintenanceId }),
//       }

//       const apiEndpoint =
//         value === "2"
//           ? urls.AccountsReceivable.paidBillVoucher || urls.AccountsReceivable.paidVoucher
//           : urls.AccountsReceivable.paidVoucher

//       const response = await postApi(apiEndpoint, voucherData)

//       console.log("Voucher Data:", voucherData)
//       if (response.success || response.data) {
//         toast.success("Payment received successfully!")
//         handleClose()
//         if (value === "2") {
//           await fetchGeneralBills()
//         } else {
//           await fetchData()
//         }
//       } else {
//         throw new Error(response.message || "Failed to process payment")
//       }
//     } catch (error) {
//       console.error("Error submitting payment:", error)
//       const errorMessage = error?.response?.data?.message || error.message || t("Error processing payment")
//       alert(`${t("Error")}: ${errorMessage}`)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const columns = [
//     { field: "serialNo", headerName: "S.No.", width: 80, renderCell: ({ row }) => filteredData.indexOf(row) + 1 },
//     {
//       field: "propertyName",
//       headerName: t("Property Name"),
//       flex: 1,
//       renderCell: ({ row }) => (
//         <Button variant="text" color="primary" onClick={() => navigate(`/dashboard/booking/view?id=${row._id}`)}>
//           {row.propertyName}
//         </Button>
//       ),
//     },
//     { field: "month", headerName: t("Month"), flex: 1 },
//     ...(value === "2"
//       ? [
//           {
//             field: "invoiceNo",
//             headerName: t("Invoice No"),
//             flex: 1,
//             renderCell: ({ row }) => row.invoiceNo || "N/A",
//           },
//         ]
//       : []),
//     {
//       field: "amount",
//       headerName: t("Amount"),
//       flex: 1,
//       renderCell: ({ row }) => `Rs: ${(row.amount || 0) + (row.surchargeAmount || 0)}`,
//     },
//     {
//       field: "status",
//       headerName: t("Status"),
//       flex: 1,
//       renderCell: ({ row }) => (
//         <Typography
//           sx={{
//             color: row.status === "Paid" ? "green" : row.status === "Overdue" ? "red" : "orange",
//             fontWeight: "bold",
//           }}
//         >
//           {row.status}
//         </Typography>
//       ),
//     },
//     {
//       field: "dueDate",
//       headerName: t("Due Date"),
//       flex: 1,
//       renderCell: ({ row }) => {
//         const isOverdue = new Date(row.dueDate) < new Date() && row.status !== "Paid"
//         return (
//           <Typography sx={{ color: isOverdue ? "red" : "inherit", fontWeight: isOverdue ? "bold" : "normal" }}>
//             {new Date(row.dueDate).toLocaleDateString()}
//           </Typography>
//         )
//       },
//     },
//     {
//       field: "action",
//       headerName: t("Action"),
//       flex: 1,
//       renderCell: ({ row }) => (
//         <Button
//           variant="contained"
//           color="primary"
//           size="small"
//           startIcon={<PaymentIcon />}
//           onClick={() => handleOpen(row)}
//           disabled={row.status === "Paid"}
//         >
//           {row.status === "Paid" ? t("Paid") : t("Receive Amount")}
//         </Button>
//       ),
//     },
//   ]

//   if (loading || error)
//     return (
//       <Container>
//         <Card sx={{ p: 2, mb: 2 }}>
//           <Typography variant="h6" color={error ? "error" : "inherit"} align="center">
//             {error ? `${t("Error")}: ${error}` : t("Loading...")}
//           </Typography>
//           {error && (
//             <Button variant="contained" onClick={fetchData} sx={{ mt: 2, mx: "auto" }}>
//               {t("Retry")}
//             </Button>
//           )}
//         </Card>
//       </Container>
//     )

// return (
//   <>
//     <Container maxWidth="lg">
//       <Card
//         sx={{
//           p: 0,
//           mt:0,
//           height: "700px",
//           borderRadius: 3,
//           // boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         {/* Heading + Breadcrumbs in same card */}
//       {/* Heading + Breadcrumbs */}
// <Stack
//   direction="row"
//   alignItems="center"
//   justifyContent="space-between"
//   sx={{
//     mb: 1
//     ,
//     pb: 1,
//     borderBottom: "2px solid",
//     borderColor: "divider",
//   }}
// >
//   <Stack spacing={1}>
//     <Stack direction="row" alignItems="center" spacing={1.5}>
//       {/* Icon with background circle */}
//       <Box
//         sx={{
//           width: 42,
//           height: 42,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           borderRadius: "50%",
//           backgroundColor: "rgba(25, 118, 210, 0.1)",
//         }}
//       >
//         <Link to="/" style={{ textDecoration: "none" }}>
//         <IconHome style={{ color: "#1976d2", fontSize: "1.5rem" }} /></Link>
//       </Box>

//       {/* Title */}
//       <Typography
//         variant="h4"
//         sx={{
//             fontWeight: "bold",
//       color: "primary.main",
//       fontSize: "24px",
//           letterSpacing: "0.5px",
         
//         }}
//       >
//         {t("Accounts Receivable")}
//       </Typography>
//     </Stack>

 
//   </Stack>
// </Stack>


//         {/* Tabs + DataGrid inside same card */}
//         <TabContext value={value} sx={{ flexGrow: 1 }}>
//           <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//             <TabList
//               onChange={(_, v) => setValue(v)}
//               sx={{
//                 "& .MuiTab-root": { fontWeight: 600, textTransform: "none" },
//                 "& .Mui-selected": { color: "primary.main" },
//                 "& .MuiTabs-indicator": {
//                   backgroundColor: "primary.main",
//                   height: "3px",
//                   borderRadius: "3px 3px 0 0",
//                 },
//               }}
//             >
//               <Tab label={t("Maintenance")} value="1" />
//               {isAdmin && <Tab label={t("General Bills")} value="2" />}
//               {isAdmin && <Tab label={t("Water Bill")} value="3" />}
//             </TabList>
//           </Box>

//           <TabPanel value={value} sx={{ flexGrow: 1, p: 0, pt: 2 }}>
//             <DataGrid
//               rows={filteredData}
//               columns={columns}
//               getRowId={(row) => row._id}
//               slots={{ toolbar: GridToolbar }}
//               slotProps={{ toolbar: { showQuickFilter: true } }}
//               loading={loading}
//               sx={{
//                 border: "none",
//                 "& .MuiDataGrid-columnHeaders": {
//                   backgroundColor: "rgba(25, 118, 210, 0.08)",
//                   fontWeight: "bold",
//                 },
//               }}
//             />
//           </TabPanel>
//         </TabContext>
//       </Card>
//     </Container>

//     {/* Payment Dialog */}
//     <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//       <DialogTitle sx={{ fontWeight: 600, fontSize: "1.3rem" }}>
//         {t("Receive Amount")} - {currentRow?.propertyName || ""}
//       </DialogTitle>
//       <DialogContent dividers sx={{ p: 3 }}>
//         <Grid container spacing={2}>
//           {/* Form Fields remain same */}
//         </Grid>
//       </DialogContent>
//       <DialogActions sx={{ p: 2 }}>
//         <Button onClick={handleClose} variant="outlined" color="secondary" disabled={submitting}>
//           {t("Cancel")}
//         </Button>
//         <Button
//           onClick={submitPayment}
//           variant="contained"
//           color="primary"
//           disabled={submitting}
//           startIcon={submitting ? <CircularProgress size={20} /> : null}
//         >
//           {submitting ? t("Processing...") : t("Submit Payment")}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   </>
// );
// }
// export default AccountsReceivable




import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Fade,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Payment as PaymentIcon,
  AccountBalanceWallet,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { urls } from "@/core/Constant/urls";
import { getApi, postApi } from "@/core/apis/api";
import { tokenPayload } from "@/helper";

const AccountsReceivable = () => {
  const { t } = useTranslation();
  const payload = tokenPayload();

  const [open, setOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [form, setForm] = useState({
    voucherNo: "",
    date: "",
    debit: "",
    credit: "",
    amount: "",
    details: "",
    month: "",
  });

  const [bookingData, setBookingData] = useState([]);
  const [generalBillsData, setGeneralBillsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [value, setValue] = useState("1");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const isAdmin = payload?.role === "companyAdmin";

  // ============= Fetch Data (inline) ============
  const fetchAccountsReceivable = async () => {
    try {
      setLoading(true);
      const res = await getApi(urls.accounts.getBooking, { id: payload._id });
      setBookingData(res?.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch booking data");
    } finally {
      setLoading(false);
    }
  };

  const fetchGeneralBills = async () => {
    try {
      setLoading(true);
      const res = await getApi(urls.accounts.getGeneralBill, { id: payload._id });
      setGeneralBillsData(res?.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch general bills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (value === "1" || value === "3") {
      fetchAccountsReceivable();
    } else if (value === "2") {
      fetchGeneralBills();
    }
  }, [value, payload._id]);

  const filteredData =
    value === "2" ? generalBillsData : bookingData.filter(() => true);

  const handleCloseSnackbar = () =>
    setSnackbar({ ...snackbar, open: false });

  // ============= Columns =============
  const columns = [
    {
      field: "serialNo",
      headerName: "S.No.",
      width: 80,
      renderCell: ({ row }) => filteredData.indexOf(row) + 1,
    },
    { field: "propertyName", headerName: t("Property Name"), flex: 1 },
    { field: "month", headerName: t("Month"), flex: 1 },
    ...(value === "2"
      ? [{ field: "invoiceNo", headerName: t("Invoice No"), flex: 1 }]
      : []),
    {
      field: "amount",
      headerName: t("Amount"),
      flex: 1,
      renderCell: ({ row }) =>
        `Rs: ${(row.amount || 0) + (row.surchargeAmount || 0)}`,
    },
    {
      field: "status",
      headerName: t("Status"),
      flex: 1,
      renderCell: ({ row }) => (
        <Typography
          sx={{
            color:
              row.status === "Paid"
                ? "green"
                : row.status === "Overdue"
                ? "red"
                : "orange",
            fontWeight: "bold",
          }}
        >
          {row.status}
        </Typography>
      ),
    },
    {
      field: "dueDate",
      headerName: t("Due Date"),
      flex: 1,
      renderCell: ({ row }) => {
        const isOverdue =
          new Date(row.dueDate) < new Date() && row.status !== "Paid";
        return (
          <Typography
            sx={{
              color: isOverdue ? "red" : "inherit",
              fontWeight: isOverdue ? "bold" : "normal",
            }}
          >
            {new Date(row.dueDate).toLocaleDateString()}
          </Typography>
        );
      },
    },
    {
      field: "action",
      headerName: t("Action"),
      flex: 1,
      renderCell: ({ row }) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<PaymentIcon />}
          onClick={() => handleOpen(row)}
          disabled={row.status === "Paid"}
        >
          {row.status === "Paid" ? t("Paid") : t("Receive Amount")}
        </Button>
      ),
    },
  ];

  // ============= UI =============
  return (
    <Container maxWidth="lg" sx={{ p: 0 }}>
      <Fade in={true} timeout={800}>
        <Box>
          <Card
            elevation={0}
            sx={{ borderRadius: 3, borderColor: "divider", minHeight: "440px" }}
          >
            <CardContent sx={{ p: 2 }}>
              {/* Gradient Header */}
              <Box textAlign="center" mb={5}>
                <Typography
                  variant="h3"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    background:
                      "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: "22px",
                  }}
                >
                  {t("Accounts Receivable")}
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ marginBottom: "30px" }}
                >
                  {t("Track and manage pending payments and bills")}
                </Typography>
              </Box>

              {/* Created Section */}
              {filteredData.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <AccountBalanceWallet
                      sx={{ mr: 2, color: "primary.main", fontSize: 32 }}
                    />
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      {t("Receivable Records")} ({filteredData.length})
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Tabs + Table */}
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                  <TabList
                    onChange={(_, v) => setValue(v)}
                    sx={{
                      "& .MuiTab-root": { fontWeight: 600, textTransform: "none" },
                      "& .Mui-selected": { color: "primary.main" },
                      "& .MuiTabs-indicator": {
                        backgroundColor: "primary.main",
                        height: "3px",
                        borderRadius: "3px 3px 0 0",
                      },
                    }}
                  >
                    <Tab label={t("Maintenance")} value="1" />
                    {isAdmin && <Tab label={t("General Bills")} value="2" />}
                    {isAdmin && <Tab label={t("Water Bill")} value="3" />}
                  </TabList>
                </Box>

                <TabPanel value={value} sx={{ p: 0 }}>
                  {filteredData.length === 0 ? (
                    <Paper
                      sx={{
                        p: 4,
                        textAlign: "center",
                        backgroundColor: "#f5f5f5",
                        borderRadius: 2,
                      }}
                    >
                      <AccountBalanceWallet
                        sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                      />
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                      >
                        {t("No Records Found")}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {t("All your receivable records will appear here once created")}
                      </Typography>
                    </Paper>
                  ) : (
                    <DataGrid
                      rows={filteredData}
                      columns={columns}
                      getRowId={(row) => row._id}
                      slots={{ toolbar: GridToolbar }}
                      slotProps={{
                        toolbar: {
                          showQuickFilter: true,
                          quickFilterProps: { debounceMs: 500 },
                        },
                      }}
                      autoHeight
                      initialState={{
                        pagination: {
                          paginationModel: { page: 0, pageSize: 10 },
                        },
                      }}
                      pageSizeOptions={[5, 10, 25, 50]}
                      sx={{
                        "& .MuiDataGrid-root": { border: "none" },
                        "& .MuiDataGrid-cell": {
                          borderBottom: "1px solid #f0f0f0",
                          py: 1,
                        },
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
                </TabPanel>
              </TabContext>
            </CardContent>
          </Card>
        </Box>
      </Fade>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AccountsReceivable;
