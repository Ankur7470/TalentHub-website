import Stripe from "stripe";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";
import createError from "../utils/createError.js";

export const intent = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE);
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return next(createError(404, "Gig not found"));

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(gig.price * 1.05 * 100), // Include fee
      currency: "inr",
      metadata: { gigId: gig._id, buyerId: req.userId },
    });

    const newOrder = new Order({
      gigId: gig._id,
      img: gig.cover,
      title: gig.title,
      price: gig.price,
      sellerId: gig.userId,
      buyerId: req.userId,
      payment_intent: paymentIntent.id,
    });

    await newOrder.save();

    res.status(200).send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    next(err);
  }
};

export const confirm = async (req, res, next) => {
  try {
    const { payment_intent } = req.body;

    const order = await Order.findOneAndUpdate(
      { payment_intent },
      { isCompleted: true }
    );

    if (!order) return next(createError(404, "Order not found"));

    res.status(200).send("Order confirmed");
  } catch (err) {
    next(err);
  }
};


// export const getOrders = async (req, res, next) => {
//   try {
//     const orders = await Order.find({
//       ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
//       isCompleted: true,
//     });

//     res.status(200).send(orders);
//   } catch (err) {
//     next(err);
//   }
// };

export const getOrders = async (req, res, next) => {
  try {
    const criteria = {
      isCompleted: true, // ✅ Only completed orders
      $or: [
        { sellerId: req.userId },
        { buyerId: req.userId },
      ],
    };

    const orders = await Order.find(criteria).sort({ createdAt: -1 });

    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
};



export const createOrder = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.gigId);
    if (!gig) return next(createError(404, "Gig not found"));
    
    const newOrder = new Order({
      gigId: gig._id,
      img: gig.cover,
      title: gig.title,
      price: gig.price,
      sellerId: gig.userId,
      buyerId: req.userId,
      payment_intent: "temporary",
    });
    
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    next(err);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return next(createError(404, "Order not found"));
    
    if (order.sellerId !== req.userId && order.buyerId !== req.userId) 
      return next(createError(403, "You can only update your own orders"));
    
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    
    res.status(200).json(updatedOrder);
  } catch (err) {
    next(err);
  }
};
