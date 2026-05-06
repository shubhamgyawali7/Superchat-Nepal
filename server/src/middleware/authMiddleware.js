import { createClient } from "../config/supabase.js";

export const auth = async (req, res, next) => {
  const supabase = createClient(req, res);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  req.user = user; // Attach user to request
  req.supabase = supabase; // Attach client to request
  next();
};
