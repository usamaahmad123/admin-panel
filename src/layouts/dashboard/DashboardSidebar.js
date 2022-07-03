import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@material-ui/core/styles';
import { Box, Link, Drawer, Typography, Avatar } from '@material-ui/core';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
import { MHidden } from '../../components/@material-extend';
//
import SidebarConfig from './SidebarConfig';
import account from '../../_mocks_/account';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH
  }
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[200]
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();
  const [routes, setRoutes] = useState(SidebarConfig());

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    setRoutes(SidebarConfig());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  if (pathname.includes('gallery')) {
    return null;
  }
  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
      }}
    >
      <Box sx={{ px: 2.5, py: 2 }}>
        {/* <Box
          component={RouterLink}
          to={localStorage.getItem('Role') === '1' ? '/dashboard/data' : '/dashboard/app'}
          sx={{ display: 'flex', justifyContent: 'space-around' }}
        >
          <Logo />
        </Box> */}
      </Box>

      <Box sx={{ mb: 1.5, mx: 2.5 }}>
        <Link
          underline="none"
          component={RouterLink}
          to={localStorage.getItem('Role') === '1' ? '/dashboard/data' : '/dashboard/app'}
        >
          <AccountStyle>
            <Avatar src={account.photoURL} alt="photoURL" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {localStorage.getItem('fullName').length > 20
                  ? `${localStorage.getItem('fullName').substr(0, 17)}...`
                  : localStorage.getItem('fullName')}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {localStorage.getItem('roleName')}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>

      <NavSection navConfig={routes} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <RootStyle>
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default'
            }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
