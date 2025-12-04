// import React, { useState, useEffect } from 'react';
// import {
//     Container,
//     Grid,
//     Card,
//     CardContent,
//     Snackbar,
//     Alert,
//     Box,
//     Typography
// } from '@mui/material';
// import { getApi, postApi, updateApi, deleteApi } from '@/core/apis/api';
// import { urls } from '@/core/Constant/urls';
// import UserForm from './components/UserForm';
// import UserTable from './components/UserTable';
// import EditBanner from './components/EditBanner';
// import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

// const User = () => {
//     const [formData, setFormData] = useState({
//         Name: '',
//         Email: '',
//         Password: '',
//         type: ""
//     });
//     const [editingUser, setEditingUser] = useState(null);
//     const [errors, setErrors] = useState({});
//     const [users, setUsers] = useState([]);
//     const [snackbar, setSnackbar] = useState({
//         open: false,
//         message: '',
//         severity: 'success'
//     });

//     // useEffect(() => {
//     //     fetchUsers();
//     // }, []);

//     const fetchUsers = async () => {
//         try {
//             const res = await getApi(urls.Users.getAllUsers);
//             setUsers(
//                 res.data.map((item, index) => ({
//                     ...item,
//                     id: item._id || index
//                 }))
//             );
//         } catch (err) {
//             setSnackbar({
//                 open: true,
//                 message: 'Error fetching users.',
//                 severity: 'error'
//             });
//         }
//     };

//     const handleChange = (field) => (e) =>
//         setFormData({ ...formData, [field]: e.target.value });

//     const validate = () => {
//         const errs = {};
//         if (!formData.Name)
//             errs.Name = ' name is required';
//         if (!formData.Email)
//             errs.Email = ' Email is required';
//         if (!formData.Password)
//             errs.Password = 'Passowrd is required';
//         if (!formData.type)
//             errs.type = "type is required"
//         setErrors(errs);
//         return Object.keys(errs).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validate()) return;
//         try {
//             if (editingUser) {
//                 await updateApi(
//                     `${urls.Users.editUser}/${editingUser._id}`,
//                     formData
//                 );
//                 setSnackbar({
//                     open: true,
//                     message: 'User updated.',
//                     severity: 'success'
//                 });
//             } else {
//                 await postApi(urls.User.postUser, formData);
//                 setSnackbar({
//                     open: true,
//                     message: 'User registered.',
//                     severity: 'success'
//                 });
//             }
//             setFormData({
//                 Name: '',
//                 Email: '',
//                 Password: '',
//                 type: ""
//             });
//             setEditingUser(null);
//             // fetchUsers();
//         } catch (err) {
//             setSnackbar({
//                 open: true,
//                 message: err?.message || 'Error occurred.',
//                 severity: 'error'
//             });
//         }
//     };

//     const handleEdit = (user) => {
//         setEditing(user);
//         setFormData({
//             Name: user.Name,
//             Email: user.Email,
//             Password: user.Password,
//             type: user.type
//         });
//     };

//     const handleDelete = async (id) => {
//         try {
//             await deleteApi(`${urls.User.deleteUser}/${id}`);
//             setSnackbar({
//                 open: true,
//                 message: 'Deleted successfully.',
//                 severity: 'success'
//             });
//             fetchProducts();
//         } catch (err) {
//             setSnackbar({
//                 open: true,
//                 message: 'Delete failed.',
//                 severity: 'error'
//             });
//         }
//     };

