import Link from 'next/link';
import { createClient } from "@/utils/supabase/server";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');
        .nav-link { transition: color 0.15s; }
        .nav-link:hover { color: #f97316; }
        .feature-card { transition: border-color 0.2s, transform 0.2s; }
        .feature-card:hover { border-color: #f97316; transform: translateY(-2px); }
        .btn-primary { transition: background 0.15s, transform 0.1s; }
        .btn-primary:active { transform: scale(0.98); }
        .ticker { overflow: hidden; white-space: nowrap; }
        .ticker-inner { display: inline-block; animation: ticker 18s linear infinite; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .tag-pill { font-size: 10px; letter-spacing: 0.12em; }
      `}</style>

      {/* Top bar */}
      <div className="border-b border-surface-border bg-orange-500/5">
        <div className="ticker py-2">
          <div className="ticker-inner text-[11px] text-orange-400/70 tracking-widest">
            &nbsp;&nbsp;&nbsp;SUPERCHAT NEPAL — REAL-TIME DONATIONS — ESEWA · KHALTI — OBS ALERTS — FOR NEPALI STREAMERS &nbsp;&nbsp;&nbsp;
            SUPERCHAT NEPAL — REAL-TIME DONATIONS — ESEWA · KHALTI — OBS ALERTS — FOR NEPALI STREAMERS &nbsp;&nbsp;&nbsp;
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-orange-500 rounded-sm" />
          <span className="text-sm font-bold tracking-widest uppercase" style={{ fontFamily: "'Syne', sans-serif" }}>
            Superchat Nepal
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs tracking-wider text-text-muted">
          {user ? (
            <Link href="/dashboard" className="nav-link bg-orange-500 text-black px-4 py-2 rounded font-bold hover:bg-orange-400">
              Dashboard →
            </Link>
          ) : (
            <>
              <Link href="/login" className="nav-link uppercase">Login</Link>
              <Link href="/register" className="btn-primary bg-orange-500 text-black px-4 py-2 rounded text-xs font-bold uppercase hover:bg-orange-400">
                Start Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-6xl mx-auto px-6 pt-20 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="tag-pill inline-block border border-orange-500/40 text-orange-400 px-3 py-1 rounded-sm mb-6 uppercase tracking-widest">
            🇳🇵 Built for Nepal
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif" }} className="text-4xl lg:text-5xl font-extrabold leading-tight mb-5 tracking-tight">
            Donations.<br />
            Alerts.<br />
            <span className="text-orange-500">Local Gateways.</span>
          </h1>
          <p className="text-sm text-text-muted leading-relaxed mb-8 max-w-md">
            The only superchat platform built for Nepali streamers. Accept payments via eSewa & Khalti, get real-time OBS overlays, and keep more of what you earn.
          </p>
          <div className="flex gap-3">
            <Link href="/register" className="btn-primary bg-orange-500 text-black px-5 py-2.5 rounded text-sm font-bold uppercase tracking-wide hover:bg-orange-400">
              Create Account
            </Link>
            <Link href="/demo" className="btn-primary border border-surface-border text-foreground px-5 py-2.5 rounded text-sm font-bold uppercase tracking-wide hover:border-orange-500/50 hover:text-orange-400">
              Live Demo
            </Link>
          </div>
        </div>

        {/* Stats block */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Payment Methods", value: "eSewa + Khalti", sub: "Local gateways" },
            { label: "Alert Latency", value: "< 100ms", sub: "Via Socket.io" },
            { label: "Platform Fee", value: "Lowest", sub: "In Nepal" },
            { label: "Setup Time", value: "5 min", sub: "No coding needed" },
          ].map((s, i) => (
            <div key={i} className="bg-surface border border-surface-border p-5 rounded-lg">
              <div className="text-[10px] text-text-muted uppercase tracking-widest mb-2">{s.label}</div>
              <div className="text-lg font-bold text-foreground" style={{ fontFamily: "'Syne', sans-serif" }}>{s.value}</div>
              <div className="text-[10px] text-text-muted mt-1">{s.sub}</div>
            </div>
          ))}
        </div>
      </header>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-12 border-t border-surface-border">
        <div className="text-[10px] text-text-muted uppercase tracking-widest mb-8">Core Features</div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: "🇳🇵", title: "Local Gateways", desc: "eSewa & Khalti payments with server-side HMAC-SHA256 verification." },
            { icon: "⚡", title: "Instant OBS Alerts", desc: "Donation pops on your broadcast under 100ms via Socket.io." },
            { icon: "💎", title: "Lower Fees", desc: "Keep more of your earnings with the lowest platform fees available." },
          ].map((f, i) => (
            <div key={i} className="feature-card bg-surface border border-surface-border p-5 rounded-lg">
              <div className="text-xl mb-3">{f.icon}</div>
              <h3 className="text-sm font-bold mb-2 uppercase tracking-wide" style={{ fontFamily: "'Syne', sans-serif" }}>{f.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="max-w-6xl mx-auto px-6 py-10 border-t border-surface-border">
        <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs text-orange-400 uppercase tracking-widest mb-1">Ready to start?</p>
            <p className="text-lg font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Set up your stream in under 5 minutes.</p>
          </div>
          <Link href="/register" className="btn-primary bg-orange-500 text-black px-6 py-2.5 rounded text-sm font-bold uppercase tracking-wide hover:bg-orange-400 shrink-0">
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border px-6 py-6 max-w-6xl mx-auto flex items-center justify-between text-[11px] text-text-muted">
        <span>© {new Date().getFullYear()} Superchat Nepal</span>
        <span>Built for the Nepali Gaming Community 🎮</span>
      </footer>
    </div>

  );
}