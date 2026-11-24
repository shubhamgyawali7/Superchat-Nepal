"use client";

import React from "react";
import Icon from "@/components/common/Icon";

export default function StatCard({
  label,
  value,
  prefix = "",
  suffix = "",
  subtext,
  icon,
  iconColor = "text-[#FF4D0A]",
  iconBg = "bg-orange-50 dark:bg-orange-500/10",
  trend,
  className = "",
}) {
  return (
    <div
      className={`bg-white dark:bg-[#131620] border border-[#E5EAF1] dark:border-[#222736] rounded-2xl p-5 shadow-xs transition-all hover:border-slate-300 dark:hover:border-zinc-700 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[#777B87] dark:text-[#949AA8] uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <div className={`w-9 h-9 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
            <Icon icon={icon} size={18} />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5">
        {prefix && (
          <span className="text-lg font-heading font-bold text-[#777B87] dark:text-[#949AA8]">
            {prefix}
          </span>
        )}
        <span className="text-2xl sm:text-3xl font-heading font-extrabold text-[#1D1D20] dark:text-[#F4F5F8] tracking-tight">
          {value}
        </span>
        {suffix && (
          <span className="text-xs font-semibold text-[#777B87] dark:text-[#949AA8]">
            {suffix}
          </span>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-2.5 flex items-center justify-between text-xs text-[#777B87] dark:text-[#949AA8]">
          <span>{subtext}</span>
          {trend && (
            <span
              className={`font-semibold ${
                trend.startsWith("+")
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-[#777B87] dark:text-[#949AA8]"
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

