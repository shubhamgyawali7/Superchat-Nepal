import express from "express";
import {
  getPublicProfile,
  getDashboardData,
  updateProfile,
  sendTestAlert,
  resetDonations,
  getTopDonations,
} from "../controllers/streamerController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: Get streamer profile for donation page
router.get("/profile/:username", getPublicProfile);

// Public: Get top 5 donations for streamer
router.get("/top-donations/:username", getTopDonations);

// Private: Get dashboard stats (authenticated)
router.get("/dashboard", auth, getDashboardData);

// ✅ NEW: Update streamer profile (authenticated)
router.put("/profile", auth, updateProfile);

// ✅ NEW: Send test alert (authenticated)
router.post("/test-alert", auth, sendTestAlert);

// ✅ NEW: Reset stream donations (authenticated)
router.post("/reset-donations", auth, resetDonations);

export default router;