
import express from 'express';
import cors from 'cors';
// import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from "./routes/user.route.js";
import gigRoute from "./routes/gig.route.js";
import orderRoute from "./routes/order.route.js";
import reviewRoute from "./routes/review.route.js";
import messageRoute from "./routes/message.route.js";
import conversationRoute from "./routes/conversation.route.js";
import authRoute from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;

// const PORT = process.env.PORT || 5000;
mongoose.set("strictQuery", true);

// app.use(cors({ origin: "http://localhost:5000", credentials: true}));
app.use(cors({origin:"http://localhost:5173", credentials: true}));
// app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

app.use("/backend/auth", authRoute);
app.use("/backend/users", userRoute);
app.use("/backend/gigs", gigRoute);
app.use("/backend/orders", orderRoute);
app.use("/backend/reviews", reviewRoute);
app.use("/backend/messages", messageRoute);
app.use("/backend/conversations", conversationRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
  
    return res.status(errorStatus).send(errorMessage);
  });

const connect = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    }catch(error){
        console.log(error);
    }
};

app.listen(port, () => {
    connect();
    console.log(`Server is running on port ${port}`);
});
