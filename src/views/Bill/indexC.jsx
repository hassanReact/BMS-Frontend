// /* eslint-disable react/jsx-no-undef */
// /* eslint-disable prettier/prettier */
// /* eslint-disable react/prop-types */
// import { useState, useEffect } from 'react';
// import {
//   Stack,
//   Button,
//   Container,
//   Typography,
//   Card,
//   Box,
//   IconButton,
//   Grid,
//   Popover,
//   Breadcrumbs,
//   MenuItem,
// } from '@mui/material';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { getApi } from '@/core/apis/api';
// import { Link } from 'react-router-dom';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import EditIcon from '@mui/icons-material/Edit';
// import TableStyle from '../../ui-component/TableStyle';
// import { IconHome } from '@tabler/icons';
// import DeleteIcon from '@mui/icons-material/Delete';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import { useTranslation } from 'react-i18next';
// import { urls } from '@/core/Constant/urls';
// import { tokenPayload } from '@/helper';
// import { useNavigate } from 'react-router-dom';
// import DeleteBill from './billDelete';
// import GenerateMonthlyBill from '@/views/Booking/CreateBill';

// const BillC = () => {
//   const { t } = useTranslation();
//   const [openDelete, setOpenDelete] = useState(false);
//   const [billData, setBillData] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [rowData, setRowData] = useState({});
//   const [currentRow, setCurrentRow] = useState(null);
//   const [openBillModal, setOpenBillModal] = useState(false);
//   const navigate = useNavigate();
//   const payload = tokenPayload();
//   const userRole = payload.role;

//   const fetchBillData = async () => {
//     const response = await getApi(urls.bill.getAllBill, { id: payload.companyId });

//     const formattedData = response.data.map((item) => {
//       const billingDate = new Date(item.billingMonth);
//       const formattedBillingMonth = `${billingDate.toLocaleString('default', { month: 'long' })} ${billingDate.getFullYear()}`; // Format as "Month Year"

//       return {
//         ...item,
//         tenantName: item.tenantId?.tenantName,
//         propertyName: item.propertyId?.propertyname,
//         billingMonth: formattedBillingMonth,
//       };
//     });

//     setBillData(formattedData);
//   };

//   useEffect(() => {
//     fetchBillData();
//   }, [openDelete]);

//   console.log("billData: ", billData);

//   const handleClick = (event, row) => {
//     setAnchorEl(event.currentTarget);
//     setCurrentRow(row);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setCurrentRow(null);
//   };

//   const handleOpenCreateBill = () => {
//   if (currentRow) {
//     // Check if currentRow is a bill (has invoiceNo) or a booking/property
//     const isBillRow = currentRow.invoiceNo || currentRow.totalBillAmount;
    
//     if (isBillRow) {
//       // This is an existing bill - edit mode
//       setRowData({ ...currentRow, mode: 'edit' });
//     } else {
//       // This is a booking/property - create mode
//       const activeBooking = billData.find(
//         (bill) => bill.propertyId?._id === currentRow._id || bill.propertyId === currentRow._id
//       );

//       if (activeBooking) {
//         setRowData({ ...activeBooking, mode: 'edit' });
//       } else {
//         setRowData({ 
//           ...currentRow, 
//           tenantName: 'N/A', 
//           propertyName: currentRow.propertyname || currentRow.propertyName,
//           mode: 'create' 
//         });
//       }
//     }

//     setOpenBillModal(true);
//     handleClose();
//   }
// };

// const handleCloseCreateBill = () => setOpenBillModal(false);

//   const handleOpenDeleteBill = () => {
//     setRowData(currentRow);
//     setOpenDelete(true);
//     handleClose();
//   };

//   const handleCloseDeleteBill = () => setOpenDelete(false);

//   const handleOpenView = () => {
//     navigate(`/dashboard/billC/view?id=${currentRow._id}`);
//   };

//   const breadcrumbs = [
//     <Link key="home" to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
//       <IconHome />
//     </Link>,
//     <Typography key="company" color="text.primary">
//       {t('Bill Management')}
//     </Typography>,
//   ];

