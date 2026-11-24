"use client";

import React from "react";
import Link from "next/link";
import Icon from "@/components/common/Icon";
import { Alert01Icon } from "@hugeicons/core-free-icons";

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 text-center selection:bg-violet-900">
      <div className="bg-zinc-950 border border-zinc-800 p-8 sm:p-10 rounded-2xl max-w-md w-full space-y-6">
        <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center mx-auto text-red-400">
          <Icon icon={Alert01Icon} size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-black text-white uppercase tracking-tight">
            Payment Unsuccessful
          </h1>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            The transaction was cancelled or could not be completed. No money was deducted from your account.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={() => window.history.back()}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="block w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
