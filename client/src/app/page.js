import Link from 'next/link';
import { createClient } from "@/utils/supabase/server";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-orange-500/30 font-sans overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-orange-600/5 blur-[120px]"></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#020617]/50">
        <div className="max-w-[1200px] mx-auto px-5 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-orange-500 rounded-lg shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform flex items-center justify-center font-black text-black text-sm">
              SN
            </div>
            <span className="text-xl font-heading font-black tracking-tight uppercase">
              Superchat <span className="text-orange-500">Nepal</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10 text-sm font-bold uppercase tracking-widest text-white/50">
            <Link href="#features" className="hover:text-orange-500 transition-colors">Features</Link>
            <Link href="#fees" className="hover:text-orange-500 transition-colors">Fees</Link>
            <Link href="#integrations" className="hover:text-orange-500 transition-colors">Integrations</Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard" className="bg-white text-black px-6 py-2.5 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-orange-500 transition-all shadow-xl shadow-white/5">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block text-sm font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors mr-2">Login</Link>
                <Link href="/register" className="bg-orange-500 text-black px-6 py-2.5 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-orange-400 transition-all shadow-xl shadow-orange-500/20">
                  Join
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-5 max-w-[1200px] mx-auto">
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-3 border border-orange-500/20 bg-orange-500/5 px-4 py-2 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="text-sm font-bold uppercase tracking-widest text-orange-400">Streamer Monetization</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-heading font-black leading-[1.1] tracking-tighter uppercase">
            Accept Donations <br />
            <span className="text-orange-500">Instantly in Nepal.</span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 font-medium leading-relaxed">
            Connect your stream to <span className="text-white">eSewa</span> and <span className="text-white">Khalti</span>. Get real-time OBS alerts without the PayPal hassle.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link href="/register" className="w-full sm:w-auto bg-orange-500 text-black px-10 py-4 rounded-xl text-base font-bold uppercase tracking-widest hover:bg-orange-400 transition-all shadow-xl shadow-orange-500/20">
              Start Earning
            </Link>
            <Link href="#features" className="w-full sm:w-auto border border-white/10 bg-white/5 text-white px-10 py-4 rounded-xl text-base font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-5 max-w-[1200px] mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Local Gateways", desc: "Native support for eSewa and Khalti. No international banking required.", icon: "🇳🇵" },
            { title: "Real-time Alerts", desc: "Instant OBS overlays triggered by donations. Latency under 100ms.", icon: "⚡" },
            { title: "Dashboard Tools", desc: "Manage your revenue, view history, and customize your overlay.", icon: "📊" },
          ].map((f, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/10 p-10 rounded-2xl hover:border-orange-500/20 transition-all group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
              <h3 className="text-xl font-heading font-black mb-3 uppercase tracking-tight">{f.title}</h3>
              <p className="text-base text-white/50 font-medium leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fees Section */}
      <section id="fees" className="py-20 px-5 max-w-[1200px] mx-auto border-t border-white/5">
        <div className="bg-linear-to-br from-orange-500/10 to-transparent border border-orange-500/20 p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-lg space-y-4">
            <h2 className="text-4xl font-heading font-black uppercase tracking-tight leading-none">Simple, <br /> Transparent Fees.</h2>
            <p className="text-lg text-white/50 font-medium">Keep more of what you earn. We only charge a small platform fee to keep the servers running.</p>
          </div>
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-10 rounded-2xl text-center min-w-[240px]">
            <div className="text-sm font-bold uppercase tracking-widest text-orange-500 mb-2">Platform Fee</div>
            <div className="text-6xl font-heading font-black">5%</div>
            <div className="text-sm font-bold uppercase tracking-widest text-white/30 mt-4">Per Transaction</div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="py-20 px-5 max-w-[1200px] mx-auto border-t border-white/5 text-center">
        <h2 className="text-3xl font-heading font-black uppercase tracking-tight mb-16">Seamless Integrations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 grayscale opacity-40 hover:grayscale-0 transition-all duration-700">
          <div className="p-8 border border-white/5 rounded-2xl bg-white/[0.01] font-black uppercase tracking-widest">eSewa</div>
          <div className="p-8 border border-white/5 rounded-2xl bg-white/[0.01] font-black uppercase tracking-widest">Khalti</div>
          <div className="p-8 border border-white/5 rounded-2xl bg-white/[0.01] font-black uppercase tracking-widest">OBS Studio</div>
          <div className="p-8 border border-white/5 rounded-2xl bg-white/[0.01] font-black uppercase tracking-widest">Streamlabs</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 pb-12 px-5 border-t border-white/5 bg-black/20">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-orange-500 rounded-md" />
                <span className="text-lg font-heading font-black tracking-tight uppercase">SN</span>
              </div>
              <p className="text-sm text-white/40 font-medium leading-relaxed max-w-xs">
                Empowering the next generation of Nepali creators with professional monetization and alert tools.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/80">Platform</h4>
              <div className="flex flex-col gap-4 text-sm font-bold text-white/40">
                <Link href="#features" className="hover:text-orange-500 transition-colors">Features</Link>
                <Link href="#fees" className="hover:text-orange-500 transition-colors">Fees</Link>
                <Link href="#integrations" className="hover:text-orange-500 transition-colors">Integrations</Link>
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/80">Support</h4>
              <div className="flex flex-col gap-4 text-sm font-bold text-white/40">
                <Link href="#" className="hover:text-orange-500 transition-colors">Documentation</Link>
                <Link href="#" className="hover:text-orange-500 transition-colors">Help Center</Link>
                <Link href="#" className="hover:text-orange-500 transition-colors">Contact Us</Link>
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/80">Legal</h4>
              <div className="flex flex-col gap-4 text-sm font-bold text-white/40">
                <Link href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-orange-500 transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm font-bold uppercase tracking-widest text-white/20">
              © {new Date().getFullYear()} Superchat Nepal
            </p>
            <div className="flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-white/20">
              <span>Built in Nepal 🇳🇵</span>
              <div className="flex gap-4">
                <span className="hover:text-white transition-colors cursor-pointer">Twitter</span>
                <span className="hover:text-white transition-colors cursor-pointer">Discord</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}