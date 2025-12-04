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

const DeleteImage = ({ open, handleClose, id }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await deleteApi(urls.property.deleteImg, { id });

      if (result?.success) {
        toast.success(t('propertyImagesDeleted')); // Translated message for success
        handleClose();
      }
    } catch (error) {
      console.error('Error deleting property images:', error);
      toast.error(t('cannotDeleteImagesError')); // Translated error message
      setLoading(false); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('deleteImages')}</DialogTitle> {/* Translated title */}
      <DialogContent>
        <p>{t('areYouSureDeleteImage')}</p> {/* Translated confirmation message */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={loading}>
          {t('cancel')} {/* Translated cancel button */}
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={loading}
        >
          {loading ? t('deleting') : t('delete')} {/* Translated delete button */}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteImage.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default DeleteImage;
