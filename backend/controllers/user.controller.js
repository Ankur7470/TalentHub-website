import User from "../models/user.model.js";
import createError from "../utils/createError.js";

export const deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (req.userId !== user._id.toString()) {
    return next(createError(403, "You can delete only your account!"));
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(200).send("deleted.");
};

// export const getUser = async (req, res, next) => {
//   const user = await User.findById(req.params.id);

//   res.status(200).send(user);
// };
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found!"));
    
    const { password, ...info } = user._doc;
    
    // Add formatted join date from createdAt timestamp
    info.joinDate = new Date(user.createdAt).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
    
    res.status(200).send(info);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    if (req.params.id !== req.userId) return next(createError(403, "You can only update your own profile"));
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    
    // Remove password from response
    const { password, ...info } = updatedUser._doc;
    
    res.status(200).json(info);
  } catch (err) {
    next(err);
  }
};

export const updateUserStats = async (req, res, next) => {
  try {
    if (req.userId !== req.params.id) {
      return next(createError(403, "You can only update your own statistics"));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          languages: req.body.languages,
          avgResponseTime: req.body.avgResponseTime,
          lastDelivery: req.body.lastDelivery
        }
      },
      { new: true }
    );

    const { password, ...info } = updatedUser._doc;
    res.status(200).json(info);
  } catch (err) {
    next(err);
  }
};

// Calculate statistics automatically based on orders and messages
export const calculateUserStats = async (req, res, next) => {
  try {
    if (req.userId !== req.params.id) {
      return next(createError(403, "You can only calculate your own statistics"));
    }

    // Get user's orders to calculate average delivery time
    const orders = await Order.find({ sellerId: req.userId, isCompleted: true });
    
    let avgDeliveryTime = 1; // Default
    if (orders.length > 0) {
      // Calculate average delivery time based on completed orders
      const totalDeliveryDays = orders.reduce((sum, order) => {
        const deliveryTime = (new Date(order.updatedAt) - new Date(order.createdAt)) / (1000 * 60 * 60 * 24);
        return sum + deliveryTime;
      }, 0);
      avgDeliveryTime = Math.round(totalDeliveryDays / orders.length);
    }
    
    // Get user's messages to calculate response time
    const conversations = await Conversation.find({ sellerId: req.userId });
    const conversationIds = conversations.map(conv => conv.id);
    
    let avgResponseTime = 4; // Default
    if (conversationIds.length > 0) {
      // Calculate average response time based on message timestamps
      // This is a simplified example - you would need more complex logic for real-world use
      const messages = await Message.find({ 
        conversationId: { $in: conversationIds },
        userId: req.userId
      }).sort({ createdAt: 1 });
      
      // Implement your response time calculation logic here
      // ...
    }
    
    // Update user with calculated statistics
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          lastDelivery: avgDeliveryTime,
          avgResponseTime: avgResponseTime
        }
      },
      { new: true }
    );

    const { password, ...info } = updatedUser._doc;
    res.status(200).json(info);
  } catch (err) {
    next(err);
  }
};

