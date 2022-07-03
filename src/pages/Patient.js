import { Icon } from '@iconify/react';
import { useEffect, useState, forwardRef, useRef } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { Link as Navigate } from 'react-router-dom';
import { useSnackbar } from 'notistack5';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  TextField,
  Modal,
  Box,
  MenuItem,
  Select,
  InputLabel,
  IconButton,
  InputAdornment,
  Tooltip
} from '@material-ui/core';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Snackbar from '@mui/material/Snackbar';
import searchOutlined from '@iconify/icons-ant-design/search-outlined';
import MuiFormControl from '@material-ui/core/FormControl';
import { LoadingButton, DatePicker } from '@material-ui/lab';
import CircularProgress from '@mui/material/CircularProgress';
import MuiAlert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import { withStyles } from '@material-ui/styles';
import closeFill from '@iconify/icons-eva/close-fill';
// components
import { AddPatient, getAdminPatients, UpdatePatient, uploadCsv } from '../utils/Index';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead } from '../components/_dashboard/user';
import { NameField } from '../utils/formatTime';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Patient id', alignRight: false },
  { id: 'name', label: 'Full name', alignRight: false },
  { id: 'phone', label: 'Phone number', alignRight: false },
  { id: 'date', label: 'Date of birth', alignRight: false },
  { id: 'address', label: 'Address', alignRight: false },
  { id: 'edit', label: 'Action', alignRight: false }
];

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
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4
};
const Alert = forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const phoneMessage =
  'This should be a cell phone number and not a landline number. Also, dashes are not allowed.';
