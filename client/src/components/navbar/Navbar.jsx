import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "./Navbar.scss";
import { CATEGORIES } from "../../constants/categories";
import { useMessages } from "../../context/MessageContext";
import {
  FiMenu,
  FiX,
  FiChevronDown,
  FiUser,
  FiPackage,
  FiMessageSquare,
  FiLogOut,
} from "react-icons/fi";

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [categories, setCategories] = useState(false);

  const { unreadCount } = useMessages();

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
      await api.post("/auth/logout");
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
          <button className="close-menu" onClick={() => setMobileMenu(false)}>
            <FiX />
          </button>

          <Link to="/gigs" className="link">
            Explore
          </Link>

          <div className="categories-wrapper">
            <button
              className="categories-toggle"
              onClick={() => setCategories(!categories)}
            >
              Categories <FiChevronDown />
            </button>

            {categories && (
              <div className="categories-dropdown">
                {CATEGORIES.map((category) => (
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
            <Link to="/become-seller" className="link">
              Become a Seller
            </Link>
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
                    {unreadCount > 0 && (
                      <span className="unread-badge">{unreadCount}</span>
                    )}
                  </Link>

                  <button onClick={handleLogout} className="option-link logout">
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="link">
                Sign in
              </Link>
              <Link to="/register" className="join-button">
                Join
              </Link>
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

      {(active || pathname !== "/") && (
        <div className="categories-bar">
          <div className="container">
            {CATEGORIES.map((category) => (
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