//   const columns = [
//     {
//       field: 'serialNo',
//       headerName: 'S.No.',
//       width: 30,
//       renderCell: (params) => {
//         const rowIndex = billData.findIndex((row) => row._id === params.row._id);
//         return rowIndex + 1;
//       },
//     },
//     {
//       field: 'tenantName',
//       headerName: t('Tenant Name'),
//       // headerName: t('Resident Name'),
//       flex: 1,
//       renderCell: (params) => (
//         <Button
//           variant="text"
//           color="primary"
//           onClick={() => navigate(`/dashboard/billC/view?id=${params.row._id}`)}
//         >
//           {params.row.tenantName}
//         </Button>
//       ),
//     },
//     {
//       field: 'propertyName',
//       headerName: t('Property Name'),
//       flex: 1,
//     },
//     {
//       field: 'paymentType',
//       headerName: t('Payment Type'),
//       flex: 1,
//     },
//     {
//       field: 'billingMonth',
//       headerName: t('Billing Month'),
//       flex: 1,
//     },
//     {
//       field: 'totalBillAmount',
//       headerName: t('Total Bill Amount'),
//       flex: 1,
//     },
//     {
//       field: 'name',
//       headerName: t('Booking Creator'),
//       flex: 1,
//     },
//     {
//       field: 'status',
//       headerName: t('Status'),
//       flex: 1,
//       renderCell: (params) => (
//         <Typography
//           style={{
//             color: params.row.status ? 'green' : 'red',
//             fontWeight: 'bold',
//           }}
//         >
//           {params.row.status ? t('Paid') : t('Pending')}
//         </Typography>
//       ),
//     },
//     {
//       field: 'action',
//       headerName: t('Action'),
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           <IconButton
//             aria-describedby={params.row._id}
//             onClick={(event) => handleClick(event, params.row)}
//           >
//             <MoreVertIcon />
//           </IconButton>
//           <Popover
//             id={params.row._id}
//             open={Boolean(anchorEl) && currentRow?._id === params.row._id}
//             anchorEl={anchorEl}
//             onClose={handleClose}
//             anchorOrigin={{
//               vertical: 'bottom',
//               horizontal: 'left',
//             }}
//           >
//             <MenuItem onClick={handleOpenCreateBill}>
//               <EditIcon style={{ marginRight: '8px', color: 'green' }} />
//               {t('edit')}
//             </MenuItem>
//             <MenuItem onClick={handleOpenView}>
//               <VisibilityIcon style={{ marginRight: '8px', color: 'green' }} />
//               {t('view')}
//             </MenuItem>
//             {userRole === 'companyAdmin' && (
//               <MenuItem onClick={handleOpenDeleteBill} sx={{ color: 'red' }} disableRipple>
//                 <DeleteIcon style={{ marginRight: '8px', color: 'red' }} />
//                 {t('Delete')}
//               </MenuItem>
//             )}
//           </Popover>
//         </>
//       ),
//     },
//   ];

//   return (
//     <>
//       <DeleteBill open={openDelete} handleClose={handleCloseDeleteBill} id={rowData?._id} />
//       {openBillModal && rowData && (
//     <GenerateMonthlyBill open={openBillModal} handleClose={handleCloseCreateBill} data={rowData} mode={rowData.mode} />
// )}

//       <Container>
//         <Grid item xs={12}>
//           <Card sx={{ p: 2, mb: 2 }}>
//             <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
//               <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                 {t('Bill Management')}
//                 <Breadcrumbs separator="›" aria-label="breadcrumb">
//                   {breadcrumbs}
//                 </Breadcrumbs>
//               </Typography>
//             </Stack>
//           </Card>
//         </Grid>

//         <TableStyle>
//           <Box width="100%">
//             <Card style={{ height: '600px', paddingTop: '15px' }}>
//               <DataGrid
//                 rows={billData}
//                 columns={columns}
//                 getRowId={(row) => row._id || row.id}
//                 slots={{ toolbar: GridToolbar }}
//                 slotProps={{ toolbar: { showQuickFilter: true } }}
//               />
//             </Card>
//           </Box>
//         </TableStyle>
//       </Container>
//     </>
//   );
// };

// export default BillC;











// import { useState, useEffect } from 'react';
// import {
//   Stack,
//   Button,
//   Container,
//   Typography,
//   Card,
//   Box,
//   IconButton,
//   Grid,
//   Popover,
//   Breadcrumbs,
//   MenuItem,
// } from '@mui/material';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { getApi } from '@/core/apis/api';
// import { Link } from 'react-router-dom';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import EditIcon from '@mui/icons-material/Edit';
// import TableStyle from '../../ui-component/TableStyle';
// import { IconHome } from '@tabler/icons';
// import DeleteIcon from '@mui/icons-material/Delete';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import { useTranslation } from 'react-i18next';
// import { urls } from '@/core/Constant/urls';
// import { tokenPayload } from '@/helper';
// import { useNavigate } from 'react-router-dom';
// import DeleteBill from './billDelete';
// import GenerateMonthlyBill from '@/views/Booking/CreateBill';

