/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  Button,
  Dialog,
  FormLabel,
  Grid,
  TextField,
  Typography,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { updateApi, getApi } from '@/core/apis/api';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { urls } from '@/core/Constant/urls';
import { tokenPayload } from '@/helper';

const EditComplain = ({ open, handleClose, data }) => {
  const { t } = useTranslation();
  const [complainData, setComplainData] = useState([]); 
  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const payload = tokenPayload();

  useEffect(() => {
    if (open) {
      fetchComplainData();
      fetchPropertyData();
    }
  }, [open]);

  // Fetch Property Data
  const fetchPropertyData = async () => {
    setLoading(true);
    try {
      const response = await getApi(urls.property.propertyDataAll, { id: payload.companyId });
      setPropertyData(response?.data || []);
    } catch (error) {
      toast.error(t('failedToFetchPropertyData'));
    } finally {
      setLoading(false);
    }
  };

  const fetchComplainData = async () => {
    setLoading(true);
    try {
      const response = await getApi(urls.property.propertydata);
      if (Array.isArray(response.data)) {
        setComplainData(response.data);
      } else {
        setComplainData([]);
      }
    } catch (err) {
      console.error('Error fetching property data:', err);
      toast.error(t('failedToFetchPropertyData'));
    } finally {
      setLoading(false);
    }
  };

  // Edit Complaint
  const editComplain = async (values, resetForm) => {
      setLoading(true);
      const startTime = Date.now();
      const response = await updateApi(urls.Complaints.editComlplain, values, { id: data._id });

      if (response.success) {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 1000 - elapsedTime);
        setTimeout(() => {
          setLoading(false);
          handleClose();
        }, remainingTime);
        toast.success(t('complaintUpdatedSuccessfully'));
        resetForm();
      } else {
        setLoading(false);
        toast.error(t('failedToUpdateComplaint'));
      }
    // } catch (err) {
    //   console.error('Error updating complaint:', err);
    //   toast.error(t('somethingWentWrong'));
    // }
  };

  // Validation Schema
  const validationSchema = yup.object({ 
    propertyId: yup.string().required(t('Property is required')),
    concernTopic: yup
      .string()
      .max(30, t('Topic cannot exceed 30 characters'))
      .required(t('Topic is required')),
    description: yup
      .string()
      .max(200, t('Description cannot exceed 200 characters'))
      .required(t('Description is required')),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      propertyId: data?.propertyId || '',
      concernTopic: data?.concernTopic || '',
      description: data?.description || '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      editComplain(values, resetForm);
    },
  });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">{t('editComplaint')}</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            {t('Complaint Information')}
          </Typography>
          <Grid container spacing={2}>
            {/* Property Selection */}
            <Grid item xs={12}>
              <FormLabel>{t('Property')}</FormLabel>
              <Autocomplete
                disablePortal
                size="small"
                options={propertyData.map((property) => ({
                  label: property.propertyname,
                  value: property._id,
                  rentAmount: property.rent,
                }))}
                value={
                  propertyData
                    .map((property) => ({
                      label: property.propertyname,
                      value: property._id,
                    }))
                    .find((option) => option.value === formik.values.propertyId) || null
                }
                onChange={(event, value) => {
                  formik.setFieldValue('propertyId', value?.value || '');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={formik.touched.propertyId && Boolean(formik.errors.propertyId)}
                    helperText={formik.touched.propertyId && formik.errors.propertyId}
                    disabled={loading}
                  />
                )}
              />
            </Grid>

            {/* Concern Topic */}
            <Grid item xs={12}>
              <FormLabel>{t('Topic')}</FormLabel>
              <TextField
                id="concernTopic"
                name="concernTopic"
                size="small"
                fullWidth
                value={formik.values.concernTopic}
                onChange={formik.handleChange}
                error={formik.touched.concernTopic && Boolean(formik.errors.concernTopic)}
                helperText={formik.touched.concernTopic && formik.errors.concernTopic}
                disabled={loading}
              />
            </Grid>

            {/* Description */}
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
                disabled={loading}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={formik.handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >  {loading ? t('Saving...') : t('Save')}
        </Button>
        <Button
          onClick={() => {
            formik.resetForm();
            handleClose();
          }}
          variant="outlined"
          color="error"
        >
          {t('cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditComplain.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    propertyId: PropTypes.string,
    concernTopic: PropTypes.string,
    description: PropTypes.string,
  }),
};

export default EditComplain;
