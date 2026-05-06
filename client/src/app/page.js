import Link from 'next/link';
import { createClient } from "@/utils/supabase/server";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold bg-linear-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
          Superchat Nepal
        </h1>
        <div className="flex items-center space-x-6">
          {user ? (
            <Link href="/dashboard" className="bg-slate-900 border border-slate-800 hover:border-orange-500/50 px-5 py-2 rounded-full font-medium transition">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="hover:text-orange-500 transition">Login</Link>
              <Link href="/register" className="bg-orange-600 hover:bg-orange-700 px-5 py-2 rounded-full font-medium transition">
                Start Earning
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center text-center px-4 py-20 lg:py-32 max-w-4xl mx-auto">
        <span className="bg-orange-500/10 text-orange-500 border border-orange-500/20 px-4 py-1 rounded-full text-sm mb-6">
          The #1 Donation Platform for Nepali Streamers
        </span>
        <h2 className="text-5xl lg:text-7xl font-extrabold mb-6 tracking-tight">
          Support your favorite streamers with <span className="text-orange-500">eSewa & Khalti</span>
        </h2>
        <p className="text-gray-400 text-xl mb-10 max-w-2xl">
          Real-time alerts, local payment gateways, and zero-hassle setups. 
          Built specifically for the gaming community in Nepal.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register" className="px-8 py-4 bg-orange-600 hover:bg-orange-700 rounded-lg text-lg font-bold shadow-lg shadow-orange-600/20 transition-all">
            Create Your Account
          </Link>
          <Link href="/demo" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-lg font-bold transition-all">
            View Live Demo
          </Link>
        </div>
      </header>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-8 py-20 border-t border-slate-900">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <div className="text-3xl mb-4">🇳🇵</div>
            <h3 className="text-xl font-bold mb-2">Local Gateways</h3>
            <p className="text-gray-400">Accept payments via eSewa, Khalti, and ConnectIPS directly to your wallet.</p>
          </div>
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Instant Alerts</h3>
            <p className="text-gray-400">Low-latency OBS overlays that show donations the second they happen.</p>
          </div>
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <div className="text-3xl mb-4">💎</div>
            <h3 className="text-xl font-bold mb-2">Lower Fees</h3>
            <p className="text-gray-400">Keep more of your hard-earned money with the lowest platform fees in Nepal.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-gray-500 text-sm border-t border-slate-900">
        <p>&copy; {new Date().getFullYear()} Superchat Nepal. All rights reserved.</p>
      </footer>
    </div>
  );
}