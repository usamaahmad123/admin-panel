import { Icon } from '@iconify/react';
import forkOutlined from '@iconify/icons-ant-design/fork-outlined';
import { styled } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.warning.darker,
  backgroundColor: theme.palette.warning.lighter
}));

// ----------------------------------------------------------------------

export default function AppItemOrders() {
  return (
    <RootStyle>
      <Icon icon={forkOutlined} width={36} height={36} />
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Settings
      </Typography>
    </RootStyle>
  );
}
