"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";
import RecentDonations from "@/components/overlay/RecentDonations";
import { useToast } from "@/hooks/useToast";

const DEFAULT_GIF = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueXN6Znd4cmZueXN6Znd4cmZueXN6Znd4cmZueXN6Znd4cmZueSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/3o7TKMGpxV91ZzV55K/giphy.gif";

const POSITION_CLASSES = {
  top: "items-start pt-24",
  center: "items-center justify-center",
  bottom: "items-end pb-24",
};

const ANIMATION_STYLES = {
  slide: { enter: "translate-y-0 opacity-100 scale-100", exit: "-translate-y-32 opacity-0 scale-90" },
  bounce: { enter: "translate-y-0 opacity-100 scale-100", exit: "translate-y-48 opacity-0 scale-50" },
  fade: { enter: "opacity-100 scale-100", exit: "opacity-0 scale-95" },
  zoom: { enter: "opacity-100 scale-100", exit: "opacity-0 scale-[2.5]" },
};

export default function OverlayPage() {
  const { userId } = useParams();
  const { addToast } = useToast();
  const [alert, setAlert] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [settings, setSettings] = useState({
    alertMinAmount: 0,
    alertDuration: 5,
    themeColor: "#f97316",
    lastClearedAt: null,
    alertGifUrl: "",
    alertFontFamily: "Inter, sans-serif",
    alertTextColor: "#ffffff",
    alertAmountColor: "#34d399",
    alertMessageColor: "#f1f5f9",
    alertBgColor: "rgba(0,0,0,0.85)",
    alertBorderColor: "",
    alertPosition: "top",
    alertAnimation: "slide",
    ttsEnabled: true,
    ttsRate: 0.9,
    recentDonationsPosition: "bottom-left",
    recentDonationsCount: 5,
  });
  const [recentDonations, setRecentDonations] = useState([]);
  const socketRef = useRef(null);
  const settingsRef = useRef(settings);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const triggerAlert = useCallback((sender, amount, msg) => {
    setAlert({ sender, amount, message: msg });
    setIsVisible(true);

    const s = settingsRef.current;

    if (s.ttsEnabled) {
      setTimeout(() => {
        const speech = new SpeechSynthesisUtterance(
          `${sender} sent ${amount} rupees. ${msg}`
        );
        speech.rate = s.ttsRate || 0.9;
        window.speechSynthesis.speak(speech);
      }, 800);
    }

    const duration = (s.alertDuration || 5) * 1000;
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setAlert(null), 800);
    }, duration);
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const res = await fetch(`${serverUrl}/api/streamer/profile/${userId}`);
        if (res.ok) {
          const d = await res.json();
          setSettings({
            alertMinAmount: d.alert_min_amount || 0,
            alertDuration: d.alert_duration || 5,
            themeColor: d.theme_color || "#f97316",
            lastClearedAt: d.last_cleared_at,
            alertGifUrl: d.alert_gif_url || "",
            alertFontFamily: d.alert_font_family || "Inter, sans-serif",
            alertTextColor: d.alert_text_color || "#ffffff",
            alertAmountColor: d.alert_amount_color || "#34d399",
            alertMessageColor: d.alert_message_color || "#f1f5f9",
            alertBgColor: d.alert_bg_color || "rgba(0,0,0,0.85)",
            alertBorderColor: d.alert_border_color || "",
            alertPosition: d.alert_position || "top",
            alertAnimation: d.alert_animation || "slide",
            ttsEnabled: d.tts_enabled !== false,
            ttsRate: d.tts_rate || 0.9,
            recentDonationsPosition: d.recent_donations_position || "bottom-left",
            recentDonationsCount: d.recent_donations_count ?? 5,
          });
        }
      } catch (err) {
        console.error("Failed to load overlay settings:", err);
      }
    };

    fetchSettings();

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
    socketRef.current = io(serverUrl);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-streamer", userId);
    });

    socketRef.current.on("new-donation", (data) => {
      const { name, amount, message } = data;

      setRecentDonations((prev) => [
        { id: Date.now(), supporter_name: name, amount, message },
        ...prev,
      ].slice(0, settingsRef.current.recentDonationsCount || 5));

      if (parseFloat(amount) >= parseFloat(settingsRef.current.alertMinAmount || 0)) {
        triggerAlert(name, amount, message);
      }
    });

    socketRef.current.on("stream-reset", () => {
      setRecentDonations([]);
      addToast?.("Stream data reset by creator", "info");
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [userId, triggerAlert, addToast]);

  const unlockTTS = useCallback(() => {
    window.speechSynthesis?.speak(new SpeechSynthesisUtterance(""));
    window.speechSynthesis?.cancel();
  }, []);

  const borderColor = settings.alertBorderColor || settings.themeColor;
  const anim = ANIMATION_STYLES[settings.alertAnimation] || ANIMATION_STYLES.slide;

  return (
    <div
      className={`w-screen h-screen bg-transparent overflow-hidden flex flex-col ${POSITION_CLASSES[settings.alertPosition] || POSITION_CLASSES.top}`}
      style={{ fontFamily: settings.alertFontFamily }}
      onClick={unlockTTS}
    >
      {alert && (
        <div
          className={`flex flex-col items-center transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            isVisible ? anim.enter : anim.exit
          }`}
        >
          {/* GIF / Image */}
          <div className="relative group mb-4">
            <div
              className="absolute inset-0 blur-[80px] opacity-40 animate-pulse"
              style={{ backgroundColor: settings.themeColor }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={settings.alertGifUrl || DEFAULT_GIF}
              className="w-64 h-64 relative z-10 drop-shadow-2xl"
              alt="Alert"
            />
          </div>

          {/* Name + Amount banner */}
          <div className="text-center z-20">
            <div
              className="backdrop-blur-xl border-y-4 py-4 px-16 transform -skew-x-12 shadow-[0_0_50px_rgba(0,0,0,0.6)]"
              style={{
                backgroundColor: settings.alertBgColor,
                borderColor: borderColor,
              }}
            >
              <h1
                className="text-[56px] font-black italic tracking-tighter skew-x-12 leading-tight"
                style={{ color: settings.alertTextColor }}
              >
                <span className="drop-shadow-glow uppercase">{alert.sender}</span>
                <span
                  className="mx-6 text-4xl font-medium not-italic lowercase"
                  style={{ color: settings.alertTextColor, opacity: 0.6 }}
                >
                  sent
                </span>
                <span style={{ color: settings.alertAmountColor }} className="drop-shadow-glow">
                  रू {alert.amount}
                </span>
              </h1>
            </div>

            {/* Message */}
            <div className="mt-8 flex justify-center">
              <div className="relative max-w-2xl">
                <div
                  className="absolute -inset-1 rounded-[2rem] blur-xl opacity-20"
                  style={{ backgroundColor: settings.themeColor }}
                />
                <p
                  className="relative backdrop-blur-md border border-white/20 text-[28px] font-bold px-12 py-6 rounded-[2rem] shadow-2xl italic leading-snug"
                  style={{
                    color: settings.alertMessageColor,
                    backgroundColor: settings.alertBgColor,
                    borderColor: `${borderColor}33`,
                  }}
                >
                  &quot;{alert.message}&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {settings.recentDonationsCount > 0 && (
        <RecentDonations
          donations={recentDonations.slice(0, settings.recentDonationsCount)}
          themeColor={settings.themeColor}
          position={settings.recentDonationsPosition}
          fontFamily={settings.alertFontFamily}
        />
      )}

      <div className="fixed top-0 left-0 p-2 opacity-0 hover:opacity-100 transition-opacity">
        <p className="text-[10px] text-white bg-black/20 p-1 rounded">
          Overlay Active: {userId}
        </p>
      </div>

      <style jsx>{`
        .drop-shadow-glow {
          filter: drop-shadow(0 0 15px currentColor);
        }
      `}</style>
    </div>
  );
}
