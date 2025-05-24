// import React from "react";
// import "./Gig.scss";
// // import { Slider } from "infinite-react-carousel/lib";
// import { Link, useParams } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import newRequest from "../../utils/newRequest";
// import Reviews from "../../components/reviews/Reviews";

// function Gig() {
//   const { id } = useParams();

//   const { isLoading, error, data } = useQuery({
//     queryKey: ["gig"],
//     queryFn: () =>
//       newRequest.get(`/gigs/single/${id}`).then((res) => {
//         return res.data;
//       }),
//   });

//   const userId = data?.userId;

//   const {
//     isLoading: isLoadingUser,
//     error: errorUser,
//     data: dataUser,
//   } = useQuery({
//     queryKey: ["user"],
//     queryFn: () =>
//       newRequest.get(`/users/${userId}`).then((res) => {
//         return res.data;
//       }),
//     enabled: !!userId,
//   });

//   return (
//     <div className="gig">
//       {isLoading ? (
//         "loading"
//       ) : error ? (
//         "Something went wrong!"
//       ) : (
//         <div className="container">
//           <div className="left">
//             <span className="breadcrumbs">
//               TalentHub{">"} Graphics & Design {">"}
//             </span>
//             <h1>{data.title}</h1>
//             {isLoadingUser ? (
//               "loading"
//             ) : errorUser ? (
//               "Something went wrong!"
//             ) : (
//               <div className="user">
//                 <img
//                   className="pp"
//                   src={dataUser.img || "/img/avatar-1968236_1920.png"}
//                   alt=""
//                 />
//                 <span>{dataUser.username}</span>
//                 {!isNaN(data.totalStars / data.starNumber) && (
//                   <div className="stars">
//                     {Array(Math.round(data.totalStars / data.starNumber))
//                       .fill()
//                       .map((item, i) => (
//                         <img src="/img/star.png" alt="" key={i} />
//                       ))}
//                     <span>{Math.round(data.totalStars / data.starNumber)}</span>
//                   </div>
//                 )}
//               </div>
//             )}
//             <Slider slidesToShow={1} arrowsScroll={1} className="slider">
//               {data.images.map((img) => (
//                 <img key={img} src={img} alt="" />
//               ))}
//             </Slider>
//             <h2>About This Gig</h2>
//             <p>{data.desc}</p>
//             {isLoadingUser ? (
//               "loading"
//             ) : errorUser ? (
//               "Something went wrong!"
//             ) : (
//               <div className="seller">
//                 <h2>About The Seller</h2>
//                 <div className="user">
//                   <img src={dataUser.img || "/img/avatar-1968236_1920.png"} alt="" />
//                   <div className="info">
//                     <span>{dataUser.username}</span>
//                     {!isNaN(data.totalStars / data.starNumber) && (
//                       <div className="stars">
//                         {Array(Math.round(data.totalStars / data.starNumber))
//                           .fill()
//                           .map((item, i) => (
//                             <img src="/img/star.png" alt="" key={i} />
//                           ))}
//                         <span>
//                           {Math.round(data.totalStars / data.starNumber)}
//                         </span>
//                       </div>
//                     )}
//                     <button>Contact Me</button>
//                   </div>
//                 </div>
//                 <div className="box">
//                   <div className="items">
//                     <div className="item">
//                       <span className="title">From</span>
//                       <span className="desc">{dataUser.country}</span>
//                     </div>
//                     <div className="item">
//                       <span className="title">Member since</span>
//                       <span className="desc">Aug 2022</span>
//                     </div>
//                     <div className="item">
//                       <span className="title">Avg. response time</span>
//                       <span className="desc">4 hours</span>
//                     </div>
//                     <div className="item">
//                       <span className="title">Last delivery</span>
//                       <span className="desc">1 day</span>
//                     </div>
//                     <div className="item">
//                       <span className="title">Languages</span>
//                       <span className="desc">English</span>
//                     </div>
//                   </div>
//                   <hr />
//                   <p>{dataUser.desc}</p>
//                 </div>
//               </div>
//             )}
//             <Reviews gigId={id} />
//           </div>
//           <div className="right">
//             <div className="price">
//               <h3>{data.shortTitle}</h3>
//               <h2>$ {data.price}</h2>
//             </div>
//             <p>{data.shortDesc}</p>
//             <div className="details">
//               <div className="item">
//                 <img src="/img/clock.png" alt="" />
//                 <span>{data.deliveryDate} Days Delivery</span>
//               </div>
//               <div className="item">
//                 <img src="/img/recycle.png" alt="" />
//                 <span>{data.revisionNumber} Revisions</span>
//               </div>
//             </div>
//             <div className="features">
//               {data.features.map((feature) => (
//                 <div className="item" key={feature}>
//                   <img src="/img/greencheck.png" alt="" />
//                   <span>{feature}</span>
//                 </div>
//               ))}
//             </div>
//             <Link to={`/pay/${id}`}>
//             <button>Continue</button>
//             </Link>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Gig;

