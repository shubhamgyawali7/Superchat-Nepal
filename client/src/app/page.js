import Link from "next/link";
import { getCurrentUser } from "@/lib/serverApi";
import VideoHero from "@/components/common/VideoHero";
import Icon from "@/components/common/Icon";
import {
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  Mic01Icon,
  PaintBoardIcon,
  Radio01Icon,
  Tv01Icon,
  VolumeHighIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <main className="landing-page min-h-screen overflow-x-hidden bg-[#FAF7F1] text-[#1D1D20] selection:bg-orange-200">
      <VideoHero user={user} />

      <section aria-label="Platform facts" className="w-full border-y border-[#E9E4DB] bg-white px-5 py-7 sm:px-[8vw] sm:py-9">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 divide-y divide-[#E9E4DB] text-center sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <Stat value="0%" label="Monthly platform fee" />
          <Stat value="&lt; 100ms" label="OBS alert latency" accent />
          <Stat value="100%" label="Local eSewa &amp; Khalti support" />
        </div>
      </section>

      <section id="how-it-works" className="w-full px-5 py-16 sm:px-[8vw] sm:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-9 max-w-2xl space-y-3">
            <p className="text-sm font-semibold text-[#E8470A]">A simple setup</p>
            <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight text-[#1D1D20] sm:text-4xl">From link to live in three steps.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Step number="01" title="Connect your stream" text="Add your personal browser source to OBS or Streamlabs." detail="OBS browser source" />
            <Step number="02" title="Share your donation link" text="Put your creator page in your stream description and community profiles." detail="eSewa and Khalti / NPR" />
            <Step number="03" title="Celebrate live support" text="Donation alerts appear on stream with optional chimes and text-to-speech." detail="Live overlay alerts" />
          </div>
        </div>
      </section>

      <section id="overlay" className="grid w-full items-center gap-10 bg-[#FFF0DF] px-5 py-16 sm:px-[8vw] sm:py-20 lg:grid-cols-2 lg:gap-16">
        <div className="mx-auto max-w-xl space-y-5 lg:mx-0">
          <p className="text-sm font-semibold text-[#E8470A]">Made for your live stream</p>
          <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight text-[#1D1D20] sm:text-4xl">Good moments deserve a live reaction.</h2>
          <p className="text-base leading-7 text-[#77736C]">
            Add your personal browser source to OBS or Streamlabs. New eSewa and Khalti support appears on stream with alerts, sound, and optional text-to-speech.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 rounded-lg bg-[#FF4D0A] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#E74408]">
            Set up your overlay <Icon icon={ArrowRight01Icon} size={16} />
          </Link>
        </div>
        <ObsPreview />
      </section>

      <section id="features" className="w-full bg-[#FAF7F1] px-5 py-16 sm:px-[8vw] sm:py-20">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="mb-10 max-w-2xl space-y-3">
            <p className="text-sm font-semibold text-[#E8470A]">Built for Nepali creators</p>
            <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight text-[#1D1D20] sm:text-4xl">Everything you need to stream and earn.</h2>
            <p className="text-base leading-7 text-[#77736C]">Simple local payments and thoughtful tools that keep your community close.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Feature icon={Wallet01Icon} title="Direct local payments" text="Viewers support you using eSewa or Khalti with QR codes or quick checkout." />
            <Feature icon={Radio01Icon} title="Live OBS alerts" text="Show every donation on stream with a sound chime and optional spoken message." />
            <Feature icon={PaintBoardIcon} title="Your own style" text="Choose colors, upload GIFs, and tune how your alerts appear on screen." />
          </div>
        </div>
      </section>

      <footer className="w-full border-t border-[#E9E4DB] bg-white px-5 py-10 sm:px-[8vw]">
        <div className="mx-auto grid max-w-[1440px] gap-8 text-sm text-[#77736C] md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-sm">
            <p className="font-heading text-base font-bold text-[#1D1D20]">Superchat <span className="text-[#E8470A]">Nepal</span></p>
            <p className="mt-2 leading-6">Local payments and live donation alerts, made for Nepali streamers.</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="mb-1 font-semibold text-[#1D1D20]">Explore</p>
            <Link href="#features" className="transition-colors hover:text-[#E8470A]">Features</Link>
            <Link href="#how-it-works" className="transition-colors hover:text-[#E8470A]">How it works</Link>
          </div>
          <div className="flex flex-col gap-2">
            <p className="mb-1 font-semibold text-[#1D1D20]">Your account</p>
            <Link href="/login" className="transition-colors hover:text-[#E8470A]">Login</Link>
            <Link href="/register" className="transition-colors hover:text-[#E8470A]">Create account</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Stat({ value, label, accent = false }) {
  return (
    <div className="px-4 py-5 sm:py-2">
      <p className={`font-heading text-3xl font-bold sm:text-4xl ${accent ? "text-[#E8470A]" : "text-[#1D1D20]"}`}>{value}</p>
      <p className="mt-2 text-sm text-[#77736C]">{label}</p>
    </div>
  );
}

function Step({ number, title, text, detail }) {
  return (
    <article className="rounded-xl border border-[#E9E4DB] bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-7">
      <span className="mb-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF0DF] font-heading text-xs font-bold text-[#E8470A]">{number}</span>
      <h3 className="font-heading text-lg font-bold text-[#1D1D20]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#77736C]">{text}</p>
      <p className="mt-5 border-t border-[#F0ECE5] pt-3 text-xs font-semibold text-[#A83A12]">{detail}</p>
    </article>
  );
}

function ObsPreview() {
  return (
    <div className="product-preview mx-auto w-full max-w-2xl rounded-2xl border border-[#E9E4DB] bg-white p-3 shadow-[0_16px_45px_rgba(57,43,22,0.10)] sm:p-4">
      <div className="flex items-center justify-between border-b border-[#E9E4DB] px-2 pb-3 text-xs text-[#77736C]">
        <span className="flex items-center gap-2 font-semibold text-[#1D1D20]"><Icon icon={Tv01Icon} size={15} /> OBS Studio / Browser Source</span>
        <span className="flex items-center gap-1.5 rounded-full bg-[#EAF5ED] px-2.5 py-1 font-semibold text-[#277443]"><span className="h-1.5 w-1.5 rounded-full bg-[#36A263]" /> Connected</span>
      </div>
      <div className="relative mt-3 min-h-[320px] overflow-hidden rounded-xl bg-[#1D1D20] p-4 text-white sm:min-h-[370px] sm:p-6">
        <div className="mb-5 flex items-center justify-between text-[11px] font-medium text-white/65 sm:text-xs">
          <span className="flex items-center gap-2"><span className="rounded bg-[#D83232] px-2 py-0.5 text-[10px] font-bold text-white">LIVE</span> Stream preview</span>
          <span className="hidden sm:inline">Donation event / preview</span>
        </div>
        <div className="relative flex min-h-[235px] items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-[#29292E] p-4 sm:min-h-[280px] sm:p-6">
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-14 border-t border-white/5 bg-[#242428]" />
          <div aria-hidden="true" className="absolute bottom-14 left-[8%] h-16 w-[14%] rounded-t bg-[#35353B]" />
          <div aria-hidden="true" className="absolute bottom-14 right-[10%] h-24 w-[18%] rounded-t bg-[#35353B]" />
          <div className="relative z-10 w-full max-w-sm rounded-xl border border-white/10 bg-[#111113]/95 p-4 text-center shadow-2xl sm:p-5">
            <span className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#FF4D0A] font-heading text-sm font-extrabold text-white">N</span>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">Superchat received</p>
            <h3 className="mt-1 font-heading text-lg font-bold text-white">Rohan Sharma</h3>
            <p className="mt-1 font-heading text-2xl font-extrabold text-[#FF8A50]">NPR 1,000</p>
            <p className="mt-3 rounded-lg bg-white/[0.06] px-3 py-2 text-xs leading-5 text-white/80">&ldquo;Bro, that last circle clutch was insane!&rdquo;</p>
            <div className="mt-3 flex justify-center gap-2"><span className="rounded-md bg-[#FFF0DF] px-2.5 py-1 text-[10px] font-bold text-[#A83A12]">eSewa</span><span className="rounded-md bg-[#FFF0DF] px-2.5 py-1 text-[10px] font-bold text-[#A83A12]">Khalti</span></div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-medium text-white/70 sm:justify-between">
          <span className="flex items-center gap-1.5"><Icon icon={VolumeHighIcon} size={14} /> Audio chime</span>
          <span className="flex items-center gap-1.5"><Icon icon={Mic01Icon} size={14} /> Text-to-speech</span>
          <span className="flex items-center gap-1.5"><Icon icon={CheckmarkCircle01Icon} size={14} /> Payment verified</span>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <article className="group min-h-56 rounded-xl border border-[#E9E4DB] bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F2C7A5] hover:shadow-md sm:p-7">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF0DF] text-[#E8470A]"><Icon icon={icon} size={22} /></div>
      <h3 className="mb-2 font-heading text-lg font-bold text-[#1D1D20]">{title}</h3>
      <p className="max-w-sm text-sm leading-6 text-[#77736C]">{text}</p>
    </article>
  );
}
