import PropTypes from 'prop-types';
// material
import { Grid, Card, CardHeader, CardContent, Divider } from '@material-ui/core';
// utils
import Label from '../../Label';

// ----------------------------------------------------------------------

const SOCIALS = [
  {
    value: 'Admin'
  },
  {
    value: 'User'
  },
  {
    value: 'Member'
  }
];

// ----------------------------------------------------------------------

SiteItem.propTypes = {
  site: PropTypes.object
};

function SiteItem({ site }) {
  const { value } = site;

  return (
    <Grid item xs={2}>
      {/* Paper variant="outlined" sx={{ borderRadius: 100, py: 2.5, textAlign: 'center' }}>
        <Typography variant="h6">{value}</Typography>
      </Paper>< */}
      <Label sx={{ width: 60, textAlign: 'center' }} color="primary">
        {value}
      </Label>
    </Grid>
  );
}

export default function AppTrafficBySite() {
  return (
    <Card>
      <CardHeader title="Roles" />
      <Divider />
      <CardContent>
        <Grid container spacing={0}>
          {SOCIALS.map((site) => (
            <SiteItem key={site.name} site={site} />
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