//     return (
//         <Container maxWidth="lg" sx={{ py: 4 }}>
//             <Box textAlign="center" mb={4}>
//                 <ManageAccountsIcon
//                     sx={{
//                         fontSize: 48,
//                         color: 'primary.main',
//                         mb: 2
//                     }}
//                 />
//                 <Typography
//                     variant="h3"
//                     component="h1"
//                     gutterBottom
//                     sx={{
//                         fontWeight: 700,
//                         background:
//                             'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
//                         backgroundClip: 'text',
//                         WebkitBackgroundClip: 'text',
//                         WebkitTextFillColor: 'transparent'
//                     }}
//                 >
//                     Users Registration
//                 </Typography>
//                 <Typography
//                     variant="h6"
//                     color="text.secondary"
//                     sx={{ marginBottom: '40px' }}
//                 >
//                     {editingUser
//                         ? 'Update Users information'
//                         : 'Register new User with detailed information'}
//                 </Typography>
//             </Box>
//             <Grid container spacing={4}>
//                 <Grid item xs={12} md={8} mx="auto">
//                     <Card>
//                         <CardContent>
//                             {editingUser && (
//                                 <EditBanner
//                                     Name={editingUser.Name}
//                                     onCancel={() => setEditingUser(null)}
//                                 />
//                             )}
//                             <UserForm
//                                 formData={formData}
//                                 errors={errors}
//                                 onChange={handleChange}
//                                 onSubmit={handleSubmit}
//                                 editingUser={editingUser}
//                             />
//                         </CardContent>
//                     </Card>
//                 </Grid>
//                 <Grid item xs={12}>
//                     <Card>
//                         <CardContent>
//                             <UserTable
//                                 users={users}
//                                 onEdit={handleEdit}
//                                 onDelete={handleDelete}
//                             />
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             </Grid>
//             <Snackbar
//                 open={snackbar.open}
//                 autoHideDuration={4000}
//                 onClose={() =>
//                     setSnackbar({ ...snackbar, open: false })
//                 }
//             >
//                 <Alert
//                     severity={snackbar.severity}
//                     onClose={() =>
//                         setSnackbar({ ...snackbar, open: false })
//                     }
//                 >
//                     {snackbar.message}
//                 </Alert>
//             </Snackbar>
//         </Container>
//     );
// };

// export default User;





// import React, { useState } from "react";
// import {
//   Container,
//   Grid,
//   Card,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Snackbar,
//   Alert,
//   Paper,
// } from "@mui/material";
// import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
// import SaveIcon from "@mui/icons-material/Save";
// import { getApi, postApi, updateApi, deleteApi } from "@/core/apis/api";
// import { urls } from "@/core/Constant/urls";
// import UserTable from "./components/UserTable";

// const User = () => {
//   const [formData, setFormData] = useState({
//     Name: "",
//     Email: "",
//     Password: "",
//     type: "",
//   });
//   const [editingUser, setEditingUser] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [users, setUsers] = useState([]);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   // Input change handler
//   const handleChange = (field) => (e) =>
//     setFormData({ ...formData, [field]: e.target.value });

//   // Validation
//   const validate = () => {
//     const errs = {};
//     if (!formData.Name) errs.Name = "Name is required";
//     if (!formData.Email) errs.Email = "Email is required";
//     if (!formData.Password) errs.Password = "Password is required";
//     if (!formData.type) errs.type = "Type is required";
//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   // Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     try {
//       if (editingUser) {
//         await updateApi(`${urls.Users.editUser}/${editingUser._id}`, formData);
//         setSnackbar({
//           open: true,
//           message: "User updated successfully.",
//           severity: "success",
//         });
//       } else {
//         await postApi(urls.User.postUser, formData);
//         setSnackbar({
//           open: true,
//           message: "User registered successfully.",
//           severity: "success",
//         });
//       }
//       setFormData({ Name: "", Email: "", Password: "", type: "" });
//       setEditingUser(null);
//     } catch (err) {
//       setSnackbar({
//         open: true,
//         message: err?.message || "Error occurred.",
//         severity: "error",
//       });
//     }
//   };

//   // Edit
//   const handleEdit = (user) => {
//     setEditingUser(user);
//     setFormData({
//       Name: user.Name,
//       Email: user.Email,
//       Password: user.Password,
//       type: user.type,
//     });
//   };

//   // Delete
//   const handleDelete = async (id) => {
//     try {
//       await deleteApi(`${urls.User.deleteUser}/${id}`);
//       setSnackbar({
//         open: true,
//         message: "Deleted successfully.",
//         severity: "success",
//       });
//     } catch {
//       setSnackbar({
//         open: true,
//         message: "Delete failed.",
//         severity: "error",
//       });
//     }
//   };

