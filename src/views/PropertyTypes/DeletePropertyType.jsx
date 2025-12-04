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
import { deleteApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';

const DeletePropertyType = ({ open, handleClose, data }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await deleteApi(urls.propertyTypes.delete, { id: data._id });

      if (result.success) {
        toast.success(t('propertyDeletedSuccessfully'));
        handleClose();
      }
    } catch (error) {
      console.error('Error deleting property type:', error);
      toast.error(t('cannotDeleteProperty'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} >
      <DialogTitle>{t('deletePropertyType')}</DialogTitle>
      <DialogContent>
        <Typography>{t('areYouSureDeletePropertyType')}</Typography>
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

DeletePropertyType.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

export default DeletePropertyType;
