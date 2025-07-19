import createError from "../utils/createError.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const createMessage = async (req, res, next) => {
  try {
    const { conversationId, desc } = req.body;

    // Save message
    const msg = new Message({ 
      conversationId, 
      userId: req.userId, 
      desc 
    });
    const saved = await msg.save();

    // Get conversation to determine roles
    const conv = await Conversation.findById(conversationId);
    if (!conv) return next(createError(404, "Conversation not found"));

    // Update conversation with correct read flags
    const updates = {
      lastMessage: desc,
      updatedAt: new Date(),
    };

    // Set read status based on actual conversation roles
    if (req.userId === conv.sellerId) {
      updates.readBySeller = true;
      updates.readByBuyer = false;
    } else if (req.userId === conv.buyerId) {
      updates.readByBuyer = true;
      updates.readBySeller = false;
    } else {
      return next(createError(403, "You are not part of this conversation"));
    }

    await Conversation.findByIdAndUpdate(conversationId, updates);
    res.status(201).send(saved);
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ 
      conversationId: req.params.id 
    }).sort({ createdAt: 1 });
    res.status(200).send(messages);
  } catch (err) {
    next(err);
  }
};
