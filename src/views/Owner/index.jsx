// /* eslint-disable prettier/prettier */
// import React, { useState, useEffect } from "react";
// import {
//   Stack,
//   Button,
//   Container,
//   Typography,
//   Card,
//   Box,
//   Popover,
//   MenuItem,
//   IconButton,
// } from "@mui/material";
// import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import { useNavigate } from "react-router";
// import { getApi } from "@/core/apis/api";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import { useTranslation } from "react-i18next";
// import { toast } from "react-toastify";
// import { Link } from "react-router-dom";
// import AddOwner from "./AddOwner";
// import EditOwner from "./EditOwner";
// import DeleteOwner from "./DeleteOwner";
// import TableStyle from "../../ui-component/TableStyle";
// import Iconify from "../../ui-component/iconify";
// import { urls } from "@/core/Constant/urls";
// import { IconHome } from "@tabler/icons";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { tokenPayload } from "@/helper";
// import BulkUploadOwner from "./BulkUploadOwner";

// const Owner = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const [openBulkUploadDialog, setOpenBulkUploadDialog] = useState(false);
//   const [dialogState, setDialogState] = useState({
//     add: false,
//     edit: false,
//     delete: false,
//   });
//   const [rowData, setRowData] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [ownerData, setOwnerData] = useState([]);
//   const payload = tokenPayload();

//   const fetchOwnerData = async () => {
//     try {
//       const response = await getApi(urls.owner.ownerdata, {
//         id: payload.companyId,
//       });
//       setOwnerData(response.data);
//     } catch (error) {
//       console.error("Error fetching owner data:", error);
//       toast.error(t("Failed to fetch owner data!"));
//     }
//   };

//   useEffect(() => {
//     fetchOwnerData();
//   }, [dialogState]);

//   const openDialog = (type, row = null) => {
//     setRowData(row);
//     setDialogState((prev) => ({ ...prev, [type]: true }));
//   };

//   const closeDialog = (type) => {
//     setDialogState((prev) => ({ ...prev, [type]: false }));
//     setRowData(null);
//   };

//   const handleOpenView = () => {
//     navigate(`/dashboard/owner/view?id=${rowData._id}`);
//   };

//   const handlePopoverOpen = (event, row) => {
//     setAnchorEl(event.currentTarget);
//     setRowData(row);
//   };

//   const handlePopoverClose = () => {
//     setAnchorEl(null);
//     setRowData(null);
//   };

//   const columns = [
//     {
//       field: "serialNo",
//       headerName: "S.No.",
//       width: 60,
//       renderCell: (params) =>
//         ownerData.findIndex((row) => row._id === params.row._id) + 1,
//     },
//     {
//       field: "ownerName",
//       headerName: t("Owner Name"),
//       flex: 1,
//       renderCell: (params) => (
//         <Button
//           variant="text"
//           color="primary"
//           onClick={() =>
//             navigate(`/dashboard/owner/view?id=${params.row._id}`)
//           }
//         >
//           {params.row.ownerName}
//         </Button>
//       ),
//     },
//     { field: "email", headerName: t("Email"), flex: 1 },
//     { field: "phoneNo", headerName: t("Phone No"), flex: 1 },
//     { field: "address", headerName: t("Address"), flex: 1 },
//     {
//       field: "action",
//       headerName: t("Action"),
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           <IconButton
//             aria-describedby={params?.row._id}
//             onClick={(event) => handlePopoverOpen(event, params.row)}
//           >
//             <MoreVertIcon />
//           </IconButton>
//           <Popover
//             open={Boolean(anchorEl) && rowData?._id === params?.row._id}
//             anchorEl={anchorEl}
//             onClose={handlePopoverClose}
//             anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//           >
//             <MenuItem onClick={() => openDialog("edit", rowData)}>
//               <EditIcon sx={{ mr: 1 }} />
//               {t("Edit")}
//             </MenuItem>
//             <MenuItem onClick={handleOpenView}>
//               <VisibilityIcon sx={{ mr: 1, color: "green" }} />
//               {t("View")}
//             </MenuItem>
//             <MenuItem
//               onClick={() => openDialog("delete", rowData)}
//               sx={{ color: "red" }}
//             >
//               <DeleteIcon sx={{ mr: 1, color: "red" }} />
//               {t("Delete")}
//             </MenuItem>
//           </Popover>
//         </>
//       ),
//     },
//   ];

//   return (
//     <>
//       {/* Dialogs */}
//       <AddOwner
//         open={dialogState.add}
//         handleClose={() => closeDialog("add")}
//       />
//       <EditOwner
//         open={dialogState.edit}
//         handleClose={() => closeDialog("edit")}
//         data={rowData}
//       />
//       <DeleteOwner
//         open={dialogState.delete}
//         handleClose={() => closeDialog("delete")}
//         id={rowData?._id}
//       />
//       <BulkUploadOwner
//         open={openBulkUploadDialog}
//         data={payload}
//         onClose={() => setOpenBulkUploadDialog(false)}
//       />

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
//           {/* Header */}
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
//                 {t("Landlord/Owner Management")}
//               </Typography>
//             </Stack>

//             <Stack direction="row" spacing={2}>
//               <Button
//                 variant="contained"
//                 startIcon={<Iconify icon="eva:plus-fill" />}
//                 onClick={() => openDialog("add")}
//                 sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
//               >
//                 {t("Add Owner")}
//               </Button>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={() => setOpenBulkUploadDialog(true)}
//                 sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
//               >
//                 {t("Bulk Upload Owners")}
//               </Button>
//             </Stack>
//           </Stack>

