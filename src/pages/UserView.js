import React, { useState, useEffect } from 'react';
import { Link as useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack5';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
// material
import { Stack, Card, Typography, CircularProgress, IconButton, Button } from '@material-ui/core';
// components
import Page from '../components/Page';
import { approveUser, getUserDetail } from '../utils/Index';

// ----------------------------------------------------------------------

export default function UserView() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id, userid } = useParams();
  const userId = id;

  useEffect(() => {
    try {
      if (userId) {
        getUserDetail(userId).then((res) => {
          if (res.success) {
            enqueueSnackbar(res.message, {
              variant: 'success',
              action: (key) => (
                <IconButton size="small" onClick={() => closeSnackbar(key)}>
                  <Icon icon={closeFill} />
                </IconButton>
              )
            });
            setUser(res?.data);
          } else {
            enqueueSnackbar(res.message, {
              variant: 'error',
              action: (key) => (
                <IconButton size="small" onClick={() => closeSnackbar(key)}>
                  <Icon icon={closeFill} />
                </IconButton>
              )
            });
            navigate('/dashboard', { replace: true });
          }
          setLoading(false);
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, [userId]);

  if (!id) {
    navigate('/dashboard', { replace: true });
  }
  if (localStorage.getItem('Role') === '1') {
    navigate('/dashboard', { replace: true });
  }
  const approveRejectUser = (action) => {
    approveUser(userid, action).then((res) => {
      if (res.success) {
        enqueueSnackbar(res.message, {
          variant: 'success',
          action: (key) => (
            <IconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </IconButton>
          )
        });
        navigate('/dashboard/user/all', { replace: true });
      } else {
        enqueueSnackbar(res.message, {
          variant: 'error',
          action: (key) => (
            <IconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </IconButton>
          )
        });
      }
    });
  };

  return (
    <Page title="View User" sx={{ display: 'flex', justifyContent: 'center' }}>
      {!loading ? (
        <>
          <Card sx={{ mx: 3, minWidth: 380, maxWidth: 400 }}>
            <Typography sx={{ px: 4, pt: 4, pb: 3 }} variant="h4" gutterBottom>
              Approve/Reject user
            </Typography>
            <Stack sx={{ px: 4, pb: 3 }}>
              <Typography variant="body2">Name:</Typography>
              <Typography variant="subtitle1">
                {user?.firstName} {user?.lastName}
              </Typography>
            </Stack>
            <Stack sx={{ px: 4, pb: 3 }}>
              <Typography variant="body2">Email:</Typography>
              <Typography variant="subtitle1">{user?.email}</Typography>
            </Stack>
            <Stack sx={{ px: 4, pb: 3 }}>
              <Typography variant="body2">Role:</Typography>
              <Typography variant="subtitle1">{user?.isAdmin ? 'Admin' : 'Normal user'}</Typography>
            </Stack>
            <Stack sx={{ px: 4, pb: 3 }}>
              <Typography variant="body2">Username:</Typography>
              <Typography variant="subtitle1">{user?.username}</Typography>
            </Stack>
            <Stack sx={{ px: 4, pb: 3 }}>
              <Typography variant="body2">Phone:</Typography>
              <Typography variant="subtitle1">{user?.phoneNumber}</Typography>
            </Stack>
            <Stack sx={{ px: 4, pb: 3 }}>
              <Button onClick={() => approveRejectUser('APPROVED')}>Approve</Button>
              <Button onClick={() => approveRejectUser('REJECTED')} color="error">
                Reject
              </Button>
            </Stack>
          </Card>
        </>
      ) : (
        <CircularProgress />
      )}
    </Page>
  );
}
