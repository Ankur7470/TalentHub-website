import createError from "../utils/createError.js";
import Conversation from "../models/conversation.model.js";

export const createConversation = async (req, res, next) => {
  try {
    const { to } = req.body;
    
    const sellerId = req.isSeller ? req.userId : to;
    const buyerId = req.isSeller ? to : req.userId;

    const existing = await Conversation.findOne({ sellerId, buyerId });
    if (existing) return res.status(200).send(existing);

    const conv = new Conversation({
      sellerId,
      buyerId,
      readBySeller: false,
      readByBuyer: false,
      lastMessage: "",
    });

    const saved = await conv.save();
    res.status(201).send(saved);
  } catch (err) {
    next(err);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      $or: [{ sellerId: req.userId }, { buyerId: req.userId }],
    }).sort({ updatedAt: -1 });

    res.status(200).send(conversations);
  } catch (err) {
    next(err);
  }
};

export const getSingleConversation = async (req, res, next) => {
  try {
    const conv = await Conversation.findById(req.params.id);
    if (!conv) return next(createError(404, "Conversation not found"));
    res.status(200).send(conv);
  } catch (err) {
    next(err);
  }
};

export const updateConversation = async (req, res, next) => {
  try {
    const conv = await Conversation.findById(req.params.id);
    if (!conv) return next(createError(404, "Conversation not found"));

    const updates = req.userId === conv.sellerId 
      ? { readBySeller: true } 
      : { readByBuyer: true };

    const updated = await Conversation.findByIdAndUpdate(
      req.params.id, 
      updates, 
      { new: true }
    );

    res.status(200).send(updated);
  } catch (err) {
    next(err);
  }
};
