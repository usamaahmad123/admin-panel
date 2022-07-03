import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import {
  Stack,
  TextField,
  Alert,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { LoadingButton } from '@material-ui/lab';
import { UpdatePatients, getPatient } from '../utils/Index';
import useStyles from './useStyles';
import '../pages/StyleSheet.css';
// ----------------------------------------------------------------------
let openForFirstTime = true;
const phoneRegExp = /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;
const OutsideProviders = ({
  onSubmittion,
  patientId,
  SnacbarViewer,
  setProviderInfo,
  ProviderRef,
  id
}) => {
  const [expanded, setExpanded] = useState(true);
  const classes = useStyles();
  useEffect(() => {
    providerCall();
  }, []);
  const providerCall = () => {
    if (patientId) {
      getPatient(patientId).then((res) => {
        if (res.success) {
          if (res.data.referring_provider) {
            setProviderInfo(true);
          }
          formik.setFieldValue('referring_provider', res.data.referring_provider || '');
          formik.setFieldValue('referring_practice', res.data.referring_practice || '');
          formik.setFieldValue('referring_provider_phone', res.data.referring_provider_phone || '');
          formik.setFieldValue('pcp_provider', res.data?.pcp_provider || '');
          formik.setFieldValue('pcp_practice', res.data.pcp_practice || '');
          formik.setFieldValue('pcp_phone', res.data.pcp_phone || '');
        }
      });
    }
  };
  const handleAccordianChange = (event, newExpanded) => {
    if (newExpanded && openForFirstTime) {
      openForFirstTime = false;
      providerCall();
    }
    setExpanded(newExpanded);
  };
  const RegisterSchema = Yup.object().shape({
    referring_provider: Yup.string().required('Referring provider is required'),
    referring_practice: Yup.string().required('Referring practice is required'),
    referring_provider_phone: Yup.string().required('Referring provider number is required'),
    pcp_provider: Yup.string().required('Primary care physician (PCP) is required'),
    pcp_practice: Yup.string().required('PCP practice is required'),
    pcp_phone: Yup.string()
      .matches(phoneRegExp, 'Only US number format is acceptable')
      .required('PCP practice number is required')
  });

  const formik = useFormik({
    initialValues: {
      referring_provider: '',
      referring_practice: '',
      referring_provider_phone: '',
      pcp_provider: '',
      pcp_practice: '',
      pcp_phone: ''
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
    resetForm,
    setFieldValue
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
            ref={ProviderRef}
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
                  Outside providers
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              {' '}
              <Stack fullWidth spacing={3}>
                {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Referring provider"
                    size="small"
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.referring_provider ? classes.notchedOutline : ''
                      }
                    }}
                    {...getFieldProps('referring_provider')}
                    error={Boolean(touched.referring_provider && errors.referring_provider)}
                    helperText={touched.referring_provider && errors.referring_provider}
                  />
                  <TextField
                    fullWidth
                    label="Referring practice"
                    size="small"
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.referring_practice ? classes.notchedOutline : ''
                      }
                    }}
                    {...getFieldProps('referring_practice')}
                    error={Boolean(touched.referring_practice && errors.referring_practice)}
                    helperText={touched.referring_practice && errors.referring_practice}
                  />
                  <TextField
                    fullWidth
                    label="Referring provider #"
                    size="small"
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.referring_provider_phone
                          ? classes.notchedOutline
                          : ''
                      }
                    }}
                    {...getFieldProps('referring_provider_phone')}
                    error={Boolean(
                      touched.referring_provider_phone && errors.referring_provider_phone
                    )}
                    helperText={touched.referring_provider_phone && errors.referring_provider_phone}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Primary care physician (PCP)"
                    size="small"
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.pcp_provider ? classes.notchedOutline : ''
                      }
                    }}
                    {...getFieldProps('pcp_provider')}
                    error={Boolean(touched.pcp_provider && errors.pcp_provider)}
                    helperText={touched.pcp_provider && errors.pcp_provider}
                  />
                  <TextField
                    fullWidth
                    label="PCP practice"
                    size="small"
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.pcp_practice ? classes.notchedOutline : ''
                      }
                    }}
                    {...getFieldProps('pcp_practice')}
                    error={Boolean(touched.pcp_practice && errors.pcp_practice)}
                    helperText={touched.pcp_practice && errors.pcp_practice}
                  />
                  <TextField
                    fullWidth
                    type="text"
                    label="PCP practice phone #"
                    size="small"
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.pcp_phone ? classes.notchedOutline : ''
                      }
                    }}
                    /* eslint-disable */
                    onBlurCapture={(e) => {
                      const x = e.target.value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/);
                      if (x?.length >= 4) {
                        setFieldValue('pcp_phone', x[1] + '-' + x[2] + '-' + x[3]);
                      }
                    }}
                    {...getFieldProps('pcp_phone')}
                    error={Boolean(touched.pcp_phone && errors.pcp_phone)}
                    helperText={touched.pcp_phone && errors.pcp_phone}
                  />
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

OutsideProviders.propTypes = {
  onSubmittion: PropTypes.any,
  patientId: PropTypes.any,
  SnacbarViewer: PropTypes.any,
  setProviderInfo: PropTypes.any,
  ProviderRef: PropTypes.any,
  id: PropTypes.any
};
export default OutsideProviders;
