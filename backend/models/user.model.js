import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  desc: {
    type: String,
    required: false,
  },
  isSeller: {
    type: Boolean,
    default:false
  },
  languages: {
    type: [String],
    default: ["English"]
  },
  avgResponseTime: {
    type: Number, // Store in hours
    default: 4
  },
  lastDelivery: {
    type: Number, // Store in days
    default: 1
  },
  // resetPasswordToken: String,
  // resetPasswordExpires: Date,
},{
  timestamps:true
});

export default mongoose.model("User", userSchema)