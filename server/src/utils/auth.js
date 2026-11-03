import jwt from "jsonwebtoken";

export const COOKIE_NAME = "sc_token";

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set. Add it to server/.env");
  }
  return secret;
};

export const signToken = (user) =>
  jwt.sign(
    { sub: user.id, email: user.email, username: user.username },
    getSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

export const verifyToken = (token) => jwt.verify(token, getSecret());

export const cookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

export const clearCookieOptions = () => {
  const options = cookieOptions();
  delete options.maxAge;
  return options;
};
