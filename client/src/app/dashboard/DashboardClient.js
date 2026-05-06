"use client";
import React, { useState } from "react";

export default function DashboardClient({ user, stats, serverUrl, overlayUrl, donationUrl }) {
  const [copiedOverlay, setCopiedOverlay] = useState(false);
  const [copiedDonation, setCopiedDonation] = useState(false);

  const copyOverlayPath = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopiedOverlay(true);
    setTimeout(() => setCopiedOverlay(false), 2000);
  };

  const copyDonationPath = () => {
    navigator.clipboard.writeText(donationUrl);
    setCopiedDonation(true);
    setTimeout(() => setCopiedDonation(false), 2000);
  };

  const sendTestAlert = async () => {
    try {
      const res = await fetch(`${serverUrl}/api/streamer/test-alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        alert("Test alert sent! Check your OBS/Overlay tab.");
      }
    } catch (err) {
      console.error("Test alert failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 lg:p-8">
      {/* Header Area */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Namaste, {user?.username || "Streamer"}! 🙏
          </h1>
          <p className="text-slate-400 text-sm">
            Here is what's happening with your stream today.
          </p>
        </div>

        {/* OBS Overlay Link Box */}
        <div className="bg-slate-900 border border-orange-500/30 p-4 rounded-xl flex items-center gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-orange-500 font-bold">
              Your OBS Overlay URL
            </p>
            <p className="text-xs text-slate-400 truncate max-w-[200px]">
              {overlayUrl}
            </p>
          </div>
          <button
            onClick={copyOverlayPath}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
          >
            {copiedOverlay ? "Copied!" : "Copy Link"}
          </button>
          <button
            onClick={sendTestAlert}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all border border-white/5"
          >
            Test Alert
          </button>
        </div>
      </header>

      {/* Sharing Section */}
      <section className="max-w-7xl mx-auto mb-10">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center text-2xl">
              🔗
            </div>
            <div>
              <h3 className="font-bold text-white">Your Public Donation Link</h3>
              <p className="text-slate-400 text-xs">Share this link with your viewers to start receiving superchats.</p>
              <p className="text-orange-500 font-mono text-sm mt-1">{donationUrl}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={copyDonationPath}
              className="bg-white text-black hover:bg-slate-200 px-6 py-3 rounded-xl font-black transition-all active:scale-95"
            >
              {copiedDonation ? "COPIED TO CLIPBOARD!" : "COPY SHARING LINK"}
            </button>
            <a 
              href={donationUrl} 
              target="_blank" 
              className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
            >
              PREVIEW PAGE
            </a>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <p className="text-slate-400 text-sm">Total Earnings (NPR)</p>
          <h3 className="text-4xl font-black text-white mt-2">
            रू {stats.totalEarnings.toLocaleString()}
          </h3>
          <p className="text-green-500 text-xs mt-2">↑ 0% from last stream</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <p className="text-slate-400 text-sm">Recent Supporters</p>
          <h3 className="text-4xl font-black text-white mt-2">
            {stats.recentSupporters}
          </h3>
          <p className="text-slate-500 text-xs mt-2">Last 24 hours</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-center">
          <button className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-bold mb-2">
            Withdraw to eSewa
          </button>
          <button className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-bold">
            Withdraw to Khalti
          </button>
        </div>

        {/* Recent Donations Table */}
        <div className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-lg">Recent Donations</h3>
            <button className="text-orange-500 text-sm hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-sm uppercase bg-slate-950/50">
                  <th className="px-6 py-4 font-medium">Supporter</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Message</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {stats.recentDonations.length > 0 ? (
                  stats.recentDonations.map((donation) => (
                    <tr key={donation.id}>
                      <td className="px-6 py-4 font-bold">{donation.supporter_name}</td>
                      <td className="px-6 py-4 text-orange-500 font-bold">
                        रू {donation.amount}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm italic">
                        "{donation.message}"
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            donation.status === "verified"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-yellow-500/10 text-yellow-500"
                          }`}
                        >
                          {donation.status.charAt(0).toUpperCase() +
                            donation.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-slate-500">
                      No donations found yet. Keep streaming! 🚀
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
