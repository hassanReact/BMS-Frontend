import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Button, Chip, IconButton, Menu, MenuItem, Typography, InputAdornment, Badge
} from '@mui/material';
import {
  ViewColumn, FilterList, GridView, FileDownload, Search, MoreVert
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { getApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { toast } from 'react-toastify';
import { tokenPayload } from '@/helper';
import CommentDialog from '@/views/Comments';
import CommentIcon from '@mui/icons-material/Comment';

const Defaulter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openComments, setOpenComments] = useState(false);
  const [tenantComplaintData, setTenantComplaintData] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [jobList, setJobList] = useState([]);
  const [currentRow, setCurrentRow] = useState(null);
  const [rowData, setRowData] = useState(null);

  const payload = tokenPayload();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const response = await getApi(`${urls.staff.getAllJobs}?id=${payload._id}`);
      const formatted = response.data.map((item) => ({
        ...item,
        tenantName: item.tenantId?.tenantName,
        propertyname: item.propertyId?.propertyname,
        phoneNo: item.tenantId?.phoneno,
      }));
      setTenantComplaintData(formatted);
      setJobList(formatted);

      const counts = {};
      for (const complaint of formatted) {
        const res = await getApi(`${urls.Comments.newMessages}/${complaint._id}/${payload._id}`);
        counts[complaint._id] = res.data?.unreadCount || 0;
      }
      setUnreadCounts(counts);

    } catch {
      toast.error('Failed to load job data');
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [openComments]);

  const handleCloseComments = () => {
    setOpenComments(false);
    setCurrentRow(null);
  };

  const handleOpenComments = (row) => {
    setRowData(row);
    setCurrentRow(row);
    setOpenComments(true);
    handleClose();
  };

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleClose = () => setAnchorEl(null);

  const handleOpenView = (id) => navigate(`/dashboard/myjobs/view/${id}`);

  return (
    <>
      <CommentDialog
        open={openComments}
        onClose={handleCloseComments}
        complaintId={rowData?._id || ''}
        user={payload || {}}
      />
      <Box sx={{ minHeight: '100vh', background: '#f4f6f8', p: 3 }}>
        <Paper elevation={1} sx={{ borderRadius: 2 }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6">My Jobs</Typography>
          </Box>

          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" size="small" startIcon={<ViewColumn />}>Columns</Button>
              <Button variant="outlined" size="small" startIcon={<FilterList />}>Filters</Button>
              <Button variant="outlined" size="small" startIcon={<GridView />}>Density</Button>
              <Button variant="outlined" size="small" startIcon={<FileDownload />}>Export</Button>
            </Box>
            <TextField
              size="small"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 250 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search /></InputAdornment>
              }}
            />
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>S.No.</TableCell>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Job Location</TableCell>
                  <TableCell>Requested By</TableCell>
                  <TableCell>Job Details</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Comments</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobList.map((item, index) => (
                  <TableRow key={item._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.concernTopic}</TableCell>
                    <TableCell>{item.tenantId?.address || 'N/A'}</TableCell>
                    <TableCell>{item.tenantId?.tenantName || 'Admin'}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.status ? 'In Progress' : 'Pending'}
                        color={item.status ? 'warning' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenComments(item)}>
                        <Badge badgeContent={unreadCounts[item._id] || 0} color="error" invisible={(unreadCounts[item._id] || 0) === 0}>
                          <CommentIcon style={{ color: 'blue' }} />
                        </Badge>
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(event) => handleMenuClick(event, item)}><MoreVert /></IconButton>
                      <Menu anchorEl={anchorEl} open={Boolean(anchorEl) && currentRow?._id === item._id} onClose={handleClose}>
                        <MenuItem onClick={() => handleOpenView(item._id)}>View Details</MenuItem>
                        <MenuItem onClick={handleClose}>Edit</MenuItem>
                        <MenuItem onClick={handleClose}>Send Reminder</MenuItem>
                        <MenuItem onClick={handleClose}>Mark as Resolved</MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </>
  );
};

export default Defaulter;
