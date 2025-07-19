// import { useEffect, useState } from "react";
// import {
//   PaymentElement,
//   LinkAuthenticationElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import "./CheckoutForm.scss";

// const CheckoutForm = () => {
//   const stripe = useStripe();
//   const elements = useElements();

//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (!stripe) {
//       return;
//     }

//     const clientSecret = new URLSearchParams(window.location.search).get(
//       "payment_intent_client_secret"
//     );

//     if (!clientSecret) {
//       return;
//     }

//     stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
//       switch (paymentIntent.status) {
//         case "succeeded":
//           setMessage("Payment succeeded!");
//           break;
//         case "processing":
//           setMessage("Your payment is processing.");
//           break;
//         case "requires_payment_method":
//           setMessage("Your payment was not successful, please try again.");
//           break;
//         default:
//           setMessage("Something went wrong.");
//           break;
//       }
//     });
//   }, [stripe]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!stripe || !elements) {
//       return;
//     }

//     setIsLoading(true);

//     // const { error } = await stripe.confirmPayment({
//     //   elements,
//     //   confirmParams: {
//     //     return_url: "https://talent-hub-website-frontend-7nn9ki0cv-ankur7470.vercel.app/success",
//     //   },
//     // });

//     const { error } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         // Stripe will redirect here after payment
//         return_url: `${window.location.origin}/success-pay`,
//       },
//     });

//     // if (error.type === "card_error" || error.type === "validation_error") {
//     //   setMessage(error.message);
//     // } else {
//     //   setMessage("An unexpected error occurred.");
//     // }
//     if (error) {
//       setMessage(error.message || "An unexpected error occurred.");
//     }

//     setIsLoading(false);
//   };

//   return (
//     <div className="checkout-container">
//       <div className="checkout-header">
//         <h2>Complete your purchase</h2>
//         <p>Enter your payment details below</p>
//       </div>
      
//       <form id="payment-form" onSubmit={handleSubmit}>
//         <div className="form-section">
//           <h3>Account Information</h3>
//           <LinkAuthenticationElement
//             id="link-authentication-element"
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>
        
//         <div className="form-section">
//           <h3>Payment Method</h3>
//           <PaymentElement 
//             id="payment-element" 
//             options={{ layout: "tabs" }} 
//           />
//         </div>
        
//         <button 
//           disabled={isLoading || !stripe || !elements} 
//           id="submit"
//           className="payment-button"
//         >
//           {isLoading ? (
//             <div className="spinner">
//               <div className="bounce1"></div>
//               <div className="bounce2"></div>
//               <div className="bounce3"></div>
//             </div>
//           ) : (
//             "Pay now"
//           )}
//         </button>
        
//         {message && (
//           <div className={`payment-message ${message.includes("succeeded") ? "success" : "error"}`}>
//             {message}
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default CheckoutForm;
// components/checkoutForm/CheckoutForm.jsx
// import {
//   PaymentElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import { useEffect, useState } from "react";
// import "./CheckoutForm.scss";

// const CheckoutForm = () => {
//   const stripe = useStripe();
//   const elements = useElements();

//   const [message, setMessage] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!stripe || !elements) return;

//     setIsLoading(true);

//     const { error } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         return_url: `${window.location.origin}/success-pay`,
//       },
//     });

//     if (error) {
//       setMessage(error.message || "An unexpected error occurred.");
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="checkout-form">
//       <PaymentElement />
//       <button disabled={isLoading || !stripe || !elements}>
//         {isLoading ? "Processing..." : "Pay now"}
//       </button>
//       {message && <div className="form-message">{message}</div>}
//     </form>
//   );
// };

// export default CheckoutForm;

import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import "./CheckoutForm.scss";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;
    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success-pay`,
      },
    });

    if (error) {
      setMessage(error.message || "An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h2>Complete your purchase</h2>
        <p>Secure payment powered by Stripe</p>
      </div>

      <form id="payment-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Payment Information</h3>
          <PaymentElement />
        </div>

        <button
          disabled={isLoading || !stripe || !elements}
          className="payment-button"
        >
          {isLoading ? (
            <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
          ) : (
            "Pay now"
          )}
        </button>

        {message && (
          <div
            className={`payment-message ${message.includes("succeed") ? "success" : "error"}`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
