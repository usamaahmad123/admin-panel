import { Icon } from '@iconify/react';
import { useEffect, useState, useRef } from 'react';
import { sentenceCase } from 'change-case';
import moment from 'moment';
import { Link as Navigate } from 'react-router-dom';
import { useSnackbar } from 'notistack5';
import { CSVLink } from 'react-csv';
import exportOutlined from '@iconify/icons-ant-design/export-outlined';

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
  TextField,
  Box,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  Chip,
  Tooltip
} from '@material-ui/core';
import searchOutlined from '@iconify/icons-ant-design/search-outlined';
import closeFill from '@iconify/icons-eva/close-fill';

// components
import { UserListHead } from '../components/_dashboard/user';
import { getAdminUsers, getLogs } from '../utils/Index';
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import LogsFilter from './LogsFilter';

// ----------------------------------------------------------------------
const headers = [
  { label: 'First Name', key: 'first_name' },
  { label: 'Last Name', key: 'last_name' },
  { label: 'Date', key: 'createdAt' },
  { label: 'Description', key: 'message' },
  { label: 'Status', key: 'action' }
];
const headerLabel = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'createdAt', label: 'Date', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false }
];

export default function Logs() {
  const [page, setPage] = useState(0);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [data, setData] = useState([]);
  const [csvData, setCSVData] = useState([]);
  const [users, setUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [project, setProject] = useState('EMR');
  const [order, setOrder] = useState('desc');
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilteredValues] = useState({});
  const [tags, setTags] = useState(Object.keys(filterValues));
  const csvLinkRef = useRef(null);
  useEffect(() => {
    try {
      getLogsCall();
    } catch (error) {
      setSearch(false);
      enqueueSnackbar(error?.message, {
        variant: 'error',
        action: (key) => (
          <IconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </IconButton>
        )
      });
    }
  }, [filterValues, startDate, endDate]);
  useEffect(
    () =>
      getAdminUsers().then((res) => {
        if (res?.success) {
          setUsers(res?.data);
        }
      }),
    []
  );
  const getLogsCall = async () => {
    let StartDate;
    let EndDate;
    if (filterValues?.date_filter?.length) {
      switch (filterValues?.date_filter) {
        case 'Last 24 hours':
          EndDate = moment().format('YYYY-MM-DD');
          StartDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
          break;
        case 'Current week': {
          const curr = new Date();
          const first = curr.getDate() - curr.getDay();
          const last = first + 5;
          StartDate = moment().format('YYYY-MM-DD');
          EndDate = moment(new Date(curr.setDate(last)).toUTCString()).format('YYYY-MM-DD');
          break;
        }
        case 'Current month': {
          const curr = new Date();
          StartDate = moment().format('YYYY-MM-DD');
          EndDate = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);
          EndDate = moment(EndDate).format('YYYY-MM-DD');
          break;
        }
        case 'Custom date range': {
          StartDate = moment(startDate).format('YYYY-MM-DD');
          EndDate = moment(endDate).format('YYYY-MM-DD');
          break;
        }
        default:
          break;
      }
    }
    setSearch(true);
    setData([]);
    await getLogs(StartDate, EndDate, filterValues).then((res) => {
      if (res?.success) {
        setData(res?.data);
        setCSVData(res?.data);
        enqueueSnackbar('Logs loaded.', {
          variant: 'success',
          action: (key) => (
            <IconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </IconButton>
          )
        });
      } else {
        enqueueSnackbar('Logs failed to load.', {
          variant: 'error',
          action: (key) => (
            <IconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </IconButton>
          )
        });
      }
      setSearch(false);
    });
  };
  const csvReport = {
    data: csvData.map((single) => {
      const singleColumn = single;
      singleColumn.action = sentenceCase(singleColumn.action);
      return singleColumn;
    }),
    headers,
    filename: 'Logs.csv'
  };

  if (localStorage.getItem('Role') === '1') {
    return <Navigate to="/dashboard/app" replace />;
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const searching = (event) => {
    setSearchValue(event.target.value);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleDelete = (key) => {
    const valve = filterValues;
    delete valve[key];
    setFilteredValues(valve);
    setTags(Object.keys(valve));
    getLogsCall();
  };

  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Logs
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            {filterValues !== null && tags.length > 0 ? (
              <Stack direction="row" spacing={1}>
                {tags.map((tag) => {
                  if (tag === 'uses_log') {
                    return null;
                  }
                  if (tag === 'assign_to' && filterValues[tag]) {
                    const filterUser = users.filter(
                      (user) => user.id === Number(filterValues[tag])
                    );
                    return (
                      filterUser.length && (
                        <Chip
                          label={`${sentenceCase(filterUser[0]?.firstName)} ${sentenceCase(
                            filterUser[0]?.lastName
                          )}`}
                          varient="outlined"
                          color="success"
                          disabled={search}
                          onDelete={() => handleDelete(tag)}
                        />
                      )
                    );
                  }
                  if (filterValues[tag]) {
                    return (
                      <Chip
                        label={sentenceCase(filterValues[tag])}
                        varient="outlined"
                        color="success"
                        disabled={search}
                        onDelete={() => handleDelete(tag)}
                      />
                    );
                  }
                  return null;
                })}
              </Stack>
            ) : null}
            {data.length > 0 && (
              <Tooltip title="Export as CSV" placement="top" arrow>
                <IconButton
                  disabled={search}
                  size="small"
                  onClick={() => csvLinkRef.current.link.click()}
                >
                  <Icon width={30} height={30} icon={exportOutlined} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
          <CSVLink style={{ display: 'none' }} {...csvReport} ref={csvLinkRef} />
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
          {/* <span style={{ direction: 'flex', justifyContent: 'space-between' }}> */}
          <TextField
            label="Search"
            type="search"
            size="small"
            fullWidth
            style={{ paddingRight: 10 }}
            value={searchValue}
            onChange={searching}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Icon icon={searchOutlined} />
                </InputAdornment>
              )
            }}
          />{' '}
          <LogsFilter
            users={users}
            currentValues={filterValues}
            filteredValues={(filteredValues, startDate, endDate) => {
              setFilteredValues(filteredValues);
              setStartDate(startDate);
              setEndDate(endDate);
              setPage(0);
              if (filteredValues) {
                setTags(Object.keys(filteredValues));
              }
            }}
          />
          {/* </span> */}
        </Stack>
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 720 }}>
              <Table>
                <UserListHead
                  order={order}
                  onRequestSort={() => {
                    setData(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                    if (order === 'desc') {
                      setData(
                        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).reverse()
                      );
                    }
                    setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                  }}
                  headLabel={headerLabel}
                  rowCount={data.length}
                />
                <TableBody>
                  {data
                    .filter((o) =>
                      Object.keys(o).some((k) => {
                        if (k === 'first_name') {
                          const check = `${String(o[k])} ${String(o.last_name)}`;
                          return check.toLowerCase().includes(searchValue.toLowerCase());
                        }
                        return String(o[k]).toLowerCase().includes(searchValue.toLowerCase());
                      })
                    )
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow key={row.id}>
                        <TableCell />
                        <TableCell>
                          <Box>
                            <Typography variant="body1">
                              {' '}
                              {row?.first_name} {row?.last_name}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Typography variant="subtitle2">
                            {/* {moment(row?.createdAt).format('h:mm A')} */}
                            {row?.createdAt?.split('T')[1]?.split('.')[0]}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {moment(row?.createdAt).format('ll')}
                          </Typography>
                        </TableCell>

                        <TableCell>{row?.message || 'N/A'}</TableCell>

                        <TableCell>
                          <Label
                            color={
                              (row.action === 'LOGIN' && 'success') ||
                              (row.action === 'LOGOUT' && 'warning') ||
                              'success'
                            }
                          >
                            {sentenceCase(row.action)}
                          </Label>
                        </TableCell>
                      </TableRow>
                    ))}
                  {search && (
                    <TableRow style={{ height: 53 }}>
                      <TableCell align="center" colSpan={6}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
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
                    const check = `${String(o[k])} ${String(o.last_name)}`;
                    return check.toLowerCase().includes(searchValue.toLowerCase());
                  }
                  return String(o[k]).toLowerCase().includes(searchValue.toLowerCase());
                })
              ).length
            }
            labelRowsPerPage="Logs per page:"
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