//   // Snackbar close
//   const handleCloseSnackbar = () =>
//     setSnackbar({ ...snackbar, open: false });

//   return (
//     <Container maxWidth="xl">
//       {/* Form Card */}
//       <Card
//         sx={{
//           p: 4,
//           mt: 2,
//           boxShadow: 4,
//           borderRadius: 3,
//           background: "linear-gradient(135deg, #ffffff, #fafafa)",
//           minHeight: "450px",
//           width: "100%",
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             mb: 3,
//             textAlign: "center",
//             borderBottom: "2px solid #eee",
//             pb: 2,
//           }}
//         >
//           <ManageAccountsIcon
//             sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
//           />
//           <Typography
//             variant="h4"
//             sx={{ fontWeight: "bold", color: "primary.main", fontSize: "24px" }}
//             gutterBottom
//           >
//             User Management
//           </Typography>
//           <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
//             {editingUser
//               ? "Update user information"
//               : "Register new users with complete details"}
//           </Typography>
//         </Box>

//         {/* Form */}
//         <Box component="form" onSubmit={handleSubmit} noValidate>
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Name"
//                 value={formData.Name}
//                 onChange={handleChange("Name")}
//                 error={!!errors.Name}
//                 helperText={errors.Name}
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Email"
//                 value={formData.Email}
//                 onChange={handleChange("Email")}
//                 error={!!errors.Email}
//                 helperText={errors.Email}
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 type="password"
//                 label="Password"
//                 value={formData.Password}
//                 onChange={handleChange("Password")}
//                 error={!!errors.Password}
//                 helperText={errors.Password}
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Type"
//                 value={formData.type}
//                 onChange={handleChange("type")}
//                 error={!!errors.type}
//                 helperText={errors.type}
//               />
//             </Grid>

//             {editingUser && (
//               <Grid item xs={12}>
//                 <Box
//                   display="flex"
//                   justifyContent="space-between"
//                   alignItems="center"
//                   p={2}
//                   bgcolor="#e3f2fd"
//                   borderRadius={2}
//                 >
//                   <Typography variant="body2" color="primary" fontWeight="bold">
//                     Editing: {editingUser.Name}
//                   </Typography>
//                   <Button size="small" onClick={() => setEditingUser(null)}>
//                     Cancel Edit
//                   </Button>
//                 </Box>
//               </Grid>
//             )}

//             <Grid item xs={12}>
//               <Box textAlign="center">
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   size="large"
//                   startIcon={<SaveIcon />}
//                 >
//                   {editingUser ? "Update User" : "Register User"}
//                 </Button>
//               </Box>
//             </Grid>
//           </Grid>
//         </Box>
//       </Card>

//       {/* Table Card */}
//       <Card
//         sx={{
//           p: 4,
//           mt: 4,
//           boxShadow: 4,
//           borderRadius: 3,
//           background: "linear-gradient(135deg, #ffffff, #fafafa)",
//           minHeight: "430px",
//           width: "100%",
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//           <ManageAccountsIcon
//             sx={{ mr: 2, color: "primary.main", fontSize: 28 }}
//           />
//           <Typography variant="h6" fontWeight="bold" color="primary">
//             Registered Users ({users.length})
//           </Typography>
//         </Box>

//         {users.length === 0 ? (
//           <Paper
//             sx={{
//               p: 4,
//               textAlign: "center",
//               backgroundColor: "#f5f5f5",
//               borderRadius: 2,
//             }}
//           >
//             <ManageAccountsIcon
//               sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
//             />
//             <Typography variant="h6" color="text.secondary" gutterBottom>
//               No Users Registered Yet
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Register your first user using the form above
//             </Typography>
//           </Paper>
//         ) : (
//           <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
//         )}
//       </Card>

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
//           sx={{ borderRadius: 2 }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default User;



