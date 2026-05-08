export const getPublicProfile = async (req, res) => {
  const { username } = req.params;
  const supabase = req.supabase;

  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select(
        "display_name, theme_color, welcome_title, welcome_sub, youtube_url, facebook_url, upi_id, bio, avatar_url, alert_min_amount, alert_duration, last_cleared_at"
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
      .select("username, display_name, total_earnings, upi_id, bio, theme_color, last_cleared_at")
      .eq("id", user.id)
      .single();

    if (pError) throw pError;

    let query = supabase
      .from("donations")
      .select("*")
      .eq("streamer_id", user.id)
      .order("created_at", { ascending: false });

    if (profile.last_cleared_at) {
      query = query.gt("created_at", profile.last_cleared_at);
    }

    const { data: donations, error: dError } = await query.limit(10);

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

// ✅ NEW: Reset Donations (Set last_cleared_at)
export const resetDonations = async (req, res) => {
  const user = req.user;
  const supabase = req.supabase;
  const io = req.io;
  const now = new Date().toISOString();

  try {
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    if (fetchError) throw fetchError;

    const { error } = await supabase
      .from("profiles")
      .update({ last_cleared_at: now })
      .eq("id", user.id);

    if (error) throw error;

    // Emit reset event to overlay
    if (io && profile.username) {
      io.to(profile.username).emit("stream-reset");
    }

    res.status(200).json({ message: "Donations reset successfully", last_cleared_at: now });
  } catch (err) {
    console.error("Reset donations error:", err);
    res.status(500).json({ error: "Failed to reset donations" });
  }
};

// ✅ NEW: Get Top 5 Donations
export const getTopDonations = async (req, res) => {
  const { username } = req.params;
  const supabase = req.supabase;

  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, last_cleared_at")
      .eq("username", username)
      .single();

    if (error || !profile) {
      return res.status(404).json({ error: "Streamer not found" });
    }

    let query = supabase
      .from("donations")
      .select("*")
      .eq("streamer_id", profile.id)
      .order("amount", { ascending: false }); // Order by highest amount

    if (profile.last_cleared_at) {
      query = query.gt("created_at", profile.last_cleared_at);
    }

    const { data: topDonations, error: dError } = await query.limit(5);

    if (dError) throw dError;

    res.status(200).json(topDonations);
  } catch (err) {
    console.error("Top donations error:", err);
    res.status(500).json({ error: "Failed to fetch top donations" });
  }
};