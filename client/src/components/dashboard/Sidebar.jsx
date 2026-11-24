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
} from "@hugeicons/core-free-icons";

const menuItems = [
  { name: "Overview", path: "/dashboard", icon: Home01Icon },
  { name: "Donations History", path: "/dashboard/history", icon: Invoice01Icon },
  { name: "Customize Page", path: "/dashboard/customize", icon: PaintBoardIcon },
  { name: "Alerts & OBS", path: "/dashboard/settings", icon: Settings01Icon },
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
        className="fixed top-4 right-4 z-50 md:hidden p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white transition-colors"
        aria-label="Toggle Navigation"
      >
        <Icon icon={isOpen ? Cancel01Icon : Menu01Icon} size={20} />
      </button>

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 w-64 h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 pb-4 border-b border-zinc-800">
            <Link href="/" className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Superchat Nepal"
                className="w-8 h-8 rounded-lg object-contain bg-violet-600"
              />
              <div>
                <span className="text-sm font-heading font-black tracking-wider uppercase text-white block">
                  Superchat NP
                </span>
                <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1.5 font-bold">
                  <Icon icon={Radio01Icon} size={12} className="text-emerald-400" />
                  Live System
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest px-3 mb-2 font-black">
              Streamer Portal
            </p>
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-zinc-800 text-white border border-zinc-700"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon icon={item.icon} size={18} className={isActive ? "text-violet-400" : "text-zinc-400"} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Account / Logout */}
        <div className="p-4 border-t border-zinc-800 space-y-2">
          {user && (
            <div className="px-3 py-2 bg-zinc-900 rounded-lg border border-zinc-800 mb-2">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Signed in</p>
              <p className="text-xs text-white font-mono truncate">{user.email}</p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs text-zinc-400 hover:text-red-400 hover:bg-zinc-900 rounded-lg transition-colors uppercase tracking-wider font-bold"
          >
            <Icon icon={Logout01Icon} size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/80 z-30 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
