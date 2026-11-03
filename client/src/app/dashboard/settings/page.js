import { redirect } from "next/navigation";
import { getCurrentUser, serverFetch } from "@/lib/serverApi";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const res = await serverFetch("/api/streamer/me");
  if (!res.ok) {
    redirect("/login");
  }

  const profile = await res.json();

  return <SettingsForm initialProfile={profile} />;
}
