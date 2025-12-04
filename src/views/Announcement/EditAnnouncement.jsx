/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import {
  Button,
  Dialog,
  FormLabel,
  Grid,
  TextField,
  Typography,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { updateApi, getApi } from '@/core/apis/api';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { urls } from '@/core/Constant/urls';
import { useState } from 'react';
import { tokenPayload } from '@/helper';

const EditAnnouncement = ({ open, handleClose, data }) => {
  const { t } = useTranslation();
  const payload = tokenPayload();
    const [loading, setLoading] = useState(false);
  

  const handleEditAnnouncement = async (values, resetForm) => {
    setLoading(true);
    const updatedValues = { ...values, companyId: payload._id, id: data._id };

    try {
      const response = await updateApi(urls.Announcement.editAnnouncement, updatedValues, { id: data._id });

      if (response.success) {
        toast.success(t('Announcement updated successfully!'));
        resetForm();
        handleClose();
      }
    } catch (err) {
      console.error('Error updating announcement:', err);
      setLoading(false);
      toast.error(err.message || t('Something went wrong!'));
    } finally {
      handleClose();
      resetForm()
      setLoading(false); 
    }
  };

  const validationSchema = yup.object({
    topic: yup.string().max(50, t('Topic cannot exceed 50 characters')).required(t('Topic is required')),
    details: yup.string().required(t('Details are required')), 
  });

  const formik = useFormik({
    initialValues: {
      topic: data?.topic || '',
      details: data?.details || '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      handleEditAnnouncement(values, resetForm);
    },
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle
        id="scroll-dialog-title"
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Typography variant="h6">{t('editAnnouncement')}</Typography>
        <ClearIcon onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <Typography sx={{ mb: 2 }} variant="h6">
              {t('announcementInformation')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormLabel>{t('topic')}</FormLabel>
                <TextField
                  id="topic"
                  name="topic"
                  size="small"
                  fullWidth
                  value={formik.values.topic}
                  onChange={formik.handleChange}
                  error={formik.touched.topic && Boolean(formik.errors.topic)}
                  helperText={formik.touched.topic && formik.errors.topic}
                />
              </Grid>
              <Grid item xs={12}>
                <FormLabel>{t('details')}</FormLabel>
                <TextField
                  id="details"
                  name="details"
                  size="small"
                  fullWidth
                  multiline
                  rows={4}
                  value={formik.values.details}
                  onChange={formik.handleChange}
                  error={formik.touched.details && Boolean(formik.errors.details)}
                  helperText={formik.touched.details && formik.errors.details}
                />
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
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
            {t('cancel')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

EditAnnouncement.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default EditAnnouncement;
