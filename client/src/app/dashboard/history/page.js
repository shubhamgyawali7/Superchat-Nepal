import React from 'react';
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function HistoryPage() {
  const supabase = await createClient();

  // 1. Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // 2. Fetch All Donations for this streamer
  const { data: donations, error: dError } = await supabase
    .from("donations")
    .select("*")
    .eq("streamer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Donation History</h1>
            <p className="text-slate-400 text-sm mt-1">View and manage all your received donations</p>
          </div>
          <button className="bg-slate-800 px-4 py-2 rounded text-sm hover:bg-slate-700 transition-colors">
            Export CSV
          </button>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Donor</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Method</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {donations?.length > 0 ? (
                donations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium">{item.supporter_name}</td>
                    <td className="px-6 py-4 text-emerald-400 font-bold">रू {item.amount}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300 border border-slate-700 uppercase">
                        {item.payment_gateway}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                        item.status === 'verified' 
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate italic">
                      "{item.message}"
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500 italic">
                    No donations found yet.
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