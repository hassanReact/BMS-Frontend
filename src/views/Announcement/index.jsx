// import { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
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
// import { IconHome } from "@tabler/icons";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { useTranslation } from "react-i18next";
// import { getApi } from "@/core/apis/api";
// import { urls } from "@/core/Constant/urls";
// import { tokenPayload } from "@/helper";
// import TableStyle from "../../ui-component/TableStyle";
// import Iconify from "../../ui-component/iconify";
// import AddAnouncement from "./AddAnouncement";
// import EditAnnouncement from "./EditAnnouncement";
// import DeleteAnnouncement from "./DeleteAnnouncement";

// const Announcement = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const payload = tokenPayload();
//   const isCompanyAdmin = payload?.role === "companyAdmin";

//   const [announcements, setAnnouncements] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [currentRow, setCurrentRow] = useState(null);

//   const [openAdd, setOpenAdd] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [openDelete, setOpenDelete] = useState(false);
//   const [rowData, setRowData] = useState(null);

//   // --- Handlers ---
//   const handleClick = (event, row) => {
//     setAnchorEl(event.currentTarget);
//     setCurrentRow(row);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//     setCurrentRow(null);
//   };

//   const handleOpenView = () => {
//     navigate(`/dashboard/announcement/view?id=${currentRow._id}`);
//     handleClose();
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

//   // --- Fetch data ---
//   const fetchAnnouncements = async () => {
//     try {
//       const response = await getApi(urls.Announcement.getAllAnnouncement, {
//         id: payload.companyId,
//       });
//       setAnnouncements(
//         response?.data.map((item) => ({ ...item, id: item._id })) || []
//       );
//     } catch (error) {
//       console.error("Error fetching announcements:", error);
//       setAnnouncements([]);
//     }
//   };

//   useEffect(() => {
//     fetchAnnouncements();
//   }, [openAdd, openEdit, openDelete]);

//   // --- Columns ---
//   const columns = [
//     {
//       field: "serialNo",
//       headerName: "S.No.",
//       width: 70,
//       renderCell: (params) => {
//         const rowIndex = announcements.findIndex(
//           (row) => row._id === params.row._id
//         );
//         return rowIndex + 1;
//       },
//     },
//     {
//       field: "topic",
//       headerName: t("Topic"),
//       flex: 1,
//       renderCell: (params) => (
//         <Button
//           variant="text"
//           color="primary"
//           onClick={() =>
//             navigate(`/dashboard/announcement/view?id=${params.row._id}`)
//           }
//         >
//           {params.row.topic}
//         </Button>
//       ),
//     },
//     { field: "details", headerName: t("Details"), flex: 1 },
//     {
//       field: "createdAt",
//       headerName: t("Created At"),
//       flex: 1,
//       valueGetter: (params) => new Date(params.value).toLocaleString(),
//     },
//     {
//       field: "action",
//       headerName: t("Action"),
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           <IconButton
//             aria-describedby={params?.row._id}
//             onClick={(event) => handleClick(event, params?.row)}
//           >
//             <MoreVertIcon />
//           </IconButton>
//           <Popover
//             id={params?.row._id}
//             open={Boolean(anchorEl) && currentRow?._id === params?.row._id}
//             anchorEl={anchorEl}
//             onClose={handleClose}
//             anchorOrigin={{
//               vertical: "bottom",
//               horizontal: "left",
//             }}
//           >
//             <MenuItem onClick={handleOpenView}>
//               <VisibilityIcon sx={{ mr: 1, color: "green" }} />
//               {t("View")}
//             </MenuItem>
//             {isCompanyAdmin && (
//               <>
//                 <MenuItem onClick={handleOpenEdit}>
//                   <EditIcon sx={{ mr: 1 }} />
//                   {t("Edit")}
//                 </MenuItem>
//                 <MenuItem onClick={handleOpenDelete} sx={{ color: "red" }}>
//                   <DeleteIcon sx={{ mr: 1, color: "red" }} />
//                   {t("Delete")}
//                 </MenuItem>
//               </>
//             )}
//           </Popover>
//         </>
//       ),
//     },
//   ];

//   return (
//     <>
//       {/* Dialogs */}
//       <AddAnouncement open={openAdd} handleClose={() => setOpenAdd(false)} />
//       <EditAnnouncement
//         open={openEdit}
//         handleClose={() => setOpenEdit(false)}
//         data={rowData}
//       />
//       <DeleteAnnouncement
//         open={openDelete}
//         handleClose={() => setOpenDelete(false)}
//         id={rowData?._id}
//       />

//       {/* Layout */}
//       <Container maxWidth="lg">
//         <Card
//           sx={{
//             p: 0,
//             mt: 0,
//             flex:1,
//             height: "400",
//             borderRadius: 3,
//             // boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           {/* Header inside card */}
//           <Stack
//             direction="row"
//             alignItems="center"
//             justifyContent="space-between"
//             sx={{
//               mb: 2,
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
//                 {t("Announcement Management")}
//               </Typography>
//             </Stack>

