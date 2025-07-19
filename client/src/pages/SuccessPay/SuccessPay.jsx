// pages/success/Success.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "./SuccessPay.scss";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const intent = new URLSearchParams(window.location.search).get("payment_intent");
    if (intent) {
      api.put("/orders", { payment_intent: intent })
        .then(() => console.log("Order confirmed"))
        .catch(() => console.error("Order confirmation failed"));
    }
  }, []);

  return (
    <div className="success-page">
      <h1>✅ Payment Successful</h1>
      <p>Your order has been placed.</p>
      <button className="btn" onClick={() => navigate("/orders")}>
        Go to Orders
      </button>
    </div>
  );
};

export default Success;
