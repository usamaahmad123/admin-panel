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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  RadioGroup,
  Radio,
  FormLabel,
  FormControlLabel,
  Box,
  Typography
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { AddEmployer, DeleteEmployer, GetEmployer } from '../utils/Index';
import '../pages/StyleSheet.css';

// ----------------------------------------------------------------------
let openForFirstTime = true;
const EmployerForm = ({ onSubmittion, SnacbarViewer, id, setEmployerInfo, EmployerRef }) => {
  const [expanded, setExpanded] = useState(true);
  const [employers, setEmployer] = useState([]);
  useEffect(() => {
    employerCall();
  }, []);
  const employerCall = () => {
    if (id) {
      GetEmployer(id).then((res) => {
        if (res.success) {
          if (res.data.length) {
            setEmployerInfo(true);
          }
          setEmployer(res.data);
        }
      });
    }
  };
  const handleAccordianChange = (event, newExpanded) => {
    if (newExpanded && openForFirstTime) {
      openForFirstTime = false;
      employerCall();
    }
    setExpanded(newExpanded);
  };
  const RegisterSchema = Yup.object().shape({
    occupation: Yup.string().required('Occupation is required'),
    employer: Yup.string().required('Employer is required')
  });

  const formik = useFormik({
    initialValues: {
      occupation: '',
      employer: '',
      work_status: 'Retired',
      patient_id: id
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        const sendValues = values;
        sendValues.patient_id = id;
        await AddEmployer(sendValues).then((res) => {
          if (res.success) {
            onSubmittion();
            SnacbarViewer(res.message, 'success');
            employerCall();
            resetForm();
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

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, resetForm, setSubmitting } =
    formik;
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
            ref={EmployerRef}
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
                  Employer
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Stack fullWidth spacing={3}>
                {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}
                {employers.length > 0 &&
                  employers.map((pharm) => (
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2}
                      key={pharm.id}
                    >
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Occupation : {pharm.occupation}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                          Employer : {pharm.employer}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                          Work status : {pharm.work_status}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => {
                          DeleteEmployer(pharm.id).then((res) => {
                            if (res.success) {
                              SnacbarViewer(res.message, 'success');
                              employerCall();
                            } else {
                              SnacbarViewer(res.message, 'error');
                            }
                            setSubmitting(false);
                          });
                        }}
                        loading={isSubmitting}
                      >
                        Delete employer
                      </Button>
                    </Stack>
                  ))}
                <TextField
                  sx={{ width: '50%' }}
                  label="Occupation"
                  size="small"
                  disabled={isSubmitting}
                  {...getFieldProps('occupation')}
                  error={Boolean(touched.occupation && errors.occupation)}
                  helperText={touched.occupation && errors.occupation}
                />
                <FormControl style={{ borderRadius: 10, padding: 10, background: '#ebeaea' }}>
                  <FormLabel id="genderradio">
                    Ok to share information about your adult children?
                  </FormLabel>
                  <RadioGroup
                    labelId="genderradio"
                    aria-labelledby="genderradio"
                    row
                    sx={{ mb: 2 }}
                    {...getFieldProps('work_status')}
                  >
                    <FormControlLabel
                      key={0}
                      sx={{ mr: 3 }}
                      value="Actively Working"
                      control={<Radio size="small" />}
                      label="Actively Working"
                    />
                    <FormControlLabel
                      key={1}
                      sx={{ mr: 3 }}
                      value="Retired"
                      control={<Radio size="small" />}
                      label="Retired"
                    />
                  </RadioGroup>
                </FormControl>
                <TextField
                  sx={{ width: '50%' }}
                  label="Employer"
                  size="small"
                  disabled={isSubmitting}
                  {...getFieldProps('employer')}
                  error={Boolean(touched.employer && errors.employer)}
                  helperText={touched.employer && errors.employer}
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
                  Add
                </LoadingButton>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Form>
      </FormikProvider>
    </>
  );
};

EmployerForm.propTypes = {
  onSubmittion: PropTypes.any,
  SnacbarViewer: PropTypes.any,
  id: PropTypes.any,
  setEmployerInfo: PropTypes.any,
  EmployerRef: PropTypes.any
};
export default EmployerForm;
