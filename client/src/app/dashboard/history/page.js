import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser, serverFetch } from "@/lib/serverApi";
import HistoryClient from "./HistoryClient";

export default async function HistoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const res = await serverFetch("/api/streamer/donations");
  const donations = res.ok ? await res.json() : [];

  return (
    <HistoryClient
      donations={donations}
      username={user.username || "streamer"}
    />
  );
}
