/* eslint-disable prettier/prettier */
import * as React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { 
  FormControl, 
  FormHelperText, 
  FormLabel, 
  Grid, 
  Typography, 
  Button, 
  Dialog, 
  Input 
} from '@mui/material';
import { DialogContent, DialogActions, DialogTitle } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { postApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { useTranslation } from 'react-i18next';
import SampleFile from '@/assets/samplefile/Tenants.xlsx';

const BulkUploadTenant = ({ open, onClose, data }) => {
  const { t } = useTranslation();

  const validationSchema = yup.object({
    files: yup
      .mixed()
      .required(t('Please insert an Excel file'))
      .test(
        'accepted',
        t('Please insert a valid Excel file'),
        (value) => {
          if (!value) return false;
          const allowedFormats = [
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/csv"
          ];
          return allowedFormats.includes(value.type);
        }
      ),
  });

  const formik = useFormik({
    initialValues: {
      file: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append('files', values.files); 
        
        if (data) {
          formData.append('companyId', data.companyId || '');
          formData.append('reporterId', data._id || '');
        }

        const customHeaders = { 'Content-Type': 'multipart/form-data' };
        await postApi(urls.tenant.bulkUpload, formData, customHeaders);
        
        formik.resetForm();
        onClose();
        toast.success(t('Tenants uploaded successfully!'));
        // toast.success(t('Residents uploaded successfully!'));
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(error.response?.data?.message || t('Failed to upload tenants!'));
        // toast.error(error.response?.data?.message || t('Failed to upload Residents!'));
      }
    }
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h6">{t('Bulk Upload Tenants')}</Typography>
        {/* <Typography variant="h6">{t('Bulk Upload Residents')}</Typography> */}
        <ClearIcon onClick={onClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} rowSpacing={4} direction="column">
            <Grid item>
              <Typography sx={{ display: 'inline', marginRight: '10px' }}>
                {t('Download Sample File')}
              </Typography>
              <Typography
                color="primary"
                onClick={() => window.open(SampleFile, '_blank')}
                sx={{ 
                  display: 'inline', 
                  '&:hover': { 
                    textDecoration: 'underline', 
                    cursor: 'pointer' 
                  } 
                }}
              >
                {t('Click here!')}
              </Typography>
            </Grid>
            <Grid item>
              <FormControl fullWidth error={formik.touched.file && Boolean(formik.errors.file)}>
                <FormLabel required>{t('Upload File')}</FormLabel>
                <Input
                  id="files"
                  name="files"
                  type="file"
                  inputProps={{ accept: '.xls,.xlsx,.csv' }}
                  onChange={(event) => {
                    formik.setFieldValue('files', event.currentTarget.files[0]);
                  }}
                />
                {formik.touched.files && formik.errors.files && (
                  <FormHelperText>{formik.errors.files}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <DialogActions sx={{ mt: 2 }}>
            <Button 
              onClick={() => { 
                formik.resetForm(); 
                onClose(); 
              }} 
              variant="outlined" 
              color="error"
            >
              {t('Cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? t('Uploading...') : t('Upload')}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadTenant;
