// material
import { Box, Stack, Container, Typography } from '@material-ui/core';
import { Navigate } from 'react-router-dom';
// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

export default function DashboardUser() {
  if (localStorage.getItem('Role') === '0') {
    return <Navigate to="/dashboard" />;
  }
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Stack direction="column" justifyContent="space-between">
          <Typography style={{ textAlign: 'center' }} gutterBottom variant="h4">
            Segment is under construction.
          </Typography>
          <Box component="img" src="/static/constr.png" />
        </Stack>
      </Container>
    </Page>
  );
}
