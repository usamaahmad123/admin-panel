import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack5';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment, Alert } from '@material-ui/core';
import { LoadingButton, DatePicker } from '@material-ui/lab';
import { Register } from '../utils/Index';
import { lowercaseRegex, uppercaseRegex, numericRegex, specialRegex } from '../utils/constants';
import { NameField } from '../utils/formatTime';

// ----------------------------------------------------------------------
SignupForm.propTypes = {
  data: PropTypes.array
};
const emailMessage = 'This email address will be used for 2-Step verification or recovery.';
const phoneMessage =
  'This should be your cell phone number and not your landline number. Also, dashes are not allowed.';
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const passwordMsg =
  'Your password must contains at least 8 characters, one lowercase letter, one uppercase letter, one numeric digit and one special character';
export default function SignupForm({ data }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState(false);
  const [phone, setPhone] = useState(false);
  const navigate = useNavigate();
  const RegisterSchema = Yup.object().shape({
    firstName: data.filter((field) => field.label === 'First Name')[0]?.required
      ? Yup.string()
          .min(2, 'Too Short!')
          .max(20, 'Too Long!')
          .required('First name is required')
          .matches(/^[aA-zZ\s]+$/, 'First name is invalid')
          .strict()
      : Yup.string()
          .min(2, 'Too Short!')
          .max(20, 'Too Long!')
          .trim('Spaces not allowed')
          .matches(/^[aA-zZ\s]+$/, 'First name is invalid'),
    lastName: data.filter((field) => field.label === 'Last Name')[0]?.required
      ? Yup.string()
          .min(2, 'Too Short!')
          .max(20, 'Too Long!')
          .required('Last name is required')
          .matches(/^[aA-zZ\s]+$/, 'Last name is invalid')
          .strict()
      : Yup.string()
          .min(2, 'Too Short!')
          .max(20, 'Too Long!')
          .matches(/^[aA-zZ\s]+$/, 'Last name is invalid'),
    middleName: data.filter((field) => field.label === 'Middle Name')[0]?.required
      ? Yup.string()
          .min(2, 'Too Short!')
          .max(20, 'Too Long!')
          .required('Middle name is required')
          .matches(/^[aA-zZ\s]+$/, 'Middle name is invalid')
          .strict()
      : Yup.string()
          .min(2, 'Too Short!')
          .max(20, 'Too Long!')
          .matches(/^[aA-zZ\s]+$/, 'Middle name is invalid'),
    fullName: Yup.string()
      .min(3, 'Too Short!')
      .max(30, 'Too Long!')
      .required('Full name is required')
      .matches(/^[aA-zZ\s]+$/, 'Full name is invalid')
      .strict(),
    username: data.filter((field) => field.label === 'Username')[0]?.required
      ? Yup.string()
          .min(8, 'Too Short!')
          .max(20, 'Too Long!')
          .required('Username is required')
          .trim('Spaces not allowed')
      : Yup.string().min(8, 'Too Short!').max(20, 'Too Long!').trim('Spaces not allowed'),
    gender: data.filter((field) => field.label === 'Gender')[0]?.required
      ? Yup.string()
          .min(2, 'Too Short!')
          .max(20, 'Too Long!')
          .required('Gender is required')
          .matches(/^[aA-zZ\s]+$/, 'Gender is invalid')
          .strict()
      : Yup.string()
          .min(2, 'Too Short!')
          .max(20, 'Too Long!')
          .matches(/^[aA-zZ\s]+$/, 'Gender is invalid'),
    phoneNumber: Yup.string()
      .min(10, 'Too Short!')
      .max(11, 'Too Long!')
      .required('Phone Number is required and dashes are not allowed')
      .matches(phoneRegExp, 'Only numbers are required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .matches(lowercaseRegex, passwordMsg)
      .matches(uppercaseRegex, passwordMsg)
      .matches(numericRegex, passwordMsg)
      .matches(specialRegex, passwordMsg)
      .min(8, passwordMsg),
    address1: data.filter((field) => field.label === 'Street Address 1')[0]?.required
      ? Yup.string().min(8, 'Too Short!').max(150, 'Too Long!').required('Address is required')
      : Yup.string().min(8, 'Too Short!').max(150, 'Too Long!'),
    address2: data.filter((field) => field.label === 'Street Address 2')[0]?.required
      ? Yup.string().min(8, 'Too Short!').max(150, 'Too Long!').required('Addess is required')
      : Yup.string().min(8, 'Too Short!').max(150, 'Too Long!'),
    landline: data.filter((field) => field.label === 'Landline Number')[0]?.required
      ? Yup.string()
          .min(10, 'Too Short!')
          .max(11, 'Too Long!')
          .required('Landline Number is required and dashes are not allowed')
          .matches(phoneRegExp, 'Only numbers are required')
      : Yup.string()
          .min(10, 'Too Short!')
          .max(11, 'Too Long!')
          .matches(phoneRegExp, 'Only numbers are required'),
    secondaryEmail: data.filter((field) => field.label === 'Secondary Email')[0]?.required
      ? Yup.string()
          .email('Email must be a valid email address')
          .required('Secondary email is required')
      : Yup.string().email('Email must be a valid email address'),
    secondaryPhoneNumber: data.filter((field) => field.label === 'Secondary Phone Number')[0]
      ?.required
      ? Yup.string()
          .min(10, 'Too Short!')
          .max(11, 'Too Long!')
          .required('Phone number is required and dashes are not allowed')
          .matches(phoneRegExp, 'Only numbers are required')
      : Yup.string()
          .min(10, 'Too Short!')
          .max(11, 'Too Long!')
          .matches(phoneRegExp, 'Only numbers are required'),
    country: data.filter((field) => field.label === 'Country')[0]?.required
      ? Yup.string().min(2, 'Too Short!').max(150, 'Too Long!').required('Country is required')
      : Yup.string().min(2, 'Too Short!').max(150, 'Too Long!'),
    city: data.filter((field) => field.label === 'City')[0]?.required
      ? Yup.string().min(2, 'Too Short!').max(150, 'Too Long!').required('City is required')
      : Yup.string().min(2, 'Too Short!').max(150, 'Too Long!'),
    state: data.filter((field) => field.label === 'State')[0]?.required
      ? Yup.string().min(2, 'Too Short!').max(150, 'Too Long!').required('State is required')
      : Yup.string().min(2, 'Too Short!').max(150, 'Too Long!'),
    nationality: data.filter((field) => field.label === 'Nationality')[0]?.required
      ? Yup.string().min(2, 'Too Short!').max(150, 'Too Long!').required('Nationality is required')
      : Yup.string().min(2, 'Too Short!').max(150, 'Too Long!'),
    zipCode: data.filter((field) => field.label === 'Zip Code')[0]?.required
      ? Yup.string().min(2, 'Too Short!').max(6, 'Too Long!').required('Zip Code is required')
      : Yup.string().min(2, 'Too Short!').max(6, 'Too Long!'),
    maritalStatus: data.filter((field) => field.label === 'Marital Status')[0]?.required
      ? Yup.string()
          .min(2, 'Too Short!')
          .max(20, 'Too Long!')
          .required('Marital status is required')
      : Yup.string().min(2, 'Too Short!').max(20, 'Too Long!'),
    dob: data.filter((field) => field.label === 'Date of Birth')[0]?.required
      ? Yup.string().required('Date of birth is required')
      : Yup.string()
  });
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      username: '',
      email: '',
      password: '',
      middleName: '',
      fullName: '',
      gender: '',
      address1: '',
      address2: '',
      landline: '',
      secondaryEmail: '',
      secondaryPhoneNumber: '',
      country: '',
      city: '',
      state: '',
      nationality: '',
      zipCode: '',
      maritalStatus: '',
      dob: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        const keys = Object.keys(values);
        keys.forEach((key) => {
          if (!values[key]) {
            delete values[key];
          }
        });
        await Register(values).then((res) => {
          if (res?.success) {
            enqueueSnackbar('Registration successful. Kindly check your email for verification.', {
              variant: 'success',
              action: (key) => (
                <IconButton size="small" onClick={() => closeSnackbar(key)}>
                  <Icon icon={closeFill} />
                </IconButton>
              )
            });
            navigate('/login', { replace: true });
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
          setSubmitting(false);
        });
      } catch (error) {
        console.error(error);
        setErrors({ afterSubmit: error.message });
        setSubmitting(false);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}
          {msg && <Alert severity="warning">{emailMessage}</Alert>}
          {phone && <Alert severity="warning">{phoneMessage}</Alert>}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            {data.filter((field) => field.label === 'First Name')[0]?.included && (
              <TextField
                fullWidth
                label="First name*"
                size="small"
                onKeyDown={NameField}
                disabled={isSubmitting}
                {...getFieldProps('firstName')}
                error={Boolean(touched.firstName && errors.firstName)}
                helperText={touched.firstName && errors.firstName}
              />
            )}
            {data.filter((field) => field.label === 'Middle Name')[0]?.included && (
              <TextField
                fullWidth
                label="Middle name"
                size="small"
                onKeyDown={NameField}
                disabled={isSubmitting}
                {...getFieldProps('middleName')}
                error={Boolean(touched.middleName && errors.middleName)}
                helperText={touched.middleName && errors.middleName}
              />
            )}
            {data.filter((field) => field.label === 'Last Name')[0]?.included && (
              <TextField
                fullWidth
                label="Last name"
                size="small"
                onKeyDown={NameField}
                disabled={isSubmitting}
                {...getFieldProps('lastName')}
                error={Boolean(touched.lastName && errors.lastName)}
                helperText={touched.lastName && errors.lastName}
              />
            )}
          </Stack>
          <TextField
            fullWidth
            label="Full name*"
            size="small"
            disabled={isSubmitting}
            {...getFieldProps('fullName')}
            error={Boolean(touched.fullName && errors.fullName)}
            helperText={touched.fullName && errors.fullName}
          />
          {data.filter((field) => field.label === 'Gender')[0]?.included && (
            <TextField
              fullWidth
              label="Gender*"
              size="small"
              disabled={isSubmitting}
              {...getFieldProps('gender')}
              error={Boolean(touched.gender && errors.gender)}
              helperText={touched.gender && errors.gender}
            />
          )}
          {data.filter((field) => field.label === 'Username')[0]?.included && (
            <TextField
              fullWidth
              type="text"
              label="Username*"
              size="small"
              disabled={isSubmitting}
              {...getFieldProps('username')}
              error={Boolean(touched.username && errors.username)}
              helperText={touched.username && errors.username}
            />
          )}
          <TextField
            fullWidth
            // autoComplete="username"
            type="email"
            label="Email address*"
            size="small"
            disabled={isSubmitting}
            onFocus={() => setMsg(true)}
            onBlurCapture={() => setMsg(false)}
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            // autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password*"
            {...getFieldProps('password')}
            size="small"
            disabled={isSubmitting}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
          {(data.filter((field) => field.label === 'Street Address 1')[0]?.included ||
            data.filter((field) => field.label === 'Street Address 2')[0]?.included) && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              {data.filter((field) => field.label === 'Street Address 1')[0]?.included && (
                <TextField
                  fullWidth
                  label="Street Address 1"
                  size="small"
                  disabled={isSubmitting}
                  {...getFieldProps('address1')}
                  error={Boolean(touched.address1 && errors.address1)}
                  helperText={touched.address1 && errors.address1}
                />
              )}
              {data.filter((field) => field.label === 'Street Address 2')[0]?.included && (
                <TextField
                  fullWidth
                  label="Street Address 2"
                  size="small"
                  disabled={isSubmitting}
                  {...getFieldProps('address2')}
                  error={Boolean(touched.address2 && errors.address2)}
                  helperText={touched.address2 && errors.address2}
                />
              )}
            </Stack>
          )}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
            {data.filter((field) => field.label === 'Landline Number')[0]?.included && (
              <TextField
                fullWidth
                label="Landline number"
                type="number"
                size="small"
                // onFocus={() => setPhone(true)}
                // onBlurCapture={() => setPhone(false)}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: <InputAdornment position="start">+</InputAdornment>
                }}
                {...getFieldProps('landline')}
                error={Boolean(touched.landline && errors.landline)}
                helperText={touched.landline && errors.landline}
              />
            )}
          </Stack>
          {(data.filter((field) => field.label === 'City')[0]?.included ||
            data.filter((field) => field.label === 'Country')[0]?.included) && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              {data.filter((field) => field.label === 'Country')[0]?.included && (
                <TextField
                  fullWidth
                  label="Country"
                  size="small"
                  disabled={isSubmitting}
                  {...getFieldProps('country')}
                  error={Boolean(touched.country && errors.country)}
                  helperText={touched.country && errors.country}
                />
              )}
              {data.filter((field) => field.label === 'City')[0]?.included && (
                <TextField
                  fullWidth
                  label="City"
                  size="small"
                  disabled={isSubmitting}
                  {...getFieldProps('city')}
                  error={Boolean(touched.city && errors.city)}
                  helperText={touched.city && errors.city}
                />
              )}
            </Stack>
          )}
          {(data.filter((field) => field.label === 'Date of Birth')[0]?.included ||
            data.filter((field) => field.label === 'State')[0]?.included) && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              {data.filter((field) => field.label === 'State')[0]?.included && (
                <TextField
                  fullWidth
                  label="State"
                  size="small"
                  disabled={isSubmitting}
                  {...getFieldProps('state')}
                  error={Boolean(touched.state && errors.state)}
                  helperText={touched.state && errors.state}
                />
              )}
              {data.filter((field) => field.label === 'Date of Birth')[0]?.included && (
                <DatePicker
                  label="Date of birth"
                  {...getFieldProps('dob')}
                  onChange={(date) => setFieldValue('dob', date)}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      size="small"
                      {...params}
                      error={Boolean(touched.dob && errors.dob)}
                    />
                  )}
                  disableFuture
                  disabled={isSubmitting}
                  inputFormat="MM/dd/yyyy"
                />
              )}
            </Stack>
          )}
          {(data.filter((field) => field.label === 'Secondary Email')[0]?.included ||
            data.filter((field) => field.label === 'Secondary Phone Number')[0]?.included) && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              {data.filter((field) => field.label === 'Secondary Email')[0]?.included && (
                <TextField
                  fullWidth
                  label="Secondary email"
                  size="small"
                  type="email"
                  disabled={isSubmitting}
                  {...getFieldProps('secondaryEmail')}
                  error={Boolean(touched.secondaryEmail && errors.secondaryEmail)}
                  helperText={touched.secondaryEmail && errors.secondaryEmail}
                />
              )}
              {data.filter((field) => field.label === 'Secondary Phone Number')[0]?.included && (
                <TextField
                  fullWidth
                  label="Secondary phone number"
                  type="number"
                  size="small"
                  disabled={isSubmitting}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">+</InputAdornment>
                  }}
                  {...getFieldProps('secondaryPhoneNumber')}
                  error={Boolean(touched.secondaryPhoneNumber && errors.secondaryPhoneNumber)}
                  helperText={touched.secondaryPhoneNumber && errors.secondaryPhoneNumber}
                />
              )}
            </Stack>
          )}
          {(data.filter((field) => field.label === 'Nationality')[0]?.included ||
            data.filter((field) => field.label === 'Zip Code')[0]?.included ||
            data.filter((field) => field.label === 'Marital Status')[0]?.included) && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              {data.filter((field) => field.label === 'Nationality ')[0]?.included && (
                <TextField
                  fullWidth
                  label="Nationality"
                  size="small"
                  disabled={isSubmitting}
                  {...getFieldProps('nationality')}
                  error={Boolean(touched.nationality && errors.nationality)}
                  helperText={touched.nationality && errors.nationality}
                />
              )}
              {data.filter((field) => field.label === 'Zip Code')[0]?.included && (
                <TextField
                  fullWidth
                  label="Zip code"
                  size="small"
                  disabled={isSubmitting}
                  {...getFieldProps('zipCode')}
                  error={Boolean(touched.zipCode && errors.zipCode)}
                  helperText={touched.zipCode && errors.zipCode}
                />
              )}
              {data.filter((field) => field.label === 'Marital Status')[0]?.included && (
                <TextField
                  fullWidth
                  label="Marital Status"
                  size="small"
                  disabled={isSubmitting}
                  {...getFieldProps('maritalStatus')}
                  error={Boolean(touched.maritalStatus && errors.maritalStatus)}
                  helperText={touched.maritalStatus && errors.maritalStatus}
                />
              )}
            </Stack>
          )}

          <LoadingButton
            fullWidth
            size="small"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
