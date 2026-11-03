import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { getCurrentUser, serverFetch } from "@/lib/serverApi";
import { Skeleton } from "@/components/common/Skeleton";

const DonationForm = dynamic(() => import("./DonationForm"), {
  loading: () => (
    <div className="bg-[#0c1220] border border-white/10 p-8 rounded-3xl space-y-6 animate-pulse">
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-14 w-full rounded-2xl" />
    </div>
  ),
});

export default async function DonationPage({ params }) {
  const { username } = await params;
  const user = await getCurrentUser();

  const res = await serverFetch(
    `/api/streamer/profile/${encodeURIComponent(username)}`
  );

  if (!res.ok) {
    notFound();
  }

  const streamer = await res.json();
  const themeColor = streamer.theme_color || "#ff5500";
  const isOwner = user?.id === streamer.id;

  return (
    <div className="min-h-screen bg-[#070a13] text-white flex flex-col items-center px-4 py-12 md:py-20 relative overflow-x-hidden selection:bg-orange-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[140px] opacity-25"
          style={{ backgroundColor: themeColor }}
        />
        <div
          className="absolute bottom-10 -right-32 w-96 h-96 rounded-full blur-[140px] opacity-20"
          style={{ backgroundColor: themeColor }}
        />
      </div>

      {/* Floating Owner Button */}
      {isOwner && (
        <Link
          href="/dashboard"
          className="fixed top-6 left-6 bg-[#0c1220]/90 hover:bg-[#141b2d] border border-white/10 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all z-50 flex items-center gap-2 backdrop-blur-md shadow-xl"
        >
          <span>←</span> Streamer Dashboard
        </Link>
      )}

      {/* Streamer Header Hero */}
      <div className="relative text-center mb-10 max-w-xl z-10 space-y-4">
        {streamer.avatar_url ? (
          <div className="relative w-28 h-28 mx-auto mb-4">
            <div
              className="absolute inset-0 rounded-full blur-2xl opacity-50 animate-pulse"
              style={{ backgroundColor: themeColor }}
            />
            <div className="relative w-full h-full rounded-full p-1 bg-white/10 backdrop-blur-sm overflow-hidden border-2 border-white/20">
              <Image
                src={streamer.avatar_url}
                alt={streamer.display_name || streamer.username}
                fill
                className="rounded-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div
            className="w-24 h-24 rounded-3xl mx-auto flex items-center justify-center text-4xl font-heading font-black shadow-2xl relative border-2 border-white/20"
            style={{
              background: `linear-gradient(135deg, ${themeColor} 0%, #0c1220 100%)`,
            }}
          >
            <span>{(streamer.display_name || streamer.username).charAt(0).toUpperCase()}</span>
          </div>
        )}

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/[0.05] border border-white/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Accepting Superchats</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-heading font-black uppercase tracking-tight text-white">
          {streamer.display_name || streamer.username}
        </h1>

        <p className="text-sm sm:text-base text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
          {streamer.bio || streamer.welcome_sub || "Support the stream with eSewa or Khalti. Your alert appears on screen instantly!"}
        </p>

        {/* Social Links */}
        {(streamer.youtube_url || streamer.facebook_url) && (
          <div className="flex justify-center gap-3 pt-2">
            {streamer.youtube_url && (
              <a
                href={streamer.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-red-400 transition-all flex items-center gap-2"
              >
                <span>📺</span> YouTube
              </a>
            )}
            {streamer.facebook_url && (
              <a
                href={streamer.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-blue-400 transition-all flex items-center gap-2"
              >
                <span>🔵</span> Facebook
              </a>
            )}
          </div>
        )}
      </div>

      {/* Main Form */}
      <div className="w-full max-w-lg relative z-10">
        <DonationForm streamer={streamer} />
      </div>

      {/* Footer Branding */}
      <div className="mt-16 text-center text-xs text-slate-500 font-medium space-y-1">
        <p className="uppercase tracking-widest text-[10px] font-bold text-slate-600">
          Powered by SuperChat Nepal 🇳🇵
        </p>
        <p>Live alerts, instant payouts, and zero creator commission fees.</p>
      </div>
    </div>
  );
}
