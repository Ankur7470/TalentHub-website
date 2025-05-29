import express from "express";
import { register, login, logout, getMe } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/jwt.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyToken, getMe);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:userId/:token", resetPassword);

export default router;
