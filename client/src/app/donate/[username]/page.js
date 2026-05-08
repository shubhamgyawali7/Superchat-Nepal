import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/server";
import { Skeleton } from "@/components/common/Skeleton";

const DonationForm = dynamic(() => import("./DonationForm"), {
  loading: () => (
    <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] space-y-8 animate-pulse">
      <Skeleton className="h-40 w-full rounded-[2rem]" />
      <Skeleton className="h-16 w-full rounded-2xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-20 w-full rounded-3xl" />
    </div>
  )
});

export default async function DonationPage({ params }) {
  const { username } = await params;
  const supabase = await createClient();

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const { data: { user } } = await supabase.auth.getUser();

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
          <div className="relative w-24 h-24 mx-auto mb-6 group">
            <Image
              src={streamer.avatar_url}
              alt={streamer.display_name || streamer.username}
              fill
              className="rounded-full object-cover shadow-2xl transition-transform group-hover:scale-110"
              style={{
                border: `4px solid ${themeColor}`,
              }}
            />
            <div 
              className="absolute inset-0 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity"
              style={{ backgroundColor: themeColor }}
            ></div>
          </div>
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

