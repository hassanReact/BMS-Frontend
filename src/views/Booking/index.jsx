
// import { useState, useEffect } from "react";
// import * as React from "react";
// import {
//   Stack,
//   Button,
//   Container,
//   Typography,
//   Card,
//   Box,
//   IconButton,
//   Popover,
//   MenuItem,
// } from "@mui/material";
// import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import { getApi } from "@/core/apis/api";
// import { Link, useNavigate } from "react-router-dom";
// import TableStyle from "../../ui-component/TableStyle";
// import { IconHome } from "@tabler/icons";
// import Iconify from "../../ui-component/iconify";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { useTranslation } from "react-i18next";
// import { urls } from "@/core/Constant/urls";
// import AddBooking from "./AddBooking";
// import GenerateMonthlyBill from "./CreateBill";
// import { tokenPayload } from "@/helper";
// import DeleteBooking from "./DeleteBooking";
// import Tab from "@mui/material/Tab";
// import TabContext from "@mui/lab/TabContext";
// import TabList from "@mui/lab/TabList";
// import TabPanel from "@mui/lab/TabPanel";

// const Booking = () => {
//   const { t } = useTranslation();
//   const payload = tokenPayload();
//   const [openDelete, setOpenDelete] = useState(false);
//   const [openAdd, setOpenAdd] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [rowData, setRowData] = useState([]);
//   const [bookingData, setBookingData] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [currentRow, setCurrentRow] = useState(null);
//   const navigate = useNavigate();
//   const [value, setValue] = React.useState("1");

//   const isAdmin = payload?.role === "companyAdmin";

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   // Fetch booking data
//   const fetchBookingDataOnNotice = async () => {
//     const response = await getApi(urls.booking.propertyOnNotice, {
//       id: payload.companyId,
//     });
//     const formattedData = response.data.map((item) => ({
//       ...item,
//       tenantName: item.tenantId?.tenantName,
//       ownerName: item.ownerId?.ownerName,
//       propertyName: item.propertyId?.propertyname,
//       blockName: item.blockId?.blockName,
//       projectName: item.projectId?.projectName,
//       startingDate: item.startingDate
//         ? new Date(item.startingDate).toLocaleDateString()
//         : "N/A",
//       endingDate: item.endingDate
//         ? new Date(item.endingDate).toLocaleDateString()
//         : "N/A",
//     }));
//     setBookingData(formattedData);
//   };

//   const fetchBookingData = async () => {
//     const response = await getApi(urls.booking.bookingdata, { id: payload._id });
//     const formattedData = response.data.map((item) => ({
//       ...item,
//       tenantName: item.tenantId?.tenantName,
//       ownerName: item.ownerId?.ownerName,
//       propertyName: item.propertyId?.propertyname,
//       blockName: item.blockId?.blockName,
//       projectName: item.projectId?.projectName,
//       startingDate: item.startingDate
//         ? new Date(item.startingDate).toLocaleDateString()
//         : "N/A",
//       endingDate: item.endingDate
//         ? new Date(item.endingDate).toLocaleDateString()
//         : "N/A",
//     }));
//     setBookingData(formattedData);
//   };

//   const fetchAllBookingData = async () => {
//     const response = await getApi(urls.booking.allbooking, {
//       id: payload.companyId,
//     });
//     const formattedData = response.data.map((item) => ({
//       ...item,
//       tenantName: item.tenantId?.tenantName,
//       ownerName: item.ownerId?.ownerName,
//       propertyName: item.propertyId?.propertyname,
//       blockName: item.blockId?.blockName,
//       projectName: item.projectId?.projectName,
//       startingDate: item.startingDate
//         ? new Date(item.startingDate).toLocaleDateString()
//         : "N/A",
//       endingDate: item.endingDate
//         ? new Date(item.endingDate).toLocaleDateString()
//         : "N/A",
//     }));
//     setBookingData(formattedData);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       if (value === "1") {
//         await fetchBookingData();
//       } else if (value === "2") {
//         await fetchAllBookingData();
//       } else if (value === "3") {
//         await fetchBookingDataOnNotice();
//       }
//     };
//     fetchData();
//   }, [value, openAdd, openEdit, openDelete]);

