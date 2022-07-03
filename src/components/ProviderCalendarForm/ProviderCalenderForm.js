import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
// material
import {
  Stack,
  TextField,
  Button,
  RadioGroup,
  Radio,
  FormLabel,
  FormControlLabel,
  Box,
  Typography,
  Grid
} from '@material-ui/core';
import { TimePicker, DatePicker } from '@material-ui/lab';
import MuiFormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/styles';
import { getAdminPatients } from '../../utils/Index';
import './style.css';

// ----------------------------------------------------------------------
const FormControl = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      fontSize: 14
    },
    '& .MuiInputLabel-root': {
      fontSize: 15,
      lineHeight: 2,
      marginTop: -3
    },
    '& .MuiInputBase-input': {
      paddingTop: 9,
      paddingBottom: 10
    }
  }
})(MuiFormControl);
const ProviderCalenderForm = ({ handleSubmit }) => {
  const [data, setData] = useState([]);
  const currentDate = new Date();

  const initialValues = {
    start_date: currentDate,
    end_date: currentDate,
    day: 'monday',
    start_time: currentDate,
    end_time: currentDate
  };
  useEffect(() => {
    getAdminPatients().then((res) => {
      if (res?.success) {
        setData(res?.data);
      }
    });
  }, []);
  const validationSchema = Yup.object().shape({
    appointment: Yup.string().required('Appointment type is required'),
    location: Yup.string().required('Location is required'),
    date: Yup.string().required('Appointment date is required'),
    patientId: Yup.string().required('Patient is required'),
    time: Yup.string().required('Appointment time is required'),
    length: Yup.string().required('Appointment length is required'),
    providers: Yup.string().required('Provider is required'),
    reffered: Yup.string().required('Reffered by is required')
  });

  const renderDateTrack = (values, touched, errors, setFieldValue) => (
    <Grid container spacing={0} alignItems="center" justifyContent="center">
      <Box component="div" sx={{ display: 'flex' }}>
        <Grid xs={6}>
          <DatePicker
            label="Start date"
            onChange={(date) => setFieldValue('start_date', date)}
            value={values.start_date}
            renderInput={(params) => (
              <TextField
                name="start_date"
                error={Boolean(touched?.date && errors?.date)}
                helperText={touched?.date && errors?.date}
                {...params}
                sx={{ width: '90%' }}
                size="small"
              />
            )}
            inputFormat="yyyy/MM/dd"
          />
        </Grid>
        <Grid xs={6}>
          <DatePicker
            label="End date"
            onChange={(date) => setFieldValue('end_date', date)}
            value={values.end_date}
            renderInput={(params) => (
              <TextField
                name="end_date"
                error={Boolean(touched?.date && errors?.date)}
                helperText={touched?.date && errors?.date}
                {...params}
                sx={{ width: '90%' }}
                size="small"
              />
            )}
            inputFormat="yyyy/MM/dd"
          />
        </Grid>
      </Box>
    </Grid>
  );
  const renderTimeTrack = (values, touched, errors, setFieldValue) => (
    <Grid container spacing={0} alignItems="center" justifyContent="center">
      <Box component="div" sx={{ display: 'flex' }}>
        <Grid xs={6}>
          <TimePicker
            label="Start time"
            value={values?.start_time}
            onChange={(time) => {
              setFieldValue('start_time', time);
            }}
            renderInput={(params) => (
              <TextField
                name="start_time"
                error={Boolean(touched?.time && errors?.time)}
                helperText={touched?.time && errors.time}
                size="small"
                sx={{ width: '90%' }}
                {...params}
              />
            )}
          />
        </Grid>
        <Grid xs={6}>
          <TimePicker
            label="End time"
            value={values?.end_time}
            onChange={(time) => {
              setFieldValue('end_time', time);
            }}
            renderInput={(params) => (
              <TextField
                name="end_time"
                error={Boolean(touched?.time && errors?.time)}
                helperText={touched?.time && errors?.time}
                size="small"
                sx={{ width: '90%' }}
                {...params}
              />
            )}
          />
        </Grid>
      </Box>
    </Grid>
  );
  const renderLocationTabs = (values, touched, errors, setFieldValue) => (
    <Box className="location-tab" component="div">
      <h4>Location #1</h4>
      {renderTimeTrack(values, touched, errors, setFieldValue)}
    </Box>
  );
  const renderDaysTab = (values, touched, errors, setFieldValue) => (
    <Box className="days-tab" component="div">
      <Stack mt={1} direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={0}>
        <FormControl
          style={{
            borderRadius: 10,
            padding: '10px 20px',
            background: '#ebeaea',
            width: '100% '
          }}
        >
          <FormLabel id="locationradio">Select Days</FormLabel>
          <RadioGroup labelId="locationradio" aria-labelledby="locationradio" row name="location">
            <FormControlLabel
              key={0}
              sx={{
                backgroundColor: 'white',
                border: '1px solid #9B9B9B',
                borderRadius: '3px',
                padding: '5px 12px'
              }}
              checked={values.day === 'monday'}
              onChange={() => setFieldValue('day', 'monday')}
              control={<Radio size="small" sx={{ padding: '0' }} />}
              label="Mo"
            />
            <FormControlLabel
              key={1}
              sx={{
                backgroundColor: 'white',
                border: '1px solid #9B9B9B',
                borderRadius: '3px',
                padding: '5px 12px'
              }}
              checked={values.day === 'tuesday'}
              onChange={() => setFieldValue('day', 'tuesday')}
              control={<Radio size="small" sx={{ padding: '0' }} />}
              label="Tu"
            />
            <FormControlLabel
              key={2}
              sx={{
                backgroundColor: 'white',
                border: '1px solid #9B9B9B',
                borderRadius: '3px',
                padding: '5px 12px'
              }}
              checked={values.day === 'wednesday'}
              onChange={() => setFieldValue('day', 'wednesday')}
              control={<Radio size="small" sx={{ padding: '0' }} />}
              label="We"
            />
            <FormControlLabel
              key={3}
              sx={{
                backgroundColor: 'white',
                border: '1px solid #9B9B9B',
                borderRadius: '3px',
                padding: '5px 12px'
              }}
              checked={values.day === 'thursday'}
              onChange={() => setFieldValue('day', 'thursday')}
              control={<Radio size="small" sx={{ padding: '0' }} />}
              label="Th"
            />
            <FormControlLabel
              key={4}
              sx={{
                backgroundColor: 'white',
                border: '1px solid #9B9B9B',
                borderRadius: '3px',
                padding: '5px 12px'
              }}
              checked={values.day === 'friday'}
              onChange={() => setFieldValue('day', 'friday')}
              control={<Radio size="small" sx={{ padding: '0' }} />}
              label="Fr"
            />

            <FormControlLabel
              key={5}
              sx={{
                backgroundColor: 'white',
                border: '1px solid #9B9B9B',
                borderRadius: '3px',
                padding: '5px 12px'
              }}
              checked={values.day === 'saturday'}
              onChange={() => setFieldValue('day', 'saturday')}
              control={<Radio size="small" sx={{ padding: '0' }} />}
              label="Sa"
            />
            <FormControlLabel
              key={6}
              sx={{
                backgroundColor: 'white',
                border: '1px solid #9B9B9B',
                borderRadius: '3px',
                padding: '5px 12px'
              }}
              checked={values.day === 'sunday'}
              onChange={() => setFieldValue('day', 'sunday')}
              control={<Radio size="small" sx={{ padding: '0' }} />}
              label="Su"
            />
          </RadioGroup>
        </FormControl>
      </Stack>
    </Box>
  );
  const renderBreakTime = () => (
    <Box className="break-time" component="div">
      {renderTimeTrack()}
    </Box>
  );
  const LocationGrid = (values, touched, errors, setFieldValue) => (
    <>
      <Grid xs={3}>{renderLocationTabs(values, touched, errors, setFieldValue)}</Grid>
      <Grid xs={6}>{renderDaysTab(values, touched, errors, setFieldValue)}</Grid>
      <Grid xs={3}>{renderBreakTime(values, touched, errors, setFieldValue)}</Grid>
    </>
  );
  const [locationList, setLocationList] = useState([]);
  const onAddBtnClick = (values, touched, errors, setFieldValue) => {
    setLocationList(
      locationList.concat(<>{LocationGrid(values, touched, errors, setFieldValue)}</>)
    );
  };

  return (
    <>
      <Formik
        onSubmit={handleSubmit}
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({ touched, errors, values, setFieldValue }) => (
          <Form onChange={() => {}}>
            <Grid container>
              <Grid xs={2}>
                <Typography variant="h5" component="h4" textAlign="center">
                  Provider
                </Typography>
                <Box className="provider-names" component="div">
                  <h4>Dr. Maruthur #1</h4>
                  <p>Provider</p>
                  <p>Provider</p>
                </Box>
              </Grid>
              <Grid xs={10} container>
                <Grid xs={12} container>
                  <Grid xs={3}>
                    <Typography variant="h5" component="h4" textAlign="center">
                      Work Hours
                    </Typography>
                  </Grid>
                  <Grid xs={6}>
                    <Typography variant="h5" component="h4" textAlign="center">
                      Days of Week
                    </Typography>
                  </Grid>
                  <Grid xs={3}>
                    <Typography variant="h5" component="h4" textAlign="center">
                      Lunch/Blockedoff
                    </Typography>
                  </Grid>
                </Grid>
                <Grid xs={12} container>
                  <>
                    <Grid xs={3}>{renderLocationTabs(values, touched, errors, setFieldValue)}</Grid>
                    <Grid xs={6}>{renderDaysTab(values, touched, errors, setFieldValue)}</Grid>
                    <Grid xs={3}>{renderBreakTime(values, touched, errors, setFieldValue)}</Grid>
                  </>
                  {locationList}
                  <Button
                    onClick={() => onAddBtnClick(values, touched, errors, setFieldValue)}
                    variant="outlined"
                  >
                    + add Location
                  </Button>
                </Grid>
                <Typography mt={5} variant="h5" component="h4" textAlign="center">
                  Vacations
                </Typography>
                <Grid xs={12} container>
                  <Grid xs={2}>
                    <Typography mt={5} variant="p" component="h4" textAlign="left">
                      <strong>Vacation #1</strong>
                    </Typography>
                  </Grid>
                  <Grid xs={4}>
                    <Box className="vacation-tab" component="div">
                      {renderDateTrack(values, touched, errors, setFieldValue)}
                    </Box>
                  </Grid>
                  <Grid xs={2}>
                    <Typography mt={5} variant="p" component="h4" textAlign="center">
                      <strong># of days</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
};

ProviderCalenderForm.propTypes = {
  handleSubmit: PropTypes.any
};
export default ProviderCalenderForm;
