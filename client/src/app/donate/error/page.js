"use client";
import React from "react";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-[#070a13] text-white flex items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 bg-[#0c1220]/90 backdrop-blur-2xl border border-white/[0.08] p-8 sm:p-10 rounded-3xl max-w-md w-full shadow-2xl space-y-6">
        <div className="w-20 h-20 bg-red-500/15 border border-red-500/30 rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-lg shadow-red-500/20">
          ❌
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-tight">
            Payment Unsuccessful
          </h1>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            The transaction was cancelled or could not be completed. No money was deducted from your wallet.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-black py-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 hover:scale-[1.02]"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="block w-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
