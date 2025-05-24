import React from "react";
import "./Loader.scss";

const Loader = ({ message = "Loading...", size = "medium" }) => {
  return (
    <div className={`loader-container ${size}`}>
      <div className="spinner"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default Loader;
