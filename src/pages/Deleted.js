import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { Link as Navigate } from 'react-router-dom';
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
  MenuItem,
  Select,
  InputLabel,
  IconButton,
  InputAdornment,
  ButtonGroup
} from '@material-ui/core';
import searchOutlined from '@iconify/icons-ant-design/search-outlined';
import MuiFormControl from '@material-ui/core/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import { withStyles } from '@material-ui/styles';
import closeFill from '@iconify/icons-eva/close-fill';

// components
import { deletedUsers, permanentlyDelete, restoreUser } from '../utils/Index';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead } from '../components/_dashboard/user';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'firstname', label: 'First name', alignRight: false },
  { id: 'lastname', label: 'Last name', alignRight: false },
  { id: 'email', label: 'Email address', alignRight: false },
  { id: 'username', label: 'Username', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'edit', label: 'Action', alignRight: false }
];

// ----------------------------------------------------------------------
const FormControl = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      fontSize: 14
    },
    '& .MuiInputLabel-root': {
      fontSize: 15,
      lineHeight: 2,
      marginTop: -3
    },
    '& .MuiInputBase-input': {
      paddingTop: 9,
      paddingBottom: 10
    }
  }
})(MuiFormControl);

export default function Deleted() {
  const [page, setPage] = useState(0);
  const filterName = 'No users found.';
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [data, setData] = useState([]);
  const [add, setAdd] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [project, setProject] = useState('EMR');
  const [search, setSearch] = useState(true);
  const [query, setQuery] = useState('');
  useEffect(() => {
    try {
      setSearch(true);
      setData([]);
      deletedUsers().then((res) => {
        if (res?.success) {
          setData(res?.data);
          SnacbarViewer(res.message, 'success');
        } else {
          SnacbarViewer(res.message, 'error');
        }
        setSearch(false);
      });
    } catch (error) {
      setSearch(false);
      SnacbarViewer(error.message, 'error');
    }
  }, []);
  const getUsersCall = async () => {
    setSearch(true);
    setQuery('');
    setData([]);
    await deletedUsers().then((res) => {
      if (res?.success) {
        setData(res?.data);
      } else {
        SnacbarViewer(res.message, 'error');
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
  const deleteUserFn = async (uuid) => {
    try {
      await permanentlyDelete(uuid).then((res) => {
        if (res?.success) {
          SnacbarViewer(res.message, 'success');
          setAdd(false);
          getUsersCall();
        } else {
          SnacbarViewer(res.message, 'error');
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  const restoreUserFn = async (uuid) => {
    try {
      await restoreUser(uuid).then((res) => {
        if (res?.success) {
          SnacbarViewer(res.message, 'success');
          setAdd(false);
          getUsersCall();
        } else {
          SnacbarViewer(res.message, 'error');
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };

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

  const isUserNotFound = data.length === 0;

  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Deleted users
          </Typography>
        </Stack>
        <Stack
          alignItems="center"
          justifyContent="space-between"
          sx={{ my: 2, marginBottom: 5 }}
          spacing={3}
          direction={{ xs: 'column', sm: 'row' }}
        >
          <FormControl fullWidth>
            <InputLabel id="project-label">Project*</InputLabel>
            <Select
              labelId="project-label"
              id="project-select"
              label="project"
              size="small"
              onChange={(event) => {
                setProject(event.target.value);
              }}
              value={project}
              disabled={search || localStorage.getItem('Role') !== '0'}
            >
              <MenuItem selected disabled>
                Choose Project
              </MenuItem>
              <MenuItem value="EMR">EMR</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Search"
            type="search"
            size="small"
            fullWidth
            style={{ paddingRight: 10 }}
            onChange={(event) => setQuery(event.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Icon icon={searchOutlined} />
                </InputAdornment>
              )
            }}
          />
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
                        if (k === 'firstName') {
                          const check = `${String(o[k])} ${String(o.lastName)}`;
                          return check.toLowerCase().includes(query.toLowerCase());
                        }
                        return String(o[k]).toLowerCase().includes(query.toLowerCase());
                      })
                    )
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { isAdmin, firstName, lastName, email, username } = row;
                      // const isItemSelected = selected.indexOf(name) !== -1;

                      return (
                        <TableRow key={row?.uuid} tabIndex={-1}>
                          <TableCell padding="checkbox" />
                          {/* <TableCell align="center">{index + page * rowsPerPage + 1}</TableCell> */}
                          <TableCell align="center">{firstName}</TableCell>
                          <TableCell align="center">{lastName}</TableCell>
                          <TableCell align="center">{email}</TableCell>
                          <TableCell align="center">{username}</TableCell>
                          <TableCell align="center">{isAdmin ? 'Admin' : 'User'}</TableCell>
                          <TableCell align="center">
                            <ButtonGroup size="small" disableElevation variant="outlined">
                              <Button onClick={() => restoreUserFn(row?.uuid)}>Restore</Button>
                              <Button color="error" onClick={() => deleteUserFn(row?.uuid)}>
                                Delete
                              </Button>
                            </ButtonGroup>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
                  if (k === 'firstName') {
                    const check = `${String(o[k])} ${String(o.lastName)}`;
                    return check.toLowerCase().includes(query.toLowerCase());
                  }
                  return String(o[k]).toLowerCase().includes(query.toLowerCase());
                })
              ).length
            }
            labelRowsPerPage="Users per page:"
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
