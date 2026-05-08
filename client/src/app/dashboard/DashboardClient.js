"use client";
import React, { useState, useRef } from "react";
import { useToast } from "@/hooks/useToast";
import { QRCodeCanvas } from "qrcode.react";

export default function DashboardClient({ user, stats, serverUrl, overlayUrl, topOverlayUrl, donationUrl }) {
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
      const res = await fetch(`${serverUrl}/api/streamer/reset-donations`, {
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
    addToast("Overlay URL copied to clipboard!", "success");
  };

  const copyTopOverlayPath = () => {
    navigator.clipboard.writeText(topOverlayUrl);
    addToast("Top 5 Overlay URL copied to clipboard!", "success");
  };

  const copyDonationPath = () => {
    navigator.clipboard.writeText(donationUrl);
    addToast("Donation link copied to clipboard!", "success");
  };

  const sendTestAlert = async () => {
    if (isTesting) return;
    setIsTesting(true);
    try {
      const res = await fetch(`${serverUrl}/api/streamer/test-alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (res.ok) {
        addToast("Test alert sent successfully!", "success");
      } else {
        throw new Error("Failed to send test alert");
      }
    } catch (err) {
      console.error("Test alert failed:", err);
      addToast("Failed to send test alert. Please try again.", "error");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="text-foreground">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <p className="text-sm text-orange-500 font-bold uppercase tracking-[0.2em] mb-2">Creator Overview</p>
          <h1 className="text-4xl font-heading font-black text-foreground tracking-tight">
            Namaste, {user?.username || "Streamer"} 🙏
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={resetDonations}
            className="bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-500 px-6 py-3 rounded-xl font-bold transition-all shadow-sm"
          >
            Reset Stream
          </button>
          <button
            onClick={sendTestAlert}
            disabled={isTesting}
            className="bg-surface border border-surface-border hover:border-orange-500/40 text-text-muted hover:text-orange-400 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 shadow-sm"
          >
            {isTesting ? "Sending..." : "Test Alert"}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface border border-surface-border p-8 rounded-[2rem] md:col-span-2 shadow-sm hover:border-orange-500/10 transition-colors">
          <p className="text-sm text-text-muted uppercase tracking-widest font-bold mb-3 opacity-50">Total Earnings</p>
          <p className="text-5xl font-heading font-black text-foreground">
            रू {stats.totalEarnings.toLocaleString()}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full font-bold">NPR</span>
            <span className="text-xs text-text-muted font-medium opacity-60">All time revenue</span>
          </div>
        </div>
        <div className="bg-surface border border-surface-border p-8 rounded-[2rem] shadow-sm hover:border-orange-500/10 transition-colors">
          <p className="text-sm text-text-muted uppercase tracking-widest font-bold mb-3 opacity-50">Supporters</p>
          <p className="text-5xl font-heading font-black text-foreground">{stats.recentSupporters}</p>
          <p className="text-xs text-text-muted font-medium opacity-60 mt-4">Last 24 hours</p>
        </div>
        <div className="bg-surface border border-surface-border p-8 rounded-[2rem] shadow-sm flex flex-col justify-between hover:border-orange-500/10 transition-colors">
          <p className="text-sm text-text-muted uppercase tracking-widest font-bold mb-4 opacity-50">Withdraw</p>
          <div className="space-y-3">
            <button className="w-full bg-background border border-surface-border hover:border-orange-500/30 text-sm font-bold py-3 rounded-xl transition-all text-text-muted hover:text-orange-400">
              eSewa
            </button>
            <button className="w-full bg-background border border-surface-border hover:border-orange-500/30 text-sm font-bold py-3 rounded-xl transition-all text-text-muted hover:text-orange-400">
              Khalti
            </button>
          </div>
        </div>
      </div>

      {/* Links Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main OBS Overlay */}
        <div className="bg-linear-to-br from-orange-500/5 to-transparent border border-orange-500/20 p-8 rounded-[2rem] shadow-sm group">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <p className="text-sm text-orange-400 uppercase tracking-widest font-black">Main Alert Overlay</p>
          </div>
          <p className="text-sm text-text-muted font-mono truncate mb-6 bg-background/50 p-4 rounded-xl border border-surface-border">{overlayUrl}</p>
          <button
            onClick={copyOverlayPath}
            className="w-full bg-orange-500 hover:bg-orange-400 text-black text-sm font-black py-4 rounded-2xl uppercase tracking-widest transition-all hover:scale-[1.02] shadow-lg shadow-orange-500/20"
          >
            Copy Alert URL
          </button>
        </div>

        {/* Top 5 OBS Overlay */}
        <div className="bg-linear-to-br from-yellow-500/5 to-transparent border border-yellow-500/20 p-8 rounded-[2rem] shadow-sm group">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <p className="text-sm text-yellow-500 uppercase tracking-widest font-black">Top 5 Overlay</p>
          </div>
          <p className="text-sm text-text-muted font-mono truncate mb-6 bg-background/50 p-4 rounded-xl border border-surface-border">{topOverlayUrl}</p>
          <button
            onClick={copyTopOverlayPath}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-black py-4 rounded-2xl uppercase tracking-widest transition-all hover:scale-[1.02] shadow-lg shadow-yellow-500/20"
          >
            Copy Top 5 URL
          </button>
        </div>

        {/* Donation Link */}
        <div className="bg-surface border border-surface-border p-8 rounded-[2rem] shadow-sm group">
          <p className="text-sm text-text-muted uppercase tracking-widest font-bold mb-4 opacity-50">Public Donation Link</p>
          <p className="text-sm text-orange-400 font-mono truncate mb-6 bg-background/50 p-4 rounded-xl border border-surface-border">{donationUrl}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={copyDonationPath}
              className="bg-background border border-surface-border hover:border-orange-500/30 text-sm text-text-muted hover:text-foreground font-bold py-4 rounded-2xl uppercase tracking-widest transition-all"
            >
              Copy Link
            </button>
            <button
              onClick={downloadQR}
              className="bg-background border border-surface-border hover:border-orange-500/30 text-sm text-orange-500 hover:bg-orange-500 hover:text-black font-bold py-4 rounded-2xl uppercase tracking-widest transition-all"
            >
              Download QR
            </button>
          </div>

          {/* Hidden QR for Canvas */}
          <div ref={qrRef} className="hidden">
            <QRCodeCanvas 
              value={donationUrl} 
              size={512}
              level={"H"}
              includeMargin={true}
            />
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-surface border border-surface-border rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-surface-border flex items-center justify-between">
          <p className="text-lg font-heading font-black uppercase tracking-tight">Recent Donations</p>
          <button className="text-sm text-orange-500 font-bold hover:text-orange-400 transition-colors flex items-center gap-2 group">
            View All History <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-surface-border bg-foreground/[0.02]">
                {["Supporter", "Amount", "Message", "Status"].map(h => (
                  <th key={h} className="px-8 py-5 text-xs text-text-muted uppercase tracking-widest font-black opacity-50">{h}</th>
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
                      <div className="max-w-[300px] truncate">"{d.message}"</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-xs px-3 py-1 rounded-full uppercase tracking-widest font-black ${d.status === "verified"
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        }`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-16 text-center text-sm text-text-muted font-medium">
                    No donations yet. Keep streaming! 🚀
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