"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const { register, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(false);
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    const result = await register(formData.email, formData.password, formData.username);

    if (result.success) {
      setSuccess(result.message || "Registration successful! Please check your email.");
    } else {
      setError(result.error || "Registration failed");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col justify-center items-center px-4 py-20 font-sans selection:bg-orange-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] rounded-full blur-[150px] opacity-10 bg-orange-500/20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] rounded-full blur-[120px] opacity-5 bg-orange-500/10"></div>
      </div>

      <Link href="/" className="flex items-center gap-4 mb-12 group">
        <div className="w-8 h-8 bg-orange-500 rounded-lg shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform" />
        <span className="text-xl font-heading font-black tracking-tight uppercase">
          Superchat Nepal
        </span>
      </Link>

      <div className="relative z-10 w-full max-w-md bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-10 sm:p-12 rounded-[2.5rem] shadow-2xl">
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-3xl font-heading font-black mb-3 uppercase tracking-tight">Create Account</h2>
          <p className="text-base text-text-muted font-medium opacity-60 leading-relaxed">Join the community of Nepali streamers and start earning today.</p>
        </div>

        {(error || authError) && (
          <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm font-bold text-red-400">
            {error || authError}
          </div>
        )}

        {success && (
          <div className="mb-8 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-sm font-bold text-emerald-400">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username / Streamer Name */}
          <div className="group/input">
            <label className="block text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-4 opacity-50">
              Streamer Username
            </label>
            <div className="relative">
              <span className="absolute left-6 top-[18px] text-orange-500/50 text-base font-bold">@</span>
              <input
                type="text"
                required
                className="w-full bg-white/5 border-2 border-white/5 rounded-2xl pl-12 pr-6 py-4 text-base font-bold text-white placeholder-white/10 outline-none focus:border-orange-500/30 focus:bg-white/[0.08] transition-all"
                placeholder="ghatak_gaming"
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <p className="text-[11px] text-text-muted/40 font-bold uppercase tracking-widest mt-2 ml-4">
              This will be your unique donation link.
            </p>
          </div>

          {/* Email */}
          <div className="group/input">
            <label className="block text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-4 opacity-50">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 text-base font-bold text-white placeholder-white/10 outline-none focus:border-orange-500/30 focus:bg-white/[0.08] transition-all"
              placeholder="name@example.com"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Password */}
          <div className="group/input">
            <label className="block text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-4 opacity-50">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 text-base font-bold text-white placeholder-white/10 outline-none focus:border-orange-500/30 focus:bg-white/[0.08] transition-all"
              placeholder="••••••••"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Confirm Password */}
          <div className="group/input">
            <label className="block text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-4 opacity-50">
              Confirm Password
            </label>
            <input
              type="password"
              required
              className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 text-base font-bold text-white placeholder-white/10 outline-none focus:border-orange-500/30 focus:bg-white/[0.08] transition-all"
              placeholder="••••••••"
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 px-2">
            <input type="checkbox" required className="mt-1 w-5 h-5 accent-orange-500 rounded cursor-pointer" />
            <span className="text-xs text-text-muted font-bold leading-relaxed opacity-40">
              I agree to the Terms of Service. I understand platform
              fees apply to donations.
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group/btn w-full h-16 bg-orange-500 hover:bg-orange-400 text-black text-base font-black rounded-2xl uppercase tracking-[0.15em] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-orange-500/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
            <span className="relative z-10">{isLoading ? "Creating Account..." : "Create My Dashboard"}</span>
          </button>
        </form>

        <div className="border-t border-white/5 mt-10 pt-8 text-center">
          <p className="text-sm text-text-muted font-bold tracking-wide">
            Already a member?{" "}
            <Link href="/login" alt="Login here" title="Login here" className="text-orange-500 hover:text-orange-400 font-black uppercase tracking-widest ml-2 transition-colors">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}