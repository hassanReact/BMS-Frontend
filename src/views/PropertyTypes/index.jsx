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
// import { getApi } from "@/core/apis/api";
// import { useTranslation } from "react-i18next";
// import { toast } from "react-toastify";
// import { Link } from "react-router-dom";
// import TableStyle from "../../ui-component/TableStyle";
// import Iconify from "../../ui-component/iconify";
// import { urls } from "@/core/Constant/urls";
// import { IconHome } from "@tabler/icons";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import AddPropertyTypes from "./AddPropertyTypes";
// import EditPropertyTypes from "./EditPropertyType";
// import DeletePropertyType from "./DeletePropertyType";
// import { tokenPayload } from "@/helper";

// const PropertyTypes = () => {
//   const { t } = useTranslation();
//   const [openEdit, setOpenEdit] = useState(false);
//   const [openAdd, setOpenAdd] = useState(false);
//   const [openDelete, setOpenDelete] = useState(false);
//   const [rowData, setRowData] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [ownerData, setOwnerData] = useState([]);
//   const [currentRow, setCurrentRow] = useState(null);

//   const payload = tokenPayload();

//   const fetchPropertyData = async () => {
//     try {
//       const response = await getApi(urls.propertyTypes.getdata, { id: payload._id });
//       setOwnerData(response?.data || []);
//     } catch (error) {
//       console.error("Error fetching owner data:", error);
//       toast.error(t("Failed to fetch property types!"));
//     }
//   };

//   useEffect(() => {
//     fetchPropertyData();
//   }, [openAdd, openEdit, openDelete]);

//   const handleCloseEdit = () => setOpenEdit(false);
//   const handleCloseDelete = () => setOpenDelete(false);
//   const handleCloseAdd = () => setOpenAdd(false);

//   const handleOpenEdit = (row) => {
//     setRowData(row);
//     setOpenEdit(true);
//     handleCloseMenu();
//   };

//   const handleOpenDelete = (row) => {
//     setRowData(row);
//     setOpenDelete(true);
//     handleCloseMenu();
//   };

//   const handleOpenAdd = () => setOpenAdd(true);

//   const handleMenuOpen = (event, row) => {
//     setAnchorEl(event.currentTarget);
//     setCurrentRow(row);
//   };
//   const handleCloseMenu = () => {
//     setAnchorEl(null);
//     setCurrentRow(null);
//   };

//   // DataGrid Columns
//   const columns = [
//     {
//       field: "serialNo",
//       headerName: "S.No.",
//       width: 70,
//       renderCell: (params) => {
//         const index = ownerData.findIndex((row) => row._id === params.row._id);
//         return index + 1;
//       },
//     },
//     {
//       field: "name",
//       headerName: t("Property Type"),
//       flex: 1,
//     },
//     {
//       field: "description",
//       headerName: t("Description"),
//       flex: 1,
//     },
//     {
//       field: "action",
//       headerName: t("Action"),
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           <IconButton onClick={(event) => handleMenuOpen(event, params.row)}>
//             <MoreVertIcon />
//           </IconButton>
//           <Popover
//             open={Boolean(anchorEl) && currentRow?._id === params.row._id}
//             anchorEl={anchorEl}
//             onClose={handleCloseMenu}
//             anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//           >
//             <MenuItem onClick={() => handleOpenEdit(params.row)}>
//               <EditIcon sx={{ mr: 1 }} />
//               {t("Edit")}
//             </MenuItem>
//             <MenuItem onClick={() => handleOpenDelete(params.row)} sx={{ color: "red" }}>
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
//       <AddPropertyTypes open={openAdd} handleClose={handleCloseAdd} />
//       <EditPropertyTypes open={openEdit} handleClose={handleCloseEdit} data={rowData} />
//       <DeletePropertyType open={openDelete} handleClose={handleCloseDelete} data={rowData} />

