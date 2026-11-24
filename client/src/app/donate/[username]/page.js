import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { getCurrentUser, serverFetch } from "@/lib/serverApi";
import { Skeleton } from "@/components/common/Skeleton";
import Icon from "@/components/common/Icon";
import { ArrowLeft01Icon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";

const DonationForm = dynamic(() => import("./DonationForm"), {
  loading: () => (
    <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl space-y-6">
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-14 w-full rounded-xl" />
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
  const isOwner = user?.id === streamer.id;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-12 md:py-20 relative selection:bg-zinc-800">
      {/* Floating Owner Button */}
      {isOwner && (
        <Link
          href="/dashboard"
          className="fixed top-6 left-6 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors z-50 flex items-center gap-2"
        >
          <Icon icon={ArrowLeft01Icon} size={14} />
          <span>Streamer Dashboard</span>
        </Link>
      )}

      {/* Streamer Header */}
      <div className="relative text-center mb-10 max-w-xl z-10 space-y-4">
        {streamer.avatar_url ? (
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
              <Image
                src={streamer.avatar_url}
                alt={streamer.display_name || streamer.username}
                fill
                className="object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center text-3xl font-heading font-black bg-zinc-900 border border-zinc-800 text-white">
            <span>{(streamer.display_name || streamer.username).charAt(0).toUpperCase()}</span>
          </div>
        )}

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-300">
          <Icon icon={CheckmarkCircle01Icon} size={14} className="text-emerald-400" />
          <span>Accepting Superchats</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-heading font-black uppercase tracking-tight text-white">
          {streamer.display_name || streamer.username}
        </h1>

        <p className="text-sm text-zinc-400 font-medium max-w-md mx-auto leading-relaxed">
          {streamer.bio || streamer.welcome_sub || "Support the stream with eSewa or Khalti. Your alert appears on screen instantly."}
        </p>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-xl z-10">
        <DonationForm streamer={streamer} />
      </div>
    </div>
  );
}
