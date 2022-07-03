import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@material-ui/lab';
import {
  Container,
  Grid,
  Card,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Button
} from '@material-ui/core';
import Page from '../components/Page';
import { getUserProfile, updateUserProfile } from '../utils/Index';
// ----------------------------------------------------------------------
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export default function UserEdit() {
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState(true);

  useEffect(() => {
    getUserProfile().then((res) => {
      if (res.success) {
        formik.setFieldValue('firstname', res.data.firstName);
        formik.setFieldValue('lastname', res.data.lastName);
        formik.setFieldValue('email', res.data.email);
        formik.setFieldValue('phone', res.data.phoneNumber.trim().replace(/-/g, ''));
        formik.setFieldValue('username', res.data.username);
      } else {
        SnacbarViewer(res.message, 'error');
      }
      setLoading(false);
    });
  }, []);
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
  const NewUserSchema = Yup.object().shape({
    firstname: Yup.string()
      .required('First name required')
      .strict()
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),
    lastname: Yup.string()
      .required('Last name required')
      .strict()
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),
    phone: Yup.string()
      .min(10, 'Too Short!')
      .max(11, 'Too Long!')
      .required('Phone Number is required and dashes are not allowed')
      .strict()
      .matches(phoneRegExp, 'Only numbers are required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      username: ''
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await updateUserProfile(values).then((res) => {
          if (res.success) {
            setView((prev) => !prev);
            localStorage.setItem('fullName', `${values.firstname} ${values.lastname}`);
            localStorage.setItem('firstName', values.firstname);
            localStorage.setItem('lastName', values.lastname);
            SnacbarViewer(res.message, 'success');
            navigate('/', { replace: true });
          } else {
            SnacbarViewer(res.message, 'error');
          }
          setSubmitting(false);
        });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
        SnacbarViewer(error, 'error');
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } =
    formik;

  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User details
          </Typography>
          <Button onClick={() => setView((prev) => !prev)} variant="contained" size="small">
            {view ? 'Edit' : 'View'}
          </Button>
        </Stack>
        <FormikProvider value={formik}>
          <>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <Card
                    sx={{
                      px: 3,
                      pt: 4.5,
                      pb: view ? 4.5 : 3
                    }}
                  >
                    <Stack spacing={3}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                          fullWidth
                          label="First name"
                          size="small"
                          disabled={isSubmitting || loading || view}
                          {...getFieldProps('firstname')}
                          error={Boolean(touched.firstname && errors.firstname)}
                          helperText={touched.firstname && errors.firstname}
                          onBlur={() =>
                            setFieldValue(
                              'firstname',
                              values.firstname.charAt(0).toUpperCase() + values.firstname.slice(1)
                            )
                          }
                        />
                        <TextField
                          fullWidth
                          label="Last name"
                          size="small"
                          disabled={isSubmitting || loading || view}
                          {...getFieldProps('lastname')}
                          error={Boolean(touched.lastname && errors.lastname)}
                          helperText={touched.lastname && errors.lastname}
                          onBlur={() =>
                            setFieldValue(
                              'lastname',
                              values.lastname.charAt(0).toUpperCase() + values.lastname.slice(1)
                            )
                          }
                        />
                      </Stack>

                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                          fullWidth
                          label="Email address"
                          size="small"
                          disabled
                          {...getFieldProps('email')}
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                        />
                        <TextField
                          fullWidth
                          type="number"
                          label="Phone"
                          size="small"
                          variant="outlined"
                          disabled={isSubmitting || loading || view}
                          {...getFieldProps('phone')}
                          error={Boolean(touched.phone && errors.phone)}
                          helperText={touched.phone && errors.phone}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">+</InputAdornment>
                          }}
                        />
                      </Stack>

                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                          fullWidth
                          disabled
                          size="small"
                          {...getFieldProps('username')}
                          error={Boolean(touched.username && errors.username)}
                          helperText={touched.username && errors.username}
                          label="Username"
                        />
                      </Stack>
                      {!view && (
                        <Stack
                          direction="row-reverse"
                          alignItems="center"
                          justifyContent="space-between"
                          mb={5}
                        >
                          <LoadingButton
                            size="small"
                            type="submit"
                            variant="contained"
                            loading={isSubmitting}
                          >
                            Save changes
                          </LoadingButton>
                        </Stack>
                      )}
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            </Form>
          </>
        </FormikProvider>
      </Container>
    </Page>
  );
}
