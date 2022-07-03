import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@material-ui/core/styles';
import { Box, Button, Container, Typography, Card } from '@material-ui/core';
// layouts
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import { MHidden } from '../components/@material-extend';
import Page from '../components/Page';
import { ForgotForm } from '../components/authentication/forgot/index';
//
import SentIcon from '../Assets/SentIcon';

// ----------------------------------------------------------------------

// const RootStyle = styled(Page)(({ theme }) => ({
//   display: 'flex'
//   // minHeight: '100%',
//   // alignItems: 'center',
//   // justifyContent: 'center',
//   // padding: theme.spacing(12, 0)
// }));
const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));
const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center'
    // padding: theme.spacing(12, 0)
  }
}));
const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

// ----------------------------------------------------------------------

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <RootStyle title="Reset Password">
      {/* <LogoOnlyLayout /> */}
      <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 2, mb: 2 }}>
            Let us help you get back your account!
          </Typography>
          <img alt="register" src="/static/illustrations/illustration_forgot.jpg" />
        </SectionStyle>
      </MHidden>

      <Container maxWidth="sm">
        <ContentStyle>
          <Box sx={{ maxWidth: 480, mx: 'auto' }}>
            {!sent ? (
              <>
                <Typography variant="h3" paragraph>
                  Forgot your password?
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 5 }}>
                  Please enter the email address associated with your account and We will email you
                  a link to reset your password.
                </Typography>

                <ForgotForm onSent={() => setSent(true)} onGetEmail={(value) => setEmail(value)} />

                <Button fullWidth size="medium" component={RouterLink} to="/login" sx={{ mt: 1 }}>
                  Back
                </Button>
              </>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <SentIcon sx={{ mb: 5, mx: 'auto', height: 160 }} />

                <Typography variant="h3" gutterBottom>
                  Request sent successfully
                </Typography>
                <Typography>
                  We have sent a confirmation email to &nbsp;
                  <strong>{email}</strong>
                  <br />
                  Please check your email.
                </Typography>

                <Button
                  size="medium"
                  variant="contained"
                  component={RouterLink}
                  to="/login"
                  sx={{ mt: 2 }}
                >
                  Back
                </Button>
              </Box>
            )}
          </Box>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
