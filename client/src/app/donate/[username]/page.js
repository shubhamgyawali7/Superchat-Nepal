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
  const themeColor = streamer.theme_color || streamer.themeColor || "#FF4D0A";

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f4ee] px-4 py-8 text-[#211d1a] selection:bg-orange-200 sm:px-6 sm:py-12">
      <div
        className="pointer-events-none fixed -right-24 top-28 h-72 w-72 rounded-full blur-3xl transition-colors duration-300"
        style={{ backgroundColor: themeColor, opacity: 0.2 }}
        aria-hidden="true"
      />
      <div className="pointer-events-none fixed -left-32 bottom-0 h-80 w-80 rounded-full bg-amber-100/70 blur-3xl" aria-hidden="true" />
      {/* Floating Owner Button */}
      {isOwner && (
        <Link
          href="/dashboard"
          className="fixed left-4 top-4 z-50 flex items-center gap-2 rounded-full border border-[#e8dfd3] bg-white/90 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-[#413830] shadow-sm backdrop-blur transition hover:border-orange-300 hover:text-orange-700 sm:left-6 sm:top-6"
        >
          <Icon icon={ArrowLeft01Icon} size={14} />
          <span>Streamer Dashboard</span>
        </Link>
      )}

      {/* Streamer Header */}
      <section className="relative z-10 mx-auto mb-8 max-w-2xl space-y-4 text-center sm:mb-10">
        {streamer.avatar_url ? (
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="relative h-full w-full overflow-hidden rounded-2xl border-4 border-white bg-[#fffaf2] shadow-lg shadow-black/10">
              <Image
                src={streamer.avatar_url}
                alt={streamer.display_name || streamer.username}
                fill
                className="object-cover"
              />
            </div>
          </div>
        ) : (
          <div
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white text-3xl font-heading font-extrabold text-white shadow-lg transition-colors duration-300"
            style={{ backgroundColor: themeColor }}
          >
            <span>{(streamer.display_name || streamer.username).charAt(0).toUpperCase()}</span>
          </div>
        )}

        <div
          className="inline-flex items-center gap-1.5 rounded-full border bg-white/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em]"
          style={{ borderColor: `${themeColor}40`, color: themeColor }}
        >
          <Icon icon={CheckmarkCircle01Icon} size={14} className="text-emerald-600" />
          <span>Accepting Superchats</span>
        </div>

        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-[#211d1a] sm:text-4xl">
          {streamer.display_name || streamer.username}
        </h1>

        <p className="mx-auto max-w-lg text-sm leading-6 text-[#71675e] sm:text-base">
          {streamer.bio || streamer.welcome_sub || "Support the stream with eSewa or Khalti. Your alert appears on screen instantly."}
        </p>
      </section>

      {/* Form Container */}
      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <DonationForm streamer={streamer} />
      </div>
      <footer className="relative z-10 mx-auto mt-10 max-w-5xl border-t border-[#e8e1d7] pt-5 text-center text-xs text-[#81776d]">
        Secure local payments · Made for Nepal’s creator community
      </footer>
    </main>
  );
}
