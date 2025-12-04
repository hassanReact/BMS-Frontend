// import { useState, useEffect } from "react";
// import {
//   Stack,
//   Button,
//   Container,
//   Typography,
//   Box,
//   Card,
//   IconButton,
//   Popover,
//   MenuItem,
//   Badge,
// } from "@mui/material";
// import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import { IconHome } from "@tabler/icons";
// import { useTranslation } from "react-i18next";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AssignmentIcon from "@mui/icons-material/Assignment";
// import CommentIcon from "@mui/icons-material/Comment";
// import { useNavigate, Link } from "react-router-dom";
// import { urls } from "@/core/Constant/urls";
// import { getApi } from "@/core/apis/api";
// import { tokenPayload } from "@/helper";
// import DeleteComplain from "./DeleteCompalainByCompany";
// import AssignStaffDialog from "./component/AssignStaffDialog";
// import CommentDialog from "@/views/Comments";
// import AddComplaintsByAdmin from "./component/AddComplain";
// import TableStyle from "../../ui-component/TableStyle";
// import Iconify from "../../ui-component/iconify";

// const CompanyComplaints = () => {
//   const { t } = useTranslation();
//   const [openDelete, setOpenDelete] = useState(false);
//   const [openComments, setOpenComments] = useState(false);
//   const [tenantComplaintData, setTenantComplaintData] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [currentRow, setCurrentRow] = useState(null);
//   const [rowData, setRowData] = useState(null);
//   const [assignDialogOpen, setAssignDialogOpen] = useState(false);
//   const [AddComplaints, setAddComplaints] = useState(false);
//   const navigate = useNavigate();
//   const payload = tokenPayload();

//   // Fetch Complaints
//   const fetchComplaintDataForTenant = async () => {
//     try {
//       const response = await getApi(urls.Complaints.allComplainForCompany, {
//         id: payload._id,
//       });

//       if (Array.isArray(response?.data)) {
//         const formatted = await Promise.all(
//           response.data.map(async (item) => {
//             const tenantName = item.tenantId?.tenantName || "Admin";
//             const propertyname = item.propertyId?.propertyname || "N/A";
//             const phoneNo = item.tenantId?.phoneno || "N/A";

//             // fetch unread comment count
//             const res = await getApi(
//               `${urls.Comments.newMessages}/${item._id}/${payload._id}`
//             );
//             const unreadCount = res.data?.unreadCount || 0;

//             return {
//               ...item,
//               tenantName,
//               propertyname,
//               phoneNo,
//               unreadCount,
//             };
//           })
//         );

//         setTenantComplaintData(formatted);
//       } else {
//         setTenantComplaintData([]);
//       }
//     } catch (error) {
//       console.error("Error fetching complaints:", error);
//     }
//   };

//   useEffect(() => {
//     fetchComplaintDataForTenant();
//   }, [openDelete, openComments, assignDialogOpen]);

//   // Popover handlers
//   const handleClick = (event, row) => {
//     setAnchorEl(event.currentTarget);
//     setCurrentRow(row);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//     setCurrentRow(null);
//   };
//   const handleOpenView = () => {
//     navigate(
//       `/dashboard/complain/view?id=${currentRow._id}&reporterName=${currentRow.reporterName}`
//     );
//     handleClose();
//   };
//   const handleDeleteComplaint = () => {
//     setOpenDelete(true);
//     handleClose();
//   };
//   const handleAssignClick = (row) => {
//     setCurrentRow(row);
//     setAnchorEl(null);
//     setAssignDialogOpen(true);
//   };
//   const handleOpenComments = (row) => {
//     setRowData(row);
//     setCurrentRow(row);
//     setOpenComments(true);
//     handleClose();
//   };

