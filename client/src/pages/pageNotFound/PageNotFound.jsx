import React from "react";
import { Link } from "react-router-dom";
import "./PageNotFound.scss";
import { FaExclamationTriangle, FaHome, FaSearch } from "react-icons/fa";

const PageNotFound = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <div className="error-icon">
            <FaExclamationTriangle />
          </div>
          
          <h1>404</h1>
          <h2>Page Not Found</h2>
          
          <p>
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>
          
          <div className="action-buttons">
            <Link to="/" className="home-button">
              <FaHome /> Go to Homepage
            </Link>
            
            <Link to="/gigs" className="search-button">
              <FaSearch /> Browse Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
