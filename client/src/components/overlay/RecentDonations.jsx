"use client";
import React from "react";

const POSITION_CLASSES = {
  "bottom-left": "fixed bottom-8 left-8",
  "bottom-right": "fixed bottom-8 right-8",
  "top-left": "fixed top-8 left-8",
  "top-right": "fixed top-8 right-8",
};

export default function RecentDonations({
  donations,
  themeColor,
  position = "bottom-left",
  fontFamily,
  textColor = "#ffffff",
  amountColor = "#34d399",
  messageColor = "#cbd5e1",
  bgColor = "rgba(0, 0, 0, 0.75)",
  borderColor,
  count = 5,
}) {
  if (!donations || donations.length === 0) return null;

  const accent = themeColor || "#f97316";
  const border = borderColor || accent;

  return (
    <div
      className={`${
        POSITION_CLASSES[position] || POSITION_CLASSES["bottom-left"]
      } w-72 max-w-[90vw] space-y-2.5 z-20 pointer-events-none select-none`}
      style={{ fontFamily }}
    >
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
        <p
          className="text-[11px] font-black uppercase tracking-[0.2em] drop-shadow"
          style={{ color: textColor }}
        >
          Recent Supporters
        </p>
      </div>

      <div className="space-y-2">
        {donations.slice(0, count).map((d, i) => (
          <div
            key={d.id || i}
            className="flex items-center justify-between gap-3 backdrop-blur-xl border border-white/10 px-3.5 py-2.5 rounded-xl shadow-xl animate-slide-in"
            style={{
              backgroundColor: bgColor,
              borderLeftWidth: 4,
              borderLeftColor: border,
              animationDelay: `${i * 80}ms`,
            }}
          >
            <div className="flex-1 min-w-0">
              <p
                className="font-bold text-xs truncate leading-snug"
                style={{ color: textColor }}
              >
                {d.supporter_name}
              </p>
              {d.message && (
                <p
                  className="text-[10px] truncate italic"
                  style={{ color: messageColor }}
                >
                  &ldquo;{d.message}&rdquo;
                </p>
              )}
            </div>
            <span
              className="text-xs font-black whitespace-nowrap"
              style={{ color: amountColor }}
            >
              रू {d.amount}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateY(10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
}
