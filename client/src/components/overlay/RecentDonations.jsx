"use client";
import React from "react";

export default function RecentDonations({ donations, themeColor }) {
  if (!donations || donations.length === 0) return null;

  return (
    <div className="fixed bottom-10 left-10 w-80 space-y-3 z-30" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
      <p className="text-xs font-black uppercase tracking-[0.3em] mb-4" style={{ color: themeColor }}>
        Recent Supporters
      </p>
      <div className="space-y-2">
        {donations.slice(0, 5).map((d, i) => (
          <div 
            key={d.id || i}
            className="flex items-center gap-4 bg-black/60 backdrop-blur-xl border-l-4 p-3 rounded-r-xl animate-slide-in"
            style={{ borderColor: themeColor, animationDelay: `${i * 100}ms` }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">{d.supporter_name}</p>
              <p className="text-xs text-slate-400 font-medium">रू {d.amount}</p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
}
