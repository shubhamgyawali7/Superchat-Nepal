"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function KhaltiComingSoon() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
      <div className="bg-slate-900 border border-purple-500/30 p-10 rounded-3xl max-w-md shadow-[0_0_50px_rgba(168,85,247,0.1)]">
        <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl text-white font-bold">K</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">
          Coming Soon
        </h1>
        <p className="text-slate-400 mb-2">
          Khalti payment integration is currently <span className="text-purple-400 font-bold">under development</span>.
        </p>
        <p className="text-slate-500 text-sm mb-8">
          Please use <span className="text-green-400 font-bold">eSewa</span> to complete your donation for now.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-900/20"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
