import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import moment from 'moment';
import closeFill from '@iconify/icons-eva/close-fill';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
// material
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Radio,
  IconButton,
  Drawer,
  TextField,
  Tooltip,
  Divider,
  Typography,
  RadioGroup,
  FormControlLabel
} from '@material-ui/core';
import { DatePicker } from '@material-ui/lab';
import Scrollbar from '../components/Scrollbar';

// ----------------------------------------------------------------------
export default function ImageFilters({ filteredValues, categories, labels }) {
  const [open, setOpen] = useState(false);
  const formik = useFormik({
    initialValues: {
      patientId: '',
      uploadedDate: '',
      capturedDate: new Date(),
      categoryId: '',
      labelId: ''
    },
    onSubmit: async (values, { setSubmitting }) => {
      console.log('submit clicked');
      try {
        setSubmitting(false);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });
  const { values, setFieldValue, getFieldProps, resetForm } = formik;
  return (
    <>
      <Tooltip title="Filter list" placement="top" arrow>
        <IconButton style={{ marginInlineStart: 'auto' }} onClick={() => setOpen(true)}>
          <Icon icon={roundFilterList} />
        </IconButton>
      </Tooltip>

      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate>
          <Drawer
            anchor="right"
            open={open}
            onClose={() => setOpen(false)}
            PaperProps={{
              sx: { width: 280, border: 'none', overflow: 'hidden' }
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ px: 1, py: 2 }}
            >
              <Typography variant="h5" ml={1}>
                Filters
              </Typography>
              <IconButton onClick={() => setOpen(false)}>
                <Icon icon={closeFill} width={20} height={20} />
              </IconButton>
            </Stack>

            <Divider />

            <Scrollbar>
              <Stack>
                {/* <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Patient</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      fullWidth
                      label="Search user"
                      placeholder="Search by name, patientId.."
                      value={patientSearch}
                      size="small"
                      onChange={(event) => {
                        setPatientSearch(event.target.value);
                      }}
                    />
                    <Divider sx={{ mt: 1 }} />
                    <RadioGroup
                      onChange={(e) => {
                        resetForm();
                        setFieldValue('patientId', e.target.value);
                        filteredValues({ patientId: e.target.value });
                        setOpen(false);
                      }}
                    >
                      {patients
                        .filter((x) =>
                          searching.some((k) => {
                            if (k === 'firstName') {
                              if (x.middleName) {
                                return `${x.firstName} ${x.middleName} ${x.lastName}`
                                  ?.toLowerCase()
                                  .includes(patientSearch?.toLowerCase());
                              }
                              return `${x.firstName} ${x.lastName}`
                                ?.toLowerCase()
                                .includes(patientSearch?.toLowerCase());
                            }
                            return String(x[k]).toLowerCase().includes(patientSearch.toLowerCase());
                          })
                        )
                        .map((x) => (
                          <Tooltip
                            TransitionComponent={Zoom}
                            title={`Patient id #${x.patientId}`}
                            placement="top"
                            arrow
                          >
                            <FormControlLabel
                              key={x?.patientId}
                              value={x?.patientId}
                              checked={x?.patientId === Number(values.patientId)}
                              control={<Radio size="small" />}
                              label={
                                x.middleName
                                  ? `${x.firstName} ${x.middleName} ${x.lastName}`
                                  : `${x.firstName} ${x.lastName}`
                              }
                            />
                          </Tooltip>
                        ))}
                    </RadioGroup>
                  </AccordionDetails>
                </Accordion> */}
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Date captured</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <DatePicker
                      label="Date captured"
                      {...getFieldProps('capturedDate')}
                      onChange={(date) => {
                        resetForm();
                        setFieldValue('capturedDate', date);
                        filteredValues({ date: moment(date).format('YYYY-MM-DD') });
                        setOpen(false);
                      }}
                      renderInput={(params) => <TextField fullWidth {...params} size="small" />}
                      disableFuture
                      inputFormat="MM/dd/yyyy"
                    />
                  </AccordionDetails>
                </Accordion>
                {/* <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Date uploaded</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <DatePicker
                      label="Date uploaded"
                      {...getFieldProps('uploadedDate')}
                      onChange={(date) => setFieldValue('uploadedDate', date)}
                      renderInput={(params) => <TextField fullWidth {...params} size="small" />}
                      disableFuture
                      inputFormat="MM/dd/yyyy"
                    />
                  </AccordionDetails>
                </Accordion> */}
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Category</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <RadioGroup
                      onChange={(e) => {
                        resetForm();
                        setFieldValue('categoryId', e.target.value);
                        filteredValues({ categoryId: e.target.value });
                        setOpen(false);
                      }}
                      //   {...getFieldProps('categoryId')}
                    >
                      {categories.map((x) => (
                        <FormControlLabel
                          key={x?.id}
                          value={x?.id}
                          checked={x?.id === Number(values.categoryId)}
                          control={<Radio size="small" />}
                          label={x.name}
                        />
                      ))}
                    </RadioGroup>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Label</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <RadioGroup
                      //   {...getFieldProps('labelId')}
                      onChange={(e) => {
                        resetForm();
                        setFieldValue('labelId', e.target.value);
                        filteredValues({ labelId: e.target.value });
                        setOpen(false);
                      }}
                    >
                      {labels.map((x) => (
                        <FormControlLabel
                          key={x?.id}
                          value={x?.id}
                          checked={x?.id === Number(values.labelId)}
                          control={<Radio size="small" />}
                          label={x.name}
                        />
                      ))}
                    </RadioGroup>
                  </AccordionDetails>
                </Accordion>
              </Stack>
            </Scrollbar>
          </Drawer>
        </Form>
      </FormikProvider>
    </>
  );
}

ImageFilters.propTypes = {
  filteredValues: PropTypes.any,
  categories: PropTypes.any,
  labels: PropTypes.any
};
