import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
// material
import {
  Stack,
  RadioGroup,
  Radio,
  FormControlLabel,
  Box,
  Typography,
  Grid,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@material-ui/core';
import { Affix } from 'antd';
import { StaticDatePicker } from '@material-ui/lab';
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

const AvailableAppointmentForm = ({ handleSubmit }) => {
  const [data, setData] = useState([]);
  const currentDate = new Date();

  const initialValues = {
    start_date: currentDate,
    end_date: currentDate,
    calendar: currentDate,
    day: 'monday',
    week: '',
    month: '',
    year: '',
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
  const renderDaysTab = (values, touched, errors, setFieldValue) => (
    <Box className="days-tab" component="div">
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={0}>
        <FormControl
          style={{
            borderRadius: 10,
            padding: '10px 20px',
            background: 'white',
            width: '100% '
          }}
        >
          <RadioGroup labelId="locationradio" aria-labelledby="locationradio" row name="location">
            <Grid container justifyContent="center">
              <Grid xs={6}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((key, id) => (
                  <FormControlLabel
                    key={id}
                    sx={{
                      backgroundColor: 'white',
                      border: '1px solid #9B9B9B',
                      borderRadius: '8px',
                      padding: '5px 15px',
                      width: '90px',
                      margin: '5px'
                    }}
                    checked={values.day === key}
                    onChange={() => setFieldValue('day', key)}
                    control={<Radio size="small" sx={{ padding: '5px' }} />}
                    label={key}
                  />
                ))}
              </Grid>
              <Grid xs={2} alignSelf="center">
                <FormControlLabel
                  key={13}
                  sx={{
                    backgroundColor: 'white',
                    border: '1px solid #9B9B9B',
                    borderRadius: '8px',
                    padding: '5px 15px',
                    width: '120px',
                    margin: '5px'
                  }}
                  checked={values.week === 'week'}
                  onChange={() => setFieldValue('week', 'week')}
                  control={<Radio size="small" sx={{ padding: '5px' }} />}
                  label="Weeks"
                />
                <FormControlLabel
                  key={14}
                  sx={{
                    backgroundColor: 'white',
                    border: '1px solid #9B9B9B',
                    borderRadius: '8px',
                    padding: '5px 15px',
                    width: '120px',
                    margin: '5px'
                  }}
                  checked={values.month === 'month'}
                  onChange={() => setFieldValue('month', 'month')}
                  control={<Radio size="small" sx={{ padding: '5px' }} />}
                  label="Months"
                />
                <FormControlLabel
                  key={15}
                  sx={{
                    backgroundColor: 'white',
                    border: '1px solid #9B9B9B',
                    borderRadius: '8px',
                    padding: '5px 15px',
                    width: '120px',
                    margin: '5px'
                  }}
                  checked={values.year === 'year'}
                  onChange={() => setFieldValue('year', 'year')}
                  control={<Radio size="small" sx={{ padding: '5px' }} />}
                  label="Year(s)"
                />
              </Grid>
            </Grid>
          </RadioGroup>
        </FormControl>
      </Stack>
    </Box>
  );
  const [openAlert, setOpenAlert] = useState(false);

  const handleClickOpenAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
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
              <Grid xs={6}>
                <Typography variant="h5" component="h4" textAlign="center">
                  Approximate future date
                </Typography>
                <Box className="provider-names" component="div">
                  {renderDaysTab(values, touched, errors, setFieldValue)}
                </Box>
              </Grid>
              <Grid xs={6} justifyContent="center" container>
                <Affix style={{ marginRight: 10 }} offsetTop={60}>
                  <Dialog
                    open={openAlert}
                    onClose={handleCloseAlert}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        This Feature is in under construction
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseAlert} autoFocus>
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
                  <Box onClick={handleClickOpenAlert} sx={{ cursor: 'pointer' }}>
                    <img
                      width="300px"
                      height="80px"
                      src="/static/CalendarView.png"
                      alt="Calendar"
                    />
                  </Box>
                  <StaticDatePicker
                    displayStaticWrapperAs="desktop"
                    style={{ padding: 0 }}
                    name="calendar"
                    value={values.calendar}
                    onChange={(date) => setFieldValue('calendar', date)}
                    inputFormat="yyyy/MM/dd"
                  />
                </Affix>
              </Grid>
            </Grid>
            <Grid container>
              <Typography variant="h5" component="h4" textAlign="center">
                on Mon, Aug 21, 2020
              </Typography>
              <Grid xs={12}>
                {[
                  '9: 00',
                  '9: 15',
                  '9: 30',
                  '9: 45',
                  '10: 00',
                  '10: 15',
                  '10: 30',
                  '10: 45',
                  '11: 00',
                  '11: 15',
                  '11: 30',
                  '11: 45'
                ].map((key, id) => (
                  <FormControlLabel
                    key={id}
                    sx={{
                      backgroundColor: 'white',
                      border: '1px solid #9B9B9B',
                      borderRadius: '8px',
                      padding: '5px 10px',
                      width: '140px',
                      margin: '5px'
                    }}
                    checked={values.day === key}
                    onChange={() => setFieldValue('day', key)}
                    control={<Radio size="small" sx={{ padding: '0' }} />}
                    label={`${key} AM`}
                  />
                ))}
              </Grid>
              <Grid xs={12}>
                {[
                  '9: 00',
                  '9: 15',
                  '9: 30',
                  '9: 45',
                  '10: 00',
                  '10: 15',
                  '10: 30',
                  '10: 45',
                  '11: 00',
                  '11: 15',
                  '11: 30',
                  '11: 45'
                ].map((key, id) => (
                  <FormControlLabel
                    key={id}
                    sx={{
                      backgroundColor: 'white',
                      border: '1px solid #9B9B9B',
                      borderRadius: '8px',
                      padding: '5px 10px',
                      width: '140px',
                      margin: '5px'
                    }}
                    checked={values.day === key}
                    onChange={() => setFieldValue('day', key)}
                    control={<Radio size="small" sx={{ padding: '0' }} />}
                    label={`${key} AM`}
                  />
                ))}
              </Grid>
              <Typography variant="h5" component="h4" textAlign="center" mt={5}>
                Before date
              </Typography>
              <Grid xs={12}>
                {[
                  'Mon, 8/14 AM',
                  'Tue, 8/15 AM',
                  'Wed, 8/16 AM',
                  'Thu, 8/17 AM',
                  'Fri, 8/18 AM',
                  'Mon, 8/14 AM',
                  'Tue, 8/15 AM',
                  'Wed, 8/16 AM',
                  'Thu, 8/17 AM',
                  'Fri, 8/18 AM'
                ].map((key, id) => (
                  <FormControlLabel
                    key={id}
                    sx={{
                      backgroundColor: 'white',
                      border: '1px solid #9B9B9B',
                      borderRadius: '8px',
                      padding: '0px 10px',
                      width: '175px',
                      margin: '5px'
                    }}
                    checked={values.day === key}
                    onChange={() => setFieldValue('day', key)}
                    control={<Radio size="small" sx={{ padding: '0' }} />}
                    label={`${key} |2`}
                  />
                ))}
              </Grid>
              <Typography variant="h5" component="h4" textAlign="center" mt={5}>
                After date
              </Typography>
              <Grid xs={12}>
                {[
                  'Mon, 8/14 AM',
                  'Tue, 8/15 AM',
                  'Wed, 8/16 AM',
                  'Thu, 8/17 AM',
                  'Fri, 8/18 AM',
                  'Mon, 8/14 AM',
                  'Tue, 8/15 AM',
                  'Wed, 8/16 AM',
                  'Thu, 8/17 AM',
                  'Fri, 8/18 AM'
                ].map((key, id) => (
                  <FormControlLabel
                    key={id}
                    sx={{
                      backgroundColor: 'white',
                      border: '1px solid #9B9B9B',
                      borderRadius: '8px',
                      padding: '0px 10px',
                      width: '175px',
                      margin: '5px'
                    }}
                    checked={values.day === key}
                    onChange={() => setFieldValue('day', key)}
                    control={<Radio size="small" sx={{ padding: '0' }} />}
                    label={`${key} |3`}
                  />
                ))}
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
};

AvailableAppointmentForm.propTypes = {
  handleSubmit: PropTypes.any
};
export default AvailableAppointmentForm;