//             {payload?.role !== "tenant" && (
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
//                 {t("Add New Announcement")}
//               </Button>
//             )}
//           </Stack>

//           {/* Table */}
//           <Box sx={{ flexGrow: 1 }}>
//             <TableStyle>
//               <DataGrid
//                 rows={announcements}
//                 columns={columns}
//                 getRowId={(row) => row._id}
//                 slots={{ toolbar: GridToolbar }}
//                 slotProps={{ toolbar: { showQuickFilter: true } }}
//                 sx={{
//                   border: "none",
//                   height: 400,
//                   "& .MuiDataGrid-columnHeaders": {
//                     backgroundColor: "rgba(25, 118, 210, 0.08)",
//                     fontWeight: "bold",
//                   },
//                 }}
//               />
//             </TableStyle>
//           </Box>
//         </Card>
//       </Container>
//     </>
//   );
// };

// export default Announcement;



import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Campaign as CampaignIcon,
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
import AddAnouncement from "./AddAnouncement";
import EditAnnouncement from "./EditAnnouncement";
import DeleteAnnouncement from "./DeleteAnnouncement";

const Announcement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const payload = tokenPayload();
  const isCompanyAdmin = payload?.role === "companyAdmin";

  const [announcements, setAnnouncements] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // --- Fetch data ---
  const fetchAnnouncements = async () => {
    try {
      const response = await getApi(urls.Announcement.getAllAnnouncement, {
        id: payload.companyId,
      });
      setAnnouncements(
        response?.data.map((item) => ({ ...item, id: item._id })) || []
      );
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setAnnouncements([]);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [openAdd, openEdit, openDelete]);

  // --- Columns ---
  const columns = [
    {
      field: "serialNo",
      headerName: "S.No.",
      width: 80,
      renderCell: (params) => {
        const index = announcements.findIndex(
          (row) => row._id === params.row._id
        );
        return index + 1;
      },
    },
    {
      field: "topic",
      headerName: t("Topic"),
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="text"
          color="primary"
          onClick={() =>
            navigate(`/dashboard/announcement/view?id=${params.row._id}`)
          }
        >
          {params.row.topic}
        </Button>
      ),
    },
    { field: "details", headerName: t("Details"), flex: 1 },
    {
      field: "createdAt",
      headerName: t("Created At"),
      flex: 1,
      valueGetter: (params) => new Date(params.value).toLocaleString(),
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
            onClick={() =>
              navigate(`/dashboard/announcement/view?id=${params.row._id}`)
            }
            sx={{ mr: 1, color: "success.main" }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          {isCompanyAdmin && (
            <>
              <IconButton
                size="small"
                onClick={() => {
                  setRowData(params.row);
                  setOpenEdit(true);
                }}
                sx={{ mr: 1, color: "primary.main" }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => {
                  setRowData(params.row);
                  setOpenDelete(true);
                }}
                sx={{ color: "error.main" }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ p: 0 }}>
      {/* Modals */}
      <AddAnouncement open={openAdd} handleClose={() => setOpenAdd(false)} />
      <EditAnnouncement
        open={openEdit}
        handleClose={() => setOpenEdit(false)}
        data={rowData}
      />
      <DeleteAnnouncement
        open={openDelete}
        handleClose={() => setOpenDelete(false)}
        id={rowData?._id}
      />

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
                {t("Announcement Management")}
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ marginBottom: "30px" }}
              >
                {t("Manage announcements for your company")}
              </Typography>
            </Box>

            {/* Created Section */}
            {announcements.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CampaignIcon
                    sx={{ mr: 2, color: "primary.main", fontSize: 32 }}
                  />
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    {t("Created Announcements")} ({announcements.length})
                  </Typography>
                </Box>
                {payload?.role !== "tenant" && (
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
                    {t("Add New Announcement")}
                  </Button>
                )}
              </Box>
            )}

            {/* Empty State or Table */}
            {announcements.length === 0 ? (
              <Paper
                sx={{
                  p: 4,
                  textAlign: "center",
                  backgroundColor: "#f5f5f5",
                  borderRadius: 2,
                }}
              >
                <CampaignIcon
                  sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {t("No Announcements Created Yet")}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {t("Get started by creating your first announcement")}
                </Typography>
                {payload?.role !== "tenant" && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenAdd(true)}
                    sx={{ mt: 2, background: "#2196f3" }}
                  >
                    {t("Add New Announcement")}
                  </Button>
                )}
              </Paper>
            ) : (
              <DataGrid
                rows={announcements}
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
    </Container>
  );
};

export default Announcement;
