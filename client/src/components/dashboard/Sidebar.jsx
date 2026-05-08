"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';

const menuItems = [
  { name: 'Overview', path: '/dashboard', icon: '📊' },
  { name: 'Donation History', path: '/dashboard/history', icon: '📜' },
  { name: 'Page Editor', path: '/dashboard/customize', icon: '🎨' },
  { name: 'Alert Settings', path: '/dashboard/settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 md:hidden p-2 bg-surface border border-surface-border rounded-xl shadow-lg text-foreground transition-all active:scale-95"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        )}
      </button>

      {/* Sidebar Container */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 w-64 h-screen bg-background border-r border-surface-border flex flex-col 
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-orange-500 rounded-sm" />
            <span className="text-sm font-bold tracking-widest uppercase text-foreground heading">
              Superchat NP
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] text-text-muted uppercase tracking-widest px-4 mb-3">Menu</p>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs transition-all tracking-wide ${
                  isActive 
                  ? 'bg-orange-500/10 text-orange-500 font-bold border border-orange-500/20' 
                  : 'text-text-muted hover:text-foreground hover:bg-surface-border'
                }`}
              >
                <span className="text-sm grayscale opacity-70 group-hover:opacity-100 transition-all">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 space-y-2 border-t border-surface-border">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-text-muted hover:text-foreground hover:bg-surface-border rounded-xl transition-all uppercase tracking-widest font-bold"
          >
            <span className="text-base">{theme === 'dark' ? '☀️' : '🌙'}</span> {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all uppercase tracking-widest font-bold"
          >
            <span className="text-base">🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