//   // Actions
//   const handleClick = (event, row) => {
//     setAnchorEl(event.currentTarget);
//     setCurrentRow(row);
//     setRowData(row);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setCurrentRow(null);
//   };

//   const handleOpenEdit = () => {
//     if (currentRow) {
//       setRowData(currentRow);
//       setOpenEdit(true);
//       handleClose();
//     }
//   };

//   const handleOpenView = () => {
//     navigate(
//       `/dashboard/booking/view?id=${currentRow._id}&reporterName=${currentRow.name}`
//     );
//   };

//   const handleCloseDelete = () => setOpenDelete(false);

//   const handleCloseEditBooking = () => setOpenEdit(false);
//   const handleOpenAdd = () => setOpenAdd(true);
//   const handleCloseAdd = () => setOpenAdd(false);

//   // Columns
//   const columns = [
//     {
//       field: "serialNo",
//       headerName: "S.No.",
//       width: 60,
//       renderCell: (params) =>
//         bookingData.findIndex((row) => row._id === params.row._id) + 1,
//     },
//     {
//       field: "propertyName",
//       headerName: t("Property Name"),
//       flex: 1,
//       renderCell: (params) => (
//         <Button
//           variant="text"
//           color="primary"
//           onClick={() =>
//             navigate(
//               `/dashboard/booking/view?id=${params.row._id}&reporterName=${params.row.name}`
//             )
//           }
//         >
//           {params.row.propertyName}
//         </Button>
//       ),
//     },
//     { field: "blockName", headerName: t("Block Name"), flex: 1 },
//     { field: "projectName", headerName: t("Project Name"), flex: 1 },
//     { field: "tenantName", headerName: t("Tenant Name"), flex: 1 },
//     { field: "ownerName", headerName: t("Owner Name"), flex: 1 },
//     { field: "startingDate", headerName: t("Date"), flex: 1 },
//     { field: "name", headerName: t("Created By"), flex: 1 },
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
//             anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//           >
//             <MenuItem onClick={handleOpenEdit}>
//               <EditIcon sx={{ mr: 1 }} />
//               {t("Create Bill")}
//             </MenuItem>
//             <MenuItem onClick={handleOpenView}>
//               <VisibilityIcon sx={{ mr: 1, color: "green" }} />
//               {t("View")}
//             </MenuItem>
//             <MenuItem
//               sx={{ color: "red" }}
//               onClick={() => {
//                 handleClose();
//                 setOpenDelete(true);
//               }}
//               disabled={!isAdmin}
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
//       <AddBooking open={openAdd} handleClose={handleCloseAdd} />
//       <GenerateMonthlyBill
//         open={openEdit}
//         handleClose={handleCloseEditBooking}
//         data={rowData}
//       />
//       <DeleteBooking
//         open={openDelete}
//         handleClose={handleCloseDelete}
//         id={rowData?._id}
//       />

//       <Container maxWidth="lg">
//         <Card
//           sx={{
//             p: 0,
//             mt: 0,
//             height: 400,
//             borderRadius: 3,
//                         display: "flex",
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
//                 {t("Booking Management")}
//               </Typography>
//             </Stack>

//             <Button
//               variant="contained"
//               startIcon={<Iconify icon="eva:plus-fill" />}
//               onClick={handleOpenAdd}
//               sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
//             >
//               {t("Add Booking")}
//             </Button>
//           </Stack>

