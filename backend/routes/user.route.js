import express from "express";
import { 
  deleteUser, 
  getUser, 
  updateUser, 
  updateUserStats,
  calculateUserStats 
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.delete("/:id", verifyToken, deleteUser);
router.get("/:id", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser);
router.put("/:id/stats", verifyToken, updateUserStats);
router.post("/:id/calculate-stats", verifyToken, calculateUserStats);

export default router;
