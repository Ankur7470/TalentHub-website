import { useQuery } from "@tanstack/react-query";
import React from "react";
import newRequest from "../../utils/api";
import "./Review.scss";
import { FaStar, FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const Review = ({ review }) => {
  const { isLoading, error, data } = useQuery(
    {
      queryKey: [review.userId],
      queryFn: () =>
        newRequest.get(`/users/${review.userId}`).then((res) => {
          return res.data;
        }),
    },
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="review">
      <div className="review-header">
        {isLoading ? (
          <div className="user-skeleton">
            <div className="avatar-skeleton"></div>
            <div className="info-skeleton">
              <div className="name-skeleton"></div>
              <div className="country-skeleton"></div>
            </div>
          </div>
        ) : error ? (
          <div className="error">Error loading reviewer</div>
        ) : (
          <div className="user">
            <img className="pp" src={data.img || "/img/noavatar.jpg"} alt={data.username} />
            <div className="info">
              <h4>{data.username}</h4>
              <div className="country">
                <span>{data.country}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="review-date">
          {review.createdAt && formatDate(review.createdAt)}
        </div>
      </div>
      
      <div className="stars">
        {[...Array(5)].map((_, i) => (
          <FaStar 
            key={i} 
            className={i < review.star ? "star filled" : "star empty"} 
          />
        ))}
        <span className="rating">{review.star}</span>
      </div>
      
      <p className="review-text">{review.desc}</p>
      
      <div className="helpful">
        <span>Was this review helpful?</span>
        <div className="actions">
          <button className="helpful-btn">
            <FaThumbsUp /> <span>Yes</span>
          </button>
          <button className="helpful-btn">
            <FaThumbsDown /> <span>No</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review;