//       <Container maxWidth="lg">
//         <Card
//           sx={{
//            p: 0,
//     mt: 0,
//     borderRadius: 3,
//     // boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
//     display: "flex",
//     flexDirection: "column",
//     height: "100%",  // full height of container
//     minHeight: "500px", 
//           }}
//         >
//           {/* Header inside card */}
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
//                 {t("Property Types")}
//               </Typography>
//             </Stack>

//             <Button
//               variant="contained"
//               startIcon={<Iconify icon="eva:plus-fill" />}
//               onClick={handleOpenAdd}
//               sx={{
//                 borderRadius: 2,
//                 textTransform: "none",
//                 fontWeight: 500,
//               }}
//             >
//               {t("Add Types")}
//             </Button>
//           </Stack>

//           {/* Table */}
//           <Box sx={{ flexGrow: 1, minHeight: 0 }}>
//   <TableStyle>
//    <DataGrid
//   rows={ownerData}
//   columns={columns}
//   getRowId={(row) => row._id}
//   slots={{ toolbar: GridToolbar }}
//   slotProps={{ toolbar: { showQuickFilter: true } }}
//   sx={{
//     border: "none",
//     height: 400, 
//     "& .MuiDataGrid-columnHeaders": {
//       backgroundColor: "rgba(25, 118, 210, 0.08)",
//       fontWeight: "bold",
//     },
//   }}
// />

//   </TableStyle>
// </Box>

//         </Card>
//       </Container>
//     </>
//   );
// };

// export default PropertyTypes;



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
  AccountTree,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { getApi } from "@/core/apis/api";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { urls } from "@/core/Constant/urls";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddPropertyTypes from "./AddPropertyTypes";
import EditPropertyTypes from "./EditPropertyType";
import DeletePropertyType from "./DeletePropertyType";
import { tokenPayload } from "@/helper";

const PropertyTypes = () => {
  const { t } = useTranslation();
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [ownerData, setOwnerData] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const payload = tokenPayload();

  const fetchPropertyData = async () => {
    try {
      const response = await getApi(urls.propertyTypes.getdata, {
        id: payload._id,
      });
      setOwnerData(response?.data || []);
    } catch (error) {
      console.error("Error fetching property types:", error);
      toast.error(t("Failed to fetch property types!"));
    }
  };

  useEffect(() => {
    fetchPropertyData();
  }, [openAdd, openEdit, openDelete]);

  const handleCloseEdit = () => setOpenEdit(false);
  const handleCloseDelete = () => setOpenDelete(false);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleOpenEdit = (row) => {
    setRowData(row);
    setOpenEdit(true);
  };

  const handleOpenDelete = (row) => {
    setRowData(row);
    setOpenDelete(true);
  };

  const handleOpenAdd = () => setOpenAdd(true);

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
      field: "name",
      headerName: t("Property Type"),
      flex: 1,
    },
    {
      field: "description",
      headerName: t("Description"),
      flex: 1,
    },
    {
      field: "actions",
      headerName: t("Actions"),
      flex: 0.8,
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
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ p: 0 }}>
      {/* Modals */}
      <AddPropertyTypes open={openAdd} handleClose={handleCloseAdd} />
      <EditPropertyTypes
        open={openEdit}
        handleClose={handleCloseEdit}
        data={rowData}
      />
      <DeletePropertyType
        open={openDelete}
        handleClose={handleCloseDelete}
        data={rowData}
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
                  {t("Property Type")}
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ marginBottom: "30px" }}
                >
                  {t("Manage and configure property types for projects")}
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
                    <AccountTree
                      sx={{ mr: 2, color: "primary.main", fontSize: 32 }}
                    />
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      {t("Created Property Types")} ({ownerData.length})
                    </Typography>
                  </Box>
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
                    {t("Add New Property Type")}
                  </Button>
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
                  <AccountTree
                    sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t("No Property Types Created Yet")}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {t("Get started by creating your first property type")}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAdd}
                    sx={{ mt: 2, background: "#2196f3" }}
                  >
                    {t("Add New Property Type")}
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

export default PropertyTypes;