// import React from "react";
// import "./Gig.scss";
// import { Link, useParams } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import newRequest from "../../utils/newRequest";
// import Reviews from "../../components/reviews/Reviews";
// import useEmblaCarousel from "embla-carousel-react";

// function Gig() {
//   const { id } = useParams();
//   const [emblaRef] = useEmblaCarousel({ loop: true });

//   const { isLoading, error, data } = useQuery({
//     queryKey: ["gig"],
//     queryFn: () =>
//       newRequest.get(`/gigs/single/${id}`).then((res) => {
//         return res.data;
//       }),
//   });

//   const userId = data?.userId;

//   const {
//     isLoading: isLoadingUser,
//     error: errorUser,
//     data: dataUser,
//   } = useQuery({
//     queryKey: ["user"],
//     queryFn: () =>
//       newRequest.get(`/users/${userId}`).then((res) => {
//         return res.data;
//       }),
//     enabled: !!userId,
//   });

//   return (
//     <div className="gig">
//       {isLoading ? (
//         "loading"
//       ) : error ? (
//         "Something went wrong!"
//       ) : (
//         <div className="container">
//           <div className="left">
//             <span className="breadcrumbs">
//               TalentHub{">"} Graphics & Design {">"}
//             </span>
//             <h1>{data.title}</h1>
//             {isLoadingUser ? (
//               "loading"
//             ) : errorUser ? (
//               "Something went wrong!"
//             ) : (
//               <div className="user">
//                 <img
//                   className="pp"
//                   src={dataUser.img || "/img/avatar-1968236_1920.png"}
//                   alt=""
//                 />
//                 <span>{dataUser.username}</span>
//                 {!isNaN(data.totalStars / data.starNumber) && (
//                   <div className="stars">
//                     {Array(Math.round(data.totalStars / data.starNumber))
//                       .fill()
//                       .map((item, i) => (
//                         <img src="/img/star.png" alt="" key={i} />
//                       ))}
//                     <span>{Math.round(data.totalStars / data.starNumber)}</span>
//                   </div>
//                 )}
//               </div>
//             )}
            