//           {/* Data Table with Tabs */}
//           <Box sx={{ flexGrow: 1 }}>
//             <TableStyle>
//               <Card sx={{ flexGrow: 1 }}>
//                 <TabContext value={value}>
//                   <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//                     <TabList onChange={handleChange} aria-label="Booking tabs">
//                       <Tab label={t("My Booking")} value="1" />
//                       {isAdmin && <Tab label={t("All Booking")} value="2" />}
//                       {isAdmin && (
//                         <Tab label={t("Booking On Notice")} value="3" />
//                       )}
//                     </TabList>
//                   </Box>
//                   <TabPanel value="1">
//                     <DataGrid
//                       rows={bookingData}
//                       columns={columns}
//                       getRowId={(row) => row._id || row.id}
//                       slots={{ toolbar: GridToolbar }}
//                       slotProps={{ toolbar: { showQuickFilter: true } }}
//                     />
                    
//                   </TabPanel>
//                   {isAdmin && (
//                     <TabPanel value="2">
//                       <DataGrid
//                         rows={bookingData}
//                         columns={columns}
//                         getRowId={(row) => row._id || row.id}
//                         slots={{ toolbar: GridToolbar }}
//                         slotProps={{ toolbar: { showQuickFilter: true } }}
//                       />
//                     </TabPanel>
//                   )}
//                   {isAdmin && (
//                     <TabPanel value="3">
//                       <DataGrid
//                         rows={bookingData}
//                         columns={columns}
//                         getRowId={(row) => row._id || row.id}
//                         slots={{ toolbar: GridToolbar }}
//                         slotProps={{ toolbar: { showQuickFilter: true } }}
//                       />
//                     </TabPanel>
//                   )}
//                 </TabContext>
//               </Card>
//             </TableStyle>
//           </Box>
//         </Card>
//       </Container>

      
//     </>
//   );
// };

// export default Booking;






// import { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   Container,
//   Card,
//   CardContent,
//   IconButton,
//   Snackbar,
//   Alert,
//   Fade,
//   Paper,
// } from "@mui/material";
// import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import { getApi } from "@/core/apis/api";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { toast } from "react-toastify";
// import { urls } from "@/core/Constant/urls";
// import {
//   Add as AddIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Visibility as VisibilityIcon,
// } from "@mui/icons-material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import AddBooking from "./AddBooking";
// import GenerateMonthlyBill from "./CreateBill";
// import DeleteBooking from "./DeleteBooking";
// import { tokenPayload } from "@/helper";
// import Tab from "@mui/material/Tab";
// import TabContext from "@mui/lab/TabContext";
// import TabList from "@mui/lab/TabList";
// import TabPanel from "@mui/lab/TabPanel";

// const Booking = () => {
//   const { t } = useTranslation();
//   const payload = tokenPayload();
//   const navigate = useNavigate();

//   // State
//   const [openDelete, setOpenDelete] = useState(false);
//   const [openAdd, setOpenAdd] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [rowData, setRowData] = useState(null);
//   const [bookingData, setBookingData] = useState([]);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });
//   const [value, setValue] = useState("1");

//   const isAdmin = payload?.role === "companyAdmin";

//   // API Fetchers
//   const formatData = (data) =>
//     data.map((item) => ({
//       ...item,
//       tenantName: item.tenantId?.tenantName,
//       ownerName: item.ownerId?.ownerName,
//       propertyName: item.propertyId?.propertyname,
//       blockName: item.blockId?.blockName,
//       projectName: item.projectId?.projectName,
//       startingDate: item.startingDate
//         ? new Date(item.startingDate).toLocaleDateString()
//         : "N/A",
//       endingDate: item.endingDate
//         ? new Date(item.endingDate).toLocaleDateString()
//         : "N/A",
//     }));

//   const fetchBookingData = async () => {
//     try {
//       const response = await getApi(urls.booking.bookingdata, {
//         id: payload._id,
//       });
//       setBookingData(formatData(response.data));
//     } catch {
//       toast.error(t("Failed to fetch booking data!"));
//     }
//   };

