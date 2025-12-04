// import React, { useEffect, useState } from 'react';
// import {
//   Container, Card, Typography, Box, Stack, Breadcrumbs,
//   TextField, Button, Grid, MenuItem
// } from '@mui/material';
// import { Home as HomeIcon } from '@mui/icons-material';
// import { Link } from 'react-router-dom';
// import { getApi } from '@/core/apis/api';
// import { urls } from '@/core/Constant/urls';
// import { tokenPayload } from '@/helper';

// const cellStyle = {
//   padding: '8px',
//   border: '1px solid #ddd',
//   textAlign: 'center'
// };

// const ProductActivity = () => {
//   const [activityData, setActivityData] = useState([]);
//   const [productList, setProductList] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [productName, setProductName] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const payload = tokenPayload() 
  
// const fetchActivityData = async () => {
//   setLoading(true);
//   try {
//     const queryParams = new URLSearchParams();
//     if (startDate) queryParams.append('startDate', startDate);
//     if (endDate) queryParams.append('endDate', endDate);
//     if (productName) queryParams.append('productName', productName);
//     if (payload?._id) queryParams.append('companyId', payload._id); // ← fixed here

//     const response = await getApi(`${urls.Inventory.allActivties}?${queryParams.toString()}`);
//     console.log(response.data);
//     const data = Array.isArray(response.data) ? response.data : [response.data];
//     setActivityData(data);
//   } catch (err) {
//     console.error('Failed to fetch activity summary:', err);
//   } finally {
//     setLoading(false);
//   }
// };


//   const dropDown = async () => {
//     try {
//       const response = await getApi(`${urls.Inventory.dropDowns}?companyId=${payload._id}`);
//       const { productName } = response.data;
//       setProductList(productName || []);
//     } catch (error) {
//       console.error('Failed to fetch dropdown products:', error);
//     }
//   };

//   useEffect(() => {
//     dropDown();
//   }, []);

//   const handleFilterSubmit = (e) => {
//     e.preventDefault();
//     fetchActivityData();
//   };

//   const handleClear = () => {
//     setProductName('');
//     setStartDate('');
//     setEndDate('');
//     fetchActivityData();
//   };

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4 }}>
//       {/* Header */}
//       <Card sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 2 }}>
//         <Stack direction="row" alignItems="center" justifyContent="space-between">
//           <Typography variant="h4" fontWeight="bold" color="primary" fontsize="24px">
//             Product Activity Summary
//           </Typography>
//           <Breadcrumbs separator="›">
//             <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
//               <HomeIcon fontSize="small" />
//             </Link>
//             <Typography color="text.primary">Activity Summary</Typography>
//           </Breadcrumbs>
//         </Stack>
//       </Card>

//       {/* Filter Form */}
//       <Card sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 1 }}>
//         <form onSubmit={handleFilterSubmit}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 select
//                 fullWidth
//                 label="Product Name"
//                 value={productName}
//                 onChange={(e) => setProductName(e.target.value)}
//               >
//                 <MenuItem value="">All Products</MenuItem>
//                 {productList.map((item) => (
//                   <MenuItem key={item._id} value={item.productName}>
//                     {item.productName}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={3}>
//               <TextField
//                 fullWidth
//                 type="date"
//                 label="Start Date"
//                 InputLabelProps={{ shrink: true }}
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12} sm={3}>
//               <TextField
//                 fullWidth
//                 type="date"
//                 label="End Date"
//                 InputLabelProps={{ shrink: true }}
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12} sm={2} display="flex" alignItems="center">
//               <Button type="submit" variant="contained" fullWidth sx={{ mr: 1 }}>
//                 Generate
//               </Button>
//               <Button variant="outlined" fullWidth onClick={handleClear}>
//                 Clear
//               </Button>
//             </Grid>
//           </Grid>
//         </form>
//       </Card>

//       {/* Activity Report Table */}
//       <Card sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
//         {loading ? (
//           <Typography>Loading...</Typography>
//         ) : activityData.length === 0 ? (
//           <Typography>No activity data available.</Typography>
//         ) : (
//           activityData.map((product, idx) => (
//             <Box key={idx} sx={{ mb: 4 }}>
//               <Typography variant="h6" fontWeight="bold" gutterBottom>
//                 Product: {product.productName}
//               </Typography>
//               <Box sx={{ overflowX: 'auto' }}>
//                 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                   <thead>
//                     <tr style={{ background: '#f0f0f0' }}>
//                       <th style={cellStyle}>S.No</th>
//                       <th style={cellStyle}>Date</th>
//                       <th style={cellStyle}>Particulars</th>
//                       <th style={cellStyle}>Inwards</th>
//                       <th style={cellStyle}>Outwards</th>
//                       <th style={cellStyle}>Balance</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {product.report.map((entry, i) => (
//                       <tr key={i}>
//                         <td style={cellStyle}>{i + 1}</td>
//                         <td style={cellStyle}>{entry.date}</td>
//                         <td style={cellStyle}>{entry.particulars}</td>
//                         <td style={cellStyle}>{entry.inwards}</td>
//                         <td style={cellStyle}>{entry.outwards}</td>
//                         <td style={cellStyle}>{entry.balance}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </Box>
//             </Box>
//           ))
//         )}
//       </Card>
//     </Container>
//   );
// };

