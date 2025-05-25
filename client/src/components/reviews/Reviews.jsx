import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import newRequest from "../../utils/api";
import Review from "../review/Review";
import "./Reviews.scss";
import { FaStar } from "react-icons/fa";

const Reviews = ({ gigId }) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const queryClient = useQueryClient();
  
  const { isLoading, error: queryError, data } = useQuery({
    queryKey: ["reviews", gigId],
    queryFn: () =>
      newRequest.get(`/reviews/${gigId}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (review) => {
      return newRequest.post("/reviews", review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", gigId]);
      setReviewText("");
      setRating(0);
      setSuccess("Review submitted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    },
    onError: (err) => {
      setError(err.response?.data || "Something went wrong");
      setTimeout(() => setError(""), 3000);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError("Please select a rating");
      setTimeout(() => setError(""), 3000);
      return;
    }
    
    if (reviewText.trim().length < 10) {
      setError("Review must be at least 10 characters");
      setTimeout(() => setError(""), 3000);
      return;
    }
    
    mutation.mutate({ gigId, desc: reviewText, star: rating });
  };
  
  const getAverageRating = () => {
    if (!data || data.length === 0) return 0;
    const total = data.reduce((sum, review) => sum + review.star, 0);
    return (total / data.length).toFixed(1);
  };

  return (
    <div className="reviews">
      <div className="reviews-header">
        <h2>Reviews</h2>
        {data && data.length > 0 && (
          <div className="reviews-summary">
            <div className="average-rating">
              <FaStar className="star-icon" />
              <span>{getAverageRating()}</span>
            </div>
            <span className="review-count">{data.length} reviews</span>
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="loading-reviews">
          <div className="spinner"></div>
          <p>Loading reviews...</p>
        </div>
      ) : queryError ? (
        <div className="error-message">
          Something went wrong while loading reviews
        </div>
      ) : data && data.length > 0 ? (
        <div className="reviews-list">
          {data.map((review) => (
            <Review key={review._id} review={review} />
          ))}
        </div>
      ) : (
        <div className="no-reviews">
          <p>No reviews yet. Be the first to leave a review!</p>
        </div>
      )}
      
      <div className="add-review">
        <h3>Add a review</h3>
        <form onSubmit={handleSubmit} className="review-form">
          <div className="rating-container">
            <div className="star-rating">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index}>
                    <input
                      type="radio"
                      name="rating"
                      value={ratingValue}
                      onClick={() => setRating(ratingValue)}
                    />
                    <FaStar
                      className="star"
                      color={ratingValue <= (hover || rating) ? "#ffb33e" : "#e4e5e7"}
                      size={24}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                    />
                  </label>
                );
              })}
            </div>
            <span className="rating-text">
              {rating ? `Your rating: ${rating}/5` : "Select your rating"}
            </span>
          </div>
          
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here... What was your experience with this service?"
            rows={4}
          />
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reviews;

