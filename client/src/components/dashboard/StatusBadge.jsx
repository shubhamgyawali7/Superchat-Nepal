"use client";

import React from "react";

const badgeStyles = {
  verified: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-500/20",
  pending: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/80 dark:border-amber-500/20",
  failed: "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200/80 dark:border-rose-500/20",
  active: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-500/20",
  default: "bg-slate-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700",
};

export default function StatusBadge({ status, label, className = "" }) {
  const normalized = (status || "").toLowerCase();
  const style = badgeStyles[normalized] || badgeStyles.default;
  const display = label || status;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border uppercase ${style} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          normalized === "verified" || normalized === "active"
            ? "bg-emerald-500"
            : normalized === "pending"
            ? "bg-amber-500"
            : normalized === "failed"
            ? "bg-rose-500"
            : "bg-zinc-400"
        }`}
      />
      {display}
    </span>
  );
}

