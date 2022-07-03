import { Icon } from '@iconify/react';
import { useEffect, useState, forwardRef } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { Link as RouterLink, Navigate } from 'react-router-dom';
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
  ButtonGroup,
  Link,
  Checkbox,
  FormControlLabel
} from '@material-ui/core';
import Snackbar from '@mui/material/Snackbar';
import searchOutlined from '@iconify/icons-ant-design/search-outlined';
import MuiFormControl from '@material-ui/core/FormControl';
import { LoadingButton } from '@material-ui/lab';
import CircularProgress from '@mui/material/CircularProgress';
import MuiAlert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import { withStyles } from '@material-ui/styles';
import closeFill from '@iconify/icons-eva/close-fill';

// components
import {
  adminResetPassword,
  CreateUser,
  deleteUser,
  EditUser,
  getAdminUsers,
  updatePermission
} from '../utils/Index';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead } from '../components/_dashboard/user';
import { NameField } from '../utils/formatTime';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  // { id: 'serial', label: 'Sr.', alignRight: false },
  { id: 'firstname', label: 'First name', alignRight: false },
  { id: 'lastname', label: 'Last name', alignRight: false },
  { id: 'email', label: 'Email address', alignRight: false },
  { id: 'username', label: 'Username', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'Status', label: 'Status', alignRight: false },
  { id: 'permission', label: 'Permissions', alignRight: false },
  { id: 'password', label: 'Password', alignRight: false },
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
export default function User() {
  const [page, setPage] = useState(0);
  const filterName = 'No users found.';
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [data, setData] = useState([]);
  const [add, setAdd] = useState(false);
  const [permission, setPermission] = useState(false);
  const [createCategory, setCreateCategory] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(false);
  const [editCategory, setEditCategory] = useState(false);
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
  const LoginSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    // password: Yup.string().required('Password is required'),
    isActive: Yup.string().required('Status is required'),
    username: Yup.string()
      .min(4, 'Too Short!')
      .max(20, 'Too Long!')
      .required('Username is required')
      .trim('Spaces not allowed'),
    phoneNumber: Yup.string()
      .min(10, 'Too Short!')
      .max(11, 'Too Long!')
      .required('Phone Number is required and dashes are not allowed')
      .matches(phoneRegExp, 'Only numbers are required')
  });
  useEffect(() => {
    try {
      setSearch(true);
      setData([]);
      getAdminUsers().then((res) => {
        if (res?.success) {
          setData(res?.data);
          SnacbarViewer(res?.message, 'success');
        } else {
          SnacbarViewer(res?.message, 'error');
        }
        setSearch(false);
      });
    } catch (error) {
      setSearch(false);
      SnacbarViewer(error?.message, 'error');
    }
  }, []);
  const getUsersCall = async () => {
    setSearch(true);
    setQuery('');
    setData([]);
    await getAdminUsers().then((res) => {
      if (res?.success) {
        setData(res?.data);
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
      email: '',
      username: '',
      phoneNumber: '',
      isActive: 1,
      role: 0,
      // password: '',
      project: 'EMR'
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        if (title === 'Add') {
          await CreateUser(values).then((res) => {
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
          await EditUser(values, id).then((res) => {
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
    setSubmitting,
    setErrors,
    handleSubmit,
    getFieldProps,
    setFieldValue,
    resetForm
  } = formik;

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
  const deleteUserFn = async (uuid) => {
    try {
      setSubmitting(true);
      await deleteUser(uuid).then((res) => {
        if (res?.success) {
          SnacbarViewer(res?.message, 'success');
          setAdd(false);
          getUsersCall();
          resetForm();
        } else {
          SnacbarViewer(res?.message, 'error');
        }
        setSubmitting(false);
      });
    } catch (error) {
      setErrors({ afterSubmit: error.message });
      setSubmitting(false);
    }
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
  const submitPermissions = async () => {
    setSubmitting(true);
    updatePermission(
      {
        CREATE_CATEGORY: createCategory,
        EDIT_CATEGORY: editCategory,
        DELETE_CATEGORY: deleteCategory
      },
      id
    ).then((res) => {
      if (res.success) {
        setPermission(false);
        setCreateCategory(false);
        setEditCategory(false);
        setDeleteCategory(false);
        SnacbarViewer(res?.message, 'success');
      } else {
        SnacbarViewer(res?.message, 'error');
      }
      setSubmitting(false);
    });
  };

  const isUserNotFound = data.length === 0;

  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Users
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              resetForm();
              setTitle('Add');
              setAdd(true);
            }}
            startIcon={<Icon icon={plusFill} />}
          >
            Add user
          </Button>
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
          <TextField
            label="Search"
            type="search"
            size="small"
            fullWidth
            style={{ paddingRight: 10 }}
            onChange={(event) => setQuery(event.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Icon icon={searchOutlined} />
                </InputAdornment>
              )
            }}
          />
        </Stack>
        <Modal
          open={permission}
          onClose={() => {
            setPermission(false);
            setCreateCategory(false);
            setEditCategory(false);
            setDeleteCategory(false);
            setId(null);
          }}
        >
          <Box sx={style}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h4" gutterBottom>
                Permissions
              </Typography>
              <Button
                onClick={() => {
                  setPermission(false);
                  setCreateCategory(false);
                  setEditCategory(false);
                  setDeleteCategory(false);
                }}
              >
                <CloseIcon />
              </Button>
            </Stack>
            <Stack sx={{ minWidth: 250 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(event) => setCreateCategory(event.target.checked)}
                    checked={createCategory}
                  />
                }
                label={<Typography variant="body2">Create category</Typography>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(event) => setEditCategory(event.target.checked)}
                    checked={editCategory}
                  />
                }
                label={<Typography variant="body2">Edit category</Typography>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(event) => setDeleteCategory(event.target.checked)}
                    checked={deleteCategory}
                  />
                }
                label={<Typography variant="body2">Delete category</Typography>}
              />
              <LoadingButton
                fullWidth
                size="small"
                variant="contained"
                onClick={submitPermissions}
                loading={isSubmitting}
                sx={{ mt: 2 }}
              >
                Save
              </LoadingButton>
            </Stack>
          </Box>
        </Modal>
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
                {title} User
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
                      label="First Name*"
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
                      label="Last Name*"
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
                      type="email"
                      label="Email*"
                      size="small"
                      value={values.email}
                      disabled={isSubmitting || title === 'Edit'}
                      {...getFieldProps('email')}
                      error={Boolean(touched.email && errors.email)}
                      helperText={touched.email && errors.email}
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
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ my: 2, marginBottom: 5 }}
                    spacing={3}
                  >
                    <FormControl
                      {...getFieldProps('isActive')}
                      error={Boolean(touched.isActive && errors.isActive)}
                      helperText={touched.isActive && errors.isActive}
                      fullWidth
                    >
                      <InputLabel id="industry-label">Status</InputLabel>
                      <Select
                        labelId="industry-label"
                        value={values.isActive}
                        label="isActive"
                        name="isActive"
                        id="isActive"
                        size="small"
                        onChange={formik.handleChange}
                        disabled={isSubmitting}
                      >
                        <MenuItem selected disabled>
                          Select status
                        </MenuItem>
                        <MenuItem value={1}>Active</MenuItem>
                        <MenuItem value={0}>Inactive</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      type="text"
                      label="Username*"
                      size="small"
                      disabled={isSubmitting || title === 'Edit'}
                      {...getFieldProps('username')}
                      error={Boolean(touched.username && errors.username)}
                      helperText={touched.username && errors.username}
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
                      {...getFieldProps('role')}
                      error={Boolean(touched.role && errors.role)}
                      helperText={touched.role && errors.role}
                      fullWidth
                    >
                      <InputLabel id="industry-label">Role</InputLabel>
                      <Select
                        labelId="industry-label"
                        value={values.role}
                        label="role"
                        name="role"
                        id="role"
                        size="small"
                        onChange={formik.handleChange}
                        disabled={isSubmitting}
                      >
                        <MenuItem selected disabled>
                          Select role
                        </MenuItem>
                        <MenuItem value={1}>Admin</MenuItem>
                        <MenuItem value={0}>User</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl
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
                <UserListHead headLabel={TABLE_HEAD} rowCount={data.length} />
                <TableBody>
                  {data
                    .filter((o) =>
                      Object.keys(o).some((k) => {
                        if (k === 'firstName') {
                          const check = `${String(o[k])} ${String(o.lastName)}`;
                          return check.toLowerCase().includes(query.toLowerCase());
                        }
                        return String(o[k]).toLowerCase().includes(query.toLowerCase());
                      })
                    )
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        isAdmin,
                        isApproved,
                        firstName,
                        lastName,
                        email,
                        username,
                        phoneNumber
                      } = row;
                      // const isItemSelected = selected.indexOf(name) !== -1;

                      return (
                        <TableRow key={row?.uuid} tabIndex={-1}>
                          <TableCell padding="checkbox" />
                          {/* <TableCell align="center">{index + page * rowsPerPage + 1}</TableCell> */}
                          <TableCell align="center">{firstName}</TableCell>
                          <TableCell align="center">{lastName}</TableCell>
                          <TableCell align="center">{email}</TableCell>
                          <TableCell align="center">{username}</TableCell>
                          <TableCell align="center">{isAdmin ? 'Admin' : 'User'}</TableCell>
                          <TableCell align="center">
                            {isApproved ? 'Approved' : 'Unapproved'}
                          </TableCell>
                          <TableCell>
                            <Button
                              disabled={isSubmitting}
                              onClick={() => {
                                setCreateCategory(false);
                                setEditCategory(false);
                                setDeleteCategory(false);
                                setId(row?.id);
                                setPermission(true);
                              }}
                            >
                              Permissions
                            </Button>
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              disabled={search}
                              onClick={() => {
                                setSearch(true);
                                adminResetPassword(email).then((res) => {
                                  if (res.success) {
                                    enqueueSnackbar(res?.message, {
                                      variant: 'success',
                                      action: (key) => (
                                        <IconButton size="small" onClick={() => closeSnackbar(key)}>
                                          <Icon icon={closeFill} />
                                        </IconButton>
                                      )
                                    });
                                  } else {
                                    enqueueSnackbar(res?.message, {
                                      variant: 'error',
                                      action: (key) => (
                                        <IconButton size="small" onClick={() => closeSnackbar(key)}>
                                          <Icon icon={closeFill} />
                                        </IconButton>
                                      )
                                    });
                                  }
                                  setSearch(false);
                                });
                              }}
                              size="small"
                              varient="outlined"
                            >
                              Reset
                            </Button>
                          </TableCell>
                          <TableCell align="center">
                            <ButtonGroup size="small" disableElevation variant="outlined">
                              <Button
                                disabled={isSubmitting}
                                onClick={() => {
                                  setTitle('Edit');
                                  setAdd(true);
                                  resetForm();
                                  setId(row?.uuid);
                                  setFieldValue('firstName', firstName);
                                  setFieldValue('lastName', lastName);
                                  setFieldValue('email', email);
                                  setFieldValue('phoneNumber', phoneNumber.replace(/[^0-9]/g, ''));
                                  setFieldValue('username', username);
                                  setFieldValue('isActive', row?.isActive ? 1 : 0);
                                  setFieldValue('role', row?.isAdmin ? 1 : 0);
                                }}
                              >
                                Edit
                              </Button>

                              {!isApproved && row.Verifications[0].isConfirmed && (
                                <Button disabled={isSubmitting} color="warning">
                                  <Link
                                    sx={{ color: '#FFC107' }}
                                    underline="none"
                                    to={`/dashboard/viewuser/${row?.uuid}/${row.id}`}
                                    component={RouterLink}
                                  >
                                    Approve
                                  </Link>
                                </Button>
                              )}
                              <Button
                                disabled={isSubmitting}
                                color="error"
                                onClick={() => deleteUserFn(row?.uuid)}
                              >
                                Inactive
                              </Button>
                            </ButtonGroup>
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
                    const check = `${String(o[k])} ${String(o.lastName)}`;
                    return check.toLowerCase().includes(query.toLowerCase());
                  }
                  return String(o[k]).toLowerCase().includes(query.toLowerCase());
                })
              ).length
            }
            labelRowsPerPage="Users per page:"
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
