import express from "express";
import {
  getMyProfile,
  getPublicProfile,
  getDashboardData,
  getDonationHistory,
  updateProfile,
  sendTestAlert,
  resetDonations,
  getTopDonations,
  getRecentDonations,
} from "../controllers/streamerController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Private: Get own full profile (authenticated)
router.get("/me", auth, getMyProfile);

// Private: Get all donation history (authenticated)
router.get("/donations", auth, getDonationHistory);

// Public: Get streamer profile for donation page
router.get("/profile/:username", getPublicProfile);

// Public: Get top 5 donations for streamer
router.get("/top-donations/:username", getTopDonations);

// Public: Get recent verified donations for the overlay feed
router.get("/recent-donations/:username", getRecentDonations);

// Private: Get dashboard stats (authenticated)
router.get("/dashboard", auth, getDashboardData);

// ✅ NEW: Update streamer profile (authenticated)
router.put("/profile", auth, updateProfile);

// ✅ NEW: Send test alert (authenticated)
router.post("/test-alert", auth, sendTestAlert);

// ✅ NEW: Reset stream donations (authenticated)
router.post("/reset-donations", auth, resetDonations);

export default router;