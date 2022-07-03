import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from 'notistack5';
import { sentenceCase } from 'change-case';
// material
import {
  Card,
  Stack,
  Container,
  Typography,
  IconButton,
  Grid,
  CardMedia,
  Link,
  Chip
} from '@material-ui/core';
import closeFill from '@iconify/icons-eva/close-fill';
// components
import { ImagesFilter, getAdminPatients, getCategories, getLabels } from '../utils/Index';
import Page from '../components/Page';
import './StyleSheet.css';
import ImageFilters from './ImageFilters';
// ----------------------------------------------------------------------

export default function ImageSearch() {
  const [images, setImages] = useState([]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [filteredValues, setFilteredValues] = useState({});
  const [patients, setPatients] = useState([]);
  const [tags, setTags] = useState(Object.keys(filteredValues));
  const [categories, setCategories] = useState([]);
  const [labels, setLabels] = useState([]);
  const [search, setSearch] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    getImagesCall();
    getAdminPatients().then((res) => {
      if (res?.success) {
        setPatients(res?.data);
      }
    });
    getCategories().then((res) => {
      if (res.success) {
        setCategories(res.data);
      }
    });
    getLabels().then((res) => {
      if (res?.success) {
        setLabels(res?.data);
      }
    });
  }, []);
  const getImagesCall = () => {
    setPhotoIndex(0);
    setImages([]);
    setSearch(true);
    let queryParams = '';
    Object.keys(filteredValues).forEach((key) => {
      queryParams += `${key}=${filteredValues[key]}&`;
    });
    ImagesFilter(queryParams).then((res) => {
      if (res.success) {
        setImages(res.data);
        SnacbarViewer(
          `${res.data.length} ${res.data.length > 1 ? 'images' : 'image'} ${
            res.data.length > 1 ? 'have' : 'has'
          } been loaded.`,
          'success'
        );
      } else {
        SnacbarViewer(res.message, 'error');
      }
      setSearch(false);
    });
  };
  useEffect(() => {
    if (Object.keys(filteredValues)?.length > 0) {
      getImagesCall();
    }
  }, [filteredValues]);
  const handleDelete = (key) => {
    const valve = filteredValues;
    delete valve[key];
    setFilteredValues(valve);
    setTags(Object.keys(valve));
    getImagesCall();
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
  return (
    <Page title="Search images">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Search images
          </Typography>
          <ImageFilters
            categories={categories}
            labels={labels}
            patients={patients}
            filteredValues={(values) => {
              setFilteredValues(values);
              if (values) {
                setTags(Object.keys(values));
              }
            }}
          />
        </Stack>
        <Stack direction="row-reverse" alignItems="center" justifyContent="space-between" mb={10}>
          {filteredValues !== null && tags.length > 0 ? (
            <Stack direction="row" spacing={1}>
              {tags.map((tag) => {
                if (tag === 'patientId' && filteredValues[tag]) {
                  const filterUser = patients.filter(
                    (user) => user.patientId === filteredValues[tag]
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
                if (tag === 'categoryId' && filteredValues[tag]) {
                  const filteredCategory = categories.filter(
                    (category) => category.id === Number(filteredValues[tag])
                  );
                  return (
                    filteredCategory.length && (
                      <Chip
                        label={filteredCategory[0].name}
                        varient="outlined"
                        color="success"
                        disabled={search}
                        onDelete={() => handleDelete(tag)}
                      />
                    )
                  );
                }
                if (tag === 'labelId' && filteredValues[tag]) {
                  const filterId = labels.filter((user) => user.id === Number(filteredValues[tag]));
                  return (
                    filterId.length && (
                      <Chip
                        label={filterId[0]?.name}
                        varient="outlined"
                        color="success"
                        disabled={search}
                        onDelete={() => handleDelete(tag)}
                      />
                    )
                  );
                }
                if (filteredValues[tag]) {
                  return (
                    <Chip
                      label={filteredValues[tag]}
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
        </Stack>
        {/* <Stack direction="row-reverse" alignItems="center" justifyContent="space-between" mb={10}> */}
        <Grid container spacing={3} sx={{ pl: 5, pb: 2, mb: 2 }}>
          {images?.length > 0 ? (
            images.map((image, idx) => (
              <Grid key={idx} item md={3} xs={6} mb={2}>
                <Link
                  to={`/dashboard/viewer/${image.folderId}/0?fileId=${image.fileId}`}
                  color="inherit"
                  underline="none"
                  component={RouterLink}
                >
                  <Card>
                    <CardMedia
                      sx={{ width: 300, minHeight: 200 }}
                      component="img"
                      // image={image.webContentLink}
                      image={image.thumbnailLink}
                    />
                  </Card>
                </Link>
              </Grid>
            ))
          ) : (
            <Stack direction="row" alignItems="center" justifyContent="space-between" mt={5}>
              <Typography variant="body1" gutterBottom>
                Kindly apply filter.
              </Typography>
            </Stack>
          )}
        </Grid>
        {/* </Stack> */}
      </Container>
    </Page>
  );
}
