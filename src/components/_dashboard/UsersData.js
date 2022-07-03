import { merge } from 'lodash';
import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
// material
import { useTheme, styled } from '@material-ui/core/styles';
import { Card, CardHeader } from '@material-ui/core';
// utils
import { fNumber } from '../../utils/formatNumber';
//
import BaseOptionChart from './BaseOptionChart';
import { getUsersByProject } from '../../utils/Index';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible'
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
  }
}));

// ----------------------------------------------------------------------

export default function AnalyticsCurrentVisits() {
  const theme = useTheme();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    getUsersByProject().then((res) => {
      if (res.success) {
        const array = [];
        const array1 = [];
        res.data.map((arr) => {
          array.push(arr.project);
          return array1.push(Number(arr.users));
        });
        setProjects(array);
        setUsers(array1);
      }
    });
  }, []);
  const chartOptions = merge(BaseOptionChart(), {
    colors: [
      theme.palette.primary.main,
      theme.palette.chart.yellow[0],
      theme.palette.chart.blue[0],
      theme.palette.chart.violet[0]
      // theme.palette.chart.yellow[3]
      // theme.palette.chart.yellow[2]
    ],
    labels: projects,
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `${seriesName}`
        }
      }
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } }
    }
  });

  return (
    <Card>
      <CardHeader title="Users by Project" />
      <ChartWrapperStyle dir="ltr">
        <ReactApexChart type="pie" series={users} options={chartOptions} height={280} />
      </ChartWrapperStyle>
    </Card>
  );
}
