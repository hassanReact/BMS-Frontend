<<<<<<<< HEAD:src/views/Staff/DeleteAgent.jsx
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

const DeleteAgent = ({ open, handleClose, id }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      const result = await patchApi(urls.agent.delete, { isDeleted: true }, { id });

      if (result?.success) {
        toast.success(t('agent Deleted successfully'));
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 500 - elapsedTime);
        setTimeout(() => {
          setLoading(false);
          handleClose();
        }, remainingTime);
      } else {
        toast.error(t('cannot delete agent'));
        setLoading(false); 
      }
    } catch (error) {
      console.error('Error deleting Agent:', error);
      toast.error(t('cannot delete Agent'));
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('deleteAgent')}</DialogTitle>
      <DialogContent>
        <p>{t('areYouSureDeleteAgent')}</p>
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

DeleteAgent.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default DeleteAgent;
========
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
import { deleteApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { decryptWithAESKey } from '@/core/crypto/decrypt';

const DeleteStaff = ({ open, handleClose, id }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await deleteApi(`${urls.staff.delete}/${id}`);
      console.log(result);
      if (result?.data) {
        toast.success(t('Staff deleted successfully'));
        setTimeout(() => {
          setLoading(false);
          handleClose();
        }, 300);
      } else {
        toast.error(t('Cannot delete staff'));
        setLoading(false);
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast.error(t('Cannot delete staff'));
      setLoading(false);
    }
  };



  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('Delete Staff')}</DialogTitle>
      <DialogContent>
        <p>{t('Are you sure you want to delete this staff?')}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={loading}>
          {t('Cancel')}
        </Button>
        <Button
          onClick={handleDelete}
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

DeleteStaff.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default DeleteStaff;
>>>>>>>> d9b2da8ff556c2c70aa8c310fb13232da691f214:src/views/Staff/DeleteStaff.js
