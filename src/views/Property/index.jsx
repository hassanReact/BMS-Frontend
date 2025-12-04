// import React, { useState, useEffect } from "react";
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
// import { useNavigate } from "react-router";
// import Iconify from "../../ui-component/iconify";
// import TableStyle from "../../ui-component/TableStyle";
// import AddProperty from "./AddProperty";
// import { IconHome } from "@tabler/icons";
// import { useTranslation } from "react-i18next";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import { urls } from "@/core/Constant/urls";
// import { getApi } from "@/core/apis/api";
// import EditProperty from "./EditProperty";
// import DeleteProperty from "./DeleteProperty";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { tokenPayload } from "@/helper";
// import { Link } from "react-router-dom";
// import GenerateMonthlyBill from "../Booking/CreateBill";

// const Property = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const payload = tokenPayload();
//   const userRole = payload?.role;

//   const [openAdd, setOpenAdd] = useState(false);
//   const [propertyData, setPropertyData] = useState([]);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [openDelete, setOpenDelete] = useState(false);
//   const [rowData, setRowData] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [currentRow, setCurrentRow] = useState(null);
//   const [openBillModal, setOpenBillModal] = useState(false);
//   const [bookingData, setBookingData] = useState([]);

//   // --- Fetch Property Data ---
//   const fetchPropertyData = async () => {
//     try {
//       const response = await getApi(urls.property.propertyDataAll, { id: payload.companyId });
//       if (response?.data) {
//         const formatted = response.data.map((item) => ({
//           ...item,
//           propertyType: item?.typeId?.name,
//           projectName: item?.projectId?.projectName,
//           blockName: item?.blockId?.blockName,
//         }));
//         setPropertyData(formatted);
//       }
//     } catch {
//       setPropertyData([]);
//     }
//   };

//   useEffect(() => {
//     fetchPropertyData();
//   }, [openAdd, openDelete, openEdit]);

//   // --- Menu Handlers ---
//   const handleClick = (event, row) => {
//     setAnchorEl(event.currentTarget);
//     setCurrentRow(row);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//     setCurrentRow(null);
//   };

//   const handleOpenAdd = () => setOpenAdd(true);
//   const handleCloseAdd = () => setOpenAdd(false);
//   const handleOpenEdit = () => {
//     setRowData(currentRow);
//     setOpenEdit(true);
//     handleClose();
//   };
//   const handleCloseEdit = () => setOpenEdit(false);
//   const handleOpenDelete = () => {
//     setRowData(currentRow);
//     setOpenDelete(true);
//     handleClose();
//   };
//   const handleCloseDelete = () => setOpenDelete(false);
//   const handleOpenView = () => navigate(`/dashboard/property/view?id=${currentRow._id}`);

//   // --- Columns ---
//   const columns = [
//     {
//       field: "serialNo",
//       headerName: "S.No.",
//       width: 60,
//       renderCell: (params) => propertyData.findIndex((r) => r._id === params.row._id) + 1,
//     },
//     {
//       field: "propertyname",
//       headerName: t("Property Name"),
//       flex: 1,
//       renderCell: (params) => (
//         <Button
//           variant="text"
//           color="primary"
//           onClick={() => navigate(`/dashboard/property/view?id=${params.row._id}`)}
//         >
//           {params.row.propertyname}
//         </Button>
//       ),
//     },
//     { field: "propertyType", headerName: t("Property Type"), flex: 1 },
//     { field: "projectName", headerName: t("Project Name"), flex: 1 },
//     { field: "blockName", headerName: t("Block Name"), flex: 1 },
//     {
//       field: "isVacant",
//       headerName: t("Status"),
//       flex: 1,
//       renderCell: (params) => (
//         <Typography
//           sx={{
//             color: params.row.isVacant ? "red" : "green",
//             fontWeight: "bold",
//           }}
//         >
//           {params.row.isVacant ? t("Vacant") : t("Occupied")}
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
//             {userRole === "companyAdmin" && (
//               <>
//                 <MenuItem onClick={handleOpenEdit}>
//                   <EditIcon sx={{ mr: 1 }} /> {t("Edit")}
//                 </MenuItem>
//                 <MenuItem onClick={handleOpenDelete} sx={{ color: "red" }}>
//                   <DeleteIcon sx={{ mr: 1, color: "red" }} /> {t("Delete")}
//                 </MenuItem>
//               </>
//             )}
//             <MenuItem onClick={handleOpenView}>
//               <VisibilityIcon sx={{ mr: 1, color: "green" }} /> {t("View")}
//             </MenuItem>
//           </Popover>
//         </>
//       ),
//     },
//   ];

