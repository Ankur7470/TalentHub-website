import express from "express";
import { getFeaturedProjects, getProjects, createProject } from "../controllers/project.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.get("/", getProjects);
router.get("/featured", getFeaturedProjects);
router.post("/", verifyToken, createProject);

export default router;
