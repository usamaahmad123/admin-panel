import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
// material
import { useTheme } from '@material-ui/core/styles';
import { Box, Card, Typography } from '@material-ui/core';
// utils
import { fNumber } from '../../utils/formatNumber';
import { getTotalProjects } from '../../utils/Index';

// ----------------------------------------------------------------------

const CHART_DATA = [{ data: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20] }];

export default function TotalProjects() {
  const theme = useTheme();
  const [projects, setProjects] = useState(10);
  useEffect(() => {
    getTotalProjects().then((res) => {
      if (res.success) {
        setProjects(res.data);
      }
    });
  }, []);
  const chartOptions = {
    colors: [theme.palette.chart.blue[0]],
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
        <Typography variant="subtitle2">Total Projects</Typography>
        <Typography variant="h3">{fNumber(projects)}</Typography>
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
