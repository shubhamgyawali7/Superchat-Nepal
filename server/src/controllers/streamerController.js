export const getPublicProfile = async (req, res) => {
  const { username } = req.params;
  const supabase = req.supabase;

  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select(
        "display_name, theme_color, welcome_title, welcome_sub, youtube_url, facebook_url, upi_id, bio, avatar_url, alert_min_amount, alert_duration"
      )
      .eq("username", username)
      .single();

    if (error || !profile) {
      return res.status(404).json({ error: "Streamer not found" });
    }

    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const getDashboardData = async (req, res) => {
  const user = req.user;
  const supabase = req.supabase;

  try {
    const { data: profile, error: pError } = await supabase
      .from("profiles")
      .select("username, display_name, total_earnings, upi_id, bio, theme_color")
      .eq("id", user.id)
      .single();

    if (pError) throw pError;

    const { data: donations, error: dError } = await supabase
      .from("donations")
      .select("*")
      .eq("streamer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (dError) throw dError;

    // Count unique supporters by supporter_name
    const uniqueSupporters = new Set(donations.map((d) => d.supporter_name)).size;

    res.status(200).json({
      username: profile.username,
      displayName: profile.display_name,
      totalEarnings: profile.total_earnings || 0,
      recentDonations: donations || [],
      supporterCount: uniqueSupporters,
      profile,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

// ✅ NEW: Update streamer profile
export const updateProfile = async (req, res) => {
  const user = req.user;
  const supabase = req.supabase;
  const {
    display_name,
    theme_color,
    welcome_title,
    welcome_sub,
    youtube_url,
    facebook_url,
    upi_id,
    bio,
    avatar_url,
    alert_min_amount,
    alert_duration,
  } = req.body;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        display_name,
        theme_color,
        welcome_title,
        welcome_sub,
        youtube_url,
        facebook_url,
        upi_id,
        bio,
        avatar_url,
        alert_min_amount,
        alert_duration,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ message: "Profile updated successfully", profile: data });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// ✅ NEW: Send Test Alert
export const sendTestAlert = async (req, res) => {
  const user = req.user;
  const io = req.io;
  const supabase = req.supabase;

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    if (!profile) return res.status(404).json({ error: "User not found" });

    io.to(profile.username).emit("new-donation", {
      name: "Test Supporter",
      amount: 100,
      message: "This is a test alert! Your overlay is working perfectly. 🚀",
      isTest: true
    });

    res.status(200).json({ message: "Test alert sent!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send test alert" });
  }
};