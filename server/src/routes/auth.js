import express from "express";
import { login, register, logout, callback } from "../controllers/authController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.get("/callback", callback);

// ✅ FIX: Removed `auth` middleware from login — user isn't authenticated yet at this point
router.post("/login", login);

// ✅ Logout requires auth to know which session to destroy
router.post("/logout", auth, logout);

export default router;