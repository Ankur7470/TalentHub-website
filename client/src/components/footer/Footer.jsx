import React from "react";
import "./Footer.scss";
import { Link } from "react-router-dom";
import { FaTwitter, FaFacebook, FaLinkedin, FaPinterest, FaInstagram, FaGlobe, FaDollarSign, FaUniversalAccess } from "react-icons/fa";

function Footer() {
  return (
    <div className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-links">
            <div className="link-group">
              <h3>Categories</h3>
              <div className="links-grid">
                <Link to="/gigs?cat=graphics">Graphics & Design</Link>
                <Link to="/gigs?cat=digital">Digital Marketing</Link>
                <Link to="/gigs?cat=writing">Writing & Translation</Link>
                <Link to="/gigs?cat=video">Video & Animation</Link>
                <Link to="/gigs?cat=music">Music & Audio</Link>
                <Link to="/gigs?cat=programming">Programming & Tech</Link>
                <Link to="/gigs?cat=business">Business</Link>
                <Link to="/gigs?cat=lifestyle">Lifestyle</Link>
              </div>
            </div>
            
            <div className="link-group">
              <h3>About</h3>
              <Link to="/about">About TalentHub</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/contact">Contact Us</Link>
            </div>
            
            {/* <div className="link-group">
              <h3>Support</h3>
              <Link to="/help">Help & Support</Link>
              <Link to="/trust">Trust & Safety</Link>
              <Link to="/selling">Selling on TalentHub</Link>
              <Link to="/buying">Buying on TalentHub</Link>
            </div> */}
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            <div className="logo">TalentHub</div>
            <span>© {new Date().getFullYear()} TalentHub Ltd.</span>
          </div>
          
          <div className="footer-actions">
            <div className="social-icons">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer"><FaPinterest /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            </div>
            
            <div className="settings">
              <button className="setting-btn"><FaGlobe /> English</button>
              <button className="setting-btn"><FaDollarSign /> USD</button>
              <button className="setting-btn"><FaUniversalAccess /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
