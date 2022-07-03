import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from 'notistack5';
// material
import {
  Stack,
  Container,
  Typography,
  CircularProgress,
  IconButton,
  Grid,
  Link,
  Button
} from '@material-ui/core';
import closeFill from '@iconify/icons-eva/close-fill';
import folderFilled from '@iconify/icons-ant-design/folder-filled';
// components
import { getAllFolder } from '../utils/Index';
import Page from '../components/Page';
import './StyleSheet.css';
// ----------------------------------------------------------------------

export default function ImageViewer() {
  const [folders, setFolders] = useState([]);
  const [search, setSearch] = useState(true);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    try {
      getAllFolder().then((res) => {
        if (res.success) {
          setFolders(res.data);
        } else {
          SnacbarViewer(res.message, 'error');
        }
        setSearch(false);
      });
    } catch (error) {
      console.log(error);
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
  return (
    <Page title="Image viewer">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Add metadata
          </Typography>
          <Button component={RouterLink} to="/dashboard/searchimages">
            Search images
          </Button>
        </Stack>
        {folders.length === 0 && !search && (
          <Typography variant="h7" gutterBottom>
            No folders available.
          </Typography>
        )}
        <Stack direction="row" alignItems="center" justifyContent="center">
          {search && <CircularProgress />}
        </Stack>
        <Grid container spacing={3} sx={{ pl: 5 }}>
          {folders.map((folder) => (
            <Link
              to={`/dashboard/thumbnail/${folder.folderId || folder.id}`}
              color="inherit"
              underline="none"
              component={RouterLink}
            >
              <Grid sx={{ minWidth: 100 }} item xs={4} md={2}>
                <Stack direction="column" alignItems="center" justifyContent="space-between" mb={5}>
                  <Icon icon={folderFilled} width="108" height="108" color="#005eff" />
                  <Typography variant="subtitle1" gutterBottom>
                    {folder.folderName || folder.name}
                  </Typography>
                </Stack>
              </Grid>
            </Link>
          ))}
        </Grid>
      </Container>
    </Page>
  );
}
