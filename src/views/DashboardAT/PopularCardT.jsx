/* eslint-disable prettier/prettier */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Button, CardActions, CardContent, Divider, Grid, Typography } from '@mui/material';

// project imports
import MainCard from '@/ui-component/cards/MainCard';
import SkeletonPopularCard from '@/ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from '@/store/constant';
import { urls } from '@/core/Constant/urls';
import { getApi } from '@/core/apis/api';
import { useTranslation } from 'react-i18next';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { tokenPayload } from '@/helper';

const PopularCard = ({ isLoading }) => {
  const{t} = useTranslation();
  const theme = useTheme();
  const [unpaidBillData, setUnpaidBillData] = useState([]);
  const payload = tokenPayload();

  const fetchPendingData = async () => {
    try {
      const response = await getApi(urls.bill.getBillForTPending, { id: payload._id });
      if (response?.success) {
        setUnpaidBillData(response?.data);
      }

    } catch (error) {
      console.log("Error fetching vacant properties:", error);
    }
  };

  useEffect(() => {
    fetchPendingData();
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
                <Typography variant="h4">{t('Pending Bills')}</Typography>
              </Grid>

              <Grid item xs={12}>
              {unpaidBillData.length === 0 ? (
  <Typography variant="body2" color="textSecondary">
    {t('No pending bills')}
  </Typography>
) : (
  unpaidBillData.map((bill) => (
    <div key={bill._id}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="subtitle1" color="inherit">
            {t('Invoice No')} {bill.invoiceNo}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {t('Pending Amount')} {bill.totalBillAmountAfterGST}
          </Typography>
        </Grid>
        <Grid item>
          <Grid container alignItems="center">
            <Grid item>
              <Typography variant="subtitle1" color="inherit">
                {t('Created On')}: {new Date(bill.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </Typography>
            </Grid>
            <Grid item>
              <Avatar
                variant="rounded"
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '5px',
                  backgroundColor: bill.status
                    ? theme.palette.success.light
                    : theme.palette.error.light,
                  color: bill.status
                    ? theme.palette.success.dark
                    : theme.palette.error.dark,
                  ml: 2,
                }}
              >
                {bill.status ? (
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
          {/* <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
            <Button size="small" disableElevation>
              View All
              <ChevronRightOutlinedIcon />
            </Button>
          </CardActions> */}
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
