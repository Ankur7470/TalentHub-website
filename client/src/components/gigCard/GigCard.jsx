import React from "react";
import "./GigCard.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/api";
import { FaStar, FaHeart } from "react-icons/fa";

const GigCard = ({ item }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: [item.userId],
    queryFn: () => api.get(`/users/${item.userId}`).then((res) => res.data),
  });

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const averageRating =
    item.starNumber > 0
      ? Math.round((item.totalStars / item.starNumber) * 10) / 10
      : "New";

  return (
    <Link to={`/gig/${item._id}`} className="gig-card-link">
      <div className="gigCard">
        {/* Image Section */}
        <div className="image-container">
          <img src={item.cover} alt={item.title} className="gig-image" />
          <button className="favorite-btn">
            <FaHeart />
          </button>
        </div>

        {/* Content Section */}
        <div className="content">
          {/* User Info */}
          {isLoading ? (
            <div className="user-skeleton">
              <div className="avatar-skeleton" />
              <div className="name-skeleton" />
            </div>
          ) : error ? (
            <div className="user error">Error loading seller</div>
          ) : (
            <div className="user">
              <img
                src={data.img || "/img/avatar-1968236_1920.png"}
                alt={data.username}
              />
              <span>{data.username}</span>
            </div>
          )}

          {/* Gig Title */}
          <h3 className="title">{truncateText(item.title, 65)}</h3>

          {/* Rating */}
          <div className="rating">
            <FaStar className="star-icon" />
            <span className="score">{averageRating}</span>
            <span className="reviews">(Based on {item.starNumber || 0} reviews)</span>
          </div>
        </div>

        {/* Footer Section */}
        <div className="footer">
          <div className="price">
            <span className="label">STARTING AT</span>
            <span className="amount">${item.price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
