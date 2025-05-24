import React from "react";
import "./About.scss";

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        <h1>About TalentHub</h1>
        
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            At TalentHub, we connect talented freelancers with clients looking for quality services. 
            Our platform makes it easy to find, hire, and work with the best freelancers for any project, 
            anywhere in the world.
          </p>
        </section>
        
        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            Founded in 2022, TalentHub was created to solve the challenges faced by both freelancers 
            and clients in the digital marketplace. We believe that talented individuals should be able 
            to showcase their skills and find meaningful work, while businesses should have access to 
            a global pool of experts.
          </p>
          <p>
            Today, TalentHub has grown into a thriving community of professionals across various 
            categories including Graphics & Design, Digital Marketing, Writing & Translation, 
            Video & Animation, Music & Audio, Programming & Tech, Business, and Lifestyle.
          </p>
        </section>
        
        <section className="about-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <h3>Quality</h3>
              <p>We prioritize high-quality work and professional service delivery.</p>
            </div>
            <div className="value-item">
              <h3>Trust</h3>
              <p>We build trust through secure payments and transparent processes.</p>
            </div>
            <div className="value-item">
              <h3>Opportunity</h3>
              <p>We create opportunities for talented individuals worldwide.</p>
            </div>
            <div className="value-item">
              <h3>Innovation</h3>
              <p>We continuously improve our platform to better serve our community.</p>
            </div>
          </div>
        </section>
        
        <section className="about-section">
          <h2>Join Our Community</h2>
          <p>
            Whether you're a freelancer looking to showcase your skills or a client seeking 
            professional services, TalentHub is the place for you. Join our growing community 
            today and experience the future of work.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
