import express from "express";
import { createGig, deleteGig, getGig, getGigs, updateGig, getMyGigs } from "../controllers/gig.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

// Only authenticated sellers can create, delete, or update gigs
router.post("/", verifyToken, createGig);
router.delete("/:id", verifyToken, deleteGig);
router.put("/:id", verifyToken, updateGig);
router.get("/mygigs", verifyToken, getMyGigs);

// Public routes for fetching gigs
router.get("/single/:id", getGig);
router.get("/", getGigs);

export default router;