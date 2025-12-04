/* eslint-disable prettier/prettier */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from '@/ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from '@/ui-component/cards/MainCard';
import { gridSpacing } from '@/store/constant';

// chart data
import chartData from './chart-data/total-growth-bar-chart';
import { getApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { tokenPayload } from '@/helper';

const status = [
  {
    value: 'today',
    label: 'Today'
  },
  {
    value: 'month',
    label: 'This Month'
  },
  {
    value: 'year',
    label: 'This Year'
  }
];

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = ({ isLoading }) => {
  const token = tokenPayload();
  const [value, setValue] = useState('year');
  const [salesData, setSalesData] = useState([]);
  const [yearlySale, setYearlySale] = useState([]);

  const [year, setYear] = useState(new Date().getFullYear().toString()); 
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);

  const { navType } = customization;
  const { primary } = theme.palette.text;
  const darkLight = theme.palette.dark.light;
  const grey200 = theme.palette.grey[200];
  const grey500 = theme.palette.grey[500];

  const primary200 = theme.palette.primary[200];
  const primaryDark = theme.palette.primary.dark;
  const secondaryMain = theme.palette.secondary.main;
  const secondaryLight = theme.palette.secondary.light;

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const resource = await getApi(urls?.user.adminDashboard);
        if (resource.success && Array.isArray(resource.data)) {
          setSalesData(resource.data); 
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };
    

    const fetchTotalYearlySalesData = async () => {
      try {
        const amount = await getApi(urls?.bill.setYearlySale, { companyId: token.companyId, year: year });
        if (amount.success) {
          setYearlySale(amount?.data);
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };
    fetchTotalYearlySalesData()
    fetchSalesData();
  }, [year]);

  useEffect(() => {
    const newChartData = {
      ...chartData.options,
      colors: [primary200, primaryDark, secondaryMain, secondaryLight],
      xaxis: {
        labels: {
          style: {
            colors: new Array(12).fill(primary), 
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [primary]
          }
        }
      },
      grid: {
        borderColor: grey200
      },
      tooltip: {
        theme: 'light'
      },
      legend: {
        labels: {
          colors: grey500
        }
      }
    };

    // Updating chart only when data is loaded
    if (!isLoading) {
      ApexCharts.exec('bar-chart', 'updateOptions', newChartData);
    }
  }, [navType, primary200, primaryDark, secondaryMain, secondaryLight, primary, darkLight, grey200, isLoading, grey500]);

  const chartSeries = [
    {
      name: 'Totals',
      data: salesData.length > 0 ? salesData.map((item) => item) : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    // {
    //   name: 'Loss',
    //   data: salesData.length > 0 ? salesData.map((item) => item.loss) : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    // },
    // {
    //   name: 'Profit',
    //   data: salesData.length > 0 ? salesData.map((item) => item.profit) : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    // },
    // {
    //   name: 'Maintenance',
    //   data: salesData.length > 0 ? salesData.map((item) => item.maintenance) : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    // }
  ];

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="subtitle2">Company Statics</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h3">{yearlySale.total_sales_amount}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                {/* <Grid item>
                  <TextField
                    id="standard-select-currency"
                    select
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  >
                    {status.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid> */}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Chart options={chartData.options} series={chartSeries} type="bar" height={chartData.height} />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;
