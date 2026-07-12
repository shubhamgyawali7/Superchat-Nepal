export const getPublicProfile = async (req, res) => {
  const { username } = req.params;
  const supabase = req.supabase;

  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select(
        "display_name, theme_color, welcome_title, welcome_sub, youtube_url, facebook_url, upi_id, bio, avatar_url, alert_min_amount, alert_duration, last_cleared_at, alert_gif_url, alert_font_family, alert_text_color, alert_amount_color, alert_message_color, alert_bg_color, alert_border_color, alert_position, alert_animation, tts_enabled, tts_rate, recent_donations_position, recent_donations_count"
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
    alert_gif_url,
    alert_font_family,
    alert_text_color,
    alert_amount_color,
    alert_message_color,
    alert_bg_color,
    alert_border_color,
    alert_position,
    alert_animation,
    tts_enabled,
    tts_rate,
    recent_donations_position,
    recent_donations_count,
  } = req.body;

  // Sanitize string inputs
  const sanitize = (str, maxLen = 200) => {
    if (!str || typeof str !== "string") return null;
    return str.replace(/<[^>]*>/g, "").trim().slice(0, maxLen) || null;
  };

  const updates = {};
  if (display_name !== undefined) updates.display_name = sanitize(display_name, 100);
  if (theme_color !== undefined && typeof theme_color === "string") updates.theme_color = theme_color.slice(0, 20);
  if (welcome_title !== undefined) updates.welcome_title = sanitize(welcome_title, 150);
  if (welcome_sub !== undefined) updates.welcome_sub = sanitize(welcome_sub, 300);
  if (youtube_url !== undefined) updates.youtube_url = sanitize(youtube_url, 500);
  if (facebook_url !== undefined) updates.facebook_url = sanitize(facebook_url, 500);
  if (upi_id !== undefined) updates.upi_id = sanitize(upi_id, 50);
  if (bio !== undefined) updates.bio = sanitize(bio, 500);
  if (avatar_url !== undefined) updates.avatar_url = sanitize(avatar_url, 500);
  if (alert_min_amount !== undefined) {
    const val = parseFloat(alert_min_amount);
    updates.alert_min_amount = isNaN(val) ? 0 : Math.max(0, val);
  }
  if (alert_duration !== undefined) {
    const val = parseInt(alert_duration, 10);
    updates.alert_duration = isNaN(val) ? 5 : Math.max(1, Math.min(60, val));
  }
  if (alert_gif_url !== undefined) updates.alert_gif_url = typeof alert_gif_url === "string" ? alert_gif_url.slice(0, 5000000) : null;
  if (alert_font_family !== undefined) updates.alert_font_family = sanitize(alert_font_family, 100);
  if (alert_text_color !== undefined && typeof alert_text_color === "string") updates.alert_text_color = alert_text_color.slice(0, 30);
  if (alert_amount_color !== undefined && typeof alert_amount_color === "string") updates.alert_amount_color = alert_amount_color.slice(0, 30);
  if (alert_message_color !== undefined && typeof alert_message_color === "string") updates.alert_message_color = alert_message_color.slice(0, 30);
  if (alert_bg_color !== undefined && typeof alert_bg_color === "string") updates.alert_bg_color = alert_bg_color.slice(0, 50);
  if (alert_border_color !== undefined && typeof alert_border_color === "string") updates.alert_border_color = alert_border_color.slice(0, 30);
  if (alert_position !== undefined && typeof alert_position === "string") updates.alert_position = ["top", "center", "bottom"].includes(alert_position) ? alert_position : "top";
  if (alert_animation !== undefined && typeof alert_animation === "string") updates.alert_animation = ["slide", "bounce", "fade", "zoom"].includes(alert_animation) ? alert_animation : "slide";
  if (tts_enabled !== undefined) updates.tts_enabled = !!tts_enabled;
  if (tts_rate !== undefined) {
    const val = parseFloat(tts_rate);
    updates.tts_rate = isNaN(val) ? 0.9 : Math.max(0.1, Math.min(2, val));
  }
  if (recent_donations_position !== undefined && typeof recent_donations_position === "string") updates.recent_donations_position = sanitize(recent_donations_position, 30);
  if (recent_donations_count !== undefined) {
    const val = parseInt(recent_donations_count, 10);
    updates.recent_donations_count = isNaN(val) ? 5 : Math.max(0, Math.min(10, val));
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No valid fields to update" });
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
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