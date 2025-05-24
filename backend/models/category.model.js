import mongoose from "mongoose";
const { Schema } = mongoose;

const CategorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    cat: {
      type: String,
      required: true,
      unique: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Category", CategorySchema);
