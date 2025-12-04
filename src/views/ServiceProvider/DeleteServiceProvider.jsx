/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { patchApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';

const DeleteServiceProvider = ({ open, handleClose, id }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleDeleteSubmit = async () => {
    setLoading(true);

    try {
      const result = await patchApi(urls.serviceProvider.delete, { isDeleted: true }, { id });

      if (result?.success) {
        toast.success(t('Service Provider Deleted Successfully'));
        handleClose();
      }
    } catch (error) {
      console.error('Error deleting service provider:', error);
      toast.error(t('Error deleting Service Provider'));
      setLoading(false);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('Delete Service Provider')}</DialogTitle>
      <DialogContent>
        <p>{t('Are you sure you want to delete this service provider?')}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={loading}>
          {t('Cancel')}
        </Button>
        <Button
          onClick={handleDeleteSubmit}
          color="error"
          variant="contained"
          disabled={loading}
        >
          {loading ? t('Deleting...') : t('Delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteServiceProvider.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default DeleteServiceProvider;
