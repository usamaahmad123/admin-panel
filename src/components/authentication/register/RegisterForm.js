import * as Yup from 'yup';
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
import { LoadingButton } from '@material-ui/lab';
import { Register } from '../../../utils/Index';
import {
  lowercaseRegex,
  uppercaseRegex,
  numericRegex,
  specialRegex
} from '../../../utils/constants';
import { NameField } from '../../../utils/formatTime';

// ----------------------------------------------------------------------
const emailMessage = 'This email address will be used for 2-Step verification or recovery.';
const phoneMessage =
  'This should be your cell phone number and not your landline number. Also, dashes are not allowed.';
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const passwordMsg =
  'Your password must contains at least 8 characters, one lowercase letter, one uppercase letter, one numeric digit and one special character';
export default function RegisterForm() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState(false);
  const [phone, setPhone] = useState(false);
  const navigate = useNavigate();

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('First name is required')
      .matches(/^[aA-zZ\s]+$/, 'First name is invalid')
      .strict(),
    lastName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Last name is required')
      .matches(/^[aA-zZ\s]+$/, 'Last name is invalid')
      .strict(),
    username: Yup.string()
      .min(8, 'Too Short!')
      .max(20, 'Too Long!')
      .required('Username is required')
      .trim('Spaces not allowed'),
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
      .min(8, passwordMsg)
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      username: '',
      email: '',
      password: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
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

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}
          {msg && <Alert severity="warning">{emailMessage}</Alert>}
          {phone && <Alert severity="warning">{phoneMessage}</Alert>}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
            <TextField
              fullWidth
              label="Last name*"
              size="small"
              onKeyDown={NameField}
              disabled={isSubmitting}
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack>
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
