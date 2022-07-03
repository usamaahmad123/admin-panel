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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { AddPharmacy, DeletePharmacy, GetPharmacy } from '../utils/Index';
import '../pages/StyleSheet.css';

// ----------------------------------------------------------------------
let openForFirstTime = true;
const PharmacyForm = ({ onSubmittion, SnacbarViewer, id, setPharmacyInfo, PharmacyRef }) => {
  const [pharmacies, setPharmacies] = useState([]);
  const [expanded, setExpanded] = useState(true);
  useEffect(() => {
    PharmCall();
  }, []);
  const handleAccordianChange = (event, newExpanded) => {
    if (newExpanded && openForFirstTime) {
      openForFirstTime = false;
      PharmCall();
    }
    setExpanded(newExpanded);
  };
  const PharmCall = () => {
    if (id) {
      GetPharmacy(id).then((res) => {
        if (res.success) {
          if (res.data.length) {
            setPharmacyInfo(true);
          }
          setPharmacies(res.data);
          SnacbarViewer(res.message, 'success');
        }
      });
    }
  };
  const RegisterSchema = Yup.object().shape({
    // bin: Yup.array(
    //   Yup.object({
    //     prefered_pharmacy: Yup.string().min(3).max(100).required('Pharmacy value is required')
    //   })
    // )
    prefered_pharmacy: Yup.string().required('Pharmacy name is required')
  });

  const formik = useFormik({
    initialValues: {
      // bin: [{ prefered_pharmacy: 'Barcode' }],
      prefered_pharmacy: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        setSubmitting(false);
        AddPharmacy({
          prefered_pharmacy: values.prefered_pharmacy,
          patient_id: id
        }).then((res) => {
          if (res.success) {
            onSubmittion();
            PharmCall();
            resetForm();
            SnacbarViewer(res.message, 'success');
          } else {
            SnacbarViewer(res.message, 'error');
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
            ref={PharmacyRef}
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
                  Pharmacy
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Stack fullWidth spacing={3}>
                {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}
                {/* <Button
              sx={{ mr: 1, width: '20%' }}
              variant="contained"
              color="error"
              onClick={() => {
                DeletePharmacy(id).then((res) => {
                  if (res.success) {
                    setFieldValue('bin', [{ prefered_pharmacy: '' }]);
                    SnacbarViewer(res.message, 'success');
                  } else {
                    SnacbarViewer(res.message, 'error');
                  }
                  setSubmitting(false);
                });
              }}
              loading={isSubmitting}
            >
              Delete Pharmacies
            </Button> */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    type="text"
                    label="Pharmacy"
                    size="small"
                    disabled={isSubmitting}
                    {...getFieldProps(`prefered_pharmacy`)}
                    error={Boolean(touched.prefered_pharmacy && errors.prefered_pharmacy)}
                    helperText={touched.prefered_pharmacy && errors.prefered_pharmacy}
                  />
                  <Button variant="contained" type="submit" disabled={isSubmitting}>
                    Add
                  </Button>
                </Stack>
                {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FieldArray
                name="bin"
                render={(arrayHelpers) => (
                  <div>
                    {values.bin.map((friend, index) => (
                      <>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{ my: 2, marginBottom: 2 }}
                          spacing={5}
                          key={index}
                        >
                          <TextField
                            fullWidth
                            type="text"
                            label="Pharmacy"
                            size="small"
                            disabled={isSubmitting || index < values.bin.length - 1}
                            {...getFieldProps(`bin[${index}].prefered_pharmacy`)}
                            name={`bin[${index}].prefered_pharmacy`}
                            error={Boolean(
                              touched?.bin &&
                                errors?.bin &&
                                touched?.bin[index]?.prefered_pharmacy &&
                                errors.bin[index]?.prefered_pharmacy
                            )}
                            helperText={
                              touched?.bin &&
                              errors?.bin &&
                              touched?.bin[index]?.prefered_pharmacy &&
                              errors.bin[index]?.prefered_pharmacy
                            }
                          />
                          <ButtonGroup variant="contained">
                            <Button
                              disabled={
                                values.bin.length === 1 ||
                                isSubmitting ||
                                index < values.bin.length - 1
                              }
                              onClick={() => arrayHelpers.remove(index)}
                            >
                              Reduce
                            </Button>
                            <Button
                              disabled={
                                values.bin.length !== index + 1 || isSubmitting || errors.bin
                              }
                              onClick={() => {
                                setSubmitting(false);
                                AddPharmacy({
                                  prefered_pharmacy: values.bin[index].prefered_pharmacy,
                                  patient_id: id
                                }).then((res) => {
                                  if (res.success) {
                                    arrayHelpers.insert(index + 1, {
                                      prefered_pharmacy: ``
                                    });
                                    SnacbarViewer(res.message, 'success');
                                  } else {
                                    SnacbarViewer(res.message, 'error');
                                  }
                                  setSubmitting(false);
                                });
                              }}
                            >
                              Add
                            </Button>
                          </ButtonGroup>
                        </Stack>
                      </>
                    ))}
                  </div>
                )}
              />
            </Stack> */}
                {pharmacies.length > 0 &&
                  pharmacies.map((pharm, idx) => (
                    <Stack
                      key={idx}
                      direction={{ xs: 'column', sm: 'row' }}
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2}
                    >
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Prefered pharmacy : {pharm.prefered_pharmacy}
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => {
                          DeletePharmacy(pharm.id).then((res) => {
                            if (res.success) {
                              // setFieldValue('bin', [{ prefered_pharmacy: '' }]);
                              SnacbarViewer(res.message, 'success');
                              PharmCall();
                              // setPharmacies(pharmacies.filter((ph) => ph.id !== pharm.id));
                            } else {
                              SnacbarViewer(res.message, 'error');
                            }
                            setSubmitting(false);
                          });
                        }}
                        loading={isSubmitting}
                      >
                        Delete Pharmacy
                      </Button>
                    </Stack>
                  ))}
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

PharmacyForm.propTypes = {
  onSubmittion: PropTypes,
  SnacbarViewer: PropTypes,
  id: PropTypes,
  setPharmacyInfo: PropTypes,
  PharmacyRef: PropTypes
};
export default PharmacyForm;
