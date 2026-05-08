import Link from 'next/link';
import { createClient } from "@/utils/supabase/server";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Top bar */}
      <div className="border-b border-surface-border bg-orange-500/5">
        <div className="ticker py-3">
          <div className="ticker-inner text-sm text-orange-400/70 font-bold tracking-[0.2em] uppercase">
            &nbsp;&nbsp;&nbsp;SUPERCHAT NEPAL — REAL-TIME DONATIONS — ESEWA · KHALTI — OBS ALERTS — FOR NEPALI STREAMERS &nbsp;&nbsp;&nbsp;
            SUPERCHAT NEPAL — REAL-TIME DONATIONS — ESEWA · KHALTI — OBS ALERTS — FOR NEPALI STREAMERS &nbsp;&nbsp;&nbsp;
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-6 container-prof border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg shadow-[0_0_20px_rgba(249,115,22,0.3)]" />
          <span className="text-xl font-heading font-black tracking-tight uppercase">
            Superchat Nepal
          </span>
        </div>
        <div className="flex items-center gap-8 text-sm font-bold tracking-wide">
          {user ? (
            <Link href="/dashboard" className="bg-orange-500 text-black px-6 py-2.5 rounded-xl font-black hover:bg-orange-400 transition-all hover:scale-105 shadow-lg shadow-orange-500/20">
              Dashboard →
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-text-muted hover:text-orange-500 transition-colors uppercase tracking-widest text-[13px]">Login</Link>
              <Link href="/register" className="bg-orange-500 text-black px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[13px] hover:bg-orange-400 transition-all hover:scale-105 shadow-lg shadow-orange-500/20">
                Start Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <header className="container-prof pt-24 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-block border border-orange-500/30 bg-orange-500/5 text-orange-400 px-4 py-1.5 rounded-full text-xs font-bold mb-8 uppercase tracking-[0.2em]">
            🇳🇵 Built for Nepal
          </div>
          <h1 className="text-6xl lg:text-8xl font-heading font-black leading-[0.9] mb-8 tracking-tighter">
            Donations.<br />
            Alerts.<br />
            <span className="text-orange-500">Local.</span>
          </h1>
          <p className="text-lg text-text-muted leading-relaxed mb-10 max-w-lg font-medium opacity-80">
            The only superchat platform built for Nepali streamers. Accept payments via eSewa & Khalti, get real-time OBS overlays, and keep more of what you earn.
          </p>
          <div className="flex gap-4">
            <Link href="/register" className="bg-orange-500 text-black px-8 py-4 rounded-2xl text-base font-black uppercase tracking-wider hover:bg-orange-400 transition-all hover:scale-105 shadow-xl shadow-orange-500/20">
              Create Account
            </Link>
            <Link href="/demo" className="border-2 border-surface-border text-foreground px-8 py-4 rounded-2xl text-base font-black uppercase tracking-wider hover:border-orange-500/50 hover:text-orange-400 transition-all">
              Live Demo
            </Link>
          </div>
        </div>

        {/* Stats block */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Payment Methods", value: "eSewa + Khalti", sub: "Local gateways" },
            { label: "Alert Latency", value: "< 100ms", sub: "Via Socket.io" },
            { label: "Platform Fee", value: "Lowest", sub: "In Nepal" },
            { label: "Setup Time", value: "5 min", sub: "No coding needed" },
          ].map((s, i) => (
            <div key={i} className="bg-surface/50 backdrop-blur-sm border border-surface-border p-8 rounded-[2rem] hover:border-orange-500/20 transition-colors group">
              <div className="text-xs text-text-muted uppercase font-bold tracking-widest mb-3 opacity-50 group-hover:opacity-100 transition-opacity">{s.label}</div>
              <div className="text-2xl font-heading font-black text-foreground mb-1">{s.value}</div>
              <div className="text-sm text-text-muted font-medium">{s.sub}</div>
            </div>
          ))}
        </div>
      </header>

      {/* Features */}
      <section className="container-prof section-prof border-t border-surface-border">
        <div className="text-xs text-text-muted uppercase font-bold tracking-[0.3em] mb-12 opacity-50">Core Features</div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: "🇳🇵", title: "Local Gateways", desc: "eSewa & Khalti payments with server-side HMAC-SHA256 verification." },
            { icon: "⚡", title: "Instant OBS Alerts", desc: "Donation pops on your broadcast under 100ms via Socket.io." },
            { icon: "💎", title: "Lower Fees", desc: "Keep more of your earnings with the lowest platform fees available." },
          ].map((f, i) => (
            <div key={i} className="bg-surface/40 border border-surface-border p-8 rounded-[2rem] hover:border-orange-500/20 transition-all hover:-translate-y-1">
              <div className="text-4xl mb-6">{f.icon}</div>
              <h3 className="text-xl font-heading font-black mb-3 uppercase tracking-tight">{f.title}</h3>
              <p className="text-base text-text-muted leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="container-prof pb-24">
        <div className="bg-linear-to-r from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-sm text-orange-400 font-bold uppercase tracking-[0.3em] mb-3">Ready to start?</p>
            <p className="text-3xl font-heading font-black leading-tight">Set up your stream in under 5 minutes.</p>
          </div>
          <Link href="/register" className="bg-orange-500 text-black px-10 py-5 rounded-2xl text-lg font-black uppercase tracking-wider hover:bg-orange-400 transition-all hover:scale-105 shadow-2xl shadow-orange-500/20 shrink-0">
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border py-10 container-prof flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-text-muted font-bold tracking-wide">
        <div className="flex items-center gap-4">
          <div className="w-5 h-5 bg-orange-500/20 rounded" />
          <span>© {new Date().getFullYear()} Superchat Nepal</span>
        </div>
        <span className="uppercase tracking-widest text-xs opacity-50">Built for the Nepali Gaming Community 🎮</span>
      </footer>
    </div>

  );
}