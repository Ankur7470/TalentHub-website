// import React from "react";
// import "./Slide.scss";
// import Slider from "infinite-react-carousel";

// const Slide = ({ children, slidesToShow, arrowsScroll }) => {
//   return (
//     <div className="slide">
//       <div className="container">
//         <Slider slidesToShow={slidesToShow} arrowsScroll={arrowsScroll}>
//           {children}
//         </Slider>
//       </div>
//     </div>
//   );
// };

// export default Slide;
import React from "react";
import "./Slide.scss";
import useEmblaCarousel from "embla-carousel-react";

const Slide = ({ children, slidesToShow, arrowsScroll }) => {
  const [emblaRef] = useEmblaCarousel({ 
    loop: true,
    slidesToScroll: arrowsScroll || 1,
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    slidesToShow: slidesToShow || 1
  });

  return (
    <div className="slide">
      <div className="container">
        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slide;
