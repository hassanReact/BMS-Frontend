// import { useState, useEffect } from "react";
// import {
//   Stack,
//   Button,
//   Container,
//   Typography,
//   Box,
//   Card,
//   Popover,
//   MenuItem,
//   IconButton,
// } from "@mui/material";
// import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
// import { IconHome } from "@tabler/icons";
// import { Link, useNavigate } from "react-router-dom";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import Iconify from "../../ui-component/iconify";
// import TableStyle from "../../ui-component/TableStyle";
// import Addtenants from "./AddTenants";
// import { useTranslation } from "react-i18next";
// import { getApi } from "@/core/apis/api";
// import { urls } from "@/core/Constant/urls";
// import React from "react";
// import EditTenant from "./EditTenant";
// import DeleteTenant from "./DeleteTenant";
// import { tokenPayload } from "@/helper";
// import TabPanel from "@mui/lab/TabPanel";
// import Tab from "@mui/material/Tab";
// import TabContext from "@mui/lab/TabContext";
// import TabList from "@mui/lab/TabList";
// import BulkUploadTenant from "./BulkUpload";

// const Tenants = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const [openBulkUploadDialog, setOpenBulkUploadDialog] = useState(false);
//   const [openAdd, setOpenAdd] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [currentRow, setCurrentRow] = useState(null);
//   const [tenantData, setTenantData] = useState([]);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [openDelete, setOpenDelete] = useState(false);
//   const [rowData, setRowData] = useState(null);
//   const [value, setValue] = useState("1");

//   const payload = tokenPayload();
//   const userRole = payload.role;

//   const fetchTenantData = async () => {
//     try {
//       const response = await getApi(urls.tenant.getAllTenants, { id: payload.companyId });
//       setTenantData(response.data);
//     } catch {
//       setTenantData([]);
//     }
//   };

//   const fetchMyTenantData = async () => {
//     try {
//       const response = await getApi(urls.tenant.getMyTenants, { id: payload._id });
//       setTenantData(response.data);
//     } catch {
//       setTenantData([]);
//     }
//   };

//   useEffect(() => {
//     if (value === "1") {
//       fetchMyTenantData();
//     } else if (value === "2" && userRole === "companyAdmin") {
//       fetchTenantData();
//     }
//   }, [value, openAdd, openEdit, openDelete, userRole]);

//   const handleClick = (event, row) => {
//     setAnchorEl(event.currentTarget);
//     setCurrentRow(row);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//     setCurrentRow(null);
//   };
//   const handleChange = (event, newValue) => setValue(newValue);

//   const handleOpenEditTenant = () => {
//     setRowData(currentRow);
//     setOpenEdit(true);
//     handleClose();
//   };
//   const handleCloseEditTenant = () => setOpenEdit(false);

//   const handleOpenDeleteTenantDialog = () => {
//     setRowData(currentRow);
//     setOpenDelete(true);
//     handleClose();
//   };
//   const handleCloseDeleteTenantDialog = () => setOpenDelete(false);

//   const handleOpenView = () => navigate(`/dashboard/tenant/view?id=${currentRow._id}`);
//   const handleChangePassword = () =>
//     navigate(`/dashboard/tenant/changepassword?id=${currentRow._id}`);

