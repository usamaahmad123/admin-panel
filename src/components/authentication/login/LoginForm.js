import * as Yup from 'yup';
import { useState } from 'react';
import { useSnackbar } from 'notistack5';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import { Link, Stack, Alert, TextField, IconButton, InputAdornment } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { Login } from '../../../utils/Index';
import { setToken } from '../AuthService';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [touchedCheck, setCheck] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email address is invalid')
      .trim('Spaces not allowed')
      .strict()
      .required('Email address is required'),
    password: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        setCheck(true);
        await Login(values.email, values.password).then((res) => {
          if (res) {
            if (res.success) {
              setToken(res.data?.accessToken);
              if (res.data?.isSuperAdmin) {
                localStorage.setItem('Role', 0);
                localStorage.setItem('roleName', 'SuperAdmin');
              } else if (res.data?.isAdmin) {
                localStorage.setItem('Role', 2);
                localStorage.setItem('roleName', 'Admin');
              } else {
                localStorage.setItem('roleName', 'User');
                localStorage.setItem('Role', 1);
              }
              localStorage.setItem('fullName', `${res.data?.firstName} ${res.data?.lastName}`);
              localStorage.setItem('firstName', res.data?.firstName);
              localStorage.setItem('lastName', res.data?.lastName);
              localStorage.setItem('id', res.data?.id);
              localStorage.setItem('uuid', res.data?.uuid);
              localStorage.setItem('username', res.data?.username);
              localStorage.setItem('email', res.data?.email);
              localStorage.setItem('phoneNumber', res.data?.phoneNumber);
              localStorage.setItem('isActive', res.data?.isActive);
              if (res.data?.permissions) {
                localStorage.setItem('createCategory', res.data?.permissions.CREATE_CATEGORY);
                localStorage.setItem('editCategory', res.data?.permissions.EDIT_CATEGORY);
                localStorage.setItem('deleteCategory', res.data?.permissions.DELETE_CATEGORY);
                localStorage.setItem('mergeCategory', res.data?.permissions.MERGE_CATEGORY);
              } else {
                localStorage.setItem('createCategory', true);
                localStorage.setItem('editCategory', true);
                localStorage.setItem('deleteCategory', true);
                localStorage.setItem('mergeCategory', true);
              }
              navigate('/dashboard', { replace: true });
              enqueueSnackbar(res.message, {
                variant: 'success',
                action: (key) => (
                  <IconButton size="small" onClick={() => closeSnackbar(key)}>
                    <Icon icon={closeFill} />
                  </IconButton>
                )
              });
            } else {
              setErrors({ afterSubmit: res?.message });
            }
            setSubmitting(false);
          } else {
            setSubmitting(false);
          }
        });
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error.message, {
          variant: 'error',
          action: (key) => (
            <IconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </IconButton>
          )
        });
        setErrors({ afterSubmit: error.message });
        setSubmitting(false);
      }
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            required
            label="Email address"
            size="small"
            disabled={isSubmitting}
            {...getFieldProps('email')}
            error={Boolean(touchedCheck && touched.email && errors.email)}
            helperText={touchedCheck && touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            size="small"
            {...getFieldProps('password')}
            disabled={isSubmitting}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touchedCheck && touched.password && errors.password)}
            helperText={touchedCheck && touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          {/* <FormControlLabel
            control={
              <Checkbox size="small" {...getFieldProps('remember')} checked={values.remember} />
            }
            label="Remember me"
          /> */}
          <Link underline="hover" component={RouterLink} variant="subtitle2" to="/forgetpassword">
            Contact for support
          </Link>
          <Link underline="hover" component={RouterLink} variant="subtitle2" to="/forgetpassword">
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="small"
          // type="submit"
          variant="contained"
          onClick={() => {
            setCheck(true);
            handleSubmit();
          }}
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
