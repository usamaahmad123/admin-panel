import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import { useSnackbar } from 'notistack5';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  TextField,
  IconButton,
  InputAdornment,
  Tooltip
} from '@material-ui/core';
import searchOutlined from '@iconify/icons-ant-design/search-outlined';
import CircularProgress from '@mui/material/CircularProgress';
import closeFill from '@iconify/icons-eva/close-fill';
// components
import { getRegistredPatients, PatientsDelete } from '../utils/Index';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead } from '../components/_dashboard/user';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'padd' },
  { id: 'id', label: 'Patient id', alignRight: false },
  { id: 'name', label: 'Full name', alignRight: false },
  { id: 'phone', label: 'Phone number', alignRight: false },
  { id: 'date', label: 'Date of birth', alignRight: false },
  { id: 'street_address', label: 'street_address', alignRight: false },
  { id: 'edit', label: 'Action', alignRight: false },
  { id: 'delete', label: 'Delete', alignRight: false }
];

// ----------------------------------------------------------------------
export default function PatientRegistrationList() {
  const [page, setPage] = useState(0);
  const filterName = 'No users found.';
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [data, setData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState(true);
  const [query, setQuery] = useState('');
  useEffect(() => {
    try {
      getUsersCall();
    } catch (error) {
      setSearch(false);
      SnacbarViewer(error?.message, 'error');
    }
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
  const getUsersCall = async () => {
    setSearch(true);
    setData([]);
    await getRegistredPatients().then((res) => {
      if (res?.success) {
        setData(res?.data?.rows);
        SnacbarViewer(res?.message, 'success');
      } else {
        SnacbarViewer(res?.message, 'error');
      }
      setSearch(false);
    });
  };

  if (localStorage.getItem('Role') === '1') {
    return <Navigate to="/dashboard/app" replace />;
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const searching = (event) => {
    setQuery(event.target.value);
  };
  const onDeletePatient = async (ids) => {
    setSearch(true);
    await PatientsDelete(ids).then((res) => {
      setSearch(false);
      if (res.success) {
        getUsersCall();
      } else {
        SnacbarViewer(res?.message, 'error');
      }
    });
  };
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const isUserNotFound = data.length === 0;
  return (
    <Page title="Patient">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Registered patients
          </Typography>
        </Stack>
        <Stack
          alignItems="center"
          justifyContent="space-between"
          sx={{ my: 2, marginBottom: 5 }}
          spacing={3}
          direction={{ xs: 'column', sm: 'row' }}
        >
          <TextField
            label="Search"
            type="search"
            size="small"
            fullWidth
            placeholder="Search by name, id, phone..."
            style={{ paddingRight: 10 }}
            onChange={searching}
            value={query}
            disabled={search}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Icon icon={searchOutlined} />
                </InputAdornment>
              )
            }}
          />
          <Button
            sx={{ minWidth: 'fit-content' }}
            variant="contained"
            component={RouterLink}
            to="/dashboard/registration"
            disabled={search}
            startIcon={<Icon icon={plusFill} />}
          >
            Register patient
          </Button>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} rowCount={data.length} />
                <TableBody>
                  {data
                    .filter((o) =>
                      Object.keys(o).some((k) => {
                        if (k === 'first_name') {
                          if (o.middle_name) {
                            const check = `${String(o[k])} ${String(o.middle_name)} ${String(
                              o.last_name
                            )}`;
                            return check.toLowerCase().includes(query.toLowerCase());
                          }
                          const check = `${String(o[k])} ${String(o.last_name)}`;
                          return check.toLowerCase().includes(query.toLowerCase());
                        }
                        return String(o[k]).toLowerCase().includes(query.toLowerCase());
                      })
                    )
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow key={index} tabIndex={-1}>
                        <TableCell padding="checkbox" />
                        <TableCell align="center">{row.patient_id}</TableCell>
                        <TableCell align="center">
                          {row.middle_name
                            ? `${row.first_name} ${row.middle_name} ${row.last_name}`
                            : `${row.first_name} ${row.last_name}`}
                        </TableCell>
                        <TableCell align="center">{row.other_phone_number || 'N/A'}</TableCell>
                        <TableCell align="center">{row.date_of_birth || 'N/A'}</TableCell>
                        <Tooltip placement="top" arrow title={row.street_address || 'N/A'}>
                          <TableCell align="center">
                            {row.street_address?.length > 30
                              ? `${row.street_address.substr(0, 27)}...`
                              : row.street_address || 'N/A'}
                          </TableCell>
                        </Tooltip>
                        <TableCell align="center">
                          <Button
                            component={RouterLink}
                            to={`/dashboard/registration?patientId=${row.patient_id}&id=${row?.id}`}
                          >
                            Edit
                          </Button>
                        </TableCell>
                        <TableCell align="center">
                          <Button color="error" onClick={() => onDeletePatient(row.patient_id)}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {search > 0 && (
                    <TableRow style={{ height: 53 }}>
                      <TableCell align="center" colSpan={6}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && !search && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={
              data.filter((o) =>
                Object.keys(o).some((k) => {
                  if (k === 'first_name') {
                    if (o.middle_name) {
                      const check = `${String(o[k])} ${String(o.middle_name)} ${String(
                        o.last_name
                      )}`;
                      return check.toLowerCase().includes(query.toLowerCase());
                    }
                    const check = `${String(o[k])} ${String(o.last_name)}`;
                    return check.toLowerCase().includes(query.toLowerCase());
                  }
                  return String(o[k]).toLowerCase().includes(query.toLowerCase());
                })
              ).length
            }
            labelRowsPerPage="Patients per page:"
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
