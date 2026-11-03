"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function KhaltiComingSoon() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#070a13] text-white flex items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 bg-[#0c1220]/90 backdrop-blur-2xl border border-white/[0.08] p-8 sm:p-10 rounded-3xl max-w-md w-full shadow-2xl space-y-6">
        <div className="w-20 h-20 bg-purple-500/15 border border-purple-500/30 rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-lg shadow-purple-500/20">
          🟣
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
            Khalti Gateway
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-tight mt-3">
            Coming Very Soon
          </h1>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Khalti payment gateway integration is currently in testing and will be live shortly.
          </p>
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 font-medium">
            💡 Tip: Please use <strong className="text-white">eSewa</strong> to send superchats right now!
          </div>
        </div>

        <button
          onClick={() => router.back()}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-black py-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 hover:scale-[1.02]"
        >
          ← Back to Donation
        </button>
      </div>
    </div>
  );
}
