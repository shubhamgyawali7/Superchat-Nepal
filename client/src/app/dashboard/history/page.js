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
          <p className="text-xs text-violet-400 uppercase tracking-widest font-black mb-1">
            Dashboard / Analytics
          </p>
          <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-white">
            Donation History
          </h1>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-1">
            Total Donations
          </p>
          <p className="text-2xl sm:text-3xl font-heading font-black text-violet-400">
            रू {totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-1">
            Total Superchats
          </p>
          <p className="text-2xl sm:text-3xl font-heading font-black text-white">
            {donations.length}
          </p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-1">
            Average Amount
          </p>
          <p className="text-2xl sm:text-3xl font-heading font-black text-emerald-400">
            रू {avgAmount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-white">
            All Transactions
          </h2>
          <span className="text-xs text-zinc-400 font-mono">
            {donations.length} record{donations.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900">
                {["Date", "Supporter", "Amount", "Gateway", "Status", "Message"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-xs text-zinc-400 uppercase tracking-wider font-black"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {donations.length > 0 ? (
                donations.map((d) => (
                  <tr key={d.id} className="hover:bg-zinc-900 transition-colors">
                    <td className="px-6 py-4 text-xs text-zinc-400 font-mono">
                      {new Date(d.created_at || d.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-white">
                      {d.supporter_name || d.supporterName}
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-violet-400">
                      रू {d.amount}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold uppercase text-zinc-300">
                      {d.gateway}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-wider border ${
                          d.status === "verified"
                            ? "bg-zinc-900 text-emerald-400 border-zinc-800"
                            : "bg-zinc-900 text-indigo-400 border-zinc-800"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-400 italic max-w-xs truncate">
                      {d.message ? `"${d.message}"` : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-xs text-zinc-500 font-medium">
                    No transactions recorded yet.
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
