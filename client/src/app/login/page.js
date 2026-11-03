"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, error: authError } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const result = await login(formData.email, formData.password);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-white flex items-center justify-center px-4 py-12 relative overflow-hidden selection:bg-orange-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-orange-600/15 blur-[140px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-600/15 blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mb-8 justify-center group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Superchat Nepal"
            className="w-10 h-10 rounded-xl object-contain shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-all"
          />
          <span className="text-xl font-heading font-black tracking-tight uppercase">
            Superchat <span className="text-orange-500">Nepal</span>
          </span>
        </Link>

        {/* Card */}
        <div className="bg-[#0c1220]/90 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-white mb-2">
              Streamer Sign In
            </h2>
            <p className="text-sm text-slate-400 font-medium">
              Access your real-time OBS overlays, earnings, and donations.
            </p>
          </div>

          {(error || authError) && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-xs font-bold text-red-400 flex items-center gap-2">
              <span>⚠️</span>
              <span>{error || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium text-white placeholder-slate-600 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
                placeholder="streamer@example.com"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium text-white placeholder-slate-600 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
                placeholder="••••••••"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 hover:from-orange-400 hover:to-amber-400 text-black py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In to Stream"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/[0.08] text-center">
            <p className="text-xs text-slate-400 font-medium">
              Don&apos;t have a creator account?{" "}
              <Link href="/register" className="text-orange-400 hover:text-orange-300 font-bold ml-1">
                Register Free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