//   return (
//     <>
//       <AddProperty open={openAdd} handleClose={handleCloseAdd} />
//       <EditProperty open={openEdit} handleClose={handleCloseEdit} data={rowData} />
//       <DeleteProperty open={openDelete} handleClose={handleCloseDelete} id={rowData?._id || ""} />

//       {rowData?.tenantName && rowData?.propertyName && (
//         <GenerateMonthlyBill
//           open={openBillModal}
//           handleClose={() => setOpenBillModal(false)}
//           data={rowData}
//         />
//       )}

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
//                 {t("Property Management")}
//               </Typography>
//             </Stack>

//             {userRole === "companyAdmin" && (
//               <Button
//                 variant="contained"
//                 startIcon={<Iconify icon="eva:plus-fill" />}
//                 onClick={handleOpenAdd}
//                 sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
//               >
//                 {t("Add Property")}
//               </Button>
//             )}
//           </Stack>

//           {/* Table */}
//           <Box sx={{ flexGrow: 1 }}>
//             <TableStyle>
//               {/* <DataGrid
//                 rows={propertyData}
//                 columns={columns}
//                 getRowId={(row) => row._id}
//                 slots={{ toolbar: GridToolbar }}
//                 slotProps={{ toolbar: { showQuickFilter: true } }}
//                 sx={{
//                   border: "none",
//                   "& .MuiDataGrid-columnHeaders": {
//                         height: 400, 

//                     backgroundColor: "rgba(25, 118, 210, 0.08)",
//                     fontWeight: "bold",
//                   },
//                 }}
//               /> */}
//               <DataGrid
//   rows={propertyData}
//   columns={columns}
//   getRowId={(row) => row._id}
//   slots={{ toolbar: GridToolbar }}
//   slotProps={{ toolbar: { showQuickFilter: true } }}
//   sx={{
//     border: "none",
//     height: 400, // 👈 fixed height
//     "& .MuiDataGrid-columnHeaders": {
//       backgroundColor: "rgba(25, 118, 210, 0.08)",
//       fontWeight: "bold",
//     },
//   }}
// />

//             </TableStyle>
//           </Box>
//         </Card>
//       </Container>
//     </>
//   );
// };

// export default Property;





// import React, { useState, useEffect } from "react";
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
// import { useNavigate } from "react-router";
// import Iconify from "../../ui-component/iconify";
// import TableStyle from "../../ui-component/TableStyle";
// import AddProperty from "./AddProperty";
// import { IconHome } from "@tabler/icons";
// import { useTranslation } from "react-i18next";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import { urls } from "@/core/Constant/urls";
// import { getApi } from "@/core/apis/api";
// import EditProperty from "./EditProperty";
// import DeleteProperty from "./DeleteProperty";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { tokenPayload } from "@/helper";
// import { Link } from "react-router-dom";
// import GenerateMonthlyBill from "../Booking/CreateBill";

// const Property = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const payload = tokenPayload();
//   const userRole = payload?.role;

//   const [openAdd, setOpenAdd] = useState(false);
//   const [propertyData, setPropertyData] = useState([]);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [openDelete, setOpenDelete] = useState(false);
//   const [rowData, setRowData] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [currentRow, setCurrentRow] = useState(null);
//   const [openBillModal, setOpenBillModal] = useState(false);
//   const [bookingData, setBookingData] = useState([]);

//   // --- Fetch Property Data ---
//   const fetchPropertyData = async () => {
//     try {
//       const response = await getApi(urls.property.propertyDataAll, { id: payload.companyId });
//       if (response?.data) {
//         const formatted = response.data.map((item) => ({
//           ...item,
//           propertyType: item?.typeId?.name,
//           projectName: item?.projectId?.projectName,
//           blockName: item?.blockId?.blockName,
//         }));
//         setPropertyData(formatted);
//       }
//     } catch {
//       setPropertyData([]);
//     }
//   };

//   useEffect(() => {
//     fetchPropertyData();
//   }, [openAdd, openDelete, openEdit]);

//   // --- Menu Handlers ---
//   const handleClick = (event, row) => {
//     setAnchorEl(event.currentTarget);
//     setCurrentRow(row);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//     setCurrentRow(null);
//   };

//   const handleOpenAdd = () => setOpenAdd(true);
//   const handleCloseAdd = () => setOpenAdd(false);
//   const handleOpenEdit = () => {
//     setRowData(currentRow);
//     setOpenEdit(true);
//     handleClose();
//   };
//   const handleCloseEdit = () => setOpenEdit(false);
//   const handleOpenDelete = () => {
//     setRowData(currentRow);
//     setOpenDelete(true);
//     handleClose();
//   };
//   const handleCloseDelete = () => setOpenDelete(false);
//   const handleOpenView = () => navigate(`/dashboard/property/view?id=${currentRow._id}`);