//   const columns = [
//     {
//       field: "serialNo",
//       headerName: "S.No.",
//       width: 60,
//       renderCell: (params) =>
//         tenantData.findIndex((row) => row._id === params.row._id) + 1,
//     },
//     {
//       field: "tenantName",
//       headerName: t("Tenant Name"),
//       flex: 1,
//       renderCell: (params) => (
//         <Button
//           variant="text"
//           color="primary"
//           onClick={() => navigate(`/dashboard/tenant/view?id=${params.row._id}`)}
//         >
//           {params.row.tenantName}
//         </Button>
//       ),
//     },
//     { field: "email", headerName: t("Email"), flex: 1 },
//     { field: "phoneno", headerName: t("Phone No."), flex: 1 },
//     { field: "Creater", headerName: t("Created By"), flex: 1 },
//     {
//       field: "isOccupied",
//       headerName: t("Occupied/unOccupied"),
//       flex: 1,
//       renderCell: (params) => (
//         <Typography
//           sx={{
//             color: params.row.isOccupied ? "green" : "blue",
//             fontWeight: "bold",
//           }}
//         >
//           {params.row.isOccupied ? t("Occupied") : t("Not Occupied")}
//         </Typography>
//       ),
//     },
//     {
//       field: "action",
//       headerName: t("Action"),
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           <IconButton onClick={(e) => handleClick(e, params.row)}>
//             <MoreVertIcon />
//           </IconButton>
//           <Popover
//             open={Boolean(anchorEl) && currentRow?._id === params.row._id}
//             anchorEl={anchorEl}
//             onClose={handleClose}
//             anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//           >
//             <MenuItem onClick={handleOpenEditTenant}>
//               <EditIcon sx={{ mr: 1 }} /> {t("Edit")}
//             </MenuItem>
//             <MenuItem onClick={handleOpenView}>
//               <VisibilityIcon sx={{ mr: 1, color: "green" }} /> {t("View")}
//             </MenuItem>
//             <MenuItem onClick={handleOpenDeleteTenantDialog} sx={{ color: "red" }}>
//               <DeleteIcon sx={{ mr: 1, color: "red" }} /> {t("Delete")}
//             </MenuItem>
//             <MenuItem onClick={handleChangePassword}>
//               <ChangeCircleIcon sx={{ mr: 1, color: "green" }} /> {t("Change Password")}
//             </MenuItem>
//           </Popover>
//         </>
//       ),
//     },
//   ];

//   return (
//     <>
//       <Addtenants open={openAdd} handleClose={() => setOpenAdd(false)} />
//       <EditTenant open={openEdit} handleClose={handleCloseEditTenant} data={rowData} />
//       <DeleteTenant
//         open={openDelete}
//         handleClose={handleCloseDeleteTenantDialog}
//         id={rowData?._id}
//       />
//       <BulkUploadTenant open={openBulkUploadDialog} data={payload} onClose={() => setOpenBulkUploadDialog(false)} />

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
//                 {t("Tenants Management")}
//               </Typography>
//             </Stack>

//             <Stack direction="row" spacing={2}>
//               <Button
//                 variant="contained"
//                 startIcon={<Iconify icon="eva:plus-fill" />}
//                 onClick={() => setOpenAdd(true)}
//                 sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
//               >
//                 {t("Add Tenant")}
//               </Button>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={() => setOpenBulkUploadDialog(true)}
//                 sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
//               >
//                 {t("Bulk Upload Tenants")}
//               </Button>
//             </Stack>
//           </Stack>

//           {/* Table with Tabs */}
//           <Box sx={{ flexGrow: 1 }}>
//             <TableStyle>
//               <Card sx={{ flexGrow: 1 }}>
//                 <TabContext value={value}>
//                   <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//                     <TabList onChange={handleChange} aria-label="Tenant tabs">
//                       <Tab label={t("My Tenants")} value="1" />
//                       {userRole === "companyAdmin" && (
//                         <Tab label={t("All Tenants")} value="2" />
//                       )}
//                     </TabList>
//                   </Box>

//                   <div style={{ height: "600px", display: "flex", flexDirection: "column" }}>
//                     <TabPanel value="1" style={{ flex: 1, overflow: "hidden" }}>
//                       <DataGrid
//                         rows={tenantData}
//                         columns={columns}
//                         getRowId={(row) => row._id || row.id}
//                         slots={{ toolbar: GridToolbar }}
//                         slotProps={{ toolbar: { showQuickFilter: true } }}
//                       />
//                     </TabPanel>

//                     {userRole === "companyAdmin" && (
//                       <TabPanel value="2" style={{ flex: 1, overflow: "hidden" }}>
//                         <DataGrid
//                           rows={tenantData}
//                           columns={columns}
//                           getRowId={(row) => row._id || row.id}
//                           slots={{ toolbar: GridToolbar }}
//                           slotProps={{ toolbar: { showQuickFilter: true } }}
//                         />
//                       </TabPanel>
//                     )}
//                   </div>
//                 </TabContext>
//               </Card>
//             </TableStyle>
//           </Box>
//         </Card>
//       </Container>
//     </>
//   );
// };

// export default Tenants;




