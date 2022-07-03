import { Icon } from '@iconify/react';
import clockCircleOutlined from '@iconify/icons-ant-design/clock-circle-outlined';
// material
import { alpha, styled } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.error.darker,
  backgroundColor: theme.palette.error.lighter
}));

// ----------------------------------------------------------------------

export default function Report() {
  return (
    <RootStyle>
      <Icon icon={clockCircleOutlined} width="36" height="36" />
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Logs
      </Typography>
    </RootStyle>
  );
}