//   // --- Columns ---
//   const columns = [
//     {
//       field: "serialNo",
//       headerName: "S.No.",
//       width: 60,
//       renderCell: (params) => propertyData.findIndex((r) => r._id === params.row._id) + 1,
//     },
//     {
//       field: "propertyname",
//       headerName: t("Property Name"),
//       flex: 1,
//       renderCell: (params) => (
//         <Button
//           variant="text"
//           color="primary"
//           onClick={() => navigate(`/dashboard/property/view?id=${params.row._id}`)}
//         >
//           {params.row.propertyname}
//         </Button>
//       ),
//     },
//     { field: "propertyType", headerName: t("Property Type"), flex: 1 },
//     { field: "projectName", headerName: t("Project Name"), flex: 1 },
//     { field: "blockName", headerName: t("Block Name"), flex: 1 },
//     {
//       field: "isVacant",
//       headerName: t("Status"),
//       flex: 1,
//       renderCell: (params) => (
//         <Typography
//           sx={{
//             color: params.row.isVacant ? "red" : "green",
//             fontWeight: "bold",
//           }}
//         >
//           {params.row.isVacant ? t("Vacant") : t("Occupied")}
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
//             {userRole === "companyAdmin" && (
//               <>
//                 <MenuItem onClick={handleOpenEdit}>
//                   <EditIcon sx={{ mr: 1 }} /> {t("Edit")}
//                 </MenuItem>
//                 <MenuItem onClick={handleOpenDelete} sx={{ color: "red" }}>
//                   <DeleteIcon sx={{ mr: 1, color: "red" }} /> {t("Delete")}
//                 </MenuItem>
//               </>
//             )}
//             <MenuItem onClick={handleOpenView}>
//               <VisibilityIcon sx={{ mr: 1, color: "green" }} /> {t("View")}
//             </MenuItem>
//           </Popover>
//         </>
//       ),
//     },
//   ];

//   return (
//     <>
//       <AddProperty open={openAdd} handleClose={handleCloseAdd} />
//       <EditProperty open={openEdit} handleClose={handleCloseEdit} data={rowData} />
//       <DeleteProperty open={openDelete} handleClose={handleCloseDelete} id={rowData?._id || ""} />

//       {rowData?.tenantName && rowData?.propertyName && (
//         <GenerateMonthlyBill
//           open={openBillModal}
//           handleClose={() => setOpenBillModal(false)}
//           data={rowData}
//         />
//       )}

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
//                 {t("Property Management")}
//               </Typography>
//             </Stack>

//             {userRole === "companyAdmin" && (
//               <Button
//                 variant="contained"
//                 startIcon={<Iconify icon="eva:plus-fill" />}
//                 onClick={handleOpenAdd}
//                 sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
//               >
//                 {t("Add Property")}
//               </Button>
//             )}
//           </Stack>

//           {/* Table */}
//           <Box sx={{ flexGrow: 1 }}>
//             <TableStyle>
//               {/* <DataGrid
//                 rows={propertyData}
//                 columns={columns}
//                 getRowId={(row) => row._id}
//                 slots={{ toolbar: GridToolbar }}
//                 slotProps={{ toolbar: { showQuickFilter: true } }}
//                 sx={{
//                   border: "none",
//                   "& .MuiDataGrid-columnHeaders": {
//                         height: 400, 

//                     backgroundColor: "rgba(25, 118, 210, 0.08)",
//                     fontWeight: "bold",
//                   },
//                 }}
//               /> */}
//               <DataGrid
//   rows={propertyData}
//   columns={columns}
//   getRowId={(row) => row._id}
//   slots={{ toolbar: GridToolbar }}
//   slotProps={{ toolbar: { showQuickFilter: true } }}
//   sx={{
//     border: "none",
//     height: 400, // 👈 fixed height
//     "& .MuiDataGrid-columnHeaders": {
//       backgroundColor: "rgba(25, 118, 210, 0.08)",
//       fontWeight: "bold",
//     },
//   }}
// />

//             </TableStyle>
//           </Box>
//         </Card>
//       </Container>
//     </>
//   );
// };

// export default Property;






import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  IconButton,
  Popover,
  MenuItem,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { getApi } from "@/core/apis/api";
import { urls } from "@/core/Constant/urls";
import { tokenPayload } from "@/helper";
import AddProperty from "./AddProperty";
import EditProperty from "./EditProperty";
import DeleteProperty from "./DeleteProperty";
import GenerateMonthlyBill from "../Booking/CreateBill";

