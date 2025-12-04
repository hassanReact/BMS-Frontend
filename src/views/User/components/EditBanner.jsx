import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const EditBanner = ({ Name, onCancel }) => (
    <Box sx={{ mb: 3, p: 2, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
        <Typography variant="body2" color="primary" fontWeight="bold">
            Editing: {Name}
        </Typography>
        <Button size="small" onClick={onCancel} sx={{ mt: 1 }}>
            Cancel Edit
        </Button>
    </Box>
);

export default EditBanner;
