
// import { useState, useEffect } from 'react';
// import {
//   Stack, Button, Container, Typography, Box, Card,
//   IconButton, Popover, MenuItem
// } from '@mui/material';
// import { IconHome } from '@tabler/icons';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router';
// import Iconify from '@/ui-component/iconify';
// import TableStyle from '@/ui-component/TableStyle';
// import { urls } from '@/core/Constant/urls';
// import { getApi } from '@/core/apis/api';
// import { tokenPayload } from '@/helper';
// import { Link } from 'react-router-dom';

// // Dialogs
// import AddServiceProvider from './AddServiceProvider';
// import EditServiceProvider from './EditSerivceProvider';
// import DeleteServiceProvider from './DeleteServiceProvider';
// import InvoicePopup from './InvoicePopup';

// // Icons
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import ReceiptIcon from '@mui/icons-material/Receipt';

// const payload = tokenPayload();
// const userRole = payload?.role;

// const ServiceProvider = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const [serviceData, setServiceData] = useState([]);
//   const [openAdd, setOpenAdd] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [openDelete, setOpenDelete] = useState(false);
//   const [openInvoice, setOpenInvoice] = useState(false);
//   const [rowData, setRowData] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [currentRow, setCurrentRow] = useState(null);

//   const fetchServiceData = async () => {
//     try {
//       const response = await getApi(urls.serviceProvider.getAll, {
//         id: payload.companyId,
//       });
//       setServiceData(response?.data || []);
//     } catch (error) {
//       setServiceData([]);
//     }
//   };

//   useEffect(() => {
//     fetchServiceData();
//   }, [openAdd, openDelete, openEdit]);

//   // --- Actions ---
//   const handleClick = (event, row) => {
//     setAnchorEl(event.currentTarget);
//     setCurrentRow(row);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//     setCurrentRow(null);
//   };
//   const handleOpenEdit = () => {
//     setRowData(currentRow);
//     setOpenEdit(true);
//     handleClose();
//   };
//   const handleOpenDelete = () => {
//     setRowData(currentRow);
//     setOpenDelete(true);
//     handleClose();
//   };
//   const handleOpenInvoice = () => {
//     setRowData(currentRow);
//     setOpenInvoice(true);
//     handleClose();
//   };

//   const columns = [
//     {
//       field: 'serialNo',
//       headerName: 'S.No.',
//       width: 60,
//       renderCell: (params) => {
//         const rowIndex = serviceData.findIndex((row) => row._id === params.row._id);
//         return rowIndex + 1;
//       },
//     },
//     { field: 'name', headerName: t('Service Provider Name'), flex: 1.5 },
//     { field: 'phoneNo', headerName: t('Phone No'), flex: 1 },
//     { field: 'workType', headerName: t('Work Type'), flex: 1 },
//     { field: 'numOfStaff', headerName: t('Number of Staff'), flex: 1 },
//     { field: 'monthlyCharges', headerName: t('Monthly Charges'), flex: 1 },
//     { field: 'address', headerName: t('Address'), flex: 1 },
//   ];

//   if (userRole !== 'tenant') {
//     columns.push({
//       field: 'action',
//       headerName: t('Action'),
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           <IconButton onClick={(event) => handleClick(event, params.row)}>
//             <MoreVertIcon />
//           </IconButton>
//           <Popover
//             open={Boolean(anchorEl) && currentRow?._id === params.row._id}
//             anchorEl={anchorEl}
//             onClose={handleClose}
//             anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//           >
//             <MenuItem onClick={handleOpenEdit}>
//               <EditIcon sx={{ mr: 1 }} /> {t('Edit')}
//             </MenuItem>
//             <MenuItem onClick={handleOpenDelete} sx={{ color: 'red' }}>
//               <DeleteIcon sx={{ mr: 1, color: 'red' }} /> {t('Delete')}
//             </MenuItem>
//             <MenuItem onClick={handleOpenInvoice}>
//               <ReceiptIcon sx={{ mr: 1 }} /> {t('Invoice')}
//             </MenuItem>
//           </Popover>
//         </>
//       ),
//     });
//   }

