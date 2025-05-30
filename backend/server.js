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

const allowedOrigins = [
  "http://localhost:5173",
  "https://talent-hub-website-frontend.vercel.app"
];
// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true
// }));  


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

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

// MongoDB connection (works for both local and Vercel)
const connect = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
      // console.log('Connected to MongoDB');
      console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
    }
  } catch (error) {
    console.log(error);
  }
};
connect();

// Local dev: start server
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