//             {/* Embla Carousel Implementation */}
//             <div className="embla slider" ref={emblaRef}>
//               <div className="embla__container">
//                 {data.images.map((img) => (
//                   <div className="embla__slide" key={img}>
//                     <img src={img} alt="" />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <h2>About This Gig</h2>
//             <p>{data.desc}</p>
//             {isLoadingUser ? (
//               "loading"
//             ) : errorUser ? (
//               "Something went wrong!"
//             ) : (
//               <div className="seller">
//                 <h2>About The Seller</h2>
//                 <div className="user">
//                   <img src={dataUser.img || "/img/avatar-1968236_1920.png"} alt="" />
//                   <div className="info">
//                     <span>{dataUser.username}</span>
//                     {!isNaN(data.totalStars / data.starNumber) && (
//                       <div className="stars">
//                         {Array(Math.round(data.totalStars / data.starNumber))
//                           .fill()
//                           .map((item, i) => (
//                             <img src="/img/star.png" alt="" key={i} />
//                           ))}
//                         <span>
//                           {Math.round(data.totalStars / data.starNumber)}
//                         </span>
//                       </div>
//                     )}
//                     <button>Contact Me</button>
//                   </div>
//                 </div>
//                 <div className="box">
//                   <div className="items">
//                     <div className="item">
//                       <span className="title">From</span>
//                       <span className="desc">{dataUser.country}</span>
//                     </div>
//                     <div className="item">
//                       <span className="title">Member since</span>
//                       <span className="desc">Aug 2022</span>
//                     </div>
//                     <div className="item">
//                       <span className="title">Avg. response time</span>
//                       <span className="desc">4 hours</span>
//                     </div>
//                     <div className="item">
//                       <span className="title">Last delivery</span>
//                       <span className="desc">1 day</span>
//                     </div>
//                     <div className="item">
//                       <span className="title">Languages</span>
//                       <span className="desc">English</span>
//                     </div>
//                   </div>
//                   <hr />
//                   <p>{dataUser.desc}</p>
//                 </div>
//               </div>
//             )}
//             <Reviews gigId={id} />
//           </div>
//           <div className="right">
//             <div className="price">
//               <h3>{data.shortTitle}</h3>
//               <h2>$ {data.price}</h2>
//             </div>
//             <p>{data.shortDesc}</p>
//             <div className="details">
//               <div className="item">
//                 <img src="/img/clock.png" alt="" />
//                 <span>{data.deliveryDate} Days Delivery</span>
//               </div>
//               <div className="item">
//                 <img src="/img/recycle.png" alt="" />
//                 <span>{data.revisionNumber} Revisions</span>
//               </div>
//             </div>
//             <div className="features">
//               {data.features.map((feature) => (
//                 <div className="item" key={feature}>
//                   <img src="/img/greencheck.png" alt="" />
//                   <span>{feature}</span>
//                 </div>
//               ))}
//             </div>
//             <Link to={`/pay/${id}`}>
//               <button>Continue</button>
//             </Link>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Gig;
import React, { useState } from "react";
import "./Gig.scss";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/reviews/Reviews";
import useEmblaCarousel from "embla-carousel-react";
import { FaRegClock, FaRegCheckCircle, FaStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Loader from "../../components/loader/Loader";

function Gig() {
  const { id } = useParams();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [currentSlide, setCurrentSlide] = useState(0);

  const { isLoading, error, data } = useQuery({
    queryKey: ["gig", id],
    queryFn: () => newRequest.get(`/gigs/single/${id}`).then((res) => res.data),
  });

  const userId = data?.userId;

  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => newRequest.get(`/users/${userId}`).then((res) => res.data),
    enabled: !!userId,
  });

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  const onSlideChange = () => {
    if (emblaApi) {
      setCurrentSlide(emblaApi.selectedScrollSnap());
    }
  };

  React.useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', onSlideChange);
      return () => {
        emblaApi.off('select', onSlideChange);
      };
    }
  }, [emblaApi]);

  if (isLoading) return <Loader message="Loading gig details..." />;
  if (error) return <div className="error-container">Something went wrong! Please try again later.</div>;

  return (
    <div className="gig-page">
      <div className="container">
        {/* <div className="breadcrumbs">
          <Link to="/">TalentHub</Link> / 
          <Link to={`/gigs?cat=${data.cat}`}>{data.cat}</Link> / 
          <span>{data.title.substring(0, 20)}...</span>
        </div> */}

        <div className="gig-content">
          <div className="left-column">
            <h1 className="gig-title">{data.title}</h1>

            {isLoadingUser ? (
              <div className="seller-skeleton"></div>
            ) : errorUser ? (
              <div className="error-message">Error loading seller information</div>
            ) : (
              <div className="seller-brief">
                <img
                  src={dataUser.img || "/img/avatar-1968236_1920.png"}
                  alt={dataUser.username}
                />
                <div className="seller-info">
                  <h3>{dataUser.username}</h3>
                  {!isNaN(data.totalStars / data.starNumber) && (
                    <div className="rating">
                      {Array(Math.round(data.totalStars / data.starNumber))
                        .fill()
                        .map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      <span>{Math.round(data.totalStars / data.starNumber)}</span>
                      <span className="reviews-count">({data.starNumber} reviews)</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="carousel-container">
              <div className="embla" ref={emblaRef}>
                <div className="embla__container">
                  {data.images.map((img, index) => (
                    <div className="embla__slide" key={index}>
                      <img src={img} alt={`Gig image ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
              
              <button className="embla-prev" onClick={scrollPrev}>
                <FaArrowLeft />
              </button>
              <button className="embla-next" onClick={scrollNext}>
                <FaArrowRight />
              </button>
              
              <div className="embla-dots">
                {data.images.map((_, index) => (
                  <button 
                    key={index}
                    className={`embla-dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => emblaApi && emblaApi.scrollTo(index)}
                  />
                ))}
              </div>
            </div>

            <section className="gig-description">
              <h2>About This Gig</h2>
              <p>{data.desc}</p>
            </section>

            {isLoadingUser ? (
              <div className="seller-skeleton large"></div>
            ) : errorUser ? (
              <div className="error-message">Error loading seller details</div>
            ) : (
              <section className="seller-details">
                <h2>About The Seller</h2>
                <div className="seller-profile">
                  <div className="seller-header">
                    <img src={dataUser.img || "/img/avatar-1968236_1920.png"} alt={dataUser.username} />
                    <div className="info">
                      <h3>{dataUser.username}</h3>
                      {!isNaN(data.totalStars / data.starNumber) && (
                        <div className="rating">
                          {Array(Math.round(data.totalStars / data.starNumber))
                            .fill()
                            .map((_, i) => (
                              <FaStar key={i} />
                            ))}
                          <span>{Math.round(data.totalStars / data.starNumber)}</span>
                        </div>
                      )}
                      <button className="contact-btn">Contact Me</button>
                    </div>
                  </div>
                  
                  <div className="seller-stats">
                    <div className="stat-grid">
                      <div className="stat-item">
                        <span className="label">From</span>
                        <span className="value">{dataUser.country}</span>
                      </div>
                      <div className="stat-item">
                        <span className="label">Member since</span>
                        <span className="value">{dataUser.joinDate}</span>
                      </div>
                      <div className="stat-item">
                        <span className="label">Avg. response time</span>
                        <span className="value">{dataUser.avgResponseTime} hours</span>
                      </div>
                      <div className="stat-item">
                        <span className="label">Last delivery</span>
                        <span className="value">{dataUser.lastDelivery} {dataUser.lastDelivery === 1 ? 'day' : 'days'}</span>
                      </div>
                      <div className="stat-item">
                        <span className="label">Languages</span>
                        <span className="value">{dataUser.languages?.join(', ')}</span>
                      </div>
                    </div>
                    <div className="seller-bio">
                      <p>{dataUser.desc}</p>
                    </div>
                  </div>
                </div>
              </section>
            )}
            
            <Reviews gigId={id} />
          </div>

          <div className="right-column">
            <div className="order-card">
              <div className="package-header">
                <h3>{data.shortTitle}</h3>
                <div className="price">${data.price}</div>
              </div>
              
              <p className="package-desc">{data.shortDesc}</p>
              
              <div className="delivery-info">
                <div className="info-item">
                  <FaRegClock />
                  <span>{data.deliveryTime} Days Delivery</span>
                </div>
                <div className="info-item">
                  <FaRegCheckCircle />
                  <span>{data.revisionNumber} Revisions</span>
                </div>
              </div>
              
              <div className="features-list">
                {data.features.map((feature, index) => (
                  <div className="feature-item" key={index}>
                    <FaRegCheckCircle className="check-icon" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <Link to={`/pay/${id}`}>
                <button className="order-button">Continue</button>
              </Link>
              
              <div className="guarantee">
                <span>TalentHub Protection:</span> Payment is released to the freelancer once you're satisfied with the work.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gig;
