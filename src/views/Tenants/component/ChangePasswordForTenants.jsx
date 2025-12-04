/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Card,
  Box,
  Breadcrumbs,
  Paper,
  Grid,
  Divider,
  TextField,
  IconButton
} from '@mui/material';
import { Close, Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { urls } from '@/core/Constant/urls';
import { useLocation, Link } from 'react-router-dom';
import { IconHome } from '@tabler/icons';
import { tokenPayload } from '@/helper';
import { toast } from 'react-toastify';
import { patchApi } from '@/core/apis/api';

const ChangePasswordForTenant = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const payload = tokenPayload();
  const queryParams = new URLSearchParams(location.search);
  const tenantId = queryParams.get('id');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error(t('Please enter both passwords'));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t('Passwords do not match'));
      return;
    }

    try {
      const response = await patchApi(urls.tenant.changePassword, {
        id: tenantId,
        newPassword: newPassword
      });

      if (response?.success) {
        toast.success(t('Password changed successfully'));
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(t('Failed to change password'));
      }
    } catch (error) {
      toast.error(t('Something went wrong while changing the password'));
    }
  };

    const breadcrumbs = [
      <Link key="home" to="/dashboard/default" style={{ color: 'inherit' }}>
        <IconHome />
      </Link>,
      <Link key="tenant-management" to="/dashboard/tenents" style={{ color: 'inherit' }}>
        {t('Tenant Management')}
      </Link>,
      <Typography key="view" color="text.primary">
    {t('Change Password')} 
      </Typography>
    ];

  return (
    <Container>
      <Card sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: 3 }}>
         <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                  <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {t('Tenant Management')}
                    <Breadcrumbs separator="›" aria-label="breadcrumb">
                      {breadcrumbs}
                    </Breadcrumbs>
                  </Typography>
                </Stack>
      </Card>

      <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                border: '1px solid #333',
                borderRadius: '8px',
                backgroundColor: '#fff',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Typography variant="h4" gutterBottom>
                {t('Change Password')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={t('New Password')}
                    type={showNewPassword ? 'text' : 'password'}
                    fullWidth
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={t('Confirm Password')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={handlePasswordChange}
                    disabled={!newPassword || !confirmPassword}
                  >
                    {t('Update Password')}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default ChangePasswordForTenant;
