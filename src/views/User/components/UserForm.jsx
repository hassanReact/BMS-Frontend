import React from 'react';
import { Grid, TextField, Box, Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const UserForm = ({ formData, errors, onChange, onSubmit, editingUser }) => (
  <form onSubmit={onSubmit}>
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Name"
          value={formData.name || ''}
          onChange={onChange('name')}
          error={!!errors.name}
          helperText={errors.name}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Email"
          value={formData.email || ''}
          onChange={onChange('email')}
          error={!!errors.email}
          helperText={errors.email}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={formData.password || ''}
          onChange={onChange('password')}
          error={!!errors.password}
          helperText={errors.password}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          select
          fullWidth
          label="Type"
          value={formData.type || ''}
          onChange={onChange('type')}
          error={!!errors.type}
          helperText={errors.type}
          SelectProps={{
            native: true,
          }}
        >
          <option value=""></option>
          <option value="tenant">Tenant</option>
          <option value="staff_admin">Staff Admin</option>
          <option value="staff_worker">Staff Worker</option>
          <option value="staff_labour">Staff Labour</option>
          <option value="staff_guard">Staff Guard</option>
          <option value="manager">Manager</option>
          <option value="vendor_admin">Vendor Admin</option>
          <option value="vendot_user">Vendor User</option>
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button type="submit" variant="contained" size="large" startIcon={<SaveIcon />}>
            {editingUser ? 'Update User' : 'Register User'}
          </Button>
        </Box>
      </Grid>
    </Grid>
  </form>
);

export default UserForm;
