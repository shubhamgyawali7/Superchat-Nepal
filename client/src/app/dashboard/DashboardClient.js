"use client";
import React, { useState, useRef } from "react";
import { useToast } from "@/hooks/useToast";
import { QRCodeCanvas } from "qrcode.react";

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

  const qrRef = useRef(null);

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector("canvas");
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
          <h1 className="text-3xl font-heading font-black tracking-tight text-foreground">
            Welcome back, <span className="text-orange-500">{user.username}</span> 👋
          </h1>
          <p className="text-sm text-text-muted mt-1 font-medium">
            Manage your live stream donations, alerts, and overlay sources.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={sendTestAlert}
            disabled={isTesting}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-black px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.02] shadow-lg shadow-orange-500/20 disabled:opacity-50"
          >
            <span>🔔</span>
            <span>{isTesting ? "Triggering Alert..." : "Test OBS Alert"}</span>
          </button>
          <button
            onClick={resetDonations}
            className="bg-surface border border-surface-border hover:border-red-500/30 text-text-muted hover:text-red-400 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-colors"
          >
            Clear Stream Data
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface border border-surface-border p-8 rounded-[2rem] shadow-sm hover:border-orange-500/10 transition-colors">
          <p className="text-sm text-text-muted uppercase tracking-widest font-bold mb-3 opacity-50">
            Total Revenue
          </p>
          <p className="text-5xl font-heading font-black text-orange-500">
            रू {stats.totalEarnings.toLocaleString()}
          </p>
          <p className="text-xs text-text-muted font-medium opacity-60 mt-4">All time earnings</p>
        </div>
        <div className="bg-surface border border-surface-border p-8 rounded-[2rem] shadow-sm hover:border-orange-500/10 transition-colors">
          <p className="text-sm text-text-muted uppercase tracking-widest font-bold mb-3 opacity-50">
            Supporters
          </p>
          <p className="text-5xl font-heading font-black text-foreground">{stats.recentSupporters}</p>
          <p className="text-xs text-text-muted font-medium opacity-60 mt-4">Total donors count</p>
        </div>
        <div className="bg-surface border border-surface-border p-8 rounded-[2rem] shadow-sm flex flex-col justify-between hover:border-orange-500/10 transition-colors">
          <p className="text-sm text-text-muted uppercase tracking-widest font-bold mb-4 opacity-50">
            Payout Options
          </p>
          <div className="space-y-3">
            <button className="w-full bg-background border border-surface-border hover:border-emerald-500/30 text-sm font-bold py-3 rounded-xl transition-all text-text-muted hover:text-emerald-400 flex items-center justify-center gap-2">
              <span>🟢</span> eSewa (Connected)
            </button>
            <button className="w-full bg-background border border-surface-border hover:border-purple-500/30 text-sm font-bold py-3 rounded-xl transition-all text-text-muted hover:text-purple-400 flex items-center justify-center gap-2">
              <span>🟣</span> Khalti
            </button>
          </div>
        </div>
      </div>

      {/* OBS Overlay Links Section */}
      <div className="mb-4">
        <h2 className="text-lg font-heading font-black uppercase tracking-tight text-foreground mb-1">
          OBS Studio Browser Sources
        </h2>
        <p className="text-xs text-text-muted font-medium mb-4">
          Add each URL as a Browser Source in OBS, Streamlabs Desktop, or Prism Live.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-8">
        {/* 1. Main Alert Overlay */}
        <div className="bg-linear-to-br from-orange-500/10 to-transparent border border-orange-500/30 p-6 rounded-[2rem] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-orange-400 uppercase tracking-widest font-black flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                Alert Box
              </span>
              <span className="text-[10px] text-orange-400/70 font-mono bg-orange-500/10 px-2 py-0.5 rounded">
                800 × 600
              </span>
            </div>
            <p className="text-xs text-text-muted mb-4">
              Pops up on donations with audio chime, TTS &amp; animations.
            </p>
            <p className="text-xs text-text-muted font-mono truncate mb-4 bg-background/60 p-3 rounded-xl border border-surface-border">
              {overlayUrl}
            </p>
          </div>
          <button
            onClick={copyOverlayPath}
            className="w-full bg-orange-500 hover:bg-orange-400 text-black text-xs font-black py-3 rounded-xl uppercase tracking-widest transition-all hover:scale-[1.02] shadow-md shadow-orange-500/20"
          >
            Copy Alert URL
          </button>
        </div>

        {/* 2. Top 5 Supporters Overlay */}
        <div className="bg-linear-to-br from-yellow-500/10 to-transparent border border-yellow-500/30 p-6 rounded-[2rem] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-yellow-400 uppercase tracking-widest font-black flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                Top 5 Donors
              </span>
              <span className="text-[10px] text-yellow-400/70 font-mono bg-yellow-500/10 px-2 py-0.5 rounded">
                380 × 500
              </span>
            </div>
            <p className="text-xs text-text-muted mb-4">
              Persistent leaderboard of your biggest stream supporters.
            </p>
            <p className="text-xs text-text-muted font-mono truncate mb-4 bg-background/60 p-3 rounded-xl border border-surface-border">
              {topOverlayUrl}
            </p>
          </div>
          <button
            onClick={copyTopOverlayPath}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-black py-3 rounded-xl uppercase tracking-widest transition-all hover:scale-[1.02] shadow-md shadow-yellow-500/20"
          >
            Copy Top 5 URL
          </button>
        </div>

        {/* 3. Recent Supporters Overlay */}
        <div className="bg-linear-to-br from-emerald-500/10 to-transparent border border-emerald-500/30 p-6 rounded-[2rem] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-emerald-400 uppercase tracking-widest font-black flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Recent Donors
              </span>
              <span className="text-[10px] text-emerald-400/70 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">
                360 × 400
              </span>
            </div>
            <p className="text-xs text-text-muted mb-4">
              Compact live ticker of latest supporters. Place anywhere.
            </p>
            <p className="text-xs text-text-muted font-mono truncate mb-4 bg-background/60 p-3 rounded-xl border border-surface-border">
              {recentOverlayUrl}
            </p>
          </div>
          <button
            onClick={copyRecentOverlayPath}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black py-3 rounded-xl uppercase tracking-widest transition-all hover:scale-[1.02] shadow-md shadow-emerald-500/20"
          >
            Copy Recent URL
          </button>
        </div>

        {/* 4. Public Donation Link & QR */}
        <div className="bg-surface border border-surface-border p-6 rounded-[2rem] shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-widest font-bold mb-3 opacity-60">
              Donation Page
            </p>
            <p className="text-xs text-text-muted mb-4">
              Share this link in stream chat or pin on your YouTube/Twitch bio.
            </p>
            <p className="text-xs text-orange-400 font-mono truncate mb-4 bg-background/60 p-3 rounded-xl border border-surface-border">
              {donationUrl}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={copyDonationPath}
              className="bg-background border border-surface-border hover:border-orange-500/30 text-xs text-text-muted hover:text-foreground font-bold py-3 rounded-xl uppercase tracking-wider transition-all"
            >
              Copy Link
            </button>
            <button
              onClick={downloadQR}
              className="bg-background border border-orange-500/30 text-xs text-orange-500 hover:bg-orange-500 hover:text-black font-bold py-3 rounded-xl uppercase tracking-wider transition-all"
            >
              QR Code
            </button>
          </div>

          <div ref={qrRef} className="hidden">
            <QRCodeCanvas value={donationUrl} size={512} level={"H"} includeMargin={true} />
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-surface border border-surface-border rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-surface-border flex items-center justify-between">
          <p className="text-lg font-heading font-black uppercase tracking-tight">Recent Donations</p>
          <span className="text-xs text-text-muted font-mono">{stats.recentDonations.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-surface-border bg-foreground/[0.02]">
                {["Supporter", "Amount", "Message", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-8 py-5 text-xs text-text-muted uppercase tracking-widest font-black opacity-50"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {stats.recentDonations.length > 0 ? (
                stats.recentDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-foreground/[0.02] transition-colors">
                    <td className="px-8 py-6 text-base font-bold text-foreground">{d.supporter_name}</td>
                    <td className="px-8 py-6 text-base text-orange-500 font-black">रू {d.amount}</td>
                    <td className="px-8 py-6 text-sm text-text-muted font-medium italic opacity-70">
                      <div className="max-w-[300px] truncate">&quot;{d.message}&quot;</div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`text-xs px-3 py-1 rounded-full uppercase tracking-widest font-black ${
                          d.status === "verified"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-16 text-center text-sm text-text-muted font-medium">
                    No donations yet. Click &quot;Test OBS Alert&quot; above to preview your stream setup! 🚀
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
