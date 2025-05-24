import React, { useState } from "react";
import "./Contact.scss";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaCheckCircle } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Here you would typically send the form data to your backend
      console.log("Form submitted:", formData);
      
      // Show success message
      setSubmitted(true);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }
  };
  
  return (
    <div className="contact-page">
      <div className="container">
        <h1>Contact Us</h1>
        <p className="subtitle">We'd love to hear from you. Please fill out the form below or reach out directly.</p>
        
        <div className="contact-content">
          <div className="contact-info">
            <div className="info-item">
              <div className="icon">
                <FaMapMarkerAlt />
              </div>
              <div className="details">
                <h3>Our Location</h3>
                <p>123 TalentHub Street</p>
                <p>San Francisco, CA 94103</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="icon">
                <FaPhone />
              </div>
              <div className="details">
                <h3>Phone Number</h3>
                <p>+1 (555) 123-4567</p>
                <p>Mon-Fri, 9am-6pm</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="icon">
                <FaEnvelope />
              </div>
              <div className="details">
                <h3>Email Address</h3>
                <p>support@talenthub.com</p>
                <p>info@talenthub.com</p>
              </div>
            </div>
          </div>
          
          <div className="contact-form">
            {submitted ? (
              <div className="success-message">
                <FaCheckCircle />
                <h3>Thank you for your message!</h3>
                <p>We'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "error" : ""}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "error" : ""}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={errors.subject ? "error" : ""}
                  />
                  {errors.subject && <span className="error-message">{errors.subject}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className={errors.message ? "error" : ""}
                  ></textarea>
                  {errors.message && <span className="error-message">{errors.message}</span>}
                </div>
                
                <button type="submit" className="submit-button">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
