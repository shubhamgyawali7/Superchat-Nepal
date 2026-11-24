"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "motion/react";
import Icon from "@/components/common/Icon";
import {
  Home01Icon,
  Invoice01Icon,
  PaintBoardIcon,
  Settings01Icon,
  Logout01Icon,
  Menu01Icon,
  Cancel01Icon,
  Radio01Icon,
  Tv01Icon,
  Notification01Icon,
  Calendar01Icon,
} from "@hugeicons/core-free-icons";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: Home01Icon },
  { name: "Donations", path: "/dashboard/history", icon: Invoice01Icon, badge: true },
  { name: "Customize", path: "/dashboard/customize", icon: PaintBoardIcon },
  { name: "Alerts & OBS", path: "/dashboard/settings", icon: Tv01Icon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 md:hidden p-2.5 bg-orange-500 text-white rounded-2xl shadow-lg transition-transform active:scale-95"
        aria-label="Toggle Navigation"
      >
        <Icon icon={isOpen ? Cancel01Icon : Menu01Icon} size={20} />
      </button>

      {/* Curved Orange Dock Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 w-[84px] h-screen md:h-auto md:min-h-full bg-gradient-to-b from-orange-500 via-orange-500 to-orange-600 flex flex-col items-center justify-between py-6 px-3 transition-transform duration-200 ease-in-out select-none shadow-xl md:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Top: Logo & Main Navigation */}
        <div className="flex flex-col items-center space-y-6 w-full">
          {/* Logo Brand Squircle */}
          <Link
            href="/"
            className="w-12 h-12 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center p-2 transition-all hover:scale-105 shadow-sm group relative"
            title="Superchat Nepal"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full h-full object-contain filter drop-shadow"
            />
            {/* Tooltip */}
            <span className="absolute left-16 bg-zinc-900 text-white text-xs font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
              Superchat Nepal
            </span>
          </Link>

          <div className="w-8 h-[1px] bg-white/20" />

          {/* Navigation Items */}
          <nav className="flex flex-col items-center space-y-3 w-full">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all group ${
                    isActive
                      ? "bg-white text-orange-600 shadow-lg shadow-orange-700/20 scale-105"
                      : "text-white/80 hover:text-white hover:bg-white/15"
                  }`}
                >
                  <Icon icon={item.icon} size={22} />

                  {/* Notification Dot / Badge */}
                  {item.badge && !isActive && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-orange-500" />
                  )}

                  {/* Tooltip */}
                  <span className="absolute left-16 bg-zinc-900 text-white text-xs font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Profile & Logout */}
        <div className="flex flex-col items-center space-y-4 w-full">
          {/* User Initial Avatar */}
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white font-black text-sm flex items-center justify-center shadow-sm">
              {user?.username ? user.username.charAt(0).toUpperCase() : "S"}
            </div>
            {/* Tooltip */}
            <span className="absolute left-16 bg-zinc-900 text-white text-xs font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
              @{user?.username || "Streamer"}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-2xl text-white/70 hover:text-white hover:bg-white/20 flex items-center justify-center transition-colors group relative"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <Icon icon={Logout01Icon} size={18} />
            <span className="absolute left-16 bg-zinc-900 text-white text-xs font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
