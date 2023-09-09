import newRequest from "../../utils/newRequest";
import { useParams } from "react-router-dom";
import CheckoutForm from "../../components/checkoutForm/CheckoutForm";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";


const stripePromise = loadStripe(
  "pk_test_51Nm9yDSHsDY67OPRFgsLZoyYEaumCHiJv25TsnTb0J358IE4dQvnsb9cyGrKuPNThmha1paqCgBWRDAqAzjcRsPp00L8IxleNl"
);

const Pay = () => {
  const [clientSecret, setClientSecret] = useState("");

  const { id } = useParams();

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const res = await newRequest.post(
          `/orders/create-payment-intent/${id}`
        );
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.log(err);
      }
    };
    makeRequest();
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return <div className="pay">
    {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
  </div>;
};

export default Pay;