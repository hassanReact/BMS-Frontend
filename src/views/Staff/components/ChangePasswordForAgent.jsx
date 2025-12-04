<<<<<<<< HEAD:src/views/Staff/components/ChangePasswordForAgent.jsx
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
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
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import { IconHome } from '@tabler/icons';
import { tokenPayload } from '@/helper';
import { toast } from 'react-toastify';
import { patchApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';

const ChangePasswordForTenant = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const agentId = queryParams.get('id');

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

    const response = await patchApi(urls.agent.changePassword, {
      id: agentId,
      newPassword
    });

    if (response.success) {
      toast.success(t('Password changed successfully'));
    } else {
      toast.error(t('Failed to change password'));
    }

    setNewPassword('');
    setConfirmPassword('');
  };

    const breadcrumbs = [
      <Link key="home" to="/dashboard/default" style={{ color: 'inherit' }}>
        <IconHome />
      </Link>,
      <Link key="agent-management" to="/dashboard/agents" style={{ color: 'inherit' }}>
        {t('Agent Management')}
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
            {t('Agent Management')}
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
                    variant="outlined"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => setShowNewPassword((prev) => !prev)} edge="end">
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
                    variant="outlined"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end">
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
========
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Card,
  Breadcrumbs,
  Paper,
  Grid,
  Divider,
  TextField,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import { IconHome } from '@tabler/icons';
import { toast } from 'react-toastify';
import { patchApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';

const ChangePasswordForTenant = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const staffId = queryParams.get('id');

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

    const response = await patchApi(urls.staff.changePassword, {
      id: staffId,
      newPassword
    });

    if (response.success) {
      toast.success(t('Password changed successfully'));
    } else {
      toast.error(t('Failed to change password'));
    }

    setNewPassword('');
    setConfirmPassword('');
  };

    const breadcrumbs = [
      <Link key="home" to="/dashboard/default" style={{ color: 'inherit' }}>
        <IconHome />
      </Link>,
      <Link key="staff-management" to="/dashboard/staff" style={{ color: 'inherit' }}>
        {t('Staff Management')}
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
            {t('Staff Management')}
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
                    variant="outlined"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => setShowNewPassword((prev) => !prev)} edge="end">
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
                    variant="outlined"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end">
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
>>>>>>>> d9b2da8ff556c2c70aa8c310fb13232da691f214:src/views/Staff/components/ChangePasswordForStaff.js
