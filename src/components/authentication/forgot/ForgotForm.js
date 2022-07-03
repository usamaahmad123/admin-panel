import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { TextField, Alert, Stack, Icon, IconButton } from '@material-ui/core';
import closeFill from '@iconify/icons-eva/close-fill';
import { LoadingButton } from '@material-ui/lab';
import { forgotPassword } from '../../../utils/Index';

// ----------------------------------------------------------------------

ForgotForm.propTypes = {
  onSent: PropTypes.func,
  onGetEmail: PropTypes.func
};

export default function ForgotForm({ onSent, onGetEmail }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required')
  });

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        await forgotPassword(values.email).then((res) => {
          if (res.success) {
            navigate('/reset', { replace: true });
            onSent();
            onGetEmail(formik.values.email);
          } else {
            enqueueSnackbar(res.message, {
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

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

          <TextField
            fullWidth
            size="small"
            {...getFieldProps('email')}
            type="email"
            label="Email address"
            disabled={isSubmitting}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <LoadingButton
            fullWidth
            size="medium"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Reset Password
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
