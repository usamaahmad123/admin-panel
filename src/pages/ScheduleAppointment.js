import { useEffect, useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import moment from 'moment';
import Fade from '@mui/material/Fade';
import { useSnackbar } from 'notistack5';
import settingFilled from '@iconify/icons-ant-design/setting-filled';
// material
import {
  Stack,
  Container,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  DialogActions,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  Button,
  IconButton,
  Grid,
  Menu
} from '@material-ui/core';
import { StaticDatePicker } from '@material-ui/lab';
import { Affix } from 'antd';
import closeFill from '@iconify/icons-eva/close-fill';
import Page from '../components/Page';
import './StyleSheet.css';
import ProviderCalendarForm from '../components/ProviderCalendarForm/ProviderCalenderForm';
import AvailableAppointmentForm from '../components/AvailableAppointment/AvailableAppointmentForm';
import AppointmentForm from '../components/AppointmentForm';
import {
  GetLocations,
  GetProviders,
  GetPatientAppointment,
  GetAppointmentLengths,
  GetAppointmentTypes,
  getRegistredPatients
} from '../utils/Index';
import Patient from './Patient';

// ----------------------------------------------------------------------
const time = [
  '7:00',
  '7:15',
  '7:30',
  '7:45',
  '8:00',
  '8:15',
  '8:30',
  '8:45',
  '9:00',
  '9:15',
  '9:30',
  '9:45',
  '10:00',
  '10:15',
  '10:30',
  '10:45',
  '11:00',
  '11:15',
  '11:30',
  '11:45',
  '12:00',
  '12:15',
  '12:30',
  '12:45',
  '1:00',
  '1:15',
  '1:30',
  '1:45',
  '2:00',
  '2:15',
  '2:30',
  '2:45',
  '3:00',
  '3:15',
  '3:30',
  '3:45',
  '4:00',
  '4:15',
  '4:30',
  '4:45',
  '5:00',
  '5:15',
  '5:30',
  '5:45',
  '6:00',
  '6:15',
  '6:30',
  '6:45'
];
export default function ScheduleAppointment() {
  const top = 60;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [locations, setLocations] = useState('');
  const [data, setData] = useState([]);
  const [providers, setProviders] = useState('');
  const [filters, setFilters] = useState('');
  const [alignment, setAlignment] = useState('Day');
  const [open, setOpen] = useState(false);
  const scroll = 'paper';
  const [date, setDate] = useState(new Date());
  const [activePatient, setActivePatient] = useState(null);
  const [allProviders, setAllProviders] = useState([
    { id: '1', first_name: 'Domore' },
    { id: '2', first_name: 'Domore' },
    { id: '3', first_name: 'Domore' },
    { id: '4', first_name: 'Domore' }
  ]);
  const [allLocations, setAllLocations] = useState([
    { id: '1', location_name: 'Main Clinic' },
    { id: '2', location_name: 'Main Clinic' },
    { id: '3', location_name: 'Main Clinic' },
    { id: '4', location_name: 'Main Clinic' }
  ]);
  const [allAppointmentTypes, setAllAppointmentTypes] = useState([
    { appointment_type_id: '1', appointment_type: 'Multiple' },
    { appointment_type_id: '2', appointment_type: 'Multiple' },
    { appointment_type_id: '3', appointment_type: 'Multiple' },
    { appointment_type_id: '4', appointment_type: 'Multiple' }
  ]);
  const [allAppointmentLengths, setAllAppointmentLengths] = useState([
    { appointment_length_id: '1', appointment_length: '15' },
    { appointment_length_id: '2', appointment_length: '20' },
    { appointment_length_id: '3', appointment_length: '30' },
    { appointment_length_id: '4', appointment_length: '40' }
  ]);
  const [allPatientAppointments, setAllPatientAppointments] = useState([]);
  const [editCall, setEditCall] = useState(false);
  console.log(allPatientAppointments);
  useEffect(() => {
    GetProviders().then((res) => {
      if (res.success) {
        setAllProviders(res.data?.rows);
      }
    });
    GetLocations().then((res) => {
      if (res.success) {
        setAllLocations(res.data.rows);
      }
    });
    GetAppointmentLengths().then((res) => {
      if (res.success) {
        setAllAppointmentLengths(res.data.rows);
      }
    });
    GetAppointmentTypes().then((res) => {
      if (res.success) {
        setAllAppointmentTypes(res.data.rows);
      }
    });
    GetPatientAppointment().then((res) => {
      if (res.success) {
        setAllPatientAppointments(res.data);
      }
    });
    getRegistredPatients().then((res) => {
      if (res?.success) {
        setData(res?.data?.rows);
        // formik.setFieldValue('patient_id', res?.data[0] && res?.data[0]?.id);
      }
    });
  }, []);
  const [anchorEl, setAnchorEl] = useState(null);
  const openSetting = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSettingClose = () => {
    setAnchorEl(null);
  };

  const SnacbarViewer = (message, Variant) => {
    enqueueSnackbar(message, {
      variant: Variant,
      action: (key) => (
        <IconButton size="small" onClick={() => closeSnackbar(key)}>
          <Icon icon={closeFill} />
        </IconButton>
      )
    });
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const getPatientObj = (patientId) => {
    const patient = data?.find((p) => p.patient_id === patientId);
    return `${patient?.first_name} ${patient?.last_name}`;
  };
  const [isProviderCalendarTempOpen, setIsProviderCalendarTemplateOpen] = useState(false);
  const [isAvailableAppointmentOpen, setIsAvailableAppointmentOpen] = useState(false);
  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);
  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const addDays = (num) => setDate(moment(date).add('days', num));
  const addMonths = (num) => setDate(moment(date).add('months', num));
  const [openAlert, setOpenAlert] = useState(false);

  const handleClickOpenAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  return (
    <Page title="Image viewer">
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
      <Container sx={{ pl: 0 }} maxWidth="xl">
        <Stack
          sx={{ pl: 0 }}
          direction="row"
          alignItems="top"
          justifyContent="space-between"
          mt={2}
        >
          <Affix style={{ marginRight: 10 }} offsetTop={top}>
            <Box onClick={handleClickOpenAlert} sx={{ cursor: 'pointer' }}>
              <img width="300px" height="80px" src="/static/CalendarView.png" alt="Calendar" />
            </Box>
            <StaticDatePicker
              disablePast
              ToolbarComponent={() => <Box>HELLO, CUSTOM TOOL BAR</Box>}
              displayStaticWrapperAs="desktop"
              reduceAnimations
              onChange={(date) => setDate(date)}
              value={date}
              style={{ padding: 0 }}
              inputFormat="yyyy/MM/dd"
            />
          </Affix>
          <Box sx={{ width: '80%' }}>
            <div style={{ display: 'flex', direction: 'row' }}>
              <ToggleButtonGroup
                color="primary"
                value={alignment}
                exclusive
                size="small"
                sx={{ width: '40%' }}
                onChange={handleChange}
              >
                <ToggleButton value="Day">Day</ToggleButton>
                <ToggleButton value="Week">Week</ToggleButton>
                <ToggleButton value="Month">Month</ToggleButton>
              </ToggleButtonGroup>
              <span style={{ display: 'flex', direction: 'row', justifyContent: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  {moment(date).format('ll')}
                </Typography>
              </span>
            </div>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              <Grid container alignItems="center">
                <Grid xs={4}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      handleClickOpen();
                      setEditCall(false);
                    }}
                    sx={{ mr: 1 }}
                    startIcon={<Icon icon={plusFill} />}
                  >
                    New Appt
                  </Button>
                  <Button
                    onClick={() => setIsAvailableAppointmentOpen(true)}
                    variant="contained"
                    size="small"
                  >
                    Find Appts
                  </Button>
                </Grid>
                <Grid xs={4}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => addMonths(-1)}
                    sx={{ minWidth: '25px', marginRight: '5px' }}
                  >
                    -1m
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => addDays(-7)}
                    sx={{ minWidth: '25px', marginRight: '5px' }}
                  >
                    -1w
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => addDays(-1)}
                    sx={{ minWidth: '25px', marginRight: '10px' }}
                  >
                    -1d
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => addDays(1)}
                    sx={{ minWidth: '25px', marginRight: '5px' }}
                  >
                    +1d
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => addDays(7)}
                    sx={{ minWidth: '25px', marginRight: '5px' }}
                  >
                    +1w
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => addMonths(1)}
                    sx={{ minWidth: '25px', marginRight: '5px' }}
                  >
                    +1m
                  </Button>
                </Grid>
                <Grid xs={4}>
                  <Box
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center'
                    }}
                  >
                    <FormControl variant="standard" sx={{ minWidth: 90, mb: 1 }}>
                      <InputLabel id="demo-simple-select-standard-label">Locations</InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={locations}
                        onChange={(event) => setLocations(event.target.value)}
                        label="Age"
                        disableUnderline
                      >
                        {allLocations.map((location, idx) => (
                          <MenuItem key={idx} value={location.id}>
                            {location.location_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl variant="standard" sx={{ minWidth: 90, mb: 1 }}>
                      <InputLabel id="demo-simple-select-standard">Providers</InputLabel>
                      <Select
                        labelId="demo-simple-select-standard"
                        id="demo-simple-select-standard"
                        value={providers}
                        onChange={(event) => setProviders(event.target.value)}
                        label="Age"
                        disableUnderline
                      >
                        {allProviders.map((provide, idx) => (
                          <MenuItem key={idx} value={provide.id}>
                            {provide.first_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl variant="standard" sx={{ minWidth: 65, mb: 1 }}>
                      <InputLabel id="demo-simple-select">Filters</InputLabel>
                      <Select
                        labelId="demo-simple-select"
                        id="demo-simple-select-standard"
                        value={filters}
                        onChange={(event) => setFilters(event.target.value)}
                        label="Age"
                        disableUnderline
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                    <IconButton sx={{ py: 0, my: 0 }}>
                      <Icon
                        id="fade-button"
                        aria-controls={openSetting ? 'fade-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openSetting ? 'true' : undefined}
                        onClick={handleClick}
                        icon={settingFilled}
                        width={22}
                        height={22}
                      />
                      <Menu
                        id="fade-menu"
                        MenuListProps={{
                          'aria-labelledby': 'fade-button'
                        }}
                        anchorEl={anchorEl}
                        open={openSetting}
                        onClose={handleSettingClose}
                        TransitionComponent={Fade}
                      >
                        <MenuItem onClick={() => setIsProviderCalendarTemplateOpen(true)}>
                          Provider Template
                        </MenuItem>
                      </Menu>
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </Stack>
            <Stack mb={2}>
              <div style={{ display: 'flex' }}>
                {allProviders.map((provider, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      border: 1,
                      borderColor: '#8c8a82',
                      width: `${100 / allProviders.length}%`,
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography sx={{ mb: 0 }} variant="subtitle1" gutterBottom>
                      {`${provider.first_name} ${provider.middle_name}`}
                    </Typography>
                  </Box>
                ))}
              </div>
              <div style={{ display: 'flex' }}>
                {allProviders.map((provider, index) => (
                  <Stack key={index} sx={{ width: '100%' }} direction="column">
                    {time.map((option, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          columnGap: '100px',
                          borderRight: '1px solid #979797',
                          width: '100%',
                          borderBottom: '1px solid #8c8a82'
                        }}
                      >
                        <p style={{ marginBottom: 0, border: 'none' }}>
                          {index === 0 ? option : <>&nbsp;</>}
                        </p>
                        <Stack>
                          {allPatientAppointments.map(
                            (patient, idx) =>
                              `${option} am` === patient.appointment_time ||
                              (`${option} pm` === patient.appointment_time &&
                                provider.id === patient.provider_id && (
                                  <Box
                                    onClick={() => {
                                      setActivePatient(patient);
                                      setEditCall(true);
                                      handleClickOpen();
                                    }}
                                    key={idx}
                                    sx={{
                                      backgroundColor:
                                        patient.status === 'Scheduled' ? '#E5FADC' : '#FAE9D5',
                                      border: '1px solid #979797',
                                      marginBottom: '2px',
                                      lineHeight: '16px',
                                      minWidth: '280px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    {`${getPatientObj(patient.patient_id)} (${
                                      patient?.chief_complaint
                                    })`}
                                  </Box>
                                ))
                          )}
                        </Stack>
                      </div>
                    ))}
                  </Stack>
                ))}
              </div>
            </Stack>
          </Box>
        </Stack>
        <Dialog
          open={open}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">Book Appointment</DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              <AppointmentForm
                allLocations={allLocations}
                allProviders={allProviders}
                allAppointmentLengths={allAppointmentLengths}
                allAppointmentTypes={allAppointmentTypes}
                activePatient={editCall ? activePatient : {}}
                editCall={editCall}
                SnacbarViewer={SnacbarViewer}
                onClose={handleClose}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isProviderCalendarTempOpen}
          onClose={setIsProviderCalendarTemplateOpen}
          scroll={scroll}
          fullWidth
          maxWidth="xl"
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">Provider Calendar</DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
              p={5}
            >
              <ProviderCalendarForm />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsProviderCalendarTemplateOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isAvailableAppointmentOpen}
          onClose={setIsAvailableAppointmentOpen}
          scroll={scroll}
          fullWidth
          maxWidth="xl"
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">Find Available Appointments</DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
              p={2}
            >
              <AvailableAppointmentForm />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAvailableAppointmentOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Page>
  );
}
