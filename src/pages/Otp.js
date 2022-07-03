import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import { styled } from '@material-ui/core/styles';
import { Box, Button, Link, Container, Typography } from '@material-ui/core';
// layouts
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import Page from '../components/Page';
import { OtpForm } from '../components/authentication/Otp/index';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Otp() {
  return (
    <RootStyle title="Verification">
      <LogoOnlyLayout />

      <Container>
        <Box sx={{ maxWidth: 480, mx: 'auto' }}>
          <Button
            size="small"
            component={RouterLink}
            to="/login"
            startIcon={<Icon icon={arrowIosBackFill} width={20} height={20} />}
            sx={{ mb: 3 }}
          >
            Back
          </Button>

          <Typography variant="h3" paragraph>
            Please check your email!
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            We have emailed a 6-digit confirmation code to your email address, please enter the code
            in below box to verify your email.
          </Typography>

          <Box sx={{ mt: 5, mb: 3 }}>
            <OtpForm />
          </Box>

          {/* <Typography variant="body2" align="center">
            Don’t have a code? &nbsp;
            <Link
              variant="subtitle2"
              underline="none"
              component={RouterLink}
              to="/forgetpassword"
              onClick={() => {}}
            >
              Resend code
            </Link>
          </Typography> */}
        </Box>
      </Container>
    </RootStyle>
  );
}
