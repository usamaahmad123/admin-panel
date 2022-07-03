import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@material-ui/core/styles';
import {
  Box,
  Tooltip,
  Drawer,
  Typography,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack
} from '@material-ui/core';
import Zoom from '@mui/material/Zoom';
// components
import Logo from '../components/Logo';
import Scrollbar from '../components/Scrollbar';
import { MHidden } from '../components/@material-extend';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 250;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH
  }
}));

// ----------------------------------------------------------------------
const searching = ['patientId', 'firstName', 'phoneNumber', 'dateOfBirth'];

CustomSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};

export default function CustomSidebar({
  isOpenSidebar,
  onCloseSidebar,
  patients,
  onPatientsChange
}) {
  const { pathname } = useLocation();
  const [patientSearch, setPatientSearch] = useState('');
  const [user, setUser] = useState('');
  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  useEffect(() => {
    onPatientsChange(user);
  }, [user]);
  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <Box sx={{ px: 2.5, py: 3 }}>
        <Box
          component={RouterLink}
          to={localStorage.getItem('Role') === '1' ? '/dashboard/data' : '/dashboard/app'}
          sx={{ display: 'flex', justifyContent: 'space-around' }}
        >
          <Logo />
        </Box>
      </Box>
      <Box sx={{ py: 1, px: 1 }}>
        <Button component={RouterLink} to="/" fullWidth>
          Back to main
        </Button>
        <Button onClick={() => setUser('')} fullWidth>
          All images
        </Button>
        <Button onClick={() => setUser('Unassigned')} fullWidth>
          Unassigned
        </Button>{' '}
        <Button sx={{ mb: 1 }} variant="contained" fullWidth>
          Select provider
        </Button>
        <Button sx={{ mb: 1 }} variant="contained" fullWidth>
          Select location
        </Button>
      </Box>

      <Box sx={{ mb: 5, mx: 1, mt: 1 }}>
        <Scrollbar>
          <Stack>
            <TextField
              fullWidth
              label="Search patient"
              placeholder="Search by name, patientId.."
              value={patientSearch}
              size="small"
              onChange={(event) => {
                setPatientSearch(event.target.value);
              }}
              sx={{ mb: 1, mt: 1 }}
            />
            {/* <Divider sx={{ mt: 1 }} /> */}
            <RadioGroup>
              {patients &&
                patients
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
                  .map((x, idx) => (
                    <Tooltip
                      key={idx}
                      TransitionComponent={Zoom}
                      title={`Patient id #${x.patientId}`}
                      placement="top"
                      arrow
                    >
                      <FormControlLabel
                        key={x?.patientId}
                        value={x?.patientId}
                        checked={x?.patientId === user}
                        onChange={(e) => {
                          setUser(e.target.value);
                        }}
                        control={<Radio size="small" />}
                        label={
                          <>
                            {/* <Typography variant="subtitle1" gutterBottom> */}
                            {x.middleName
                              ? `${x.firstName} ${x.middleName} ${x.lastName}`
                              : `${x.firstName} ${x.lastName}`}
                            {/* </Typography> */}
                            <Typography variant="subtitle2" gutterBottom>
                              {x.dateOfBirth}
                            </Typography>
                          </>
                        }
                      />
                    </Tooltip>
                  ))}
            </RadioGroup>
          </Stack>
        </Scrollbar>
      </Box>

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <RootStyle>
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default'
            }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