//   const fetchAllBookingData = async () => {
//     try {
//       const response = await getApi(urls.booking.allbooking, {
//         id: payload.companyId,
//       });
//       setBookingData(formatData(response.data));
//     } catch {
//       toast.error(t("Failed to fetch all bookings!"));
//     }
//   };

//   const fetchBookingDataOnNotice = async () => {
//     try {
//       const response = await getApi(urls.booking.propertyOnNotice, {
//         id: payload.companyId,
//       });
//       setBookingData(formatData(response.data));
//     } catch {
//       toast.error(t("Failed to fetch booking on notice!"));
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       if (value === "1") await fetchBookingData();
//       if (value === "2") await fetchAllBookingData();
//       if (value === "3") await fetchBookingDataOnNotice();
//     };
//     fetchData();
//   }, [value, openAdd, openEdit, openDelete]);

//   // Handlers
//   const handleCloseSnackbar = () =>
//     setSnackbar({ ...snackbar, open: false });

//   const handleOpenAdd = () => setOpenAdd(true);
//   const handleCloseAdd = () => setOpenAdd(false);

//   const handleOpenEdit = (row) => {
//     setRowData(row);
//     setOpenEdit(true);
//   };
//   const handleCloseEdit = () => setOpenEdit(false);

//   const handleOpenDelete = (row) => {
//     setRowData(row);
//     setOpenDelete(true);
//   };
//   const handleCloseDelete = () => setOpenDelete(false);

//   const handleOpenView = (row) => {
//     navigate(`/dashboard/booking/view?id=${row._id}&reporterName=${row.name}`);
//   };

//   // DataGrid Columns
//   const columns = [
//     {
//       field: "serialNo",
//       headerName: "S.No.",
//       width: 80,
//       renderCell: (params) =>
//         bookingData.findIndex((row) => row._id === params.row._id) + 1,
//     },
//     {
//       field: "propertyName",
//       headerName: t("Property Name"),
//       flex: 1,
//     },
//     { field: "blockName", headerName: t("Block Name"), flex: 1 },
//     { field: "projectName", headerName: t("Project Name"), flex: 1 },
//     { field: "tenantName", headerName: t("Tenant Name"), flex: 1 },
//     { field: "ownerName", headerName: t("Owner Name"), flex: 1 },
//     { field: "startingDate", headerName: t("Date"), flex: 1 },
//     { field: "name", headerName: t("Created By"), flex: 1 },
//     {
//       field: "actions",
//       headerName: t("Actions"),
//       flex: 1,
//       sortable: false,
//       renderCell: (params) => (
//         <Box>
//           <IconButton
//             size="small"
//             onClick={() => handleOpenEdit(params.row)}
//             sx={{ color: "primary.main" }}
//           >
//             <EditIcon fontSize="small" />
//           </IconButton>
//           <IconButton
//             size="small"
//             onClick={() => handleOpenView(params.row)}
//             sx={{ color: "success.main" }}
//           >
//             <VisibilityIcon fontSize="small" />
//           </IconButton>
//           <IconButton
//             size="small"
//             onClick={() => handleOpenDelete(params.row)}
//             sx={{ color: "error.main" }}
//             disabled={!isAdmin}
//           >
//             <DeleteIcon fontSize="small" />
//           </IconButton>
//         </Box>
//       ),
//     },
//   ];

//   return (
//     <Container maxWidth="lg" sx={{ p: 0 }}>
//       {/* Dialogs */}
//       <AddBooking open={openAdd} handleClose={handleCloseAdd} />
//       <GenerateMonthlyBill
//         open={openEdit}
//         handleClose={handleCloseEdit}
//         data={rowData}
//       />
//       <DeleteBooking
//         open={openDelete}
//         handleClose={handleCloseDelete}
//         id={rowData?._id}
//       />

