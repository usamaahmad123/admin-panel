import { Icon } from '@iconify/react';
import * as Yup from 'yup';
import { useState, forwardRef } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
import * as React from 'react';
import { withStyles } from '@material-ui/styles';
import uuid from 'react-uuid';
import { Link as Navigate } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  Button,
  Modal,
  TextField,
  Box
} from '@material-ui/core';
import MuiFormControl from '@material-ui/core/FormControl';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@material-ui/lab';
import CircularProgress from '@mui/material/CircularProgress';
import MuiAlert from '@mui/material/Alert';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead } from '../components/_dashboard/user';
import { getSignUpFields, updateSignupForm } from '../utils/Index';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'type', label: 'Type', alignRight: false },
  { id: 'name', label: 'Field Name', alignRight: false },
  { id: 'project', label: 'Project', alignRight: false },
  { id: 'included', label: 'Included', alignRight: false },
  { id: 'required', label: 'Required', alignRight: false }
];
// ----------------------------------------------------------------------
const FormControl = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      // height: 40,
      fontSize: 14
    },
    '& .MuiInputLabel-root': {
      fontSize: 15,
      lineHeight: 1,
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
export default function SignupSettings() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const msg = '';
  const notFound = '';
  const [search, setSearch] = React.useState(true);
  const [USERS, setUsers] = useState([]);
  const [project, setProject] = useState('EMR');
  const [show, setShow] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const SignUpSchema = Yup.object().shape({
    fieldLabel: Yup.string().required('Field label is required'),
    fieldName: Yup.string().required('Field Name is required').trim('Spaces not allowed'),
    type: Yup.string().required('Field type is required'),
    required: Yup.number().required('Field validation is required'),
    included: Yup.number().required('Field inclusion is required')
  });
  const formik = useFormik({
    initialValues: {
      required: 1,
      included: 1,
      type: 'text',
      fieldLabel: '',
      fieldName: ''
    },
    validationSchema: SignUpSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        await updateSignupForm(USERS).then((res) => {
          if (res.success) {
            enqueueSnackbar(res?.message, {
              variant: 'success',
              action: (key) => (
                <IconButton size="small" onClick={() => closeSnackbar(key)}>
                  <Icon icon={closeFill} />
                </IconButton>
              )
            });
            setSubmitting(false);
          }
        });
      } catch (err) {
        setSubmitting(false);
      }
    }
  });
  React.useEffect(() => {
    getSignUpFields(project).then((res) => {
      if (res.success) {
        setProject('EMR');
        setUsers(res?.data?.signup_fields);
      }
      setSearch(false);
    });
  }, [project]);
  if (localStorage.getItem('Role') === '1') {
    return <Navigate to="/dashboard/app" replace />;
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const action = (
    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  const isUserNotFound = USERS.length === 0;

  const {
    errors,
    touched,
    isSubmitting,
    values,
    resetForm,
    handleSubmit,
    getFieldProps,
    setSubmitting
  } = formik;

  return (
    <Page title="User">
      <Container loading={isSubmitting}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Signup form settings
          </Typography>
        </Stack>
        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={handleClose}
          message={msg}
          action={action}
        />
        <Stack
          alignItems="center"
          justifyContent="space-between"
          sx={{ my: 2, marginBottom: 5 }}
          spacing={3}
          direction={{ xs: 'column', sm: 'row' }}
        >
          <FormControl sx={{ width: '30%' }}>
            <InputLabel id="project-label">Project*</InputLabel>
            <Select
              labelId="project-label"
              id="project-select"
              label="project"
              size="small"
              onChange={(event) => {
                setSearch(true);
                setProject(event.target.value);
                getSignUpFields(event.target.value).then((res) => {
                  setUsers([]);
                  if (res.success) {
                    setUsers(res?.data?.signup_fields);
                  }
                  setSearch(false);
                });
              }}
              value={project}
              disabled={search || localStorage.getItem('Role') !== '0'}
            >
              <MenuItem selected disabled>
                Choose Project
              </MenuItem>
              <MenuItem value="EMR">EMR</MenuItem>
              {/* <MenuItem value="ARGOS">ARGOS</MenuItem> */}
            </Select>
          </FormControl>
          {/* <Button
            variant="contained"
            onClick={() => setShow(true)}
            startIcon={<Icon icon={plusFill} />}
          >
            Add field
          </Button> */}
        </Stack>
        <Modal
          open={show}
          onClose={() => {
            setShow(false);
            resetForm();
          }}
        >
          <Box sx={style}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h4" gutterBottom>
                Add field
              </Typography>
              <Button
                onClick={() => {
                  setShow(false);
                }}
              >
                <CloseIcon />
              </Button>
            </Stack>
            <Stack>
              <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                  {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}
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
                      label="Field name*"
                      size="small"
                      value={values.fieldName}
                      disabled={isSubmitting}
                      {...getFieldProps('fieldName')}
                      error={Boolean(touched.fieldName && errors.fieldName)}
                      helperText={touched.fieldName && errors.fieldName}
                    />

                    <TextField
                      fullWidth
                      type="text"
                      label="Field label"
                      size="small"
                      value={values.fieldLabel}
                      disabled={isSubmitting}
                      {...getFieldProps('fieldLabel')}
                      error={Boolean(touched.fieldLabel && errors.fieldLabel)}
                      helperText={touched.fieldLabel && errors.fieldLabel}
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ my: 2, marginBottom: 5 }}
                    spacing={3}
                  >
                    <FormControl
                      {...getFieldProps('type')}
                      error={Boolean(touched.type && errors.type)}
                      helperText={touched.type && errors.type}
                      fullWidth
                    >
                      <InputLabel id="industry-label">Select type</InputLabel>
                      <Select
                        labelId="industry-label"
                        value={values.type}
                        label="type"
                        name="type"
                        id="type"
                        size="small"
                        onChange={formik.handleChange}
                        disabled={isSubmitting}
                      >
                        <MenuItem selected disabled>
                          Select type
                        </MenuItem>
                        <MenuItem value="text">Text</MenuItem>
                        <MenuItem value="number">Number</MenuItem>
                        <MenuItem value="password">Password</MenuItem>
                        <MenuItem value="email">Email</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ my: 2, marginBottom: 5 }}
                    spacing={3}
                  >
                    <FormControl
                      {...getFieldProps('included')}
                      error={Boolean(touched.included && errors.included)}
                      helperText={touched.included && errors.included}
                      fullWidth
                    >
                      <InputLabel id="industry-label">Included</InputLabel>
                      <Select
                        labelId="industry-label"
                        value={values.included}
                        label="included"
                        name="included"
                        id="included"
                        size="small"
                        onChange={formik.handleChange}
                        disabled={isSubmitting}
                      >
                        <MenuItem selected disabled>
                          Included
                        </MenuItem>
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl
                      {...getFieldProps('required')}
                      error={Boolean(touched.required && errors.required)}
                      helperText={touched.required && errors.required}
                      fullWidth
                    >
                      <InputLabel id="industry-label">Required</InputLabel>
                      <Select
                        labelId="industry-label"
                        value={values.required}
                        label="required"
                        name="required"
                        id="required"
                        size="small"
                        onChange={formik.handleChange}
                        disabled={isSubmitting}
                      >
                        <MenuItem selected disabled>
                          Required
                        </MenuItem>
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                      </Select>
                    </FormControl>
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
                <UserListHead headLabel={TABLE_HEAD} rowCount={USERS.length} />
                <TableBody>
                  {USERS.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(
                    (row, index) => {
                      const { label, type } = row;
                      // const isItemSelected = selected.indexOf(name) !== -1;

                      return (
                        <TableRow hover key={uuid()}>
                          <TableCell padding="checkbox" />
                          <TableCell align="center">{type}</TableCell>
                          <TableCell align="center" component="th" scope="row" padding="none">
                            {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                            <Typography variant="subtitle2" noWrap>
                              {label}
                            </Typography>
                            {/* </Stack> */}
                          </TableCell>
                          <TableCell align="center">EMR</TableCell>
                          <TableCell align="center">
                            <Checkbox
                              onChange={async () => {
                                const dummy = USERS;
                                if (dummy[index + page * rowsPerPage].included) {
                                  dummy[index + page * rowsPerPage].included =
                                    !dummy[index + page * rowsPerPage].included;
                                  dummy[index + page * rowsPerPage].required = false;
                                } else {
                                  dummy[index + page * rowsPerPage].included =
                                    !dummy[index + page * rowsPerPage].included;
                                }
                                setUsers(dummy);
                                try {
                                  setSubmitting(true);
                                  await updateSignupForm(dummy).then((res) => {
                                    if (res.success) {
                                      getSignUpFields('EMR').then((response) => {
                                        if (response.success) {
                                          setUsers(response?.data?.signup_fields);
                                          enqueueSnackbar('Field updated.', {
                                            variant: 'success',
                                            action: (key) => (
                                              <IconButton
                                                size="small"
                                                onClick={() => closeSnackbar(key)}
                                              >
                                                <Icon icon={closeFill} />
                                              </IconButton>
                                            )
                                          });
                                          setSubmitting(false);
                                        }
                                      });
                                    }
                                  });
                                } catch (error) {
                                  setSubmitting(false);
                                }
                              }}
                              size="small"
                              disabled={
                                label === 'Email' ||
                                label === 'Password' ||
                                label === 'Username' ||
                                label === 'First Name' ||
                                label === 'Last Name' ||
                                isSubmitting
                              }
                              checked={USERS[index + page * rowsPerPage]?.included}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Checkbox
                              disabled={
                                label === 'Email' ||
                                label === 'Password' ||
                                label === 'Username' ||
                                label === 'First Name' ||
                                label === 'Last Name' ||
                                USERS[index + page * rowsPerPage].included === false ||
                                isSubmitting
                              }
                              onChange={async () => {
                                const dummy = USERS;
                                if (!dummy[index + page * rowsPerPage].required) {
                                  dummy[index + page * rowsPerPage].included = true;
                                  dummy[index + page * rowsPerPage].required =
                                    !dummy[index + page * rowsPerPage].required;
                                } else {
                                  dummy[index + page * rowsPerPage].required =
                                    !dummy[index + page * rowsPerPage].required;
                                }
                                setUsers(dummy);
                                try {
                                  setSubmitting(true);
                                  await updateSignupForm(dummy).then((res) => {
                                    if (res.success) {
                                      getSignUpFields('EMR').then((response) => {
                                        if (response.success) {
                                          setUsers(response?.data?.signup_fields);
                                          enqueueSnackbar('Field updated.', {
                                            variant: 'success',
                                            action: (key) => (
                                              <IconButton
                                                size="small"
                                                onClick={() => closeSnackbar(key)}
                                              >
                                                <Icon icon={closeFill} />
                                              </IconButton>
                                            )
                                          });
                                          setSubmitting(false);
                                        }
                                      });
                                    }
                                  });
                                } catch (error) {
                                  setSubmitting(false);
                                }
                              }}
                              size="small"
                              checked={USERS[index + page * rowsPerPage]?.required}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
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
                        <SearchNotFound searchQuery={notFound} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 15, 20]}
            component="div"
            count={USERS.length}
            rowsPerPage={rowsPerPage}
            page={page}
            labelRowsPerPage="Form fields per page:"
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
