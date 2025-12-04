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
import { patchApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { tokenPayload } from '@/helper';
import { useCallback } from 'react';
import { debounce } from 'lodash';

const DeleteOwner = ({ open, handleClose, id }) => {
  const { t } = useTranslation(); 

  const [loading, setLoading] = useState(false); 

  const handleDeleteRequest = async () => {
    setLoading(true);

    try {
      const result = await patchApi(urls.owner.delete, { isDeleted: true }, { id });

      if (result?.success) {
 
        toast.success(t('Owner Deleted Successfully'));
        handleClose();
      }
    } catch (error) {
      console.error('Error deleting owner:', error);
      toast.error(t('cannot delete owner'));
    } finally {
      handleClose();
      setLoading(false); 
    }
  };


  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('deleteCustomer')}</DialogTitle>
      <DialogContent>
        <p>{t('areYouSureDeleteCustomer')}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={loading}>
          {t('cancel')}
        </Button>
        <Button
          onClick={handleDeleteRequest}
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

DeleteOwner.propTypes = {
  open: PropTypes.bool.isRequired, 
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired, 
};

export default DeleteOwner;
