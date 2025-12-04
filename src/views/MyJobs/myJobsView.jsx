import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Divider,
  Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
// import CommentSection from 'components/CommentSection'; // ✅ adjust import path as needed

const MyJobsView = () => {
  const { id } = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [myjob, setMyjob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getApi(urls.Complaints.getComplainById, { id });
        console.log(res.data);
        setMyjob(res.data);
      } catch (err) {
        console.error('Error fetching job details:', err);
      }
    };

    fetchJob();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!myjob) {
    return <Typography sx={{ p: 3 }}>Loading job details...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        My Job Details
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} aria-label="job tabs">
        <Tab label="Job Details" />
      </Tabs>

      {/* Tab 1: Job Details */}
      {tabValue === 0 && (
        <Paper elevation={3} sx={{ mt: 2, p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Job Information</Typography>
          <Divider sx={{ mb: 2 }} />
          <Box display="flex" flexWrap="wrap" justifyContent="space-between">
            <Box sx={{ mb: 2, width: '45%' }}>
              <Typography fontWeight="bold">Job Title</Typography>
              <Typography>{myjob.concernTopic}</Typography>
            </Box>
            <Box sx={{ mb: 2, width: '45%' }}>
              <Typography fontWeight="bold">Job Location</Typography>
              <Typography>{myjob.tenantId?.address || 'N/A'}</Typography>
            </Box>
            <Box sx={{ mb: 2, width: '45%' }}>
              <Typography fontWeight="bold">Requested By</Typography>
              <Typography>{myjob.tenantId?.tenantName || 'N/A'}</Typography>
            </Box>
            <Box sx={{ mb: 2, width: '45%' }}>
              <Typography fontWeight="bold">Property</Typography>
              <Typography>{myjob.propertyId?.propertyname || 'N/A'}</Typography>
            </Box>
            <Box sx={{ mb: 2, width: '45%' }}>
              <Typography fontWeight="bold">Description</Typography>
              <Typography>{myjob.description || 'N/A'}</Typography>
            </Box>
            <Box sx={{ mb: 2, width: '45%' }}>
              <Typography fontWeight="bold">Status</Typography>
              <Typography>{myjob.status ? 'Completed' : 'Pending'}</Typography>
            </Box>
            <Box sx={{ mb: 2, width: '45%' }}>
              <Typography fontWeight="bold">Assigned To</Typography>
              <Typography>{myjob.assignedName || 'Not Assigned'}</Typography>
            </Box>
            <Box sx={{ mb: 2, width: '45%' }}>
              <Typography fontWeight="bold">Created At</Typography>
              <Typography>{new Date(myjob.createdAt).toLocaleString()}</Typography>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default MyJobsView;