//       <Fade in timeout={800}>
//         <Box>
//           {/* Main Card */}
//           <Card
//             elevation={0}
//             sx={{
//               borderRadius: 3,
//               borderColor: "divider",
//               minHeight: "440px",
//             }}
//           >
//             <CardContent sx={{ p: 2 }}>
//               {/* Gradient Header */}
//               <Box textAlign="center" mb={5}>
//                 <Typography
//                   variant="h3"
//                   component="h1"
//                   gutterBottom
//                   sx={{
//                     fontWeight: 700,
//                     background:
//                       "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
//                     backgroundClip: "text",
//                     WebkitBackgroundClip: "text",
//                     WebkitTextFillColor: "transparent",
//                     fontSize: "22px",
//                   }}
//                 >
//                   {t("Booking Management")}
//                 </Typography>
//                 <Typography
//                   variant="h6"
//                   color="text.secondary"
//                   sx={{ marginBottom: "30px" }}
//                 >
//                   {t("Manage and track all property bookings")}
//                 </Typography>
//               </Box>

//               {/* Created Section */}
//               {bookingData.length > 0 && (
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     mb: 3,
//                   }}
//                 >
//                   <Typography
//                     variant="h5"
//                     fontWeight="bold"
//                     color="primary"
//                   >
//                     {t("Created Bookings")} ({bookingData.length})
//                   </Typography>
//                   <Button
//                     variant="contained"
//                     startIcon={<AddIcon />}
//                     onClick={handleOpenAdd}
//                     sx={{
//                       px: 3,
//                       py: 1,
//                       borderRadius: 2,
//                       fontSize: "1rem",
//                       fontWeight: 600,
//                       background: "#2196f3",
//                       boxShadow: "0 4px 12px rgba(25,118,210,0.4)",
//                       "&:hover": {
//                         background:
//                           "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
//                         boxShadow: "0 6px 16px rgba(25,118,210,0.5)",
//                         transform: "translateY(-2px)",
//                       },
//                     }}
//                   >
//                     {t("Add New Booking")}
//                   </Button>
//                 </Box>
//               )}

//               {/* Empty State or Tabs with Table */}
//               {bookingData.length === 0 ? (
//                 <Paper
//                   sx={{
//                     p: 4,
//                     textAlign: "center",
//                     backgroundColor: "#f5f5f5",
//                     borderRadius: 2,
//                   }}
//                 >
//                   <Typography variant="h6" color="text.secondary" gutterBottom>
//                     {t("No Bookings Created Yet")}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ mb: 2 }}
//                   >
//                     {t("Get started by creating your first booking")}
//                   </Typography>
//                   <Button
//                     variant="contained"
//                     startIcon={<AddIcon />}
//                     onClick={handleOpenAdd}
//                     sx={{ mt: 2, background: "#2196f3" }}
//                   >
//                     {t("Add New Booking")}
//                   </Button>
//                 </Paper>
//               ) : (
//                 <TabContext value={value}>
//                   <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//                     <TabList
//                       onChange={(e, newValue) => setValue(newValue)}
//                       aria-label="Booking tabs"
//                     >
//                       <Tab label={t("My Booking")} value="1" />
//                       {isAdmin && <Tab label={t("All Booking")} value="2" />}
//                       {isAdmin && (
//                         <Tab label={t("Booking On Notice")} value="3" />
//                       )}
//                     </TabList>
//                   </Box>
//                   <TabPanel value="1">
//                     <DataGrid
//                       rows={bookingData}
//                       columns={columns}
//                       getRowId={(row) => row._id}
//                       slots={{ toolbar: GridToolbar }}
//                       slotProps={{ toolbar: { showQuickFilter: true } }}
//                       autoHeight
//                     />
//                   </TabPanel>
//                   {isAdmin && (
//                     <TabPanel value="2">
//                       <DataGrid
//                         rows={bookingData}
//                         columns={columns}
//                         getRowId={(row) => row._id}
//                         slots={{ toolbar: GridToolbar }}
//                         slotProps={{ toolbar: { showQuickFilter: true } }}
//                         autoHeight
//                       />
//                     </TabPanel>
//                   )}
//                   {isAdmin && (
//                     <TabPanel value="3">
//                       <DataGrid
//                         rows={bookingData}
//                         columns={columns}
//                         getRowId={(row) => row._id}
//                         slots={{ toolbar: GridToolbar }}
//                         slotProps={{ toolbar: { showQuickFilter: true } }}
//                         autoHeight
//                       />
//                     </TabPanel>
//                   )}
//                 </TabContext>
//               )}
//             </CardContent>
//           </Card>
//         </Box>
//       </Fade>

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={snackbar.severity}
//           sx={{
//             width: "100%",
//             borderRadius: 2,
//             boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//           }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default Booking;



