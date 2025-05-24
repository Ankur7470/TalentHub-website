import React from "react";
import "./Home.scss";
import Featured from "../../components/featured/Featured";
import Slide from "../../components/slide/Slide";
import CatCard from "../../components/catCard/CatCard";
import ProjectCard from "../../components/projectCard/ProjectCard";
import { CATEGORIES } from "../../constants/categories";
import { PROJECTS } from "../../constants/projects";
import { Link } from "react-router-dom";
import { FaCheck, FaArrowRight } from "react-icons/fa";

function Home() {

  return (
    <div className="home-page">
      <Featured />

      <section className="categories-section">
        <div className="container">
          <h2>Popular Categories</h2>
          <Slide slidesToShow={5} arrowsScroll={1}>
            {CATEGORIES.map((category)=>(
              (category.fet=="1" &&
                <CatCard key={category.id} card={{
                  id: category.id,
                  title: category.title,
                  desc: `Explore ${category.title} services`,
                  img: category.img,
                  cat: category.id
                }} />
              )
            ))}
          </Slide>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="features-content">
            <div className="features-text">
              <h2>A whole world of freelance talent at your fingertips</h2>

              <div className="feature-item">
                <div className="feature-icon">
                  <FaCheck />
                </div>
                <div className="feature-details">
                  <h3>The best for every budget</h3>
                  <p>
                    Find high-quality services at every price point. No hourly rates,
                    just project-based pricing.
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <FaCheck />
                </div>
                <div className="feature-details">
                  <h3>Quality work done quickly</h3>
                  <p>
                    Find the right freelancer to begin working on your project within
                    minutes.
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <FaCheck />
                </div>
                <div className="feature-details">
                  <h3>Protected payments, every time</h3>
                  <p>
                    Always know what you'll pay upfront. Your payment isn't released
                    until you approve the work.
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <FaCheck />
                </div>
                <div className="feature-details">
                  <h3>24/7 support</h3>
                  <p>
                    Our round-the-clock support team is available to help anytime,
                    anywhere.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="marketplace-section">
        <div className="container">
          <h2>Explore the marketplace</h2>
          <div className="categories-grid">
            {CATEGORIES.map((category)=>(
              <Link to={`/gigs?cat=${category.value}`} className="category-item">
              <img
                src={category.image}
                alt={category.title}
              />
              <div className="category-title">
                <span>{category.title}</span>
              </div>
            </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="business-section">
        <div className="container">
          <div className="business-content">
            <div className="business-text">
              <h2>
                <span className="brand">TalentHub</span> <span className="highlight">Business</span>
              </h2>
              <h3>A business solution designed for teams</h3>
              <p>
                Upgrade to a curated experience packed with tools and benefits,
                dedicated to businesses
              </p>

              <ul className="business-features">
                <li>
                  <FaCheck /> Connect to freelancers with proven business experience
                </li>
                <li>
                  <FaCheck /> Get matched with the perfect talent by a customer success manager
                </li>
                <li>
                  <FaCheck /> Manage teamwork and boost productivity with one powerful workspace
                </li>
              </ul>

              <button className="business-btn">
                Explore TalentHub Business <FaArrowRight />
              </button>
            </div>

            <div className="business-image">
              <img
                src="https://fiverr-res.cloudinary.com/q_auto,f_auto,w_870,dpr_2.0/v1/attachments/generic_asset/asset/d9c17ceebda44764b591a8074a898e63-1599597624768/business-desktop-870-x2.png"
                alt="TalentHub Business"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="projects-section">
        <div className="container">
          <h2>Inspiring work made on TalentHub</h2>
          <Slide slidesToShow={4} arrowsScroll={1}>
            {PROJECTS.map((card) => (
              <ProjectCard key={card.id} card={card} />
            ))}
          </Slide>
        </div>
      </section>
    </div>
  );
}

export default Home;
