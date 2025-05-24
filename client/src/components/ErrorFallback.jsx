import React from "react";

const ErrorFallback = ({ error }) => (
  <div style={{ padding: 40, textAlign: "center" }}>
    <h1>Something went wrong!</h1>
    <p>{error?.message || "An unexpected error occurred."}</p>
    <a href="/">Go to Home</a>
  </div>
);

export default ErrorFallback;