import axios from "axios";

const newRequest = axios.create({
    // baseURL: "http://localhost:5000/backend/", withCredentials: true,
    baseURL: "https://talent-hub-website-navy.vercel.app/backend", withCredentials: true
  
    // baseURL: "https://talent-hub-freelance-backend.onrender.com/backend/", withCredentials: true,

});

export default newRequest;