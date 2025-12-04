// import { useState, useEffect } from 'react';
// import {
//   Container, Card, Typography, Stack, Breadcrumbs, Box
// } from '@mui/material';
// import { Home as HomeIcon } from '@mui/icons-material';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { TabContext, TabList, TabPanel } from '@mui/lab';
// import Tab from '@mui/material/Tab';
// import { getApi } from '@/core/apis/api';
// import { urls } from '@/core/Constant/urls';
// import { tokenPayload } from '@/helper';


// const StockReport = () => {
//   const { t } = useTranslation();

//   const [stockData, setStockData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [tabValue, setTabValue] = useState('1');

//   const [page, setPage] = useState(0);
//   const [pageSize, setPageSize] = useState(10);
//   const [rowCount, setRowCount] = useState(0);
//   const payload = tokenPayload()
//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   const fetchStockData = async () => {
//     setLoading(true);
//     try {
//       const res = await getApi(`${urls.Inventory.allReports}?page=${page + 1}&limit=${pageSize}&companyId=${payload._id}`);
//       const reports = res?.data?.data || [];
//       setStockData(reports);
//       setRowCount(res?.data?.total || 0);
//     } catch (error) {
//       console.error(t('Error fetching stock data:'), error);
//       setStockData([]);
//       setRowCount(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const stockColumns = [
//     {
//       field: 'serialNo',
//       headerName: 'S.No.',
//       width: 80,
//       renderCell: (params) => (page * pageSize) + stockData.findIndex(row => row._id === params.row._id) + 1
//     },
//     {
//       field: 'productName',
//       headerName: t('Product Name'),
//       flex: 1.2,
//       renderCell: (params) => (
//         <Typography fontWeight="bold" color="primary">
//           {params.row.productName}
//         </Typography>
//       )
//     },
//     {
//       field: 'productModel',
//       headerName: t('Product Model'),
//       flex: 1,
//       renderCell: (params) => (
//         <Typography variant="body2" color="text.secondary">
//           {params.row.productModel}
//         </Typography>
//       )
//     },
//     {
//       field: 'totalQuantity',
//       headerName: t('Available Quantity'),
//       flex: 1,
//       renderCell: (params) => (
//         <Typography
//           color={params.row.totalQuantity > 10 ? 'green' : params.row.totalQuantity > 0 ? 'orange' : 'red'}
//           fontWeight="bold"
//           sx={{ fontSize: '1rem' }}
//         >
//           {params.row.totalQuantity}
//         </Typography>
//       )
//     },
//     {
//       field: 'unitPerPrice',
//       headerName: t('Unit Price'),
//       flex: 1,
//       renderCell: (params) => {
//         const firstPurchase = params.row.purchases?.[0];
//         const unitPrice = firstPurchase?.unitPerPrice || 0;
//         return (
//           <Typography fontWeight="bold" color="success.main">
//             Rs: {unitPrice.toFixed(2)}
//           </Typography>
//         );
//       }
//     },
//     {
//       field: 'status',
//       headerName: t('Stock Status'),
//       flex: 1,
//       renderCell: (params) => {
//         const quantity = params.row.totalQuantity;
//         let status = '';
//         let color = '';
//         let bgColor = '';

//         if (quantity > 10) {
//           status = t('In Stock');
//           color = 'white';
//           bgColor = '#4caf50';
//         } else if (quantity > 0) {
//           status = t('Low Stock');
//           color = 'white';
//           bgColor = '#ff9800';
//         } else {
//           status = t('Out of Stock');
//           color = 'white';
//           bgColor = '#f44336';
//         }

//         return (
//           <Typography
//             sx={{
//               color,
//               backgroundColor: bgColor,
//               px: 1,
//               py: 0.5,
//               borderRadius: 1,
//               fontSize: '0.75rem',
//               fontWeight: 'bold'
//             }}
//           >
//             {status}
//           </Typography>
//         );
//       }
//     },
//     {
//       field: 'productDescription',
//       headerName: t('Description'),
//       flex: 1.5,
//       renderCell: (params) => (
//         <Typography
//           variant="body2"
//           sx={{
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap'
//           }}
//         >
//           {params.row.productDescription}
//         </Typography>
//       )
//     }
//   ];

//   useEffect(() => {
//     fetchStockData();
//   }, [page, pageSize]);

//   return (
//     <Container maxWidth="xl">
//       <Card sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 2 }}>
//         <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
//           <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2, fontWeight: 'bold' }}>
//             {t('Stock Reports')}
//             <Breadcrumbs separator="›" aria-label="breadcrumb">
//               <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
//                 <HomeIcon sx={{ fontSize: 24 }} />
//               </Link>
//               <Typography color="text.primary">{t('Stock Reports')}</Typography>
//             </Breadcrumbs>
//           </Typography>
//         </Stack>
//       </Card>

