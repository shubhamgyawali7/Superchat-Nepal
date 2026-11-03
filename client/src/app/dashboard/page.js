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
