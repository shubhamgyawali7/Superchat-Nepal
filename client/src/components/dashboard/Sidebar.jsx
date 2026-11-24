"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "motion/react";
import Icon from "@/components/common/Icon";
import {
  Home01Icon,
  Invoice01Icon,
  PaintBoardIcon,
  Tv01Icon,
  Radio01Icon,
  Logout01Icon,
  Menu01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: Home01Icon },
  { name: "Donations & Superchats", path: "/dashboard/history", icon: Invoice01Icon, badge: true },
  { name: "Page Customization", path: "/dashboard/customize", icon: PaintBoardIcon },
  { name: "Alerts & OBS Settings", path: "/dashboard/settings", icon: Tv01Icon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      {/* Mobile Top Header with Hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white/95 dark:bg-[#11131A]/95 backdrop-blur-md border-b border-[#E5EAF1] dark:border-[#222736] flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Superchat Nepal" className="w-7 h-7 object-contain" />
          <span className="font-heading font-extrabold text-sm tracking-tight text-[#1D1D20] dark:text-[#F4F5F8]">
            Superchat<span className="text-[#FF4D0A]">.np</span>
          </span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl text-[#777B87] hover:text-[#1D1D20] dark:hover:text-white bg-slate-100 dark:bg-[#1A1E2B] transition-colors"
          aria-label="Toggle Navigation"
        >
          <Icon icon={isOpen ? Cancel01Icon : Menu01Icon} size={18} />
        </button>
      </div>

      {/* Sidebar Desktop Dock / Mobile Drawer */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-30 w-20 h-screen bg-white dark:bg-[#11131A] border-r border-[#E5EAF1] dark:border-[#222736] flex flex-col items-center justify-between py-6 px-3 select-none transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Top: Logo & Main Navigation */}
        <div className="flex flex-col items-center space-y-6 w-full">
          {/* Logo Squircle */}
          <Link
            href="/"
            className="w-11 h-11 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200/80 dark:border-orange-500/20 flex items-center justify-center p-2 transition-all hover:scale-105 group relative"
            aria-label="Superchat Nepal Home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
            {/* Tooltip */}
            <span className="absolute left-[calc(100%+14px)] bg-zinc-900 text-white dark:bg-zinc-800 text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
              Superchat Nepal
            </span>
          </Link>

          <div className="w-8 h-[1px] bg-[#E5EAF1] dark:bg-[#222736]" />

          {/* Navigation Items */}
          <nav className="flex flex-col items-center space-y-2.5 w-full">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all group ${
                    isActive
                      ? "bg-orange-50 dark:bg-orange-500/15 text-[#FF4D0A] border border-orange-200/80 dark:border-orange-500/30 shadow-xs font-bold"
                      : "text-[#777B87] dark:text-[#949AA8] hover:text-[#1D1D20] dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-[#181C28]"
                  }`}
                  aria-label={item.name}
                >
                  <Icon icon={item.icon} size={20} />

                  {/* Active Indicator Pip */}
                  {isActive && (
                    <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[#FF4D0A]" />
                  )}

                  {/* Notification Dot */}
                  {item.badge && !isActive && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#11131A]" />
                  )}

                  {/* Hover Tooltip */}
                  <span className="absolute left-[calc(100%+14px)] bg-zinc-900 text-white dark:bg-zinc-800 text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom: OBS Status, Profile & Logout */}
        <div className="flex flex-col items-center space-y-3.5 w-full">
          {/* OBS Live Status Indicator */}
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group relative cursor-pointer"
            title="OBS Status: Connected"
          >
            <Icon icon={Radio01Icon} size={17} className="animate-pulse" />
            <span className="absolute left-[calc(100%+14px)] bg-zinc-900 text-white dark:bg-zinc-800 text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
              OBS Live: Connected
            </span>
          </div>

          {/* User Avatar */}
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#1A1E2B] border border-[#E5EAF1] dark:border-[#222736] text-[#1D1D20] dark:text-[#F4F5F8] font-bold text-xs flex items-center justify-center transition-colors group-hover:border-orange-300 dark:group-hover:border-orange-500/40">
              {user?.username ? user.username.charAt(0).toUpperCase() : "S"}
            </div>
            {/* Tooltip */}
            <span className="absolute left-[calc(100%+14px)] bg-zinc-900 text-white dark:bg-zinc-800 text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
              @{user?.username || "Streamer"}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl text-[#777B87] dark:text-[#949AA8] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center justify-center transition-colors group relative"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <Icon icon={Logout01Icon} size={18} />
            <span className="absolute left-[calc(100%+14px)] bg-zinc-900 text-white dark:bg-zinc-800 text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