//   return (
//     <>
//       {/* Dialogs */}
//       <AddServiceProvider open={openAdd} handleClose={() => setOpenAdd(false)} />
//       <EditServiceProvider open={openEdit} handleClose={() => setOpenEdit(false)} data={rowData} />
//       <DeleteServiceProvider open={openDelete} handleClose={() => setOpenDelete(false)} id={rowData?._id} />
//       <InvoicePopup open={openInvoice} handleClose={() => setOpenInvoice(false)} data={rowData} />

//       {/* Consistent Layout */}
//       <Container maxWidth="lg">
//         <Card
//           sx={{
//             p: 0,
//             mt: 0,
//             height: "700px",
//             borderRadius: 3,
//             // boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           {/* Header inside same card */}
//           <Stack
//             direction="row"
//             alignItems="center"
//             justifyContent="space-between"
//             sx={{
//               mb: 1,
//               pb: 1,
//               borderBottom: "2px solid",
//               borderColor: "divider",
//             }}
//           >
//             <Stack direction="row" alignItems="center" spacing={1.5}>
//               <Box
//                 sx={{
//                   width: 42,
//                   height: 42,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   borderRadius: "50%",
//                   backgroundColor: "rgba(25, 118, 210, 0.1)",
//                 }}
//               >
//                 <Link to="/" style={{ textDecoration: "none" }}>
//                   <IconHome style={{ color: "#1976d2", fontSize: "1.5rem" }} />
//                 </Link>
//               </Box>

//               <Typography
//                 variant="h4"
//                 sx={{
//                   fontWeight: "bold",
//                   color: "primary.main",
//                   fontSize: "24px",
//                   letterSpacing: "0.5px",
//                 }}
//               >
//                 {t("Service Providers")}
//               </Typography>
//             </Stack>

//             {userRole !== "tenant" && (
//               <Button
//                 variant="contained"
//                 startIcon={<Iconify icon="eva:plus-fill" />}
//                 onClick={() => setOpenAdd(true)}
//                 sx={{
//                   borderRadius: 2,
//                   textTransform: "none",
//                   fontWeight: 500,
//                 }}
//               >
//                 {t("Add Service Provider")}
//               </Button>
//             )}
//           </Stack>

//           {/* DataGrid inside same card */}
//           <Box sx={{ flexGrow: 1 }}>
//             <DataGrid
//               rows={serviceData}
//               columns={columns}
//               getRowId={(row) => row._id}
//               slots={{ toolbar: GridToolbar }}
//               slotProps={{ toolbar: { showQuickFilter: true } }}
//               sx={{
//                 border: "none",
//                 "& .MuiDataGrid-columnHeaders": {
//                   backgroundColor: "rgba(25, 118, 210, 0.08)",
//                   fontWeight: "bold",
//                 },
//               }}
//             />
//           </Box>
//         </Card>
//       </Container>
//     </>
//   );
// };

