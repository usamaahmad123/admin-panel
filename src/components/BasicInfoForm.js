import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import {
  Stack,
  TextField,
  Alert,
  FormControl,
  Button,
  RadioGroup,
  Radio,
  FormLabel,
  FormControlLabel,
  Typography,
  AccordionSummary,
  Accordion,
  AccordionDetails
} from '@material-ui/core';
import { LoadingButton, DatePicker } from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { UpdatePatients, getPatient, RegisterPatient } from '../utils/Index';
import { NameField } from '../utils/formatTime';
import useStyles from './useStyles';
import '../pages/StyleSheet.css';
// ----------------------------------------------------------------------
let openForFirstTime = true;
const phoneRegExp = /^(0|[1-9][0-9]{0,9})$/;
const BasicInfoForm = ({ onSubmittion, SnacbarViewer, patientId, id, setBasicInfo, BasicRef }) => {
  const [expanded, setExpanded] = useState(true);
  const classes = useStyles();
  useEffect(() => {
    if (patientId) {
      getPatient(patientId).then((res) => {
        if (res.success) {
          setBasicInfo(true);
          formik.setFieldValue('first_name', res.data.first_name || '');
          formik.setFieldValue('last_name', res.data.last_name || '');
          formik.setFieldValue('middle_name', res.data.middle_name || '');
          formik.setFieldValue('date_of_birth', new Date(res.data?.date_of_birth || ''));
          formik.setFieldValue(
            'external_reference_id',
            Number(res.data.external_reference_id) || null
          );
          formik.setFieldValue(
            'social_security_number',
            Number(res.data.social_security_number) || null
          );
          formik.setFieldValue('sex', res.data.sex || '');
          formik.setFieldValue('patient_id', res.data.patient_id || '');
        }
      });
    }
  }, []);
  const handleAccordianChange = (event, newExpanded) => {
    if (newExpanded && openForFirstTime) {
      openForFirstTime = false;
      if (patientId) {
        getPatient(patientId).then((res) => {
          if (res.success) {
            formik.setFieldValue('first_name', res.data.first_name || '');
            formik.setFieldValue('last_name', res.data.last_name || '');
            formik.setFieldValue('middle_name', res.data.middle_name || '');
            formik.setFieldValue('date_of_birth', new Date(res.data?.date_of_birth || ''));
            formik.setFieldValue('external_reference_id', res.data.external_reference_id || null);
            formik.setFieldValue('social_security_number', res.data.social_security_number || null);
            formik.setFieldValue('sex', res.data.sex || '');
            formik.setFieldValue('patient_id', res.data.patient_id || '');
          }
        });
      }
    }
    setExpanded(newExpanded);
  };
  const RegisterSchema = Yup.object().shape({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    patient_id: Yup.string().required('Patient id is required'),
    date_of_birth: Yup.date().nullable().required('Date of birth is required'),
    social_security_number: Yup.string()
      .min(6, 'Social security number should be atleast 6 digits long.')
      .matches(phoneRegExp, 'Only positive numbers are allowed')
      .required('Social security number is required.'),
    external_reference_id: Yup.string()
      .min(6, 'External reference id should be atleast 6 digits long.')
      .matches(phoneRegExp, 'Only positive numbers are allowed')
      .required('External reference id is required.')
  });
  const formik = useFormik({
    initialValues: {
      first_name: '',
      middle_name: '',
      last_name: '',
      date_of_birth: new Date(),
      external_reference_id: '',
      social_security_number: '',
      sex: 'Male',
      patient_id: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        if (patientId) {
          const updatedValues = values;
          delete updatedValues.patient_id;
          await UpdatePatients(values, patientId).then((res) => {
            if (res.success) {
              SnacbarViewer(res.message, 'success');
              onSubmittion(id, patientId);
            } else {
              SnacbarViewer(res.message, 'error');
            }
          });
        } else {
          await RegisterPatient(values).then((res) => {
            if (res.success) {
              SnacbarViewer(res.message, 'success');
              onSubmittion(res.data.id, res.data.patient_id);
            } else {
              SnacbarViewer(res.message, 'error');
            }
          });
        }
      } catch (error) {
        console.error(error);
        setErrors({ afterSubmit: error.message });
        setSubmitting(false);
      }
    }
  });

  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    values,
    setFieldValue,
    resetForm
  } = formik;
  return (
    <>
      <FormikProvider value={formik}>
        <Form
          style={{ width: '100%', marginBottom: 10 }}
          autoComplete="off"
          noValidate
          onSubmit={handleSubmit}
        >
          <Accordion
            ref={BasicRef}
            expanded={expanded}
            onChange={handleAccordianChange}
            sx={{ backgroundColor: '#f9fcff' }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Stack
                direction="row"
                alignItems="center"
                sx={{ width: '100%' }}
                justifyContent="space-between"
              >
                <Typography variant="h6" gutterBottom>
                  Basic info
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Stack fullWidth spacing={3}>
                {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="First name"
                    size="small"
                    onKeyDown={NameField}
                    InputProps={{
                      classes: {
                        notchedOutline: values.first_name ? classes.notchedOutline : ''
                      }
                    }}
                    disabled={isSubmitting}
                    {...getFieldProps('first_name')}
                    error={Boolean(touched.first_name && errors.first_name)}
                    helperText={touched.first_name && errors.first_name}
                  />
                  <TextField
                    fullWidth
                    label="Middle name"
                    size="small"
                    onKeyDown={NameField}
                    InputProps={{
                      classes: {
                        notchedOutline: values.middle_name ? classes.notchedOutline : ''
                      }
                    }}
                    disabled={isSubmitting}
                    {...getFieldProps('middle_name')}
                    error={Boolean(touched.middle_name && errors.middle_name)}
                    helperText={touched.middle_name && errors.middle_name}
                  />
                  <TextField
                    fullWidth
                    label="Last name"
                    size="small"
                    onKeyDown={NameField}
                    InputProps={{
                      classes: {
                        notchedOutline: values.last_name ? classes.notchedOutline : ''
                      }
                    }}
                    disabled={isSubmitting}
                    {...getFieldProps('last_name')}
                    error={Boolean(touched.last_name && errors.last_name)}
                    helperText={touched.last_name && errors.last_name}
                  />
                  <TextField
                    fullWidth
                    label="Patient id"
                    size="small"
                    disabled={isSubmitting || patientId}
                    InputProps={{
                      classes: {
                        notchedOutline: values.patient_id ? classes.notchedOutline : ''
                      }
                    }}
                    {...getFieldProps('patient_id')}
                    error={Boolean(touched.patient_id && errors.patient_id)}
                    helperText={touched.patient_id && errors.patient_id}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <FormControl
                    fullWidth
                    style={{ borderRadius: 10, padding: 10, background: '#ebeaea' }}
                  >
                    <FormLabel id="genderradio">Gender</FormLabel>
                    <RadioGroup
                      labelId="genderradio"
                      aria-labelledby="genderradio"
                      row
                      sx={{ mb: 2 }}
                      {...getFieldProps('sex')}
                    >
                      <FormControlLabel
                        key={0}
                        sx={{ mr: 3 }}
                        value="Male"
                        control={<Radio size="small" />}
                        label="Male"
                      />
                      <FormControlLabel
                        key={1}
                        sx={{ mr: 3 }}
                        value="Female"
                        control={<Radio size="small" />}
                        label="Female"
                      />
                      <FormControlLabel
                        key={2}
                        sx={{ mr: 3 }}
                        value="Other"
                        control={<Radio size="small" />}
                        label="Other"
                      />
                    </RadioGroup>
                  </FormControl>
                </Stack>
                <DatePicker
                  label="Date of birth"
                  disableFuture
                  onChange={(date) => setFieldValue('date_of_birth', date)}
                  inputFormat="yyyy/MM/dd"
                  disabled={isSubmitting}
                  renderInput={(params) => (
                    <TextField
                      {...getFieldProps('date_of_birth')}
                      error={Boolean(touched.date_of_birth && errors.date_of_birth)}
                      helperText={touched.date_of_birth && errors.date_of_birth}
                      {...params}
                      InputProps={{
                        classes: {
                          notchedOutline: values.date_of_birth ? classes.notchedOutline : ''
                        }
                      }}
                      sx={{ width: '50%' }}
                      size="small"
                    />
                  )}
                />
                <TextField
                  sx={{ width: '50%' }}
                  label="Social security number"
                  type="number"
                  size="small"
                  InputProps={{
                    classes: {
                      notchedOutline: values.social_security_number ? classes.notchedOutline : ''
                    }
                  }}
                  disabled={isSubmitting}
                  value={values.social_security_number}
                  {...getFieldProps('social_security_number')}
                  error={Boolean(touched.social_security_number && errors.social_security_number)}
                  helperText={touched.social_security_number && errors.social_security_number}
                />
                <TextField
                  sx={{ width: '50%' }}
                  type="number"
                  label="External reference id"
                  size="small"
                  value={values.external_reference_id}
                  InputProps={{
                    classes: {
                      notchedOutline: values.external_reference_id ? classes.notchedOutline : ''
                    }
                  }}
                  disabled={isSubmitting}
                  {...getFieldProps('external_reference_id')}
                  error={Boolean(touched.external_reference_id && errors.external_reference_id)}
                  helperText={touched.external_reference_id && errors.external_reference_id}
                />
              </Stack>
              <Stack mt={2} direction="row-reverse" fullWidth>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={resetForm}
                  loading={isSubmitting}
                >
                  Discard changes
                </Button>
                <LoadingButton
                  sx={{ mr: 1 }}
                  size="small"
                  type="submit"
                  variant="outlined"
                  loading={isSubmitting}
                >
                  Save changes
                </LoadingButton>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Form>
      </FormikProvider>
    </>
  );
};

BasicInfoForm.propTypes = {
  onSubmittion: PropTypes.any,
  SnacbarViewer: PropTypes.any,
  patientId: PropTypes.any,
  id: PropTypes.any,
  setBasicInfo: PropTypes.any,
  BasicRef: PropTypes.any
};

export default BasicInfoForm;
