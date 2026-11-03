import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser, serverFetch } from "@/lib/serverApi";

export default async function HistoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const res = await serverFetch("/api/streamer/donations");
  const donations = res.ok ? await res.json() : [];

  const totalAmount = donations.reduce((s, d) => s + (parseFloat(d.amount) || 0), 0);
  const avgAmount = donations.length > 0 ? Math.round(totalAmount / donations.length) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-orange-400 uppercase tracking-widest font-black mb-1">
            Dashboard / Analytics
          </p>
          <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-white">
            Donation History
          </h1>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0c1220] border border-white/[0.08] p-5 rounded-2xl">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">
            Total Donations
          </p>
          <p className="text-2xl sm:text-3xl font-heading font-black text-orange-500">
            रू {totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#0c1220] border border-white/[0.08] p-5 rounded-2xl">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">
            Total Superchats
          </p>
          <p className="text-2xl sm:text-3xl font-heading font-black text-white">
            {donations.length}
          </p>
        </div>
        <div className="bg-[#0c1220] border border-white/[0.08] p-5 rounded-2xl">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">
            Average Amount
          </p>
          <p className="text-2xl sm:text-3xl font-heading font-black text-emerald-400">
            रू {avgAmount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#0c1220] border border-white/[0.08] rounded-3xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-white">
            All Transactions
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {donations.length} record{donations.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                {["Date", "Supporter", "Amount", "Gateway", "Status", "Message"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-xs text-slate-400 uppercase tracking-wider font-black"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {donations.length > 0 ? (
                donations.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4 text-xs text-slate-400 font-mono whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-white whitespace-nowrap">
                      {item.supporter_name}
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-orange-400 whitespace-nowrap">
                      रू {item.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs bg-white/[0.05] border border-white/10 px-2.5 py-1 rounded-lg uppercase tracking-wider font-bold text-slate-300">
                        {item.payment_gateway || "eSewa"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-black ${
                          item.status === "verified"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-300 max-w-xs truncate italic">
                      {item.message ? `"${item.message}"` : <span className="opacity-40">No message</span>}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-sm text-slate-400 font-medium">
                    No donation records found yet. Once viewers donate on your stream, they will appear here! 🚀
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
