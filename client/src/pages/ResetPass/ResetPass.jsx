import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ResetPass.scss";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`/backend/auth/reset-password/${token}`, { password });
    alert("Password has been reset");
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default ResetPassword;