//   // Columns
//   const columns = [
//     {
//       field: "serialNo",
//       headerName: "S.No.",
//       width: 70,
//       renderCell: (params) => {
//         const index = tenantComplaintData.findIndex(
//           (row) => row._id === params.row._id
//         );
//         return index + 1;
//       },
//     },
//     {
//       field: "tenantName",
//       headerName: t("Name"),
//       flex: 1,
//       renderCell: (params) => (
//         <Button
//           variant="text"
//           color="primary"
//           onClick={() =>
//             navigate(`/dashboard/complain/tenant/view?id=${params.row._id}`)
//           }
//         >
//           {params.row.tenantName}
//         </Button>
//       ),
//     },
//     { field: "concernTopic", headerName: t("Topic"), flex: 1 },
//     { field: "description", headerName: t("Details"), flex: 1 },
//     { field: "assignedName", headerName: t("Assigned To"), flex: 1 },
//     {
//       field: "comment",
//       headerName: t("Comments"),
//       flex: 1,
//       renderCell: (params) => (
//         <MenuItem onClick={() => handleOpenComments(params.row)} disableRipple>
//           <Badge
//             badgeContent={params.row.unreadCount}
//             color="error"
//             invisible={params.row.unreadCount === 0}
//           >
//             <CommentIcon style={{ marginRight: "8px", color: "blue" }} />
//           </Badge>
//           {t("Comments")}
//         </MenuItem>
//       ),
//     },
//     {
//       field: "status",
//       headerName: t("Status"),
//       flex: 1,
//       renderCell: (params) => {
//         const label = params.row.status ? t("Resolved") : t("Pending");
//         const color = params.row.status ? "green" : "red";
//         return (
//           <Typography sx={{ color, fontWeight: "bold" }}>{label}</Typography>
//         );
//       },
//     },
//     {
//       field: "action",
//       headerName: t("Action"),
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           <IconButton
//             aria-describedby={params?.row._id}
//             onClick={(event) => handleClick(event, params.row)}
//           >
//             <MoreVertIcon />
//           </IconButton>
//           <Popover
//             id={params?.row._id}
//             open={Boolean(anchorEl) && currentRow?._id === params.row._id}
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
//             <MenuItem onClick={handleDeleteComplaint} sx={{ color: "red" }}>
//               <DeleteIcon sx={{ mr: 1, color: "red" }} />
//               {t("Delete")}
//             </MenuItem>
//             <MenuItem
//               onClick={() => handleAssignClick(params.row)}
//               sx={{ color: "blue" }}
//             >
//               <AssignmentIcon sx={{ mr: 1, color: "blue" }} />
//               {t("Assign")}
//             </MenuItem>
//           </Popover>
//         </>
//       ),
//     },
//   ];

//   return (
//     <>
//       {/* Dialogs */}
//       <DeleteComplain
//         open={openDelete}
//         handleClose={() => setOpenDelete(false)}
//         id={currentRow?._id}
//       />
//       <AddComplaintsByAdmin
//         open={AddComplaints}
//         setOpen={setAddComplaints}
//         fetchComplaints={fetchComplaintDataForTenant}
//       />
//       <AssignStaffDialog
//         open={assignDialogOpen}
//         handleClose={() => setAssignDialogOpen(false)}
//         complaintId={currentRow?._id}
//         refreshData={fetchComplaintDataForTenant}
//         companyId={payload._id}
//       />
//       <CommentDialog
//         open={openComments}
//         onClose={() => setOpenComments(false)}
//         complaintId={rowData?._id || ""}
//         user={payload || {}}
//       />

//       {/* Layout */}
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
//                 {t("Complaint Management")}
//               </Typography>
//             </Stack>

//             <Button
//               variant="contained"
//               startIcon={<Iconify icon="eva:plus-fill" />}
//               onClick={() => setAddComplaints(true)}
//               sx={{
//                 borderRadius: 2,
//                 textTransform: "none",
//                 fontWeight: 500,
//               }}
//             >
//               {t("Add Complaint")}
//             </Button>
//           </Stack>

