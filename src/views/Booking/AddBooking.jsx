/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import Autocomplete from '@mui/material/Autocomplete';
import { postApi, getApi } from '@/core/apis/api';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { FormLabel } from '@mui/material';
import { toast } from 'react-toastify';
import { urls } from '@/core/Constant/urls';
import { useTranslation } from 'react-i18next';
import { tokenPayload } from '@/helper';
import { data } from 'currency-codes';

const AddBooking = (props) => {
  const { t } = useTranslation();
  const { open, handleClose } = props;
  const [tenantData, setTenantData] = useState([]);
  const [ownerData, setOwnerData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [blockData, setBlockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedBlockId, setSelectedBlockId] = useState('');


  const validationSchema = yup.object({
    tenantId: yup.string().required(t('Tenant is required')),
    ownerId: yup.string().required(t('Owner is required')),
    // tenantId: yup.string().required(t('Resident is required')),
    propertyId: yup.string().required(t('Property is required')),
    projectId: yup.string().required(t('Project is required')),
    blockId: yup.string().required(t('Block is required')),

    startingDate: yup.date().required(t('Starting Date is required')),

  });

  const initialValues = {
    tenantId: '',
    ownerId: '',
    propertyId: '',
    startingDate: '',
    endingDate: '',
    rentAmount: '',
    advanceAmount: '',
    projectId: '',
    blockId: '',

  };

  const payload = tokenPayload();

  const fetchTenantData = async () => {
    setLoading(true);
    try {
      const response = await getApi(urls.tenant.tenantdata, { id: payload.companyId });
      setTenantData(response.data);
    } catch (err) {
      toast.error(t('Failed to fetch tenant data!'));
      // toast.error(t('Failed to fetch resident data!'));
      setTenantData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOwnerData = async () => {
    setLoading(true);
    try {
      const response = await getApi(urls.owner.ownerdata, { id: payload.companyId });
      setOwnerData(response.data);
    } catch (err) {
      toast.error(t('Failed to fetch tenant data!'));
      // toast.error(t('Failed to fetch resident data!'));
      setOwnerData([]);
    } finally {
      setLoading(false);
    }
  };


  const fetchPropertyData = async () => {
    setLoading(true);
    try {
      const response = await getApi(urls.property.propertydata, { id: payload.companyId });
      console.log("propertydata", response.data)
      setPropertyData(response?.data || []);
    } catch (err) {
      console.error('Error fetching property data:', err);
      toast.error(t('Failed to fetch property data!'));
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectData = async () => {
    setLoading(true);
    try {
      const response = await getApi(urls.project.getAll, { id: payload._id });
      console.log("projectdata", response.data)
      setProjectData(response?.data || []);
    } catch (err) {
      console.error('Error fetching project data:', err);
      toast.error(t('Failed to fetch project data!'));
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockData = async () => {
    setLoading(true);
    try {
      const response = await getApi(urls.block.getAll, { id: payload._id });
      console.log("blockdata", response.data)
      setBlockData(response?.data || []);
    } catch (err) {
      console.error('Error fetching block data:', err);
      toast.error(t('Failed to fetch block data!'));
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (open) {
      fetchTenantData();
      fetchOwnerData();
      fetchPropertyData();
      fetchProjectData();
      fetchBlockData();
    }
  }, [open]);

  const getNameById = (data, id, key) => {
    if (!id || !data?.length) return '';
    const found = data.find((item) => item._id === id);
    return found ? found[key] : '';
  };


  const addBooking = async (values, resetForm) => {
    setLoading(true);

    //let generatedAccountName = `${values.tenantName}-${values.blockId}-${values.propertyId}-${values.projectId}`
    const projectName = getNameById(projectData, values.projectId, 'projectName');
    const blockName = getNameById(blockData, values.blockId, 'blockName');
    const propertyName = getNameById(propertyData, values.propertyId, 'propertyname');
    const tenantName = getNameById(tenantData, values.tenantId, 'tenantName');
    const ownerName = getNameById(ownerData, values.ownerId, 'ownerName');

    let generatedAccountName = `${tenantName}-${ownerName}-${blockName}-${propertyName}-${projectName}`;


    values.companyId = payload.companyId;
    values.createdBy = payload._id;
    values.accountName = generatedAccountName

    console.log("values", values)

    try {
      const response = await postApi(urls.booking.create, values);
      if (response.success) {
        toast.success(t('Booking successfully created'));
        resetForm();
        handleClose();
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error(t('Something went wrong!'));
    } finally {
      handleClose();
      resetForm()
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      addBooking(values, resetForm);
    },
  });

  return (
    <Dialog open={open} aria-labelledby="dialog-title" aria-describedby="dialog-description">
      <DialogTitle
        id="dialog-title"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">{t('Create Booking')}</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {/* Tenant Name */}
            {/*<Grid item xs={12} sm={6}>
              <FormLabel>{t('Tenant Name')}</FormLabel>
              <Autocomplete
                disablePortal
                size="small"
                options={(tenantData || []).map((tenant) => ({
                  label: tenant.tenantName,
                  value: tenant._id,
                }))}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={formik.touched.tenantId && Boolean(formik.errors.tenantId)}
                    helperText={formik.touched.tenantId && formik.errors.tenantId}
                  />
                )}
                onChange={(event, value) => {
                  formik.setFieldValue('tenantId', value?.value || '');
                }}
              />

            </Grid>*/}

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Tenant Name')}</FormLabel>
              <Autocomplete
                disablePortal
                size="small"
                options={(tenantData || []).map((tenant) => ({
                  label: tenant.tenantName,
                  value: tenant._id,
                }))}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={formik.touched.tenantId && Boolean(formik.errors.tenantId)}
                    helperText={formik.touched.tenantId && formik.errors.tenantId}
                  />
                )}
                onChange={(event, value) => {
                  formik.setFieldValue('tenantId', value?.value || '');
                }}
              />

            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Owner Name')}</FormLabel>
              <Autocomplete
                disablePortal
                size="small"
                options={(ownerData || []).map((owner) => ({
                  label: owner.ownerName,
                  value: owner._id,
                }))}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={formik.touched.ownerId && Boolean(formik.errors.ownerId)}
                    helperText={formik.touched.ownerId && formik.errors.ownerId}
                  />
                )}
                onChange={(event, value) => {
                  formik.setFieldValue('ownerId', value?.value || '');
                }}
              />

            </Grid>

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
                  //formik.setFieldValue('propertyId', '');
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
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
                  const blockId = value?.value || '';
                  setSelectedBlockId(blockId);
                  formik.setFieldValue('blockId', blockId);
                  formik.setFieldValue('propertyId', '');
                  //formik.setFieldValue('rentAmount', value?.rentAmount || '');                 
                }}
              />
            </Grid>

            {/* Property */}

            {console.log("selectedblockId",selectedBlockId)}

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Property')}</FormLabel>
              <Autocomplete
                disablePortal
                size="small"
                options={propertyData
                  .filter((property) => property.blockId === selectedBlockId)
                  .map((property) => ({
                  label: property.propertyname,
                  value: property._id,
                  //rentAmount: property.rent,
                }))}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={formik.touched.propertyId && Boolean(formik.errors.propertyId)}
                    helperText={formik.touched.propertyId && formik.errors.propertyId}
                  />
                )}
                onChange={(event, value) => {
                  formik.setFieldValue('propertyId', value?.value || '');
                  //formik.setFieldValue('rentAmount', value?.rentAmount || '');                 
                }}
              />
            </Grid>

            {/* Rent Amount */}
            {/*<Grid item xs={12} sm={6}>
              <FormLabel>{t('Rent Amount')}</FormLabel>
              <TextField
                id="rentAmount"
                name="rentAmount"
                type="number"
                size="small"
                fullWidth
                value={formik.values.rentAmount}
                onChange={formik.handleChange}
                error={formik.touched.rentAmount && Boolean(formik.errors.rentAmount)}
                helperText={formik.touched.rentAmount && formik.errors.rentAmount}
                disabled
              />
            </Grid>*/}
            {/* <Grid item xs={12} sm={6}>
              <FormLabel>{t('Maintenance Amount')}</FormLabel>
              <TextField
                id="rentAmount"
                name="rentAmount"
                type="number"
                size="small"
                fullWidth
                value={formik.values.rentAmount}
                onChange={formik.handleChange}
                error={formik.touched.rentAmount && Boolean(formik.errors.rentAmount)}
                helperText={formik.touched.rentAmount && formik.errors.rentAmount}
                disabled
              />
            </Grid> */}

            {/* Advance Amount */}
            {/*<Grid item xs={12} sm={6}>
              <FormLabel>{t('Advance Amount')}</FormLabel>
              <TextField
                id="advanceAmount"
                name="advanceAmount"
                type="number"
                size="small"
                fullWidth
                value={formik.values.advanceAmount}
                onChange={formik.handleChange}
                error={formik.touched.advanceAmount && Boolean(formik.errors.advanceAmount)}
                helperText={formik.touched.advanceAmount && formik.errors.advanceAmount}
              />
            </Grid>*/}

            {/* Starting Date */}
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Date')}</FormLabel>
              <TextField
                id="startingDate"
                name="startingDate"
                type="date"
                size="small"
                fullWidth
                value={formik.values.startingDate}
                onChange={formik.handleChange}
                error={formik.touched.startingDate && Boolean(formik.errors.startingDate)}
                helperText={formik.touched.startingDate && formik.errors.startingDate}
              />
            </Grid>

            {/*<Grid item xs={12} sm={6}>
              <FormLabel>{t('Starting Date')}</FormLabel>
              <TextField
                id="startingDate"
                name="startingDate"
                type="date"
                size="small"
                fullWidth
                value={formik.values.startingDate}
                onChange={formik.handleChange}
                error={formik.touched.startingDate && Boolean(formik.errors.startingDate)}
                helperText={formik.touched.startingDate && formik.errors.startingDate}
              />
            </Grid>*/}

            {/* Ending Date */}
            {/*<Grid item xs={12} sm={6}>
              <FormLabel>{t('Ending Date')}</FormLabel>
              <TextField
                id="endingDate"
                name="endingDate"
                type="date"
                size="small"
                fullWidth
                value={formik.values.endingDate}
                onChange={formik.handleChange}
                error={formik.touched.endingDate && Boolean(formik.errors.endingDate)}
                helperText={formik.touched.endingDate && formik.errors.endingDate}
              />
            </Grid>*/}
          </Grid>

          <DialogActions>
            <Button type="submit" variant="contained" disabled={loading} color="secondary" style={{ textTransform: 'capitalize' }}>
              {loading ? t('Saving...') : t('Save')}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => {
                formik.resetForm();
                handleClose();
              }}
              style={{ textTransform: 'capitalize' }}
            >
              {t('Cancel')}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

AddBooking.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default AddBooking;
