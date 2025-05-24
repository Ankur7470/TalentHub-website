// import React from "react"
// import { useState } from "react";
// import "./Login.scss"
// // import axios from "axios";
// import newRequest from "../../utils/newRequest";
// import { useNavigate } from "react-router-dom";

// function Login() {

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();

//   const handleSubmit = async (e)=>{
//     e.preventDefault()
//     try {
//       const res = await newRequest.post("/auth/login", {username, password});
//       localStorage.setItem("currentUser", JSON.stringify(res.data));
//       navigate("/")
//     } catch (err) {
//       setError(err.response.data);
//     }
    
//   };

//   return (
//     <div className="login">
//       <form onSubmit={handleSubmit}>
//         <h1>Sign in</h1>
//         <label htmlFor="">Username</label>
//         <input
//           name="username"
//           type="text"
//           placeholder="Your name"
//           onChange={(e) => setUsername(e.target.value)}
//         />

//         <label htmlFor="">Password</label>
//         <input
//           name="password"
//           type="password"
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button type="submit">Login</button>
//         {error && error}
//       </form>
//     </div>
//   )
// }

// export default Login
import React, { useState } from "react";
import "./Login.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const res = await newRequest.post("/auth/login", { username, password });
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your TalentHub account</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">
                <FaEnvelope /> Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">
                <FaLock /> Password
              </label>
              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            
            <div className="forgot-password">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          
          <div className="login-footer">
            <p>
              Don't have an account? <Link to="/register">Join TalentHub</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
