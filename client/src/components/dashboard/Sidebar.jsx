"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  { name: "Overview", path: "/dashboard", icon: "📊" },
  { name: "Donations History", path: "/dashboard/history", icon: "📜" },
  { name: "Customize Page", path: "/dashboard/customize", icon: "🎨" },
  { name: "Alerts & OBS", path: "/dashboard/settings", icon: "⚙️" },
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
        className="fixed top-4 right-4 z-50 md:hidden p-2.5 bg-[#0e1424] border border-white/10 rounded-2xl shadow-xl text-white transition-all active:scale-95"
        aria-label="Toggle Navigation"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        )}
      </button>

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 w-64 h-screen bg-[#090d18] border-r border-white/[0.08] flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 pb-4 border-b border-white/[0.06]">
            <Link href="/" className="flex items-center gap-3 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Superchat Nepal"
                className="w-8 h-8 rounded-xl object-contain shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform"
              />
              <div>
                <span className="text-sm font-heading font-black tracking-wider uppercase text-white block">
                  Superchat NP
                </span>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1.5 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live System
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest px-3 mb-2 font-black">
              Streamer Portal
            </p>
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500/15 to-transparent text-orange-400 border border-orange-500/30 shadow-inner"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Account / Logout */}
        <div className="p-4 border-t border-white/[0.06] space-y-2">
          {user && (
            <div className="px-3 py-2 bg-white/[0.03] rounded-xl border border-white/[0.06] mb-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Signed in</p>
              <p className="text-xs text-white font-mono truncate">{user.email}</p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs text-red-400/80 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all uppercase tracking-wider font-bold"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
