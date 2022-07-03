import { Icon } from '@iconify/react';
import usergroupAddOutlined from '@iconify/icons-ant-design/usergroup-add-outlined';
// material
import { styled } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';
// utils

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.lighter
}));
// ----------------------------------------------------------------------

const TOTAL = 10;

export default function AppWeeklySales() {
  return (
    <RootStyle>
      {/* <IconWrapperStyle> */}
      <Icon icon={usergroupAddOutlined} width={36} height={36} />
      {/* </IconWrapperStyle> */}
      {/* <Typography variant="h3">{fShortenNumber(TOTAL)}</Typography> */}
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Users
      </Typography>
    </RootStyle>
  );
}
