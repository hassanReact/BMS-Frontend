/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
import React, { useState , useEffect} from 'react';
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
import { tokenPayload } from '@/helper';
import { getApi } from '@/core/apis/api';

const BuySubscription = ({ open, handleClose, data }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [companyData,setCompanyData] = useState(null);
  const payload = tokenPayload();

  console.log(data,"data")


    useEffect(() => {
      const fetchCompanyData = async () => {
        try {
          const response = await getApi(urls.company.getCompanyById, { id: payload.companyId });
          setCompanyData(response.data);
        } catch (err) {
          // setError('Error fetching company data');
          console.error('Error fetching company data', err);
        } finally {
          setLoading(false);
        }
      };
  
      if (payload?.companyId) fetchCompanyData();
    }, [payload?.companyId]);

    console.log(data,payload,companyData,"data")

  const handleAddSubmit = async () => {
    setLoading(true);
    try {
      const result = await patchApi(urls.company.addSubcriptionPlan, { companyId: payload.companyId, SubscriptionId:data._id,  buyDate: new Date(), amount: data.amount , discount: data.discount,currency: companyData.currencyCode }, {});

      if (result?.success) {
        toast.success(t('Subscription added successfully'));
        handleClose();
      } else {
        toast.error(t('Failed to add Subscription'));
      }
    } catch (error) {
      console.error('Error in adding Subscription:', error);
      toast.error(t('Error in adding Subscription'));
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
        {t('Buy Subscription')}
      </DialogTitle>

      <DialogContent dividers>
        <Typography id="delete-dialog-description">
          {t('Are you sure you want to buy this subscription ?')}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={loading}>
          {t('Cancel')}
        </Button>
        <Button
          onClick={handleAddSubmit}
          color="error"
          variant="contained"
          disabled={loading}
        >
          {loading ? t('Adding...') : t('Add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

BuySubscription.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

export default BuySubscription;
