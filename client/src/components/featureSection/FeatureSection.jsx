import { FaCheck } from "react-icons/fa";
import './FeatureSection.scss'

const FeatureSection = () => {
  return (
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
                  Find high-quality services at every price point. No hourly
                  rates, just project-based pricing.
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
                  Find the right freelancer to begin working on your project
                  within minutes.
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
                  Always know what you'll pay upfront. Your payment isn't
                  released until you approve the work.
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
  );
};

export default FeatureSection;
