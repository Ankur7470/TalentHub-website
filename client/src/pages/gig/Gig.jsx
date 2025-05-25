import React, { useState } from "react";
import "./Gig.scss";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/api";
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
    queryFn: () => api.get(`/gigs/single/${id}`).then((res) => res.data),
  });

  const userId = data?.userId;

  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => api.get(`/users/${userId}`).then((res) => res.data),
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
