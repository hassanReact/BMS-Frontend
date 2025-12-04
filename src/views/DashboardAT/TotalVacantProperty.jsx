import PropTypes from 'prop-types';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from '@/ui-component/cards/MainCard';
import SkeletonTotalOrderCard from '@/ui-component/cards/Skeleton/EarningCard';

// assets
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { useTranslation } from 'react-i18next';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  height: '100%',
  '&>div': {
    position: 'relative',
    zIndex: 5
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.primary[800],
    borderRadius: '50%',
    zIndex: 1,
    top: -85,
    right: -95,
    [theme.breakpoints.down('sm')]: {
      top: -105,
      right: -140
    }
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    zIndex: 1,
    width: 210,
    height: 210,
    background: theme.palette.primary[800],
    borderRadius: '50%',
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down('sm')]: {
      top: -155,
      right: -70
    }
  }
}));

const TotalVacantProperties = ({ isLoading, vacantPropertyData }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return isLoading ? (
    <SkeletonTotalOrderCard />
  ) : (
    <CardWrapper border={false} content={false}>
      <Box sx={{ p: 2.25, height: '100%' }}>
        <Grid container direction="column" justifyContent="space-between" sx={{ height: '100%' }}>
          {/* Top left: Title */}
          <Grid item>
            <Typography
              sx={{
                fontSize: '1rem',
                fontWeight: 500,
                color: theme.palette.primary.light
              }}
            >
              {t('Total Vacant Property')}
            </Typography>
          </Grid>

          {/* Bottom left: Icon and Number (Icon on Left, Bigger Icon) */}
          <Grid item>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Avatar
                  sx={{
                    ...theme.typography.smallAvatar,
                    backgroundColor: theme.palette.primary[200],
                    color: theme.palette.primary.dark,
                    width: 48,  // Bigger size
                    height: 48, // Bigger size
                  }}
                >
                  <MeetingRoomIcon fontSize="large" />  {/* Bigger Icon */}
                </Avatar>
              </Grid>
              <Grid item>
                <Typography
                  sx={{
                    fontSize: '2.125rem',
                    fontWeight: 700
                  }}
                >
                  {vacantPropertyData?.length ?? 0}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </CardWrapper>
  );
};

TotalVacantProperties.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  vacantPropertyData: PropTypes.array
};

export default TotalVacantProperties;
