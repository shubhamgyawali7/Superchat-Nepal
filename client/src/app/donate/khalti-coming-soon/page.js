"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/common/Icon";
import { Wallet01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";

export default function KhaltiComingSoon() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 text-center selection:bg-violet-900">
      <div className="bg-zinc-950 border border-zinc-800 p-8 sm:p-10 rounded-2xl max-w-md w-full space-y-6">
        <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center mx-auto text-purple-400">
          <Icon icon={Wallet01Icon} size={28} />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 bg-zinc-900 px-3 py-1 rounded border border-zinc-800">
            Khalti Gateway
          </span>
          <h1 className="text-2xl font-heading font-black text-white uppercase tracking-tight mt-3">
            Sandbox Active
          </h1>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            Khalti payment is now active in sandbox mode on the streamer donation form.
          </p>
          <div className="mt-4 p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300 font-medium flex items-center justify-center gap-2">
            <Icon icon={InformationCircleIcon} size={16} className="text-violet-400" />
            <span>Select Khalti directly on the donation form to test.</span>
          </div>
        </div>

        <button
          onClick={() => router.back()}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors"
        >
          Back to Donation
        </button>
      </div>
    </div>
  );
}
