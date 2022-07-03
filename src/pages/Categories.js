import { Icon } from '@iconify/react';
import { useEffect, useState, forwardRef } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { Link as Navigate } from 'react-router-dom';
import { useSnackbar } from 'notistack5';
import moment from 'moment';
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
  Checkbox
} from '@material-ui/core';
import Autocomplete from '@mui/material/Autocomplete';
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
  addCategory,
  deleteCategory,
  editCategory,
  getCategories,
  mergeCategory
} from '../utils/Index';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead } from '../components/_dashboard/user';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'ID', alignRight: false },
  { id: 'name', label: 'Category name', alignRight: false },
  { id: 'created', label: 'Created', alignRight: false },
  { id: 'updated', label: 'Updated', alignRight: false },
  { id: 'isLesion', label: 'Index Lesion', alignRight: false },
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
const Alert = forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  minWidth: 400,
  borderRadius: 2,
  p: 4
};
export default function Categories() {
  const [page, setPage] = useState(0);
  const [title, setTitle] = useState('Add');
  const [filterName, setFilterName] = useState('No categories found.');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [add, setAdd] = useState(false);
  const [merge, setMerge] = useState('');
  const [show, setShow] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [project, setProject] = useState('EMR');
  const [search, setSearch] = useState(true);
  const [id, setId] = useState(null);
  const [query, setQuery] = useState('');
  const LoginSchema = Yup.object().shape({
    categoryName: Yup.string().trim('Empty spaces not allowed').required('Category is required')
    // isLesion: Yup.string().required('Category is required')
  });
  useEffect(() => {
    try {
      GetCategoriesCall(true);
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
  const GetCategoriesCall = async (call) => {
    setSearch(true);
    setData([]);
    setSelected([]);
    await getCategories().then((res) => {
      if (res?.success) {
        setData(res?.data);
        if (call) {
          SnacbarViewer('Categories have been loaded', 'success');
        }
      } else {
        SnacbarViewer(res?.message, 'error');
      }
      setSearch(false);
    });
  };

  const handleClick = (event, row) => {
    const selectedIndex = selected.indexOf(row?.name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row?.name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };
  const formik = useFormik({
    initialValues: {
      categoryName: ''
      // isLesion: 1
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        if (title === 'Add') {
          await addCategory(values.categoryName).then((res) => {
            if (res.success) {
              SnacbarViewer(res.message, 'success');
            } else {
              SnacbarViewer(res.message, 'error');
            }
            GetCategoriesCall(false);
            setSubmitting(false);
            setAdd(false);
          });
        } else {
          await editCategory(values.categoryName, id).then((res) => {
            if (res.success) {
              SnacbarViewer(res.message, 'success');
            } else {
              SnacbarViewer(res.message, 'error');
            }
            GetCategoriesCall(false);
            setSubmitting(false);
            setAdd(false);
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
    resetForm,
    setSubmitting
  } = formik;

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
  const searching = (event) => {
    setQuery(event.target.value);
  };
  const mergeCat = async () => {
    const mergeArray = [];
    for (let i = 0; i < selected.length; i += 1) {
      mergeArray.push(data.filter((fil) => fil.name === selected[i])[0].id);
    }
    let category = data.filter((fil) => fil.name === merge);
    if (category.length > 0) {
      category = category[0].id;
    } else {
      setMerge('');
      return;
    }
    setSubmitting(true);
    await mergeCategory(mergeArray, category).then((res) => {
      if (res.success) {
        setSelected([]);
        SnacbarViewer(res.message, 'success');
      } else {
        SnacbarViewer(res.message, 'error');
      }
      GetCategoriesCall(false);
      setSubmitting(false);
      setMerge('');
      setShow(false);
    });
  };

  const isUserNotFound = data.length === 0;
  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Categories
          </Typography>
          <Button
            size="small"
            variant="contained"
            disabled={
              search || selected.length < 1 || localStorage.getItem('mergeCategory') === 'false'
            }
            onClick={() => setShow(true)}
          >
            Merge
          </Button>
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
          <TextField
            label="Search"
            type="search"
            size="small"
            fullWidth
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
            variant="contained"
            sx={{ minWidth: 'fit-content' }}
            onClick={() => {
              resetForm();
              // setFieldValue('isLesion', 0);
              setTitle('Add');
              setAdd(true);
            }}
            disabled={search || localStorage.getItem('createCategory') === 'false'}
            startIcon={<Icon icon={plusFill} />}
          >
            Add category
          </Button>
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
                {title} category
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
                  <Stack
                    direction="column"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ my: 2, marginBottom: 5 }}
                    spacing={3}
                  >
                    {/* <FormControl
                      {...getFieldProps('isLesion')}
                      error={Boolean(touched.isLesion && errors.isLesion)}
                      helperText={touched.isLesion && errors.isLesion}
                      fullWidth
                    >
                      <InputLabel id="isLesion">Index Lesion</InputLabel>
                      <Select
                        labelId="isLesion"
                        id="isLesion"
                        name="isLesion"
                        label="Index Lesion"
                        size="small"
                        onChange={formik.handleChange}
                        value={values.isLesion}
                        disabled={isSubmitting}
                      >
                        <MenuItem selected disabled>
                          Select status
                        </MenuItem>
                        <MenuItem value={1}>True</MenuItem>
                        <MenuItem value={0}>False</MenuItem>
                      </Select>
                    </FormControl> */}
                    <TextField
                      fullWidth
                      type="text"
                      label="Category name*"
                      size="small"
                      value={values.categoryName}
                      disabled={isSubmitting}
                      {...getFieldProps('categoryName')}
                      error={Boolean(touched.categoryName && errors.categoryName)}
                      helperText={touched.categoryName && errors.categoryName}
                    />
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
        <Modal
          open={show}
          onClose={() => {
            setShow(false);
            setMerge('');
          }}
        >
          <Box sx={style}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h5" gutterBottom>
                Merge categories into
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
              {/* {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>} */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems="center"
                justifyContent="space-between"
                sx={{ my: 2, marginBottom: 5 }}
                spacing={3}
              >
                <Autocomplete
                  fullWidth
                  disablePortal
                  id="combo-box-demo"
                  size="small"
                  options={data.filter((d) => !selected.includes(d.name)).map((d) => d.name)}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField size="small" {...params} label="Category name" />
                  )}
                  value={merge}
                  disabled={isSubmitting}
                  onChange={(e, newValue) => setMerge(newValue)}
                />
              </Stack>
              <Stack
                direction="row-reverse"
                alignItems="center"
                justifyContent="space-between"
                sx={{ my: 2, marginBottom: 5 }}
                spacing={3}
              >
                <LoadingButton
                  disabled={isSubmitting || merge === ''}
                  fullWidth
                  size="small"
                  variant="contained"
                  onClick={mergeCat}
                  loading={isSubmitting}
                >
                  Save
                </LoadingButton>
              </Stack>
            </Stack>
          </Box>
        </Modal>
        <Card>
          <Scrollbar>
            <TableContainer>
              <Table>
                <UserListHead
                  numSelected={selected.length}
                  headLabel={TABLE_HEAD}
                  rowCount={data.length}
                />
                <TableBody>
                  {data
                    .filter((o) =>
                      Object.keys(o).some((k) =>
                        String(o[k]).toLowerCase().includes(query.toLowerCase())
                      )
                    )
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const { id, name, createdAt, updatedAt } = row;
                      const isItemSelected = selected.indexOf(name) !== -1;

                      return (
                        <TableRow
                          key={index}
                          hover
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              size="small"
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, row)}
                            />
                          </TableCell>
                          <TableCell align="center">{id}</TableCell>
                          <TableCell align="center">{name}</TableCell>
                          <TableCell align="center">{moment(createdAt).format('ll')}</TableCell>
                          <TableCell align="center">{moment(updatedAt).format('ll')}</TableCell>
                          <TableCell align="center">{row.is_lesion ? 'Yes' : 'No'}</TableCell>
                          <TableCell align="center">
                            <ButtonGroup size="small" disableElevation variant="outlined">
                              <Button
                                disabled={
                                  isSubmitting || localStorage.getItem('editCategory') === 'false'
                                }
                                onClick={() => {
                                  setTitle('Edit');
                                  setAdd(true);
                                  resetForm();
                                  setId(id);
                                  setFieldValue('categoryName', name);
                                  // setFieldValue('isLesion', row.is_lesion ? 1 : 0);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                disabled={
                                  isSubmitting || localStorage.getItem('deleteCategory') === 'false'
                                }
                                onClick={() => {
                                  setSubmitting(true);
                                  deleteCategory(id).then((res) => {
                                    if (res.success) {
                                      SnacbarViewer(res.message, 'success');
                                    } else {
                                      SnacbarViewer(res.message, 'error');
                                    }
                                    GetCategoriesCall(false);
                                    setSubmitting(false);
                                  });
                                }}
                                color="error"
                              >
                                Delete
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
                Object.keys(o).some((k) => String(o[k]).toLowerCase().includes(query.toLowerCase()))
              ).length
            }
            labelRowsPerPage="Categories per page:"
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
