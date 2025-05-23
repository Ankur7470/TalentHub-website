import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    gigId: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sellerId: {
      type: String,
      required: true,
    },
    buyerId: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    payment_intent: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.post('save', async function() {
  if (this.isCompleted) {
    // Update seller's last delivery time
    const deliveryTime = (new Date(this.updatedAt) - new Date(this.createdAt)) / (1000 * 60 * 60 * 24);
    await User.findByIdAndUpdate(this.sellerId, { lastDelivery: Math.round(deliveryTime) });
  }
});

export default mongoose.model("Order", OrderSchema);