// const BillC = () => {
//   const { t } = useTranslation();
//   const [openDelete, setOpenDelete] = useState(false);
//   const [billData, setBillData] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [rowData, setRowData] = useState({});
//   const [currentRow, setCurrentRow] = useState(null);
//   const [openBillModal, setOpenBillModal] = useState(false);
//   const navigate = useNavigate();
//   const payload = tokenPayload();
//   const userRole = payload.role;

//   const fetchBillData = async () => {
//     const response = await getApi(urls.bill.getAllBill, { id: payload.companyId });

//     const formattedData = response.data.map((item) => {
//       const billingDate = new Date(item.billingMonth);
//       const formattedBillingMonth = `${billingDate.toLocaleString('default', { month: 'long' })} ${billingDate.getFullYear()}`; // Format as "Month Year"

//       return {
//         ...item,
//         tenantName: item.tenantId?.tenantName,
//         propertyName: item.propertyId?.propertyname,
//         billingMonth: formattedBillingMonth,
//       };
//     });

//     setBillData(formattedData);
//   };

//   useEffect(() => {
//     fetchBillData();
//   }, [openDelete]);

//   console.log("billData: ", billData);

//   const handleClick = (event, row) => {
//     setAnchorEl(event.currentTarget);
//     setCurrentRow(row);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setCurrentRow(null);
//   };

//   const handleOpenCreateBill = () => {
//   if (currentRow) {
//     // Check if currentRow is a bill (has invoiceNo) or a booking/property
//     const isBillRow = currentRow.invoiceNo || currentRow.totalBillAmount;
    
//     if (isBillRow) {
//       // This is an existing bill - edit mode
//       setRowData({ ...currentRow, mode: 'edit' });
//     } else {
//       // This is a booking/property - create mode
//       const activeBooking = billData.find(
//         (bill) => bill.propertyId?._id === currentRow._id || bill.propertyId === currentRow._id
//       );

//       if (activeBooking) {
//         setRowData({ ...activeBooking, mode: 'edit' });
//       } else {
//         setRowData({ 
//           ...currentRow, 
//           tenantName: 'N/A', 
//           propertyName: currentRow.propertyname || currentRow.propertyName,
//           mode: 'create' 
//         });
//       }
//     }

//     setOpenBillModal(true);
//     handleClose();
//   }
// };

// const handleCloseCreateBill = () => setOpenBillModal(false);

//   const handleOpenDeleteBill = () => {
//     setRowData(currentRow);
//     setOpenDelete(true);
//     handleClose();
//   };

//   const handleCloseDeleteBill = () => setOpenDelete(false);

//   const handleOpenView = () => {
//     navigate(`/dashboard/billC/view?id=${currentRow._id}`);
//   };

//   const breadcrumbs = [
//     <Link key="home" to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
//       <IconHome />
//     </Link>,
   
//   ];

//   const columns = [
//     {
//       field: 'serialNo',
//       headerName: 'S.No.',
//       width: 30,
//       renderCell: (params) => {
//         const rowIndex = billData.findIndex((row) => row._id === params.row._id);
//         return rowIndex + 1;
//       },
//     },
//     {
//       field: 'tenantName',
//       headerName: t('Tenant Name'),
//       // headerName: t('Resident Name'),
//       flex: 1,
//       renderCell: (params) => (
//         <Button
//           variant="text"
//           color="primary"
//           onClick={() => navigate(`/dashboard/billC/view?id=${params.row._id}`)}
//         >
//           {params.row.tenantName}
//         </Button>
//       ),
//     },
//     {
//       field: 'propertyName',
//       headerName: t('Property Name'),
//       flex: 1,
//     },
//     {
//       field: 'paymentType',
//       headerName: t('Payment Type'),
//       flex: 1,
//     },
//     {
//       field: 'billingMonth',
//       headerName: t('Billing Month'),
//       flex: 1,
//     },
//     {
//       field: 'totalBillAmount',
//       headerName: t('Total Bill Amount'),
//       flex: 1,
//     },
//     {
//       field: 'name',
//       headerName: t('Booking Creator'),
//       flex: 1,
//     },
//     {
//       field: 'status',
//       headerName: t('Status'),
//       flex: 1,
//       renderCell: (params) => (
//         <Typography
//           style={{
//             color: params.row.status ? 'green' : 'red',
//             fontWeight: 'bold',
//           }}
//         >
//           {params.row.status ? t('Paid') : t('Pending')}
//         </Typography>
//       ),
//     },
//     {
//       field: 'action',
//       headerName: t('Action'),
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           <IconButton
//             aria-describedby={params.row._id}
//             onClick={(event) => handleClick(event, params.row)}
//           >
//             <MoreVertIcon />
//           </IconButton>
//           <Popover
//             id={params.row._id}
//             open={Boolean(anchorEl) && currentRow?._id === params.row._id}
//             anchorEl={anchorEl}
//             onClose={handleClose}
//             anchorOrigin={{
//               vertical: 'bottom',
//               horizontal: 'left',
//             }}
//           >
//             <MenuItem onClick={handleOpenCreateBill}>
//               <EditIcon style={{ marginRight: '8px', color: 'green' }} />
//               {t('edit')}
//             </MenuItem>
//             <MenuItem onClick={handleOpenView}>
//               <VisibilityIcon style={{ marginRight: '8px', color: 'green' }} />
//               {t('view')}
//             </MenuItem>
//             {userRole === 'companyAdmin' && (
//               <MenuItem onClick={handleOpenDeleteBill} sx={{ color: 'red' }} disableRipple>
//                 <DeleteIcon style={{ marginRight: '8px', color: 'red' }} />
//                 {t('Delete')}
//               </MenuItem>
//             )}
//           </Popover>
//         </>
//       ),
//     },
//   ];

