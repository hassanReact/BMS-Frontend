/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Card,
  Breadcrumbs,
  Stack,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router';
import { getApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IconHome } from '@tabler/icons';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const OwnerDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const ownerId = queryParams.get('id');

  const [ownerData, setOwnerData] = useState(null);
  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwnerData = async () => {
    try {
      const response = await getApi(urls.owner.ownerById, { id: ownerId });
      setOwnerData(response?.data);
    } catch (error) {
      console.error('Error fetching owner data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPropertyData = async () => {
    try {
      const response = await getApi(urls.owner.getPropertyByOwnerId, { id: ownerId });
      setPropertyData(response?.data || []);
    } catch (error) {
      console.error('Error fetching property data:', error);
    }
  };

  useEffect(() => {
    if (ownerId) {
      fetchOwnerData();
      fetchPropertyData();
    }
  }, [ownerId]);

  const breadcrumbs = [
    <Link key="home" to="/dashboard/default" style={{ color: 'inherit', textDecoration: 'none' }}>
      <IconHome />
    </Link>,
    <Link key="owner-management" to="/dashboard/owner" style={{ color: 'inherit', textDecoration: 'none' }}>
      {t('Landlord/Owner')}
    </Link>,
    <Typography key="view" color="text.primary">
      {t('View')}
    </Typography>,
  ];

  return (
    <Container>
      {/* Breadcrumb and Heading */}
      <Card sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {t('Owner Details')}
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              {breadcrumbs}
            </Breadcrumbs>
          </Typography>
        </Stack>
      </Card>

      {loading ? (
        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
          {t('Loading...')}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {/* Owner Details Section */}
          <Grid item xs={12}>
            {ownerData ? (
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                  {t('Owner Information')}
                </Typography>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', width: '30%', color: 'text.secondary' }}>
                        {t('Owner Name:')}
                      </TableCell>
                      <TableCell sx={{ color: 'text.primary' }}>{ownerData.ownerName || t('not_available')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>{t('Email Id')}</TableCell>
                      <TableCell sx={{ color: 'text.primary' }}>{ownerData.email || t('not_available')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>{t('Mobile No.')}</TableCell>
                      <TableCell sx={{ color: 'text.primary' }}>{ownerData.phoneNo || t('not_available')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>{t('Address')}</TableCell>
                      <TableCell sx={{ color: 'text.primary' }}>{ownerData.address || t('not_available')}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
                {t('No owner details available.')}
              </Typography>
            )}
          </Grid>

          {/* Property Details Section */}
          <Grid item xs={12}>
            {propertyData.length > 0 ? (
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                  {t('Property Information')}
                </Typography>
                {propertyData.map((property, index) => (
                  <Accordion key={index} sx={{ mb: 2, boxShadow: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {property.propertyname || t('Property')} #{index + 1}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', width: '30%', color: 'text.secondary' }}>
                              {t('Property Name:')}
                            </TableCell>
                            <TableCell sx={{ color: 'text.primary' }}>
                              {property.propertyname || t('not_available')}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>{t('Description')}</TableCell>
                            <TableCell sx={{ color: 'text.primary' }}>
                              {property.description || t('not_available')}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>{t('Rent')}</TableCell>
                            <TableCell sx={{ color: 'text.primary' }}>{property.rent || t('not_available')}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                              {t('Property Address')}
                            </TableCell>
                            <TableCell sx={{ color: 'text.primary' }}>
                              {property.address || t('not_available')}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Paper>
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
                {t('No property details available for this owner.')}
              </Typography>
            )}
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default OwnerDetails;