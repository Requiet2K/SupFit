import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation, Pagination, EffectCube, Autoplay, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import '../style/utils/imageSlider.css'
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

type ImageSliderProps = {
  images: {
    url: string;
    alt: string;
  }[];
};

export function ImageSlider({ images }: ImageSliderProps) {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  return (
    <div className="slider-comp">
        <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectCube, Thumbs]}
        spaceBetween={50}
        centeredSlides={true}
        slidesPerView={1}
        autoplay={{
            delay: 5000,
            disableOnInteraction: true,
        }}
        navigation={true}
        pagination={{ clickable: true }}
        thumbs={{ swiper: thumbsSwiper }}
        cubeEffect={{
            shadow: true,
            slideShadows: true,
            shadowOffset: 20,
            shadowScale: 0.94,
          }}
        effect={'cube'}
        grabCursor={true}
        >
        {images.map(({ url, alt }, index) => (
            <SwiperSlide key={index}>
                <img src={url} alt={alt} />
            </SwiperSlide>
        ))}
        </Swiper>
        <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={3}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {images.map(({ url, alt }, index) => (
            <SwiperSlide key={index} className="slider-thumbs-imgs">
                <img src={url} alt={alt}/>
            </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}