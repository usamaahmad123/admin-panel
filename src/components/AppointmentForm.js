import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import moment from 'moment';
import 'moment-timezone';
import SearchIcon from '@mui/icons-material/Search';
// material
import {
  Stack,
  TextField,
  InputAdornment,
  Alert,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  Button,
  RadioGroup,
  Radio,
  FormLabel,
  FormControlLabel,
  Typography
} from '@material-ui/core';
import { LoadingButton, TimePicker, DatePicker } from '@material-ui/lab';
import MuiFormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/styles';
import {
  getRegistredPatients,
  AddAppointment,
  UpdateAppointment,
  GetAllReferrer
} from '../utils/Index';
import './Appointment.css';

// ----------------------------------------------------------------------
const FormControl = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      fontSize: 14
    },
    '& .MuiInputLabel-root': {
      fontSize: 15,
      lineHeight: 2,
      marginTop: -7
    },
    '& .MuiInputBase-input': {
      paddingTop: 11,
      paddingBottom: 10
    }
  }
})(MuiFormControl);
const AppointmentForm = ({
  allLocations,
  allProviders,
  allAppointmentLengths,
  allAppointmentTypes,
  activePatient,
  SnacbarViewer,
  onClose,
  editCall
}) => {
  const m = moment.utc();
  console.log('time zone', m.tz('America/Chicago').format('hh:mm:ss z'));
  const [data, setData] = useState([]);
  const [referrers, setReferrers] = useState([]);
  const [searchProvider, setSearchProvider] = useState('');
  const [searchText, setSearchText] = useState('');
  useEffect(() => {
    getRegistredPatients().then((res) => {
      if (res?.success) {
        setData(res?.data?.rows);
        // formik.setFieldValue('patient_id', res?.data[0] && res?.data[0]?.id);
      }
    });
    GetAllReferrer().then((res) => {
      if (res?.success) {
        setReferrers(res?.data);
        // formik.setFieldValue('patient_id', res?.data[0] && res?.data[0]?.id);
      }
    });
  }, []);

  const RegisterSchema = Yup.object().shape({
    appointment_type_id: Yup.string().required('Appointment type is required'),
    location_id: Yup.string().required('Location is required'),
    appointment_date: Yup.string().required('Appointment date is required'),
    patient_id: Yup.string().required('Patient is required'),
    appointment_time: Yup.string().required('Appointment time is required'),
    appointment_length_id: Yup.string().required('Appointment length is required'),
    provider_id: Yup.string().required('Provider is required'),
    referrer_id: Yup.string().required('Reffered by is required'),
    appointment_note: Yup.string().required('Appointment note is required'),
    billing_note: Yup.string().required('Billing note is required'),
    chief_complaint: Yup.string().required('Chief complaint is required')
  });
  const formik = useFormik({
    initialValues: {
      patient_id: activePatient?.patient_id || '',
      appointment_date:
        Object.keys(activePatient).length !== 0
          ? new Date(activePatient?.appointment_date)
          : m.tz('America/Chicago'),
      appointment_time:
        Object.keys(activePatient).length !== 0
          ? moment(activePatient?.appointment_time.slice(0, 5), 'HH:mm')
          : moment(m.tz('America/Chicago').format('HH:mm'), 'HH:mm'),
      location_id: activePatient?.location_id || '',
      appointment_type_id: activePatient?.appointment_type_id || '',
      appointment_length_id: activePatient?.appointment_length_id || '',
      provider_id: activePatient?.provider_id || '',
      referrer_id: activePatient?.referrer_id || '',
      billing_note: activePatient?.billing_note || '',
      chief_complaint: activePatient?.chief_complaint || '',
      appointment_note: activePatient?.appointment_note || ''
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        const formValues = values;
        formValues.appointment_date = moment.utc(values.appointment_date).format('YYYY-MM-DD');
        formValues.appointment_time = moment.utc(values.appointment_time).format('h:mm a');
        if (!editCall) {
          await AddAppointment(formValues).then((res) => {
            if (res.success) {
              SnacbarViewer(res?.message, 'success');
              onClose();
              resetForm();
            } else {
              SnacbarViewer(res?.message, 'error');
            }
            setSubmitting(false);
          });
        } else {
          await UpdateAppointment(formValues, activePatient.id).then((res) => {
            if (res.success) {
              SnacbarViewer(res?.message, 'success');
              onClose();
              resetForm();
            } else {
              SnacbarViewer(res?.message, 'error');
            }
            setSubmitting(false);
          });
        }
      } catch (error) {
        setErrors({ afterSubmit: error.message });
        setSubmitting(false);
      }
    }
  });
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values, setFieldValue } =
    formik;
  console.log(values);

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack mt={1} fullWidth spacing={3}>
            {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}
            <Stack mt={1} direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={0}>
              <FormControl
                {...getFieldProps('patient_id')}
                error={Boolean(touched.patient_id && errors.patient_id)}
                helperText={touched.patient_id && errors.patient_id}
                fullWidth
              >
                <InputLabel id="patientLabel">Patient*</InputLabel>
                <Select
                  id="patientLabel"
                  label="Patient"
                  labelId="patientLabel"
                  size="small"
                  onChange={(event) => {
                    setFieldValue('patient_id', event.target.value);
                  }}
                  value={values.patient_id}
                  disabled={isSubmitting}
                >
                  <ListSubheader>
                    <TextField
                      size="small"
                      autoFocus
                      placeholder="Type to search..."
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        )
                      }}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key !== 'Escape') {
                          e.stopPropagation();
                        }
                      }}
                    />
                  </ListSubheader>
                  {data
                    .filter((o) =>
                      ['firstName'].some((k) => {
                        if (k === 'firstName') {
                          const check = o.middle_name
                            ? `${String(o[k])} ${String(o.middle_name)} ${String(o.last_name)}`
                            : `${String(o[k])} ${String(o.last_name)}`;
                          return check.toLowerCase().includes(searchText.toLowerCase());
                        }
                        return null;
                      })
                    )
                    .map((d, i) => (
                      <MenuItem key={i} value={d.patient_id}>
                        {d.middleName
                          ? `${d.first_name} ${d.middle_name} ${d.last_name}`
                          : `${d.first_name} ${d.last_name}`}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <Button
                component={RouterLink}
                to="/dashboard/registration"
                size="small"
                variant="contained"
                sx={{ minWidth: 'fit-content' }}
              >
                Add Patient
              </Button>
            </Stack>
            <Stack mt={1} direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={0}>
              <DatePicker
                label="Appointment date"
                onChange={(date) => setFieldValue('appointment_date', date)}
                value={values.appointment_date || new Date()}
                renderInput={(params) => (
                  <TextField
                    {...getFieldProps('appointment_date')}
                    error={Boolean(touched.appointment_date && errors.appointment_date)}
                    helperText={touched.appointment_date && errors.appointment_date}
                    {...params}
                    sx={{ width: '32%' }}
                    size="small"
                  />
                )}
                inputFormat="yyyy/MM/dd"
              />
              <TimePicker
                label="Appointment time"
                value={values.appointment_time}
                onChange={(newValue) => {
                  setFieldValue('appointment_time', newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...getFieldProps('appointment_time')}
                    error={Boolean(touched.appointment_time && errors.appointment_time)}
                    helperText={touched.appointment_time && errors.appointment_time}
                    size="small"
                    sx={{ width: '32%' }}
                    {...params}
                  />
                )}
              />
            </Stack>
            <Stack mt={1} direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={0}>
              <FormControl
                style={{
                  borderRadius: 10,
                  padding: '0px 10px',
                  background: '#ebeaea',
                  width: '100% '
                }}
                error={Boolean(touched.location_id && errors.location_id)}
                helperText={touched.location_id && errors.location_id}
              >
                <FormLabel id="locationradio">Location</FormLabel>
                <RadioGroup
                  labelId="locationradio"
                  aria-labelledby="locationradio"
                  row
                  {...getFieldProps('location_id')}
                >
                  {allLocations.map((location, idx) => (
                    <FormControlLabel
                      key={idx}
                      sx={{ mr: 3 }}
                      value={location.id}
                      onChange={(e) => setFieldValue('location_id', parseInt(e.target.value, 10))}
                      control={
                        <Radio
                          checked={parseInt(values.location_id, 10) === location.id}
                          size="small"
                        />
                      }
                      label={location.location_name}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Stack>
            <Stack mt={1} direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={0}>
              <FormControl
                style={{
                  borderRadius: 10,
                  padding: '0px 10px',
                  background: '#ebeaea',
                  width: '100% '
                }}
                error={Boolean(touched.appointment_type_id && errors.appointment_type_id)}
                helperText={touched.appointment_type_id && errors.appointment_type_id}
              >
                <FormLabel id="appointment">Appointment type</FormLabel>
                <RadioGroup
                  labelId="appointment"
                  aria-labelledby="appointment"
                  row
                  {...getFieldProps('appointment_type_id')}
                >
                  {allAppointmentTypes.map((apptype, idx) => (
                    <FormControlLabel
                      key={idx}
                      sx={{ mr: 3 }}
                      value={apptype?.appointment_type_id}
                      onChange={(e) => setFieldValue('appointment_type_id', Number(e.target.value))}
                      control={
                        <Radio
                          checked={
                            parseInt(values.appointment_type_id, 10) ===
                            apptype?.appointment_type_id
                          }
                          size="small"
                        />
                      }
                      label={apptype?.appointment_type}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Stack>
            <Stack mt={1} direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={0}>
              <FormControl
                style={{
                  borderRadius: 10,
                  padding: '0px 10px',
                  background: '#ebeaea',
                  width: '100% '
                }}
                error={Boolean(touched.appointment_length_id && errors.appointment_length_id)}
                helperText={touched.appointment_length_id && errors.appointment_length_id}
              >
                <FormLabel id="length">Appointment length</FormLabel>
                <RadioGroup
                  labelId="length"
                  aria-labelledby="length"
                  row
                  {...getFieldProps('appointment_length_id')}
                >
                  {allAppointmentLengths.map((appLength, idx) => (
                    <FormControlLabel
                      key={idx}
                      sx={{ mr: 3 }}
                      value={appLength.appointment_length_id}
                      onChange={(e) =>
                        setFieldValue('appointment_length_id', Number(e.target.value))
                      }
                      control={
                        <Radio
                          checked={
                            parseInt(values.appointment_length_id, 10) ===
                            appLength?.appointment_length_id
                          }
                          size="small"
                        />
                      }
                      label={appLength.appointment_length}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Stack>
            <Stack mt={1} direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={0}>
              <FormControl
                style={{
                  borderRadius: 10,
                  padding: '0px 10px',
                  background: '#ebeaea',
                  width: '100% '
                }}
                error={Boolean(touched.provider_id && errors.provider_id)}
                helperText={touched.provider_id && errors.provider_id}
              >
                <FormLabel id="providers">Provider</FormLabel>
                <RadioGroup
                  labelId="providers"
                  aria-labelledby="providers"
                  row
                  {...getFieldProps('provider_id')}
                  error={Boolean(touched.provider_id && errors.provider_id)}
                  helperText={touched.provider_id && errors.provider_id}
                >
                  {allProviders.map((provider, idx) => (
                    <FormControlLabel
                      key={idx}
                      sx={{ mr: 3 }}
                      value={provider.id}
                      onChange={(e) => setFieldValue('provider_id', Number(e.target.value))}
                      control={
                        <Radio
                          checked={parseInt(values.provider_id, 10) === provider.id}
                          size="small"
                        />
                      }
                      label={provider.first_name}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Stack>
            <Stack mt={1} mb={0}>
              <TextField
                fullWidth
                size="small"
                maxRows="Infinity"
                multiline
                {...getFieldProps('chief_complaint')}
                type="text"
                label="Chief complaint"
                disabled={isSubmitting}
                error={Boolean(touched.chief_complaint && errors.chief_complaint)}
                helperText={touched.chief_complaint && errors.chief_complaint}
              />
            </Stack>
            <Stack mt={1} direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Typography variant="h6" gutterBottom>
                # of previous visits
              </Typography>
              <Button size="small" variant="contained" sx={{ minWidth: 'fit-content' }}>
                View visit history
              </Button>
            </Stack>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems="center"
              justifyContent="space-between"
              mt={1}
              spacing={2}
            >
              <FormControl
                {...getFieldProps('referrer_id')}
                error={Boolean(touched.referrer_id && errors.referrer_id)}
                helperText={touched.referrer_id && errors.referrer_id}
                fullWidth
              >
                <InputLabel id="reffered">Reffered by</InputLabel>
                <Select
                  id="reffered"
                  label="reffered"
                  labelId="reffered"
                  size="small"
                  onChange={(event) => {
                    setFieldValue('referrer_id', event.target.value);
                  }}
                  value={values.referrer_id}
                  disabled={isSubmitting}
                >
                  <ListSubheader>
                    <TextField
                      size="small"
                      autoFocus
                      placeholder="Type to search..."
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        )
                      }}
                      onChange={(e) => setSearchProvider(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key !== 'Escape') {
                          e.stopPropagation();
                        }
                      }}
                    />
                  </ListSubheader>
                  {referrers.map((referrer, i) => (
                    <MenuItem key={i} value={referrer.id}>
                      {referrer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button size="small" variant="contained" sx={{ minWidth: 'fit-content' }}>
                Add new referring MD
              </Button>
            </Stack>
            <Stack mt={1}>
              <TextField
                fullWidth
                size="small"
                maxRows="Infinity"
                multiline
                {...getFieldProps('appointment_note')}
                value={values.appointment_note}
                type="text"
                label="Appointment note"
                disabled={isSubmitting}
                error={Boolean(touched.appointment_note && errors.appointment_note)}
                helperText={touched.appointment_note && errors.appointment_note}
              />
            </Stack>
            <Stack mt={1}>
              <TextField
                fullWidth
                size="small"
                maxRows="Infinity"
                multiline
                {...getFieldProps('billing_note')}
                type="text"
                label="Billing note"
                disabled={isSubmitting}
                error={Boolean(touched.billing_note && errors.billing_note)}
                helperText={touched.billing_note && errors.billing_note}
              />
            </Stack>
            <LoadingButton
              fullWidth
              size="small"
              onClick={handleSubmit}
              variant="contained"
              loading={isSubmitting}
            >
              Book appointment
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
    </>
  );
};

AppointmentForm.propTypes = {
  searchProvider: PropTypes.any,
  allLocations: PropTypes.array,
  allProviders: PropTypes.array,
  allAppointmentLengths: PropTypes.array,
  allAppointmentTypes: PropTypes.array,
  activePatient: PropTypes.object,
  SnacbarViewer: PropTypes.any,
  onClose: PropTypes.func
};
export default AppointmentForm;