//       {/* Summary Cards */}
//       <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
//         {[
//           { label: 'Total Products', count: rowCount, bg: '#667eea', end: '#764ba2' },
//           { label: 'In Stock', count: stockData.filter(i => i.totalQuantity > 10).length, bg: '#4caf50', end: '#45a049' },
//           { label: 'Low Stock', count: stockData.filter(i => i.totalQuantity > 0 && i.totalQuantity <= 10).length, bg: '#ff9800', end: '#f57c00' },
//           { label: 'Out of Stock', count: stockData.filter(i => i.totalQuantity === 0).length, bg: '#f44336', end: '#d32f2f' },
//         ].map((card, i) => (
//           <Card key={i} sx={{ p: 3, minWidth: 200, borderRadius: 2, background: `linear-gradient(135deg, ${card.bg} 0%, ${card.end} 100%)`, color: 'white' }}>
//             <Typography variant="h6" fontWeight="bold" sx={{ opacity: 0.9 }}>{t(card.label)}</Typography>
//             <Typography variant="h3" fontWeight="bold">{card.count}</Typography>
//           </Card>
//         ))}
//       </Box>

//       {/* Table */}
//       <Card sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
//         <TabContext value={tabValue}>
//           <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
//             <TabList onChange={handleTabChange}>
//               <Tab label={t('Stock Inventory')} value="1" />
//             </TabList>
//           </Box>

//           <TabPanel value="1" sx={{ p: 0 }}>
//             <DataGrid
//               rows={stockData}
//               columns={stockColumns}
//               rowCount={rowCount}
//               pagination
//               paginationMode="server"
//               page={page}
//               pageSize={pageSize}
//               onPageChange={(newPage) => setPage(newPage)}
//               onPageSizeChange={(newSize) => setPageSize(newSize)}
//               loading={loading}
//               getRowId={(row) => row._id}
//               slots={{ toolbar: GridToolbar }}
//               slotProps={{
//                 toolbar: {
//                   showQuickFilter: true,
//                   quickFilterProps: { debounceMs: 500 }
//                 }
//               }}
//               autoHeight
//               pageSizeOptions={[5, 10, 25, 50]}
//               sx={{
//                 '& .MuiDataGrid-root': { border: 'none' },
//                 '& .MuiDataGrid-cell': { borderBottom: '1px solid #f0f0f0', py: 1 },
//                 '& .MuiDataGrid-columnHeaders': {
//                   backgroundColor: '#f8f9fa',
//                   borderBottom: '2px solid #dee2e6',
//                   fontWeight: 'bold'
//                 },
//                 '& .MuiDataGrid-row:hover': {
//                   backgroundColor: '#f5f5f5'
//                 }
//               }}
//             />
//           </TabPanel>
//         </TabContext>
//       </Card>
//     </Container>
//   );
// };

// export default StockReport;



import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Typography,
  Stack,
  Box,
  Breadcrumbs,
} from "@mui/material";
import { Home as HomeIcon, Inventory2 as InventoryIcon } from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Tab from "@mui/material/Tab";
import { getApi } from "@/core/apis/api";
import { urls } from "@/core/Constant/urls";
import { tokenPayload } from "@/helper";

