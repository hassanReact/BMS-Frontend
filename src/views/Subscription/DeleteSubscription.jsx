/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { patchApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';

const DeleteSubscription = ({ open, handleClose, id }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleDeleteSubmit = async () => {
    setLoading(true);
    try {
      const result = await patchApi(urls.Subscribe.delete, { isDeleted: true }, { id });

      if (result?.success) {
        toast.success(t('Subscription deleted successfully'));
        handleClose();
      } else {
        toast.error(t('Failed to delete Subscription'));
      }
    } catch (error) {
      console.error('Error deleting Subscription:', error);
      toast.error(t('Error deleting Subscription'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">
        {t('Delete Subscription')}
      </DialogTitle>

      <DialogContent dividers>
        <Typography id="delete-dialog-description">
          {t('Are you sure you want to delete this subscription ?')}
        </Typography>
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

DeleteSubscription.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

export default DeleteSubscription;
