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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12">
      <Link
        href="/"
        className="mb-8 text-2xl font-bold bg-linear-to-r from-orange-500 to-red-600 bg-clip-text text-transparent"
      >
        Superchat Nepal
      </Link>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-gray-400 mb-8">Join the community of Nepali streamers</p>

        {(error || authError) && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error || authError}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-400 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username / Streamer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Streamer Username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500 text-sm">@</span>
              <input
                type="text"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                placeholder="ghatak_gaming"
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This will be your unique donation link.
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              placeholder="name@example.com"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              placeholder="••••••••"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              placeholder="••••••••"
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          {/* Terms */}
          <div className="flex items-start space-x-2">
            <input type="checkbox" required className="mt-1 accent-orange-500" />
            <span className="text-xs text-gray-400 leading-tight">
              I agree to the Terms of Service and Privacy Policy. I understand platform
              fees apply to donations.
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-orange-900/20 transition-all transform active:scale-[0.98] ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Creating Account..." : "Create My Dashboard"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-8">
          Already a member?{" "}
          <Link href="/login" className="text-orange-500 font-medium hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}