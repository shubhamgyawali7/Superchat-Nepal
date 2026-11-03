"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";

export default function TopDonationsOverlay() {
  const { userId } = useParams();
  const [topDonations, setTopDonations] = useState([]);
  const [settings, setSettings] = useState({
    themeColor: "#f97316",
    fontFamily: "Inter, sans-serif",
    textColor: "#ffffff",
    amountColor: "#34d399",
    bgColor: "rgba(11, 15, 25, 0.92)",
    borderColor: "",
  });
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const profileRes = await fetch(`/api/streamer/profile/${userId}`, { cache: "no-store" });
        if (profileRes.ok) {
          const d = await profileRes.json();
          setSettings({
            themeColor: d.theme_color || "#f97316",
            fontFamily: d.alert_font_family || "Inter, sans-serif",
            textColor: d.alert_text_color || "#ffffff",
            amountColor: d.alert_amount_color || "#34d399",
            bgColor: d.alert_bg_color || "rgba(11, 15, 25, 0.92)",
            borderColor: d.alert_border_color || "",
          });
        }
      } catch (err) {
        console.error("Failed to load overlay settings:", err);
      }
    };

    const fetchTopDonations = async () => {
      try {
        const topRes = await fetch(`/api/streamer/top-donations/${userId}`, { cache: "no-store" });
        if (topRes.ok) {
          setTopDonations(await topRes.json());
        }
      } catch (err) {
        console.error("Failed to load top donations:", err);
      }
    };

    fetchSettings();
    fetchTopDonations();

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
    socketRef.current = io(serverUrl);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-streamer", userId);
      fetchSettings();
    });

    socketRef.current.on("settings-updated", (d) => {
      setSettings({
        themeColor: d.theme_color || "#f97316",
        fontFamily: d.alert_font_family || "Inter, sans-serif",
        textColor: d.alert_text_color || "#ffffff",
        amountColor: d.alert_amount_color || "#34d399",
        bgColor: d.alert_bg_color || "rgba(11, 15, 25, 0.92)",
        borderColor: d.alert_border_color || "",
      });
    });

    socketRef.current.on("new-donation", (data) => {
      const { name, amount, message, isTest } = data;
      if (isTest) return;

      setTopDonations((prev) => {
        const newDonation = {
          id: Date.now(),
          supporter_name: name,
          amount: parseFloat(amount),
          message: message,
        };

        return [...prev, newDonation]
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5);
      });
    });

    socketRef.current.on("stream-reset", () => {
      setTopDonations([]);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [userId]);

  const accent = settings.themeColor;
  const border = settings.borderColor || accent;

  return (
    <div
      className="w-full min-h-screen bg-transparent overflow-hidden flex flex-col items-center justify-start p-4 select-none"
      style={{ fontFamily: settings.fontFamily }}
    >
      {topDonations.length > 0 && (
        <div className="w-full max-w-[360px]">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <h2
                className="text-lg font-black uppercase tracking-wider drop-shadow"
                style={{ color: accent }}
              >
                Top Supporters
              </h2>
            </div>
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
              All-Time
            </span>
          </div>

          <div className="space-y-2.5">
            {topDonations.map((d, index) => {
              const medalColors = [
                "from-amber-300 to-yellow-600 text-black", // 1st
                "from-slate-200 to-slate-400 text-black",  // 2nd
                "from-amber-600 to-amber-800 text-white",  // 3rd
              ];
              const badgeClass =
                medalColors[index] || "bg-white/10 text-white/80";

              return (
                <div
                  key={d.id || index}
                  className="relative backdrop-blur-xl rounded-2xl p-3 flex items-center justify-between border shadow-lg transition-all"
                  style={{
                    borderColor: index === 0 ? border : "rgba(255, 255, 255, 0.1)",
                    backgroundColor: settings.bgColor,
                    borderLeftWidth: 4,
                    borderLeftColor: border,
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 shadow bg-gradient-to-br ${badgeClass}`}
                    >
                      {index + 1}
                    </div>
                    <p
                      className="font-bold text-sm truncate"
                      style={{ color: settings.textColor }}
                    >
                      {d.supporter_name}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className="text-base font-black drop-shadow"
                      style={{ color: settings.amountColor }}
                    >
                      रू {d.amount}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
