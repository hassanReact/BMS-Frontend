import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Grid, Autocomplete, TextField,Container, Typography, Button, Card } from "@mui/material";

import { getApi } from "@/core/apis/api";
import { urls } from "@/core/Constant/urls";
import { tokenPayload } from "@/helper";
import ServiceProvider from "@/views/ServiceProvider";

const modelOptions = [
  { label: "Vendor", value: "Vendor" },
  { label: "Property", value: "Property" },
  { label: "Staff", value: "Staff" },
  { label: "Transactional Account", value: "TransactionAccount" },
  { label: "Service Provider", value: "ServiceProvider" }
];

const payload = tokenPayload();

const getDisplayName = (item, type) => {
  switch (type) {
    case "Vendor":
      return item.vendorName;
    case "Property":
      return item.propertyname;
    case "Staff":
      return item.staffName;
    case "TransactionAccount":
      return item.accountName;
    case "ServiceProvider":
      return item.name;
    default:
      return "Unnamed";
  }
};

const LedgerFilterForm = () => {
  const navigate = useNavigate();
  const [modelType, setModelType] = useState("");
  const [modelId, setModelId] = useState("");
  const [selectedModelOption, setSelectedModelOption] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dropdownData, setDropdownData] = useState({
    Vendor: [],
    Property: [],
    Staff: [],
    TransactionAccount: [],
    ServiceProvider: []
  });

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [vendors, properties, staff, accounts, serviceProvider] = await Promise.all([
          getApi(urls.AccountsReceivable.Vendors, { companyId: payload._id }),
          getApi(urls.AccountsReceivable.Property, { companyId: payload._id }),
          getApi(urls.AccountsReceivable.Staff, { companyId: payload._id }),
          getApi(urls.AccountsReceivable.Accounts, { companyId: payload._id }),
          getApi(urls.AccountsReceivable.serviceProvider, { companyId: payload._id })
        ]);

        setDropdownData({
          Vendor: vendors.data || [],
          Property: properties.data || [],
          Staff: staff.data || [],
          TransactionAccount: accounts.data || [],
          ServiceProvider: serviceProvider.data || []
        });
      } catch (error) {
        console.error("Error fetching dropdown data", error);
      }
    };

    fetchDropdownData();
  }, []);

  const handleModelTypeChange = (event, newValue) => {
    setSelectedModelOption(newValue);
    setModelType(newValue?.value || "");
    setModelId("");
    setSelectedEntity(null);
  };

  const handleEntityChange = (event, newValue) => {
    setSelectedEntity(newValue);
    setModelId(newValue?._id || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!modelType || !modelId) return;

    // Create URL parameters for the ledger report page
    const params = new URLSearchParams({
      modelType,
      modelId,
      entityName: getDisplayName(selectedEntity, modelType),
    });

    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);

    // Navigate to ledger report page with parameters
    navigate(`/dashboard/ledger-report?${params.toString()}`);
  };

  // Prepare entity options with display names for search
  const getEntityOptions = () => {
    if (!modelType || !dropdownData[modelType]) return [];

    return dropdownData[modelType].map(item => ({
      ...item,
      displayName: getDisplayName(item, modelType)
    }));
  };






return (
  <Container maxWidth="xl"> {/* ✅ Consistent with Voucher form */}
    <Card
      sx={{
        p: 0,
        mt: 0,
        // boxShadow: 4,
        borderRadius: 3,
        background: "linear-gradient(135deg, #ffffff, #fafafa)",
        minHeight: "440px", 
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        width: "100%",
      }}
    >
     

<Box sx={{ mb: 3, textAlign: "center", borderBottom: "2px solid #eee", pb: 2 }}>
  <Typography
    variant="h4"
    sx={{
      fontWeight: "bold",
      color: "primary.main",
      fontSize: "24px",
    }}
    gutterBottom
  >
    General Ledger
  </Typography>
  <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
    Please fill the filters below to generate the ledger report
  </Typography>
</Box>


      {/* Form */}
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          {/* Model Type */}
          <Grid item xs={12} sm={6}>
            <Autocomplete
              fullWidth
              options={modelOptions}
              getOptionLabel={(option) => option.label}
              value={selectedModelOption}
              onChange={handleModelTypeChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Model Type"
                  placeholder="Search model type..."
                  variant="outlined"
                  InputLabelProps={{ sx: { fontSize: "16px" } }}
                />
              )}
            />
          </Grid>

          {/* Entity */}
          <Grid item xs={12} sm={6}>
            <Autocomplete
              fullWidth
              options={getEntityOptions()}
              getOptionLabel={(option) => option.displayName || ""}
              value={selectedEntity}
              onChange={handleEntityChange}
              disabled={!modelType}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={`Select ${modelType || "Entity"}`}
                  placeholder={`Search ${modelType?.toLowerCase() || "entity"}...`}
                  variant="outlined"
                  InputLabelProps={{ sx: { fontSize: "16px" } }}
                />
              )}
            />
          </Grid>

          {/* Date Fields */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="From Date"
              InputLabelProps={{ shrink: true, sx: { fontSize: "16px" } }}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="To Date"
              InputLabelProps={{ shrink: true, sx: { fontSize: "16px" } }}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </Grid>

          {/* Submit */}
          <Grid item xs={12}>
            <Box textAlign="right">
              <Button
                type="submit"
                variant="contained"
                disabled={!modelType || !modelId}
                sx={{
                  px: 4,
                  py: 1.2,
                  borderRadius: 2,
                  fontSize: "16px",
                  fontWeight: "bold",
                  textTransform: "none",
                  backgroundColor: "#1976d2",
                  boxShadow: 2,
                  "&:hover": {
                    backgroundColor: "#1565c0",
                    boxShadow: 4,
                  },
                }}
              >
                Generate Ledger
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Card>
  </Container>
);
};


export default LedgerFilterForm;