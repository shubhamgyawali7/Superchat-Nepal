"use client";
import React, { useState } from "react";
import { useToast } from "@/hooks/useToast";

export default function DashboardClient({ user, stats, serverUrl, overlayUrl, donationUrl }) {
  const { addToast } = useToast();
  const [isTesting, setIsTesting] = useState(false);

  const copyOverlayPath = () => {
    navigator.clipboard.writeText(overlayUrl);
    addToast("Overlay URL copied to clipboard!", "success");
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-7">
        <div>
          <p className="text-[10px] text-text-muted uppercase tracking-widest mb-0.5">Dashboard</p>
          <h1 className="text-xl font-bold text-foreground heading">
            Namaste, {user?.username || "Streamer"} 🙏
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={sendTestAlert}
            disabled={isTesting}
            className="text-xs border border-surface-border hover:border-orange-500/40 text-text-muted hover:text-orange-400 px-3 py-2 rounded transition-all disabled:opacity-50"
          >
            {isTesting ? "Sending..." : "Test Alert"}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="bg-surface border border-surface-border p-4 rounded-lg col-span-2">
          <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Total Earnings</p>
          <p className="text-2xl font-bold text-foreground heading">
            रू {stats.totalEarnings.toLocaleString()}
          </p>
          <p className="text-[10px] text-text-muted opacity-60 mt-1">NPR · All time</p>
        </div>
        <div className="bg-surface border border-surface-border p-4 rounded-lg">
          <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Supporters</p>
          <p className="text-2xl font-bold text-foreground heading">{stats.recentSupporters}</p>
          <p className="text-[10px] text-text-muted opacity-60 mt-1">Last 24h</p>
        </div>
        <div className="bg-surface border border-surface-border p-4 rounded-lg flex flex-col justify-between">
          <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2">Withdraw</p>
          <div className="space-y-1.5">
            <button className="w-full bg-background border border-surface-border hover:border-orange-500/30 text-xs py-1.5 rounded transition-all text-text-muted hover:text-orange-400">
              eSewa
            </button>
            <button className="w-full bg-background border border-surface-border hover:border-orange-500/30 text-xs py-1.5 rounded transition-all text-text-muted hover:text-orange-400">
              Khalti
            </button>
          </div>
        </div>
      </div>

      {/* Links Row */}
      <div className="grid md:grid-cols-2 gap-3 mb-5">
        {/* OBS Overlay */}
        <div className="bg-surface border border-orange-500/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
            <p className="text-[10px] text-orange-400 uppercase tracking-widest font-bold">OBS Overlay URL</p>
          </div>
          <p className="text-xs text-text-muted font-mono truncate mb-3">{overlayUrl}</p>
          <div className="flex gap-2">
            <button
              onClick={copyOverlayPath}
              className="flex-1 bg-orange-500 hover:bg-orange-400 text-black text-xs font-bold py-1.5 rounded uppercase tracking-wide transition-all"
            >
              Copy URL
            </button>
          </div>
        </div>

        {/* Donation Link */}
        <div className="bg-surface border border-surface-border p-4 rounded-lg">
          <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2">Public Donation Link</p>
          <p className="text-xs text-orange-400 font-mono truncate mb-3">{donationUrl}</p>
          <div className="flex gap-2">
            <button
              onClick={copyDonationPath}
              className="flex-1 bg-background border border-surface-border hover:border-orange-500/30 text-xs text-text-muted hover:text-foreground py-1.5 rounded uppercase tracking-wide transition-all"
            >
              Copy Link
            </button>
            <a
              href={donationUrl}
              target="_blank"
              className="px-3 bg-background border border-surface-border hover:border-orange-500/30 text-xs text-text-muted hover:text-orange-400 py-1.5 rounded uppercase tracking-wide transition-all"
            >
              Preview
            </a>
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-surface border border-surface-border rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-surface-border flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest heading">Recent Donations</p>
          <button className="text-[10px] text-orange-500/70 hover:text-orange-400 uppercase tracking-widest transition-colors">
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-surface-border">
                {["Supporter", "Amount", "Message", "Status"].map(h => (
                  <th key={h} className="px-5 py-3 text-[10px] text-text-muted uppercase tracking-widest font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recentDonations.length > 0 ? (
                stats.recentDonations.map((d) => (
                  <tr key={d.id} className="border-b border-surface-border hover:bg-foreground/5 transition-colors">
                    <td className="px-5 py-3 text-sm font-bold">{d.supporter_name}</td>
                    <td className="px-5 py-3 text-sm text-orange-500 font-bold">रू {d.amount}</td>
                    <td className="px-5 py-3 text-xs text-text-muted italic max-w-[200px] truncate">"{d.message}"</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wide font-bold ${d.status === "verified"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-amber-500/10 text-amber-500"
                        }`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center text-xs text-text-muted">
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