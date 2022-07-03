import { Icon } from '@iconify/react';
import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import * as React from 'react';
import eyeFilled from '@iconify/icons-ant-design/eye-filled';
import downloadOutlined from '@iconify/icons-ant-design/download-outlined';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  TextField
  // Snackbar,
  // MuiAlert
} from '@material-ui/core';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@material-ui/lab';
import CircularProgress from '@mui/material/CircularProgress';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead } from '../components/_dashboard/user';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'reportName', label: 'Report Name', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'customerName', label: 'Customer Name', alignRight: false },
  { id: 'emailaddress', label: 'Email address', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false }
];
// ----------------------------------------------------------------------

export default function Report() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pdf, setPDF] = useState('');
  const [msg, setMsg] = React.useState('');
  const [notFound, setNotFound] = React.useState('');
  const [search, setSearch] = React.useState(true);
  const [USERS, setUsers] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const LoginSchema = Yup.object().shape({
    order: Yup.string().required('Order number is required')
  });
  const formik = useFormik({
    initialValues: {
      order: ''
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(false);
      } catch (err) {
        // setMsg(err);
        setNotFound(values.order);
        setSubmitting(false);
        setSearch(false);
      }
    }
  });
  if (localStorage.getItem('Role') !== '0') {
    return <Navigate to="/dashboard/app" replace />;
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const base64toBlob = (data) => {
    const base64WithoutPrefix = data.substr('data:application/pdf;base64,'.length);

    const bytes = atob(base64WithoutPrefix);
    let { length } = bytes;
    const out = new Uint8Array(length);
    /* eslint-disable-next-line no-plusplus */
    while (length--) {
      out[length] = bytes.charCodeAt(length);
    }

    return new Blob([out], { type: 'application/pdf' });
  };
  const action = (
    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  const isUserNotFound = USERS.length === 0;

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Inspection reports
          </Typography>
        </Stack>
        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={handleClose}
          message={msg}
          action={action}
        />
        <Stack>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ my: 2, marginBottom: 5 }}
                spacing={3}
              >
                <TextField
                  fullWidth
                  type="text"
                  label="Order number*"
                  size="small"
                  {...getFieldProps('order')}
                  disabled={isSubmitting}
                  error={Boolean(touched.order && errors.order)}
                  helperText={touched.order && errors.order}
                />
                <LoadingButton
                  size="small"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Search
                </LoadingButton>
              </Stack>
            </Form>
          </FormikProvider>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} rowCount={USERS.length} />
                <TableBody>
                  {USERS.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, date, email, customerName, reportName } = row;
                    // const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1}>
                        <TableCell padding="checkbox" />
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {reportName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{date}</TableCell>
                        <TableCell align="left">{customerName}</TableCell>
                        <TableCell align="left">{email}</TableCell>
                        <TableCell>
                          <Icon
                            onClick={() => {
                              if (pdf) {
                                const blob = base64toBlob(pdf);
                                const url = URL.createObjectURL(blob);
                                window.open(url, '_blank');
                              }
                            }}
                            color="#97d700"
                            icon={eyeFilled}
                            width={24}
                            height={24}
                          />
                          <Icon
                            onClick={() => {
                              if (pdf) {
                                const linkSource = `${pdf}`;
                                const downloadLink = document.createElement('a');
                                const fileName = 'serviceeport.pdf';
                                downloadLink.href = linkSource;
                                downloadLink.download = fileName;
                                console.log(downloadLink.href);
                                downloadLink.click();
                              }
                            }}
                            color="#97d700"
                            icon={downloadOutlined}
                            width={24}
                            height={24}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {search && (
                    <TableRow style={{ height: 53 }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && !search && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={notFound} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERS.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
