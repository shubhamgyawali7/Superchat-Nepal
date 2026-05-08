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
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center p-6 md:pt-32 pb-32 overflow-x-hidden selection:bg-orange-500/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[150px] opacity-20 animate-pulse"
          style={{ backgroundColor: themeColor }}
        ></div>
        <div 
          className="absolute top-[40%] -right-[5%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-10"
          style={{ backgroundColor: themeColor }}
        ></div>
      </div>

      {isOwner && (
        <Link
          href="/dashboard"
          className="fixed top-8 left-8 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all z-50 flex items-center gap-3 backdrop-blur-md group shadow-2xl"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span> Back to Dashboard
        </Link>
      )}

      {/* Header Section */}
      <div className="relative text-center mb-20 max-w-2xl z-10">
        {streamer.avatar_url ? (
          <div className="relative w-32 h-32 mx-auto mb-10 group">
            <div 
              className="absolute inset-0 rounded-full blur-3xl opacity-40 scale-125 transition-opacity group-hover:opacity-60"
              style={{ backgroundColor: themeColor }}
            ></div>
            <div className="relative w-full h-full rounded-full p-1.5 bg-white/10 backdrop-blur-sm overflow-hidden border border-white/20">
              <Image
                src={streamer.avatar_url}
                alt={streamer.display_name || streamer.username}
                fill
                className="rounded-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
              />
            </div>
          </div>
        ) : (
          <div
            className="w-32 h-32 rounded-full mx-auto mb-10 flex items-center justify-center text-6xl font-heading font-black shadow-2xl relative group overflow-hidden border-4 border-white/10"
            style={{ backgroundColor: themeColor }}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <span className="relative z-10">{streamer.username.charAt(0).toUpperCase()}</span>
          </div>
        )}

        {/* Social Badges */}
        {(streamer.youtube_url || streamer.facebook_url) && (
          <div className="mb-10 flex justify-center gap-4">
            {streamer.youtube_url && (
              <a
                href={streamer.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest text-red-400 transition-all flex items-center gap-3 shadow-lg shadow-red-500/5"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> YouTube
              </a>
            )}
            {streamer.facebook_url && (
              <a
                href={streamer.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest text-blue-400 transition-all flex items-center gap-3 shadow-lg shadow-blue-500/5"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500"></div> Facebook
              </a>
            )}
          </div>
        )}

        <h1 className="text-6xl md:text-8xl font-heading font-black uppercase tracking-tighter mb-6 leading-[0.9]">
          {streamer.display_name || streamer.username}
        </h1>
        <p className="text-lg text-text-muted font-medium max-w-lg mx-auto leading-relaxed opacity-70">
          {streamer.bio || "Supporting the stream and sharing the love with a superchat."}
        </p>
      </div>

      <div className="w-full max-w-xl relative z-10 px-4">
        <DonationForm
          streamer={streamer}
          serverUrl={SERVER_URL}
        />
      </div>

      {/* Trust Footer */}
      <div className="mt-24 flex flex-col items-center gap-6 opacity-30 group cursor-default">
        <div className="flex items-center gap-8">
          <div className="h-[1px] w-16 bg-white/20"></div>
          <span className="text-xs font-black uppercase tracking-[0.5em] transition-all group-hover:tracking-[0.7em]">SuperChat Nepal</span>
          <div className="h-[1px] w-16 bg-white/20"></div>
        </div>
        <p className="text-[11px] font-bold text-center max-w-sm uppercase tracking-[0.2em] leading-loose">
          All transactions are encrypted and processed through official gateways.
        </p>
      </div>
    </div>
  );
}

