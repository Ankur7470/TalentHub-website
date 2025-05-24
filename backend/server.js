
// import express from 'express';
// import cors from 'cors';
// // import bodyParser from 'body-parser';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import userRoute from "./routes/user.route.js";
// import gigRoute from "./routes/gig.route.js";
// import orderRoute from "./routes/order.route.js";
// import reviewRoute from "./routes/review.route.js";
// import messageRoute from "./routes/message.route.js";
// import conversationRoute from "./routes/conversation.route.js";
// import authRoute from "./routes/auth.route.js";
// import cookieParser from "cookie-parser";

// const app = express();
// dotenv.config();

// const port = process.env.PORT || 5000;

// // const PORT = process.env.PORT || 5000;
// mongoose.set("strictQuery", true);

// // app.use(cors({origin:"http://localhost:5173", credentials: true}));
// app.use(cors({origin: "https://talent-hub-website-frontend-7nn9ki0cv-ankur7470.vercel.app", credentials: true}));
// // app.use(bodyParser.json());
// app.use(cookieParser());
// app.use(express.json());

// app.use("/backend/auth", authRoute);
// app.use("/backend/users", userRoute);
// app.use("/backend/gigs", gigRoute);
// app.use("/backend/orders", orderRoute);
// app.use("/backend/reviews", reviewRoute);
// app.use("/backend/messages", messageRoute);
// app.use("/backend/conversations", conversationRoute);

// app.use((err, req, res, next) => {
//     const errorStatus = err.status || 500;
//     const errorMessage = err.message || "Something went wrong!";
  
//     return res.status(errorStatus).send(errorMessage);
//   });

// const connect = async ()=>{
//     try{
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log('Connected to MongoDB');
//     }catch(error){
//         console.log(error);
//     }
// };

// app.listen(port, () => {
//     connect();
//     console.log(`Server is running on port ${port}`);
// });
// server.js - modified for Vercel
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from "./routes/user.route.js";
import gigRoute from "./routes/gig.route.js";
import orderRoute from "./routes/order.route.js";
import reviewRoute from "./routes/review.route.js";
import messageRoute from "./routes/message.route.js";
import conversationRoute from "./routes/conversation.route.js";
import categoryRoute from "./routes/category.route.js";
import projectRoute from "./routes/project.route.js";
import authRoute from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

mongoose.set("strictQuery", true);

//prod
app.use(cors({origin: "https://talent-hub-website-frontend.vercel.app", credentials:true}));

//dev
// app.use(cors({origin:"http://localhost:5173", credentials: true}));

app.use(cookieParser());
app.use(express.json());

app.use("/backend/auth", authRoute);
app.use("/backend/users", userRoute);
app.use("/backend/gigs", gigRoute);
app.use("/backend/orders", orderRoute);
app.use("/backend/reviews", reviewRoute);
app.use("/backend/messages", messageRoute);
app.use("/backend/conversations", conversationRoute);
app.use("/backend/categories", categoryRoute);
app.use("/backend/projects", projectRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  
  return res.status(errorStatus).send(errorMessage);
});

// Connect to MongoDB when not in Vercel serverless environment
if (process.env.NODE_ENV !== 'production') {
  const connect = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Connected to MongoDB');
    } catch(error) {
      console.log(error);
    }
  };
  
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    connect();
    console.log(`Server is running on port ${port}`);
  });
}

// For Vercel, connect to MongoDB and export the app
const connect = async () => {
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Connected to MongoDB');
    }
  } catch(error) {
    console.log(error);
  }
};

// Connect to MongoDB
connect();

// Export the app for Vercel
export default app;
