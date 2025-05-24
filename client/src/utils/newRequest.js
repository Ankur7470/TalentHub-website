// import axios from "axios";

// const newRequest = axios.create({
//     //dev
//     baseURL: "http://localhost:5000/backend/", withCredentials: true,

//     //prod
//     // baseURL: "https://talent-hub-website-navy.vercel.app/backend", withCredentials: true  

// });

// export default newRequest;
import axios from "axios";
import config from "./config";

const newRequest = axios.create({
  baseURL: config.API_URL,
  withCredentials: true
});

// Add request interceptor for authentication
newRequest.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
newRequest.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token expiration
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Refresh token logic would go here
        // For now, just logout the user
        localStorage.removeItem("currentUser");
        window.location.href = "/login";
      } catch (err) {
        console.error("Error refreshing authentication", err);
      }
    }
    
    return Promise.reject(error);
  }
);

export default newRequest;
