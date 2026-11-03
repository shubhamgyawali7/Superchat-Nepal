import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import { toProfile } from "../utils/serializers.js";
import {
  COOKIE_NAME,
  clearCookieOptions,
  cookieOptions,
  signToken,
} from "../utils/auth.js";

const normalizeEmail = (email) =>
  typeof email === "string" ? email.trim().toLowerCase() : "";

const normalizeUsername = (username) =>
  typeof username === "string" ? username.trim() : "";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidUsername = (username) => /^[a-zA-Z0-9_.-]{3,30}$/.test(username);

const publicUser = (user) => ({
  id: user.id,
  email: user.email,
  username: user.profile?.username,
  created_at: user.createdAt,
});

// Register Function
export const register = async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const username = normalizeUsername(req.body?.username);
  const password = req.body?.password;

  if (!email || !password || !username) {
    return res
      .status(400)
      .json({ error: "Email, password, and username are required." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }

  if (!isValidUsername(username)) {
    return res.status(400).json({
      error:
        "Username must be 3-30 characters and contain only letters, numbers, dots, dashes, or underscores.",
    });
  }

  if (typeof password !== "string" || password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters long." });
  }

  try {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { profile: { username: { equals: username, mode: "insensitive" } } },
        ],
      },
      include: { profile: true },
    });

    if (existing) {
      const conflict =
        existing.email === email
          ? "An account with this email already exists."
          : "This username is already taken.";
      return res.status(409).json({ error: conflict });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: { email, passwordHash },
      });

      await tx.profile.create({
        data: {
          id: createdUser.id,
          username,
          displayName: username,
        },
      });

      return tx.user.findUnique({
        where: { id: createdUser.id },
        include: { profile: true },
      });
    });

    const token = signToken({ ...user, username: user.profile.username });
    res.cookie(COOKIE_NAME, token, cookieOptions());

    return res.status(201).json({
      message: "Account created successfully.",
      user: publicUser(user),
      profile: toProfile(user.profile),
    });
  } catch (err) {
    if (err.code === "P2002") {
      return res
        .status(409)
        .json({ error: "That email or username is already in use." });
    }
    console.error("Registration Error:", err);
    return res
      .status(500)
      .json({ error: "An internal server error occurred during registration." });
  }
};

// Login Function
export const login = async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = req.body?.password;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user?.profile) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = signToken({ ...user, username: user.profile.username });
    res.cookie(COOKIE_NAME, token, cookieOptions());

    return res.status(200).json({
      message: "Login successful",
      user: publicUser(user),
      profile: toProfile(user.profile),
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ error: "Internal server error during login." });
  }
};

// Current user
export const me = async (req, res) => {
  return res.status(200).json({
    user: req.user,
    profile: toProfile(req.profile),
  });
};

// Logout Function
export const logout = async (req, res) => {
  res.clearCookie(COOKIE_NAME, clearCookieOptions());
  return res.status(200).json({ message: "Logged out successfully" });
};
