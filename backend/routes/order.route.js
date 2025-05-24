import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { getOrders, intent, confirm, createOrder, updateOrder } from "../controllers/order.controller.js";

const router = express.Router();

router.get("/", verifyToken, getOrders);
router.post("/create-payment-intent/:id", verifyToken, intent);
router.put("/", verifyToken, confirm);
router.post("/:gigId", verifyToken, createOrder);
router.put("/:id", verifyToken, updateOrder);


export default router;