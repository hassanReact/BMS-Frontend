import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { getApi, updateApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { toast } from 'react-toastify';

const AssignStaffDialog = ({ open, handleClose, complaintId, refreshData, companyId }) => {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');

  useEffect(() => {
    if (!open) return;

    const fetchStaff = async () => {
      try {
        const res = await getApi(urls.staff.staffdata, { id: companyId });
        setStaffList(res.data || []);
      } catch (err) {
        toast.error('Failed to load staff list');
      }
    };

    fetchStaff();
  }, [open, companyId]);

  const handleAssign = async () => {
    if (!selectedStaff) return toast.warn('Please select a staff member');

    const selected = staffList.find((s) => s._id === selectedStaff);

    try {
      await updateApi(
        `${urls.Complaints.assignStaffToTenant}?id=${complaintId}`,
        {
          staffId: selected._id,
          staffName: selected.staffName,
        }
      );
      toast.success('Staff assigned successfully');
      refreshData();
      handleClose();
    } catch (err) {
      toast.error('Assignment failed');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth
      maxWidth="sm" // options: 'xs', 'sm', 'md', 'lg', 'xl'
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: { xs: '90%', sm: 500 }, // responsive width
          mx: 'auto', // center horizontally
          p: 2,
        },
      }}>
      <DialogTitle>Assign Staff</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel>Select Staff</InputLabel>
          <Select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            label="Select Staff"
          >
            {staffList.map((staff) => (
              <MenuItem key={staff._id} value={staff._id}>
                {staff.staffName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAssign} variant="contained">Assign</Button>
        <Button onClick={handleClose} color="error">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignStaffDialog;
