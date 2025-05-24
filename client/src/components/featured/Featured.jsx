import React, { useState } from "react";
import "./Featured.scss";
import { useNavigate } from "react-router-dom";

function Featured() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate(`/gigs?search=${input}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>
            Find the perfect <span>freelance</span> services for your business
          </h1>
          <div className="search-container">
            <div className="search">
              <div className="searchInput">
                <img src="./img/search.png" alt="Search" />
                <input
                  type="text"
                  placeholder='Try "mobile app development"'
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <button onClick={handleSubmit}>Search</button>
            </div>
          </div>
          <div className="popular">
            <span>Popular:</span>
            <div className="tags">
              <button onClick={() => navigate('/gigs?search=graphics')}>Web Design</button>
              <button onClick={() => navigate('/gigs?search=writing')}>WordPress</button>
              <button onClick={() => navigate('/gigs?search=video')}>Logo Design</button>
              <button onClick={() => navigate('/gigs?search=digital')}>AI Services</button>
            </div>
          </div>
        </div>
        <div className="right">
          <img src="./img/man.png" alt="Freelancer" />
        </div>
      </div>
    </div>
  );
}

export default Featured;
