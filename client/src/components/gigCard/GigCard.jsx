// import React from "react";
// import "./GigCard.scss";
// import { Link } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import newRequest from "../../utils/newRequest";

// const GigCard = ({ item }) => {
//   const { isLoading, error, data } = useQuery({
//     queryKey: [item.userId],
//     queryFn: () =>
//       newRequest.get(`/users/${item.userId}`).then((res) => {
//         return res.data;
//       }),
//   });
//   return (
//     <Link to={`/gig/${item._id}`} className="link">
//       <div className="gigCard">
//         <img src={item.cover} alt="" />
//         <div className="info">
//           {isLoading ? (
//             "loading"
//           ) : error ? (
//             "Something went wrong!"
//           ) : (
//             <div className="user">
//               <img src={data.img || "/img/avatar-1968236_1920.png"} alt="" />
//               <span>{data.username}</span>
//             </div>
//           )}
//           <p>{item.desc}</p>
//           <div className="star">
//             <img src="./img/star.png" alt="" />
//             <span>
//               {!isNaN(item.totalStars / item.starNumber) &&
//                 Math.round(item.totalStars / item.starNumber)}
//             </span>
//           </div>
//         </div>
//         <hr />
//         <div className="detail">
//           <img src="./img/heart.png" alt="" />
//           <div className="price">
//             <span>STARTING AT</span>
//             <h2>$ {item.price}</h2>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default GigCard;
import React from "react";
import "./GigCard.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { FaStar, FaHeart } from "react-icons/fa";

const GigCard = ({ item }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: [item.userId],
    queryFn: () =>
      newRequest.get(`/users/${item.userId}`).then((res) => {
        return res.data;
      }),
  });
  
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };
  
  return (
    <Link to={`/gig/${item._id}`} className="gig-card-link">
      <div className="gigCard">
        <div className="image-container">
          <img src={item.cover} alt={item.title} className="gig-image" />
          <button className="favorite-btn">
            <FaHeart />
          </button>
        </div>
        
        <div className="content">
          {isLoading ? (
            <div className="user-skeleton">
              <div className="avatar-skeleton"></div>
              <div className="name-skeleton"></div>
            </div>
          ) : error ? (
            <div className="user error">Error loading seller</div>
          ) : (
            <div className="user">
              <img src={data.img || "/img/avatar-1968236_1920.png"} alt={data.username} />
              <span>{data.username}</span>
            </div>
          )}
          
          <h3 className="title">{truncateText(item.title, 65)}</h3>
          
          <div className="rating">
            <FaStar className="star-icon" />
            <span className="score">
              {!isNaN(item.totalStars / item.starNumber) 
                ? Math.round(item.totalStars / item.starNumber * 10) / 10 
                : "New"}
            </span>
            <span className="reviews">
              ({item.starNumber || 0})
            </span>
          </div>
        </div>
        
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
