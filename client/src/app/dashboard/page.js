import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // 2. Fetch Profile Stats
  const { data: profile, error: pError } = await supabase
    .from("profiles")
    .select("username, total_earnings, last_cleared_at")
    .eq("id", user.id)
    .single();

  // 3. Fetch Recent Donations
  let query = supabase
    .from("donations")
    .select("*")
    .eq("streamer_id", user.id)
    .order("created_at", { ascending: false });

  if (profile?.last_cleared_at) {
    query = query.gt("created_at", profile.last_cleared_at);
  }

  const { data: donations, error: dError } = await query.limit(10);

  // 4. Calculate unique supporters
  const uniqueSupporters = donations ? new Set(donations.map((d) => d.supporter_name)).size : 0;

  const stats = {
    totalEarnings: profile?.total_earnings || 0,
    recentSupporters: uniqueSupporters,
    recentDonations: donations || [],
  };

  const streamerUser = {
    id: user.id,
    email: user.email,
    username: profile?.username || "Streamer",
  };

  const overlayUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/overlay/${streamerUser.username}`;
  const topOverlayUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/overlay/${streamerUser.username}/top`;
  const donationUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/donate/${streamerUser.username}`;

  return (
    <DashboardClient 
      user={streamerUser} 
      stats={stats} 
      serverUrl={process.env.NEXT_PUBLIC_SERVER_URL} 
      overlayUrl={overlayUrl}
      topOverlayUrl={topOverlayUrl}
      donationUrl={donationUrl}
    />
  );
}