import { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper, Container, Card, Stack, Breadcrumbs } from '@mui/material';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IconHome } from '@tabler/icons';
import { urls } from '@/core/Constant/urls';
import { getApi } from '@/core/apis/api';

const AnnouncementViewPage = () => {
  const { t } = useTranslation(); // Use the translation hook
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const announcementId = queryParams.get('id');

  const [announcement, setAnnouncement] = useState(null); // Initialized with null to reflect no data yet
  const fetchAnnouncement = async () => {
    try {
      const response = await getApi(urls.Announcement.getAnnouncementById, { id: announcementId });
      setAnnouncement(response?.data[0]);
    } catch (error) {
      console.error('Error fetching announcement data:', error);
    }
  };

  useEffect(() => {
    fetchAnnouncement();
  }, [announcementId]);

  const breadcrumbs = [
    <Link key="home" to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
      <IconHome />
    </Link>,
    <Link key="agents" to="/dashboard/announcement" style={{ color: 'inherit' }}>
      {t('announcementManagement')}
    </Link>,
    <Typography key="announcement" color="text.primary">
      {t('view')}
    </Typography>,
  ];

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Formats to a readable date and time
  };

  return (
    <Container>
      <Card sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {t('announcement_details')}
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              {breadcrumbs}
            </Breadcrumbs>
          </Typography>
        </Stack>
      </Card>

      <Box sx={{ width: '100%' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              sx={{
                padding: 3,
                borderRadius: '8px',
                backgroundColor: '#fff',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                textAlign: 'center', // Center align content
              }}
            >
              <Typography variant="h4" gutterBottom sx={{ pb: 2 }}>
                {announcement?.topic || t('not_available')}
              </Typography>
              <Typography variant="body1" sx={{ pb: 2 }}>
                {announcement?.details || t('not_available')}
              </Typography>

              {/* Display the creation date and time */}
              <Typography variant="body2" color="textSecondary">
                {t('created_on')}: {announcement?.createdAt ? formatDate(announcement.createdAt) : t('not_available')}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AnnouncementViewPage;
