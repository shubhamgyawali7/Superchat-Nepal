"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Icon from "@/components/common/Icon";
import { Alert01Icon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";

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
    setError("");
    setSuccess("");

    const data = new FormData(e.currentTarget);
    const username = (data.get("username") || formData.username || "").toString().toLowerCase().trim();
    const email = (data.get("email") || formData.email || "").toString().trim();
    const password = (data.get("password") || formData.password || "").toString();
    const confirmPassword = (data.get("confirmPassword") || formData.confirmPassword || "").toString();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    const result = await register(email, password, username);

    if (result.success) {
      setSuccess(result.message || "Registration successful! You can now log in.");
    } else {
      setError(result.error || "Registration failed");
    }
    setIsLoading(false);
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

        {/* Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 sm:p-10">
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-white mb-2">
              Join as a Streamer
            </h2>
            <p className="text-sm text-zinc-400 font-medium">
              Start accepting eSewa &amp; Khalti donations with live OBS alerts.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-red-400 flex items-center gap-2">
              <Icon icon={Alert01Icon} size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-emerald-400 flex items-center gap-2">
              <Icon icon={CheckmarkCircle01Icon} size={16} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">
                Streamer Username
              </label>
              <input
                type="text"
                name="username"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors"
                placeholder="e.g. gamer_nepal"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">
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
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                autoComplete="new-password"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-xl text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50 mt-4"
            >
              {isLoading ? "Creating Account..." : "Register Streamer Account"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
            <p className="text-xs text-zinc-400">
              Already have an account?{" "}
              <Link href="/login" className="text-violet-400 font-bold hover:text-violet-300">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
