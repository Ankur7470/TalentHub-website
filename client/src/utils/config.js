const dev = {
    API_URL: "http://localhost:5000/backend/",
    CLOUDINARY_URL: "https://api.cloudinary.com/v1_1/dtbie38ka/image/upload",
    CLOUDINARY_UPLOAD_PRESET: "freelance"
  };
  
  const prod = {
    API_URL: "https://talent-hub-website-navy.vercel.app/backend",
    CLOUDINARY_URL: "https://api.cloudinary.com/v1_1/dtbie38ka/image/upload",
    CLOUDINARY_UPLOAD_PRESET: "freelance"
  };
  
  // const config = process.env.NODE_ENV === 'production' ? prod : dev;
  const config = dev;
  
  export default config;
