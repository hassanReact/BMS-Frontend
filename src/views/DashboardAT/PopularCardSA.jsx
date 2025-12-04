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
  const [companyData, setCompanyData] = useState([]);
  const payload = tokenPayload();

  const fetchCompanyData = async () => {
    try {
      const response = await getApi(urls.company.companydata);
      console.log(response,"response")
      if (response?.success) {
        setCompanyData(response?.data);
      }
    } catch (error) {
      console.log("Error fetching vacant properties:", error);
    }
  };

  useEffect(() => {
    fetchCompanyData();
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
                <Typography variant="h4">{t('Total Companies')}</Typography>
              </Grid>

              <Grid item xs={12}>
                {companyData.length === 0 ? (
                  <Typography variant="body2" color="textSecondary">
                    {t('No Company Registered')}
                  </Typography>
                ) : (
                  companyData.map((company) => (
                    <div key={company._id}>
                      <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                          <Typography variant="subtitle1" color="inherit">
                           {company.companyName}
                          </Typography>
                          {/* <Typography variant="body2" color="textSecondary">
                            {t('property_rent')} {company.rent}
                          </Typography> */}
                        </Grid>

                        <Grid item>
                          <Grid container alignItems="center">
                            <Grid item>
                              <Typography variant="subtitle1" color="inherit">
                                {company.email}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Avatar
                                variant="rounded"
                                sx={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: '5px',
                                  backgroundColor: company.status
                                    ? theme.palette.success.light
                                    : theme.palette.error.light,
                                  color: company.status
                                    ? theme.palette.success.dark
                                    : theme.palette.error.dark,
                                  ml: 2,
                                }}
                              >
                                {company.status ? (
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
