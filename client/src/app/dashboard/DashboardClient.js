"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import { QRCodeCanvas } from "qrcode.react";
import Icon from "@/components/common/Icon";
import ThemeToggle from "@/components/dashboard/ThemeToggle";
import StatusBadge from "@/components/dashboard/StatusBadge";
import StatCard from "@/components/dashboard/StatCard";
import {
  Copy01Icon,
  QrCodeIcon,
  Tv01Icon,
  Wallet01Icon,
  Cancel01Icon,
  Download01Icon,
  Clock01Icon,
  Share01Icon,
  ExternalLinkIcon,
  Radio01Icon,
  ArrowRight01Icon,
  Invoice01Icon,
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

  const copyOverlayPath = () => {
    navigator.clipboard.writeText(overlayUrl);
    addToast("OBS Alert URL copied! Add as Browser Source (800x600).", "success");
  };

  const copyDonationPath = () => {
    navigator.clipboard.writeText(donationUrl);
    addToast("Donation page link copied to clipboard!", "success");
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

  const totalAmount = stats.totalEarnings || stats.totalDonations || 0;
  const donorCount = stats.recentSupporters || stats.recentDonations?.length || 0;
  const avgAmount = donorCount > 0 ? Math.round(totalAmount / donorCount) : 0;
  const donations = stats.recentDonations || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1550px] mx-auto text-[#1D1D20] dark:text-[#F4F5F8]">
      {/* 1. CLEAN HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5EAF1] dark:border-[#222736]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#1D1D20] dark:text-[#F4F5F8] tracking-tight">
              Welcome back, <span className="text-[#FF4D0A]">{user.username}</span>
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/80 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              OBS Online
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#777B87] dark:text-[#949AA8]">
            Your live stream donation link and overlay alerts are active.
          </p>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          <a
            href={donationUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-[#131620] hover:bg-slate-50 dark:hover:bg-[#181C28] border border-[#E5EAF1] dark:border-[#222736] text-[#1D1D20] dark:text-[#F4F5F8] text-xs font-semibold rounded-xl transition-colors shadow-2xs"
          >
            <span>Public Page</span>
            <Icon icon={ExternalLinkIcon} size={13} />
          </a>

          <button
            onClick={sendTestAlert}
            disabled={isTesting}
            className="inline-flex items-center gap-1.5 bg-[#FF4D0A] hover:bg-[#E04307] active:scale-98 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs disabled:opacity-50"
          >
            <Icon icon={Tv01Icon} size={15} />
            <span>{isTesting ? "Testing..." : "Test OBS Alert"}</span>
          </button>
        </div>
      </header>

      {/* 2. KEY METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Stream Revenue"
          prefix="रू"
          value={totalAmount.toLocaleString()}
          subtext="Lifetime earnings"
          icon={Wallet01Icon}
          iconColor="text-[#FF4D0A]"
          iconBg="bg-orange-50 dark:bg-orange-500/10"
        />
        <StatCard
          label="Total Superchats"
          value={donorCount.toLocaleString()}
          subtext="Verified supporter donations"
          icon={Invoice01Icon}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
        />
        <StatCard
          label="Average Superchat"
          prefix="रू"
          value={avgAmount.toLocaleString()}
          subtext="Per donation"
          icon={Invoice01Icon}
          iconColor="text-sky-600 dark:text-sky-400"
          iconBg="bg-sky-50 dark:bg-sky-500/10"
        />
        <StatCard
          label="OBS Alert Latency"
          value="< 100ms"
          subtext="WebSocket real-time sync"
          icon={Radio01Icon}
          iconColor="text-violet-600 dark:text-violet-400"
          iconBg="bg-violet-50 dark:bg-violet-500/10"
        />
      </div>

      {/* 3. PRIMARY QUICK ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Action 1: QR Code */}
        <div
          onClick={() => setShowQRModal(true)}
          className="bg-white dark:bg-[#131620] hover:border-orange-300 dark:hover:border-orange-500/40 border border-[#E5EAF1] dark:border-[#222736] rounded-2xl p-4 flex items-center gap-3.5 cursor-pointer transition-all hover:shadow-xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-[#FF4D0A] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            <Icon icon={QrCodeIcon} size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-[#1D1D20] dark:text-[#F4F5F8] group-hover:text-[#FF4D0A] transition-colors truncate">
              Show QR Code
            </h2>
            <p className="text-xs text-[#777B87] dark:text-[#949AA8] truncate">
              Display or download on-stream QR
            </p>
          </div>
        </div>

        {/* Action 2: Copy Overlay URL */}
        <div
          onClick={copyOverlayPath}
          className="bg-white dark:bg-[#131620] hover:border-violet-300 dark:hover:border-violet-500/40 border border-[#E5EAF1] dark:border-[#222736] rounded-2xl p-4 flex items-center gap-3.5 cursor-pointer transition-all hover:shadow-xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            <Icon icon={Tv01Icon} size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-[#1D1D20] dark:text-[#F4F5F8] group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">
              Copy OBS Browser Source
            </h2>
            <p className="text-xs text-[#777B87] dark:text-[#949AA8] truncate">
              800 × 600 px alert box URL
            </p>
          </div>
        </div>

        {/* Action 3: Copy Donation Link */}
        <div
          onClick={copyDonationPath}
          className="bg-white dark:bg-[#131620] hover:border-sky-300 dark:hover:border-sky-500/40 border border-[#E5EAF1] dark:border-[#222736] rounded-2xl p-4 flex items-center gap-3.5 cursor-pointer transition-all hover:shadow-xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            <Icon icon={Share01Icon} size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-[#1D1D20] dark:text-[#F4F5F8] group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate">
              Copy Public Donation Link
            </h2>
            <p className="text-xs text-[#777B87] dark:text-[#949AA8] truncate">
              Share in stream description &amp; chat
            </p>
          </div>
        </div>
      </div>

      {/* 4. MAIN 2-COLUMN SECTION: RECENT SUPERCHATS & OBS SETUP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Recent Superchats Feed */}
        <div className="lg:col-span-7 bg-white dark:bg-[#131620] border border-[#E5EAF1] dark:border-[#222736] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF1] dark:border-[#222736]">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-heading font-bold text-[#1D1D20] dark:text-[#F4F5F8]">
                Recent Superchats
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <Link
              href="/dashboard/history"
              className="text-xs font-semibold text-[#FF4D0A] hover:underline flex items-center gap-1"
            >
              <span>View All History</span>
              <Icon icon={ArrowRight01Icon} size={12} />
            </Link>
          </div>

          {/* Donation Items */}
          {donations.length > 0 ? (
            <div className="space-y-3">
              {donations.slice(0, 5).map((d) => (
                <div
                  key={d.id}
                  className="bg-slate-50/80 dark:bg-[#181C28] rounded-xl p-4 border border-[#E5EAF1] dark:border-[#222736] space-y-2.5 transition-all hover:border-slate-300 dark:hover:border-zinc-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#1D1D20] dark:text-[#F4F5F8]">
                        {d.supporter_name || "Anonymous"}
                      </span>
                      <StatusBadge status={d.status || "verified"} label={d.gateway || "eSewa"} />
                    </div>
                    <span className="text-sm font-heading font-extrabold text-[#FF4D0A] font-mono">
                      रू {parseFloat(d.amount).toLocaleString()}
                    </span>
                  </div>

                  {d.message && (
                    <p className="text-xs text-[#777B87] dark:text-[#949AA8] italic bg-white dark:bg-[#131620] p-2.5 rounded-lg border border-[#E5EAF1] dark:border-[#222736] leading-relaxed">
                      &ldquo;{d.message}&rdquo;
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-0.5 text-xs text-[#777B87] dark:text-[#949AA8]">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Icon icon={Clock01Icon} size={12} />
                      {new Date(d.created_at || d.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={sendTestAlert}
                      className="text-xs font-semibold text-[#FF4D0A] hover:text-[#E04307] transition-colors"
                    >
                      Replay Alert
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-[#FF4D0A] flex items-center justify-center mb-1">
                <Icon icon={SparklesIcon} size={20} />
              </div>
              <p className="text-sm font-semibold text-[#1D1D20] dark:text-[#F4F5F8]">
                No superchats recorded yet
              </p>
              <p className="text-xs text-[#777B87] dark:text-[#949AA8] max-w-sm leading-relaxed">
                Share your public donation link with your audience during live streams to receive real-time alerts.
              </p>
              <button
                onClick={copyDonationPath}
                className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 dark:bg-[#181C28] hover:bg-slate-200 dark:hover:bg-[#1E2333] text-[#1D1D20] dark:text-[#F4F5F8] text-xs font-semibold rounded-xl transition-colors border border-[#E5EAF1] dark:border-[#222736]"
              >
                <Icon icon={Copy01Icon} size={13} />
                <span>Copy Donation Link</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): OBS Browser Source Setup */}
        <div className="lg:col-span-5 space-y-5">
          {/* OBS Studio Integration Card */}
          <div className="bg-white dark:bg-[#131620] border border-[#E5EAF1] dark:border-[#222736] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF1] dark:border-[#222736]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-[#FF4D0A] flex items-center justify-center">
                  <Icon icon={Tv01Icon} size={15} />
                </div>
                <h2 className="text-xs font-bold text-[#1D1D20] dark:text-[#F4F5F8] uppercase tracking-wider">
                  OBS Studio Setup
                </h2>
              </div>
              <span className="text-xs font-mono text-[#777B87] dark:text-[#949AA8]">800 × 600 px</span>
            </div>

            <p className="text-xs text-[#777B87] dark:text-[#949AA8] leading-relaxed">
              Add your private URL as a <strong>Browser Source</strong> in OBS Studio or Streamlabs to show live alert chimes and custom animations on stream.
            </p>

            {/* URL Display Box */}
            <div className="bg-slate-50 dark:bg-[#181C28] p-3 rounded-xl border border-[#E5EAF1] dark:border-[#222736] space-y-2">
              <span className="text-[10px] font-bold text-[#777B87] dark:text-[#949AA8] uppercase tracking-wider block">
                Browser Source URL
              </span>
              <p className="text-xs font-mono text-[#1D1D20] dark:text-[#F4F5F8] truncate select-all">
                {overlayUrl}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={copyOverlayPath}
                className="flex-1 py-2 bg-slate-100 dark:bg-[#181C28] hover:bg-slate-200 dark:hover:bg-[#1E2333] text-[#1D1D20] dark:text-[#F4F5F8] text-xs font-semibold rounded-xl transition-colors text-center border border-[#E5EAF1] dark:border-[#222736]"
              >
                Copy Overlay URL
              </button>
              <button
                onClick={sendTestAlert}
                disabled={isTesting}
                className="px-4 py-2 bg-[#FF4D0A] hover:bg-[#E04307] active:scale-95 text-white text-xs font-semibold rounded-xl transition-all shadow-xs disabled:opacity-50"
              >
                {isTesting ? "Testing..." : "Test 🔔"}
              </button>
            </div>
          </div>

          {/* Quick Customization Shortcuts */}
          <div className="bg-white dark:bg-[#131620] border border-[#E5EAF1] dark:border-[#222736] rounded-2xl p-5 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-[#1D1D20] dark:text-[#F4F5F8] uppercase tracking-wider">
              Quick Shortcuts
            </h3>
            <div className="space-y-2">
              <Link
                href="/dashboard/settings"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#181C28] hover:bg-slate-100 dark:hover:bg-[#1E2333] border border-[#E5EAF1] dark:border-[#222736] transition-colors group"
              >
                <div>
                  <p className="text-xs font-semibold text-[#1D1D20] dark:text-[#F4F5F8] group-hover:text-[#FF4D0A] transition-colors">
                    Customize Alert Animations &amp; TTS
                  </p>
                  <p className="text-[11px] text-[#777B87] dark:text-[#949AA8]">
                    Adjust entrance motions, voice speed, and sounds
                  </p>
                </div>
                <Icon icon={ArrowRight01Icon} size={14} className="text-[#777B87] group-hover:text-[#FF4D0A]" />
              </Link>

              <Link
                href="/dashboard/customize"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#181C28] hover:bg-slate-100 dark:hover:bg-[#1E2333] border border-[#E5EAF1] dark:border-[#222736] transition-colors group"
              >
                <div>
                  <p className="text-xs font-semibold text-[#1D1D20] dark:text-[#F4F5F8] group-hover:text-[#FF4D0A] transition-colors">
                    Edit Brand Theme &amp; Bio
                  </p>
                  <p className="text-[11px] text-[#777B87] dark:text-[#949AA8]">
                    Update display name, social links, and colors
                  </p>
                </div>
                <Icon icon={ArrowRight01Icon} size={14} className="text-[#777B87] group-hover:text-[#FF4D0A]" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 5. HIDDEN CANVAS FOR HIGH-RES QR DOWNLOAD */}
      <div className="hidden" ref={qrRef}>
        <QRCodeCanvas
          value={donationUrl}
          size={600}
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

      {/* 6. BRANDED QR CODE MODAL */}
      {showQRModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          onClick={() => setShowQRModal(false)}
        >
          <div
            className="bg-white dark:bg-[#131620] border border-[#E5EAF1] dark:border-[#222736] rounded-2xl max-w-sm w-full p-6 relative shadow-xl flex flex-col items-center text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 text-[#777B87] hover:text-[#1D1D20] dark:hover:text-white p-1.5 rounded-lg bg-slate-100 dark:bg-[#181C28] transition-colors"
              aria-label="Close"
            >
              <Icon icon={Cancel01Icon} size={16} />
            </button>

            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-[#FF4D0A] flex items-center justify-center mb-3">
              <Icon icon={QrCodeIcon} size={20} />
            </div>

            <h3 className="text-lg font-heading font-bold text-[#1D1D20] dark:text-[#F4F5F8] mb-1">
              Donation QR Code
            </h3>
            <p className="text-xs text-[#777B87] dark:text-[#949AA8] mb-4 max-w-xs leading-relaxed">
              Scan with eSewa, Khalti, or mobile camera to open{" "}
              <span className="text-[#FF4D0A] font-semibold">@{user.username}</span>&apos;s donation page.
            </p>

            {/* Centered QR Canvas with Logo */}
            <div className="bg-slate-50 dark:bg-[#181C28] p-4 rounded-xl border border-[#E5EAF1] dark:border-[#222736] mb-4 flex items-center justify-center">
              <QRCodeCanvas
                value={donationUrl}
                size={220}
                level="H"
                includeMargin={true}
                imageSettings={{
                  src: "/logo.png",
                  height: 48,
                  width: 48,
                  excavate: true,
                }}
              />
            </div>

            <div className="w-full space-y-2">
              <button
                onClick={downloadQR}
                className="w-full flex items-center justify-center gap-2 bg-[#FF4D0A] hover:bg-[#E04307] active:scale-98 text-white text-xs font-semibold py-2.5 rounded-xl transition-all shadow-xs"
              >
                <Icon icon={Download01Icon} size={15} />
                <span>Download High-Res QR</span>
              </button>
              <button
                onClick={copyDonationPath}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-[#181C28] hover:bg-slate-200 dark:hover:bg-[#1E2333] text-[#1D1D20] dark:text-[#F4F5F8] text-xs font-semibold py-2 rounded-xl transition-colors border border-[#E5EAF1] dark:border-[#222736]"
              >
                <Icon icon={Copy01Icon} size={15} />
                <span>Copy Donation URL</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
