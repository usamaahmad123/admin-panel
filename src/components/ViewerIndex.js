import { useState } from 'react';
import { PropTypes } from 'prop-types';
import { sentenceCase } from 'change-case';
// material
import {
  Card,
  Typography,
  CircularProgress,
  IconButton,
  CardMedia,
  Stack
} from '@material-ui/core';
import Chip from '@mui/material/Chip';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// ----------------------------------------------------------------------
export default function ViewerIndex({ images }) {
  const [active, setActive] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const increment = () => {
    if (images.length > 1) {
      if (photoIndex < images.length - 1) {
        setPhotoIndex((prev) => prev + 1);
      } else {
        setPhotoIndex(0);
      }
      setActive(true);
    }
  };
  const decrement = () => {
    if (images.length > 1) {
      if (photoIndex > 0) {
        setPhotoIndex((prev) => prev - 1);
      } else {
        setPhotoIndex(images.length - 1);
      }
      setActive(true);
    }
  };

  return (
    <>
      {images[photoIndex].name && (
        <Stack direction="row" mb={1}>
          <Typography sx={{ mr: 2 }}>File name: </Typography>
          <Typography sx={{ mr: 2 }}>{images[photoIndex].name}</Typography>
        </Stack>
      )}
      {images[photoIndex].patient && (
        <Stack direction="row" mb={1}>
          <Typography sx={{ mr: 2 }}>Patient name: </Typography>
          <Chip
            label={
              images[photoIndex].patient?.middleName
                ? `${sentenceCase(images[photoIndex].patient?.firstName)} ${sentenceCase(
                    images[photoIndex].patient?.middleName
                  )} ${sentenceCase(images[photoIndex].patient.lastName)} (${
                    images[photoIndex].patient?.patientId
                  })`
                : `${sentenceCase(images[photoIndex].patient?.firstName)} ${sentenceCase(
                    images[photoIndex].patient.lastName
                  )} (${images[photoIndex].patient?.patientId})`
            }
            size="small"
            varient="outlined"
            color="primary"
            clickable
          />
        </Stack>
      )}
      {images[photoIndex].categories.length > 0 ? (
        <Stack direction="row" mb={1}>
          <Typography sx={{ mr: 2 }}>Category: </Typography>
          {images[photoIndex].categories.map((category, idx) => (
            <Chip
              key={idx}
              label={category.name}
              varient="outlined"
              size="small"
              color="primary"
              clickable
              sx={{ mr: 1 }}
            />
          ))}
        </Stack>
      ) : null}
      {images[photoIndex].labels.length > 0 ? (
        <Stack direction="row" mb={1}>
          <Typography sx={{ mr: 2 }}>Labels: </Typography>
          {images[photoIndex].labels.map((d, idx) => (
            <Chip
              key={idx}
              label={d.name}
              varient="outlined"
              size="small"
              color="primary"
              clickable
              sx={{ mr: 1 }}
            />
          ))}
        </Stack>
      ) : null}
      <Card sx={{ mb: 0 }} style={{ textAlign: '-webkit-center' }}>
        {images?.length > 0 && (
          <CardMedia
            onLoad={() => setActive(false)}
            component="img"
            style={{ display: active ? 'none' : 'block', maxHeight: 340 }}
            image={images[photoIndex].webContentLink}
          />
        )}
        <div style={{ padding: active ? 40 : 0 }}>{active ? <CircularProgress /> : null}</div>
        <ButtonGroup border variant="text">
          <IconButton disabled={active}>
            <ArrowBackIosNewIcon onClick={decrement} />
          </IconButton>
          <Typography sx={{ pt: 1 }} textAlign="center" variant="h6" gutterBottom>
            {photoIndex + 1} / {images.length}
          </Typography>
          <IconButton disabled={active}>
            <ArrowForwardIosIcon onClick={increment} />
          </IconButton>{' '}
        </ButtonGroup>{' '}
      </Card>
    </>
  );
}

ViewerIndex.propTypes = {
  images: PropTypes.any
};
