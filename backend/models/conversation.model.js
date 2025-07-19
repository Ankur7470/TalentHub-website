import mongoose from "mongoose";
const { Schema } = mongoose;

// const ConversationSchema = new Schema(
//   {
//     sellerId: { type: String, required: true },
//     buyerId: { type: String, required: true },
//     readBySeller: { type: Boolean, default: false },
//     readByBuyer: { type: Boolean, default: false },
//     lastMessage: { type: String, default: "" },
//   },
//   { timestamps: true }
// );

const ConversationSchema = new mongoose.Schema({
  id: { type: String, unique: true }, // Unique composite key
  buyerId: { type: String, required: true },
  sellerId: { type: String, required: true },
  readByBuyer: { type: Boolean, default: false },
  readBySeller: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export default mongoose.model("Conversation", ConversationSchema);


