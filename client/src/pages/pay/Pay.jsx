import api from "../../utils/api";
import { useParams, Link } from "react-router-dom";
import CheckoutForm from "../../components/checkoutForm/CheckoutForm";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "./Pay.scss";
import { FaArrowLeft, FaRegClock, FaShieldAlt, FaCreditCard, FaLock } from "react-icons/fa";
import Loader from "../../components/loader/Loader";

const stripePromise = loadStripe(
  "pk_test_51Nm9yDSHsDY67OPRFgsLZoyYEaumCHiJv25TsnTb0J358IE4dQvnsb9cyGrKuPNThmha1paqCgBWRDAqAzjcRsPp00L8IxleNl"
);

const Pay = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchGigDetails = async () => {
      try {
        const res = await api.get(`/gigs/single/${id}`);
        setGig(res.data);
      } catch (err) {
        setError("Failed to load gig details");
        console.error(err);
      }
    };

    fetchGigDetails();
  }, [id]);

  useEffect(() => {
    const makeRequest = async () => {
      try {
        setLoading(true);
        const res = await api.post(`/orders/create-payment-intent/${id}`);
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        setError("Payment initialization failed. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (gig) {
      makeRequest();
    }
  }, [gig, id]);

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#3053e1',
      colorBackground: '#ffffff',
      colorText: '#404145',
      colorDanger: '#e63946',
      fontFamily: 'Poppins, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  };
  
  const options = {
    clientSecret,
    appearance,
  };

  if (loading && !gig) {
    return <Loader message="Loading payment details..." />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <Link to={`/gig/${id}`} className="back-link">
          <FaArrowLeft /> Return to Gig
        </Link>
      </div>
    );
  }

  return (
    <div className="pay-page">
      <div className="container">
        <div className="payment-content">
          <div className="payment-header">
            <Link to={`/gig/${id}`} className="back-link">
              <FaArrowLeft /> Back to Gig
            </Link>
            <h1>Checkout</h1>
          </div>
          
          <div className="payment-grid">
            <div className="payment-form">
              <div className="secure-badge">
                <FaLock /> Secure Checkout
              </div>
              
              {loading ? (
                <div className="loading-payment">
                  <Loader message="Initializing payment..." />
                </div>
              ) : clientSecret ? (
                <Elements options={options} stripe={stripePromise}>
                  <CheckoutForm gigId={id} />
                </Elements>
              ) : (
                <div className="payment-error">
                  <p>Unable to initialize payment. Please try again later.</p>
                </div>
              )}
              
              {/* <div className="payment-methods">
                <h3>Accepted Payment Methods</h3>
                <div className="methods-icons">
                  <img src="/img/pngwing.com.png" alt="Visa" />
                </div>
              </div> */}
            </div>
            
            <div className="order-summary">
              <h2>Order Summary</h2>
              
              {gig && (
                <div className="gig-summary">
                  <div className="gig-image">
                    <img src={gig.cover} alt={gig.title} />
                  </div>
                  
                  <div className="gig-info">
                    <h3>{gig.title}</h3>
                    <div className="delivery">
                      <FaRegClock /> {gig.deliveryTime} day delivery
                    </div>
                  </div>
                </div>
              )}
              
              <div className="price-details">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>${gig?.price.toFixed(2)}</span>
                </div>
                <div className="price-row">
                  <span>Service fee</span>
                  <span>${(gig?.price * 0.05).toFixed(2)}</span>
                </div>
                <div className="price-row total">
                  <span>Total</span>
                  <span>${(gig?.price * 1.05).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="guarantee">
                <FaShieldAlt />
                <div>
                  <h4>TalentHub Payment Protection</h4>
                  <p>Payment is released to the freelancer once you're satisfied with the work.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pay;
