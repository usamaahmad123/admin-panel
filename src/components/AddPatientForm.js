import { Icon } from '@iconify/react';
import { useState, forwardRef } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
// material
import { Stack, TextField, IconButton, InputAdornment } from '@material-ui/core';
import { LoadingButton, DatePicker } from '@material-ui/lab';
import MuiAlert from '@mui/material/Alert';
import closeFill from '@iconify/icons-eva/close-fill';
// components
import { AddPatient } from '../utils/Index';
import { NameField } from '../utils/formatTime';

const Alert = forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const phoneMessage =
  'This should be a cell phone number and not a landline number. Also, dashes are not allowed.';
function AddPatientForm({ patientAdded }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [phone, setPhone] = useState(false);

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
        await AddPatient(values).then((res) => {
          if (res?.success) {
            SnacbarViewer(res?.message, 'success');
            patientAdded();
            resetForm();
          } else {
            SnacbarViewer(res?.message, 'error');
          }
        });
      } catch (error) {
        setErrors({ afterSubmit: error.message });
        setSubmitting(false);
      }
    }
  });
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
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue } =
    formik;

  return (
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
              disabled={isSubmitting}
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
                  helperText={touched.dateOfBirth && errors.dateOfBirth}
                />
              )}
              disableFuture
              disabled={isSubmitting}
              inputFormat="yyyy/MM/dd"
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
  );
}

export default AddPatientForm;
