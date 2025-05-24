// import React, { useEffect, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import newRequest from "../../utils/newRequest";
// import "./Navbar.scss";

// function Navbar() {
//   const [active, setActive] = useState(false);
//   const [open, setOpen] = useState(false);

//   const { pathname } = useLocation();

//   const isActive = () => {
//     window.scrollY > 0 ? setActive(true) : setActive(false);
//   };

//   useEffect(() => {
//     window.addEventListener("scroll", isActive);
//     return () => {
//       window.removeEventListener("scroll", isActive);
//     };
//   }, []);

//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));

//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await newRequest.post("/auth/logout");
//       localStorage.setItem("currentUser", null);
//       navigate("/");
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
//       <div className="container">
//         <div className="logo">
//           <Link className="link" to="/">
//             <span className="text">TalentHub.</span>
//           </Link>
//           {/* <span className="dot"></span> */}
//         </div>
//         <div className="links">
//           {/* <span>Fiverr Business</span>
//           <span>Explore</span>
//           <span>English</span> */}
//           {!currentUser?.isSeller && <span>Become a Seller</span>}
//           {currentUser ? (
//             <div className="user" onClick={() => setOpen(!open)}>
//               <img src={currentUser.img || "/img/avatar-1968236_1920.png"} alt="" />
//               <span>{currentUser?.username}</span>
//               {open && (
//                 <div className="options">
//                   {currentUser.isSeller && (
//                     <>
//                       <Link className="link" to="/gigs?cat">
//                         Gigs
//                       </Link>
//                       <Link className="link" to="/add">
//                         Add New Gig
//                       </Link>
//                     </>
//                   )}
//                   <Link className="link" to="/orders">
//                     Orders
//                   </Link>
//                   <Link className="link" to="/messages">
//                     Messages
//                   </Link>
//                   <Link className="link" onClick={handleLogout}>
//                     Logout
//                   </Link>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <>
//               <Link to="/login" className="link">Sign in</Link>
//               <Link className="link" to="/register">
//                 <button>Join</button>
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//       {(active || pathname !== "/") && (
//         <>
//           <hr />
//           {/* <div className="menu">
//             <Link className="link menuLink" to="/">
//               Graphics & Design
//             </Link>
//             <Link className="link menuLink" to="/">
//               Video & Animation
//             </Link>
//             <Link className="link menuLink" to="/">
//               Writing & Translation
//             </Link>
//             <Link className="link menuLink" to="/">
//               AI Services
//             </Link>
//             <Link className="link menuLink" to="/">
//               Digital Marketing
//             </Link>
//             <Link className="link menuLink" to="/">
//               Music & Audio
//             </Link>
//             <Link className="link menuLink" to="/">
//               Programming & Tech
//             </Link>
//             <Link className="link menuLink" to="/">
//               Business
//             </Link>
//             <Link className="link menuLink" to="/">
//               Lifestyle
//             </Link>
//           </div> */}
//           <hr />
//         </>
//       )}
//     </div>
//   );
// }

// export default Navbar;
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Navbar.scss";
import { CATEGORIES } from "../../constants/categories";
import { FiMenu, FiX, FiChevronDown, FiUser, FiPackage, FiMessageSquare, FiLogOut } from "react-icons/fi";

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [categories, setCategories] = useState(false);

  const { pathname } = useLocation();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  useEffect(() => {
    setMobileMenu(false);
    setOpen(false);
  }, [pathname]);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link className="link" to="/">
            <span className="text">TalentHub</span>
            <span className="dot">.</span>
          </Link>
        </div>

        <div className={`links ${mobileMenu ? "active" : ""}`}>
          <button
            className="close-menu"
            onClick={() => setMobileMenu(false)}
          >
            <FiX />
          </button>

          <Link to="/gigs" className="link">Explore</Link>

          <div className="categories-wrapper">
            <button
              className="categories-toggle"
              onClick={() => setCategories(!categories)}
            >
              Categories <FiChevronDown />
            </button>
            {/*             
            {categories && (
              <div className="categories-dropdown">
                <Link to="/gigs?cat=graphics" className="category-link">Graphics & Design</Link>
                <Link to="/gigs?cat=digital" className="category-link">Digital Marketing</Link>
                <Link to="/gigs?cat=writing" className="category-link">Writing & Translation</Link>
                <Link to="/gigs?cat=video" className="category-link">Video & Animation</Link>
                <Link to="/gigs?cat=music" className="category-link">Music & Audio</Link>
                <Link to="/gigs?cat=programming" className="category-link">Programming & Tech</Link>
                <Link to="/gigs?cat=business" className="category-link">Business</Link>
                <Link to="/gigs?cat=lifestyle" className="category-link">Lifestyle</Link>
              </div>
            )} */}
            {categories && (
              <div className="categories-dropdown">
                {CATEGORIES.map(category => (
                  <Link
                    key={category.id}
                    to={`/gigs?cat=${category.id}`}
                    className="category-link"
                  >
                    {category.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {!currentUser?.isSeller && (
            <Link to="/become-seller" className="link">Become a Seller</Link>
          )}

          {currentUser ? (
            <div className="user-section">
              <div className="user" onClick={() => setOpen(!open)}>
                <img
                  src={currentUser.img || "/img/avatar-1968236_1920.png"}
                  alt={currentUser.username}
                />
                <span>{currentUser?.username}</span>
                <FiChevronDown />
              </div>

              {open && (
                <div className="options">
                  <div className="user-info">
                    <img
                      src={currentUser.img || "/img/avatar-1968236_1920.png"}
                      alt={currentUser.username}
                    />
                    <div>
                      <h4>{currentUser.username}</h4>
                      <p>{currentUser.email}</p>
                    </div>
                  </div>

                  <Link to="/profile" className="option-link">
                    <FiUser /> Profile
                  </Link>

                  {currentUser.isSeller && (
                    <>
                      <Link to="/mygigs" className="option-link">
                        <FiPackage /> My Gigs
                      </Link>
                      <Link to="/add" className="option-link">
                        <span className="icon">+</span> Add New Gig
                      </Link>
                    </>
                  )}

                  <Link to="/orders" className="option-link">
                    <FiPackage /> Orders
                  </Link>

                  <Link to="/messages" className="option-link">
                    <FiMessageSquare /> Messages
                  </Link>

                  <button onClick={handleLogout} className="option-link logout">
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="link">Sign in</Link>
              <Link to="/register" className="join-button">Join</Link>
            </div>
          )}
        </div>

        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          <FiMenu />
        </button>
      </div>

      {/* {(active || pathname !== "/") && (
        <div className="categories-bar">
          <div className="container">
            <Link to="/gigs?cat=graphics" className="category">Graphics & Design</Link>
            <Link to="/gigs?cat=digital" className="category">Digital Marketing</Link>
            <Link to="/gigs?cat=writing" className="category">Writing & Translation</Link>
            <Link to="/gigs?cat=video" className="category">Video & Animation</Link>
            <Link to="/gigs?cat=music" className="category">Music & Audio</Link>
            <Link to="/gigs?cat=programming" className="category">Programming & Tech</Link>
            <Link to="/gigs?cat=business" className="category">Business</Link>
            <Link to="/gigs?cat=lifestyle" className="category">Lifestyle</Link>
          </div>
        </div>
      )} */}
      {(active || pathname !== "/") && (
        <div className="categories-bar">
          <div className="container">
            {CATEGORIES.map(category => (
              <Link
                key={category.id}
                to={`/gigs?cat=${category.id}`}
                className="category"
              >
                {category.title}
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default Navbar;