export default function Patient() {
  const [page, setPage] = useState(0);

  const filterName = 'No users found.';
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [data, setData] = useState([]);
  const [add, setAdd] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [title, setTitle] = useState('Add');
  const msg = '';
  const [project, setProject] = useState('EMR');
  const status = 'message';
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(true);
  const [id, setId] = useState(null);
  const [phone, setPhone] = useState(false);
  const [query, setQuery] = useState('');
  const hiddenFileInput = useRef(null);
  const LoginSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    patientId: Yup.string()
      .min(5, "Patiend id shouldn't be less than 5 digits!")
      .max(5, "Patiend id shouldn't be more than 5 digits!")
      .required('Patient id is required'),
    dateOfBirth: Yup.string().required('Date of birth is required'),
    address: Yup.string().required('Patient address is required'),
    phoneNumber: Yup.string()
      .min(10, 'Too Short!')
      .max(11, 'Too Long!')
      .required('Phone Number is required and dashes are not allowed')
      .matches(phoneRegExp, 'Only numbers are required')
  });
  useEffect(() => {
    try {
      getUsersCall();
    } catch (error) {
      setSearch(false);
      SnacbarViewer(error?.message, 'error');
    }
  }, []);
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
  const getUsersCall = async () => {
    setSearch(true);
    setData([]);
    await getAdminPatients().then((res) => {
      if (res?.success) {
        setData(res?.data);
        SnacbarViewer(res?.message, 'success');
      } else {
        SnacbarViewer(res?.message, 'error');
      }
      setSearch(false);
    });
  };
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      middleName: '',
      dateOfBirth: '',
      project: 'EMR',
      address: '',
      patientId: ''
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        if (title === 'Add') {
          await AddPatient(values).then((res) => {
            if (res?.success) {
              SnacbarViewer(res?.message, 'success');
              setAdd(false);
              getUsersCall();
              resetForm();
            } else {
              SnacbarViewer(res?.message, 'error');
            }
          });
        } else {
          await UpdatePatient(values, id).then((res) => {
            if (res?.success) {
              SnacbarViewer(res?.message, 'success');
              setAdd(false);
              getUsersCall();
              resetForm();
            } else {
              SnacbarViewer(res?.message, 'error');
            }
          });
        }
      } catch (error) {
        setErrors({ afterSubmit: error.message });
        setSubmitting(false);
      }
    }
  });
  const {
    errors,
    touched,
    values,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    setFieldValue,
    resetForm
  } = formik;

  if (localStorage.getItem('Role') !== '2') {
    return <Navigate to="/dashboard/app" replace />;
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const searching = (event) => {
    setQuery(event.target.value);
  };
  const isUserNotFound = data.length === 0;
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const handleFileUpload = async (event) => {
    if (!event.target.files.length) {
      event.target.value = '';
      return;
    }
    const csvFile = event.target.files[0];
    if (
      csvFile.type === 'application/vnd.ms-excel' ||
      csvFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      if (csvFile.size / 1024 / 1024 < 2) {
        const data = await toBase64(event.target.files[0]);
        uploadCsv(data).then((res) => {
          if (!res?.success) {
            // setData(res?.message);
            SnacbarViewer(res?.message, 'error');
          } else {
            getUsersCall();
          }
          // SnacbarViewer(res?.message, 'error');
        });
      } else {
        SnacbarViewer('Csv file size should be less than 2 MBs.', 'error');
      }
    } else {
      event.target.value = '';
      SnacbarViewer('Only csv or xml files allowed.', 'error');
    }
  };
  return (
    <Page title="Patient">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Patients
          </Typography>
          <Tooltip title="Upload csv" placement="top" arrow>
            <IconButton disabled={search} onClick={() => hiddenFileInput.current.click()}>
              <input
                ref={hiddenFileInput}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                type="file"
                accept=".csv,.xlsx,.xls"
              />
              <UploadFileIcon fontSize="large" />
            </IconButton>
          </Tooltip>
          <Snackbar
            open={open}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            autoHideDuration={4000}
            onClose={handleClose}
          >
            <Alert onClose={handleClose} severity={status} sx={{ width: '100%' }}>
              {msg}
            </Alert>
          </Snackbar>
        </Stack>
        <Stack
          alignItems="center"
          justifyContent="space-between"
          sx={{ my: 2, marginBottom: 5 }}
          spacing={3}
          direction={{ xs: 'column', sm: 'row' }}
        >
          <FormControl fullWidth>
            <InputLabel id="project-label">Project*</InputLabel>
            <Select
              labelId="project-label"
              id="project-select"
              label="project"
              size="small"
              onChange={(event) => {
                setProject(event.target.value);
              }}
              value={project}
              disabled={search || localStorage.getItem('Role') !== '0'}
            >
              <MenuItem selected disabled>
                Choose Project
              </MenuItem>
              <MenuItem value="EMR">EMR</MenuItem>
            </Select>
          </FormControl>
          {/* <span style={{ direction: 'flex', justifyContent: 'space-between' }}> */}
          <TextField
            label="Search"
            type="search"
            size="small"
            fullWidth
            placeholder="Search by name, id, phone..."
            style={{ paddingRight: 10 }}
            onChange={searching}
            value={query}
            disabled={search}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Icon icon={searchOutlined} />
                </InputAdornment>
              )
            }}
          />
          <Button
            sx={{ minWidth: 'fit-content' }}
            variant="contained"
            onClick={() => {
              resetForm();
              setTitle('Add');
              setAdd(true);
            }}
            disabled={search}
            startIcon={<Icon icon={plusFill} />}
          >
            Add patient
          </Button>
          {/* </span> */}
        </Stack>

        <Modal
          open={add}
          onClose={() => {
            setAdd(false);
            resetForm();
            setId(null);
          }}
        >
          <Box sx={style}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h4" gutterBottom>
                {title} Patient
              </Typography>
              <Button
                onClick={() => {
                  setAdd(false);
                }}
              >
                <CloseIcon />
              </Button>
            </Stack>
            <Stack>
              <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                  {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}
                  {phone && <Alert severity="warning">{phoneMessage}</Alert>}
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ my: 2, marginBottom: 5 }}
                    spacing={3}
                  >
                    <TextField
                      fullWidth
                      type="text"
                      label="First name*"
                      size="small"
                      value={values.firstName}
                      onKeyDown={NameField}
                      disabled={isSubmitting}
                      {...getFieldProps('firstName')}
                      error={Boolean(touched.firstName && errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                    />
                    <TextField
                      fullWidth
                      type="text"
                      label="Middle name*"
                      size="small"
                      value={values.middleName}
                      disabled={isSubmitting}
                      onKeyDown={NameField}
                      {...getFieldProps('middleName')}
                      error={Boolean(touched.middleName && errors.middleName)}
                      helperText={touched.middleName && errors.middleName}
                    />
                    <TextField
                      fullWidth
                      type="text"
                      label="Last name*"
                      size="small"
                      value={values.lastName}
                      disabled={isSubmitting}
                      onKeyDown={NameField}
                      {...getFieldProps('lastName')}
                      error={Boolean(touched.lastName && errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                    />
                  </Stack>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ my: 2, marginBottom: 5 }}
                    spacing={3}
                  >
                    <TextField
                      fullWidth
                      type="text"
                      label="Patient id"
                      size="small"
                      required
                      value={values.patientId}
                      disabled={isSubmitting || title === 'Edit'}
                      {...getFieldProps('patientId')}
                      error={Boolean(touched.patientId && errors.patientId)}
                      helperText={touched.patientId && errors.patientId}
                    />

                    <TextField
                      fullWidth
                      label="Phone number*"
                      type="number"
                      size="small"
                      onFocus={() => setPhone(true)}
                      onBlurCapture={() => setPhone(false)}
                      disabled={isSubmitting}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">+</InputAdornment>
                      }}
                      {...getFieldProps('phoneNumber')}
                      error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                      helperText={touched.phoneNumber && errors.phoneNumber}
                    />
                    <DatePicker
                      label="Date of birth"
                      {...getFieldProps('dateOfBirth')}
                      onChange={(date) => setFieldValue('dateOfBirth', date)}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          {...params}
                          size="small"
                          error={Boolean(touched.dateOfBirth && errors.dateOfBirth)}
                        />
                      )}
                      disableFuture
                      disabled={isSubmitting}
                      inputFormat="MM/dd/yyyy"
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ my: 2, marginBottom: 5 }}
                    spacing={3}
                  >
                    <TextField
                      fullWidth
                      type="text"
                      label="Address"
                      size="small"
                      required
                      multiline
                      rows={3}
                      disabled={isSubmitting}
                      {...getFieldProps('address')}
                      error={Boolean(touched.address && errors.address)}
                      helperText={touched.address && errors.address}
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ my: 2, marginBottom: 5 }}
                    spacing={3}
                  >
                    {/* <FormControl
                      {...getFieldProps('project')}
                      error={Boolean(touched.project && errors.project)}
                      helperText={touched.project && errors.project}
                      fullWidth
                    >
                      <InputLabel id="industry-label">Project</InputLabel>
                      <Select
                        labelId="industry-label"
                        value={values.project}
                        label="project"
                        name="project"
                        id="project"
                        size="small"
                        onChange={formik.handleChange}
                        disabled={isSubmitting}
                      >
                        <MenuItem selected disabled>
                          Select project
                        </MenuItem>
                        <MenuItem value="EMR">EMR</MenuItem>
                      </Select>
                    </FormControl> */}
                  </Stack>
                  <Stack
                    direction="row-reverse"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ my: 2, marginBottom: 5 }}
                    spacing={3}
                  >
                    <LoadingButton
                      fullWidth
                      size="small"
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
                    >
                      Save
                    </LoadingButton>
                  </Stack>
                </Form>
              </FormikProvider>
            </Stack>
          </Box>
        </Modal>

        <Card>
          <Scrollbar>
            <TableContainer>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} rowCount={data.length} />
                <TableBody>
                  {data
                    .filter((o) =>
                      Object.keys(o).some((k) => {
                        if (k === 'firstName') {
                          if (o.middleName) {
                            const check = `${String(o[k])} ${String(o.middleName)} ${String(
                              o.lastName
                            )}`;
                            return check.toLowerCase().includes(query.toLowerCase());
                          }
                          const check = `${String(o[k])} ${String(o.lastName)}`;
                          return check.toLowerCase().includes(query.toLowerCase());
                        }
                        return String(o[k]).toLowerCase().includes(query.toLowerCase());
                      })
                    )
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const {
                        dateOfBirth,
                        address,
                        firstName,
                        lastName,
                        middleName,
                        patientId,
                        phoneNumber
                      } = row;
                      // const isItemSelected = selected.indexOf(name) !== -1;

                      return (
                        <TableRow key={index} tabIndex={-1}>
                          <TableCell padding="checkbox" />
                          <TableCell align="center">{patientId}</TableCell>
                          <TableCell align="center">
                            {middleName
                              ? `${firstName} ${middleName} ${lastName}`
                              : `${firstName} ${lastName}`}
                          </TableCell>
                          <TableCell align="center">{phoneNumber}</TableCell>
                          <TableCell align="center">{dateOfBirth}</TableCell>
                          <Tooltip placement="top" arrow title={address}>
                            <TableCell align="center">
                              {address.length > 30 ? `${address.substr(0, 27)}...` : address}
                            </TableCell>
                          </Tooltip>
                          <TableCell align="center">
                            <Button
                              disabled={isSubmitting}
                              onClick={() => {
                                setTitle('Edit');
                                setAdd(true);
                                resetForm();
                                setId(patientId);
                                setFieldValue('firstName', firstName);
                                setFieldValue('lastName', lastName);
                                setFieldValue('middleName', middleName);
                                setFieldValue('address', address);
                                setFieldValue('dateOfBirth', dateOfBirth);
                                setFieldValue('patientId', patientId);
                                setFieldValue('phoneNumber', phoneNumber.replace(/[^0-9]/g, ''));
                              }}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {search > 0 && (
                    <TableRow style={{ height: 53 }}>
                      <TableCell align="center" colSpan={6}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && !search && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={
              data.filter((o) =>
                Object.keys(o).some((k) => {
                  if (k === 'firstName') {
                    if (o.middleName) {
                      const check = `${String(o[k])} ${String(o.middleName)} ${String(o.lastName)}`;
                      return check.toLowerCase().includes(query.toLowerCase());
                    }
                    const check = `${String(o[k])} ${String(o.lastName)}`;
                    return check.toLowerCase().includes(query.toLowerCase());
                  }
                  return String(o[k]).toLowerCase().includes(query.toLowerCase());
                })
              ).length
            }
            labelRowsPerPage="Patients per page:"
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
