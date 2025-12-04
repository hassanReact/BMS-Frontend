import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box } from '@mui/material';

const InfoCard = ({ isLoading, cardName, length, Icon, color = '#dc3545' }) => {
  if (isLoading) {
    return <Card sx={{ width: '100%', height: 100, m: 1, boxShadow: 3 }} />;
  }

  return (
    <Card
      sx={{
        width: { xs: '100%', sm: '48%', md: '22%' },
        minWidth: 200,
        m: 1,
        boxShadow: 3,
        marginTop: '35px'
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px',
          paddingBottom: '10px !important'
        }}
      >
        <Box
          sx={{
            borderRadius: 2,
            p: 2,
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 60,
            height: 60,
            backgroundColor: color
          }}
        >
          <Icon sx={{ fontSize: 30, color: 'white' }} />
        </Box>
        <Box>
          <Typography variant="subtitle2" color="textSecondary" sx={{ fontSize: '15px' }}>
            {cardName}
          </Typography>
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '17px' }}>
            {length ?? 0}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

InfoCard.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  cardName: PropTypes.string.isRequired,
  length: PropTypes.number.isRequired,
  Icon: PropTypes.elementType.isRequired,
  color: PropTypes.string
};

export default InfoCard;
