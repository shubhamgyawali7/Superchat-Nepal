"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";
import RecentDonations from "@/components/overlay/RecentDonations";

const POSITION_CLASSES = {
  top: "items-center justify-start pt-12",
  center: "items-center justify-center",
  bottom: "items-center justify-end pb-12",
};

function mapSettings(d) {
  return {
    alertMinAmount: d.alert_min_amount || 0,
    alertDuration: d.alert_duration || 5,
    themeColor: d.theme_color || "#f97316",
    alertGifUrl: d.alert_gif_url || "",
    alertFontFamily: d.alert_font_family || "Inter, sans-serif",
    alertTextColor: d.alert_text_color || "#ffffff",
    alertAmountColor: d.alert_amount_color || "#34d399",
    alertMessageColor: d.alert_message_color || "#f1f5f9",
    alertBgColor: d.alert_bg_color || "rgba(11, 15, 25, 0.92)",
    alertBorderColor: d.alert_border_color || "",
    alertPosition: d.alert_position || "top",
    alertAnimation: d.alert_animation || "slide",
    ttsEnabled: d.tts_enabled !== false,
    ttsRate: d.tts_rate || 0.9,
    recentDonationsPosition: d.recent_donations_position || "bottom-left",
    recentDonationsCount: d.recent_donations_count ?? 5,
  };
}

const ANIMATION_STYLES = {
  slide: {
    enter: "translate-y-0 opacity-100 scale-100",
    exit: "-translate-y-16 opacity-0 scale-95",
  },
  bounce: {
    enter: "translate-y-0 opacity-100 scale-100",
    exit: "translate-y-24 opacity-0 scale-90",
  },
  fade: {
    enter: "opacity-100 scale-100",
    exit: "opacity-0 scale-95",
  },
  zoom: {
    enter: "opacity-100 scale-100",
    exit: "opacity-0 scale-75",
  },
};

// Play a pleasant, instant celebration chime using Web Audio API
function playChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 -> E5 -> G5 -> C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.55);
    });
  } catch (err) {
    console.warn("Audio chime could not play:", err);
  }
}

// Built-in Celebration Icon that NEVER fails or displays broken content (No emojis, No gradients, No shadows)
function CelebrationBadge({ themeColor }) {
  return (
    <div className="flex items-center justify-center w-16 h-16 my-2 rounded-2xl bg-zinc-900 border border-zinc-800 text-violet-400">
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    </div>
  );
}