// import React, { useState } from "react";
// import {
//   Container,
//   Grid,
//   Card,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Snackbar,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Stack,
// } from "@mui/material";
// import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
// import SaveIcon from "@mui/icons-material/Save";
// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import { getApi, postApi, updateApi, deleteApi } from "@/core/apis/api";
// import { urls } from "@/core/Constant/urls";
// import { Link } from "react-router-dom";
// import { IconHome } from "@tabler/icons";

// const User = () => {
//   const [formData, setFormData] = useState({
//     Name: "",
//     Email: "",
//     Password: "",
//     type: "",
//   });
//   const [editingUser, setEditingUser] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [users, setUsers] = useState([]);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });
//   const [openDialog, setOpenDialog] = useState(false);

//   // Input change handler
//   const handleChange = (field) => (e) =>
//     setFormData({ ...formData, [field]: e.target.value });

//   // Validation
//   const validate = () => {
//     const errs = {};
//     if (!formData.Name) errs.Name = "Name is required";
//     if (!formData.Email) errs.Email = "Email is required";
//     if (!formData.Password) errs.Password = "Password is required";
//     if (!formData.type) errs.type = "Type is required";
//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   // Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     try {
//       if (editingUser) {
//         await updateApi(`${urls.Users.editUser}/${editingUser._id}`, formData);
//         setSnackbar({
//           open: true,
//           message: "User updated successfully.",
//           severity: "success",
//         });
//       } else {
//         await postApi(urls.User.postUser, formData);
//         setSnackbar({
//           open: true,
//           message: "User registered successfully.",
//           severity: "success",
//         });
//       }
//       setFormData({ Name: "", Email: "", Password: "", type: "" });
//       setEditingUser(null);
//       setOpenDialog(false);
//     } catch (err) {
//       setSnackbar({
//         open: true,
//         message: err?.message || "Error occurred.",
//         severity: "error",
//       });
//     }
//   };

//   // Edit
//   const handleEdit = (user) => {
//     setEditingUser(user);
//     setFormData({
//       Name: user.Name,
//       Email: user.Email,
//       Password: user.Password,
//       type: user.type,
//     });
//     setOpenDialog(true);
//   };

//   // Delete
//   const handleDelete = async (id) => {
//     try {
//       await deleteApi(`${urls.User.deleteUser}/${id}`);
//       setSnackbar({
//         open: true,
//         message: "Deleted successfully.",
//         severity: "success",
//       });
//     } catch {
//       setSnackbar({
//         open: true,
//         message: "Delete failed.",
//         severity: "error",
//       });
//     }
//   };

//   // Snackbar close
//   const handleCloseSnackbar = () =>
//     setSnackbar({ ...snackbar, open: false });

//   // Table columns
//   const columns = [
//     { field: "Name", headerName: "Name", flex: 1 },
//     { field: "Email", headerName: "Email", flex: 1 },
//     { field: "type", headerName: "Type", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => (
//         <Stack direction="row" spacing={1}>
//           <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(params.row)} />
//           <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(params.row._id)} />
//         </Stack>
//       ),
//     },
//   ];

//   return (
//     <>
//       {/* Dialog for Add/Edit User */}
//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
//         <DialogContent dividers>
//           <form onSubmit={handleSubmit}>
//             <Grid container spacing={2}>
//               {[
//                 { label: "Name", field: "Name" },
//                 { label: "Email", field: "Email" },
//                 { label: "Password", field: "Password", type: "password" },
//                 { label: "Type", field: "type" },
//               ].map(({ label, field, type = "text" }) => (
//                 <Grid item xs={12} key={field}>
//                   <TextField
//                     fullWidth
//                     label={label}
//                     type={type}
//                     value={formData[field]}
//                     onChange={handleChange(field)}
//                     error={!!errors[field]}
//                     helperText={errors[field]}
//                   />
//                 </Grid>
//               ))}
//             </Grid>
//           </form>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//           <Button onClick={handleSubmit} variant="contained" startIcon={<SaveIcon />}>
//             {editingUser ? "Update User" : "Save User"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar */}
//       <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
//         <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} sx={{ width: "100%" }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>