//   return (
//     <>
//       <DeleteBill open={openDelete} handleClose={handleCloseDeleteBill} id={rowData?._id} />
//       {openBillModal && rowData && (
//     <GenerateMonthlyBill open={openBillModal} handleClose={handleCloseCreateBill} data={rowData} mode={rowData.mode} />
// )}
// <Container maxWidth="lg">
//   <Card
//     sx={{
//       p: 0,
//       mt: 0,
//       height: "700px",
//       borderRadius: 3,
//       // boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
//       display: "flex",
//       flexDirection: "column",
//     }}
//   >
//     {/* Heading in same card */}
//     <Stack
//       direction="row"
//       alignItems="center"
//       justifyContent="space-between"
//       sx={{
//         mb: 1,
//         pb: 1,
//         borderBottom: "2px solid",
//         borderColor: "divider",
//       }}
//     >
//       <Stack spacing={1}>
//         <Stack direction="row" alignItems="center" spacing={1.5}>
//           {/* Home Icon */}
//           <Box
//             sx={{
//               width: 42,
//               height: 42,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               borderRadius: "50%",
//               backgroundColor: "rgba(25, 118, 210, 0.1)",
//             }}
//           >
//             <Link to="/" style={{ textDecoration: "none" }}>
//               <IconHome style={{ color: "#1976d2", fontSize: "1.5rem" }} />
//             </Link>
//           </Box>

//           {/* Title */}
//           <Typography
//             variant="h4"
//             sx={{
//               fontWeight: "bold",
//               color: "primary.main",
//               fontSize: "24px",
//               letterSpacing: "0.5px",
//             }}
//           >
//             {t("Bill Managementss")}
//           </Typography>
//         </Stack>
//       </Stack>
//     </Stack>

//     {/* DataGrid inside same card */}
//     <Box sx={{ flexGrow: 1 }}>
//       <DataGrid
//         rows={billData}
//         columns={columns}
//         getRowId={(row) => row._id || row.id}
//         slots={{ toolbar: GridToolbar }}
//         slotProps={{ toolbar: { showQuickFilter: true } }}
//         sx={{
//           border: "none",
//           "& .MuiDataGrid-columnHeaders": {
//             backgroundColor: "rgba(25, 118, 210, 0.08)",
//             fontWeight: "bold",
//           },
//         }}
//       />
//     </Box>
//   </Card>
// </Container>

//     </>
//   );
// };

// export default BillC;



