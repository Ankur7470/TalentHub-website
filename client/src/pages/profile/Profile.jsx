import React, { useState } from "react";
import "./Profile.scss";
import useAuth from "../../hooks/useAuth";
import upload from "../../utils/upload";
import { FaUser, FaEnvelope, FaGlobe, FaPhone, FaFileUpload } from "react-icons/fa";

function Profile() {
  const { currentUser, updateProfile, loading, error } = useAuth();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    country: currentUser?.country || "",
    phone: currentUser?.phone || "",
    desc: currentUser?.desc || "",
  });
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let imgUrl = currentUser.img;
      
      if (file) {
        imgUrl = await upload(file);
      }
      
      await updateProfile({
        ...formData,
        img: imgUrl,
      });
      
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <h1>Profile Settings</h1>
        
        <div className="profile-content">
          <div className="profile-image">
            <img 
              src={file ? URL.createObjectURL(file) : currentUser.img || "/img/avatar-1968236_1920.png"} 
              alt={currentUser.username} 
            />
            <label className="upload-button">
              <FaFileUpload />
              <span>Change Photo</span>
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files[0])} 
                style={{ display: "none" }}
              />
            </label>
          </div>
          
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <div className="form-group">
              <label>
                <FaUser /> Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>
                <FaEnvelope /> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>
                <FaGlobe /> Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>
                <FaPhone /> Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                rows="5"
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="save-button"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
