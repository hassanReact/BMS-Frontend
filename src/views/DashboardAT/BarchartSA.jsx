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

const TotalGrowthBarChart = ({ isLoading }) => {
  const token = tokenPayload();
  const [adminData, setAdminData] = useState([]);
  const [year] = useState(new Date().getFullYear().toString());
  const { t } = useTranslation();
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);

  const terms = ['Company', 'Tenants', 'Agents', 'Property', 'Subcription Plan', 'Active Company'];

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const resource = await getApi(urls?.user.adminDashboard);
        if (resource.success && Array.isArray(resource.data)) {
          const combined = terms.map((term, i) => ({
            name: term,
            total: resource.data[i] || 0
          }));
          setAdminData(combined);
        }
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      }
    };

    fetchAdminData();
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
                  <Typography variant="subtitle2">{t('Admin Dashboard Overview')}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={adminData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis dataKey="name" stroke={theme.palette.text.primary} />
              <YAxis stroke={theme.palette.text.primary} />
              <Tooltip />
              <Bar dataKey="total" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
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
