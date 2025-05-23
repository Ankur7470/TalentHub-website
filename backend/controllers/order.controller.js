import createError from "../utils/createError.js";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";
import Stripe from "stripe";

export const intent = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE);

  const gig = await Gig.findById(req.params.id);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: gig.price * 100,
    currency: "usd",
    // automatic_payment_methods: {
    //   enabled: true,
    // },
  });

  const newOrder = new Order({
    gigId: gig._id,
    img: gig.cover,
    title: gig.title,
    buyerId: req.userId,
    sellerId: gig.userId,
    price: gig.price,
    payment_intent: paymentIntent.id,
  });

  await newOrder.save();

  res.status(200).send({
    clientSecret: paymentIntent.client_secret,
  });
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true,
    });

    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
};

export const confirm = async (req, res, next) => {
  try {
    const orders = await Order.findOneAndUpdate(
      {
        payment_intent: req.body.payment_intent,
      },
      {
        $set: {
          isCompleted: true,
        },
      }
    );

    res.status(200).send("Order has been confirmed.");
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
