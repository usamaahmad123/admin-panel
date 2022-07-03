import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
// material
import { useTheme } from '@material-ui/core/styles';
import { Box, Card, Typography } from '@material-ui/core';
// utils
import { fNumber } from '../../utils/formatNumber';
import { getTotalUsers } from '../../utils/Index';

// ----------------------------------------------------------------------

const CHART_DATA = [{ data: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31] }];

export default function AppTotalUsers() {
  const theme = useTheme();
  const [users, setUsers] = useState(10);
  useEffect(() => {
    getTotalUsers().then((res) => {
      if (res.success) {
        setUsers(res.data);
      }
    });
  }, []);
  const chartOptions = {
    colors: [theme.palette.chart.red[0]],
    chart: { sparkline: { enabled: true } },
    plotOptions: { bar: { columnWidth: '68%', borderRadius: 2 } },
    labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
    tooltip: {
      x: { show: false },
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: () => ''
        }
      },
      marker: { show: false }
    }
  };

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">Total Users</Typography>
        <Typography variant="h3">{fNumber(users)}</Typography>
      </Box>

      <ReactApexChart
        type="bar"
        series={CHART_DATA}
        options={chartOptions}
        width={60}
        height={36}
      />
    </Card>
  );
}