import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  IconButton,
  Paper,
  Stack,
} from "@mui/material";
import {
  ReceiptLong,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { getApi } from "@/core/apis/api";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { urls } from "@/core/Constant/urls";
import { tokenPayload } from "@/helper";
import { useNavigate } from "react-router-dom";
import DeleteBill from "./billDelete";
import GenerateMonthlyBill from "@/views/Booking/CreateBill";

const BillC = () => {
  const { t } = useTranslation();
  const [openDelete, setOpenDelete] = useState(false);
  const [billData, setBillData] = useState([]);
  const [rowData, setRowData] = useState({});
  const [openBillModal, setOpenBillModal] = useState(false);
  const navigate = useNavigate();
  const payload = tokenPayload();
  const userRole = payload.role;

  const fetchBillData = async () => {
    try {
      const response = await getApi(urls.bill.getAllBill, {
        id: payload.companyId,
      });

      const formattedData = response.data.map((item) => {
        const billingDate = new Date(item.billingMonth);
        const formattedBillingMonth = `${billingDate.toLocaleString("default", {
          month: "long",
        })} ${billingDate.getFullYear()}`;

        return {
          ...item,
          tenantName: item.tenantId?.tenantName,
          propertyName: item.propertyId?.propertyname,
          billingMonth: formattedBillingMonth,
        };
      });

      setBillData(formattedData);
    } catch (err) {
      console.error(err);
      toast.error(t("Failed to fetch bills"));
    }
  };

  useEffect(() => {
    fetchBillData();
  }, [openDelete, openBillModal]);

  const handleOpenCreateBill = (row) => {
    setRowData({ ...row, mode: "edit" });
    setOpenBillModal(true);
  };

  const handleCloseCreateBill = () => setOpenBillModal(false);

  const handleOpenDeleteBill = (row) => {
    setRowData(row);
    setOpenDelete(true);
  };

  const handleCloseDeleteBill = () => setOpenDelete(false);

  const handleOpenView = (row) => {
    navigate(`/dashboard/billC/view?id=${row._id}`);
  };

  // DataGrid Columns
  const columns = [
    {
      field: "serialNo",
      headerName: "S.No.",
      width: 80,
      renderCell: (params) => {
        const index = billData.findIndex((row) => row._id === params.row._id);
        return index + 1;
      },
    },
    {
      field: "tenantName",
      headerName: t("Tenant Name"),
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="text"
          color="primary"
          onClick={() => handleOpenView(params.row)}
        >
          {params.row.tenantName}
        </Button>
      ),
    },
    {
      field: "propertyName",
      headerName: t("Property Name"),
      flex: 1,
    },
    {
      field: "paymentType",
      headerName: t("Payment Type"),
      flex: 1,
    },
    {
      field: "billingMonth",
      headerName: t("Billing Month"),
      flex: 1,
    },
    {
      field: "totalBillAmount",
      headerName: t("Total Bill Amount"),
      flex: 1,
    },
    {
      field: "name",
      headerName: t("Booking Creator"),
      flex: 1,
    },
    {
      field: "status",
      headerName: t("Status"),
      flex: 1,
      renderCell: (params) => (
        <Typography
          style={{
            color: params.row.status ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {params.row.status ? t("Paid") : t("Pending")}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: t("Actions"),
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleOpenCreateBill(params.row)}
            sx={{ mr: 1, color: "primary.main" }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleOpenView(params.row)}
            sx={{ mr: 1, color: "success.main" }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          {userRole === "companyAdmin" && (
            <IconButton
              size="small"
              onClick={() => handleOpenDeleteBill(params.row)}
              sx={{ color: "error.main" }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ p: 0 }}>
      {/* Modals */}
      <DeleteBill
        open={openDelete}
        handleClose={handleCloseDeleteBill}
        id={rowData?._id}
      />
      {openBillModal && rowData && (
        <GenerateMonthlyBill
          open={openBillModal}
          handleClose={handleCloseCreateBill}
          data={rowData}
          mode={rowData.mode}
        />
      )}

      <Card elevation={0} sx={{ borderRadius: 3, minHeight: "440px" }}>
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
              {t("Bill Management")}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ marginBottom: "30px" }}
            >
              {t("Manage and monitor bills for tenants and properties")}
            </Typography>
          </Box>

          {/* Created Section */}
          {billData.length > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ReceiptLong
                  sx={{ mr: 2, color: "primary.main", fontSize: 32 }}
                />
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {t("Created Bills")} ({billData.length})
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenBillModal(true)}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  fontSize: "1rem",
                  fontWeight: 600,
                  background: "#2196f3",
                  boxShadow: "0 4px 12px rgba(25,118,210,0.4)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {t("Add New Bill")}
              </Button>
            </Box>
          )}

          {/* Empty State or Table */}
          {billData.length === 0 ? (
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
              }}
            >
              <ReceiptLong
                sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {t("No Bills Created Yet")}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                {t("Get started by generating your first bill")}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenBillModal(true)}
                sx={{ mt: 2, background: "#2196f3" }}
              >
                {t("Add New Bill")}
              </Button>
            </Paper>
          ) : (
            <DataGrid
              rows={billData}
              columns={columns}
              getRowId={(row) => row._id || row.id}
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
        </CardContent>
      </Card>
    </Container>
  );
};

export default BillC;
