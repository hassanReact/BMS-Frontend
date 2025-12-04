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

const DeleteTenant = ({ open, handleClose, id }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await patchApi(urls.tenant.delete, { isDeleted: true }, { id });

      if (result?.success) {
          toast.success(t('tenant_deleted_successfully')); 
          // toast.success(t('Resident Deleted Successfully')); 
          handleClose()
      }
    } catch (error) {
      console.error('Error deleting tenant:', error);
      // console.error('Error deleting resident:', error);

      toast.error(t('cannot_delete_tenant_error'));
      // toast.error(t('cannot delete resident error'));

      setLoading(false); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('delete_tenant')}</DialogTitle> 
      {/* <DialogTitle>{t('delete resident')}</DialogTitle>  */}

      <DialogContent>
        <p>{t('are_you_sure_delete_tenant')}</p>
        {/* <p>{t('are_you_sure_delete_resident')}</p>   */}
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

DeleteTenant.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default DeleteTenant;
