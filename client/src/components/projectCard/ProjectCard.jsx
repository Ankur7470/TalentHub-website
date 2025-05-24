// import React from "react";
// import "./ProjectCard.scss";

// function ProjectCard({ card }) {
//   return (
//     <div className="projectCard">
//       <img src={card.img} alt="" />
//       <div className="info">
//         <img src={card.pp} alt="" />
//         <div className="texts">
//           <h2>{card.cat}</h2>
//           <span>{card.username}</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProjectCard;
import React from "react";
import "./ProjectCard.scss";

function ProjectCard({ card }) {
  return (
    <div className="projectCard">
      <div className="image-container">
        <img src={card.img} alt={card.cat} className="project-image" />
        <div className="overlay">
          <button className="view-button">View Project</button>
        </div>
      </div>
      <div className="info">
        <div className="user">
          <img src={card.pp} alt={card.username} className="user-image" />
          <div className="user-info">
            <h3 className="category">{card.cat}</h3>
            <p className="username">by {card.username}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
