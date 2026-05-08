import React from 'react';
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function HistoryPage() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/login");

  const { data: donations } = await supabase
    .from("donations")
    .select("*")
    .eq("streamer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="text-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');`}</style>

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] text-text-muted uppercase tracking-widest mb-0.5">Dashboard / History</p>
          <h1 className="text-xl font-bold uppercase tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            Donation History
          </h1>
        </div>
        <button className="text-xs border border-surface-border hover:border-orange-500/30 text-text-muted hover:text-orange-400 px-3 py-2 rounded uppercase tracking-widest transition-all">
          Export CSV
        </button>
      </div>

      {/* Summary strip */}
      {donations && donations.length > 0 && (
        <div className="flex gap-3 mb-5">
          <div className="bg-surface border border-surface-border px-4 py-2.5 rounded text-sm">
            <span className="text-text-muted text-[10px] uppercase tracking-widest mr-2">Total</span>
            <span className="font-bold text-orange-500">
              रू {donations.reduce((s, d) => s + (d.amount || 0), 0).toLocaleString()}
            </span>
          </div>
          <div className="bg-surface border border-surface-border px-4 py-2.5 rounded text-sm">
            <span className="text-text-muted text-[10px] uppercase tracking-widest mr-2">Records</span>
            <span className="font-bold">{donations.length}</span>
          </div>
        </div>
      )}

      <div className="bg-surface border border-surface-border rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-surface-border">
              {["Date", "Donor", "Amount", "Method", "Status", "Message"].map(h => (
                <th key={h} className="px-5 py-3 text-[10px] text-text-muted uppercase tracking-widest font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {donations?.length > 0 ? (
              donations.map((item) => (
                <tr key={item.id} className="border-b border-surface-border hover:bg-foreground/5 transition-colors">
                  <td className="px-5 py-3 text-xs text-text-muted">
                    {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3 text-sm font-bold">{item.supporter_name}</td>
                  <td className="px-5 py-3 text-sm text-orange-500 font-bold">रू {item.amount}</td>
                  <td className="px-5 py-3">
                    <span className="text-[10px] bg-background border border-surface-border px-2 py-0.5 rounded uppercase tracking-wide text-text-muted">
                      {item.payment_gateway}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wide font-bold ${item.status === 'verified'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-amber-500/10 text-amber-500'
                      }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-text-muted max-w-[160px] truncate italic">"{item.message}"</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-5 py-12 text-center text-xs text-text-muted">
                  No donations found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

}