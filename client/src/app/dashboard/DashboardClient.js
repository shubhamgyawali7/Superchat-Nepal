"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import { QRCodeCanvas } from "qrcode.react";
import Icon from "@/components/common/Icon";
import {
  Notification01Icon,
  Copy01Icon,
  QrCodeIcon,
  Delete01Icon,
  Tv01Icon,
  CheckmarkCircle01Icon,
  Wallet01Icon,
  Cancel01Icon,
  Download01Icon,
  Search01Icon,
  Settings01Icon,
  Calendar01Icon,
  Clock01Icon,
  ArrowRight01Icon,
  Share01Icon,
  Edit01Icon,
  Radio01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";

export default function DashboardClient({
  user,
  stats,
  serverUrl,
  overlayUrl,
  topOverlayUrl,
  recentOverlayUrl,
  donationUrl,
}) {
  const { addToast } = useToast();
  const [isTesting, setIsTesting] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeHeaderTab, setActiveHeaderTab] = useState("dashboard");

  const qrRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShowQRModal(false);
    };
    if (showQRModal) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showQRModal]);

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) {
      addToast("Failed to generate QR code", "error");
      return;
    }
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `${user.username}-donation-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("QR Code downloaded!", "success");
  };

  const resetDonations = async () => {
    if (!confirm("Are you sure you want to clear recent donations? This will start your stream data fresh.")) return;

    try {
      const res = await fetch("/api/streamer/reset-donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (res.ok) {
        addToast("Recent donations cleared! Restarting stream data...", "success");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        throw new Error("Failed to reset donations");
      }
    } catch (err) {
      console.error("Reset failed:", err);
      addToast("Failed to clear donations. Please try again.", "error");
    }
  };

  const copyOverlayPath = () => {
    navigator.clipboard.writeText(overlayUrl);
    addToast("Alert Box URL copied! Add as OBS Browser Source (800x600).", "success");
  };

  const copyTopOverlayPath = () => {
    navigator.clipboard.writeText(topOverlayUrl);
    addToast("Top Supporters URL copied! Add as OBS Browser Source (380x500).", "success");
  };

  const copyRecentOverlayPath = () => {
    navigator.clipboard.writeText(recentOverlayUrl);
    addToast("Recent Donors URL copied! Add as OBS Browser Source (360x400).", "success");
  };

  const copyDonationPath = () => {
    navigator.clipboard.writeText(donationUrl);
    addToast("Public Donation link copied!", "success");
  };

  const sendTestAlert = async () => {
    if (isTesting) return;
    setIsTesting(true);
    try {
      const res = await fetch("/api/streamer/test-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (res.ok) {
        addToast("Test alert sent to OBS overlay!", "success");
      } else {
        throw new Error("Failed to send test alert");
      }
    } catch (err) {
      console.error("Test alert failed:", err);
      addToast("Failed to send test alert. Make sure backend is running.", "error");
    } finally {
      setIsTesting(false);
    }
  };

  const recentItem = stats.recentDonations?.[0] || {
    supporter_name: "Suman Sharma",
    amount: 500,
    message: "Bro great stream today! Keep grinding and clutch more games 🔥",
    created_at: "Just now",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1550px] mx-auto text-zinc-800">
      {/* 1. TOP HEADER BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        {/* Left: Navigation Tabs */}
        <div className="flex items-center gap-6 text-sm font-bold">
          <button
            onClick={() => setActiveHeaderTab("dashboard")}
            className={`flex items-center gap-2 pb-1 transition-all ${
              activeHeaderTab === "dashboard"
                ? "text-zinc-900 border-b-2 border-orange-500 font-black"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <span>Dashboard</span>
          </button>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 pb-1 text-zinc-500 hover:text-zinc-800 transition-colors"
          >
            <span>Workflows &amp; OBS</span>
          </Link>
          <Link
            href="/dashboard/customize"
            className="flex items-center gap-2 pb-1 text-zinc-500 hover:text-zinc-800 transition-colors"
          >
            <span>Integrations</span>
          </Link>
        </div>

        {/* Center: Search Bar Pill (16px on mobile to prevent iOS zoom, 14px on desktop) */}
        <div className="relative flex-1 max-w-md">
          <Icon
            icon={Search01Icon}
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search donations, supporters or type command..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200/80 focus:border-orange-400 rounded-full text-base sm:text-sm text-zinc-800 placeholder-zinc-400 outline-none transition-all shadow-inner"
          />
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Light/Dark Toggle Pill */}
          <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200/80 text-xs font-bold">
            <span className="bg-white text-zinc-800 px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
              ☀️ Light
            </span>
            <span className="text-zinc-400 px-2.5 py-1">🌙 Dark</span>
          </div>

          {/* Notification Bell */}
          <button
            onClick={() => addToast("You have 3 new stream notifications", "info")}
            className="relative w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200/80 flex items-center justify-center text-zinc-600 transition-colors"
            aria-label="Notifications"
          >
            <Icon icon={Notification01Icon} size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white" />
          </button>

          {/* Settings Cog */}
          <Link
            href="/dashboard/settings"
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200/80 flex items-center justify-center text-zinc-600 transition-colors"
            title="Settings"
          >
            <Icon icon={Settings01Icon} size={18} />
          </Link>

          {/* Export Data Button (14px UI Text) */}
          <button
            onClick={() => addToast("Exporting donation records...", "info")}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-sm font-bold text-zinc-700 transition-colors"
          >
            <Icon icon={Download01Icon} size={15} />
            <span>Export data</span>
            <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-mono font-bold">.csv</span>
          </button>

          {/* Primary Action Button (14px font-black) */}
          <button
            onClick={sendTestAlert}
            disabled={isTesting}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-4 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 disabled:opacity-50"
          >
            <Icon icon={Radio01Icon} size={15} />
            <span>{isTesting ? "Testing..." : "Test OBS Alert"}</span>
          </button>
        </div>
      </div>

      {/* 2. HERO GREETING & QUICK FEATURE CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
        {/* Left: Greeting Text (H1: 28px-40px on mobile; 35px-50px on desktop) */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-zinc-900 tracking-tight">
              Hi, <span className="text-orange-500">{user.username}</span>!
            </h1>
            <span className="text-3xl animate-wave">👋</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-black text-zinc-800 tracking-tight">
            What are your plans for today?
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 leading-relaxed font-medium max-w-md">
            This platform is designed to monetize your live stream with zero-latency eSewa &amp; Khalti superchats.
          </p>
        </div>

        {/* Right: Quick Action & Feature Cards */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Card 1: Add New Action */}
          <button
            onClick={() => setShowQRModal(true)}
            className="group p-4 rounded-2xl bg-orange-50/50 hover:bg-orange-50 border-2 border-dashed border-orange-300 hover:border-orange-400 flex flex-col items-center justify-center min-h-[140px] text-center transition-all cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
              <span className="text-xl font-black leading-none">+</span>
            </div>
            <span className="text-sm font-bold text-orange-950">Show QR</span>
            <span className="text-xs text-orange-700 font-medium">With logo</span>
          </button>

          {/* Card 2: OBS Alert Box */}
          <div
            onClick={copyOverlayPath}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between min-h-[140px] group"
          >
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
              <Icon icon={Tv01Icon} size={18} />
            </div>
            <div>
              <p className="text-sm font-black text-zinc-900">OBS Alert Box</p>
              <p className="text-xs text-zinc-500 mt-0.5 leading-snug">
                Click to copy 800×600 URL
              </p>
            </div>
          </div>

          {/* Card 3: eSewa & Khalti Gateways */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[140px] group">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
              <Icon icon={CheckmarkCircle01Icon} size={18} />
            </div>
            <div>
              <p className="text-sm font-black text-zinc-900">Sync Gateways</p>
              <p className="text-xs text-zinc-500 mt-0.5 leading-snug">
                eSewa &amp; Khalti active
              </p>
            </div>
          </div>

          {/* Card 4: Collaborate & Share */}
          <div
            onClick={copyDonationPath}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between min-h-[140px] group"
          >
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
              <Icon icon={Share01Icon} size={18} />
            </div>
            <div>
              <p className="text-sm font-black text-zinc-900">Share Link</p>
              <p className="text-xs text-zinc-500 mt-0.5 leading-snug">
                Copy public page link
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT GRID (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* COLUMN 1: Notifications & Stream Tasks */}
        <div className="space-y-6">
          {/* Card 1.1: Recent Superchats */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-heading font-black text-zinc-900">Notifications</h3>
              <button
                onClick={resetDonations}
                className="text-xs text-zinc-500 hover:text-red-500 font-bold transition-colors flex items-center gap-1"
              >
                <Icon icon={Delete01Icon} size={14} />
                <span>Clear</span>
              </button>
            </div>

            {/* Elevated Highlighted Live Notification Card */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Latest Superchat
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  eSewa Verified
                </span>
              </div>

              <div>
                <p className="text-base font-black text-zinc-900">{recentItem.supporter_name}</p>
                <p className="text-xl sm:text-2xl font-black text-orange-500 font-heading">रू {recentItem.amount}</p>
              </div>

              <div className="flex items-center gap-4 text-xs text-zinc-500 font-medium pt-1.5 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Icon icon={Calendar01Icon} size={14} />
                  Today
                </span>
                <span className="flex items-center gap-1">
                  <Icon icon={Clock01Icon} size={14} />
                  Live Stream
                </span>
              </div>
            </div>

            {/* Second Message Item Preview */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
              <div className="flex items-center justify-between text-xs text-zinc-700 font-bold">
                <span>Message | Stream Supporter</span>
                <span className="text-xs text-zinc-400">Recent</span>
              </div>
              <p className="text-zinc-600 italic text-xs sm:text-sm truncate leading-relaxed">
                &ldquo;{recentItem.message}&rdquo;
              </p>
            </div>
          </div>

          {/* Card 1.2: Today's Tasks / Stream Goals */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-heading font-black text-zinc-900">Today tasks</h3>
                <div className="flex -space-x-1.5">
                  <div className="w-6 h-6 rounded-full bg-orange-500 text-xs text-white flex items-center justify-center font-bold">N</div>
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-xs text-white flex items-center justify-center font-bold">P</div>
                  <div className="w-6 h-6 rounded-full bg-purple-500 text-xs text-white flex items-center justify-center font-bold">+</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-500 font-bold">
                <span className="hover:text-zinc-800 cursor-pointer flex items-center gap-1">
                  <Icon icon={Edit01Icon} size={13} /> Edit
                </span>
                <span className="hover:text-zinc-800 cursor-pointer flex items-center gap-1">
                  <Icon icon={Share01Icon} size={13} /> Share
                </span>
              </div>
            </div>

            {/* Task Items with Progress Bars */}
            <div className="space-y-4">
              {/* Task 1 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm font-bold text-zinc-800">
                  <span>Live Stream Broadcast</span>
                  <span className="text-orange-600 font-mono font-bold">90%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full w-[90%]" />
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                  <span>Duration: 02 h 45 m</span>
                  <span>Goal: 4/5 Done</span>
                </div>
              </div>

              {/* Task 2 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm font-bold text-zinc-800">
                  <span>Microphone Fund Goal</span>
                  <span className="text-orange-600 font-mono font-bold">50%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full w-[50%]" />
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                  <span>Target: रू 20,000</span>
                  <span>Raised: रू 10,000</span>
                </div>
              </div>

              {/* Task 3 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm font-bold text-zinc-800">
                  <span>TTS Speech Audio Level</span>
                  <span className="text-orange-600 font-mono font-bold">75%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full w-[75%]" />
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                  <span>Automated speech</span>
                  <span>Verified OK</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: Assignments (OBS Sources) & Solid Orange Promo Card */}
        <div className="space-y-6">
          {/* Card 2.1: OBS Browser Sources */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-heading font-black text-zinc-900">Assignments</h3>
              <button
                onClick={copyOverlayPath}
                className="text-xs text-orange-600 hover:text-orange-700 font-bold transition-colors flex items-center gap-1"
              >
                <Icon icon={Copy01Icon} size={14} />
                <span>Copy URL</span>
              </button>
            </div>

            {/* Source 1 */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-zinc-900">OBS Alert Box</span>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                    High
                  </span>
                </div>
                <span className="text-xs font-mono text-zinc-500 font-bold">800 × 600</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 font-medium leading-relaxed">
                Pops up on stream with sound chime, animations &amp; Text-to-Speech.
              </p>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  eSewa &amp; Khalti Ready
                </span>
                <button
                  onClick={copyOverlayPath}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700"
                >
                  Copy Link
                </button>
              </div>
            </div>

            {/* Source 2 */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/60 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-zinc-800">Top 5 Donors Leaderboard</p>
                <p className="text-xs text-zinc-500">380 × 500 OBS Source</p>
              </div>
              <button
                onClick={copyTopOverlayPath}
                className="text-xs font-bold text-zinc-700 hover:text-zinc-900 bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                Copy
              </button>
            </div>

            {/* Source 3 */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/60 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-zinc-800">Recent Donors Ticker</p>
                <p className="text-xs text-zinc-500">360 × 400 OBS Source</p>
              </div>
              <button
                onClick={copyRecentOverlayPath}
                className="text-xs font-bold text-zinc-700 hover:text-zinc-900 bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                Copy
              </button>
            </div>

            {/* Add New Assignment Button */}
            <button
              onClick={() => setShowQRModal(true)}
              className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-orange-400 hover:bg-orange-50/40 text-sm font-bold text-zinc-700 hover:text-orange-600 transition-all flex items-center justify-center gap-2"
            >
              <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black">+</span>
              <span>Open Donation QR Code</span>
            </button>
          </div>

          {/* Card 2.2: Solid Vibrant Orange Promo Card */}
          <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 shadow-xl shadow-orange-500/25 space-y-4 text-center relative overflow-hidden">
            {/* Top Icon */}
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center text-2xl shadow-inner border border-white/30">
              🎁
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-heading font-black text-white">Accepting Superchats!</h3>
              <p className="text-sm text-white/95 font-medium mt-1 leading-relaxed max-w-xs mx-auto">
                Share your live donation QR code with centered logo for instant eSewa &amp; Khalti tips.
              </p>
            </div>

            <button
              onClick={() => setShowQRModal(true)}
              className="w-full py-3.5 rounded-xl bg-zinc-950 hover:bg-black text-white text-sm font-black uppercase tracking-wider transition-transform active:scale-95 shadow-md flex items-center justify-center gap-2"
            >
              <Icon icon={QrCodeIcon} size={18} />
              <span>View &amp; Download QR</span>
            </button>
          </div>
        </div>

        {/* COLUMN 3: Calendar, Circular Progress & Board Meeting Trigger */}
        <div className="space-y-6">
          {/* Card 3.1: Stream Calendar */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-heading font-black text-zinc-900">November 2026</h3>
              <div className="flex items-center gap-1 text-zinc-400">
                <span className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs font-black cursor-pointer text-zinc-700">&lt;</span>
                <span className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs font-black cursor-pointer text-zinc-700">&gt;</span>
              </div>
            </div>

            {/* Days Row */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"].map((d) => (
                <span key={d} className="text-xs text-zinc-400 font-bold">{d}</span>
              ))}
              {[20, 21, 22, 23, 24, 25, 26].map((num) => {
                const isSelected = num === 24;
                return (
                  <div
                    key={num}
                    className={`py-1.5 rounded-full font-bold text-xs sm:text-sm transition-colors ${
                      isSelected
                        ? "bg-orange-500 text-white font-black shadow-md shadow-orange-500/30"
                        : "text-zinc-700 hover:bg-slate-100"
                    }`}
                  >
                    {num}
                  </div>
                );
              })}
            </div>

            {/* Scheduled Stream Slots */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <div className="space-y-1">
                <p className="text-xs font-mono text-zinc-500 font-bold">04:30 - 05:00 PM</p>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    <div>
                      <p className="text-sm font-black text-zinc-900">PUBG Live Stream</p>
                      <p className="text-xs text-zinc-500">OBS Overlay Active</p>
                    </div>
                  </div>
                  <span className="text-zinc-400 text-sm">⋮</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-mono text-zinc-500 font-bold">07:00 - 09:00 PM</p>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <div>
                      <p className="text-sm font-black text-zinc-900">Community Superchat Q&amp;A</p>
                      <p className="text-xs text-zinc-500">eSewa &amp; Khalti Live</p>
                    </div>
                  </div>
                  <span className="text-zinc-400 text-sm">⋮</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3.2: Circular Progress Gauges */}
          <div className="grid grid-cols-2 gap-3">
            {/* Circle 1 */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
              <div className="relative w-16 h-16 flex items-center justify-center mb-2">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-orange-500"
                    strokeDasharray="90, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-sm font-black text-zinc-900 font-mono">90%</span>
              </div>
              <p className="text-xs font-black uppercase text-zinc-400">eSewa Share</p>
              <p className="text-sm font-black text-zinc-800 mt-0.5">Instant Payouts</p>
            </div>

            {/* Circle 2 */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
              <div className="relative w-16 h-16 flex items-center justify-center mb-2">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500"
                    strokeDasharray="65, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-sm font-black text-zinc-900 font-mono">65%</span>
              </div>
              <p className="text-xs font-black uppercase text-zinc-400">Stream Goal</p>
              <p className="text-sm font-black text-zinc-800 mt-0.5">Khalti &amp; Bonus</p>
            </div>
          </div>

          {/* Card 3.3: Action Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-heading font-black text-zinc-900">OBS Trigger Check</h3>
              <button
                onClick={() => addToast("Alert settings verified", "info")}
                className="text-xs text-zinc-500 hover:text-zinc-700 font-bold"
              >
                Edit
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-zinc-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>WebSocket Online • Zero Latency</span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-medium">
              Simulate an instant incoming donation alert with sound chime and Text-to-Speech in your OBS stream.
            </p>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={resetDonations}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-zinc-700 text-sm font-bold transition-colors text-center"
              >
                Reset Stream
              </button>
              <button
                onClick={sendTestAlert}
                disabled={isTesting}
                className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-black uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 disabled:opacity-50 text-center"
              >
                {isTesting ? "Sending..." : "Test Alert"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. RECENT DONATIONS TABLE */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-lg font-heading font-black text-zinc-900">Recent Stream Donations</p>
            <p className="text-xs sm:text-sm text-zinc-500 font-medium">All incoming superchats via eSewa &amp; Khalti</p>
          </div>
          <span className="text-xs text-orange-600 font-mono font-bold bg-orange-50 px-3 py-1 rounded-full border border-orange-200/60">
            {stats.recentDonations?.length || 0} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-xs text-zinc-400 uppercase tracking-widest font-black">
                <th className="px-6 py-4">Supporter</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {stats.recentDonations?.length > 0 ? (
                stats.recentDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-zinc-900">{d.supporter_name}</td>
                    <td className="px-6 py-4 text-orange-600 font-black font-mono">रू {d.amount}</td>
                    <td className="px-6 py-4 text-zinc-600 italic max-w-xs truncate text-xs sm:text-sm">&ldquo;{d.message}&rdquo;</td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {d.status || "verified"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-zinc-500 font-medium text-sm">
                    No donations yet. Click &quot;Test OBS Alert&quot; to preview your stream setup.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hidden 512x512 Canvas for High-Res QR Download */}
      <div ref={qrRef} className="hidden">
        <QRCodeCanvas
          value={donationUrl}
          size={512}
          level="H"
          includeMargin={true}
          imageSettings={{
            src: "/logo.png",
            height: 110,
            width: 110,
            excavate: true,
          }}
        />
      </div>

      {/* QR CODE MODAL */}
      {showQRModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setShowQRModal(false)}
        >
          <div
            className="bg-white border border-slate-200/80 rounded-3xl max-w-sm w-full p-6 relative shadow-2xl flex flex-col items-center text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
              aria-label="Close"
            >
              <Icon icon={Cancel01Icon} size={18} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3 shadow-inner">
              <Icon icon={QrCodeIcon} size={24} />
            </div>

            <h3 className="text-xl font-heading font-black text-zinc-900 mb-1">
              Donation QR Code
            </h3>
            <p className="text-sm text-zinc-500 mb-5 max-w-xs font-medium">
              Scan with eSewa or any camera to open <span className="text-orange-600 font-bold">@{user.username}</span>&apos;s donation page.
            </p>

            {/* Centered QR Canvas with Logo */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 shadow-inner mb-5 flex items-center justify-center">
              <QRCodeCanvas
                value={donationUrl}
                size={230}
                level="H"
                marginSize={1}
                bgColor="#FFFFFF"
                fgColor="#18181b"
                imageSettings={{
                  src: "/logo.png",
                  height: 50,
                  width: 50,
                  excavate: true,
                }}
              />
            </div>

            <div className="w-full space-y-2">
              <button
                onClick={downloadQR}
                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-black py-3.5 rounded-xl uppercase tracking-wider transition-all shadow-md shadow-orange-500/25"
              >
                <Icon icon={Download01Icon} size={18} />
                <span>Download High-Res QR</span>
              </button>
              <button
                onClick={copyDonationPath}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-zinc-700 text-sm font-bold py-3 rounded-xl uppercase tracking-wider transition-colors"
              >
                <Icon icon={Copy01Icon} size={16} />
                <span>Copy Donation URL</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
