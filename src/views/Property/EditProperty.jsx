
import React, { useEffect, useState } from 'react';
import {
  MenuItem,
  Select,
  Button,
  Dialog,
  Box,
  Chip,
  FormControl,
  FormLabel,
  Grid,
  TextField,
  Typography,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import ClearIcon from '@mui/icons-material/Clear';
import { updateApi, getApi } from '@/core/apis/api'; // Ensure getApi is imported
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import CloseIcon from '@mui/icons-material/Close';
import Autocomplete from '@mui/material/Autocomplete';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { urls } from '@/core/Constant/urls';
import { tokenPayload } from '@/helper';
import { useCallback } from 'react';
import { debounce, throttle } from 'lodash';
const EditProperty = ({ open, handleClose, data }) => {
  const { t } = useTranslation();
  const [ownerData, setOwnerData] = useState([]);
  const [tenantData, setTenantData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [blockData, setBlockData] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState();
  const payload = tokenPayload();

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

  useEffect(() => {
    if (data && data.files) {
      setExistingImages(data.files);
    }
  }, [data]);

  const fetchOwnerData = async () => {
    const response = await getApi(urls.owner.ownerdata, { id: payload._id });
    setOwnerData(response.data);
  };

  {/*const fetchTenantData = async () => {
      
          const response = await getApi(urls.tenant.tenantdata, { id: payload.companyId });
            setTenantData(response.data);
        
    };*/}

    const fetchTenantData = async () => {
        const response = await getApi(urls.tenant.tenantdata, { id: payload._id });
        setTenantData(response?.data || []);
      };

  const fetchTypeData = async () => {
    const response = await getApi(urls.propertyTypes.getdata, { id: payload._id });
    setTypeData(response.data);
  };

  const fetchCurrencyData = async () => {
    const response = await getApi(urls.company.getCompanyById, { id: payload._id });
    setCurrency(response?.data.currencyCode || []);
  };

  const fetchProjectData = async () => {
      const response = await getApi(urls.project.getAll, { id: payload._id });
      console.log("Project Data", response?.data)
      setProjectData(response?.data || []);
    };
  
    const fetchBlockData = async () => {
      const response = await getApi(urls.block.getAll, { id: payload._id });
      console.log("Block Data", response?.data)
      setBlockData(response?.data || []);
    };
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const handleFileRemove = (filename) => {
    setNewImages((prev) => prev.filter((file) => file.name !== filename));
  };

  const handleExistingImageRemove = (url) => {
    setExistingImages((prev) => prev.filter((image) => image !== url));
  };

  const getNameById = (data, id, key) => {
    if (!id || !data?.length) return '';
    const found = data.find((item) => item._id === id);
    return found ? found[key] : '';
  };

  const editProperty = async (values, resetForm) => {
    setLoading(true);
    const formData = new FormData();

    // Append form values
    formData.append('propertyname', values?.propertyname);
    formData.append('typeId', values?.typeId);
    formData.append('description', values?.description);
    formData.append('area', values?.area);
    //formData.append('rent', values?.rent);
    //formData.append('maintenance', values?.maintenance);
    // formData.append('address', values?.address);
    // formData.append('zipcode', values?.zipcode);
    // formData.append('maplink', values?.maplink);
    formData.append('ownerId', values?.ownerId);
    formData.append('tenantId', values?.tenantId);
    formData.append('projectId', values?.projectId);
    formData.append('blockId', values?.blockId);


    newImages.forEach((file) => {
      formData.append('files', file);
    });

    formData.append('existingImages', JSON.stringify(existingImages));

    formData.append('companyId', payload._id);

    const projectName = getNameById(projectData, values.projectId, 'projectName');
    const blockName = getNameById(blockData, values.blockId, 'blockName');
    const propertyName = values.propertyname
    const ownername = getNameById(ownerData, values.ownerId, 'ownerName');

    let generatedAccountName = `${ownername}-${blockName}-${propertyName}-${projectName}`;

    values.accountName = generatedAccountName

    console.log("values", values)

    formData.append('accountName', values?.accountName);

    try {
      const response = await updateApi(
        urls.property.editdata,
        formData,
        { id: data._id },
        { 'Content-Type': 'multipart/form-data' }
      );

      if (response.success) {
        toast.success(t('Property updated successfully!'));
        resetForm();
        handleClose();
      }
    } catch (err) {
      toast.error(t('Something went wrong!'));
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = yup.object({
     propertyname: yup.string()
     .max(50, t('Property Name must be at most 50 characters'))
     .required(t('Property Name is required')),  
      typeId: yup.string().required(t('Type is required')),
      projectId: yup.string().required('Project Name is required'),
      blockId: yup.string().required('Block Name is required'),
    description: yup.string().max(200, t('Description cannot exceed 200 characters')).required(t('Description is required')),
    //rent: yup.number().min(100, t('Rent must be at least 3 digits')).max(9999999999, t('Rent cannot exceed 10 digits')).required(t('Rent is required')),
    // rent: yup.number().min(100, t('Maintenance must be at least 3 digits')).max(9999999999, t('Maintenace cannot exceed 10 digits')).required(t('Maintenance is required')),
    //maintenance: yup.number().min(100, t('Maintenance must be at least 3 digits')).max(9999999999, t('Maintenance cannot exceed 10 digits')).required(t('Maintenance is required')),
    /*address: yup.string().max(100, t('Address cannot exceed 100 characters')).required(t('Address is required')),
    zipcode: yup.string()
    .matches(/^[0-9]{3,8}$/, t('Zipcode must be between 3 and 8 digits'))
    .required(t('Zip Code is required')),
    maplink: yup.string().url(t('Must be a valid URL')).required(t('Google Map Link is required')),*/
    tenantId: yup.string().required(t('Resident Name is required')),
    ownerId: yup.string().required('Owner Name is required'),
    area: yup
          .number()
          .typeError('Area must be a number')
          .min(1, 'must be positive')
          .max(9999999999, 'Area cannot exceed 10 digits')
          .test('is-positive', 'Area must be greater than zero', (value) => value > 0)
          .required('Area is required'),
  });

  const formik = useFormik({
    initialValues: {
      propertyname: data?.propertyname || '',
      typeId: data?.typeId?._id || '',
      projectId: data?.projectId?._id || '',
      blockId: data?.blockId?._id || '',
      description: data?.description || '',
      //rent: data?.rent || '',
      //maintenance: data?.maintenance || '',
      area: data?.area || '',
      /*address: data?.address || '',
      zipcode: data?.zipcode || '',
      maplink: data?.maplink || '',*/
      ownerId: data?.ownerId || '',
      tenantId: data?.tenantId || '',
      files: data?.files || [],
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values, { resetForm }) => editProperty(values, resetForm),
  });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">{t('Edit Property')}</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Property Name')}</FormLabel>
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
              <FormLabel>{t('Type')}</FormLabel>
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
                <MenuItem value="" disabled>{t('Select Type')}</MenuItem>
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
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Project')}</FormLabel>
              <Select
                id="projectId"
                name="projectId"
                size="small"
                fullWidth
                value={formik.values.projectId}
                onChange={formik.handleChange}
                error={formik.touched.projectId && Boolean(formik.errors.projectId)}
                displayEmpty
              >
                <MenuItem value="" disabled>{t('Select Project')}</MenuItem>
                {projectData.map((project) => (
                  <MenuItem key={project._id} value={project._id}>
                    {project.projectName}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.projectId && formik.errors.projectId && (
                <Typography variant="body2" color="error">
                  {formik.errors.projectId}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Block')}</FormLabel>
              <Select
                id="blockId"
                name="blockId"
                size="small"
                fullWidth
                value={formik.values.blockId}
                onChange={formik.handleChange}
                error={formik.touched.blockId && Boolean(formik.errors.blockId)}
                displayEmpty
              >
                <MenuItem value="" disabled>{t('Select Block')}</MenuItem>
                {blockData.map((block) => (
                  <MenuItem key={block._id} value={block._id}>
                    {block.blockName}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.blockId && formik.errors.blockId && (
                <Typography variant="body2" color="error">
                  {formik.errors.blockId}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Owner Name')}</FormLabel>
              <Select
                id="ownerId"
                name="ownerId"
                size="small"
                fullWidth
                value={formik.values.ownerId}
                onChange={formik.handleChange}
                error={formik.touched.ownerId && Boolean(formik.errors.ownerId)}
                displayEmpty
              >
                <MenuItem value="" disabled>{t('Select Owner')}</MenuItem>
                {ownerData.map((owner) => (
                  <MenuItem key={owner._id} value={owner._id}>
                    {owner.ownerName}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.ownerId && formik.errors.ownerId && (
                <Typography variant="body2" color="error">
                  {formik.errors.ownerId}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Resident Name')}</FormLabel>
              <Select
                id="tenantId"
                name="tenantId"
                size="small"
                fullWidth
                value={formik.values.tenantId}
                onChange={formik.handleChange}
                error={formik.touched.tenantId && Boolean(formik.errors.tenantId)}
                displayEmpty
              >
                <MenuItem value="" disabled>{t('Select Resident')}</MenuItem>
                {tenantData.map((tenant) => (
                  <MenuItem key={tenant.companyId} value={tenant.companyId}>
                    {tenant.tenantName}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.tenantId && formik.errors.tenantId && (
                <Typography variant="body2" color="error">
                  {formik.errors.ownerId}
                </Typography>
              )}
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <FormLabel>{t('Maintenance per Month')}</FormLabel>
              <TextField
                id="rent"
                name="rent"
                type="number"
                size="small"
                fullWidth
                value={formik.values.rent}
                onChange={formik.handleChange}
                error={formik.touched.rent && Boolean(formik.errors.rent)}
                helperText={formik.touched.rent && formik.errors.rent}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{currency}</InputAdornment>,
                }}
              />
            </Grid> */}
            {/*<Grid item xs={12} sm={6}>
              <FormLabel>{t('Maintenace per Month')}</FormLabel>
              <TextField
                id="maintenance"
                name="maintenance"
                type="number"
                size="small"
                fullWidth
                value={formik.values.maintenance}
                onChange={formik.handleChange}
                error={formik.touched.maintenance && Boolean(formik.errors.maintenance)}
                helperText={formik.touched.maintenance && formik.errors.maintenance}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{currency}</InputAdornment>,
                }}
              />
            </Grid>*/}

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Area per square feet')}</FormLabel>
              <TextField
                id="area"
                name="area"
                type="number"
                size="small"
                fullWidth
                value={formik.values.area}
                onChange={formik.handleChange}
                error={formik.touched.area && Boolean(formik.errors.area)}
                helperText={formik.touched.area && formik.errors.area}
              />
            </Grid>

            {/* <Grid item xs={12}>
              <Box mb={1}>
                <FormLabel>{t('Property Images')}</FormLabel>
              </Box>
              <Button variant="contained" component="label">
                {t('Upload Images')}
                <input type="file" multiple hidden onChange={handleFileChange} />
              </Button>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 1,
                  flexWrap: 'wrap',
                  maxHeight: '100px',
                  overflowY: 'auto',
                  marginTop: 1,
                }}
              > */}
                {/* Display existing images */}
                {/* {existingImages.map((url, index) => (
                  <Chip
                    key={index}
                    sx={{ background: 'blue', color: 'white' }}
                    label={url}
                    onDelete={() => handleExistingImageRemove(url)}
                    deleteIcon={<CloseIcon />}
                  />
                ))} */}
                {/* Display new images */}
                {/* {newImages.map((file, index) => (
                  <Chip
                    key={index}
                    sx={{ background: 'green', color: 'white' }}
                    label={file.name}
                    onDelete={() => handleFileRemove(file.name)}
                    deleteIcon={<CloseIcon />}
                  />
                ))}
              </Box>
            </Grid> */}

            <Grid item xs={12}>
              <FormLabel>{t('Description')}</FormLabel>
              <TextField
                id="description"
                name="description"
                size="small"
                fullWidth
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>

            {/*<Grid item xs={12}>
              <FormLabel>{t('Address')}</FormLabel>
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
              <FormLabel>{t('Zip Code')}</FormLabel>
              <TextField
                id="zipcode"
                name="zipcode"
                type='number'
                size="small"
                fullWidth
                value={formik.values.zipcode}
                onChange={formik.handleChange}
                error={formik.touched.zipcode && Boolean(formik.errors.zipcode)}
                helperText={formik.touched.zipcode && formik.errors.zipcode}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Google Map Link')}</FormLabel>
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
            </Grid>*/}
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={formik.handleSubmit}
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
        >
          {loading ? t('Saving...') : t('Save')}
        </Button>
        <Button
          onClick={() => {
            formik.resetForm();
            handleClose();
          }}
          variant="outlined"
          color="error"
        >
          {t('Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditProperty.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default EditProperty;