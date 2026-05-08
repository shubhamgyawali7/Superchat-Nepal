"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";
import RecentDonations from "@/components/overlay/RecentDonations";

export default function OverlayPage() {
  const { userId } = useParams(); // userId is the streamer username
  const [alert, setAlert] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [settings, setSettings] = useState({
    alertMinAmount: 0,
    alertDuration: 5,
    themeColor: "#f97316",
    lastClearedAt: null,
  });
  const [recentDonations, setRecentDonations] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // 1. Fetch Streamer Settings from API
    const fetchSettings = async () => {
      try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const res = await fetch(`${serverUrl}/api/streamer/profile/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setSettings({
            alertMinAmount: data.alert_min_amount || 0,
            alertDuration: data.alert_duration || 5,
            themeColor: data.theme_color || "#f97316",
            lastClearedAt: data.last_cleared_at,
          });
          
          // Fetch initial recent donations
          const donationsRes = await fetch(`${serverUrl}/api/streamer/dashboard`, {
            headers: { "x-streamer-username": userId } // Special header to fetch by username
          });
          // Note: I need to update getDashboardData to support username header if auth is missing
          // But for now, let's assume getPublicProfile could return them or I'll add a specific endpoint.
        }
      } catch (err) {
        console.error("Failed to load overlay settings:", err);
      }
    };

    fetchSettings();

    // 2. Setup Socket.io Listener
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
    socketRef.current = io(serverUrl);

    socketRef.current.on("connect", () => {
      console.log("Overlay connected to socket server");
      socketRef.current.emit("join-streamer", userId);
    });

    socketRef.current.on("new-donation", (data) => {
      const { name, amount, message } = data;

      // Update recent donations list
      setRecentDonations(prev => [{
        id: Date.now(),
        supporter_name: name,
        amount: amount,
        message: message
      }, ...prev].slice(0, 5));

      // Logic: Check against fetched settings
      if (parseFloat(amount) >= parseFloat(settings.alertMinAmount || 0)) {
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
  }, [userId, settings.alertMinAmount]);

  const triggerAlert = (sender, amount, msg) => {
    setAlert({ sender, amount, message: msg });
    setIsVisible(true);

    // Audio Logic
    const audio = new Audio("/alert-sound.mp3");
    audio.play().catch(() => console.warn("Audio blocked. Click the page once!"));

    // Text-to-Speech Logic
    setTimeout(() => {
      const speech = new SpeechSynthesisUtterance(
        `${sender} sent ${amount} rupees. ${msg}`
      );
      speech.rate = 0.9;
      window.speechSynthesis.speak(speech);
    }, 1200);

    // Hide Logic based on duration
    const duration = (settings.alertDuration || 5) * 1000;

    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setAlert(null), 1000);
    }, duration);
  };

  return (
    <div className="w-screen h-screen bg-transparent overflow-hidden flex flex-col items-center justify-start pt-20" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
      {/* Visual Alert Box */}
      {alert && (
        <div
          className={`
          flex flex-col items-center transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${
            isVisible
              ? "translate-y-0 opacity-100 scale-100"
              : "-translate-y-32 opacity-0 scale-50"
          }
        `}
        >
          {/* Animated GIF Section */}
          <div className="relative group mb-4">
            <div
              className="absolute inset-0 blur-[80px] opacity-40 animate-pulse"
              style={{ backgroundColor: settings.themeColor }}
            ></div>
            <img
              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueXN6Znd4cmZueXN6Znd4cmZueXN6Znd4cmZueXN6Znd4cmZueSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/3o7TKMGpxV91ZzV55K/giphy.gif"
              className="w-64 h-64 relative z-10 drop-shadow-2xl"
              alt="Alert GIF"
            />
          </div>

          {/* Text Information Layer */}
          <div className="text-center z-20">
            {/* Header: Sender & Amount */}
            <div
              className="bg-black/80 backdrop-blur-xl border-y-4 py-4 px-16 transform -skew-x-12 shadow-[0_0_50px_rgba(0,0,0,0.6)]"
              style={{ borderColor: settings.themeColor }}
            >
              <h1 className="text-[56px] font-black text-white italic tracking-tighter skew-x-12 leading-tight">
                <span
                  className="drop-shadow-glow uppercase"
                  style={{ color: settings.themeColor }}
                >
                  {alert.sender}
                </span>
                <span className="mx-6 text-4xl text-slate-300 font-medium not-italic lowercase">sent</span>
                <span className="text-emerald-400 drop-shadow-glow">रू {alert.amount}</span>
              </h1>
            </div>

            {/* Message Bubble */}
            <div className="mt-8 flex justify-center">
              <div className="relative max-w-2xl">
                <div
                  className="absolute -inset-1 rounded-[2rem] blur-xl opacity-20"
                  style={{ backgroundColor: settings.themeColor }}
                ></div>
                <p className="relative bg-slate-900/90 backdrop-blur-md border border-white/20 text-white text-[28px] font-bold px-12 py-6 rounded-[2rem] shadow-2xl italic leading-snug">
                  "{alert.message}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Donations List */}
      <RecentDonations 
        donations={recentDonations} 
        themeColor={settings.themeColor} 
      />

      {/* DEV HELPER */}
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