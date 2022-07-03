import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import closeFill from '@iconify/icons-eva/close-fill';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
// material
import Zoom from '@mui/material/Zoom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Stack,
  Radio,
  Button,
  IconButton,
  Drawer,
  TextField,
  Tooltip,
  Divider,
  Typography,
  RadioGroup,
  FormControlLabel
} from '@material-ui/core';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDateRangePicker from '@mui/lab/MobileDateRangePicker';
import Scrollbar from '../components/Scrollbar';

// ----------------------------------------------------------------------
export const FILTER_COLOR_OPTIONS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107'
];

// ----------------------------------------------------------------------

LogsFilter.propTypes = {
  users: PropTypes.array,
  currentValues: PropTypes.array
};

const typeFilterArray = [
  { type_filter: 'LOGIN' },
  { type_filter: 'LOGOUT' },
  { type_filter: 'SIGN_UP' },
  { type_filter: 'FILE_UPLOAD' },
  { type_filter: 'IMAGE_VIEW' },
  { type_filter: 'FOLDER_VIEW' },
  { type_filter: 'FILE_VIEW' },
  { type_filter: 'LABEL_CREATE' },
  { type_filter: 'LABEL_VIEW' },
  { type_filter: 'LABEL_DELETE' },
  { type_filter: 'CATEGORY_CREATE' },
  { type_filter: 'CATEGORY_VIEW' },
  { type_filter: 'CATEGORY_DELETE' },
  { type_filter: 'CATEGORY_MERGE' },
  { type_filter: 'CATEGORY_UPDATE' },
  { type_filter: 'LABEL_MERGE' },
  { type_filter: 'PASSWORD_FORGOT' }
];
export default function LogsFilter({ filteredValues, users, currentValues }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([new Date(), new Date()]);
  useEffect(() => {}, []);
  const formik = useFormik({
    initialValues: {
      uses_log: '',
      type_filter: currentValues?.type_filter || '',
      date_filter: currentValues?.date_filter || '',
      assign_to: currentValues?.assign_to || ''
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

  const onFilter = () => {
    filteredValues(values, value[0], value[1]);
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Filter list" placement="top" arrow>
        <IconButton onClick={() => setOpen(true)}>
          <Typography variant="h6" mr={1}>
            Filters
          </Typography>
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
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Type</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <RadioGroup {...getFieldProps('type_filter')}>
                      {typeFilterArray.map((x) => (
                        <FormControlLabel
                          key={x.type_filter}
                          value={x.type_filter}
                          control={<Radio size="small" />}
                          label={<>{sentenceCase(x.type_filter)}</>}
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
                    <Typography>Duration</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <RadioGroup {...getFieldProps('date_filter')}>
                      {[
                        { date_filter: 'Last 24 hours' },
                        { date_filter: 'Current week' },
                        { date_filter: 'Current month' },
                        { date_filter: 'Custom date range' }
                      ].map((x) => (
                        <FormControlLabel
                          key={x.date_filter}
                          value={x.date_filter}
                          control={<Radio size="small" />}
                          label={x.date_filter}
                        />
                      ))}
                      {values.date_filter === 'Custom date range' && (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <MobileDateRangePicker
                            startText="Start"
                            value={value}
                            inputFormat="MMM dd, yyyy"
                            // disableCloseOnSelect
                            maxDate={new Date()}
                            onChange={(newValue) => {
                              setValue(newValue);
                            }}
                            renderInput={(startProps, endProps) => (
                              <Box sx={{ mt: 2 }}>
                                <TextField size="small" {...startProps} />
                                <Box sx={{ mx: 2, my: 1 }}> to </Box>
                                <TextField size="small" {...endProps} disabled />
                              </Box>
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    </RadioGroup>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>User</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      fullWidth
                      label="Search user"
                      value={formik.values.uses_log}
                      {...getFieldProps('uses_log')}
                      size="small"
                      onChange={(event) => {
                        setFieldValue('uses_log', event.target.value);
                      }}
                    />
                    <Divider sx={{ mt: 1 }} />
                    <RadioGroup value={values.assign_to} {...getFieldProps('assign_to')}>
                      {users
                        .filter((x) =>
                          `${x.firstName} ${x.lastName}`
                            ?.toLowerCase()
                            .includes(values.uses_log?.toLowerCase())
                        )
                        .map((x, idx) => (
                          <Tooltip
                            key={idx}
                            TransitionComponent={Zoom}
                            title={x.email}
                            placement="top"
                            arrow
                          >
                            <FormControlLabel
                              key={x?.id}
                              value={x?.id}
                              checked={x?.id === Number(values.assign_to)}
                              control={<Radio size="small" />}
                              label={`${x.firstName} ${x.lastName}`}
                            />
                          </Tooltip>
                        ))}
                    </RadioGroup>
                  </AccordionDetails>
                </Accordion>
              </Stack>
            </Scrollbar>

            <Box sx={{ px: 2 }}>
              <Button
                fullWidth
                size="medium"
                type="submit"
                color="primary"
                variant="contained"
                onClick={onFilter}
              >
                Filter
              </Button>
            </Box>
            <Box sx={{ p: 2 }}>
              <Button
                fullWidth
                size="medium"
                type="submit"
                color="inherit"
                variant="outlined"
                onClick={() => {
                  resetForm();
                  setFieldValue('uses_log', '');
                  setFieldValue('type_filter', '');
                  setFieldValue('date_filter', '');
                  setFieldValue('assign_to', '');
                  setValue([new Date(), new Date()]);
                  filteredValues(
                    {
                      type_filter: '',
                      date_filter: '',
                      assign_to: '',
                      startDate: '',
                      endDate: ''
                    },
                    value[0],
                    value[1]
                  );
                  setOpen(false);
                }}
              >
                Clear All
              </Button>
            </Box>
          </Drawer>
        </Form>
      </FormikProvider>
    </>
  );
}
