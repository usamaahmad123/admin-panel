import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { LoadingButton } from '@material-ui/lab';
import { UpdatePatients, getPatient } from '../utils/Index';
import useStyles from './useStyles';
import '../pages/StyleSheet.css';

// ----------------------------------------------------------------------
let openForFirstTime = true;
const SocialForm = ({ onSubmittion, patientId, SnacbarViewer, setSocialInfo, SocialRef, id }) => {
  const [expanded, setExpanded] = useState(true);
  const classes = useStyles();
  useEffect(() => {
    socialCall();
  }, []);
  const handleAccordianChange = (event, newExpanded) => {
    if (newExpanded && openForFirstTime) {
      openForFirstTime = false;
      socialCall();
    }
    setExpanded(newExpanded);
  };
  const socialCall = () => {
    if (patientId) {
      getPatient(patientId).then((res) => {
        if (res.success) {
          if (res.data.share_info_spouse) {
            setSocialInfo(true);
          }
          formik.setFieldValue('share_info_spouse', res.data.share_info_spouse || 'Yes');
          formik.setFieldValue('status', res.data.status || 'Married');
          formik.setFieldValue('share_info_children', res.data?.share_info_children || 'Yes');
          formik.setFieldValue('special_request', res.data.special_request || '');
        }
      });
    }
  };
  const formik = useFormik({
    initialValues: {
      share_info_spouse: 'Yes',
      status: 'Married',
      share_info_children: 'Yes',
      special_request: ''
    },
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

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values, resetForm } = formik;
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
            ref={SocialRef}
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
                  Social
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Stack fullWidth spacing={3}>
                {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}
                <FormControl style={{ borderRadius: 10, padding: 10, background: '#ebeaea' }}>
                  <FormLabel id="Workradio">Work status</FormLabel>
                  <RadioGroup
                    labelId="Workradio"
                    aria-labelledby="Workradio"
                    row
                    sx={{ mb: 2 }}
                    {...getFieldProps('status')}
                  >
                    <FormControlLabel
                      sx={{ mr: 3 }}
                      value="Married"
                      control={<Radio size="small" />}
                      label="Married"
                    />
                    <FormControlLabel
                      sx={{ mr: 3 }}
                      value="Single"
                      control={<Radio size="small" />}
                      label="Single"
                    />
                    <FormControlLabel
                      sx={{ mr: 3 }}
                      value="Widowed"
                      control={<Radio size="small" />}
                      label="Widowed"
                    />
                    <FormControlLabel
                      sx={{ mr: 3 }}
                      value="Divorced"
                      control={<Radio size="small" />}
                      label="Divorced"
                    />
                    <FormControlLabel
                      sx={{ mr: 3 }}
                      value="Domestic partner"
                      control={<Radio size="small" />}
                      label="Domestic partner"
                    />
                  </RadioGroup>
                </FormControl>
                <FormControl style={{ borderRadius: 10, padding: 10, background: '#ebeaea' }}>
                  <FormLabel id="inforadio">
                    Ok to share information about your health with your spouse?
                  </FormLabel>
                  <RadioGroup
                    labelId="inforadio"
                    aria-labelledby="inforadio"
                    row
                    sx={{ mb: 2 }}
                    {...getFieldProps('share_info_spouse')}
                  >
                    <FormControlLabel
                      sx={{ mr: 3 }}
                      value="Yes"
                      control={<Radio size="small" />}
                      label="Yes"
                    />
                    <FormControlLabel
                      sx={{ mr: 3 }}
                      value="No"
                      control={<Radio size="small" />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
                <FormControl style={{ borderRadius: 10, padding: 10, background: '#ebeaea' }}>
                  <FormLabel id="genderradio">
                    Ok to share information about your adult children?
                  </FormLabel>
                  <RadioGroup
                    labelId="genderradio"
                    aria-labelledby="genderradio"
                    row
                    sx={{ mb: 2 }}
                    {...getFieldProps('share_info_children')}
                  >
                    <FormControlLabel
                      sx={{ mr: 3 }}
                      value="Yes"
                      control={<Radio size="small" />}
                      label="Yes"
                    />
                    <FormControlLabel
                      sx={{ mr: 3 }}
                      value="No"
                      control={<Radio size="small" />}
                      label="No"
                    />
                    <FormControlLabel
                      sx={{ mr: 3 }}
                      value="N/A"
                      control={<Radio size="small" />}
                      label="N/A"
                    />
                  </RadioGroup>
                </FormControl>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Special requests"
                    placeholder="Special requests, etc regarding sharing of your health information"
                    size="small"
                    multiline
                    rows={3}
                    disabled={isSubmitting}
                    InputProps={{
                      classes: {
                        notchedOutline: values.special_request ? classes.notchedOutline : ''
                      }
                    }}
                    {...getFieldProps('special_request')}
                    error={Boolean(touched.special_request && errors.special_request)}
                    helperText={touched.special_request && errors.special_request}
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
                    variant="outlined"
                    disabled={!id}
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

SocialForm.propTypes = {
  onSubmittion: PropTypes.any,
  patientId: PropTypes.any,
  SnacbarViewer: PropTypes.any,
  setSocialInfo: PropTypes.any,
  SocialRef: PropTypes.any,
  id: PropTypes.any
};
export default SocialForm;
