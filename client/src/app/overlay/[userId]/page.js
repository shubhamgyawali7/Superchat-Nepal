"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";

export default function OverlayPage() {
  const { userId } = useParams(); // userId is the streamer username
  const [alert, setAlert] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [settings, setSettings] = useState({
    alertMinAmount: 0,
    alertDuration: 5,
    themeColor: "#f97316",
  });
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
          });
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

      // Logic: Check against fetched settings
      if (parseFloat(amount) >= parseFloat(settings.alertMinAmount || 0)) {
        triggerAlert(name, amount, message);
      }
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
    <div className="w-screen h-screen bg-transparent overflow-hidden font-sans flex flex-col items-center justify-start pt-20">
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
          <div className="relative group mb-2">
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
              className="bg-black/60 backdrop-blur-md border-y-2 py-3 px-12 transform -skew-x-12 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
              style={{ borderColor: settings.themeColor }}
            >
              <h1 className="text-5xl font-black text-white italic tracking-tighter skew-x-12">
                <span
                  className="drop-shadow-glow uppercase"
                  style={{ color: settings.themeColor }}
                >
                  {alert.sender}
                </span>
                <span className="mx-4 text-3xl text-slate-300 lowercase">sent</span>
                <span className="text-green-400 drop-shadow-glow">रू {alert.amount}</span>
              </h1>
            </div>

            {/* Message Bubble */}
            <div className="mt-6 flex justify-center">
              <div className="relative">
                <div
                  className="absolute -inset-1 rounded-2xl blur opacity-30"
                  style={{ backgroundColor: settings.themeColor }}
                ></div>
                <p className="relative bg-slate-900 border border-white/10 text-white text-2xl font-bold px-10 py-4 rounded-2xl shadow-2xl italic">
                  "{alert.message}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEV HELPER */}
      <div className="fixed top-0 left-0 p-2 opacity-0 hover:opacity-100 transition-opacity">
        <p className="text-[10px] text-white bg-black/20 p-1 rounded">
          Overlay Active: {userId}
        </p>
      </div>

      <style jsx>{`
        .drop-shadow-glow {
          filter: drop-shadow(0 0 10px currentColor);
        }
      `}</style>
    </div>
  );
}