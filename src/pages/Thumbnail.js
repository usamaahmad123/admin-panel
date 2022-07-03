import { Icon } from '@iconify/react';
import { useEffect, useState, forwardRef } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack5';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
// material
import {
  Card,
  Stack,
  Container,
  Typography,
  Button,
  IconButton,
  Grid,
  CardMedia,
  Link,
  Checkbox,
  Box,
  TextField,
  Autocomplete,
  Modal,
  InputAdornment,
  MenuItem,
  Select,
  InputLabel,
  ListSubheader
} from '@material-ui/core';
import MuiFormControl from '@material-ui/core/FormControl';
import closeFill from '@iconify/icons-eva/close-fill';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import plusFill from '@iconify/icons-eva/plus-fill';
import { LoadingButton } from '@material-ui/lab';
import { withStyles } from '@material-ui/styles';
import MuiAlert from '@mui/material/Alert';
// components
import {
  updateFile,
  getFileByFolderId,
  getAdminPatients,
  getCategories,
  getLabelsByCategory,
  addLabel
} from '../utils/Index';
import Page from '../components/Page';
import './StyleSheet.css';
// ----------------------------------------------------------------------
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
const Alert = forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));
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
let catArray = [];
export default function Thumbnail() {
  const [images, setImages] = useState([]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [search, setSearch] = useState(false);
  const [select, setSelect] = useState(true);
  const [add, setAdd] = useState(false);
  const [labelModal, setLabelModal] = useState(false);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [label, setLabels] = useState([]);
  const [selected, setSelected] = useState([]);
  const { id } = useParams();
  const folderId = id;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const LoginSchema = Yup.object().shape({
    patientId: Yup.string().required('Patient is required'),
    category: Yup.array()
      .min(1, 'Minimum 1 category should be selected')
      .required('Category is required'),
    labels: Yup.array().min(1, 'Minimum 1 label should be selected').required('Label is required')
  });

  useEffect(() => {
    if (folderId) {
      setPhotoIndex(0);
      setImages([]);
      setSearch(true);
      getFileByFolderId(folderId).then((res) => {
        if (res.success) {
          setImages(res.data);
          SnacbarViewer(
            `${res.data.length} ${res.data.length > 1 ? 'images' : 'image'} ${
              res.data.length > 1 ? 'have' : 'has'
            } been loaded.`,
            'success'
          );
        } else {
          SnacbarViewer(res.message, 'error');
        }
        setSearch(false);
      });
      getAdminPatients().then((res) => {
        if (res?.success) {
          setData(res?.data);
        }
      });
      getCategories().then((res) => {
        if (res.success) {
          setCategories(res.data);
        }
      });
    }
  }, [folderId]);
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
  const formik = useFormik({
    initialValues: {
      patientId: '',
      category: [],
      labels: []
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        let labArray = [];
        const categoryArray = [];
        values.labels.map((lab) => labArray.push(lab.id));
        values.category.map((lab) => categoryArray.push(lab.id));
        labArray = [...new Set(labArray)];
        const bodyData = {
          patientId: values.patientId,
          categories: categoryArray,
          labels: labArray,
          fileIds: selected
        };
        await updateFile(bodyData).then((res) => {
          if (res.success) {
            SnacbarViewer(res.message || res.data, 'success');
            setSelected([]);
            resetForm();
            setAdd(false);
          } else {
            SnacbarViewer(res.message || res.data, 'error');
          }
          setSubmitting(false);
        });
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

  const formik1 = useFormik({
    initialValues: {
      labelName: '',
      category: ''
    },
    validationSchema: Yup.object().shape({
      labelName: Yup.string().trim('Empty spaces not allowed').required('Label is required'),
      category: Yup.string().trim('Empty spaces not allowed').required('Category is required')
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await addLabel(values.labelName, values.category).then((res) => {
          if (res.success) {
            SnacbarViewer(res.message, 'success');
            // getCategories().then((res) => {
            //   if (res.success) {
            //     setCategories(res.data);
            //   }
            // });
            const Array1 = [];
            formik.values.category.forEach((element) => Array1.push(element.id));
            getLabelsByCategory(Array1.join()).then((res) => {
              if (res.success) {
                setLabels(res.data);
              }
            });
            setLabelModal(false);
          } else {
            SnacbarViewer(res.message, 'error');
          }
          setSubmitting(false);
        });
      } catch (error) {
        setErrors({ afterSubmit: error.message });
        setSubmitting(false);
      }
    }
  });
  const handleClick = (event, fileId) => {
    const selectedIndex = selected.indexOf(fileId);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, fileId);
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
  const handleSelectAllClick = () => {
    if (select) {
      const newSelecteds = images.map((n) => n.fileId);
      setSelected(newSelecteds);
      setSelect(false);
    } else {
      setSelect(true);
      setSelected([]);
    }
  };
  return (
    <Page title="Image viewer">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Add metadata
          </Typography>
          <Box>
            <Button sx={{ mr: 1 }} component={RouterLink} to="/dashboard/data">
              Back
            </Button>
            <Button sx={{ mr: 1 }} disabled={images.length <= 0} onClick={handleSelectAllClick}>
              {select ? 'Select all' : 'Unselect all'}
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                resetForm();
                setSearchText('');
                setAdd(true);
              }}
              disabled={search || selected.length <= 0}
              startIcon={<Icon icon={plusFill} />}
            >
              Add/edit metadata
            </Button>
          </Box>
        </Stack>
        <Modal
          open={add}
          onClose={() => {
            setAdd(false);
            resetForm();
          }}
        >
          <Box sx={style}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h4" gutterBottom>
                Attach Metadata
              </Typography>
              <Button onClick={() => setAdd(false)}>
                <CloseIcon />
              </Button>
            </Stack>
            <Stack>
              <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                  <Stack
                    direction="column"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ my: 2, marginBottom: 5 }}
                    spacing={3}
                  >
                    <FormControl
                      {...getFieldProps('patientId')}
                      error={Boolean(touched.patientId && errors.patientId)}
                      helperText={touched.patientId && errors.patientId}
                      sx={{ width: '90%' }}
                    >
                      <InputLabel id="project-label">Patient*</InputLabel>
                      <Select
                        labelId="project-label"
                        size="small"
                        onChange={(event) => {
                          setFieldValue('patientId', event.target.value);
                        }}
                        value={values.patientId}
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
                                const check = o.middleName
                                  ? `${String(o[k])} ${String(o.middleName)} ${String(o.lastName)}`
                                  : `${String(o[k])} ${String(o.lastName)}`;
                                return check.toLowerCase().includes(searchText.toLowerCase());
                              }
                              return null;
                            })
                          )
                          .map((d, i) => (
                            <MenuItem key={i} value={d.id}>
                              {d.middleName
                                ? `${d.firstName} ${d.middleName} ${d.lastName}`
                                : `${d.firstName} ${d.lastName}`}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                    <Autocomplete
                      fullWidth
                      multiple
                      freeSolo
                      id="multiple-limit-tags"
                      options={categories}
                      sx={{ width: 300 }}
                      size="small"
                      renderInput={(params) => (
                        <TextField
                          error={Boolean(touched.category && errors.category)}
                          helperText={touched.category && errors.category}
                          label="Categories*"
                          {...params}
                        />
                      )}
                      getOptionLabel={(option) => option.name}
                      value={values.category}
                      disabled={isSubmitting}
                      required
                      onChange={(e, newValue) => {
                        catArray = [];
                        for (let i = 0; i < newValue.length; i += 1) {
                          if (newValue[i].id) {
                            catArray.push(newValue[i].id);
                          } else {
                            newValue.splice(i);
                          }
                        }
                        if (formik.values.labels?.length > 0) {
                          const clipped = values.labels.filter((lab) =>
                            catArray.includes(lab.categories.id)
                          );
                          setFieldValue('labels', clipped);
                        }
                        getLabelsByCategory(catArray.join()).then((res) => {
                          if (res.success) {
                            setLabels(res.data);
                          }
                        });
                        setFieldValue('category', newValue);
                      }}
                    />
                    <Autocomplete
                      fullWidth
                      multiple
                      freeSolo
                      id="multiple-limit-tags"
                      options={label}
                      sx={{ width: 300 }}
                      size="small"
                      renderInput={(params) => (
                        <TextField
                          error={Boolean(touched.labels && errors.labels)}
                          helperText={touched.labels && errors.labels}
                          label="Labels*"
                          {...params}
                        />
                      )}
                      getOptionLabel={(option) => option.name}
                      value={values.labels}
                      disabled={isSubmitting}
                      onChange={(e, newValue) => {
                        for (let i = 0; i < newValue.length; i += 1) {
                          if (!newValue[i].id) {
                            newValue.splice(i);
                          }
                        }
                        setFieldValue('labels', newValue);
                      }}
                    />
                  </Stack>
                  <Stack
                    direction="column"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ my: 2, marginBottom: 5 }}
                    spacing={3}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      onClick={() => {
                        formik1.resetForm();
                        setLabelModal(true);
                      }}
                      disabled={search}
                      startIcon={<Icon icon={plusFill} />}
                    >
                      Add custom label
                    </Button>
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
          open={labelModal}
          onClose={() => {
            setLabelModal(false);
            formik1.resetForm();
          }}
        >
          <Box sx={style}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0}>
              <Typography variant="h4" gutterBottom>
                Add label
              </Typography>
              <Button
                onClick={() => {
                  setLabelModal(false);
                  formik1.resetForm();
                }}
              >
                <CloseIcon />
              </Button>
            </Stack>
            <Stack>
              <FormikProvider value={formik1}>
                <Form autoComplete="off" noValidate onSubmit={formik1.handleSubmit}>
                  {formik1.errors.afterSubmit && (
                    <Alert severity="error">{formik1.errors.afterSubmit}</Alert>
                  )}
                  <Stack
                    direction="column"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ my: 2, marginBottom: 5 }}
                    spacing={3}
                  >
                    <>
                      <FormControl
                        {...formik1.getFieldProps('category')}
                        error={Boolean(formik1.touched.category && formik1.errors.category)}
                        helperText={formik1.touched.category && formik1.errors.category}
                        fullWidth
                      >
                        <InputLabel id="project-label">Category</InputLabel>
                        <Select
                          labelId="project-label"
                          id="project-select"
                          label="project"
                          size="small"
                          onChange={(event) =>
                            formik1.setFieldValue('category', event.target.value)
                          }
                          value={formik1.values.category}
                          disabled={formik1.isSubmitting}
                        >
                          <MenuItem selected disabled>
                            Choose category
                          </MenuItem>
                          {categories.map((category, idx) => (
                            <MenuItem key={idx} value={category.id}>
                              {category.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        fullWidth
                        type="text"
                        label="Label name*"
                        size="small"
                        value={formik1.values.labelName}
                        disabled={formik1.isSubmitting}
                        {...formik1.getFieldProps('labelName')}
                        error={Boolean(formik1.touched.labelName && formik1.errors.labelName)}
                        helperText={formik1.touched.labelName && formik1.errors.labelName}
                      />
                    </>
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
                      loading={formik1.isSubmitting}
                    >
                      Add
                    </LoadingButton>
                  </Stack>
                </Form>
              </FormikProvider>
            </Stack>
          </Box>
        </Modal>
        <Grid container spacing={3} sx={{ pl: 5, pb: 2 }}>
          {images?.length > 0
            ? images.map((image, index) => (
                <Grid key={index} item md={3} xs={6}>
                  <Card>
                    <Link
                      to={`/dashboard/viewer/${folderId}/${index}`}
                      color="inherit"
                      underline="none"
                      component={RouterLink}
                    >
                      <CardMedia
                        sx={{ width: 300, minHeight: 200 }}
                        component="img"
                        image={image.thumbnailLink}
                      />
                    </Link>
                    <Checkbox
                      checked={selected.indexOf(image.fileId) !== -1}
                      onChange={(event) => handleClick(event, image.fileId)}
                    />
                    {image.name}
                  </Card>
                </Grid>
              ))
            : null}
        </Grid>
      </Container>
    </Page>
  );
}
