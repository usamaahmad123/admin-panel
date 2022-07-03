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
import { LoadingButton } from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { getPatient, UpdatePatients } from '../utils/Index';
import '../pages/StyleSheet.css';
import useStyles from './useStyles';
// ----------------------------------------------------------------------
let openForFirstTime = true;
const phoneRegExp = /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;
const ContactInfoForm = ({
  id,
  patientId,
  onSubmittion,
  SnacbarViewer,
  setContactInfo,
  ContactRef
}) => {
  const [expanded, setExpanded] = useState(true);
  const classes = useStyles();
  useEffect(() => {
    contactCall();
  }, []);
  const handleAccordianChange = (event, newExpanded) => {
    if (newExpanded && openForFirstTime) {
      openForFirstTime = false;
      contactCall();
    }
    setExpanded(newExpanded);
  };
  const RegisterSchema = Yup.object().shape({
    prefered_phone_number: Yup.string().matches(phoneRegExp, 'Only US number format is acceptable'),
    other_phone_number: Yup.string().matches(phoneRegExp, 'Only US number format is acceptable'),
    emergency_contact_phone: Yup.string().matches(
      phoneRegExp,
      'Only US number format is acceptable'
    ),
    parent_contact_phone: Yup.string().matches(phoneRegExp, 'Only US number format is acceptable'),
    other_contact_phone: Yup.string().matches(phoneRegExp, 'Only US number format is acceptable')
  });
  const contactCall = () => {
    if (patientId) {
      getPatient(patientId).then((res) => {
        if (res.success) {
          if (res.data.email_address) {
            setContactInfo(true);
          }
          formik.setFieldValue('street_address', res.data.street_address || '');
          formik.setFieldValue('city', res.data.city || '');
          formik.setFieldValue('state', res.data.state || '');
          formik.setFieldValue('zip', res.data?.zip || null);
          formik.setFieldValue('prefered_phone_number', res.data.prefered_phone_number || '');
          formik.setFieldValue('other_phone_number', res.data.other_phone_number || '');
          formik.setFieldValue('email_address', res.data.email_address || '');
          formik.setFieldValue('emergency_contact_name', res.data.emergency_contact_name || '');
          formik.setFieldValue('emergency_contact_phone', res.data.emergency_contact_phone || '');
          formik.setFieldValue('parent_contact_name', res.data.parent_contact_name || '');
          formik.setFieldValue('parent_contact_phone', res.data.parent_contact_phone || '');
          formik.setFieldValue('other_contact_name', res.data.other_contact_name || '');
          formik.setFieldValue('other_contact_phone', res.data.other_contact_phone || '');
          formik.setFieldValue('prefered_phone_type', res.data.prefered_phone_type || '');
          formik.setFieldValue('other_phone_type', res.data.other_phone_type || '');
          formik.setFieldValue('parent_phone_type', res.data.parent_phone_type || '');
          formik.setFieldValue('others_phone_type', res.data.others_phone_type || '');
          formik.setFieldValue('emergency_phone_type', res.data.emergency_phone_type || '');
        }
      });
    }
  };
  const formik = useFormik({
    initialValues: {
      street_address: '',
      city: '',
      state: '',
      zip: '',
      prefered_phone_number: '',
      other_phone_number: '',
      email_address: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      parent_contact_name: '',
      parent_contact_phone: '',
      other_contact_name: '',
      other_contact_phone: '',
      prefered_phone_type: 'Cell',
      other_phone_type: 'Home',
      others_phone_type: 'Cell',
      parent_phone_type: 'Home',
      emergency_phone_type: 'Home'
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        await UpdatePatients(values, patientId).then((res) => {
          if (res.success) {
            SnacbarViewer(res.message, 'success');
            onSubmittion();
          } else {
            SnacbarViewer(res.message, 'error');
          }
        });
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
            ref={ContactRef}
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
                  Contact us
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Stack fullWidth spacing={3}>
                {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <TextField
                    label="Street address"
                    size="small"
                    sx={{ width: '30%' }}
                    InputProps={{
                      classes: {
                        notchedOutline: values.street_address ? classes.notchedOutline : ''
                      }
                    }}
                    disabled={isSubmitting}
                    {...getFieldProps('street_address')}
                    error={Boolean(touched.street_address && errors.street_address)}
                    helperText={touched.street_address && errors.street_address}
                  />
                  <TextField
                    label="City"
                    size="small"
                    sx={{ width: '30%' }}
                    InputProps={{
                      classes: {
                        notchedOutline: values.city ? classes.notchedOutline : ''
                      }
                    }}
                    disabled={isSubmitting}
                    {...getFieldProps('city')}
                    error={Boolean(touched.city && errors.city)}
                    helperText={touched.city && errors.city}
                  />
                  <TextField
                    label="State"
                    size="small"
                    sx={{ width: '20%' }}
                    InputProps={{
                      classes: {
                        notchedOutline: values.state ? classes.notchedOutline : ''
                      }
                    }}
                    disabled={isSubmitting}
                    {...getFieldProps('state')}
                    error={Boolean(touched.state && errors.state)}
                    helperText={touched.state && errors.state}
                  />
                  <TextField
                    type="number"
                    label="Zip"
                    size="small"
                    sx={{ width: '20%' }}
                    InputProps={{
                      classes: {
                        notchedOutline: values.zip ? classes.notchedOutline : ''
                      }
                    }}
                    disabled={isSubmitting}
                    {...getFieldProps('zip')}
                    error={Boolean(touched.zip && errors.zip)}
                    helperText={touched.zip && errors.zip}
                  />
                </Stack>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  spacing={1}
                >
                  <TextField
                    type="text"
                    label="Preffered phone number"
                    size="small"
                    sx={{ my: 'auto', width: '30%' }}
                    InputProps={{
                      classes: {
                        notchedOutline: values.prefered_phone_number ? classes.notchedOutline : ''
                      }
                    }}
                    /* eslint-disable */
                    onBlurCapture={(e) => {
                      const x = e.target.value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/);
                      if (x?.length >= 4) {
                        setFieldValue('prefered_phone_number', x[1] + '-' + x[2] + '-' + x[3]);
                      }
                    }}
                    disabled={isSubmitting}
                    {...getFieldProps('prefered_phone_number')}
                    error={Boolean(touched.prefered_phone_number && errors.prefered_phone_number)}
                    helperText={touched.prefered_phone_number && errors.prefered_phone_number}
                  />
                  <FormControl
                    sx={{ width: '50%' }}
                    style={{
                      borderRadius: 10,
                      padding: 10,
                      paddingBottom: 5,
                      background: '#ebeaea'
                    }}
                  >
                    <FormLabel id="phoneradio">Phone type</FormLabel>
                    <RadioGroup
                      labelId="phoneradio"
                      aria-labelledby="phoneradio"
                      row
                      {...getFieldProps('prefered_phone_type')}
                    >
                      <FormControlLabel
                        sx={{ mr: 3 }}
                        value="Cell"
                        control={<Radio size="small" />}
                        label="Cell"
                      />
                      <FormControlLabel
                        sx={{ mr: 3 }}
                        value="Home"
                        control={<Radio size="small" />}
                        label="Home"
                      />
                      <FormControlLabel
                        sx={{ mr: 3 }}
                        value="Office"
                        control={<Radio size="small" />}
                        label="Office"
                      />
                    </RadioGroup>
                  </FormControl>
                </Stack>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  spacing={2}
                >
                  <TextField
                    type="text"
                    label="Other phone number"
                    size="small"
                    sx={{ my: 'auto', width: '30%' }}
                    InputProps={{
                      classes: {
                        notchedOutline: values.other_phone_number ? classes.notchedOutline : ''
                      }
                    }}
                    /* eslint-disable */
                    onBlurCapture={(e) => {
                      const x = e.target.value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/);
                      if (x?.length >= 4) {
                        setFieldValue('other_phone_number', x[1] + '-' + x[2] + '-' + x[3]);
                      }
                    }}
                    disabled={isSubmitting}
                    {...getFieldProps('other_phone_number')}
                    error={Boolean(touched.other_phone_number && errors.other_phone_number)}
                    helperText={touched.other_phone_number && errors.other_phone_number}
                  />
                  <FormControl
                    sx={{ width: '50%' }}
                    style={{
                      borderRadius: 10,
                      padding: 10,
                      paddingBottom: 5,
                      background: '#ebeaea'
                    }}
                  >
                    <FormLabel id="phoneradio">Phone type</FormLabel>
                    <RadioGroup
                      labelId="phoneradio"
                      aria-labelledby="phoneradio"
                      row
                      {...getFieldProps('other_phone_type')}
                    >
                      <FormControlLabel
                        sx={{ mr: 3 }}
                        value="Cell"
                        control={<Radio size="small" />}
                        label="Cell"
                      />
                      <FormControlLabel
                        sx={{ mr: 3 }}
                        value="Home"
                        control={<Radio size="small" />}
                        label="Home"
                      />
                      <FormControlLabel
                        sx={{ mr: 3 }}
                        value="Office"
                        control={<Radio size="small" />}
                        label="Office"
                      />
                    </RadioGroup>
                  </FormControl>
                </Stack>
                <Stack>
                  <TextField
                    sx={{ width: '30%' }}
                    type="email"
                    label="Email address"
                    size="small"
                    InputProps={{
                      classes: {
                        notchedOutline: values.email_address ? classes.notchedOutline : ''
                      }
                    }}
                    disabled={isSubmitting}
                    {...getFieldProps('email_address')}
                    error={Boolean(touched.email_address && errors.email_address)}
                    helperText={touched.email_address && errors.email_address}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={1}>
                  <TextField
                    label="Emergency contact"
                    size="small"
                    sx={{ my: 'auto', width: '25%' }}
                    InputProps={{
                      classes: {
                        notchedOutline: values.emergency_contact_name ? classes.notchedOutline : ''
                      }
                    }}
                    disabled={isSubmitting}
                    {...getFieldProps('emergency_contact_name')}
                    error={Boolean(touched.emergency_contact_name && errors.emergency_contact_name)}
                    helperText={touched.emergency_contact_name && errors.emergency_contact_name}
                  />
                  <TextField
                    type="text"
                    label="Emergency contact phone"
                    size="small"
                    sx={{ my: 'auto', width: '25%' }}
                    InputProps={{
                      classes: {
                        notchedOutline: values.emergency_contact_phone ? classes.notchedOutline : ''
                      }
                    }}
                    /* eslint-disable */
                    onBlurCapture={(e) => {
                      const x = e.target.value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/);
                      if (x?.length >= 4) {
                        setFieldValue('emergency_contact_phone', x[1] + '-' + x[2] + '-' + x[3]);
                      }
                    }}
                    disabled={isSubmitting}
                    {...getFieldProps('emergency_contact_phone')}
                    error={Boolean(
                      touched.emergency_contact_phone && errors.emergency_contact_phone
                    )}
                    helperText={touched.emergency_contact_phone && errors.emergency_contact_phone}
                  />
                  <FormControl
                    sx={{ width: '50%' }}
                    style={{
                      borderRadius: 10,
                      padding: 10,
                      paddingBottom: 5,
                      background: '#ebeaea'
                    }}
                  >
                    <FormLabel id="phoneradio">Phone type</FormLabel>
                    <RadioGroup
                      labelId="phoneradio"
                      aria-labelledby="phoneradio"
                      row
                      {...getFieldProps('emergency_phone_type')}
                    >
                      <FormControlLabel
                        sx={{ mr: 3 }}
                        value="Cell"
                        control={<Radio size="small" />}
                        label="Cell"
                      />
                      <FormControlLabel
                        sx={{ mr: 3 }}
                        value="Home"
                        control={<Radio size="small" />}
                        label="Home"
                      />
                      <FormControlLabel
                        sx={{ mr: 3 }}
                        value="Office"
                        control={<Radio size="small" />}
                        label="Office"
                      />
                    </RadioGroup>
                  </FormControl>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={1}>
                  <TextField
                    label="Parent / Guardian name"
                    size="small"
                    sx={{ my: 'auto', width: '25%' }}
                    InputProps={{
                      classes: {
                        notchedOutline: values.parent_contact_name ? classes.notchedOutline : ''
                      }
                    }}
                    disabled={isSubmitting}
                    {...getFieldProps('parent_contact_name')}
                    error={Boolean(touched.parent_contact_name && errors.parent_contact_name)}
                    helperText={touched.parent_contact_name && errors.parent_contact_name}
                  />
                  <TextField
                    type="text"
                    label="Parent / Guardian phone #"
                    size="small"
                    sx={{ my: 'auto', width: '25%' }}
                    InputProps={{
                      classes: {
                        notchedOutline: values.parent_contact_phone ? classes.notchedOutline : ''
                      }
                    }}
                    disabled={isSubmitting}
                    /* eslint-disable */
                    onBlurCapture={(e) => {
                      const x = e.target.value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/);
                      if (x?.length >= 4) {
                        setFieldValue('parent_contact_phone', x[1] + '-' + x[2] + '-' + x[3]);
                      }
                    }}
                    {...getFieldProps('parent_contact_phone')}
                    error={Boolean(touched.parent_contact_phone && errors.parent_contact_phone)}
                    helperText={touched.parent_contact_phone && errors.parent_contact_phone}
                  />
                  <FormControl
                    sx={{ width: '50%' }}
                    style={{
                      borderRadius: 10,
                      padding: 10,
                      paddingBottom: 5,
                      background: '#ebeaea'
                    }}
                  >
                    <FormLabel id="phoneradio">Phone type</FormLabel>
                    <RadioGroup
                      labelId="phoneradio"
                      aria-labelledby="phoneradio"
                      row
                      {...getFieldProps('parent_phone_type')}
                    >
                      <FormControlLabel
                        sx={{ mr: 3 }}
                        value="Cell"
                        control={<Radio size="small" />}
                        label="Cell"
                      />
                      <FormControlLabel
                        sx={{ mr: 3 }}
                        value="Home"
                        control={<Radio size="small" />}
                        label="Home"
                      />
                      <FormControlLabel
                        sx={{ mr: 3 }}
                        value="Office"
                        control={<Radio size="small" />}
                        label="Office"
                      />
                    </RadioGroup>
                  </FormControl>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={1}>
                  <TextField
                    label="Other parent name"
                    size="small"
                    sx={{ my: 'auto', width: '25%' }}
                    InputProps={{
                      classes: {
                        notchedOutline: values.other_contact_name ? classes.notchedOutline : ''
                      }
                    }}
                    disabled={isSubmitting}
                    {...getFieldProps('other_contact_name')}
                    error={Boolean(touched.other_contact_name && errors.other_contact_name)}
                    helperText={touched.other_contact_name && errors.other_contact_name}
                  />
                  <TextField
                    type="text"
                    label="Other parent phone #"
                    size="small"
                    sx={{ my: 'auto', width: '25%' }}
                    InputProps={{
                      classes: {
                        notchedOutline: values.other_contact_phone ? classes.notchedOutline : ''
                      }
                    }}
                    /* eslint-disable */
                    onBlurCapture={(e) => {
                      const x = e.target.value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/);
                      if (x?.length >= 4) {
                        setFieldValue('other_contact_phone', x[1] + '-' + x[2] + '-' + x[3]);
                      }
                    }}
                    disabled={isSubmitting}
                    {...getFieldProps('other_contact_phone')}
                    error={Boolean(touched.other_contact_phone && errors.other_contact_phone)}
                    helperText={touched.other_contact_phone && errors.other_contact_phone}
                  />
                  <FormControl
                    sx={{ width: '50%' }}
                    style={{
                      borderRadius: 10,
                      padding: 10,
                      paddingBottom: 5,
                      background: '#ebeaea'
                    }}
                  >
                    <FormLabel id="phoneradio">Phone type</FormLabel>
                    <RadioGroup
                      labelId="phoneradio"
                      aria-labelledby="phoneradio"
                      row
                      {...getFieldProps('others_phone_type')}
                    >
                      <FormControlLabel
                        sx={{ mr: 3 }}
                        value="Cell"
                        control={<Radio size="small" />}
                        label="Cell"
                      />
                      <FormControlLabel
                        sx={{ mr: 3 }}
                        value="Home"
                        control={<Radio size="small" />}
                        label="Home"
                      />
                      <FormControlLabel
                        sx={{ mr: 3 }}
                        value="Office"
                        control={<Radio size="small" />}
                        label="Office"
                      />
                    </RadioGroup>
                  </FormControl>
                </Stack>
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
                  disabled={!id}
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

ContactInfoForm.propTypes = {
  id: PropTypes.any,
  patientId: PropTypes.any,
  onSubmittion: PropTypes.any,
  SnacbarViewer: PropTypes.any,
  setContactInfo: PropTypes.any,
  ContactRef: PropTypes.any
};
export default ContactInfoForm;