//           {/* Table */}
//           <Box sx={{ flexGrow: 1 }}>
//             <TableStyle>
//               <DataGrid
//                 rows={tenantComplaintData}
//                 columns={columns}
//                 getRowId={(row) => row._id}
//                 slots={{ toolbar: GridToolbar }}
//                 slotProps={{ toolbar: { showQuickFilter: true } }}
//                 sx={{
//                   border: "none",
//                   height:400,
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

// export default CompanyComplaints;




/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import {
  Stack,
  Button,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Popover,
  MenuItem,
  Badge,
  Paper,
  Fade,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { IconHome } from "@tabler/icons";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CommentIcon from "@mui/icons-material/Comment";
import { useNavigate } from "react-router-dom";
import { urls } from "@/core/Constant/urls";
import { getApi } from "@/core/apis/api";
import { tokenPayload } from "@/helper";
import DeleteComplain from "./DeleteCompalainByCompany";
import AssignStaffDialog from "./component/AssignStaffDialog";
import CommentDialog from "@/views/Comments";
import AddComplaintsByAdmin from "./component/AddComplain";
import Iconify from "../../ui-component/iconify";

const CompanyComplaints = () => {
  const { t } = useTranslation();
  const [openDelete, setOpenDelete] = useState(false);
  const [openComments, setOpenComments] = useState(false);
  const [tenantComplaintData, setTenantComplaintData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [AddComplaints, setAddComplaints] = useState(false);
  const navigate = useNavigate();
  const payload = tokenPayload();

  // Fetch Complaints
  const fetchComplaintDataForTenant = async () => {
    try {
      const response = await getApi(urls.Complaints.allComplainForCompany, {
        id: payload._id,
      });

      if (Array.isArray(response?.data)) {
        const formatted = await Promise.all(
          response.data.map(async (item) => {
            const tenantName = item.tenantId?.tenantName || "Admin";
            const propertyname = item.propertyId?.propertyname || "N/A";
            const phoneNo = item.tenantId?.phoneno || "N/A";

            // fetch unread comment count
            const res = await getApi(
              `${urls.Comments.newMessages}/${item._id}/${payload._id}`
            );
            const unreadCount = res.data?.unreadCount || 0;

            return {
              ...item,
              tenantName,
              propertyname,
              phoneNo,
              unreadCount,
            };
          })
        );

        setTenantComplaintData(formatted);
      } else {
        setTenantComplaintData([]);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  useEffect(() => {
    fetchComplaintDataForTenant();
  }, [openDelete, openComments, assignDialogOpen]);

  // Actions
  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };
  const handleOpenView = () => {
    navigate(
      `/dashboard/complain/view?id=${currentRow._id}&reporterName=${currentRow.reporterName}`
    );
    handleClose();
  };
  const handleDeleteComplaint = () => {
    setOpenDelete(true);
    handleClose();
  };
  const handleAssignClick = (row) => {
    setCurrentRow(row);
    setAnchorEl(null);
    setAssignDialogOpen(true);
  };
  const handleOpenComments = (row) => {
    setRowData(row);
    setCurrentRow(row);
    setOpenComments(true);
    handleClose();
  };

  // Columns
  const columns = [
    {
      field: "serialNo",
      headerName: "S.No.",
      width: 70,
      renderCell: (params) => {
        const index = tenantComplaintData.findIndex(
          (row) => row._id === params.row._id
        );
        return index + 1;
      },
    },
    {
      field: "tenantName",
      headerName: t("Name"),
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="text"
          color="primary"
          onClick={() =>
            navigate(`/dashboard/complain/tenant/view?id=${params.row._id}`)
          }
        >
          {params.row.tenantName}
        </Button>
      ),
    },
    { field: "concernTopic", headerName: t("Topic"), flex: 1 },
    { field: "description", headerName: t("Details"), flex: 1 },
    { field: "assignedName", headerName: t("Assigned To"), flex: 1 },
    {
      field: "comment",
      headerName: t("Comments"),
      flex: 1,
      renderCell: (params) => (
        <MenuItem onClick={() => handleOpenComments(params.row)} disableRipple>
          <Badge
            badgeContent={params.row.unreadCount}
            color="error"
            invisible={params.row.unreadCount === 0}
          >
            <CommentIcon style={{ marginRight: "8px", color: "blue" }} />
          </Badge>
          {t("Comments")}
        </MenuItem>
      ),
    },
    {
      field: "status",
      headerName: t("Status"),
      flex: 1,
      renderCell: (params) => {
        const label = params.row.status ? t("Resolved") : t("Pending");
        const color = params.row.status ? "green" : "red";
        return (
          <Typography sx={{ color, fontWeight: "bold" }}>{label}</Typography>
        );
      },
    },
    {
      field: "action",
      headerName: t("Action"),
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            aria-describedby={params?.row._id}
            onClick={(event) => handleClick(event, params.row)}
          >
            <MoreVertIcon />
          </IconButton>
          <Popover
            id={params?.row._id}
            open={Boolean(anchorEl) && currentRow?._id === params.row._id}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <MenuItem onClick={handleOpenView}>
              <VisibilityIcon sx={{ mr: 1, color: "green" }} />
              {t("View")}
            </MenuItem>
            <MenuItem onClick={handleDeleteComplaint} sx={{ color: "red" }}>
              <DeleteIcon sx={{ mr: 1, color: "red" }} />
              {t("Delete")}
            </MenuItem>
            <MenuItem
              onClick={() => handleAssignClick(params.row)}
              sx={{ color: "blue" }}
            >
              <AssignmentIcon sx={{ mr: 1, color: "blue" }} />
              {t("Assign")}
            </MenuItem>
          </Popover>
        </>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ p: 0 }}>
      {/* Dialogs */}
      <DeleteComplain
        open={openDelete}
        handleClose={() => setOpenDelete(false)}
        id={currentRow?._id}
      />
      <AddComplaintsByAdmin
        open={AddComplaints}
        setOpen={setAddComplaints}
        fetchComplaints={fetchComplaintDataForTenant}
      />
      <AssignStaffDialog
        open={assignDialogOpen}
        handleClose={() => setAssignDialogOpen(false)}
        complaintId={currentRow?._id}
        refreshData={fetchComplaintDataForTenant}
        companyId={payload._id}
      />
      <CommentDialog
        open={openComments}
        onClose={() => setOpenComments(false)}
        complaintId={rowData?._id || ""}
        user={payload || {}}
      />

      <Fade in={true} timeout={800}>
        <Box>
          {/* Main Card */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              borderColor: "divider",
              minHeight: "500px",
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
                  {t("Complaint Management")}
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ marginBottom: "30px" }}
                >
                  {t("Manage and track tenant complaints efficiently")}
                </Typography>
              </Box>

              {/* Section header */}
              {tenantComplaintData.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <IconHome style={{ color: "#1976d2", fontSize: "2rem" }} />
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      {t("Active Complaints")} ({tenantComplaintData.length})
                    </Typography>
                  </Stack>

                  <Button
                    variant="contained"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={() => setAddComplaints(true)}
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
                    {t("Add Complaint")}
                  </Button>
                </Box>
              )}

              {/* Empty State or Table */}
              {tenantComplaintData.length === 0 ? (
                <Paper
                  sx={{
                    p: 4,
                    textAlign: "center",
                    backgroundColor: "#f5f5f5",
                    borderRadius: 2,
                  }}
                >
                  <AssignmentIcon
                    sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t("No Complaints Registered Yet")}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {t("Get started by adding your first complaint")}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={() => setAddComplaints(true)}
                    sx={{ mt: 2, background: "#2196f3" }}
                  >
                    {t("Add Complaint")}
                  </Button>
                </Paper>
              ) : (
                <DataGrid
                  rows={tenantComplaintData}
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
    </Container>
  );
};

export default CompanyComplaints;
