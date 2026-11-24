"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme, setTheme } = useTheme();

  return (
    <div
      className={`inline-flex items-center bg-slate-100 dark:bg-[#181C28] p-1 rounded-xl border border-[#E5EAF1] dark:border-[#222736] text-xs font-semibold select-none ${className}`}
    >
      <button
        type="button"
        onClick={() => setTheme ? setTheme("light") : toggleTheme()}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
          theme === "light"
            ? "bg-white text-[#1D1D20] shadow-xs font-bold"
            : "text-[#777B87] hover:text-[#1D1D20]"
        }`}
        aria-label="Switch to light mode"
      >
        <span>☀️</span>
        <span className="hidden sm:inline">Light</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme ? setTheme("dark") : toggleTheme()}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
          theme === "dark"
            ? "bg-[#222736] text-white shadow-xs font-bold"
            : "text-[#777B87] hover:text-white"
        }`}
        aria-label="Switch to dark mode"
      >
        <span>🌙</span>
        <span className="hidden sm:inline">Dark</span>
      </button>
    </div>
  );
}

