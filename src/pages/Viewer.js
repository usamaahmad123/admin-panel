import { Icon } from '@iconify/react';
import { useEffect, useState, forwardRef, useRef } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { sentenceCase } from 'change-case';
import { useSnackbar } from 'notistack5';
// material
import {
  Card,
  Stack,
  Container,
  Typography,
  IconButton,
  Grid,
  Modal,
  Box,
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Divider,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  DialogContent,
  ToggleButtonGroup,
  ToggleButton,
  FormGroup,
  FormControl,
  Checkbox,
  FormHelperText
} from '@material-ui/core';
import closeFill from '@iconify/icons-eva/close-fill';
import plusFill from '@iconify/icons-eva/plus-fill';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@material-ui/lab';
import Chip from '@mui/material/Chip';
import MuiAlert from '@mui/material/Alert';
// components
import {
  getFileByFolderId,
  getAdminPatients,
  getCategories,
  getLabelsByCategory,
  updateFile,
  addLabel,
  deleteFiles
} from '../utils/Index';
import Page from '../components/Page';
import './StyleSheet.css';
import IndexLesionViewerCarousal from '../components/IndexLesionViewerCarousal';
// ----------------------------------------------------------------------
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
// const FormControl = withStyles({
//   root: {
//     '& .MuiOutlinedInput-root': {
//       fontSize: 14
//     },
//     '& .MuiInputLabel-root': {
//       fontSize: 15,
//       lineHeight: 2,
//       marginTop: -3
//     },
//     '& .MuiInputBase-input': {
//       paddingTop: 9,
//       paddingBottom: 10
//     }
//   }
// })(MuiFormControl);
let catArray = [];
let imageFileId = null;
export default function ImageViewer() {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState(false);
  const [add, setAdd] = useState(false);
  const [labelModal, setLabelModal] = useState(false);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [label, setLabels] = useState([]);
  const { id, index } = useParams();
  const [photoIndex, setPhotoIndex] = useState(Number(index));
  const folderId = id;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const scroll = 'paper';

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (add) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [add]);
  const LoginSchema = Yup.object().shape({
    patientId: Yup.string().required('Patient is required'),
    category: Yup.array()
      .min(1, 'Minimum 1 category should be selected')
      .required('Category is required'),
    labels: Yup.array().min(1, 'Minimum 1 label should be selected').required('Label is required')
  });

  useEffect(() => {
    if (folderId) {
      const sPageURL = window.location.href.substring(1);
      const sURLVariables = sPageURL.split('?fileId=');
      setImages([]);
      setSearch(true);
      getFileByFolderId(folderId).then((res) => {
        if (res.success) {
          if (sURLVariables.length > 0) {
            res.data.forEach((element, Index) => {
              if (`${element.fileId}` === sURLVariables[1]) {
                setPhotoIndex(Index);
              }
            });
          }
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
  const formik1 = useFormik({
    initialValues: {
      labelName: '',
      category: ''
    },
    validationSchema: Yup.object().shape({
      labelName: Yup.string().trim('Empty spaces not allowed').required('Label is required'),
      category: Yup.string().trim('Empty spaces not allowed').required('Category is required'),
      reportType: Yup.string().required('Report type is required')
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await addLabel(values.labelName, values.category).then((res) => {
          if (res.success) {
            SnacbarViewer(res.message, 'success');
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
  const formik = useFormik({
    initialValues: {
      patientId: '',
      category: [],
      labels: [],
      metaDataType: 1
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        if (values.metaDataType === 2 && catArray.includes(95)) {
          setSearch(true);
          await addLabel(values.reportType, 95).then((re) => {
            if (re.success) {
              let labArray = [];
              const categoryArray = [];
              values.labels.map((lab) => labArray.push(lab.id));
              values.category.map((lab) => categoryArray.push(lab.id));
              labArray.push(re.data?.id);
              labArray = [...new Set(labArray)];
              const bodyData = {
                patientId: values.patientId,
                categories: categoryArray,
                labels: labArray,
                fileIds: [images[photoIndex].fileId]
              };
              updateFile(bodyData).then((res) => {
                if (res.success) {
                  SnacbarViewer(res.message || res.data, 'success');
                  setSearch(false);
                  getFileByFolderId(folderId).then((res) => {
                    if (res.success) {
                      for (let i = 0; i < res.data.length; i += 1) {
                        if (res.data[i].fileId === imageFileId) {
                          setPhotoIndex(i);
                        }
                      }
                      setImages(res.data);
                    } else {
                      SnacbarViewer(res.message, 'error');
                    }
                    setSearch(false);
                  });
                  resetForm();
                  setAdd(false);
                } else {
                  SnacbarViewer(res.message || res.data, 'error');
                }
                setSubmitting(false);
              });
            }
          });
        } else {
          let labArray = [];
          const categoryArray = [];
          values.labels.map((lab) => labArray.push(lab.id));
          values.category.map((lab) => categoryArray.push(lab.id));
          labArray = [...new Set(labArray)];
          const bodyData = {
            patientId: values.patientId,
            categories: categoryArray,
            labels: labArray,
            fileIds: [images[photoIndex].fileId]
          };
          imageFileId = images[photoIndex].fileId;
          setSearch(true);
          await updateFile(bodyData).then((res) => {
            if (res.success) {
              SnacbarViewer(res.message || res.data, 'success');
              setSearch(false);
              getFileByFolderId(folderId).then((res) => {
                if (res.success) {
                  for (let i = 0; i < res.data.length; i += 1) {
                    if (res.data[i].fileId === imageFileId) {
                      setPhotoIndex(i);
                    }
                  }
                  setImages(res.data);
                } else {
                  SnacbarViewer(res.message, 'error');
                }
                setSearch(false);
              });
              resetForm();
              setAdd(false);
            } else {
              SnacbarViewer(res.message || res.data, 'error');
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
  const handleDelete = () => {
    deleteFiles([images[photoIndex].fileId]).then((res) => {
      if (res.success) {
        SnacbarViewer(res.message, 'success');
        navigate('/dashboard/gallery', { replace: true });
      } else {
        SnacbarViewer(res.message, 'error');
      }
    });
  };
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
  const handleClose = () => {
    setAdd(false);
    resetForm();
  };
  return (
    <Page title="Image viewer">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Add Metadata
          </Typography>
          <Box>
            <Button sx={{ mr: 1 }} component={RouterLink} to="/dashboard/gallery">
              Back
            </Button>
            <Button
              sx={{ mr: 1 }}
              disabled={search}
              color="error"
              variant="contained"
              onClick={handleDelete}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                resetForm();
                setFieldValue('metaDataType', 1);
                setSearchText('');
                if (images[photoIndex].categories.length > 0) {
                  const categArray = [];
                  images[photoIndex].categories.forEach((element) => {
                    categArray.push(element.id);
                  });
                  setFieldValue(
                    'category',
                    categories.filter((category) => categArray.includes(category.id)) || []
                  );
                  if (images[photoIndex].labels.length > 0) {
                    const labelArray = [];
                    images[photoIndex].labels.forEach((element) => {
                      labelArray.push(element.id);
                    });
                    getLabelsByCategory(categArray.join()).then((res) => {
                      if (res.success) {
                        setLabels(res.data);
                        setFieldValue(
                          'labels',
                          res.data.filter((labels) => labelArray.includes(labels.id)) || []
                        );
                      }
                    });
                  }
                }

                setFieldValue(
                  'patientId',
                  images[photoIndex].patient ? images[photoIndex].patient?.id : ''
                );
                setAdd(true);
              }}
              disabled={search}
              startIcon={<Icon icon={plusFill} />}
            >
              Add/edit metadata
            </Button>
          </Box>
        </Stack>
        {images.length > 0 && (
          <>
            {images[photoIndex].patient && (
              <Stack direction="row" mb={3}>
                <Typography sx={{ mr: 2 }}>Patient name(id): </Typography>
                <Chip
                  label={
                    images[photoIndex].patient?.middleName
                      ? `${sentenceCase(images[photoIndex].patient?.firstName)} ${sentenceCase(
                          images[photoIndex].patient?.middleName
                        )} ${sentenceCase(images[photoIndex].patient.lastName)} (${
                          images[photoIndex].patient?.patientId
                        })`
                      : `${sentenceCase(images[photoIndex].patient?.firstName)} ${sentenceCase(
                          images[photoIndex].patient.lastName
                        )} (${images[photoIndex].patient?.patientId})`
                  }
                  size="small"
                  varient="outlined"
                  color="primary"
                  clickable
                />
              </Stack>
            )}
            <Grid container spacing={3}>
              <Grid item md={4}>
                <Typography sx={{ mr: 2 }}>Category</Typography>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item md={7}>
                <Typography sx={{ mr: 2 }}>Labels</Typography>
              </Grid>
              {images[photoIndex].categories.length > 0
                ? images[photoIndex].categories.map((d) => (
                    <>
                      <Grid item md={4}>
                        <Chip
                          label={d.name}
                          varient="outlined"
                          size="small"
                          color="primary"
                          clickable
                          sx={{ mr: 1 }}
                        />
                      </Grid>
                      <Divider orientation="vertical" flexItem />
                      <Grid item md={7}>
                        {images[photoIndex].labels.map(
                          (label) =>
                            label.categories.id === d.id && (
                              <Chip
                                label={label.name}
                                varient="outlined"
                                size="small"
                                color="primary"
                                clickable
                                sx={{ mr: 1 }}
                              />
                            )
                        )}
                      </Grid>
                    </>
                  ))
                : null}
            </Grid>
            {/* {images[photoIndex].categories.length > 0 ? (
              <Stack direction="row" mb={3}>
                <Typography sx={{ mr: 2 }}>Category: </Typography>
                {images[photoIndex].categories.map((category) => (
                  <Chip
                    label={category.name}
                    varient="outlined"
                    size="small"
                    color="primary"
                    clickable
                    sx={{ mr: 1 }}
                  />
                ))}
              </Stack>
            ) : null} */}
            {/* {images[photoIndex].labels.length > 0 ? (
              <Stack direction="row" mb={3}>
                <Typography sx={{ mr: 2 }}>Labels: </Typography>
                {images[photoIndex].labels.map((d) => (
                  <Tooltip title="Category" placement="top" arrow>
                    <Chip
                      label={d.name}
                      varient="outlined"
                      size="small"
                      color="primary"
                      clickable
                      sx={{ mr: 1 }}
                    />
                  </Tooltip>
                ))}
              </Stack>
            ) : null} */}
          </>
        )}
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
        <Dialog
          open={add}
          fullWidth
          maxWidth="lg"
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h4" gutterBottom>
                Attach Metadata
              </Typography>
              <Button
                onClick={() => {
                  setAdd(false);
                  resetForm();
                }}
              >
                <CloseIcon />
              </Button>
            </Stack>
          </DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              <>
                <Stack>
                  <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                      {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}
                      <ToggleButtonGroup
                        color="primary"
                        value={values.metaDataType}
                        exclusive
                        fullWidth
                        onChange={(event, newAlignment) =>
                          setFieldValue('metaDataType', newAlignment)
                        }
                      >
                        <ToggleButton value={1}>Image</ToggleButton>
                        <ToggleButton value={2}>Index Lesion</ToggleButton>
                      </ToggleButtonGroup>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{ my: 1, marginBottom: 5 }}
                        spacing={3}
                      >
                        <FormControl
                          error={Boolean(touched.patientId && errors.patientId)}
                          helperText={touched.patientId && errors.patientId}
                          component="fieldset"
                          variant="standard"
                          fullWidth
                        >
                          <FormLabel component="legend">Patients</FormLabel>
                          <FormGroup>
                            <FormHelperText>{touched.patientId && errors.patientId}</FormHelperText>
                            <RadioGroup fullWidth {...getFieldProps('patientId')}>
                              {data.map((item) => (
                                <FormControlLabel
                                  key={item.patientId}
                                  value={item.patientId}
                                  fullWidth
                                  control={<Radio />}
                                  label={
                                    item.middleName
                                      ? `${item.firstName} ${item.middleName} ${item.lastName}`
                                      : `${item.firstName} ${item.lastName}`
                                  }
                                />
                              ))}
                            </RadioGroup>
                          </FormGroup>
                        </FormControl>
                        <FormControl
                          error={Boolean(touched.category && errors.category)}
                          helperText={touched.category && errors.category}
                          component="fieldset"
                          variant="standard"
                          fullWidth
                        >
                          <FormLabel component="legend">Categories</FormLabel>
                          <FormGroup>
                            <FormHelperText>{touched.category && errors.category}</FormHelperText>
                            {categories.map((category) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    {...getFieldProps('category')}
                                    checked={values.category.includes(category.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        catArray = [...values.category, category.id];
                                        setFieldValue('category', catArray);
                                      } else {
                                        catArray = values.category.filter((x) => x !== category.id);
                                        setFieldValue('category', catArray);
                                      }
                                      if (formik.values.labels?.length > 0) {
                                        const clipped = values.labels.filter(
                                          (lab) =>
                                            catArray.length > 0 &&
                                            catArray?.includes(lab.categories.id)
                                        );
                                        setFieldValue('labels', clipped);
                                      }
                                      getLabelsByCategory(catArray.join()).then((res) => {
                                        if (res.success) {
                                          setLabels(res.data);
                                        }
                                      });
                                    }}
                                    name={category.name}
                                    value={category.id}
                                  />
                                }
                                key={category.id}
                                label={category.name}
                              />
                            ))}
                          </FormGroup>
                        </FormControl>
                        <FormControl
                          error={Boolean(touched.labels && errors.labels)}
                          helperText={touched.labels && errors.labels}
                          component="fieldset"
                          variant="standard"
                          fullWidth
                        >
                          <FormLabel component="legend">Labels</FormLabel>
                          <FormGroup>
                            <FormHelperText>{touched.labels && errors.labels}</FormHelperText>
                            {label.map((lab) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    {...getFieldProps('labels')}
                                    checked={values.labels.includes(lab.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setFieldValue('labels', [...values.labels, lab.id]);
                                      } else {
                                        setFieldValue(
                                          'labels',
                                          values.labels.filter((x) => x !== lab.id)
                                        );
                                      }
                                    }}
                                    name={lab.name}
                                    value={lab.id}
                                  />
                                }
                                key={lab.id}
                                label={lab.name}
                              />
                            ))}
                            {values.metaDataType === 2 && catArray.includes(95) && (
                              <TextField
                                fullWidth
                                type="text"
                                label="Report type"
                                size="small"
                                disabled={isSubmitting || search}
                                {...getFieldProps('reportType')}
                                error={Boolean(touched.reportType && errors.reportType)}
                                helperText={touched.reportType && errors.reportType}
                              />
                            )}
                          </FormGroup>
                        </FormControl>
                      </Stack>
                      <Stack
                        direction="column"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ my: 1, marginBottom: 5 }}
                        spacing={3}
                      >
                        {/* <RadioGroup
                    onChange={(event) => {
                      setFieldValue('metaDataType', Number(event.target.value));
                    }}
                    value={values.metaDataType}
                    row
                    fullWidth
                  >
                    <FormControlLabel value={1} control={<Radio />} label="Image" />
                    <FormControlLabel value={2} control={<Radio />} label="Index Lesion" />
                  </RadioGroup> */}
                        {/* <FormControl
                        {...getFieldProps('patientId')}
                        error={Boolean(touched.patientId && errors.patientId)}
                        helperText={touched.patientId && errors.patientId}
                        fullWidth
                      >
                        <InputLabel id="projectlabel">Patient*</InputLabel>
                        <Select
                          id="project-select"
                          label="Patient"
                          labelId="projectlabel"
                          size="small"
                          onChange={(event) => {
                            setFieldValue('patientId', event.target.value);
                          }}
                          value={values.patientId}
                          disabled={isSubmitting || search}
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
                          {patients
                            .filter((o) =>
                              ['firstName'].some((k) => {
                                if (k === 'firstName') {
                                  const check = o.middleName
                                    ? `${String(o[k])} ${String(o.middleName)} ${String(
                                        o.lastName
                                      )}`
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
                        options={
                          values.metaDataType === 1
                            ? categories
                            : categories.filter((cat) => cat.is_lesion)
                        }
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
                        disabled={isSubmitting || search}
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
                        disabled={isSubmitting || search}
                        onChange={(e, newValue) => {
                          for (let i = 0; i < newValue.length; i += 1) {
                            if (!newValue[i].id) {
                              newValue.splice(i);
                            }
                          }
                          setFieldValue('labels', newValue);
                        }}
                      /> */}
                      </Stack>
                    </Form>
                  </FormikProvider>
                </Stack>
              </>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" size="small" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                formik1.resetForm();
                setLabelModal(true);
              }}
              disabled={search || search}
              startIcon={<Icon icon={plusFill} />}
            >
              Add custom label
            </Button>
            <LoadingButton
              size="small"
              type="submit"
              onClick={handleSubmit}
              variant="contained"
              loading={isSubmitting || search}
            >
              Add metadata
            </LoadingButton>
          </DialogActions>
        </Dialog>
        {folderId !== null ? (
          images?.length > 0 && (
            <IndexLesionViewerCarousal
              setCarousalPhotoIndex={(index) => setPhotoIndex(index)}
              images={images}
              photoIndex={photoIndex}
            />
          )
        ) : (
          <Card sx={{ pt: 5, pb: 5 }}>
            <Typography textAlign="center" variant="subtitle1" gutterBottom>
              {' '}
              Kindly select a folder.
            </Typography>
          </Card>
        )}
      </Container>
    </Page>
  );
}
