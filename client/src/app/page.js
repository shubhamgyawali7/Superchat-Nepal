import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/serverApi";
import VideoHero from "@/components/common/VideoHero";
import Icon from "@/components/common/Icon";
import {
  Tv01Icon,
  VolumeHighIcon,
  Mic01Icon,
  Wallet01Icon,
  Radio01Icon,
  PaintBoardIcon,
  CheckmarkCircle01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-900 overflow-x-hidden">
      {/* Full Viewport-Height Looping Video Hero Section */}
      <VideoHero user={user} />

      {/* Metrics & Highlights Section */}
      <section className="relative py-12 px-5 max-w-7xl mx-auto border-b border-zinc-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
            <p className="text-3xl sm:text-4xl font-black text-white font-heading">0%</p>
            <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold mt-1">
              Monthly Platform Fee
            </p>
          </div>
          <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
            <p className="text-3xl sm:text-4xl font-black text-emerald-400 font-heading">&lt; 100ms</p>
            <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold mt-1">
              OBS WebSocket Latency
            </p>
          </div>
          <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
            <p className="text-3xl sm:text-4xl font-black text-violet-400 font-heading">100%</p>
            <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold mt-1">
              Nepali Gateways (eSewa &amp; Khalti)
            </p>
          </div>
        </div>
      </section>

      {/* Interactive OBS Overlay Showcase */}
      <section id="overlay" className="relative py-20 px-5 max-w-7xl mx-auto border-b border-zinc-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-black uppercase tracking-wider text-violet-400">
              Zero Latency WebSocket Alerts
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tight text-white">
              Instant Alerts Directly in OBS Studio
            </h2>
            <p className="text-base text-zinc-400 leading-relaxed font-medium">
              Copy your personal browser source URL into OBS Studio or Streamlabs. Whenever a viewer sends an eSewa or Khalti superchat, your stream celebrates with on-screen donor cards, audio effects, and automatic Text-to-Speech.
            </p>
            <div className="pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3.5 rounded-xl font-black uppercase tracking-wider text-xs transition-colors"
              >
                <span>Set Up Your Overlay</span>
                <Icon icon={ArrowRight01Icon} size={16} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto w-full max-w-md">
              {/* OBS Screen Frame (No shadows, No colored borders) */}
              <div className="relative rounded-2xl bg-zinc-950 border border-zinc-800 p-6">
                {/* Header bar */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800 flex items-center gap-1.5">
                    <Icon icon={Tv01Icon} size={12} className="text-violet-400" />
                    OBS Live Stream
                  </span>
                </div>

                {/* Superchat Alert Card (No shadows, No gradients) */}
                <div className="rounded-xl p-6 bg-zinc-900 border border-zinc-800 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-lg bg-violet-600 text-white flex items-center justify-center font-black">
                    <Icon icon={Tv01Icon} size={24} />
                  </div>

                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400 bg-zinc-950 px-3 py-1 rounded border border-zinc-800">
                      SuperChat Nepal
                    </span>
                    <h3 className="text-2xl font-black uppercase text-white mt-2">
                      Rohan Sharma
                    </h3>
                  </div>

                  <div className="inline-block bg-zinc-950 border border-zinc-800 px-5 py-1.5 rounded-lg text-emerald-400 font-black text-2xl">
                    रू 1,000
                  </div>

                  <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-xs text-zinc-300 italic font-medium leading-relaxed">
                    &ldquo;Bro clutch in the last circle was insane! Keep the streams coming.&rdquo;
                  </div>

                  <div className="flex items-center justify-center gap-3 text-[10px] text-zinc-400 font-mono pt-1">
                    <span className="flex items-center gap-1">
                      <Icon icon={VolumeHighIcon} size={12} />
                      Audio Chime
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Icon icon={Mic01Icon} size={12} />
                      TTS Voice Aloud
                    </span>
                  </div>
                </div>

                {/* Bottom ticker demo */}
                <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-medium">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <Icon icon={CheckmarkCircle01Icon} size={14} className="text-emerald-400" />
                    Instant Verified
                  </span>
                  <span className="text-white font-bold">eSewa • Khalti</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-5 max-w-7xl mx-auto border-b border-zinc-800">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-black uppercase tracking-wider text-violet-400">
            Built for Nepali Creators
          </p>
          <h2 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tight text-white">
            Everything You Need to Stream &amp; Earn
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-medium">
            No complicated merchant verification or overseas PayPal accounts required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl p-8 bg-zinc-950 border border-zinc-800">
            <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-violet-400 mb-6">
              <Icon icon={Wallet01Icon} size={24} />
            </div>
            <h3 className="text-xl font-heading font-black uppercase mb-2 text-white">
              Direct Local Payments
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed font-medium">
              Viewers can send superchats using their everyday eSewa or Khalti balance with QR codes or instant web checkout.
            </p>
          </div>

          <div className="rounded-2xl p-8 bg-zinc-950 border border-zinc-800">
            <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400 mb-6">
              <Icon icon={Radio01Icon} size={24} />
            </div>
            <h3 className="text-xl font-heading font-black uppercase mb-2 text-white">
              Zero-Lag OBS Alerts
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed font-medium">
              Real-time WebSockets send donor alerts directly into your stream screen with pleasant sound chimes and automated speech.
            </p>
          </div>

          <div className="rounded-2xl p-8 bg-zinc-950 border border-zinc-800">
            <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 mb-6">
              <Icon icon={PaintBoardIcon} size={24} />
            </div>
            <h3 className="text-xl font-heading font-black uppercase mb-2 text-white">
              Fully Customizable
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed font-medium">
              Pick your stream colors, upload custom GIFs, tweak animation speeds, and position overlays anywhere on your broadcast.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-5 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Superchat Nepal"
              className="w-7 h-7 rounded-lg object-contain"
            />
            <span className="text-sm font-heading font-black uppercase tracking-wider text-white">
              Superchat Nepal
            </span>
          </div>
          <p className="text-xs text-zinc-500 font-medium">
            Platform built for streamers and gaming creators across Nepal.
          </p>
          <div className="flex items-center gap-6 text-xs text-zinc-400 font-bold uppercase tracking-wider">
            <Link href="/login" className="hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/register" className="hover:text-white transition-colors">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
