/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Typography, FormHelperText } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { postApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { toast } from 'react-toastify';

const AddImageDialog = ({ open, handleClose }) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const propertyId = queryParams.get('id');

  // Validation Schema with additional file type validation
  const validationSchema = yup.object({
    name: yup.string().required(t('Document Name is required')),
    files: yup.mixed().test(
      'fileType',
      t('Only jpeg, jpg, and png files are allowed'),
      (value) => {
        if (!value) return false; // If no file selected
        const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg'];
        return allowedFormats.includes(value.type);
      }
    ).required(t('File is required'))
  });

  const formik = useFormik({
    initialValues: { name: '', files: null },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('files', values.files);
      formData.append('propertyId', propertyId);

      try {
        setLoading(true);
        const response = await postApi(urls.property.uplaodImages, formData, {
          'Content-Type': 'multipart/form-data'
        });
        if (response.success) {
          toast.success(t('File uploaded successfully'));
          formik.resetForm();
          setFiles(null);
          handleClose();
        }
      } catch (error) {
        toast.error(t('Error in uploading file'));
      } finally {
        setLoading(false);
      }
    }
  });

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      // Check if the uploaded file is a valid image type
      const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedFormats.includes(uploadedFile.type)) {
        toast.error(t('Only jpeg, jpg, and png files are allowed'));
        setFiles(null);
        formik.setFieldValue('files', null); // Reset file input
      } else {
        setFiles(uploadedFile);
        formik.setFieldValue('files', uploadedFile);
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('Add Image')}</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('Image Name')}
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" component="label" fullWidth>
                {files ? t('Change File') : t('Upload File')}
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              {files && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  📄 {files.name}
                </Typography>
              )}
              {formik.touched.files && formik.errors.files && <FormHelperText error>{formik.errors.files}</FormHelperText>}
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" color="error">
          {t('Cancel')}
        </Button>
        <Button onClick={formik.handleSubmit} variant="contained" color="primary" disabled={loading}>
          {loading ? t('Uploading...') : t('Save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddImageDialog;
