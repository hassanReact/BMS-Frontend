/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { deleteApi, patchApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';

const DeleteFile = ({ open, handleClose, id }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await deleteApi(urls.tenant.deleteDocs,  { id });

      if (result?.success) {
          toast.success(t('tenant_deleted_successfully')); 
          handleClose()
      }
    } catch (error) {
      console.error('Error deleting tenant:', error);
      toast.error(t('cannot_delete_documt_terror'));
      setLoading(false); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('delete_Document')}</DialogTitle> 
      <DialogContent>
        <p>{t('are_you_sure_delete_document')}</p> 
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={loading}>
          {t('cancel')} 
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={loading}
        >
          {loading ? t('deleting') : t('delete')} 
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteFile.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default DeleteFile;
