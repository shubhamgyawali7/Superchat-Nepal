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
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-4 font-sans selection:bg-orange-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[50%] h-[50%] rounded-full blur-[150px] opacity-10 bg-orange-500/20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] rounded-full blur-[120px] opacity-5 bg-orange-500/10"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 mb-12 justify-center group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Superchat Nepal" className="w-8 h-8 rounded-lg shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform" />
          <span className="text-xl font-heading font-black tracking-tight uppercase">
            Superchat Nepal
          </span>
        </Link>

        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 sm:p-12 shadow-2xl">
          <div className="mb-10">
            <h2 className="text-3xl font-heading font-black mb-3 uppercase tracking-tight">
              Welcome Back
            </h2>
            <p className="text-base text-text-muted font-medium opacity-60 leading-relaxed">Sign in to manage your stream alerts and donations.</p>
          </div>

          {(error || authError) && (
            <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm font-bold text-red-400 animate-in fade-in slide-in-from-top-2">
              {error || authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group/input">
              <label className="block text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-4 opacity-50">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 text-base font-bold text-white placeholder-white/10 outline-none focus:border-orange-500/30 focus:bg-white/[0.08] transition-all"
                placeholder="you@example.com"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="group/input">
              <div className="flex justify-end items-center mb-3 ml-4 mr-4">
                <label className="block text-xs font-black text-text-muted uppercase tracking-[0.2em] opacity-50">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 text-base font-bold text-white placeholder-white/10 outline-none focus:border-orange-500/30 focus:bg-white/[0.08] transition-all"
                placeholder="••••••••"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group/btn w-full h-16 bg-orange-500 hover:bg-orange-400 text-black text-base font-black rounded-2xl uppercase tracking-[0.15em] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-orange-500/20 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
              <span className="relative z-10">{isLoading ? "Signing in..." : "Sign In →"}</span>
            </button>
          </form>

          <div className="border-t border-white/5 mt-10 pt-8 text-center">
            <p className="text-sm text-text-muted font-bold tracking-wide">
              New to Superchat?{" "}
              <Link href="/register" alt="Register free" title="Register free" className="text-orange-500 hover:text-orange-400 font-black uppercase tracking-widest ml-2 transition-colors">
                Register free
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[11px] font-black text-text-muted/30 mt-10 uppercase tracking-[0.4em]">
          Secure · Encrypted · Built for Nepal
        </p>
      </div>
    </div>
  );
}