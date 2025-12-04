// import { useState, useEffect } from 'react';
// import {
//   Stack, Button, Container, Typography, Box, Card,
//   Breadcrumbs, IconButton, Popover, MenuItem
// } from '@mui/material';
// import { IconHome } from '@tabler/icons';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { useNavigate } from 'react-router';
// import Iconify from '@/ui-component/iconify';
// import TableStyle from '@/ui-component/TableStyle';
// import AddStaffs from './AddStaff'; // <-- Renamed
// import { useTranslation } from 'react-i18next';
// import { getApi } from '@/core/apis/api';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import { urls } from '@/core/Constant/urls';
// import EditStaff from './EditStaff'; // <-- Renamed
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import DeleteStaff from './DeleteStaff'; // <-- Renamed
// import { tokenPayload } from '@/helper';
// import { Link } from 'react-router-dom';
// import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

// const Staff = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const [staffData, setStaffData] = useState([]);
//   const [openDelete, setOpenDelete] = useState(false);
//   const [openAdd, setOpenAdd] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [currentRow, setCurrentRow] = useState(null);
//   const [rowData, setRowData] = useState([]);
//   const payload = tokenPayload();

//   const fetchStaffData = async () => {
//     try {
//       const response = await getApi(urls.staff.staffdata, { id: payload._id });
//       const data = Array.isArray(response.data) ? response.data : [response.data];
//       setStaffData(data);
//     } catch (error) {
//       console.error(t('Error fetching staff data'), error);
//       setStaffData([]);
//     }
//   };


//   const handleChangePassword = () => {
//     navigate(`/dashboard/staff/changepassword?id=${currentRow._id}`);
//   };

//   useEffect(() => {
//     fetchStaffData();
//   }, [openAdd, openEdit, openDelete]);

//   const handleOpenView = () => {
//     navigate(`/dashboard/staff/view?id=${currentRow._id}`);
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

//   const handleClick = (event, row) => {
//     setAnchorEl(event.currentTarget);
//     setCurrentRow(row);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setCurrentRow(null);
//   };

//   const columns = [
//     {
//       field: 'serialNo',
//       headerName: 'S.No.',
//       width: 60,
//       renderCell: (params) => {
//         const rowIndex = staffData.findIndex((row) => row._id === params.row._id);
//         return rowIndex + 1;
//       },
//     },
//     {
//       field: 'staffName',
//       headerName: t('Staff Name'),
//       flex: 1,
//       renderCell: (params) => (
//         <Button
//           variant="text"
//           color="primary"
//           onClick={() => navigate(`/dashboard/staff/view?id=${params.row._id}`)}
//         >
//           {params.row.staffName}
//         </Button>
//       ),
//     },
//     { field: 'email', headerName: t('Email'), flex: 1 },
//     { field: 'phoneNo', headerName: t('Phone No'), flex: 1 },
//     { field: 'cnic', headerName: t('CNIC'), flex: 1 },  // ✅ CNIC column added
//     { field: 'address', headerName: t('Address'), flex: 1 },
//     { field: 'designation', headerName: t('Designation'), flex: 1 },
//     { field: 'Salary', headerName: t('Salary'), flex: 1 },
//     {
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
//             <MenuItem onClick={handleChangePassword}>
//               <ChangeCircleIcon sx={{ mr: 1, color: 'blue' }} />
//               {t('Change Password')}
//             </MenuItem>
//           </Popover>
//         </>
//       ),
//     },
//   ];

//   const breadcrumbs = [
//     <Link key="home" to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
//       <IconHome />
//     </Link>,
//     <Typography key="staff" color="text.primary">
//       {t('Staff Management')}
//     </Typography>,
//   ];

//   return (
//     <>
//       <AddStaffs open={openAdd} handleClose={() => setOpenAdd(false)} />
//       <EditStaff open={openEdit} handleClose={() => setOpenEdit(false)} data={rowData} />
//       <DeleteStaff open={openDelete} handleClose={() => setOpenDelete(false)} id={rowData?._id} />


//       <Container maxWidth="lg">
//   <Card
//     sx={{
//       p: 0,
//       mt:0,
//       height: "700px",
//       borderRadius: 3,
//       // boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
//       display: "flex",
//       flexDirection: "column",
//     }}
//   >
//     {/* Header in same card */}
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
//       <Stack direction="row" alignItems="center" spacing={1.5}>
//         {/* Home Icon */}
//         <Box
//           sx={{
//             width: 42,
//             height: 42,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             borderRadius: "50%",
//             backgroundColor: "rgba(25, 118, 210, 0.1)",
//           }}
//         >
//           <Link to="/" style={{ textDecoration: "none" }}>
//             <IconHome style={{ color: "#1976d2", fontSize: "1.5rem" }} />
//           </Link>
//         </Box>

