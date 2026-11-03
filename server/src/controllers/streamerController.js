import prisma from "../config/prisma.js";
import { toDonation, toProfile, toPublicProfile } from "../utils/serializers.js";

const publicProfileSelect = {
  id: true,
  username: true,
  displayName: true,
  bio: true,
  avatarUrl: true,
  themeColor: true,
  welcomeTitle: true,
  welcomeSub: true,
  youtubeUrl: true,
  facebookUrl: true,
  upiId: true,
  alertMinAmount: true,
  alertDuration: true,
  alertGifUrl: true,
  alertFontFamily: true,
  alertTextColor: true,
  alertAmountColor: true,
  alertMessageColor: true,
  alertBgColor: true,
  alertBorderColor: true,
  alertPosition: true,
  alertAnimation: true,
  ttsEnabled: true,
  ttsRate: true,
  recentDonationsPosition: true,
  recentDonationsCount: true,
  lastClearedAt: true,
};

export const getMyProfile = async (req, res) => {
  return res.status(200).json(toProfile(req.profile));
};

export const getPublicProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const profile = await prisma.profile.findUnique({
      where: { username },
      select: publicProfileSelect,
    });

    if (!profile) {
      return res.status(404).json({ error: "Streamer not found" });
    }

    res.status(200).json(toPublicProfile(profile));
  } catch (err) {
    console.error("Public profile error:", err.message);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const getDashboardData = async (req, res) => {
  const user = req.user;

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: {
        username: true,
        displayName: true,
        totalEarnings: true,
        upiId: true,
        bio: true,
        themeColor: true,
        lastClearedAt: true,
      },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const donations = await prisma.donation.findMany({
      where: {
        streamerId: user.id,
        ...(profile.lastClearedAt
          ? { createdAt: { gt: profile.lastClearedAt } }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const serialized = donations.map(toDonation);
    const uniqueSupporters = new Set(serialized.map((d) => d.supporter_name)).size;

    res.status(200).json({
      username: profile.username,
      displayName: profile.displayName,
      totalEarnings: profile.totalEarnings || 0,
      recentDonations: serialized,
      supporterCount: uniqueSupporters,
      profile: toProfile(profile),
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

export const getDonationHistory = async (req, res) => {
  try {
    const donations = await prisma.donation.findMany({
      where: { streamerId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    res.status(200).json(donations.map(toDonation));
  } catch (err) {
    console.error("Donation history error:", err);
    res.status(500).json({ error: "Failed to fetch donation history" });
  }
};

const PROFILE_FIELD_MAP = {
  display_name: "displayName",
  theme_color: "themeColor",
  welcome_title: "welcomeTitle",
  welcome_sub: "welcomeSub",
  youtube_url: "youtubeUrl",
  facebook_url: "facebookUrl",
  upi_id: "upiId",
  bio: "bio",
  avatar_url: "avatarUrl",
  alert_min_amount: "alertMinAmount",
  alert_duration: "alertDuration",
  alert_gif_url: "alertGifUrl",
  alert_font_family: "alertFontFamily",
  alert_text_color: "alertTextColor",
  alert_amount_color: "alertAmountColor",
  alert_message_color: "alertMessageColor",
  alert_bg_color: "alertBgColor",
  alert_border_color: "alertBorderColor",
  alert_position: "alertPosition",
  alert_animation: "alertAnimation",
  tts_enabled: "ttsEnabled",
  tts_rate: "ttsRate",
  recent_donations_position: "recentDonationsPosition",
  recent_donations_count: "recentDonationsCount",
};

export const updateProfile = async (req, res) => {
  const body = req.body || {};

  const sanitize = (str, maxLen = 200) => {
    if (!str || typeof str !== "string") return null;
    return str.replace(/<[^>]*>/g, "").trim().slice(0, maxLen) || null;
  };

  const updates = {};
  if (body.display_name !== undefined) updates.displayName = sanitize(body.display_name, 100);
  if (body.theme_color !== undefined && typeof body.theme_color === "string") updates.themeColor = body.theme_color.slice(0, 20);
  if (body.welcome_title !== undefined) updates.welcomeTitle = sanitize(body.welcome_title, 150);
  if (body.welcome_sub !== undefined) updates.welcomeSub = sanitize(body.welcome_sub, 300);
  if (body.youtube_url !== undefined) updates.youtubeUrl = sanitize(body.youtube_url, 500);
  if (body.facebook_url !== undefined) updates.facebookUrl = sanitize(body.facebook_url, 500);
  if (body.upi_id !== undefined) updates.upiId = sanitize(body.upi_id, 50);
  if (body.bio !== undefined) updates.bio = sanitize(body.bio, 500);
  if (body.avatar_url !== undefined) updates.avatarUrl = sanitize(body.avatar_url, 500);
  if (body.alert_min_amount !== undefined) {
    const val = parseFloat(body.alert_min_amount);
    updates.alertMinAmount = isNaN(val) ? 0 : Math.max(0, val);
  }
  if (body.alert_duration !== undefined) {
    const val = parseInt(body.alert_duration, 10);
    updates.alertDuration = isNaN(val) ? 5 : Math.max(1, Math.min(60, val));
  }
  if (body.alert_gif_url !== undefined) updates.alertGifUrl = typeof body.alert_gif_url === "string" ? body.alert_gif_url.slice(0, 5000000) : null;
  if (body.alert_font_family !== undefined) updates.alertFontFamily = sanitize(body.alert_font_family, 100);
  if (body.alert_text_color !== undefined && typeof body.alert_text_color === "string") updates.alertTextColor = body.alert_text_color.slice(0, 30);
  if (body.alert_amount_color !== undefined && typeof body.alert_amount_color === "string") updates.alertAmountColor = body.alert_amount_color.slice(0, 30);
  if (body.alert_message_color !== undefined && typeof body.alert_message_color === "string") updates.alertMessageColor = body.alert_message_color.slice(0, 30);
  if (body.alert_bg_color !== undefined && typeof body.alert_bg_color === "string") updates.alertBgColor = body.alert_bg_color.slice(0, 50);
  if (body.alert_border_color !== undefined && typeof body.alert_border_color === "string") updates.alertBorderColor = body.alert_border_color.slice(0, 30);
  if (body.alert_position !== undefined && typeof body.alert_position === "string") updates.alertPosition = ["top", "center", "bottom"].includes(body.alert_position) ? body.alert_position : "top";
  if (body.alert_animation !== undefined && typeof body.alert_animation === "string") updates.alertAnimation = ["slide", "bounce", "fade", "zoom"].includes(body.alert_animation) ? body.alert_animation : "slide";
  if (body.tts_enabled !== undefined) updates.ttsEnabled = !!body.tts_enabled;
  if (body.tts_rate !== undefined) {
    const val = parseFloat(body.tts_rate);
    updates.ttsRate = isNaN(val) ? 0.9 : Math.max(0.1, Math.min(2, val));
  }
  if (body.recent_donations_position !== undefined && typeof body.recent_donations_position === "string") updates.recentDonationsPosition = sanitize(body.recent_donations_position, 30);
  if (body.recent_donations_count !== undefined) {
    const val = parseInt(body.recent_donations_count, 10);
    updates.recentDonationsCount = isNaN(val) ? 5 : Math.max(0, Math.min(10, val));
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No valid fields to update" });
  }

  try {
    const profile = await prisma.profile.update({
      where: { id: req.user.id },
      data: updates,
    });

    const serialized = toProfile(profile);

    if (req.io && profile.username) {
      req.io.to(profile.username).emit("settings-updated", toPublicProfile(profile));
    }

    res.status(200).json({
      message: "Profile updated successfully",
      profile: serialized,
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Profile not found" });
    }
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const sendTestAlert = async (req, res) => {
  const io = req.io;

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: req.user.id },
      select: { username: true },
    });

    if (!profile) return res.status(404).json({ error: "User not found" });

    io.to(profile.username).emit("new-donation", {
      name: "Test Supporter",
      amount: 100,
      message: "This is a test alert! Your overlay is working perfectly.",
      isTest: true,
    });

    res.status(200).json({ message: "Test alert sent!" });
  } catch (err) {
    console.error("Test alert error:", err.message);
    res.status(500).json({ error: "Failed to send test alert" });
  }
};

export const resetDonations = async (req, res) => {
  const io = req.io;

  try {
    const profile = await prisma.profile.update({
      where: { id: req.user.id },
      data: { lastClearedAt: new Date() },
      select: { username: true, lastClearedAt: true },
    });

    if (io && profile.username) {
      io.to(profile.username).emit("stream-reset");
    }

    res.status(200).json({
      message: "Donations reset successfully",
      last_cleared_at: profile.lastClearedAt,
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    console.error("Reset donations error:", err);
    res.status(500).json({ error: "Failed to reset donations" });
  }
};

export const getTopDonations = async (req, res) => {
  const { username } = req.params;

  try {
    const profile = await prisma.profile.findUnique({
      where: { username },
      select: { id: true, lastClearedAt: true },
    });

    if (!profile) {
      return res.status(404).json({ error: "Streamer not found" });
    }

    const donations = await prisma.donation.findMany({
      where: {
        streamerId: profile.id,
        status: "verified",
        ...(profile.lastClearedAt
          ? { createdAt: { gt: profile.lastClearedAt } }
          : {}),
      },
      orderBy: { amount: "desc" },
      take: 5,
    });

    res.status(200).json(donations.map(toDonation));
  } catch (err) {
    console.error("Top donations error:", err);
    res.status(500).json({ error: "Failed to fetch top donations" });
  }
};

export const getRecentDonations = async (req, res) => {
  const { username } = req.params;
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 50);

  try {
    const profile = await prisma.profile.findUnique({
      where: { username },
      select: { id: true, lastClearedAt: true },
    });

    if (!profile) {
      return res.status(404).json({ error: "Streamer not found" });
    }

    const donations = await prisma.donation.findMany({
      where: {
        streamerId: profile.id,
        status: "verified",
        ...(profile.lastClearedAt
          ? { createdAt: { gt: profile.lastClearedAt } }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    res.status(200).json(donations.map(toDonation));
  } catch (err) {
    console.error("Recent donations error:", err);
    res.status(500).json({ error: "Failed to fetch recent donations" });
  }
};
