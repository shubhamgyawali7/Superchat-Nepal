import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();

  // 1. Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // 2. Fetch Profile Data
  const { data: profile, error: pError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (pError) {
    console.error("Error fetching profile for settings:", pError);
  }

  return <SettingsForm initialProfile={profile} />;
}