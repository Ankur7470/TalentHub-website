import express from "express";
import { getCategories, getFeaturedCategories, createCategory } from "../controllers/category.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/featured", getFeaturedCategories);
router.post("/", verifyToken, createCategory);

export default router;
