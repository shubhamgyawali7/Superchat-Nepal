"use client";

import React, { useState, useRef, useEffect } from "react";
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-black tracking-tight text-white">
            Welcome back, <span className="text-violet-400">{user.username}</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1 font-medium">
            Manage your live stream donations, alerts, and overlay sources.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={sendTestAlert}
            disabled={isTesting}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            <Icon icon={Notification01Icon} size={16} />
            <span>{isTesting ? "Triggering Alert..." : "Test OBS Alert"}</span>
          </button>
          <button
            onClick={resetDonations}
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-colors"
          >
            <Icon icon={Delete01Icon} size={16} />
            <span>Clear Stream Data</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl">
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-3">
            Total Revenue
          </p>
          <p className="text-4xl sm:text-5xl font-heading font-black text-violet-400">
            रू {stats.totalEarnings.toLocaleString()}
          </p>
          <p className="text-xs text-zinc-500 font-medium mt-4">All time earnings</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl">
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-3">
            Supporters
          </p>
          <p className="text-4xl sm:text-5xl font-heading font-black text-white">{stats.recentSupporters}</p>
          <p className="text-xs text-zinc-500 font-medium mt-4">Total donors count</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl flex flex-col justify-between">
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-4">
            Payout Options
          </p>
          <div className="space-y-3">
            <div className="w-full bg-zinc-900 border border-zinc-800 text-xs font-bold py-3 px-4 rounded-xl text-zinc-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Icon icon={CheckmarkCircle01Icon} size={16} className="text-emerald-400" />
                eSewa (Connected)
              </span>
              <span className="text-[10px] uppercase font-black text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">Active</span>
            </div>
            <div className="w-full bg-zinc-900 border border-zinc-800 text-xs font-bold py-3 px-4 rounded-xl text-zinc-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Icon icon={Wallet01Icon} size={16} className="text-purple-400" />
                Khalti
              </span>
              <span className="text-[10px] uppercase font-black text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* OBS Overlay Links Section */}
      <div className="mb-4">
        <h2 className="text-lg font-heading font-black uppercase tracking-tight text-white mb-1">
          OBS Studio Browser Sources
        </h2>
        <p className="text-xs text-zinc-400 font-medium mb-4">
          Add each URL as a Browser Source in OBS, Streamlabs Desktop, or Prism Live.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-8">
        {/* 1. Main Alert Overlay */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white uppercase tracking-widest font-black flex items-center gap-2">
                <Icon icon={Tv01Icon} size={14} className="text-violet-400" />
                Alert Box
              </span>
              <span className="text-[10px] text-zinc-400 font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                800 × 600
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Pops up on donations with audio chime, TTS &amp; animations.
            </p>
            <p className="text-xs text-zinc-300 font-mono truncate mb-4 bg-zinc-900 p-3 rounded-lg border border-zinc-800">
              {overlayUrl}
            </p>
          </div>
          <button
            onClick={copyOverlayPath}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-black py-3 rounded-lg uppercase tracking-wider transition-colors"
          >
            <Icon icon={Copy01Icon} size={14} />
            <span>Copy Alert URL</span>
          </button>
        </div>

        {/* 2. Top 5 Supporters Overlay */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white uppercase tracking-widest font-black flex items-center gap-2">
                <Icon icon={Tv01Icon} size={14} className="text-indigo-400" />
                Top 5 Donors
              </span>
              <span className="text-[10px] text-zinc-400 font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                380 × 500
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Persistent leaderboard of your biggest stream supporters.
            </p>
            <p className="text-xs text-zinc-300 font-mono truncate mb-4 bg-zinc-900 p-3 rounded-lg border border-zinc-800">
              {topOverlayUrl}
            </p>
          </div>
          <button
            onClick={copyTopOverlayPath}
            className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-black py-3 rounded-lg uppercase tracking-wider transition-colors"
          >
            <Icon icon={Copy01Icon} size={14} />
            <span>Copy Top 5 URL</span>
          </button>
        </div>

        {/* 3. Recent Supporters Overlay */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white uppercase tracking-widest font-black flex items-center gap-2">
                <Icon icon={Tv01Icon} size={14} className="text-emerald-400" />
                Recent Donors
              </span>
              <span className="text-[10px] text-zinc-400 font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                360 × 400
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Compact live ticker of latest supporters. Place anywhere.
            </p>
            <p className="text-xs text-zinc-300 font-mono truncate mb-4 bg-zinc-900 p-3 rounded-lg border border-zinc-800">
              {recentOverlayUrl}
            </p>
          </div>
          <button
            onClick={copyRecentOverlayPath}
            className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-black py-3 rounded-lg uppercase tracking-wider transition-colors"
          >
            <Icon icon={Copy01Icon} size={14} />
            <span>Copy Recent URL</span>
          </button>
        </div>

        {/* 4. Public Donation Link & QR */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-3">
              Donation Page
            </p>
            <p className="text-xs text-zinc-400 mb-4">
              Share this link in stream chat or pin on your YouTube/Twitch bio.
            </p>
            <p className="text-xs text-violet-400 font-mono truncate mb-4 bg-zinc-900 p-3 rounded-lg border border-zinc-800">
              {donationUrl}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={copyDonationPath}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 hover:text-white font-bold py-3 rounded-lg uppercase tracking-wider transition-colors"
            >
              Copy Link
            </button>
            <button
              onClick={() => setShowQRModal(true)}
              className="flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-violet-400 hover:text-violet-300 font-bold py-3 rounded-lg uppercase tracking-wider transition-colors"
            >
              <Icon icon={QrCodeIcon} size={14} />
              <span>QR Code</span>
            </button>
          </div>

          <div ref={qrRef} className="hidden">
            <QRCodeCanvas
              value={donationUrl}
              size={512}
              level={"H"}
              includeMargin={true}
              imageSettings={{
                src: "/logo.png",
                height: 110,
                width: 110,
                excavate: true,
              }}
            />
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="px-8 py-6 border-b border-zinc-800 flex items-center justify-between">
          <p className="text-lg font-heading font-black uppercase tracking-tight text-white">Recent Donations</p>
          <span className="text-xs text-zinc-400 font-mono">{stats.recentDonations.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900">
                {["Supporter", "Amount", "Message", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-8 py-4 text-xs text-zinc-400 uppercase tracking-widest font-black"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {stats.recentDonations.length > 0 ? (
                stats.recentDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-zinc-900 transition-colors">
                    <td className="px-8 py-5 text-sm font-bold text-white">{d.supporter_name}</td>
                    <td className="px-8 py-5 text-sm text-violet-400 font-black">रू {d.amount}</td>
                    <td className="px-8 py-5 text-sm text-zinc-400 font-medium italic">
                      <div className="max-w-[300px] truncate">&quot;{d.message}&quot;</div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`text-xs px-2.5 py-1 rounded font-bold uppercase tracking-wider border ${
                          d.status === "verified"
                            ? "bg-zinc-900 text-emerald-400 border-zinc-800"
                            : "bg-zinc-900 text-indigo-400 border-zinc-800"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-16 text-center text-sm text-zinc-500 font-medium">
                    No donations yet. Click &quot;Test OBS Alert&quot; above to preview your stream setup.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowQRModal(false)}
        >
          <div
            className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-sm w-full p-6 relative shadow-2xl flex flex-col items-center text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-900 border border-zinc-800 transition-colors"
              aria-label="Close"
            >
              <Icon icon={Cancel01Icon} size={16} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-4 text-violet-400">
              <Icon icon={QrCodeIcon} size={24} />
            </div>

            <h3 className="text-xl font-heading font-black uppercase tracking-tight text-white mb-1">
              Donation QR Code
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Scan with any camera or payment app to open <span className="text-violet-400 font-bold">@{user.username}</span>&apos;s donation page.
            </p>

            {/* QR Code Canvas with Centered Application Logo */}
            <div className="bg-white p-4 rounded-2xl shadow-inner mb-6 flex items-center justify-center">
              <QRCodeCanvas
                value={donationUrl}
                size={240}
                level={"H"}
                includeMargin={true}
                imageSettings={{
                  src: "/logo.png",
                  height: 52,
                  width: 52,
                  excavate: true,
                }}
              />
            </div>

            <div className="w-full space-y-2">
              <button
                onClick={downloadQR}
                className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-black py-3 rounded-xl uppercase tracking-wider transition-colors shadow-lg shadow-violet-600/20"
              >
                <Icon icon={Download01Icon} size={16} />
                <span>Download High-Res QR</span>
              </button>
              <button
                onClick={copyDonationPath}
                className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-bold py-3 rounded-xl uppercase tracking-wider transition-colors"
              >
                <Icon icon={Copy01Icon} size={14} />
                <span>Copy Donation URL</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
