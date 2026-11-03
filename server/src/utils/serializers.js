export const toProfile = (profile) => {
  if (!profile) return null;
  return {
    id: profile.id,
    username: profile.username,
    display_name: profile.displayName,
    bio: profile.bio,
    avatar_url: profile.avatarUrl,
    theme_color: profile.themeColor,
    welcome_title: profile.welcomeTitle,
    welcome_sub: profile.welcomeSub,
    youtube_url: profile.youtubeUrl,
    facebook_url: profile.facebookUrl,
    upi_id: profile.upiId,
    alert_min_amount: profile.alertMinAmount,
    alert_duration: profile.alertDuration,
    alert_gif_url: profile.alertGifUrl,
    alert_font_family: profile.alertFontFamily,
    alert_text_color: profile.alertTextColor,
    alert_amount_color: profile.alertAmountColor,
    alert_message_color: profile.alertMessageColor,
    alert_bg_color: profile.alertBgColor,
    alert_border_color: profile.alertBorderColor,
    alert_position: profile.alertPosition,
    alert_animation: profile.alertAnimation,
    tts_enabled: profile.ttsEnabled,
    tts_rate: profile.ttsRate,
    recent_donations_position: profile.recentDonationsPosition,
    recent_donations_count: profile.recentDonationsCount,
    total_earnings: profile.totalEarnings,
    last_cleared_at: profile.lastClearedAt,
    created_at: profile.createdAt,
    ...(profile.email ? { email: profile.email } : {}),
  };
};

export const toPublicProfile = (profile) => {
  if (!profile) return null;
  const serialized = toProfile(profile);
  delete serialized.total_earnings;
  delete serialized.email;
  delete serialized.created_at;
  return serialized;
};

export const toDonation = (donation) => {
  if (!donation) return null;
  return {
    id: donation.id,
    streamer_id: donation.streamerId,
    supporter_name: donation.supporterName,
    amount: donation.amount,
    message: donation.message,
    payment_gateway: donation.paymentGateway,
    status: donation.status,
    transaction_id: donation.transactionId,
    gateway_response: donation.gatewayResponse,
    created_at: donation.createdAt,
  };
};
