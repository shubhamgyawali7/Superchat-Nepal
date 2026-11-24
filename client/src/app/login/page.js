"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Icon from "@/components/common/Icon";
import { Alert01Icon } from "@hugeicons/core-free-icons";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, error: authError } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = (data.get("email") || formData.email || "").toString().trim();
    const password = (data.get("password") || formData.password || "").toString();

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setIsLoading(true);
    setError("");
    const result = await login(email, password);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12 relative selection:bg-violet-900">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mb-8 justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Superchat Nepal"
            className="w-10 h-10 rounded-lg object-contain bg-violet-600"
          />
          <span className="text-xl font-heading font-black tracking-tight uppercase">
            Superchat <span className="text-violet-400">Nepal</span>
          </span>
        </Link>

        {/* Card (No shadows, No gradients) */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 sm:p-10">
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-white mb-2">
              Streamer Sign In
            </h2>
            <p className="text-sm text-zinc-400 font-medium">
              Access your real-time OBS overlays, earnings, and donations.
            </p>
          </div>

          {(error || authError) && (
            <div className="mb-6 p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-red-400 flex items-center gap-2">
              <Icon icon={Alert01Icon} size={16} />
              <span>{error || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors"
                placeholder="streamer@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-400">
                  Password
                </label>
              </div>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-xl text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50 mt-2"
            >
              {isLoading ? "Signing in..." : "Sign In to Stream"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
            <p className="text-xs text-zinc-400">
              Don&apos;t have a creator account?{" "}
              <Link href="/register" className="text-violet-400 font-bold hover:text-violet-300">
                Register Free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
