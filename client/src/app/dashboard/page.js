import { redirect } from "next/navigation";
import { getCurrentUser, serverFetch } from "@/lib/serverApi";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const res = await serverFetch("/api/streamer/dashboard");
  if (!res.ok) {
    redirect("/login");
  }

  const data = await res.json();

  const stats = {
    totalEarnings: data.totalEarnings || 0,
    recentSupporters: data.supporterCount || 0,
    recentDonations: data.recentDonations || [],
  };

  const streamerUser = {
    id: user.id,
    email: user.email,
    username: data.username || user.username || "Streamer",
  };

  const clientBase = process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000";
  const overlayUrl = `${clientBase}/overlay/${streamerUser.username}`;
  const topOverlayUrl = `${clientBase}/overlay/${streamerUser.username}/top`;
  const recentOverlayUrl = `${clientBase}/overlay/${streamerUser.username}/recent`;
  const donationUrl = `${clientBase}/donate/${streamerUser.username}`;

  return (
    <DashboardClient
      user={streamerUser}
      stats={stats}
      serverUrl={process.env.NEXT_PUBLIC_SERVER_URL}
      overlayUrl={overlayUrl}
      topOverlayUrl={topOverlayUrl}
      recentOverlayUrl={recentOverlayUrl}
      donationUrl={donationUrl}
    />
  );
}
