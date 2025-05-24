// import React, { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./Success.scss";
// import newRequest from "../../utils/newRequest";

// const Success = () => {
//   const { search } = useLocation();
//   const navigate = useNavigate();
//   const params = new URLSearchParams(search);
//   const payment_intent = params.get("payment_intent");

//   useEffect(() => {
//     const makeRequest = async () => {
//       try {
//         await newRequest.put("/orders", { payment_intent });
//         setTimeout(() => {
//           navigate("/orders");
//         }, 5000);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     makeRequest();
//   }, []);

//   return (
//     <div>
//       Payment successful. You are being redirected to the orders page. Please do
//       not close the page
//     </div>
//   );
// };

// export default Success;
import React, { useReducer, useState } from "react";
import "./Success.scss";
import { gigReducer, GIG_INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { 
  FaCloudUploadAlt, 
  FaImages, 
  FaPlus, 
  FaTimes, 
  FaInfoCircle,
  FaTag,
  FaMoneyBillWave,
  FaClock,
  FaRedo
} from "react-icons/fa";

const Add = () => {
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState("info");

  const [state, dispatch] = useReducer(gigReducer, GIG_INITIAL_STATE);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
    
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({...errors, [e.target.name]: null});
    }
  };
  
  const handleFeature = (e) => {
    e.preventDefault();
    
    const feature = e.target[0].value;
    if (!feature.trim()) {
      setErrors({...errors, feature: "Feature cannot be empty"});
      return;
    }
    
    dispatch({
      type: "ADD_FEATURE",
      payload: feature,
    });
    
    e.target[0].value = "";
    setErrors({...errors, feature: null});
  };

  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 95) {
        clearInterval(interval);
      }
    }, 200);
    return interval;
  };

  const handleUpload = async () => {
    if (!singleFile) {
      setErrors({...errors, cover: "Cover image is required"});
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const progressInterval = simulateProgress();
      
      const cover = await upload(singleFile);

      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
      setUploading(false);
      
      // Move to next section after upload
      setActiveSection("details");
    } catch (err) {
      setErrors({...errors, upload: "Failed to upload images. Please try again."});
      setUploading(false);
      console.log(err);
    }
  };

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.post("/gigs", gig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      navigate("/mygigs");
    },
    onError: (error) => {
      setErrors({...errors, submit: "Failed to create gig. Please try again."});
      console.log(error);
    }
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!state.title) newErrors.title = "Title is required";
    if (!state.cat) newErrors.cat = "Category is required";
    if (!state.desc) newErrors.desc = "Description is required";
    if (!state.shortTitle) newErrors.shortTitle = "Service title is required";
    if (!state.shortDesc) newErrors.shortDesc = "Short description is required";
    if (!state.deliveryTime) newErrors.deliveryTime = "Delivery time is required";
    if (!state.revisionNumber) newErrors.revisionNumber = "Revision number is required";
    if (!state.price) newErrors.price = "Price is required";
    if (!state.cover) newErrors.cover = "Cover image is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    mutation.mutate(state);
  };

  return (
    <div className="add-page">
      <div className="container">
        <div className="add-header">
          <h1>Create a New Gig</h1>
          <p>Fill in the details to create your service offering</p>
        </div>
        
        <div className="progress-tabs">
          <div 
            className={`tab ${activeSection === "info" ? "active" : ""} ${state.title && state.cat && state.desc && state.cover ? "completed" : ""}`}
            onClick={() => setActiveSection("info")}
          >
            <span className="number">1</span>
            <span className="label">Overview</span>
          </div>
          <div 
            className={`tab ${activeSection === "details" ? "active" : ""} ${state.shortTitle && state.shortDesc && state.deliveryTime ? "completed" : ""}`}
            onClick={() => state.cover && setActiveSection("details")}
          >
            <span className="number">2</span>
            <span className="label">Pricing & Details</span>
          </div>
          <div 
            className={`tab ${activeSection === "publish" ? "active" : ""}`}
            onClick={() => state.shortTitle && state.price && setActiveSection("publish")}
          >
            <span className="number">3</span>
            <span className="label">Publish</span>
          </div>
        </div>
        
        <div className="add-content">
          {activeSection === "info" && (
            <div className="section info-section">
              <div className="form-group">
                <label htmlFor="title">
                  Gig Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="I will do something I'm really good at"
                  onChange={handleChange}
                  value={state.title || ""}
                  className={errors.title ? "error" : ""}
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
                <span className="hint">
                  <FaInfoCircle /> Create a catchy title that describes your service
                </span>
              </div>
              
              <div className="form-group">
                <label htmlFor="cat">
                  Category <span className="required">*</span>
                </label>
                <select 
                  name="cat" 
                  id="cat" 
                  onChange={handleChange}
                  value={state.cat || ""}
                  className={errors.cat ? "error" : ""}
                >
                  <option value="">Select a category</option>
                  <option value="design">Graphics & Design</option>
                  <option value="web">Web Development</option>
                  <option value="animation">Animation</option>
                  <option value="music">Music & Audio</option>
                  <option value="writing">Writing & Translation</option>
                  <option value="video">Video & Animation</option>
                  <option value="business">Business</option>
                </select>
                {errors.cat && <span className="error-message">{errors.cat}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="desc">
                  Description <span className="required">*</span>
                </label>
                <textarea
                  id="desc"
                  name="desc"
                  placeholder="Describe your service in detail. What makes your offering unique?"
                  rows="8"
                  onChange={handleChange}
                  value={state.desc || ""}
                  className={errors.desc ? "error" : ""}
                ></textarea>
                {errors.desc && <span className="error-message">{errors.desc}</span>}
              </div>
              
              <div className="form-group">
                <label>
                  Images <span className="required">*</span>
                </label>
                <div className="images-upload">
                  <div className="cover-upload">
                    <h3>Cover Image</h3>
                    <div className="upload-container">
                      <label className="upload-label">
                        <input
                          type="file"
                          onChange={(e) => setSingleFile(e.target.files[0])}
                        />
                        <div className="upload-placeholder">
                          <FaCloudUploadAlt />
                          <span>{singleFile ? singleFile.name : "Choose a cover image"}</span>
                        </div>
                      </label>
                    </div>
                    {errors.cover && <span className="error-message">{errors.cover}</span>}
                  </div>
                  
                  <div className="gallery-upload">
                    <h3>Gallery Images (Optional)</h3>
                    <div className="upload-container">
                      <label className="upload-label">
                        <input
                          type="file"
                          multiple
                          onChange={(e) => setFiles(e.target.files)}
                        />
                        <div className="upload-placeholder">
                          <FaImages />
                          <span>{files.length > 0 ? `${files.length} files selected` : "Choose gallery images"}</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                
                {uploading && (
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
                
                {errors.upload && <span className="error-message">{errors.upload}</span>}
                
                <button 
                  onClick={handleUpload} 
                  className="upload-button"
                  disabled={uploading || !singleFile}
                >
                  {uploading ? "Uploading..." : state.cover ? "Images Uploaded ✓" : "Upload Images"}
                </button>
              </div>
              
              <div className="section-actions">
                <button 
                  className="next-button"
                  onClick={() => state.cover ? setActiveSection("details") : handleUpload()}
                  disabled={!state.title || !state.cat || !state.desc || (!state.cover && !singleFile)}
                >
                  {state.cover ? "Next: Pricing & Details" : "Upload & Continue"}
                </button>
              </div>
            </div>
          )}
          
          {activeSection === "details" && (
            <div className="section details-section">
              <div className="form-group">
                <label htmlFor="shortTitle">
                  <FaTag /> Service Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="shortTitle"
                  name="shortTitle"
                  placeholder="e.g. Professional logo design"
                  onChange={handleChange}
                  value={state.shortTitle || ""}
                  className={errors.shortTitle ? "error" : ""}
                />
                {errors.shortTitle && <span className="error-message">{errors.shortTitle}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="shortDesc">
                  Short Description <span className="required">*</span>
                </label>
                <textarea
                  id="shortDesc"
                  name="shortDesc"
                  placeholder="Brief description of your service (appears in search results)"
                  rows="3"
                  onChange={handleChange}
                  value={state.shortDesc || ""}
                  className={errors.shortDesc ? "error" : ""}
                ></textarea>
                {errors.shortDesc && <span className="error-message">{errors.shortDesc}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="deliveryTime">
                    <FaClock /> Delivery Time (days) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="deliveryTime"
                    name="deliveryTime"
                    min="1"
                    max="30"
                    onChange={handleChange}
                    value={state.deliveryTime || ""}
                    className={errors.deliveryTime ? "error" : ""}
                  />
                  {errors.deliveryTime && <span className="error-message">{errors.deliveryTime}</span>}
                </div>
                
                <div className="form-group half">
                  <label htmlFor="revisionNumber">
                    <FaRedo /> Revisions <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="revisionNumber"
                    name="revisionNumber"
                    min="0"
                    max="10"
                    onChange={handleChange}
                    value={state.revisionNumber || ""}
                    className={errors.revisionNumber ? "error" : ""}
                  />
                  {errors.revisionNumber && <span className="error-message">{errors.revisionNumber}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="price">
                  <FaMoneyBillWave /> Price ($) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="5"
                  step="5"
                  onChange={handleChange}
                  value={state.price || ""}
                  className={errors.price ? "error" : ""}
                />
                {errors.price && <span className="error-message">{errors.price}</span>}
              </div>
              
              <div className="form-group">
                <label>Features</label>
                <form className="feature-form" onSubmit={handleFeature}>
                  <input 
                    type="text" 
                    placeholder="e.g. 3D mockup included"
                    className={errors.feature ? "error" : ""}
                  />
                  <button type="submit">
                    <FaPlus /> Add
                  </button>
                </form>
                {errors.feature && <span className="error-message">{errors.feature}</span>}
                
                <div className="features-list">
                  {state.features?.map((feature) => (
                    <div className="feature-tag" key={feature}>
                      <span>{feature}</span>
                      <button
                        onClick={() => dispatch({ type: "REMOVE_FEATURE", payload: feature })}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="section-actions">
                <button 
                  className="back-button"
                  onClick={() => setActiveSection("info")}
                >
                  Back
                </button>
                <button 
                  className="next-button"
                  onClick={() => setActiveSection("publish")}
                  disabled={!state.shortTitle || !state.shortDesc || !state.deliveryTime || !state.revisionNumber || !state.price}
                >
                  Next: Review & Publish
                </button>
              </div>
            </div>
          )}
          
          {activeSection === "publish" && (
            <div className="section publish-section">
              <div className="gig-preview">
                <h2>Review Your Gig</h2>
                
                <div className="preview-card">
                  <div className="preview-image">
                    <img src={state.cover} alt={state.title} />
                  </div>
                  
                  <div className="preview-content">
                    <h3>{state.title}</h3>
                    <p>{state.shortDesc}</p>
                    
                    <div className="preview-details">
                      <div className="detail-item">
                        <FaMoneyBillWave />
                        <span>${state.price}</span>
                      </div>
                      <div className="detail-item">
                        <FaClock />
                        <span>{state.deliveryTime} days delivery</span>
                      </div>
                      <div className="detail-item">
                        <FaRedo />
                        <span>{state.revisionNumber} revisions</span>
                      </div>
                    </div>
                    
                    <div className="preview-features">
                      <h4>Features</h4>
                      <ul>
                        {state.features && state.features.length > 0 ? (
                          state.features.map((feature, index) => (
                            <li key={index}>✓ {feature}</li>
                          ))
                        ) : (
                          <li className="no-features">No features added</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              {errors.submit && <div className="submit-error">{errors.submit}</div>}
              
              <div className="section-actions">
                <button 
                  className="back-button"
                  onClick={() => setActiveSection("details")}
                >
                  Back to Edit
                </button>
                <button 
                  className="publish-button"
                  onClick={handleSubmit}
                  disabled={mutation.isLoading}
                >
                  {mutation.isLoading ? "Publishing..." : "Publish Gig"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Add;
