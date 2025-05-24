import React, { useCallback } from "react";
import "./Slide.scss";
import useEmblaCarousel from "embla-carousel-react";

const Slide = ({ children, slidesToShow, arrowsScroll }) => {
  // Ensure options is a valid object
  const options = {
    loop: true,
    align: "start",
    slidesToScroll: 1
  };
  
  // Use emblaApi to access the carousel methods
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  // Create callback functions for the arrow buttons
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="slide">
      <div className="container">
        <div className="embla-wrapper">
          <button className="embla__prev" onClick={scrollPrev}>
            &lt;
          </button>
          <div className="embla" ref={emblaRef}>
            <div className="embla__container">
              {children}
            </div>
          </div>
          <button className="embla__next" onClick={scrollNext}>
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Slide;