import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  Paper,
  IconButton,
  Fade,
} from "@mui/material";
import {
  People,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { getApi } from "@/core/apis/api";
import { urls } from "@/core/Constant/urls";
import { tokenPayload } from "@/helper";
import { useNavigate } from "react-router-dom";

// Dialogs
import Addtenants from "./AddTenants";
import EditTenant from "./EditTenant";
import DeleteTenant from "./DeleteTenant";
import BulkUploadTenant from "./BulkUpload";

const Tenants = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openBulkUploadDialog, setOpenBulkUploadDialog] = useState(false);

  const [rowData, setRowData] = useState(null);
  const [tenantData, setTenantData] = useState([]);

  const payload = tokenPayload();
  const userRole = payload.role;

  const fetchTenantData = async () => {
    try {
      const response =
        userRole === "companyAdmin"
          ? await getApi(urls.tenant.getAllTenants, { id: payload.companyId })
          : await getApi(urls.tenant.getMyTenants, { id: payload._id });
      setTenantData(response.data || []);
    } catch {
      setTenantData([]);
    }
  };

  useEffect(() => {
    fetchTenantData();
  }, [openAdd, openEdit, openDelete]);

  const handleOpenEdit = (row) => {
    setRowData(row);
    setOpenEdit(true);
  };
  const handleOpenDelete = (row) => {
    setRowData(row);
    setOpenDelete(true);
  };

  // Columns
  const columns = [
    {
      field: "serialNo",
      headerName: "S.No.",
      width: 80,
      renderCell: (params) =>
        tenantData.findIndex((row) => row._id === params.row._id) + 1,
    },
    {
      field: "tenantName",
      headerName: t("Tenant Name"),
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="text"
          color="primary"
          onClick={() =>
            navigate(`/dashboard/tenant/view?id=${params.row._id}`)
          }
        >
          {params.row.tenantName}
        </Button>
      ),
    },
    { field: "email", headerName: t("Email"), flex: 1 },
    { field: "phoneno", headerName: t("Phone No."), flex: 1 },
    { field: "Creater", headerName: t("Created By"), flex: 1 },
    {
      field: "isOccupied",
      headerName: t("Occupied/unOccupied"),
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            color: params.row.isOccupied ? "green" : "blue",
            fontWeight: "bold",
          }}
        >
          {params.row.isOccupied ? t("Occupied") : t("Not Occupied")}
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
            onClick={() => handleOpenEdit(params.row)}
            sx={{ mr: 1, color: "primary.main" }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleOpenDelete(params.row)}
            sx={{ color: "error.main" }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() =>
              navigate(`/dashboard/tenant/view?id=${params.row._id}`)
            }
            sx={{ color: "success.main" }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ p: 0 }}>
      {/* Modals */}
      <Addtenants open={openAdd} handleClose={() => setOpenAdd(false)} />
      <EditTenant open={openEdit} handleClose={() => setOpenEdit(false)} data={rowData} />
      <DeleteTenant open={openDelete} handleClose={() => setOpenDelete(false)} id={rowData?._id} />
      <BulkUploadTenant
        open={openBulkUploadDialog}
        data={payload}
        onClose={() => setOpenBulkUploadDialog(false)}
      />

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
                  {t("Tenants Management")}
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ marginBottom: "30px" }}
                >
                  {t("Manage and configure tenants for your projects")}
                </Typography>
              </Box>

              {/* Created Section */}
              {tenantData.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <People sx={{ mr: 2, color: "primary.main", fontSize: 32 }} />
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      {t("Created Tenants")} ({tenantData.length})
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenAdd(true)}
                      sx={{
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        fontSize: "1rem",
                        fontWeight: 600,
                        background: "#2196f3",
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
                        },
                      }}
                    >
                      {t("Add Tenant")}
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setOpenBulkUploadDialog(true)}
                      sx={{ borderRadius: 2, fontWeight: 600 }}
                    >
                      {t("Bulk Upload Tenants")}
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Empty State or Table */}
              {tenantData.length === 0 ? (
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
                    {t("No Tenants Created Yet")}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {t("Get started by creating your first tenant")}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenAdd(true)}
                    sx={{ mt: 2, background: "#2196f3" }}
                  >
                    {t("Add Tenant")}
                  </Button>
                </Paper>
              ) : (
                <DataGrid
                  rows={tenantData}
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
        </Box>
      </Fade>
    </Container>
  );
};

export default Tenants;
