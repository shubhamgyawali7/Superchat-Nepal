import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/serverApi";

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-[#070a13] text-white selection:bg-orange-500/30 overflow-x-hidden">
      {/* Dynamic Background Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-orange-600/10 blur-[130px] animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] rounded-full bg-indigo-600/10 blur-[150px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-emerald-600/10 blur-[140px]" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.08] bg-[#070a13]/70">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-all">
              <Image
                src="/logo.png"
                alt="Superchat Nepal"
                width={36}
                height={36}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <span className="text-xl font-heading font-black tracking-tight uppercase">
              Superchat <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">Nepal</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-slate-400">
            <Link href="#features" className="hover:text-orange-400 transition-colors">Features</Link>
            <Link href="#gateways" className="hover:text-orange-400 transition-colors">eSewa &amp; Khalti</Link>
            <Link href="#overlay" className="hover:text-orange-400 transition-colors">OBS Overlay</Link>
            <Link href="#faq" className="hover:text-orange-400 transition-colors">FAQ</Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black px-5 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs transition-all shadow-lg shadow-orange-500/20 hover:scale-105"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-block text-xs font-black uppercase tracking-wider text-slate-300 hover:text-white px-4 py-2 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black px-5 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs transition-all shadow-lg shadow-orange-500/20 hover:scale-105"
                >
                  Start Streaming Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-5 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 rounded-full backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-orange-400">
                Live Monetization for Nepali Streamers 🇳🇵
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-heading font-black leading-[1.08] tracking-tight uppercase">
              Turn Live Streams into <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400">
                Instant Income.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 font-medium leading-relaxed max-w-2xl">
              Accept superchats with <strong className="text-white">eSewa</strong> &amp; <strong className="text-white">Khalti</strong>. Get instantaneous OBS sound alerts, on-screen donor popups, and automated Text-to-Speech without PayPal restrictions.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/register"
                className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 hover:from-orange-400 hover:to-amber-400 text-black px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-wider text-center shadow-xl shadow-orange-500/25 transition-all hover:scale-105 active:scale-95"
              >
                Create Streamer Page Free
              </Link>
              <Link
                href="#overlay"
                className="border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white px-7 py-4 rounded-2xl text-sm font-black uppercase tracking-wider text-center transition-all"
              >
                See Live OBS Demo
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/[0.08]">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white font-heading">0%</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Monthly Fee</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-heading">&lt; 100ms</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">OBS Latency</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-orange-400 font-heading">100%</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Nepali Gateways</p>
              </div>
            </div>
          </div>

          {/* Right Live Overlay Preview Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto w-full max-w-md animate-float">
              {/* Outer Glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-500/30 to-purple-500/30 blur-2xl opacity-70" />

              {/* OBS Screen Frame */}
              <div className="relative rounded-3xl bg-[#0c1220] border border-white/10 p-6 shadow-2xl backdrop-blur-2xl">
                {/* Header bar */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
                    🔴 OBS Live Stream
                  </span>
                </div>

                {/* Animated Superchat Alert Card */}
                <div className="rounded-2xl p-6 bg-gradient-to-b from-[#141b2d] to-[#0c1220] border border-orange-500/40 shadow-2xl text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-3xl shadow-lg shadow-orange-500/30 animate-bounce">
                    🎉
                  </div>

                  <div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-0.5 rounded-full border border-orange-500/20">
                      SuperChat Nepal
                    </span>
                    <h3 className="text-2xl font-black uppercase text-white mt-2">
                      Rohan Sharma
                    </h3>
                  </div>

                  <div className="inline-block bg-emerald-500/15 border border-emerald-400/30 px-5 py-1.5 rounded-xl text-emerald-400 font-black text-2xl shadow-inner">
                    रू 1,000
                  </div>

                  <div className="bg-white/[0.04] border border-white/10 p-3 rounded-xl text-xs text-slate-200 italic font-medium leading-relaxed">
                    &ldquo;Bro clutch in the last circle was insane! Keep the streams coming 🔥&rdquo;
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-mono pt-1">
                    <span>🔊 Audio Chime</span>
                    <span>•</span>
                    <span>🗣️ TTS Voice Aloud</span>
                  </div>
                </div>

                {/* Bottom ticker demo */}
                <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    eSewa Instant Verified
                  </span>
                  <span className="text-white font-bold">eSewa • Khalti</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-5 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-black uppercase tracking-widest text-orange-400">Built for Nepali Creators</p>
          <h2 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tight">
            Everything You Need to Stream &amp; Earn
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-medium">
            No complicated merchant verification or overseas PayPal accounts required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl p-8 bg-[#0c1220] border border-white/[0.08] hover:border-orange-500/30 transition-all hover:-translate-y-1 group">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              🇳🇵
            </div>
            <h3 className="text-xl font-heading font-black uppercase mb-2">Direct Local Payments</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Viewers can send superchats using their everyday eSewa or Khalti balance with QR codes or instant web checkout.
            </p>
          </div>

          <div className="rounded-3xl p-8 bg-[#0c1220] border border-white/[0.08] hover:border-orange-500/30 transition-all hover:-translate-y-1 group">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              ⚡
            </div>
            <h3 className="text-xl font-heading font-black uppercase mb-2">Zero-Lag OBS Alerts</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Real-time WebSockets send donor alerts directly into your stream screen with pleasant sound chimes and automated speech.
            </p>
          </div>

          <div className="rounded-3xl p-8 bg-[#0c1220] border border-white/[0.08] hover:border-orange-500/30 transition-all hover:-translate-y-1 group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              🎨
            </div>
            <h3 className="text-xl font-heading font-black uppercase mb-2">Fully Customizable</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Pick your stream colors, upload custom GIFs, tweak animation speeds, and position overlays anywhere on your broadcast.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-5 border-t border-white/[0.08] bg-[#050810]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Superchat Nepal"
              className="w-7 h-7 rounded-lg object-contain shadow-sm"
            />
            <span className="text-sm font-heading font-black uppercase tracking-wider">
              Superchat Nepal
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Made with ❤️ for streamers and gaming creators across Nepal.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-400 font-bold uppercase tracking-wider">
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
