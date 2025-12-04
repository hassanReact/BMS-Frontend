import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Button, Card, CardContent, Grid, Typography, CircularProgress } from '@mui/material';
import AnimateButton from '@/ui-component/extended/AnimateButton';
import { tokenPayload } from '@/helper';
import { getApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { useTranslation } from 'react-i18next';

const CardStyle = styled(Card)(({ theme }) => ({
  background: theme.palette.warning.light,
  margin: '16px 0',
  padding: '8px',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: '12px',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: '180px',
    height: '180px',
    border: '15px solid',
    borderColor: theme.palette.warning.main,
    borderRadius: '50%',
    top: '40px',
    right: '-120px',
    opacity: 0.3
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: '150px',
    height: '150px',
    border: '2px solid',
    borderColor: theme.palette.warning.main,
    borderRadius: '50%',
    top: '100px',
    right: '-50px',
    opacity: 0.2
  }
}));

const UpgradePlanCard = () => {
  const payload = tokenPayload();
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {t} = useTranslation();

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await getApi(urls.company.getCompanyById, { id: payload.companyId });
        setCompanyData(response.data);
      } catch (err) {
        setError('Error fetching company data');
        console.error('Error fetching company data', err);
      } finally {
        setLoading(false);
      }
    };

    if (payload?.companyId) fetchCompanyData();
  }, [payload?.companyId]);

  if (loading) {
    return (
      <CardStyle>
        <CardContent>
          <CircularProgress />
        </CardContent>
      </CardStyle>
    );
  }

  if (error) {
    return (
      <CardStyle>
        <CardContent>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </CardContent>
      </CardStyle>
    );
  }

  return (
    <CardStyle>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {companyData?.companyName || 'Your Company'}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mb: 1 }}>
          {t('We help simplify and manage all your property rentals with ease and transparency.')}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {t('connect us on :-')}
        </Typography>
        <AnimateButton>
          <Button
            variant="contained"
            color="warning"
            sx={{ boxShadow: 'none', fontSize: '0.75rem', padding: '6px 12px' }}
            href={`mailto:${companyData?.email || 'support@company.com'}`}
          >
            📧 {companyData?.email || 'support@company.com'}
          </Button>
        </AnimateButton>
      </CardContent>
    </CardStyle>
  );
};

export default UpgradePlanCard;
