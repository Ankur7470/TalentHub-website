import mongoose from "mongoose";
const { Schema } = mongoose;

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    cat: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    pp: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
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

export default mongoose.model("Project", ProjectSchema);
