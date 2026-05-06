import express from "express";
import {
  getPublicProfile,
  getDashboardData,
  updateProfile,
  sendTestAlert,
} from "../controllers/streamerController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: Get streamer profile for donation page
router.get("/profile/:username", getPublicProfile);

// Private: Get dashboard stats (authenticated)
router.get("/dashboard", auth, getDashboardData);

// ✅ NEW: Update streamer profile (authenticated)
router.put("/profile", auth, updateProfile);

// ✅ NEW: Send test alert (authenticated)
router.post("/test-alert", auth, sendTestAlert);

export default router;