const StockReport = () => {
  const { t } = useTranslation();
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState("1");

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const payload = tokenPayload();

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  const fetchStockData = async () => {
    setLoading(true);
    try {
      const res = await getApi(
        `${urls.Inventory.allReports}?page=${page + 1}&limit=${pageSize}&companyId=${payload._id}`
      );
      const reports = res?.data?.data || [];
      setStockData(reports);
      setRowCount(res?.data?.total || 0);
    } catch (error) {
      console.error(t("Error fetching stock data:"), error);
      setStockData([]);
      setRowCount(0);
    } finally {
      setLoading(false);
    }
  };

  const stockColumns = [
    {
      field: "serialNo",
      headerName: "S.No.",
      width: 80,
      renderCell: (params) =>
        page * pageSize +
        stockData.findIndex((row) => row._id === params.row._id) +
        1,
    },
    {
      field: "productName",
      headerName: t("Product Name"),
      flex: 1.2,
      renderCell: (params) => (
        <Typography fontWeight="bold" color="primary">
          {params.row.productName}
        </Typography>
      ),
    },
    {
      field: "productModel",
      headerName: t("Product Model"),
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.row.productModel}
        </Typography>
      ),
    },
    {
      field: "totalQuantity",
      headerName: t("Available Quantity"),
      flex: 1,
      renderCell: (params) => (
        <Typography
          color={
            params.row.totalQuantity > 10
              ? "green"
              : params.row.totalQuantity > 0
              ? "orange"
              : "red"
          }
          fontWeight="bold"
          sx={{ fontSize: "1rem" }}
        >
          {params.row.totalQuantity}
        </Typography>
      ),
    },
    {
      field: "unitPerPrice",
      headerName: t("Unit Price"),
      flex: 1,
      renderCell: (params) => {
        const firstPurchase = params.row.purchases?.[0];
        const unitPrice = firstPurchase?.unitPerPrice || 0;
        return (
          <Typography fontWeight="bold" color="success.main">
            Rs: {unitPrice.toFixed(2)}
          </Typography>
        );
      },
    },
    {
      field: "status",
      headerName: t("Stock Status"),
      flex: 1,
      renderCell: (params) => {
        const quantity = params.row.totalQuantity;
        let status = "";
        let bgColor = "";

        if (quantity > 10) {
          status = t("In Stock");
          bgColor = "#4caf50";
        } else if (quantity > 0) {
          status = t("Low Stock");
          bgColor = "#ff9800";
        } else {
          status = t("Out of Stock");
          bgColor = "#f44336";
        }

        return (
          <Typography
            sx={{
              color: "white",
              backgroundColor: bgColor,
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: "0.75rem",
              fontWeight: "bold",
            }}
          >
            {status}
          </Typography>
        );
      },
    },
    {
      field: "productDescription",
      headerName: t("Description"),
      flex: 1.5,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {params.row.productDescription}
        </Typography>
      ),
    },
  ];

  useEffect(() => {
    fetchStockData();
  }, [page, pageSize]);

  return (
    <Container maxWidth="xl">
      <Card
        sx={{
          p: 0,
          mt: 0,
          borderRadius: 3,
          // boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          height: "auto",
        }}
      >
        {/* Header with icon + breadcrumbs */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mb: 1,
            pb: 1,
            borderBottom: "2px solid",
            borderColor: "divider",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 42,
                height: 42,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                backgroundColor: "rgba(25, 118, 210, 0.1)",
              }}
            >

               <Link to="/" style={{ color: "#1976d2", fontSize: "1.5rem", textDecoration: "none" }}>
              <HomeIcon sx={{ fontSize: 22 }} />
            </Link>
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                fontSize: "24px",
                letterSpacing: "0.5px",
              }}
            >
              {t("Stock Reports")}
            </Typography>
          </Stack>

         
        </Stack>

        {/* Summary Cards */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          {[
            {
              label: "Total Products",
              count: rowCount,
              bg: "#667eea",
              end: "#764ba2",
            },
            {
              label: "In Stock",
              count: stockData.filter((i) => i.totalQuantity > 10).length,
              bg: "#4caf50",
              end: "#45a049",
            },
            {
              label: "Low Stock",
              count: stockData.filter(
                (i) => i.totalQuantity > 0 && i.totalQuantity <= 10
              ).length,
              bg: "#ff9800",
              end: "#f57c00",
            },
            {
              label: "Out of Stock",
              count: stockData.filter((i) => i.totalQuantity === 0).length,
              bg: "#f44336",
              end: "#d32f2f",
            },
          ].map((card, i) => (
            <Card
              key={i}
              sx={{
                p: 3,
                minWidth: 200,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${card.bg} 0%, ${card.end} 100%)`,
                color: "white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ opacity: 0.9 }}
              >
                {t(card.label)}
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {card.count}
              </Typography>
            </Card>
          ))}
        </Box>

        {/* Tabs + DataGrid */}
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <TabList
              onChange={handleTabChange}
              sx={{
                "& .MuiTab-root": { fontWeight: 600, textTransform: "none" },
                "& .Mui-selected": { color: "primary.main" },
                "& .MuiTabs-indicator": {
                  backgroundColor: "primary.main",
                  height: "3px",
                  borderRadius: "3px 3px 0 0",
                },
              }}
            >
              <Tab label={t("Stock Inventory")} value="1" />
            </TabList>
          </Box>

          <TabPanel value="1" sx={{ p: 0 }}>
            <DataGrid
              rows={stockData}
              columns={stockColumns}
              rowCount={rowCount}
              pagination
              paginationMode="server"
              page={page}
              pageSize={pageSize}
              onPageChange={(newPage) => setPage(newPage)}
              onPageSizeChange={(newSize) => setPageSize(newSize)}
              loading={loading}
              getRowId={(row) => row._id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              autoHeight
              pageSizeOptions={[5, 10, 25, 50]}
              sx={{
                border: "none",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            />
          </TabPanel>
        </TabContext>
      </Card>
    </Container>
  );
};

export default StockReport;