// export default ProductActivity;



import React, { useEffect, useState } from 'react';
import {
  Container, Card, Typography, Box, Stack, Breadcrumbs,
  TextField, Button, Grid, MenuItem,Divider
} from '@mui/material';
import { Home as HomeIcon, Inventory2 as InventoryIcon } from "@mui/icons-material";
import { Link } from 'react-router-dom';
import { getApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { tokenPayload } from '@/helper';

const cellStyle = {
  padding: '8px',
  border: '1px solid #ddd',
  textAlign: 'center'
};

const ProductActivity = () => {
  const [activityData, setActivityData] = useState([]);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [productName, setProductName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const payload = tokenPayload() 
  
const fetchActivityData = async () => {
  setLoading(true);
  try {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    if (productName) queryParams.append('productName', productName);
    if (payload?._id) queryParams.append('companyId', payload._id); // ← fixed here

    const response = await getApi(`${urls.Inventory.allActivties}?${queryParams.toString()}`);
    console.log(response.data);
    const data = Array.isArray(response.data) ? response.data : [response.data];
    setActivityData(data);
  } catch (err) {
    console.error('Failed to fetch activity summary:', err);
  } finally {
    setLoading(false);
  }
};


  const dropDown = async () => {
    try {
      const response = await getApi(`${urls.Inventory.dropDowns}?companyId=${payload._id}`);
      const { productName } = response.data;
      setProductList(productName || []);
    } catch (error) {
      console.error('Failed to fetch dropdown products:', error);
    }
  };

  useEffect(() => {
    dropDown();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchActivityData();
  };

  const handleClear = () => {
    setProductName('');
    setStartDate('');
    setEndDate('');
    fetchActivityData();
  };


return (
    <Container maxWidth="lg" sx={{ mt: 0 }}>
      <Card
        sx={{
           p: 0,
          borderRadius: 3,
          // boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
          minHeight: "430px",
          width: "100%",
          
        }}
      >
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(25,118,210,0.1)",
              }}
            >
               <Link to="/" style={{ textDecoration: "none",fontSize: "1.5rem", color: "#1976d2" }}>
              <HomeIcon sx={{ color: "#1976d2",fontSize: "22px" }} />
              </Link>
            </Box>
            <Typography variant="h4" fontWeight="bold" color="primary" fontSize="22px">
              Product Activity Summary
            </Typography>
          </Stack>

          
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Filter Form */}
        <form onSubmit={handleFilterSubmit}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                variant="outlined"
              >
                <MenuItem value="">All Products</MenuItem>
                {productList.map((item) => (
                  <MenuItem key={item._id} value={item.productName}>
                    {item.productName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={2} display="flex" alignItems="center" gap={1}>
              <Button type="submit" variant="contained" fullWidth>
                Generate
              </Button>
              <Button variant="outlined" fullWidth onClick={handleClear}>
                Clear
              </Button>
            </Grid>
          </Grid>
        </form>

        <Divider sx={{ my: 2 }} />

        {/* Activity Report Table */}
        {loading ? (
          <Stack alignItems="center" py={4}>
            <CircularProgress />
            <Typography mt={2}>Loading activity data...</Typography>
          </Stack>
        ) : activityData.length === 0 ? (
          <Typography align="center" py={4} color="text.secondary">
            No activity data available.
          </Typography>
        ) : (
          activityData.map((product, idx) => (
            <Box key={idx} sx={{ mb: 5 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="primary"
                gutterBottom
              >
                Product: {product.productName}
              </Typography>
              <Paper variant="outlined" sx={{ borderRadius: 2, overflowX: "auto" }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "rgba(25,118,210,0.08)" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>S.No</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Particulars</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Inwards</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Outwards</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Balance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {product.report.map((entry, i) => (
                      <TableRow
                        key={i}
                        sx={{
                          "&:hover": { backgroundColor: "#f9f9f9" },
                        }}
                      >
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell>{entry.particulars}</TableCell>
                        <TableCell sx={{ color: "green", fontWeight: 600 }}>
                          {entry.inwards}
                        </TableCell>
                        <TableCell sx={{ color: "red", fontWeight: 600 }}>
                          {entry.outwards}
                        </TableCell>
                        <TableCell sx={{ color: "primary.main", fontWeight: 600 }}>
                          {entry.balance}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Box>
          ))
        )}
      </Card>
    </Container>
  );
};

export default ProductActivity;