const Property = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const payload = tokenPayload();
  const userRole = payload?.role;

  const [openAdd, setOpenAdd] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [openBillModal, setOpenBillModal] = useState(false);

  // Fetch Property Data
  const fetchPropertyData = async () => {
    try {
      const response = await getApi(urls.property.propertyDataAll, {
        id: payload.companyId,
      });
      if (response?.data) {
        const formatted = response.data.map((item) => ({
          ...item,
          propertyType: item?.typeId?.name,
          projectName: item?.projectId?.projectName,
          blockName: item?.blockId?.blockName,
        }));
        setPropertyData(formatted);
      } else {
        setPropertyData([]);
      }
    } catch {
      setPropertyData([]);
    }
  };

  useEffect(() => {
    fetchPropertyData();
  }, [openAdd, openDelete, openEdit]);

  // Menu handlers
  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const handleOpenAdd = () => setOpenAdd(true);
  const handleOpenEdit = () => {
    setRowData(currentRow);
    setOpenEdit(true);
    handleClose();
  };
  const handleOpenDelete = () => {
    setRowData(currentRow);
    setOpenDelete(true);
    handleClose();
  };
  const handleOpenView = () =>
    navigate(`/dashboard/property/view?id=${currentRow._id}`);

  // Columns
  const columns = [
    {
      field: "serialNo",
      headerName: "S.No.",
      width: 80,
      renderCell: (params) =>
        propertyData.findIndex((r) => r._id === params.row._id) + 1,
    },
    {
      field: "propertyname",
      headerName: t("Property Name"),
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="text"
          color="primary"
          onClick={() =>
            navigate(`/dashboard/property/view?id=${params.row._id}`)
          }
        >
          {params.row.propertyname}
        </Button>
      ),
    },
    { field: "propertyType", headerName: t("Property Type"), flex: 1 },
    { field: "projectName", headerName: t("Project Name"), flex: 1 },
    { field: "blockName", headerName: t("Block Name"), flex: 1 },
    {
      field: "isVacant",
      headerName: t("Status"),
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            color: params.row.isVacant ? "red" : "green",
            fontWeight: "bold",
          }}
        >
          {params.row.isVacant ? t("Vacant") : t("Occupied")}
        </Typography>
      ),
    },
    {
      field: "action",
      headerName: t("Action"),
      flex: 0.6,
      renderCell: (params) => (
        <>
          <IconButton onClick={(e) => handleClick(e, params.row)}>
            <MoreVertIcon />
          </IconButton>
          <Popover
            open={Boolean(anchorEl) && currentRow?._id === params.row._id}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            {userRole === "companyAdmin" && (
              <>
                <MenuItem onClick={handleOpenEdit}>
                  <EditIcon sx={{ mr: 1 }} /> {t("Edit")}
                </MenuItem>
                <MenuItem onClick={handleOpenDelete} sx={{ color: "red" }}>
                  <DeleteIcon sx={{ mr: 1, color: "red" }} /> {t("Delete")}
                </MenuItem>
              </>
            )}
            <MenuItem onClick={handleOpenView}>
              <VisibilityIcon sx={{ mr: 1, color: "green" }} /> {t("View")}
            </MenuItem>
          </Popover>
        </>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ p: 0 }}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
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
              {t("Property Management")}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Manage and organize all properties efficiently
            </Typography>
          </Box>

          {/* Created + Add button */}
          {propertyData.length > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <HomeIcon
                  sx={{ mr: 2, color: "primary.main", fontSize: 32 }}
                />
                <Typography variant="h5" fontWeight="bold" color="primary">
                  Created Properties ({propertyData.length})
                </Typography>
              </Box>
              {userRole === "companyAdmin" && (
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
                  }}
                >
                  {t("Add Property")}
                </Button>
              )}
            </Box>
          )}

          {/* Table or Empty State */}
          {propertyData.length === 0 ? (
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
              }}
            >
              <HomeIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Properties Available
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Get started by adding your first property
              </Typography>
              {userRole === "companyAdmin" && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenAdd}
                >
                  {t("Add Property")}
                </Button>
              )}
            </Paper>
          ) : (
            <DataGrid
              rows={propertyData}
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
                "& .MuiDataGrid-row:hover": { backgroundColor: "#f5f5f5" },
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* CRUD Modals */}
      <AddProperty open={openAdd} handleClose={() => setOpenAdd(false)} />
      <EditProperty
        open={openEdit}
        handleClose={() => setOpenEdit(false)}
        data={rowData}
      />
      <DeleteProperty
        open={openDelete}
        handleClose={() => setOpenDelete(false)}
        id={rowData?._id || ""}
      />
      {rowData?.tenantName && rowData?.propertyName && (
        <GenerateMonthlyBill
          open={openBillModal}
          handleClose={() => setOpenBillModal(false)}
          data={rowData}
        />
      )}
    </Container>
  );
};

export default Property;