//           {/* Data Table */}
//         <Box sx={{ flexGrow: 1, minHeight: 0, display: "flex" }}>
//           <TableStyle sx={{ flexGrow: 1, display: "flex" }}>
//             <DataGrid
//               rows={ownerData}
//               columns={columns}
//               getRowId={(row) => row._id || row.id}
//               slots={{ toolbar: GridToolbar }}
//               slotProps={{ toolbar: { showQuickFilter: true } }}
//               sx={{
//                 flex: 1, // fills the remaining space only
//                 border: "none",
//                 "& .MuiDataGrid-columnHeaders": {
//                   backgroundColor: "rgba(25, 118, 210, 0.08)",
//                   fontWeight: "bold",
//                 },
//               }}
//             />
//           </TableStyle>
//         </Box>
//       </Card>
//     </Container>
//     </>
//   );
// };

// export default Owner;





/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
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
  IconButton,
  Paper,
  Stack,
} from "@mui/material";
import {
  Person as PersonIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  UploadFile as UploadFileIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { getApi } from "@/core/apis/api";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { urls } from "@/core/Constant/urls";
import AddOwner from "./AddOwner";
import EditOwner from "./EditOwner";
import DeleteOwner from "./DeleteOwner";
import BulkUploadOwner from "./BulkUploadOwner";
import { tokenPayload } from "@/helper";

const Owner = () => {
  const { t } = useTranslation();
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openBulkUpload, setOpenBulkUpload] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [ownerData, setOwnerData] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const payload = tokenPayload();

  const fetchOwnerData = async () => {
    try {
      const response = await getApi(urls.owner.ownerdata, {
        id: payload.companyId,
      });
      setOwnerData(response?.data || []);
    } catch (error) {
      console.error("Error fetching owners:", error);
      toast.error(t("Failed to fetch owner data!"));
    }
  };

  useEffect(() => {
    fetchOwnerData();
  }, [openAdd, openEdit, openDelete, openBulkUpload]);

  const handleCloseAdd = () => setOpenAdd(false);
  const handleCloseEdit = () => setOpenEdit(false);
  const handleCloseDelete = () => setOpenDelete(false);
  const handleCloseBulkUpload = () => setOpenBulkUpload(false);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleOpenEdit = (row) => {
    setRowData(row);
    setOpenEdit(true);
  };
  const handleOpenDelete = (row) => {
    setRowData(row);
    setOpenDelete(true);
  };
  const handleOpenBulkUpload = () => setOpenBulkUpload(true);

  const handleCloseSnackbar = () =>
    setSnackbar({ ...snackbar, open: false });

  // DataGrid Columns
  const columns = [
    {
      field: "serialNo",
      headerName: "S.No.",
      width: 80,
      renderCell: (params) => {
        const index = ownerData.findIndex((row) => row._id === params.row._id);
        return index + 1;
      },
    },
    {
      field: "ownerName",
      headerName: t("Owner Name"),
      flex: 1,
    },
    {
      field: "email",
      headerName: t("Email"),
      flex: 1,
    },
    {
      field: "phoneNo",
      headerName: t("Phone No"),
      flex: 1,
    },
    {
      field: "address",
      headerName: t("Address"),
      flex: 1,
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
            onClick={() => handleOpenEdit(params.row)}
            sx={{ mr: 1, color: "primary.main" }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{ mr: 1, color: "success.main" }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleOpenDelete(params.row)}
            sx={{ color: "error.main" }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ p: 0 }}>
      {/* Modals */}
      <AddOwner open={openAdd} handleClose={handleCloseAdd} />
      <EditOwner open={openEdit} handleClose={handleCloseEdit} data={rowData} />
      <DeleteOwner open={openDelete} handleClose={handleCloseDelete} id={rowData?._id} />
      <BulkUploadOwner open={openBulkUpload} onClose={handleCloseBulkUpload} data={payload} />

      <Fade in={true} timeout={800}>
        <Box>
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
                  {t("Landlord / Owner Management")}
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ marginBottom: "30px" }}
                >
                  {t("Manage landlords/owners and their details")}
                </Typography>
              </Box>

              {/* Created Section */}
              {ownerData.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PersonIcon
                      sx={{ mr: 2, color: "primary.main", fontSize: 32 }}
                    />
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      {t("Created Owners")} ({ownerData.length})
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={2}>
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
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
                        },
                      }}
                    >
                      {t("Add New Owner")}
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<UploadFileIcon />}
                      onClick={handleOpenBulkUpload}
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
                        },
                      }}
                    >
                      {t("Bulk Upload Owners")}
                    </Button>
                  </Stack>
                </Box>
              )}

              {/* Empty State or Table */}
              {ownerData.length === 0 ? (
                <Paper
                  sx={{
                    p: 4,
                    textAlign: "center",
                    backgroundColor: "#f5f5f5",
                    borderRadius: 2,
                  }}
                >
                  <PersonIcon
                    sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t("No Owners Created Yet")}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {t("Get started by adding your first owner")}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAdd}
                    sx={{ mt: 2, background: "#2196f3" }}
                  >
                    {t("Add New Owner")}
                  </Button>
                </Paper>
              ) : (
                <DataGrid
                  rows={ownerData}
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

export default Owner;