// export default ServiceProvider;





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
  Snackbar,
  Alert,
} from "@mui/material";
import {
  People,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { getApi } from "@/core/apis/api";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { urls } from "@/core/Constant/urls";
import { tokenPayload } from "@/helper";

// Dialogs
import AddServiceProvider from "./AddServiceProvider";
import EditServiceProvider from "./EditSerivceProvider";
import DeleteServiceProvider from "./DeleteServiceProvider";
import InvoicePopup from "./InvoicePopup";

const payload = tokenPayload();
const userRole = payload?.role;

const ServiceProvider = () => {
  const { t } = useTranslation();

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [serviceData, setServiceData] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchServiceData = async () => {
    try {
      const response = await getApi(urls.serviceProvider.getAll, {
        id: payload.companyId,
      });
      setServiceData(response?.data || []);
    } catch (error) {
      toast.error(t("Failed to fetch service providers!"));
      setServiceData([]);
    }
  };

  useEffect(() => {
    fetchServiceData();
  }, [openAdd, openDelete, openEdit]);

  // Handlers
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const handleCloseEdit = () => setOpenEdit(false);
  const handleCloseDelete = () => setOpenDelete(false);
  const handleCloseInvoice = () => setOpenInvoice(false);

  const handleOpenEdit = (row) => {
    setRowData(row);
    setOpenEdit(true);
  };

  const handleOpenDelete = (row) => {
    setRowData(row);
    setOpenDelete(true);
  };

  const handleOpenInvoice = (row) => {
    setRowData(row);
    setOpenInvoice(true);
  };

  const handleCloseSnackbar = () =>
    setSnackbar({ ...snackbar, open: false });

  // Columns
  const columns = [
    {
      field: "serialNo",
      headerName: "S.No.",
      width: 80,
      renderCell: (params) => {
        const index = serviceData.findIndex(
          (row) => row._id === params.row._id
        );
        return index + 1;
      },
    },
    { field: "name", headerName: t("Service Provider Name"), flex: 1.5 },
    { field: "phoneNo", headerName: t("Phone No"), flex: 1 },
    { field: "workType", headerName: t("Work Type"), flex: 1 },
    { field: "numOfStaff", headerName: t("Number of Staff"), flex: 1 },
    { field: "monthlyCharges", headerName: t("Monthly Charges"), flex: 1 },
    { field: "address", headerName: t("Address"), flex: 1 },
  ];

  if (userRole !== "tenant") {
    columns.push({
      field: "actions",
      headerName: t("Actions"),
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleOpenEdit(params.row)}
            sx={{ mr: 1, color: "primary.main" }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleOpenDelete(params.row)}
            sx={{ mr: 1, color: "error.main" }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleOpenInvoice(params.row)}
            sx={{ color: "secondary.main" }}
          >
            <ReceiptIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    });
  }

  return (
    <Container maxWidth="lg" sx={{ p: 0 }}>
      {/* Dialogs */}
      <AddServiceProvider open={openAdd} handleClose={handleCloseAdd} />
      <EditServiceProvider
        open={openEdit}
        handleClose={handleCloseEdit}
        data={rowData}
      />
      <DeleteServiceProvider
        open={openDelete}
        handleClose={handleCloseDelete}
        id={rowData?._id}
      />
      <InvoicePopup
        open={openInvoice}
        handleClose={handleCloseInvoice}
        data={rowData}
      />

      {/* Main Card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          borderColor: "divider",
          minHeight: "440px",
        }}
      >
        <CardContent sx={{ p: 2 }}>
          {/* Header */}
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
              {t("Service Providers")}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ marginBottom: "30px" }}
            >
              {t("Manage and monitor service providers for your company")}
            </Typography>
          </Box>

          {/* Created Section */}
          {serviceData.length > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <People
                  sx={{ mr: 2, color: "primary.main", fontSize: 32 }}
                />
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {t("Created Service Providers")} ({serviceData.length})
                </Typography>
              </Box>
              {userRole !== "tenant" && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenAdd}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    fontSize: "1rem",
                    fontWeight: 600,
                    background: "#2196f3",
                    boxShadow: "0 4px 12px rgba(25,118,210,0.4)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
                      boxShadow: "0 6px 16px rgba(25,118,210,0.5)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {t("Add New Service Provider")}
                </Button>
              )}
            </Box>
          )}

          {/* Empty State or Table */}
          {serviceData.length === 0 ? (
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
              }}
            >
              <People sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {t("No Service Providers Added Yet")}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                {t("Get started by adding your first service provider")}
              </Typography>
              {userRole !== "tenant" && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenAdd}
                  sx={{ mt: 2, background: "#2196f3" }}
                >
                  {t("Add New Service Provider")}
                </Button>
              )}
            </Paper>
          ) : (
            <DataGrid
              rows={serviceData}
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
        </CardContent>
      </Card>

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

export default ServiceProvider;
