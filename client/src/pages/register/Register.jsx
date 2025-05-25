import React, { useState } from "react";
import upload from "../../utils/upload";
import "./Register.scss";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaGlobe, FaPhone, FaFileUpload, FaCheck } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Register() {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isSeller: false,
    desc: "",
    phone: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadLoading, setUploadLoading] = useState(false);
  const { register } = useContext(AuthContext);


  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!user.username.trim()) newErrors.username = "Username is required";
    if (!user.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(user.email)) newErrors.email = "Email is invalid";
    
    if (!user.password) newErrors.password = "Password is required";
    else if (user.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (!user.country.trim()) newErrors.country = "Country is required";
    
    if (user.isSeller) {
      if (!user.desc.trim()) newErrors.desc = "Description is required for sellers";
      if (!user.phone.trim()) newErrors.phone = "Phone number is required for sellers";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
    
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({...errors, [e.target.name]: null});
    }
  };

  const handleSeller = (e) => {
    setUser((prev) => {
      return { ...prev, isSeller: e.target.checked };
    });
  };
  
  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 95) {
        clearInterval(interval);
      }
    }, 100);
    return interval;
  };
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    try {
      setLoading(true)
  
      let imgUrl = "";
      if (file) {
        setUploadLoading(true);
        const progressInterval = simulateProgress();
        imgUrl = await upload(file);
        clearInterval(progressInterval);
        setUploadProgress(100);
        setUploadLoading(false);
      }
  
      await register({
        ...user,
        img: imgUrl,
      });
  
      setLoading(false);
      navigate("/login");
    } catch (err) {
      setLoading(false);
      setErrors({
        submit: err.response?.data || "Registration failed. Please try again.",
      });
      console.log(err);
    }
  };
  

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Create a TalentHub Account</h1>
          <p>Join our community of freelancers and clients</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-left">
              <div className="form-group">
                <label htmlFor="username">
                  <FaUser /> Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="johndoe"
                  value={user.username}
                  onChange={handleChange}
                  className={errors.username ? "error" : ""}
                />
                {errors.username && <span className="error-message">{errors.username}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="email@example.com"
                  value={user.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="password">
                  <FaLock /> Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  className={errors.password ? "error" : ""}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="country">
                  <FaGlobe /> Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  placeholder="USA"
                  value={user.country}
                  onChange={handleChange}
                  className={errors.country ? "error" : ""}
                />
                {errors.country && <span className="error-message">{errors.country}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="file" className="file-label">
                  <FaFileUpload /> Profile Picture
                </label>
                <div className="file-input-container">
                  <input
                    type="file"
                    id="file"
                    onChange={handleFileChange}
                  />
                  <div className="file-name">
                    {file ? file.name : "No file chosen"}
                  </div>
                </div>
                
                {uploadLoading && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <span>{uploadProgress}%</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="form-right">
              <div className="seller-toggle">
                <div className="toggle-header">
                  <h3>I want to become a seller</h3>
                  <p>Create seller account to offer your services</p>
                </div>
                
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={user.isSeller}
                    onChange={handleSeller}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              
              {user.isSeller && (
                <>
                  <div className="form-group">
                    <label htmlFor="phone">
                      <FaPhone /> Phone Number
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      placeholder="+1 234 567 8900"
                      value={user.phone}
                      onChange={handleChange}
                      className={errors.phone ? "error" : ""}
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="desc">
                      <FaUser /> Description
                    </label>
                    <textarea
                      id="desc"
                      name="desc"
                      placeholder="A short description about yourself"
                      value={user.desc}
                      onChange={handleChange}
                      rows="5"
                      className={errors.desc ? "error" : ""}
                    ></textarea>
                    {errors.desc && <span className="error-message">{errors.desc}</span>}
                  </div>
                </>
              )}
            </div>
          </div>
          
          {errors.submit && (
            <div className="submit-error">
              {errors.submit}
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="register-button"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
            
            <p className="login-link">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
