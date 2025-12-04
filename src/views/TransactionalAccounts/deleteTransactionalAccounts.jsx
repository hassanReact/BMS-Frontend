/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { patchApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';

const DeleteTransactionalAccount = ({ open, handleClose, data }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await patchApi(urls.transactionalAccounts.delete,{} ,{ id: data._id });

      if (result.success) {
        toast.success(t('Transactional Account Deleted Successfully'));
        handleClose();
      }
    } catch (error) {
      console.error('Error deleting Transactional Account:', error);
      toast.error(t('cannot Delete Transactional Account'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} >
      <DialogTitle>{t('Delete Transactional Account')}</DialogTitle>
      <DialogContent>
        <Typography>{t('Are you sure you want to delete transactional account?')}</Typography>
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

DeleteTransactionalAccount.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

export default DeleteTransactionalAccount;