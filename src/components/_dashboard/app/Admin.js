import { Icon } from '@iconify/react';
import fileImageOutlined from '@iconify/icons-ant-design/file-image-outlined';
// material
import { alpha, styled } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';
// utils

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.info.darker,
  backgroundColor: theme.palette.info.lighter
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.info.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.info.dark, 0)} 0%, ${alpha(
    theme.palette.info.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

export default function Admin() {
  return (
    <RootStyle>
      {/* <IconWrapperStyle> */}
      <Icon icon={fileImageOutlined} width={36} height={36} />
      {/* </IconWrapperStyle> */}
      {/* <Typography variant="h3">{fShortenNumber(TOTAL)}</Typography> */}
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Images
      </Typography>
    </RootStyle>
  );
}