//         {/* Title */}
//         <Typography
//           variant="h4"
//           sx={{
//             fontWeight: "bold",
//             color: "primary.main",
//             fontSize: "24px",
//             letterSpacing: "0.5px",
//           }}
//         >
//           {t("Staff Management")}
//         </Typography>
//       </Stack>

//       {/* Add Staff Button */}
//       <Button
//         variant="contained"
//         startIcon={<Iconify icon="eva:plus-fill" />}
//         onClick={() => setOpenAdd(true)}
//         sx={{
//           borderRadius: 2,
//           textTransform: "none",
//           fontWeight: 500,
//         }}
//       >
//         {t("Add New Staff")}
//       </Button>
//     </Stack>

//     {/* DataGrid inside same card */}
//     <Box sx={{ flexGrow: 1 }}>
//       <DataGrid
//         rows={staffData}
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

// export default Staff;




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
  IconButton,
  Paper,
} from "@mui/material";
import {
  Groups as StaffIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  ChangeCircle as ChangeCircleIcon,
} from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { getApi } from "@/core/apis/api";
import { urls } from "@/core/Constant/urls";
import AddStaffs from "./AddStaff";
import EditStaff from "./EditStaff";
import DeleteStaff from "./DeleteStaff";
import { tokenPayload } from "@/helper";
import { toast } from "react-toastify";

const Staff = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [staffData, setStaffData] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const payload = tokenPayload();

  // Fetch staff data
  const fetchStaffData = async () => {
    try {
      const response = await getApi(urls.staff.staffdata, { id: payload._id });
      const data = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setStaffData(data);
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error(t("Failed to fetch staff data!"));
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, [openAdd, openEdit, openDelete]);

  const handleCloseEdit = () => setOpenEdit(false);
  const handleCloseDelete = () => setOpenDelete(false);
  const handleCloseAdd = () => setOpenAdd(false);
  const handleCloseSnackbar = () =>
    setSnackbar({ ...snackbar, open: false });

  const handleOpenEdit = (row) => {
    setRowData(row);
    setOpenEdit(true);
  };

  const handleOpenDelete = (row) => {
    setRowData(row);
    setOpenDelete(true);
  };

  const handleOpenAdd = () => setOpenAdd(true);

  const handleChangePassword = (row) => {
    navigate(`/dashboard/staff/changepassword?id=${row._id}`);
  };

  const handleViewStaff = (row) => {
    navigate(`/dashboard/staff/view?id=${row._id}`);
  };

  // DataGrid Columns
  const columns = [
    {
      field: "serialNo",
      headerName: "S.No.",
      width: 80,
      renderCell: (params) => {
        const index = staffData.findIndex(
          (row) => row._id === params.row._id
        );
        return index + 1;
      },
    },
    {
      field: "staffName",
      headerName: t("Staff Name"),
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="text"
          color="primary"
          onClick={() => handleViewStaff(params.row)}
        >
          {params.row.staffName}
        </Button>
      ),
    },
    { field: "email", headerName: t("Email"), flex: 1 },
    { field: "phoneNo", headerName: t("Phone No"), flex: 1 },
    { field: "cnic", headerName: t("CNIC"), flex: 1 },
    { field: "address", headerName: t("Address"), flex: 1 },
    { field: "designation", headerName: t("Designation"), flex: 1 },
    { field: "Salary", headerName: t("Salary"), flex: 1 },
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
            sx={{ mr: 1, color: "error.main" }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleChangePassword(params.row)}
            sx={{ mr: 1, color: "info.main" }}
          >
            <ChangeCircleIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleViewStaff(params.row)}
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
      <AddStaffs open={openAdd} handleClose={handleCloseAdd} />
      <EditStaff
        open={openEdit}
        handleClose={handleCloseEdit}
        data={rowData}
      />
      <DeleteStaff
        open={openDelete}
        handleClose={handleCloseDelete}
        id={rowData?._id}
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
                  {t("Staff Management")}
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ marginBottom: "30px" }}
                >
                  {t("Manage staff members and their details")}
                </Typography>
              </Box>

              {/* Created Section */}
              {staffData.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <StaffIcon
                      sx={{ mr: 2, color: "primary.main", fontSize: 32 }}
                    />
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="primary"
                    >
                      {t("Created Staff Members")} ({staffData.length})
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
                    {t("Add New Staff")}
                  </Button>
                </Box>
              )}

              {/* Empty State or Table */}
              {staffData.length === 0 ? (
                <Paper
                  sx={{
                    p: 4,
                    textAlign: "center",
                    backgroundColor: "#f5f5f5",
                    borderRadius: 2,
                  }}
                >
                  <StaffIcon
                    sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                  />
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    gutterBottom
                  >
                    {t("No Staff Members Created Yet")}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {t("Get started by adding your first staff member")}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAdd}
                    sx={{ mt: 2, background: "#2196f3" }}
                  >
                    {t("Add New Staff")}
                  </Button>
                </Paper>
              ) : (
                <DataGrid
                  rows={staffData}
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

export default Staff;
