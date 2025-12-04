import React from 'react';
import CreateBillForm from './CreateBillForm';
import EditBillForm from './EditBillForm';
import PaymentModal from './PaymentModal';

const GenerateMonthlyBill = ({ 
  open, 
  onClose, 
  data, 
  mode, 
  payload, 
  onSuccess 
}) => {
  const isEditMode = mode === 'edit';
  const isPaymentMode = mode === 'payment';

  // If in payment mode, show payment modal directly
  if (isPaymentMode) {
    return (
      <PaymentModal
        open={open}
        onClose={onClose}
        billData={data}
        onSuccess={() => {
          onSuccess?.();
          onClose();
        }}
      />
    );
  }

  // If in edit mode, show edit form
  if (isEditMode) {
    return (
      <EditBillForm
        open={open}
        onClose={onClose}
        data={data}
        payload={payload}
        onSuccess={onSuccess}
      />
    );
  }

  // Default: show create form
  return (
    <CreateBillForm
      open={open}
      onClose={onClose}
      payload={payload}
      onSuccess={onSuccess}
    />
  );
};

export default GenerateMonthlyBill;
