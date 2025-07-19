import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import api from "../../utils/api";
import CheckoutForm from "../../components/checkoutForm/CheckoutForm";
import Loader from "../../components/loader/Loader";
import { FaArrowLeft, FaRegClock, FaShieldAlt, FaLock } from "react-icons/fa";
import "./Pay.scss";

const stripePromise = loadStripe("pk_test_51Nm9yDSHsDY67OPRFgsLZoyYEaumCHiJv25TsnTb0J358IE4dQvnsb9cyGrKuPNThmha1paqCgBWRDAqAzjcRsPp00L8IxleNl"); // publishable key

const Pay = () => {
  const { id } = useParams();
  const [clientSecret, setClientSecret] = useState("");
  const [gig, setGig] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndInitPayment = async () => {
      try {
        const res = await api.get(`/gigs/single/${id}`);
        setGig(res.data);
        const paymentInit = await api.post(`/orders/create-payment-intent/${id}`);
        setClientSecret(paymentInit.data.clientSecret);
      } catch (err) {
        console.error(err);
        setError("Failed to initialize payment.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndInitPayment();
  }, [id]);

  const appearance = {
    theme: "stripe",
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (loading) return <Loader message="Loading payment..." />;
  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <Link to={`/gig/${id}`}><FaArrowLeft /> Back to Gig</Link>
      </div>
    );
  }

  return (
  <div className="pay-page">
    <div className="container">

      {/* ✅ Add this missing wrapper */}
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

            {!!clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            )}
          </div>

          <div className="order-summary">
            {gig && (
              <>
                <h2>Order Summary</h2>
                <div className="gig-summary">
                  <div className="gig-image">
                    <img src={gig.cover} alt={gig.title} />
                  </div>
                  <div className="gig-info">
                    <h3>{gig.title}</h3>
                    <div className="delivery">
                      <FaRegClock /> {gig.deliveryTime} Days
                    </div>
                  </div>
                </div>

                <div className="price-details">
                  <div className="price-row">
                    <span>Subtotal</span>
                    <span>${gig.price.toFixed(2)}</span>
                  </div>
                  <div className="price-row">
                    <span>Service fee</span>
                    <span>${(gig.price * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="price-row total">
                    <span>Total</span>
                    <span>${(gig.price * 1.05).toFixed(2)}</span>
                  </div>
                </div>

                <div className="guarantee">
                  <FaShieldAlt />
                  <div>
                    <h4>Payment Protection</h4>
                    <p>Only release funds when you're satisfied with the work.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

};

export default Pay;
