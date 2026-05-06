import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import DonationForm from "./DonationForm";

export default async function DonationPage({ params }) {
  const { username } = await params;
  const supabase = await createClient();

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  // 1. Get current logged in user (optional)
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Fetch Streamer Profile
  const { data: streamer, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !streamer) {
    notFound();
  }

  const themeColor = streamer.theme_color || "#f97316";
  const isOwner = user?.id === streamer.id;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center p-4 md:pt-16 pb-20">
      {isOwner && (
        <a
          href="/dashboard"
          className="fixed top-6 left-6 bg-slate-900/50 hover:bg-slate-800 border border-white/10 px-4 py-2 rounded-full text-xs font-bold transition-all z-50 flex items-center gap-2"
        >
          <span>←</span> Back to Dashboard
        </a>
      )}
      {/* Header Section */}
      <div className="text-center mb-10 max-w-2xl">
        {streamer.avatar_url ? (
          <img
            src={streamer.avatar_url}
            alt={streamer.display_name}
            className="w-24 h-24 rounded-full mx-auto mb-6 object-cover shadow-2xl transition-transform hover:scale-110"
            style={{
              border: `4px solid ${themeColor}`,
              boxShadow: `0 0 40px ${themeColor}66`,
            }}
          />
        ) : (
          <div
            className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-black shadow-2xl transition-transform hover:scale-110"
            style={{
              backgroundColor: themeColor,
              boxShadow: `0 0 40px ${themeColor}66`,
            }}
          >
            {streamer.username.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Social Links */}
        {(streamer.youtube_url || streamer.facebook_url) && (
          <div className="mb-6 flex justify-center gap-6 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
            {streamer.youtube_url && (
              <a
                href={streamer.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold uppercase tracking-widest hover:text-red-500 flex items-center gap-1"
              >
                <span>🔴</span> YouTube
              </a>
            )}
            {streamer.facebook_url && (
              <a
                href={streamer.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold uppercase tracking-widest hover:text-blue-500 flex items-center gap-1"
              >
                <span>🔵</span> Facebook
              </a>
            )}
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2 italic">
          {streamer.display_name || streamer.username}
        </h1>
        <p className="text-slate-400 font-medium max-w-md mx-auto">
          {streamer.bio || "Support my stream and send a message!"}
        </p>
      </div>

      <div className="w-full max-w-md relative">
        {/* Glow Effect */}
        <div
          className="absolute -inset-4 blur-[100px] opacity-20 rounded-full"
          style={{ backgroundColor: themeColor }}
        ></div>

        <DonationForm
          streamer={streamer}
          serverUrl={SERVER_URL}
        />
      </div>

      {/* Footer Info */}
      <p className="mt-8 text-[10px] text-slate-600 uppercase tracking-widest">
        Secure payment powered by Superchat Nepal
      </p>
    </div>
  );
}

