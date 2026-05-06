// Register Function
export const register = async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username)
    return res.status(400).json({ error: "Email, password, and username are required." });

  try {
    const { data, error } = await req.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
        emailRedirectTo: `${process.env.SERVER_URL || "http://localhost:5000"}/api/auth/callback`,
      },
    });

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({
      message: "Check your email for a verification link.",
      data,
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ error: "An internal server error occurred during registration." });
  }
};


// Callback Function (PKCE Flow)
export const callback = async (req, res) => {
  try {
    const code = req.query.code;
    const supabase = req.supabase;

    if (!code) {
      return res.status(400).json({ error: "No code provided in the callback" });
    }

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // ✅ FIX: was `res.status(501).status(400)` — chained double status, invalid
      return res.status(400).json({ error: error.message });
    }

    // Redirect to dashboard after successful email verification
    return res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/dashboard`);
  } catch (err) {
    console.error("Callback Error:", err);
    res.status(500).json({ error: "Error during session exchange" });
  }
};

// Login Function
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });

  try {
    const { data, error } = await req.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return res.status(401).json({ error: error.message });

    return res.status(200).json({
      message: "Login successful",
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Internal server error during login." });
  }
};

// Logout Function
export const logout = async (req, res) => {
  try {
    const { error } = await req.supabase.auth.signOut();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({ error: "Internal server error during logout." });
  }
};