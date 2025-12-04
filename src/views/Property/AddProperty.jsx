import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Dialog,
  FormLabel,
  Grid,
  TextField,
  MenuItem,
  Select,
  DialogActions,
  DialogContent,
  // Box,
  // Chip,
  DialogTitle,
  Typography
} from '@mui/material';
// import InputAdornment from '@mui/material/InputAdornment';
import ClearIcon from '@mui/icons-material/Clear';
import Autocomplete from '@mui/material/Autocomplete';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import { tokenPayload } from '@/helper';
import { getApi, postApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import PropTypes from 'prop-types';

// Mock data - replace with your actual data
// const projectsName = [
//   { _id: '1', projectsName: 'Lakhani Residancy', category: '' }
// { _id: '2', projectsName: 'Mobile Banking App', category: 'Mobile Development' },
// { _id: '3', projectsName: 'CRM System', category: 'Enterprise Software' },
// { _id: '4', projectsName: 'Inventory Management', category: 'Business Application' },
// { _id: '5', projectsName: 'Social Media Dashboard', category: 'Analytics Platform' }
//];

// const projectBlocks = {
//   1: [
//     { _id: 'b1', blockName: 'A', projectId: '1', description: 'Login/Register functionality' }
// { _id: 'b2', blockName: 'Product Catalog System', projectId: '1', description: 'Product listing and search' },
// { _id: 'b3', blockName: 'Shopping Cart Management', projectId: '1', description: 'Add to cart and checkout' },
// { _id: 'b4', blockName: 'Payment Gateway Integration', projectId: '1', description: 'Payment processing' },
// { _id: 'b5', blockName: 'Order Management System', projectId: '1', description: 'Order tracking and management' }
//]
// 2: [
//   { _id: 'b6', blockName: 'Secure Login Module', projectId: '2', description: 'Multi-factor authentication' },
//   { _id: 'b7', blockName: 'Account Management Dashboard', projectId: '2', description: 'User account controls' },
//   { _id: 'b8', blockName: 'Transaction History Viewer', projectId: '2', description: 'Transaction records' },
//   { _id: 'b9', blockName: 'Fund Transfer System', projectId: '2', description: 'Money transfer functionality' },
//   { _id: 'b10', blockName: 'Bill Payment Module', projectId: '2', description: 'Utility bill payments' }
// ],
// 3: [
//   {
//     _id: 'b11',
//     blockName: 'Customer Database Management',
//     projectId: '3',
//     description: 'Customer information system'
//   },
//   { _id: 'b12', blockName: 'Sales Pipeline Tracker', projectId: '3', description: 'Sales process management' },
//   { _id: 'b13', blockName: 'Reporting Dashboard', projectId: '3', description: 'Analytics and reports' },
//   { _id: 'b14', blockName: 'Lead Management System', projectId: '3', description: 'Lead tracking and conversion' },
//   { _id: 'b15', blockName: 'Communication Hub', projectId: '3', description: 'Email and messaging integration' }
// ],
// 4: [
//   { _id: 'b16', blockName: 'Inventory Tracking System', projectId: '4', description: 'Stock level monitoring' },
//   {
//     _id: 'b17',
//     blockName: 'Supplier Management Portal',
//     projectId: '4',
//     description: 'Vendor relationship management'
//   },
//   { _id: 'b18', blockName: 'Purchase Order System', projectId: '4', description: 'Automated ordering' },
//   { _id: 'b19', blockName: 'Warehouse Management', projectId: '4', description: 'Storage and logistics' }
// ],
// 5: [
//   { _id: 'b20', blockName: 'Data Analytics Engine', projectId: '5', description: 'Real-time data processing' },
//   { _id: 'b21', blockName: 'Visualization Dashboard', projectId: '5', description: 'Charts and graphs' },
//   { _id: 'b22', blockName: 'Social Media Integration', projectId: '5', description: 'Platform connectivity' },
//   { _id: 'b23', blockName: 'Report Generator', projectId: '5', description: 'Automated reporting' }
// ]
//};

const AddProperty = ({ open, handleClose }) => {
  const { t } = useTranslation();
  const [ownerName, setOwnerData] = useState([]);
  const [tenantName, setTenantData] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [blockData, setBlockData] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  //const [availableBlocks, setAvailableBlocks] = useState([]);
  const payload = tokenPayload();


  // Mock data for owners and property types
  // const mockOwners = [
  //   { _id: "1", ownerName: "Kashif" },
  //   { _id: "2", ownerName: "Asif" }
  // { _id: "3", ownerName: "Michael Brown" },
  // { _id: "4", ownerName: "Emily Davis" },
  //]

  // const mockPropertyTypes = [
  //   { _id: '1', name: 'Apartment' },
  //   { _id: '2', name: 'House' },
  //   { _id: '3', name: 'Commercial' },
  //   { _id: '4', name: 'Office Space' }
  // ];

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length) {
      setAttachments((prev) => [...prev, ...files]);
    }
  };

  const handleFileRemove = (filename) => {
    setAttachments((prev) => prev.filter((file) => file.name !== filename));
  };

  const fetchOwnerData = async () => {
    const response = await getApi(urls.owner.ownerdata, { id: payload._id });
    setOwnerData(response?.data || []);
  };

  const fetchTenantData = async () => {
    const response = await getApi(urls.tenant.tenantdata, { id: payload._id });
    setTenantData(response?.data || []);
  };

  const fetchTypeData = async () => {
    const response = await getApi(urls.propertyTypes.getdata, { id: payload._id });
    setTypeData(response?.data || []);
  };

  const fetchProjectData = async () => {
    const response = await getApi(urls.project.getAll, { id: payload._id });
    setProjectData(response?.data || []);
  };

  const fetchBlockData = async () => {
    const response = await getApi(urls.block.getAll, { id: payload._id });
    setBlockData(response?.data || []);
  };

  const fetchCurrencyData = async () => {
    const response = await getApi(urls.company.getCompanyById, { id: payload._id });
    setCurrency(response?.data.currencyCode || []);
  };

  const getNameById = (data, id, key) => {
    if (!id || !data?.length) return '';
    const found = data.find((item) => item._id === id);
    return found ? found[key] : '';
  };


  const addProperty = async (values, resetForm) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('propertyname', values.propertyname);
    formData.append('typeId', values.typeId);
    formData.append('projectId', values.projectId);
    formData.append('blockId', values.blockId);
    formData.append('description', values.description || '');
    //formData.append('rent', values.rent);
    //formData.append('maintenance', values.maintenance);
    formData.append('area', values.area || null);
    {/*formData.append('address', values.address);
    formData.append('zipcode', values.zipcode);
    formData.append('maplink', values.maplink);*/}
    // formData.append('ownerId', values.ownerId || null);
    // formData.append('tenantId', values.tenantId || null);
    attachments.forEach((files) => {
      formData.append('files', files);
    });
    formData.append('companyId', payload._id);


    const projectName = getNameById(projectData, values.projectId, 'projectName');
    const blockName = getNameById(blockData, values.blockId, 'blockName');
    const propertyName = values.propertyname
    const ownername = getNameById(ownerName, values.ownerId, 'ownerName');

    let generatedAccountName = `${ownername}-${blockName}-${propertyName}-${projectName}`;

    values.accountName = generatedAccountName

    console.log("values", values)
    formData.append('accountName', values.accountName);

    try {
      const response = await postApi(urls.property.create, formData,
         { 'Content-Type': 'multipart/form-data' }
        );
      if (response.success) {
        toast.success(t('Successfully registered property!'));
        setAttachments([]);
        resetForm();
        handleClose();
      } else {
        toast.error(t('Failed to register property !'));
      }
      // setTimeout(() => {
      //   console.log('Property data:', values);
      //   console.log('Attachments:', attachments);
      //   alert('Property added successfully!');
      //   setAttachments([]);
      //   resetForm();
      // }, 2000);

    } catch {
      toast.error(t('Failed to register property!'));
    } finally {
      // =======
      //     // Simulate API call
      //     setTimeout(() => {
      //       console.log('Property data:', values);
      //       console.log('Attachments:', attachments);
      //       alert('Property added successfully!');
      //       setAttachments([]);
      //       resetForm();
      // %%%%%%%%% aba698341facb23e35afdb543c0f977cca58237e
      handleClose();
      resetForm()
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchOwnerData();
      fetchTenantData();
      fetchTypeData();
      fetchCurrencyData();
      fetchProjectData();
      fetchBlockData();
    }
  }, [open]);

  // Update available blocks when project changes
  // useEffect(() => {
  //   if (selectedProjectId) {
  //     setAvailableBlocks(projectBlocks[selectedProjectId] || []);
  //   } else {
  //     setAvailableBlocks([]);
  //   }
  // }, [selectedProjectId]);

  const validationSchema = yup.object({
    propertyname: yup.string().max(50, 'Units must be at most 50 characters').required('Units is required'),
    typeId: yup.string().required('Type is required'),
    projectId: yup.string().required('Project Name is required'),
    blockId: yup.string().required('Block Name is required'),
    // description: yup.string().max(200, 'Description cannot exceed 200 characters'),
    // rent: yup
    //   .number()
    // <<<<<<< HEAD
    //       .typeError(t('Rent must be a number'))
    //       .min(1, t('must be positive'))
    //       .max(9999999999, t('Rent cannot exceed 10 digits'))
    //       .test('is-positive', t('Rent must be greater than zero'), (value) => value > 0)
    //       .required(t('Rent is required')),
    //       /*maintenance: yup
    //       .number()
    //       .typeError(t('maintenance must be a number'))
    //       .min(1, t('must be positive'))
    //       .max(9999999999, t('maintenance must be greater than zero'), (value) => value > 0)
    //       .required(t('maintenance is required')),*/
    //     area: yup
    //       .number()
    //       .typeError(t('Area must be a number'))
    //       .min(1, t('must be positive'))
    //       .max(9999999999, t('Area cannot exceed 10 digits'))
    //       .test('is-positive', t('Area must be greater than zero'), (value) => value > 0)
    //       .required(t('Area is required')),
    //     //address: yup
    //       //.string()
    //       //.max(100, t('Address cannot exceed 100 characters')),
    //       //.required(t('Address is required')),
    //       //zipcode: 
    //       //yup.string()
    //       //.matches(/^[0-9]{3,8}$/, t('Zipcode must be between 3 and 8 digits')),
    //       //.required(t('Zip Code is required')),
    //         //maplink: yup.string().url(t('Must be a valid URL')),
    //         //.required(t('Google Map Link is required')),
    //     //ownerId: yup.string().required(t('Owner Name is required')),
    //     //tenantId: yup.string().required(t('Tenant Name is required')),
    // =======
    // .typeError('Rent must be a number')
    // .min(1, 'must be positive')
    // .max(9999999999, 'Rent cannot exceed 10 digits')
    // .test('is-positive', 'Rent must be greater than zero', (value) => value > 0)
    // .required('Rent is required'),
    area: yup
      .number()
      .typeError('Area must be a number')
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .min(1, 'must be positive')
      .max(9999999999, 'Area cannot exceed 10 digits')
      .test('is-positive', 'Area must be greater than zero', (value) => value == null || value >= 0),
    // address: yup.string().max(100, 'Address cannot exceed 100 characters').required('Address is required'),
    // zipcode: yup
    //   .string()
    //   .matches(/^[0-9]{3,8}$/, 'Zipcode must be between 3 and 8 digits')
    //   .required('Zip Code is required'),
    // maplink: yup.string().url('Must be a valid URL').required('Google Map Link is required'),
    // ownerId: yup.string(),
    // tenantId: yup.string()
    // %%%%%%%%% aba698341facb23e35afdb543c0f977cca58237e
  });

  const formik = useFormik({
    initialValues: {
      propertyname: '',
      typeId: '',
      projectId: '',
      blockId: '',
      description: '',
      //rent: '',
      // <<<<<<< HEAD
      //       //maintenance:'',
      //       area:'',
      //       //address: '',
      //       //zipcode: '',
      //       //maplink: '',
      //       //ownerId: '',
      //       //tenantId: '',
      //       files: [],
      // =======
      area: '',
      //address: '',
      //zipcode: '',
      //maplink: '',
      // ownerId: '',
      // tenantId: '',
      files: []
      // %%%%%%%%% aba698341facb23e35afdb543c0f977cca58237e
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {

      const finalValues = {
        ...values,
        description: !values.description || values.description.trim() === ""
        ? "No description available"
        : values.description
      }

      addProperty({ ...finalValues, files: attachments }, resetForm);
    }
  });

  // const handleProjectChange = (event, value) => {
  //   const projectId = value?.value || '';
  //   setSelectedProjectId(projectId);
  //   formik.setFieldValue('projectId', projectId);
  //   // Reset block selection when project changes
  //   formik.setFieldValue('blockId', '');
  // };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Add Property</Typography>
        <ClearIcon onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormLabel>Property Name</FormLabel>
              <TextField
                id="propertyname"
                name="propertyname"
                size="small"
                fullWidth
                value={formik.values.propertyname}
                onChange={formik.handleChange}
                error={formik.touched.propertyname && Boolean(formik.errors.propertyname)}
                helperText={formik.touched.propertyname && formik.errors.propertyname}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>Type</FormLabel>
              <Select
                id="typeId"
                name="typeId"
                size="small"
                fullWidth
                value={formik.values.typeId}
                onChange={formik.handleChange}
                error={formik.touched.typeId && Boolean(formik.errors.typeId)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Type
                </MenuItem>
                {typeData.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.typeId && formik.errors.typeId && (
                <Typography variant="body2" color="error">
                  {formik.errors.typeId}
                </Typography>
              )}
            </Grid>

            {/* <<<<<<< HEAD */}
            {/* {<Grid item xs={12} sm={6}> */}
            {/* <FormLabel>{t('Owner Name')}</FormLabel> */}
            {/* ======= */}
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Project')}</FormLabel>
              <Autocomplete
                disablePortal
                size="small"
                options={projectData.map((project) => ({
                  label: project.projectName,
                  value: project._id,
                }))}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={formik.touched.projectId && Boolean(formik.errors.projectId)}
                    helperText={formik.touched.projectId && formik.errors.projectId}
                  />
                )}
                onChange={(event, value) => {
                  const projectId = value?.value || '';
                  setSelectedProjectId(projectId);
                  formik.setFieldValue('projectId', projectId);
                  formik.setFieldValue('blockId', '');
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>Select Block</FormLabel>
              <FormLabel>{t('Block')}</FormLabel>
              <Autocomplete
                disablePortal
                size="small"
                options={blockData
                  .filter((block) => block.projectId._id === selectedProjectId)
                  .map((block) => ({
                    label: block.blockName,
                    value: block._id,
                  }))}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={formik.touched.blockId && Boolean(formik.errors.blockId)}
                    helperText={formik.touched.blockId && formik.errors.blockId}
                  />
                )}
                onChange={(event, value) => {
                  formik.setFieldValue('blockId', value?.value || '');
                }}
              />
            </Grid>

            {/* <Grid item xs={12} sm={6}>
              <FormLabel>Block Name</FormLabel>
              <Autocomplete
                disablePortal
                size="small"
                disabled={!selectedProjectId}
                options={availableBlocks.map((block) => ({
                  label: block.blockName,
                  value: block._id
                }))}
                getOptionLabel={(option) => option.label || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    placeholder={selectedProjectId ? 'Select a block' : 'Select a project first'}
                    error={formik.touched.blockId && Boolean(formik.errors.blockId)}
                    helperText={formik.touched.blockId && formik.errors.blockId}
                  />
                )}
                onChange={(event, value) => formik.setFieldValue('blockId', value?.value || '')}
                value={
                  availableBlocks.find((b) => b._id === formik.values.blockId)
                    ? {
                        label: availableBlocks.find((b) => b._id === formik.values.blockId).blockName,
                        value: formik.values.blockId
                      }
                    : null
                }
              />
            </Grid> */}

            {/* <Grid item xs={12} sm={6}>
              <FormLabel>Owner Name</FormLabel>
              // %%%%%%%%% aba698341facb23e35afdb543c0f977cca58237e
              <Autocomplete
                size="small"
                disablePortal
                options={ownerName.map((owner) => ({
                  label: owner.ownerName,
                  value: owner._id,
                }))}
                getOptionLabel={(option) => option.label || ''}
                value={
                  ownerName
                    .map((owner) => ({
                      label: owner.ownerName,
                      value: owner._id,
                    }))
                    .find((option) => option.value === formik.values.ownerId) || null
                }
                isOptionEqualToValue={(option, value) => option.value === value.value}
                onChange={(event, value) =>
                  formik.setFieldValue('ownerId', value?.value || '')
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={formik.touched.ownerId && Boolean(formik.errors.ownerId)}
                    helperText={formik.touched.ownerId && formik.errors.ownerId}
                  />
                )}
              /> */}

              {/* <Autocomplete
                disablePortal
                size="small"
                options={ownerName.map((owner) => ({
                  label: owner.ownerName,
                  value: owner._id
                }))}
                getOptionLabel={(option) => option.label || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={formik.touched.ownerId && Boolean(formik.errors.ownerId)}
                    helperText={formik.touched.ownerId && formik.errors.ownerId}
                  />
                )}
                onChange={(event, value) => formik.setFieldValue('ownerId', value?.value || '')}
                // value={
                //   ownerName.find((o) => o._id === formik.values.ownerId)
                //     ? {
                //         label: ownerName.find((o) => o._id === formik.values.ownerId).ownerName,
                //         value: formik.values.ownerId
                //       }
                //     : null
                // } 
              /> */}
            {/* </Grid> */}

            {/* <Grid item xs={12} sm={6}>
              <FormLabel>{t('Resident Name')}</FormLabel> */}
              {/* <Autocomplete
                disablePortal
                size="small"
                options={tenantName.map((tenant) => ({
                  label: tenant.tenantName,
                  value: tenant._id,
                  //value: tenant.companyId,
                }))}
                getOptionLabel={(option) => option.label || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={formik.touched.tenantId && Boolean(formik.errors.tenantId)}
                    helperText={formik.touched.tenantId && formik.errors.tenantId}
                  />
                )}
                onChange={(event, value) => formik.setFieldValue('tenantId', value?.value || '')}
              /> */}
              {/* <Autocomplete
                disablePortal
                size="small"
                options={tenantName.map((tenant) => ({
                  label: tenant.tenantName,
                  value: tenant._id,
                }))}
                getOptionLabel={(option) => option.label || ''}
                value={
                  tenantName
                    .map((tenant) => ({
                      label: tenant.tenantName,
                      value: tenant._id,
                    }))
                    .find((option) => option.value === formik.values.tenantId) || null
                }
                isOptionEqualToValue={(option, value) => option.value === value.value}
                onChange={(event, value) => formik.setFieldValue('tenantId', value?.value || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={formik.touched.tenantId && Boolean(formik.errors.tenantId)}
                    helperText={formik.touched.tenantId && formik.errors.tenantId}
                  />
                )}
              />

            </Grid> */}

            {/* <Grid item xs={12} sm={6}> */}
            {/* <<<<<<< HEAD */}
            {/*<FormLabel>{t('Rent per Month')}</FormLabel>*/}
            {/* <FormLabel>{t('Maintenance per Month')}</FormLabel>

  <TextField
    id="rent"
    name="rent"
    type="number"
    size="small"
    fullWidth
    value={formik.values.rent}
    onChange={(e) => {
      const value = e.target.value;
      // Only allow numbers and prevent adding if more than 8 digits
      if (value.length <= 10 && /^[0-9]*$/.test(value)) {
        formik.handleChange(e);
      }
    }}
    error={formik.touched.rent && Boolean(formik.errors.rent)}
    helperText={formik.touched.rent && formik.errors.rent}
    InputProps={{
      endAdornment: <InputAdornment position="end">{currency}</InputAdornment>,
    }}
  />
</Grid> */}
            {/*
<Grid item xs={12} sm={6}>
  <FormLabel>{t('Maintenance per Month')}</FormLabel>
  <TextField
    id="maintenance"
    name="maintenance"
    type="number"
    size="small"
    fullWidth
    value={formik.values.maintenance}
    onChange={(e) => {
      const value = e.target.value;
      // Only allow numbers and prevent adding if more than 8 digits
      if (value.length <= 10 && /^[0-9]*$/.test(value)) {
        formik.handleChange(e);
      }
    }}
    error={formik.touched.maintenance && Boolean(formik.errors.maintenance)}
    helperText={formik.touched.maintenance && formik.errors.maintenance}
    InputProps={{
      endAdornment: <InputAdornment position="end">{currency}</InputAdornment>,
    }}
  />
</Grid>*/}



            {/* =======
              <FormLabel>Rent per Month</FormLabel>
              <TextField
                id="rent"
                name="rent"
                type="number"
                size="small"
                fullWidth
                value={formik.values.rent}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 10 && /^[0-9]*$/.test(value)) {
                    formik.handleChange(e);
                  }
                }}
                error={formik.touched.rent && Boolean(formik.errors.rent)}
                helperText={formik.touched.rent && formik.errors.rent}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{currency}</InputAdornment>
                }}
              />
            </Grid>
%%%%%%%%% aba698341facb23e35afdb543c0f977cca58237e */}

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Area (sq. feet)')}</FormLabel>
              <FormLabel>Area (sq. feet)</FormLabel>
              <TextField
                id="area"
                name="area"
                type="number"
                size="small"
                fullWidth
                value={formik.values.area}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 10 && /^[0-9]*$/.test(value)) {
                    formik.handleChange(e);
                  }
                }}
                error={formik.touched.area && Boolean(formik.errors.area)}
                helperText={formik.touched.area && formik.errors.area}
              />
            </Grid>

            {/* <Grid item xs={12}>
              <Box mb={1}>
                <FormLabel>Property Images</FormLabel>
              </Box>
              <Button variant="contained" component="label">
                Upload Images
                <input type="file" multiple hidden onChange={handleFileChange} />
              </Button>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  flexWrap: "wrap",
                  maxHeight: "100px",
                  overflowY: "auto",
                  marginTop: 1,
                }}
              >
                {attachments.map((file, index) => (
                  <Chip
                    key={index}
                    sx={{ background: "green", color: "white" }}
                    label={file.name}
                    onDelete={() => handleFileRemove(file.name)}
                    deleteIcon={<CloseIcon />}
                  />
                ))}
              </Box>
            </Grid> */}

            <Grid item xs={12}>
              <FormLabel>Description</FormLabel>
              <TextField
                id="description"
                name="description"
                size="small"
                fullWidth
                multiline
                rows={4}
                placeholder='No description available'
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>
            {/*
            <Grid item xs={12}>
              <FormLabel>Address</FormLabel>
              <TextField
                id="address"
                name="address"
                size="small"
                fullWidth
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>Zip Code</FormLabel>
              <TextField
                id="zipcode"
                name="zipcode"
                type="number"
                size="small"
                fullWidth
                value={formik.values.zipcode}
                onChange={formik.handleChange}
                error={formik.touched.zipcode && Boolean(formik.errors.zipcode)}
                helperText={formik.touched.zipcode && formik.errors.zipcode}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>Google Map Link</FormLabel>
              <TextField
                id="maplink"
                name="maplink"
                size="small"
                fullWidth
                value={formik.values.maplink}
                onChange={formik.handleChange}
                error={formik.touched.maplink && Boolean(formik.errors.maplink)}
                helperText={formik.touched.maplink && formik.errors.maplink}
              />
            </Grid>
*/}
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={formik.handleSubmit} variant="contained" color="primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
        <Button
          onClick={() => {
            formik.resetForm();
            // setSelectedProjectId('');
            // setAvailableBlocks([]);
            // setAttachments([]);
            handleClose();
          }}
          variant="outlined"
          color="error"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddProperty.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default AddProperty;
