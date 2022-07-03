// material
import { Grid, Container, Link } from '@material-ui/core';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import Users from '../components/_dashboard/app/Users';
// components
import Page from '../components/Page';
import Report from '../components/_dashboard/app/Report';
import Roles from '../components/_dashboard/app/Roles';
import Admin from '../components/_dashboard/app/Admin';
import UsersData from '../components/_dashboard/UsersData';
import AppTotalActiveUsers from '../components/_dashboard/AppTotalActiveUsers';
import TotalProjects from '../components/_dashboard/TotalProjects';
import AppTotalUsers from '../components/_dashboard/AppTotalUsers';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={6} md={3}>
            <Link to="/dashboard/logs" color="inherit" underline="none" component={RouterLink}>
              <Report />
            </Link>
          </Grid>
          <Grid item xs={6} md={3}>
            <Link to="/dashboard/user/all" color="inherit" underline="none" component={RouterLink}>
              <Users />
            </Link>
          </Grid>
          <Grid item xs={6} md={3}>
            <Link to="/dashboard/gallery" color="inherit" underline="none" component={RouterLink}>
              <Admin />
            </Link>
          </Grid>
          <Grid item xs={6} md={3}>
            <Link
              to="/dashboard/signupsettings"
              color="inherit"
              underline="none"
              component={RouterLink}
            >
              <Roles />
            </Link>
          </Grid>
          <Grid item xs={12} md={4}>
            <TotalProjects />
          </Grid>
          <Grid item xs={12} md={4}>
            <AppTotalActiveUsers />
          </Grid>
          <Grid item xs={12} md={4}>
            <AppTotalUsers />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <UsersData />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
