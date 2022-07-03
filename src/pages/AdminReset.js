import { Link as RouterLink, useParams } from 'react-router-dom';
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

export default function AdminReset() {
  const { token } = useParams();

  return (
    <RootStyle title="Reset">
      <LogoOnlyLayout />
      <Container>
        <>
          <Box sx={{ maxWidth: 480, mx: 'auto' }}>
            <Typography variant="h3" paragraph>
              Create new password
            </Typography>

            <VerifyCodeForm token={token} btnName="Submit" />
            <Button fullWidth size="small" component={RouterLink} to="/login" sx={{ mt: 1 }}>
              Back
            </Button>
          </Box>
        </>
      </Container>
    </RootStyle>
  );
}
