import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// MUI
import { useTheme } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';

// Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

// Project imports
import SkeletonTotalGrowthBarChart from '@/ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from '@/ui-component/cards/MainCard';
import { gridSpacing } from '@/store/constant';

// APIs & Helpers
import { getApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { tokenPayload } from '@/helper';
import { useTranslation } from 'react-i18next';
import { Paid } from '@mui/icons-material';

const TotalGrowthBarChart = ({ isLoading }) => {
  const token = tokenPayload();
  const [salesData, setSalesData] = useState([]);
  const [yearlySale, setYearlySale] = useState([]);
  const [year] = useState(new Date().getFullYear().toString());
  const { t } = useTranslation();
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const amount = await getApi(urls?.bill?.getMonthlyBillOfTenants, {
          tenantId: token._id,
          year
        });
        if (amount.success && Array.isArray(amount.data) && amount.data.length === 12) {
          const combined = months.map((month, i) => ({
            name: month,
            Paid: amount.data[i] || 0
          }));
          setSalesData(combined);
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    const fetchTotalYearlySalesData = async () => {
      try {
        const amount = await getApi(urls?.bill.setYearlySale, {
          companyId: token.companyId,
          year
        });
        if (amount.success) {
          setYearlySale(amount.data);
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
    // fetchTotalYearlySalesData();
  }, [year]);

  return isLoading ? (
    <SkeletonTotalGrowthBarChart />
  ) : (
    <MainCard>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Typography variant="subtitle2">{t('Monthly Bills paid by you every month')}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h3">
                    
                  {/* {yearlySale?.[0]?.total_sales_amount ?? 0} */}

                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={salesData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis dataKey="name" stroke={theme.palette.text.primary} />
              <YAxis stroke={theme.palette.text.primary} />
              <Tooltip />
              <Bar dataKey="Paid" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </MainCard>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;