export default function OverlayPage() {
  const { userId } = useParams();
  const [alert, setAlert] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [settings, setSettings] = useState({
    alertMinAmount: 0,
    alertDuration: 5,
    themeColor: "#f97316",
    alertGifUrl: "",
    alertFontFamily: "Inter, sans-serif",
    alertTextColor: "#ffffff",
    alertAmountColor: "#34d399",
    alertMessageColor: "#f1f5f9",
    alertBgColor: "rgba(11, 15, 25, 0.92)",
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
    setImgError(false);
    setAlert({ sender, amount, message: msg });
    setIsVisible(false);

    // Give browser a frame to mount in exit state so the entrance animation smoothly transitions
    setTimeout(() => {
      setIsVisible(true);
      playChime();
    }, 40);

    const s = settingsRef.current;

    if (s.ttsEnabled && typeof window !== "undefined" && "speechSynthesis" in window) {
      setTimeout(() => {
        try {
          const speech = new SpeechSynthesisUtterance(
            `${sender} sent ${amount} rupees. ${msg || ""}`
          );
          speech.rate = s.ttsRate || 0.9;
          window.speechSynthesis.speak(speech);
        } catch (e) {
          console.warn("TTS error:", e);
        }
      }, 700);
    }

    const duration = (s.alertDuration || 5) * 1000;
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setAlert(null), 700);
    }, duration);
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`/api/streamer/profile/${userId}`, { cache: "no-store" });
        if (res.ok) {
          setSettings(mapSettings(await res.json()));
        }
      } catch (err) {
        console.error("Failed to load overlay settings:", err);
      }
    };

    const fetchRecentDonations = async () => {
      try {
        const res = await fetch(`/api/streamer/recent-donations/${userId}`, { cache: "no-store" });
        if (res.ok) {
          setRecentDonations(await res.json());
        }
      } catch (err) {
        console.error("Failed to load recent donations:", err);
      }
    };

    fetchSettings();
    fetchRecentDonations();

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
    socketRef.current = io(serverUrl);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-streamer", userId);
      fetchSettings();
      fetchRecentDonations();
    });

    socketRef.current.on("settings-updated", (data) => {
      setSettings(mapSettings(data));
    });

    socketRef.current.on("new-donation", (data) => {
      const { name, amount, message, isTest } = data;

      if (!isTest) {
        setRecentDonations((prev) => [
          { id: Date.now(), supporter_name: name, amount, message },
          ...prev,
        ].slice(0, settingsRef.current.recentDonationsCount || 5));
      }

      if (isTest || parseFloat(amount) >= parseFloat(settingsRef.current.alertMinAmount || 0)) {
        triggerAlert(name, amount, message);
      }
    });

    socketRef.current.on("stream-reset", () => {
      setRecentDonations([]);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [userId, triggerAlert]);

  const unlockTTS = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
      window.speechSynthesis.cancel();
    }
    playChime();
  }, []);

  const borderColor = settings.alertBorderColor || settings.themeColor;
  const anim = ANIMATION_STYLES[settings.alertAnimation] || ANIMATION_STYLES.slide;

  return (
    <div
      className={`w-screen h-screen bg-transparent overflow-hidden flex flex-col p-6 ${
        POSITION_CLASSES[settings.alertPosition] || POSITION_CLASSES.top
      }`}
      style={{ fontFamily: settings.alertFontFamily }}
      onClick={unlockTTS}
    >
      {/* Alert Card */}
      {alert && (
        <div
          className={`flex flex-col items-center max-w-xl w-full z-40 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            isVisible ? anim.enter : anim.exit
          }`}
        >
          {/* Visual Badge (Custom GIF with fallback, or built-in animated celebration) */}
          {settings.alertGifUrl && !imgError ? (
            <div className="relative mb-3">
              <div
                className="absolute inset-0 rounded-2xl blur-xl opacity-40 animate-pulse"
                style={{ backgroundColor: settings.themeColor }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.alertGifUrl}
                alt="Alert celebration"
                onError={() => setImgError(true)}
                className="w-36 h-36 object-contain relative z-10"
              />
            </div>
          ) : (
            <CelebrationBadge themeColor={settings.themeColor} />
          )}

          {/* Main Card (No gradients, No shadows, No colored borders) */}
          <div
            className="w-full rounded-2xl p-6 sm:p-7 text-center border border-zinc-800 bg-zinc-950 transition-all"
          >
            {/* Header pill */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3 border border-zinc-800 bg-zinc-900 text-zinc-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Logo"
                className="w-4 h-4 rounded-sm object-contain"
              />
              SuperChat Nepal
            </div>

            {/* Supporter Name */}
            <h1
              className="text-3xl sm:text-4xl font-black uppercase tracking-tight truncate mb-2 text-white"
            >
              {alert.sender}
            </h1>

            {/* Amount Badge */}
            <div className="flex justify-center mb-4">
              <div
                className="px-6 py-2 rounded-xl font-black text-3xl sm:text-4xl border border-zinc-800 bg-zinc-900 text-emerald-400 flex items-center gap-2"
              >
                <span>रू</span>
                <span>{alert.amount}</span>
              </div>
            </div>

            {/* Message Bubble */}
            {alert.message && (
              <div
                className="px-5 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-base sm:text-lg font-medium leading-relaxed italic text-zinc-200"
              >
                &ldquo;{alert.message}&rdquo;
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Donations - smoothly hidden while alert is active so they NEVER overlap! */}
      {settings.recentDonationsCount > 0 && (
        <div
          className={`transition-opacity duration-300 ${
            isVisible ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <RecentDonations
            donations={recentDonations}
            count={settings.recentDonationsCount}
            themeColor={settings.themeColor}
            position={settings.recentDonationsPosition}
            fontFamily={settings.alertFontFamily}
            textColor={settings.alertTextColor}
            amountColor={settings.alertAmountColor}
            messageColor={settings.alertMessageColor}
            bgColor={settings.alertBgColor}
            borderColor={settings.alertBorderColor}
          />
        </div>
      )}

      {/* Watermark in corner for testing / status */}
      <div className="fixed top-2 left-2 p-1 opacity-0 hover:opacity-100 transition-opacity">
        <p className="text-[10px] text-white/60 bg-black/40 px-2 py-0.5 rounded">
          OBS Overlay: {userId}
        </p>
      </div>
    </div>
  );
}
