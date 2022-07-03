import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Divider } from '@material-ui/core';
import Slider from 'react-slick';
import Image from 'material-ui-image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../pages/StyleSheet.css';

export default function IndexLesionViewerCarousal({ images, photoIndex, setCarousalPhotoIndex }) {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const slider1 = useRef(null);
  const slider2 = useRef(null);

  useEffect(() => {
    setNav1(slider1.current);
    setNav2(slider2.current);
    if (slider1.current && photoIndex) {
      slider1.current.slickGoTo(photoIndex);
    }
  }, []);
  const settings2 = {
    dots: false,
    infinite: true,
    speed: 200,
    beforeChange: (current, next) => setCarousalPhotoIndex(next),
    adaptiveHeight: true
  };
  const settings = {
    dots: false,
    infinite: false,
    speed: 100,
    arrows: true,
    slide: 'img',
    adaptiveHeight: true,
    initialSlide: photoIndex,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: images.length > 6 ? 6 : images.length,
          slidesToScroll: 1,
          infinite: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  };
  return (
    <div style={{ padding: 15 }}>
      <Slider {...settings2} asNavFor={nav2} ref={slider1}>
        {images.map((image, index) => (
          <div key={index}>
            <Image src={image.webContentLink} alt={image.name} animationDuration={3000} />
          </div>
        ))}
      </Slider>
      <Divider sx={{ mt: 1, mb: 1.5 }} />
      <Slider
        asNavFor={nav1}
        ref={slider2}
        slidesToShow={images.length > 6 ? 6 : images.length}
        swipeToSlide
        focusOnSelect
        {...settings}
      >
        {images.map((image, idx) => (
          <div key={idx}>
            <Image
              style={{ marginRight: 5, marginLeft: 5 }}
              src={image.webContentLink}
              sx={{ borderRadius: 10 }}
              alt={image.name}
              animationDuration={3000}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

IndexLesionViewerCarousal.propTypes = {
  images: PropTypes.any,
  photoIndex: PropTypes.any,
  setCarousalPhotoIndex: PropTypes.any
};
