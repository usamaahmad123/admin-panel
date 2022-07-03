import { Link as RouterLink, useLocation, useParams } from 'react-router-dom';
// material
import { styled } from '@material-ui/core/styles';
import { Box, Button, Container, Typography } from '@material-ui/core';
// layouts
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// routes
// components
import Page from '../components/Page';
import { VerifyCodeForm } from '../components/authentication/verify';

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
  const verify = pathname.includes('/set-password');
  const { token } = useParams();

  return (
    <RootStyle title={verify ? 'Verify' : 'Reset'}>
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

              {/* <Box sx={{ mt: 5, mb: 3 }}> */}
              <VerifyCodeForm token={token} btnName="Submit" />
              <Button fullWidth size="small" component={RouterLink} to="/login" sx={{ mt: 1 }}>
                Back
              </Button>
              {/* </Box> */}

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
              <Typography sx={{ color: 'text.secondary', mb: 2 }}>
                We have sent an OTP to you email adress. Enter that OTP here along with your new
                password below to be able to login to your account.
              </Typography>

              {/* <Box sx={{ mt: 5, mb: 3 }}> */}
              <VerifyCodeForm btnName="Reset" />
              {/* </Box> */}
              <Button fullWidth size="small" component={RouterLink} to="/login" sx={{ mt: 1 }}>
                Login
              </Button>

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
