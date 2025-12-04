/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  FormLabel,
  Grid,
  TextField,
  Typography,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { getApi, postApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { tokenPayload } from '@/helper';

const AddComplaintsByTenants = ({ open, handleClose }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [propertyId, setPropertyId] = useState(''); // ✅ missing state added
  const payload = tokenPayload();

  const validationSchema = yup.object({
    concernTopic: yup
      .string()
      .matches(/^[A-Za-z0-9 ]*$/, t('Topic can only contain letters, numbers, and spaces'))
      .max(30, t('Topic cannot exceed 30 characters'))
      .required(t('Topic is required')),
    description: yup
      .string()
      .max(200, t('Description cannot exceed 200 characters'))
      .required(t('Description is required')),
  });

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await getApi(urls.tenant.tenantBookingData, { id: payload._id });
        if (response?.data?.length > 0) {
          const firstItem = response.data[0];
          setPropertyId(firstItem?.propertyId?._id || '');
        }
      } catch (err) {
        console.error('Error fetching property data:', err);
        toast.error(t('Failed to fetch property data!'));
      }
    };

    if (open) {
      fetchPropertyData();
    }
  }, [open, payload._id, t]);
 
  const formik = useFormik({
    initialValues: {
      concernTopic: '',
      description: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!propertyId) {
        toast.error(t('Property information not available.'));
        return;
      }

      const complaintData = {
        ...values,
        propertyId,
        companyId: payload.companyId,
        ...(payload.role === 'staff' && { staffId: payload._id }), // ✅ replaced agentId with staffId if needed
        ...(payload.role === 'tenant' && { tenantId: payload._id }),
      };

      try {
        setLoading(true);
        const response = await postApi(urls.Complaints.create, complaintData);
        if (response.success) {
          setTimeout(() => {
            setLoading(false);
            handleClose();
          }, 500);
          toast.success(t('Complaint successfully registered!'));
          resetForm();
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
        toast.error(t('Something went wrong!'));
      }
    },
  });
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">{t('Add New Complaint')}</Typography>
        <ClearIcon onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <DialogContentText>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              {t('Complaint Information')}
            </Typography>
            <Grid container spacing={2}>
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
                />
              </Grid>
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
            </Grid>
          </DialogContentText>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={formik.handleSubmit}
          variant="contained"
          color="primary"
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

export default AddComplaintsByTenants;
