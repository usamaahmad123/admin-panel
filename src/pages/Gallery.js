import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useOutletContext } from 'react-router-dom';
import { useSnackbar } from 'notistack5';
// material
import {
  Card,
  Stack,
  Container,
  Typography,
  Button,
  IconButton,
  Grid,
  CardMedia,
  Link,
  Modal,
  TextField,
  InputAdornment,
  Checkbox,
  Box,
  Tooltip,
  Divider
} from '@material-ui/core';
import Tabs from '@mui/material/Tabs';
import searchOutlined from '@iconify/icons-ant-design/search-outlined';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import { styled } from '@material-ui/core/styles';
import closeFill from '@iconify/icons-eva/close-fill';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
// components
import {
  deleteFiles,
  getAdminPatients,
  ImagesFilter,
  getCategories,
  getLabels,
  getIndexLesions
} from '../utils/Index';
import Page from '../components/Page';
import './StyleSheet.css';
import CustomSidebar from './CustomSidebar';
import AddMetaData from './AddMetaData';
import ImageFilters from './ImageFilters';
import ViewerIndex from '../components/ViewerIndex';
// ----------------------------------------------------------------------
const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  minWidth: 400,
  borderRadius: 2,
  p: 3
};
export default function Gallery() {
  const [images, setImages] = useState([]);
  const [group, setGroup] = useState([]);
  const [index, setIndex] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [search, setSearch] = useState(false);
  const [data, setData] = useState([]);
  const [open, setOpen] = useOutletContext();
  const [selected, setSelected] = useState([]);
  const [categories, setCategories] = useState([]);
  const [labels, setLabels] = useState([]);
  const [filteredValues, setFilteredValues] = useState({});
  const [tags, setTags] = useState(Object.keys(filteredValues));
  const [value, setValue] = useState(0);
  const [query, setQuery] = useState('');
  const [viewerModal, setViewerModal] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  useEffect(() => {
    getAdminPatients().then((res) => {
      if (res?.success) {
        setData(res?.data);
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
  useEffect(() => {
    setSelected([]);
    if (value === 0) {
      setImages([]);
      setSearch(true);
      const patientid = patientId === 'Unassigned' ? null : patientId;
      ImagesFilter(patientid ? `patientId=${patientid}` : '').then((res) => {
        setSearch(false);
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
      });
    } else {
      getIndexCall();
    }
  }, [patientId]);
  const getImagesCall = () => {
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
  const getIndexCall = () => {
    if (patientId) {
      setIndex([]);
      setSearch(true);
      const patientid = data.filter((patient) => patientId === patient.patientId);
      getIndexLesions(patientid[0]?.id || '').then((res) => {
        if (res.success) {
          setIndex(res.data);
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
    } else {
      SnacbarViewer('Select a patient!', 'error');
    }
  };
  useEffect(() => {
    if (Object.keys(filteredValues)?.length > 0) {
      setSelected([]);
      getImagesCall();
    }
  }, [filteredValues]);
  const handleClick = (event, fileId) => {
    const selectedIndex = selected.indexOf(fileId);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, fileId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };
  const handleSelectClick = (event, images) => {
    let prevSelected = selected;
    for (let i = 0; i < images.length; i += 1) {
      const selectedIndex = prevSelected.filter((id) => id === images[i].fileId);
      if (selectedIndex.length === 0) {
        let newArray = [];
        newArray = newArray.concat(prevSelected, images[i].fileId);
        prevSelected = newArray;
      } else {
        prevSelected = prevSelected.filter((id) => id !== images[i].fileId);
      }
    }
    setSelected(prevSelected);
  };
  const handleSelectAllClick = () => {
    if (value === 0) {
      const newSelecteds = images.map((n) => n.fileId);
      setSelected(newSelecteds);
    } else {
      const newSelecteds = [];
      for (let i = 0; i < index.length; i += 1) {
        for (let j = 0; j < index[i].labelGroupData.length; j += 1) {
          const arrayFile = index[i].labelGroupData;
          for (let z = 0; z < arrayFile[j].images.length; z += 1) {
            if (arrayFile[j].images[z].fileId) {
              newSelecteds.push(arrayFile[j].images[z].fileId);
            }
          }
        }
      }
      setSelected(newSelecteds);
    }
  };
  const handleDelete = () => {
    deleteFiles(selected).then((res) => {
      if (res.success) {
        if (value === 0) {
          setImages([]);
          setSearch(true);
          const patientid = patientId === 'Unassigned' ? null : patientId;
          ImagesFilter(patientid ? `patientId=${patientid}` : '').then((res) => {
            setSearch(false);
            if (res.success) {
              setImages(res.data);
              setSelected([]);
            }
          });
        } else {
          getIndexCall();
        }
      } else {
        SnacbarViewer(res.message, 'error');
      }
    });
  };
  const handleChange = (event, newValue) => {
    if (newValue === 0) {
      getImagesCall();
    } else {
      getIndexCall();
    }
    setSelected([]);
    setValue(newValue);
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
    <RootStyle>
      <CustomSidebar
        isOpenSidebar={open}
        onPatientsChange={(value) => setPatientId(value)}
        onCloseSidebar={() => setOpen(false)}
        patients={data}
      />

      <Page sx={{ width: '100%' }} title="Image viewer">
        <Container maxWidth="xl">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Tabs style={{ width: '100%' }} value={value} onChange={handleChange}>
              <Tab disabled={search} label="View Images" />
              <Tab disabled={search} label="View Index Lesion" />
            </Tabs>
            <TextField
              label="Search"
              type="search"
              size="small"
              placeholder="Search images by data / name / location"
              style={{ paddingRight: 10 }}
              fullWidth
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
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h4" gutterBottom>
              Gallery
            </Typography>
            <Box>
              <Button sx={{ mr: 1 }} disabled={images.length <= 0} onClick={handleSelectAllClick}>
                Select all
              </Button>
              <Button sx={{ mr: 1 }} disabled={images.length <= 0} onClick={() => setSelected([])}>
                Unselect all
              </Button>
              {localStorage.getItem('role') !== '1' && (
                <Button
                  sx={{ mr: 1 }}
                  disabled={selected.length <= 0}
                  color="error"
                  variant="contained"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              )}
              <AddMetaData
                onAdditionMetadata={() => {
                  setSelected([]);
                  if (value === 0) {
                    setSearch(true);
                    const patientid = patientId === 'Unassigned' ? null : patientId;
                    ImagesFilter(patientid ? `patientId=${patientid}` : '').then((res) => {
                      setSearch(false);
                      if (res.success) {
                        setImages(res.data);
                        SnacbarViewer(
                          `${res.data.length} ${res.data.length > 1 ? 'images' : 'image'} ${
                            res.data.length > 1 ? 'have' : 'has'
                          } been loaded.`,
                          'success'
                        );
                        setSelected([]);
                      } else {
                        SnacbarViewer(res.message, 'error');
                      }
                    });
                  } else {
                    getIndexCall();
                  }
                }}
                patientId={patientId}
                value={value}
                categories={categories}
                patients={data}
                selected={selected}
              />
              <ImageFilters
                categories={categories}
                labels={labels}
                patients={data}
                filteredValues={(values) => {
                  setFilteredValues(values);
                  if (values) {
                    setTags(Object.keys(values));
                  }
                }}
              />
            </Box>
          </Stack>
          <Modal
            open={viewerModal}
            onClose={() => {
              setViewerModal(false);
              setGroup([]);
            }}
          >
            <Box sx={style}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0}>
                <Typography variant="h4" gutterBottom>
                  Images
                </Typography>
                <Button
                  onClick={() => {
                    setViewerModal(false);
                  }}
                >
                  <CloseIcon />
                </Button>
              </Stack>
              <ViewerIndex images={group} />
            </Box>
          </Modal>
          {!search &&
            (value === 0 ? (
              <>
                {images?.length > 0 ? (
                  images.map((datewise) => (
                    <>
                      <Stack>
                        <Typography variant="h6" gutterBottom>
                          {datewise.date}
                        </Typography>
                      </Stack>
                      <Grid container spacing={1} sx={{ pl: 5, pb: 4 }}>
                        {datewise.files
                          .filter((o) =>
                            Object.keys(o).some((k) =>
                              String(o[k]).toLowerCase().includes(query.toLowerCase())
                            )
                          )
                          .map((image) => {
                            let labelArr = [];
                            for (let i = 0; i < image.labels.length; i += 1) {
                              labelArr.push(image.labels[i].name);
                            }
                            labelArr = labelArr.join();
                            if (image.patient && patientId === 'Unassigned') {
                              return null;
                            }
                            return (
                              <Grid key={index} item md={3} sm={6} xs={6}>
                                <Card>
                                  <Link
                                    to={`/dashboard/viewer/${image.folderId}/0?fileId=${image.fileId}`}
                                    color="inherit"
                                    underline="none"
                                    component={RouterLink}
                                  >
                                    <CardMedia
                                      sx={{ width: 1000, minHeight: 200 }}
                                      component="img"
                                      image={image.thumbnailLink}
                                    />
                                  </Link>
                                  <Stack direction="column">
                                    <Box>
                                      <Checkbox
                                        checked={selected.indexOf(image.fileId) !== -1}
                                        onChange={(event) => handleClick(event, image.fileId)}
                                      />
                                      {image.name}
                                    </Box>
                                    {image.labels.length > 0 && (
                                      <Tooltip
                                        placement="top"
                                        arrow
                                        title={
                                          <>
                                            <Grid sx={{ width: '100%' }} container spacing={3}>
                                              <Grid item md={5}>
                                                <Typography sx={{ mr: 2 }}>Category</Typography>
                                              </Grid>
                                              <Divider orientation="vertical" flexItem />
                                              <Grid item md={6}>
                                                <Typography sx={{ mr: 2 }}>Labels</Typography>
                                              </Grid>
                                              {image.categories.length > 0
                                                ? image.categories.map((d) => (
                                                    <>
                                                      <Grid item md={5}>
                                                        <Chip
                                                          label={d.name}
                                                          varient="outlined"
                                                          size="small"
                                                          color="primary"
                                                        />
                                                      </Grid>
                                                      <Divider orientation="vertical" flexItem />
                                                      <Grid item md={6}>
                                                        {image.labels.map(
                                                          (label) =>
                                                            label.categories.id === d.id && (
                                                              <Chip
                                                                label={label.name}
                                                                varient="outlined"
                                                                size="small"
                                                                color="primary"
                                                                sx={{ mb: 1 }}
                                                              />
                                                            )
                                                        )}
                                                      </Grid>
                                                    </>
                                                  ))
                                                : null}
                                            </Grid>
                                          </>
                                        }
                                      >
                                        <Typography sx={{ ml: 1 }} variant="subtitle2">
                                          {labelArr.length > 25
                                            ? `${labelArr.substr(0, 25)}...`
                                            : labelArr}
                                        </Typography>
                                      </Tooltip>
                                    )}
                                  </Stack>
                                </Card>
                              </Grid>
                            );
                          })}
                      </Grid>
                    </>
                  ))
                ) : (
                  <Stack direction="row" alignItems="center" justifyContent="center" mt={5}>
                    <Typography variant="subtitle2" gutterBottom>
                      No images found.
                    </Typography>
                  </Stack>
                )}
              </>
            ) : (
              index?.length > 0 &&
              index.map((image) => (
                <>
                  <Typography variant="h6" gutterBottom>
                    Index Lesion # {image.labelGroupIdentifier}
                  </Typography>
                  <Grid container spacing={2} sx={{ pb: 2 }}>
                    {image.labelGroupData.map((grouped, ind) => (
                      <>
                        <Grid item md={3} sm={6} xs={6}>
                          <Card>
                            <IconButton
                              onClick={() => {
                                setGroup(grouped.images);
                                setViewerModal(true);
                              }}
                            >
                              <CardMedia
                                sx={{ width: 600, minHeight: 200 }}
                                component="img"
                                image={grouped.images[0].thumbnailLink}
                              />
                            </IconButton>
                            <Stack direction="column">
                              <Box>
                                <Typography variant="subtitle1" gutterBottom>
                                  <Checkbox
                                    checked={selected.indexOf(grouped.images[0].fileId) !== -1}
                                    onChange={(event) => handleSelectClick(event, grouped.images)}
                                  />
                                  {grouped.images.length}{' '}
                                  {grouped.images.length > 1 ? 'Images' : 'Image'}
                                </Typography>
                                <Typography
                                  style={{ textAlign: '-webkit-center' }}
                                  variant="subtitle2"
                                  gutterBottom
                                >
                                  {grouped?.dateGroupIdentifier?.split('T')[0]}
                                </Typography>
                              </Box>
                            </Stack>
                          </Card>
                        </Grid>
                        {ind < image.labelGroupData.length - 1 && (
                          <ArrowForwardIcon sx={{ alignSelf: 'center' }} style={{ fontSize: 40 }} />
                        )}
                      </>
                    ))}
                  </Grid>
                  <Divider sx={{ mb: 2 }} />
                </>
              ))
            ))}
        </Container>
      </Page>
    </RootStyle>
  );
}
// : (
//   <Stack direction="row" alignItems="center" justifyContent="center" mt={5}>
//     <Typography variant="subtitle2" gutterBottom>
//       No images found.
//     </Typography>
//   </Stack>
// )
//   <Grid item md={12}> // <Grid container spacing={3} sx={{ pl: 5, pb: 2 }}> // </Stack> //   <CircularProgress /> // <Stack direction="row" alignItems="center" justifyContent="center" mb={2}>
//     <CircularProgress />
//   </Grid>
// </Grid>
