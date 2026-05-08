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
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4" style={{ fontFamily: "'DM Mono', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');
        .input-field { transition: border-color 0.15s; }
        .input-field:focus { border-color: #f97316; outline: none; }
        .btn-submit { transition: background 0.15s, transform 0.1s; }
        .btn-submit:active { transform: scale(0.98); }
      `}</style>

      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-5 h-5 bg-orange-500 rounded-sm" />
          <span className="text-xs font-bold tracking-widest uppercase text-slate-300" style={{ fontFamily: "'Syne', sans-serif" }}>
            Superchat Nepal
          </span>
        </Link>

        <div className="bg-[#111] border border-white/8 rounded-lg p-7">
          <h2 className="text-lg font-bold mb-1 uppercase tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            Welcome Back
          </h2>
          <p className="text-xs text-slate-500 mb-6">Sign in to manage your stream alerts</p>

          {(error || authError) && (
            <div className="mb-5 p-3 bg-red-500/8 border border-red-500/20 rounded text-xs text-red-400">
              {error || authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                className="input-field w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2.5 text-sm text-white placeholder-slate-600"
                placeholder="you@example.com"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Password
                </label>
                <Link href="/forgot-password" className="text-[10px] text-orange-500/70 hover:text-orange-400">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                required
                className="input-field w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2.5 text-sm text-white placeholder-slate-600"
                placeholder="••••••••"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-submit w-full bg-orange-500 hover:bg-orange-400 text-black text-sm font-bold py-2.5 rounded uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div className="border-t border-white/5 mt-6 pt-5 text-center">
            <p className="text-xs text-slate-500">
              No account?{" "}
              <Link href="/register" className="text-orange-400 hover:text-orange-300 font-bold">
                Register free
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-700 mt-6 uppercase tracking-widest">
          Secure · Encrypted · Nepal-built
        </p>
      </div>
    </div>
  );
}