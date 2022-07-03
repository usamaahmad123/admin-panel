import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import { Stack, TextField, IconButton, InputAdornment, Alert } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import {
  lowercaseRegex,
  uppercaseRegex,
  numericRegex,
  specialRegex
} from '../../../utils/constants';
import { createPassword, resetPassword } from '../../../utils/Index';

export default function VerifyCodeForm(props) {
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const CreatePasswordSchema = Yup.object().shape({
    password: Yup.string()
      .matches(
        lowercaseRegex,
        'Your password must contains at least 8 characters, one lowercase letter, one uppercase letter, one numeric digit and one special character'
      )
      .matches(
        uppercaseRegex,
        'Your password must contains at least 8 characters, one lowercase letter, one uppercase letter, one numeric digit and one special character'
      )
      .matches(
        numericRegex,
        'Your password must contains at least 8 characters, one lowercase letter, one uppercase letter, one numeric digit and one special character'
      )
      .matches(
        specialRegex,
        'Your password must contains at least 8 characters, one lowercase letter, one uppercase letter, one numeric digit and one special character'
      )
      .min(
        8,
        'Your password must contains at least 8 characters, one lowercase letter, one uppercase letter, one numeric digit and one special character'
      )
      // .required('One uppercase, lowercase, number, special Character and Minimum 8 characters is required!'),
      .required('Password is required'),
    confirmpassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Your passwords do not match')
      .required('Confirm password is required'),
    token: props.btnName === 'Reset' ? Yup.string().required('OTP is required') : ''
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmpassword: ''
    },
    validationSchema: CreatePasswordSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        if (props.btnName === 'Reset') {
          await resetPassword(values.token, values.password).then((res) => {
            enqueueSnackbar(res.message, {
              variant: res.success ? 'success' : 'error',
              action: (key) => (
                <IconButton size="small" onClick={() => closeSnackbar(key)}>
                  <Icon icon={closeFill} />
                </IconButton>
              )
            });
            setSubmitting(false);
            if (res.success) {
              navigate('/login', { replace: true });
            }
          });
        } else {
          await createPassword(props.token, values.password).then((res) => {
            enqueueSnackbar(res.message, {
              variant: res.success ? 'success' : 'error',
              action: (key) => (
                <IconButton size="small" onClick={() => closeSnackbar(key)}>
                  <Icon icon={closeFill} />
                </IconButton>
              )
            });
            setSubmitting(false);
            if (res.success) {
              navigate('/login', { replace: true });
            }
          });
        }
      } catch (error) {
        setErrors({ afterSubmit: error.message });
        setSubmitting(false);
      }
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}
          {props.btnName === 'Reset' && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              {' '}
              <TextField
                fullWidth
                label="OTP"
                {...getFieldProps('token')}
                size="small"
                disabled={isSubmitting}
                error={Boolean(touched.token && errors.token)}
                helperText={touched.token && errors.token}
              />
            </Stack>
          )}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Password"
              size="small"
              disabled={isSubmitting}
              {...getFieldProps('password')}
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
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm Password"
              {...getFieldProps('confirmpassword')}
              size="small"
              disabled={isSubmitting}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setShowConfirmPassword((prev) => !prev)}>
                      <Icon icon={showConfirmPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.confirmpassword && errors.confirmpassword)}
              helperText={touched.confirmpassword && errors.confirmpassword}
            />
          </Stack>

          <LoadingButton
            fullWidth
            size="small"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {props.btnName}
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}

VerifyCodeForm.propTypes = {
  btnName: PropTypes.any
};
