import mongoose from "mongoose";
const { Schema } = mongoose;

const MessageSchema = new Schema({
  conversationId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
},{
  timestamps:true
});

MessageSchema.post('save', async function() {
  // Find the conversation to get buyer and seller IDs
  const conversation = await Conversation.findById(this.conversationId);
  if (!conversation) return;
  
  // If this is a seller message, update the response time
  if (this.userId === conversation.sellerId) {
    // Find previous buyer message
    const prevBuyerMessage = await Message.findOne({
      conversationId: this.conversationId,
      userId: conversation.buyerId
    }).sort({ createdAt: -1 });
    
    if (prevBuyerMessage) {
      // Calculate response time in hours
      const responseTime = (new Date(this.createdAt) - new Date(prevBuyerMessage.createdAt)) / (1000 * 60 * 60);
      
      // Update seller's average response time (simplified example)
      const seller = await User.findById(conversation.sellerId);
      const newAvgTime = (seller.avgResponseTime + responseTime) / 2;
      await User.findByIdAndUpdate(conversation.sellerId, { avgResponseTime: Math.round(newAvgTime) });
    }
  }
});


export default mongoose.model("Message", MessageSchema)