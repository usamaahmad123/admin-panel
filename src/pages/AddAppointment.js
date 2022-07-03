import { Stack, Container, Typography } from '@material-ui/core';
import AppointmentForm from '../components/AppointmentForm';
import Page from '../components/Page';

// ----------------------------------------------------------------------

export default function AddAppointment() {
  return (
    <Page title="Image viewer">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Book Appointment
          </Typography>
        </Stack>
        <AppointmentForm />
      </Container>
    </Page>
  );
}
