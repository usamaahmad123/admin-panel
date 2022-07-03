import { Icon } from '@iconify/react';
import { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import { styled } from '@material-ui/core/styles';
import { Box, Button, Link, Container, Typography } from '@material-ui/core';
// layouts
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import Page from '../../components/Page';
import { VerifyCodeForm } from '../../components/authentication/verify-code';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function VerifyCode() {
  const { pathname } = useLocation();
  const reset = pathname.includes('/reset');
  const verify = pathname.includes('/verify');

  return (
    <RootStyle title="Verify">
      <LogoOnlyLayout />
      <Container>
        {verify ? (
          <>
            <Box sx={{ maxWidth: 480, mx: 'auto' }}>
              <Typography variant="h3" paragraph>
                Create new password
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Thank you for verifying your email address. Your new account has been activated.
                Please create your password below to login to your account.
              </Typography>

              <Box sx={{ mt: 5, mb: 3 }}>
                <VerifyCodeForm btnName="Submit" />
              </Box>

              {/* <Typography variant="body2" align="center">
            Don’t have a code? &nbsp;
            <Link variant="subtitle2" underline="none" onClick={() => {}}>
              Resend code
            </Link>
          </Typography> */}
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ maxWidth: 480, mx: 'auto' }}>
              <Typography variant="h3" paragraph>
                Reset password
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Please enter your new password below to be able to login to your account.
              </Typography>

              <Box sx={{ mt: 5, mb: 3 }}>
                <VerifyCodeForm btnName="Reset" />
              </Box>

              {/* <Typography variant="body2" align="center">
            Don’t have a code? &nbsp;
            <Link variant="subtitle2" underline="none" onClick={() => {}}>
              Resend code
            </Link>
          </Typography> */}
            </Box>
          </>
        )}
      </Container>
    </RootStyle>
  );
}
