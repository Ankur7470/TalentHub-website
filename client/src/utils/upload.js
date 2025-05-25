// import axios from "axios";

// const upload = async (file) => {
//   const data = new FormData();
//   data.append("file", file);
//   data.append("upload_preset", "freelance");

//   try {
//     const res = await axios.post("https://api.cloudinary.com/v1_1/dtbie38ka/image/upload", data);

//     const { url } = res.data;
//     return url;
//   } catch (err) {
//     console.log(err);
//   }
// };

// export default upload;

// utils/upload.js
import axios from "axios";
import config from "./config";

const upload = async (file) => {
  if (!file) return null;
  
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", config.CLOUDINARY_UPLOAD_PRESET);

  try {
    const res = await axios.post(config.CLOUDINARY_URL, data, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload progress: ${percentCompleted}%`);
      }
    });

    const { url } = res.data;
    return url;
  } catch (err) {
    console.error("Error uploading file:", err);
    throw new Error("File upload failed");
  }
};

export default upload;