import { useState, useEffect } from "react";
import * as React from "react";
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
  EventAvailable,
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
import AddBooking from "./AddBooking";
import GenerateMonthlyBill from "./CreateBill";
import DeleteBooking from "./DeleteBooking";
import { tokenPayload } from "@/helper";

const Booking = () => {
  const { t } = useTranslation();
  const payload = tokenPayload();
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [bookingData, setBookingData] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const isAdmin = payload?.role === "companyAdmin";

  // Fetch booking data
  const fetchBookingData = async () => {
    try {
      const response = await getApi(urls.booking.allbooking, {
        id: payload.companyId,
      });
      const formattedData = response.data.map((item) => ({
        ...item,
        tenantName: item.tenantId?.tenantName,
        ownerName: item.ownerId?.ownerName,
        propertyName: item.propertyId?.propertyname,
        blockName: item.blockId?.blockName,
        projectName: item.projectId?.projectName,
        startingDate: item.startingDate
          ? new Date(item.startingDate).toLocaleDateString()
          : "N/A",
        endingDate: item.endingDate
          ? new Date(item.endingDate).toLocaleDateString()
          : "N/A",
      }));
      setBookingData(formattedData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error(t("Failed to fetch bookings!"));
    }
  };

  useEffect(() => {
    fetchBookingData();
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
        const index = bookingData.findIndex(
          (row) => row._id === params.row._id
        );
        return index + 1;
      },
    },
    { field: "propertyName", headerName: t("Property Name"), flex: 1 },
    { field: "blockName", headerName: t("Block Name"), flex: 1 },
    { field: "projectName", headerName: t("Project Name"), flex: 1 },
    { field: "tenantName", headerName: t("Tenant Name"), flex: 1 },
    { field: "ownerName", headerName: t("Owner Name"), flex: 1 },
    { field: "startingDate", headerName: t("Start Date"), flex: 1 },
    { field: "endingDate", headerName: t("End Date"), flex: 1 },
    { field: "name", headerName: t("Created By"), flex: 1 },
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
      <AddBooking open={openAdd} handleClose={handleCloseAdd} />
      <GenerateMonthlyBill
        open={openEdit}
        handleClose={handleCloseEdit}
        data={rowData}
      />
      <DeleteBooking
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
                  {t("Booking Management")}
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ marginBottom: "30px" }}
                >
                  {t("Manage and track property bookings")}
                </Typography>
              </Box>

              {/* Created Section */}
              {bookingData.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <EventAvailable
                      sx={{ mr: 2, color: "primary.main", fontSize: 32 }}
                    />
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      {t("Created Bookings")} ({bookingData.length})
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
                    {t("Add New Booking")}
                  </Button>
                </Box>
              )}

              {/* Empty State or Table */}
              {bookingData.length === 0 ? (
                <Paper
                  sx={{
                    p: 4,
                    textAlign: "center",
                    backgroundColor: "#f5f5f5",
                    borderRadius: 2,
                  }}
                >
                  <EventAvailable
                    sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t("No Bookings Created Yet")}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {t("Get started by creating your first booking")}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAdd}
                    sx={{ mt: 2, background: "#2196f3" }}
                  >
                    {t("Add New Booking")}
                  </Button>
                </Paper>
              ) : (
                <DataGrid
                  rows={bookingData}
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

export default Booking;
