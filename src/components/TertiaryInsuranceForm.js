import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
// material
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
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@material-ui/core';
import { LoadingButton, DatePicker } from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import '../pages/StyleSheet.css';
import useStyles from './useStyles';
import { AddInsurance, getInsurance, UpdateInsurance } from '../utils/Index';

// ----------------------------------------------------------------------
let insuranceExists = false;
let openForFirstTime = true;
const phoneRegExp = /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;
const TertiaryInsuranceForm = ({
  onSubmittion,
  SnacbarViewer,
  id,
  setTertiaryInfo,
  TertiaryRef
}) => {
  const [expanded, setExpanded] = useState(true);
  const classes = useStyles();
  useEffect(() => {
    tertiaryCall();
  }, []);
  const handleAccordianChange = (event, newExpanded) => {
    if (newExpanded && openForFirstTime) {
      openForFirstTime = false;
      tertiaryCall();
    }
    setExpanded(newExpanded);
  };
  const tertiaryCall = () => {
    if (id) {
      getInsurance(id).then((res) => {
        if (res.success) {
          for (let i = 0; i < res.data.length; i += 1) {
            if (res.data[i].insurance_type === 'Tertiary Insurance') {
              setTertiaryInfo(true);
              insuranceExists = true;
              formik.setFieldValue(
                'insurance_type',
                res.data[i].insurance_type || 'Tertiary Insurance'
              );
              formik.setFieldValue('se_address', res.data[i].se_address || '');
              formik.setFieldValue('se_city', res.data[i]?.se_city || '');
              formik.setFieldValue('se_street', res.data[i].se_street || '');
              formik.setFieldValue('se_zip', res.data[i].se_zip || '');
              formik.setFieldValue(
                'relationship_to_subscriber',
                res.data[i].relationship_to_subscriber || ''
              );
              formik.setFieldValue('subscriber_name', res.data[i].subscriber_name || '');
              formik.setFieldValue('subscriber_dob', res.data[i].subscriber_dob || '');
              formik.setFieldValue('subscriber_sex', res.data[i].subscriber_sex || '');
              formik.setFieldValue('subscriber_ssn', res.data[i].subscriber_ssn || '');
              formik.setFieldValue('subscriber_address', res.data[i].subscriber_address || '');
              formik.setFieldValue('subscriber_city', res.data[i].subscriber_city || '');
              formik.setFieldValue('subscriber_street', res.data[i].subscriber_street || '');
              formik.setFieldValue('subscriber_zip', res.data[i].subscriber_zip || '');
              formik.setFieldValue('subscriber_phone', res.data[i].subscriber_phone || '');
              formik.setFieldValue('copay', res.data[i].copay || '');
              formik.setFieldValue('accept_assignment', res.data[i].accept_assignment || '');
              formik.setFieldValue(
                'secondary_medicure_type',
                res.data[i].secondary_medicure_type || ''
              );
              formik.setFieldValue('insurance_provider', res.data[i].insurance_provider || '');
              formik.setFieldValue('plan_name', res.data[i].plan_name || '');
              formik.setFieldValue('policy_number', res.data[i].policy_number || '');
              formik.setFieldValue('group_number', res.data[i].group_number || '');
              formik.setFieldValue('subscriber_employer', res.data[i].subscriber_employer || '');
              formik.setFieldValue('work', res.data[i].work || 'My policy (self)');
              formik.setFieldValue('effective_date', new Date(res.data[i].effective_date || ''));
            }
          }
        }
      });
    }
  };
  const RegisterSchema = Yup.object().shape({
    effective_date: Yup.date().nullable().required('Effective date is required'),
    subscriber_phone: Yup.string().matches(phoneRegExp, 'Only US number format is acceptable')
  });
  const formik = useFormik({
    initialValues: {
      patient_id: id,
      insurance_type: 'Tertiary Insurance',
      se_address: '',
      se_city: '',
      se_street: '',
      se_zip: '',
      relationship_to_subscriber: '',
      subscriber_name: '',
      subscriber_dob: '2222-12-22',
      subscriber_sex: 'Male',
      subscriber_ssn: '',
      subscriber_address: '',
      subscriber_city: '',
      subscriber_street: '',
      subscriber_zip: '',
      subscriber_phone: '',
      copay: 'lki',
      accept_assignment: 'yo',
      secondary_medicure_type: 'xyz',
      insurance_provider: '',
      plan_name: '',
      policy_number: '',
      effective_date: new Date(),
      group_number: '',
      subscriber_employer: '',
      work: 'My policy (self)'
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        values.patient_id = id;
        if (insuranceExists) {
          await UpdateInsurance(values, id).then((res) => {
            if (res.success) {
              SnacbarViewer(res.message, 'success');
              onSubmittion();
            } else {
              SnacbarViewer(res.message, 'error');
            }
          });
        } else {
          await AddInsurance(values).then((res) => {
            if (res.success) {
              SnacbarViewer(res.message, 'success');
              onSubmittion();
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
        <Form style={{ width: '100%' }} autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Accordion
            ref={TertiaryRef}
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
                  Tertiary insurance
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Stack fullWidth spacing={3}>
                {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}
                <FormControl
                  fullWidth
                  style={{ borderRadius: 10, padding: 10, background: '#ebeaea' }}
                >
                  <FormLabel id="genderradio">Work status</FormLabel>
                  <RadioGroup
                    labelId="genderradio"
                    aria-labelledby="genderradio"
                    row
                    sx={{ mb: 2 }}
                    {...getFieldProps('work')}
                  >
                    <FormControlLabel
                      sx={{ mr: 3 }}
                      value="My policy (self)"
                      control={<Radio size="small" />}
                      label="My policy (self)"
                    />
                    <FormControlLabel
                      sx={{ mr: 3 }}
                      value="Spouse"
                      control={<Radio size="small" />}
                      label="Spouse"
                    />
                    <FormControlLabel
                      sx={{ mr: 3 }}
                      value="Parent"
                      control={<Radio size="small" />}
                      label="Parent"
                    />
                    <FormControlLabel
                      sx={{ mr: 3 }}
                      value="Other"
                      control={<Radio size="small" />}
                      label="Other"
                    />
                  </RadioGroup>
                </FormControl>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Tertiary insurance provider name"
                    size="small"
                    InputProps={{
                      classes: {
                        notchedOutline: values.insurance_provider ? classes.notchedOutline : ''
                      }
                    }}
                    disabled={isSubmitting}
                    {...getFieldProps('insurance_provider')}
                    error={Boolean(touched.insurance_provider && errors.insurance_provider)}
                    helperText={touched.insurance_provider && errors.insurance_provider}
                  />
                  <TextField
                    fullWidth
                    label="Plan name"
                    size="small"
                    InputProps={{
                      classes: {
                        notchedOutline: values.plan_name ? classes.notchedOutline : ''
                      }
                    }}
                    disabled={isSubmitting}
                    {...getFieldProps('plan_name')}
                    error={Boolean(touched.plan_name && errors.plan_name)}
                    helperText={touched.plan_name && errors.plan_name}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={1}>
                  <DatePicker
                    label="Effective date"
                    onChange={(date) => setFieldValue('effective_date', date)}
                    disabled={isSubmitting}
                    renderInput={(params) => (
                      <TextField
                        {...getFieldProps('effective_date')}
                        error={Boolean(touched.effective_date && errors.effective_date)}
                        helperText={touched.effective_date && errors.effective_date}
                        {...params}
                        InputProps={{
                          classes: {
                            notchedOutline: values.effective_date ? classes.notchedOutline : ''
                          }
                        }}
                        fullWidth
                        size="small"
                      />
                    )}
                    inputFormat="yyyy/MM/dd"
                  />
                  <TextField
                    fullWidth
                    label="Policy Number"
                    size="small"
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.policy_number ? classes.notchedOutline : ''
                      }
                    }}
                    {...getFieldProps('policy_number')}
                    error={Boolean(touched.policy_number && errors.policy_number)}
                    helperText={touched.policy_number && errors.policy_number}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={1}>
                  <TextField
                    fullWidth
                    label="Group number"
                    type="number"
                    size="small"
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.group_number ? classes.notchedOutline : ''
                      }
                    }}
                    {...getFieldProps('group_number')}
                    error={Boolean(touched.group_number && errors.group_number)}
                    helperText={touched.group_number && errors.group_number}
                  />
                  <TextField
                    fullWidth
                    type="text"
                    label="Subscriber employer"
                    size="small"
                    value={values.subscriber_employer}
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.subscriber_employer ? classes.notchedOutline : ''
                      }
                    }}
                    {...getFieldProps('subscriber_employer')}
                    error={Boolean(touched.subscriber_employer && errors.subscriber_employer)}
                    helperText={touched.subscriber_employer && errors.subscriber_employer}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <TextField
                    label="Street address"
                    size="small"
                    sx={{ width: '30%' }}
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.se_address ? classes.notchedOutline : ''
                      }
                    }}
                    {...getFieldProps('se_address')}
                    error={Boolean(touched.se_address && errors.se_address)}
                    helperText={touched.se_address && errors.se_address}
                  />
                  <TextField
                    label="City"
                    size="small"
                    sx={{ width: '30%' }}
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.se_city ? classes.notchedOutline : ''
                      }
                    }}
                    {...getFieldProps('se_city')}
                    error={Boolean(touched.se_city && errors.se_city)}
                    helperText={touched.se_city && errors.se_city}
                  />
                  <TextField
                    label="Street"
                    size="small"
                    sx={{ width: '20%' }}
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.se_street ? classes.notchedOutline : ''
                      }
                    }}
                    {...getFieldProps('se_street')}
                    error={Boolean(touched.se_street && errors.se_street)}
                    helperText={touched.se_street && errors.se_street}
                  />
                  <TextField
                    type="number"
                    label="Zip"
                    size="small"
                    sx={{ width: '20%' }}
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.se_zip ? classes.notchedOutline : ''
                      }
                    }}
                    {...getFieldProps('se_zip')}
                    error={Boolean(touched.se_zip && errors.se_zip)}
                    helperText={touched.se_zip && errors.se_zip}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <TextField
                    label="Relationship to subscriber"
                    size="small"
                    fullWidth
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.relationship_to_subscriber
                          ? classes.notchedOutline
                          : ''
                      }
                    }}
                    {...getFieldProps('relationship_to_subscriber')}
                    error={Boolean(
                      touched.relationship_to_subscriber && errors.relationship_to_subscriber
                    )}
                    helperText={
                      touched.relationship_to_subscriber && errors.relationship_to_subscriber
                    }
                  />
                  <TextField
                    label="Subscriber name"
                    size="small"
                    fullWidth
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.subscriber_name ? classes.notchedOutline : ''
                      }
                    }}
                    {...getFieldProps('subscriber_name')}
                    error={Boolean(touched.subscriber_name && errors.subscriber_name)}
                    helperText={touched.subscriber_name && errors.subscriber_name}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <DatePicker
                    label="Subscriber dob"
                    onChange={(date) => setFieldValue('subscriber_dob', date)}
                    disabled={isSubmitting}
                    renderInput={(params) => (
                      <TextField
                        {...getFieldProps('subscriber_dob')}
                        error={Boolean(touched.subscriber_dob && errors.subscriber_dob)}
                        helperText={touched.subscriber_dob && errors.subscriber_dob}
                        InputProps={{
                          classes: {
                            notchedOutline: values.subscriber_dob ? classes.notchedOutline : ''
                          }
                        }}
                        {...params}
                        fullWidth
                        size="small"
                      />
                    )}
                    inputFormat="yyyy/MM/dd"
                  />
                  <TextField
                    label="Subscriber sex"
                    size="small"
                    fullWidth
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.subscriber_sex ? classes.notchedOutline : ''
                      }
                    }}
                    {...getFieldProps('subscriber_sex')}
                    error={Boolean(touched.subscriber_sex && errors.subscriber_sex)}
                    helperText={touched.subscriber_sex && errors.subscriber_sex}
                  />
                  <TextField
                    label="Subscriber ssn"
                    size="small"
                    fullWidth
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.subscriber_ssn ? classes.notchedOutline : ''
                      }
                    }}
                    {...getFieldProps('subscriber_ssn')}
                    error={Boolean(touched.subscriber_ssn && errors.subscriber_ssn)}
                    helperText={touched.subscriber_ssn && errors.subscriber_ssn}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <TextField
                    label="Subscriber address"
                    size="small"
                    fullWidth
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.subscriber_address ? classes.notchedOutline : ''
                      }
                    }}
                    {...getFieldProps('subscriber_address')}
                    error={Boolean(touched.subscriber_address && errors.subscriber_address)}
                    helperText={touched.subscriber_address && errors.subscriber_address}
                  />
                  <TextField
                    label="Subscriber city"
                    size="small"
                    fullWidth
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.subscriber_city ? classes.notchedOutline : ''
                      }
                    }}
                    {...getFieldProps('subscriber_city')}
                    error={Boolean(touched.subscriber_city && errors.subscriber_city)}
                    helperText={touched.subscriber_city && errors.subscriber_city}
                  />
                  <TextField
                    label="Subscriber street"
                    size="small"
                    fullWidth
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.subscriber_street ? classes.notchedOutline : ''
                      }
                    }}
                    {...getFieldProps('subscriber_street')}
                    error={Boolean(touched.subscriber_street && errors.subscriber_street)}
                    helperText={touched.subscriber_street && errors.subscriber_street}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <TextField
                    type="number"
                    label="Subscriber zip"
                    size="small"
                    fullWidth
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.subscriber_zip ? classes.notchedOutline : ''
                      }
                    }}
                    {...getFieldProps('subscriber_zip')}
                    error={Boolean(touched.subscriber_zip && errors.subscriber_zip)}
                    helperText={touched.subscriber_zip && errors.subscriber_zip}
                  />
                  <TextField
                    fullWidth
                    type="text"
                    label="Subscriber phone #"
                    size="small"
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.subscriber_phone ? classes.notchedOutline : ''
                      }
                    }}
                    /* eslint-disable */
                    onBlurCapture={(e) => {
                      const x = e.target.value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/);
                      if (x?.length >= 4) {
                        setFieldValue('subscriber_phone', x[1] + '-' + x[2] + '-' + x[3]);
                      }
                    }}
                    {...getFieldProps('subscriber_phone')}
                    error={Boolean(touched.subscriber_phone && errors.subscriber_phone)}
                    helperText={touched.subscriber_phone && errors.subscriber_phone}
                  />
                  <TextField
                    fullWidth
                    label="Copay"
                    size="small"
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.copay ? classes.notchedOutline : ''
                      }
                    }}
                    {...getFieldProps('copay')}
                    error={Boolean(touched.copay && errors.copay)}
                    helperText={touched.copay && errors.copay}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <TextField
                    label="Accept assignment"
                    size="small"
                    fullWidth
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.accept_assignment ? classes.notchedOutline : ''
                      }
                    }}
                    {...getFieldProps('accept_assignment')}
                    error={Boolean(touched.accept_assignment && errors.accept_assignment)}
                    helperText={touched.accept_assignment && errors.accept_assignment}
                  />
                  <TextField
                    fullWidth
                    label="Secondary medicure type"
                    size="small"
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.secondary_medicure_type ? classes.notchedOutline : ''
                      }
                    }}
                    {...getFieldProps('secondary_medicure_type')}
                    error={Boolean(
                      touched.secondary_medicure_type && errors.secondary_medicure_type
                    )}
                    helperText={touched.secondary_medicure_type && errors.secondary_medicure_type}
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
                    disabled={!id}
                    variant="outlined"
                    loading={isSubmitting}
                  >
                    Save changes
                  </LoadingButton>
                </Stack>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Form>
      </FormikProvider>
    </>
  );
};

TertiaryInsuranceForm.propTypes = {
  onSubmittion: PropTypes.any,
  SnacbarViewer: PropTypes.any,
  id: PropTypes.any,
  setTertiaryInfo: PropTypes.any,
  TertiaryRef: PropTypes.any
};
export default TertiaryInsuranceForm;
