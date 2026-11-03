import prisma from "../config/prisma.js";
import { COOKIE_NAME, verifyToken } from "../utils/auth.js";

const getToken = (req) => {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  return req.cookies?.[COOKIE_NAME] || null;
};

export const auth = async (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { profile: true },
    });

    if (!user?.profile) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      username: user.profile.username,
      created_at: user.createdAt,
    };
    req.profile = { ...user.profile, email: user.email };
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    res.status(500).json({ error: "Authentication failed" });
  }
};

export default auth;
