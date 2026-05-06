import express from "express";
import { initiateDonation, verifyEsewa, verifyKhalti } from "../controllers/donationController.js";

const router = express.Router();

// 1. Initiate a donation (called from donation page before redirecting to payment gateway)
router.post("/initiate", initiateDonation);

// 2. Callback from eSewa — supports both:
//    - GET: direct redirect from eSewa gateway with ?data=base64...
//    - POST: frontend success page forwarding the data
router.get("/verify-esewa", verifyEsewa);
router.post("/verify-esewa", verifyEsewa);

// 3. Callback from Khalti
router.post("/verify-khalti", verifyKhalti);

export default router;
