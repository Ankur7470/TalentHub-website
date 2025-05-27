import React, { useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import "./Slide.scss";

const Slide = ({ children, slidesToShow = 3 }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true,
  });

  const containerRef = useRef(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty("--slide-count", slidesToShow);
    }
  }, [slidesToShow]);

  return (
    <div className="slide">
      <div className="slide-container">
        <div className="embla-wrapper">
          <button className="embla__prev" onClick={scrollPrev}>
            &lt;
          </button>
          <div className="embla" ref={emblaRef}>
            <div className="embla__container" ref={containerRef}>
              {React.Children.map(children, (child, index) => (
                <div className="embla__slide" key={index}>
                  {child}
                </div>
              ))}
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
