/* eslint-disable prettier/prettier */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, CardContent, Divider, Grid, Typography } from '@mui/material';

// project imports
import MainCard from '@/ui-component/cards/MainCard';
import SkeletonPopularCard from '@/ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from '@/store/constant';
import { urls } from '@/core/Constant/urls';
import { getApi } from '@/core/apis/api';
import { useTranslation } from 'react-i18next';

// assets
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { tokenPayload } from '@/helper';

const PopularCard = ({ isLoading }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [vacantProperty, setVacantpropertyData] = useState([]);
  const payload = tokenPayload();

  const fetchVacantPropertyData = async () => {
    try {
      const response = await getApi(urls.property.getVacantProperty, { id: payload.companyId });
      if (response?.success) {
        setVacantpropertyData(response?.data);
      }
    } catch (error) {
      console.log("Error fetching vacant properties:", error);
    }
  };

  useEffect(() => {
    fetchVacantPropertyData();
  }, []);

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false} sx={{ height: '600px', overflow: 'auto' }}>
          <CardContent>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Typography variant="h4">{t('Vacant Properties')}</Typography>
              </Grid>

              <Grid item xs={12}>
                {vacantProperty.length === 0 ? (
                  <Typography variant="body2" color="textSecondary">
                    {t('No Vacant Property')}
                  </Typography>
                ) : (
                  vacantProperty.map((vacant) => (
                    <div key={vacant._id}>
                      <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                          <Typography variant="subtitle1" color="inherit">
                             {vacant.propertyname}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {/*{t('property_rent')} {vacant.rent}*/}
                            {t('Property Maintenance')} {vacant.rent}
                          </Typography>
                        </Grid>

                        <Grid item>
                          <Grid container alignItems="center">
                            <Grid item>
                              <Typography variant="subtitle1" color="inherit">
                                {vacant.description}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Avatar
                                variant="rounded"
                                sx={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: '5px',
                                  backgroundColor: vacant.status
                                    ? theme.palette.success.light
                                    : theme.palette.error.light,
                                  color: vacant.status
                                    ? theme.palette.success.dark
                                    : theme.palette.error.dark,
                                  ml: 2,
                                }}
                              >
                                {vacant.status ? (
                                  <KeyboardArrowUpOutlinedIcon fontSize="small" color="inherit" />
                                ) : (
                                  <KeyboardArrowDownOutlinedIcon fontSize="small" color="inherit" />
                                )}
                              </Avatar>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Divider sx={{ my: 1.5 }} />
                    </div>
                  ))
                )}
              </Grid>
            </Grid>
          </CardContent>
        </MainCard>
      )}
    </>
  );
};

PopularCard.propTypes = {
  isLoading: PropTypes.bool,
  payload: PropTypes.object
};

export default PopularCard;