//       {/* Main Layout */}
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
//           <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1, pb: 1, borderBottom: "2px solid", borderColor: "divider" }}>
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
//               <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main", fontSize: "24px" }}>
//                 User Management
//               </Typography>
//             </Stack>
//             <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
//               Add User
//             </Button>
//           </Stack>

//           {/* DataGrid */}
//           <Box sx={{ flexGrow: 1 }}>
//             <DataGrid
//               rows={users}
//               columns={columns}
//               getRowId={(row) => row._id}
//               slots={{ toolbar: GridToolbar }}
//               slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 500 } } }}
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

// export default User;



import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Stack,
  Fade,
  Paper,
  IconButton,
} from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { getApi, postApi, updateApi, deleteApi } from "@/core/apis/api";
import { urls } from "@/core/Constant/urls";

const User = () => {
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Password: "",
    type: "",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openDialog, setOpenDialog] = useState(false);

  // Input change handler
  const handleChange = (field) => (e) =>
    setFormData({ ...formData, [field]: e.target.value });

  // Validation
  const validate = () => {
    const errs = {};
    if (!formData.Name) errs.Name = "Name is required";
    if (!formData.Email) errs.Email = "Email is required";
    if (!formData.Password) errs.Password = "Password is required";
    if (!formData.type) errs.type = "Type is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      if (editingUser) {
        await updateApi(`${urls.Users.editUser}/${editingUser._id}`, formData);
        setSnackbar({
          open: true,
          message: "User updated successfully.",
          severity: "success",
        });
      } else {
        await postApi(urls.User.postUser, formData);
        setSnackbar({
          open: true,
          message: "User registered successfully.",
          severity: "success",
        });
      }
      setFormData({ Name: "", Email: "", Password: "", type: "" });
      setEditingUser(null);
      setOpenDialog(false);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Error occurred.",
        severity: "error",
      });
    }
  };

  // Edit
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      Name: user.Name,
      Email: user.Email,
      Password: user.Password,
      type: user.type,
    });
    setOpenDialog(true);
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await deleteApi(`${urls.User.deleteUser}/${id}`);
      setSnackbar({
        open: true,
        message: "Deleted successfully.",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Delete failed.",
        severity: "error",
      });
    }
  };

  // Snackbar close
  const handleCloseSnackbar = () =>
    setSnackbar({ ...snackbar, open: false });

  // Table columns
  const columns = [
    { field: "Name", headerName: "Name", flex: 1 },
    { field: "Email", headerName: "Email", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(params.row._id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ p: 0 }}>
      {/* Dialog for Add/Edit User */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {[
                { label: "Name", field: "Name" },
                { label: "Email", field: "Email" },
                { label: "Password", field: "Password", type: "password" },
                { label: "Type", field: "type" },
              ].map(({ label, field, type = "text" }) => (
                <Grid item xs={12} key={field}>
                  <TextField
                    fullWidth
                    label={label}
                    type={type}
                    value={formData[field]}
                    onChange={handleChange(field)}
                    error={!!errors[field]}
                    helperText={errors[field]}
                  />
                </Grid>
              ))}
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<SaveIcon />}
          >
            {editingUser ? "Update User" : "Save User"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

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
                  User Management
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ marginBottom: "30px" }}
                >
                  Manage and configure users for the system
                </Typography>
              </Box>

              {/* Created Section */}
              {users.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ManageAccountsIcon
                      sx={{ mr: 2, color: "primary.main", fontSize: 32 }}
                    />
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="primary"
                    >
                      Created Users ({users.length})
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
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
                    Add User
                  </Button>
                </Box>
              )}

              {/* Empty State or Table */}
              {users.length === 0 ? (
                <Paper
                  sx={{
                    p: 4,
                    textAlign: "center",
                    backgroundColor: "#f5f5f5",
                    borderRadius: 2,
                  }}
                >
                  <ManageAccountsIcon
                    sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                  />
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    gutterBottom
                  >
                    No Users Created Yet
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Get started by creating your first user
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                    sx={{ mt: 2, background: "#2196f3" }}
                  >
                    Add User
                  </Button>
                </Paper>
              ) : (
                <DataGrid
                  rows={users}
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

export default User;
