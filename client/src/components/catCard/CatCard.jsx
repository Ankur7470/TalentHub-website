import React from "react";
import { Link } from "react-router-dom";
import "./CatCard.scss";

function CatCard({ card }) {
  return (
    <Link to={`/gigs?cat=${card.cat}`} className="catCard-link">
      <div className="catCard">
        <div className="catCard-image">
          <img src={card.img} alt={card.title} />
        </div>
        <div className="catCard-content">
          <h3 className="title">{card.title}</h3>
          <p className="desc">{card.desc}</p>
        </div>
      </div>
    </Link>
  );
}
export default CatCard;
