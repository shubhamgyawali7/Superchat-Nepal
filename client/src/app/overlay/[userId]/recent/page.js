"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";
import RecentDonations from "@/components/overlay/RecentDonations";

const DEFAULT_SETTINGS = {
  themeColor: "#f97316",
  fontFamily: "Inter, sans-serif",
  textColor: "#ffffff",
  amountColor: "#34d399",
  messageColor: "#cbd5e1",
  bgColor: "rgba(0, 0, 0, 0.75)",
  borderColor: "",
  position: "bottom-left",
  count: 5,
};

function mapSettings(d) {
  return {
    themeColor: d.theme_color || DEFAULT_SETTINGS.themeColor,
    fontFamily: d.alert_font_family || DEFAULT_SETTINGS.fontFamily,
    textColor: d.alert_text_color || DEFAULT_SETTINGS.textColor,
    amountColor: d.alert_amount_color || DEFAULT_SETTINGS.amountColor,
    messageColor: d.alert_message_color || DEFAULT_SETTINGS.messageColor,
    bgColor: d.alert_bg_color || DEFAULT_SETTINGS.bgColor,
    borderColor: d.alert_border_color || "",
    position: d.recent_donations_position || DEFAULT_SETTINGS.position,
    count: d.recent_donations_count ?? DEFAULT_SETTINGS.count,
  };
}

export default function RecentDonationsOverlay() {
  const { userId } = useParams();
  const [donations, setDonations] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const settingsRef = useRef(settings);
  const socketRef = useRef(null);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`/api/streamer/profile/${userId}`, { cache: "no-store" });
        if (res.ok) {
          setSettings(mapSettings(await res.json()));
        }
      } catch (e) {
        console.error(e);
      }
    };
    const fetchRecentDonations = async () => {
      try {
        const res = await fetch(`/api/streamer/recent-donations/${userId}`, { cache: "no-store" });
        if (res.ok) {
          setDonations(await res.json());
        }
      } catch (e) {
        console.error(e);
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
      if (data.isTest) return;
      setDonations((prev) => [
        { id: Date.now(), supporter_name: data.name, amount: data.amount, message: data.message },
        ...prev,
      ].slice(0, settingsRef.current.count || 5));
    });

    socketRef.current.on("stream-reset", () => {
      setDonations([]);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [userId]);

  return (
    <div className="w-screen h-screen bg-transparent overflow-hidden p-4">
      <RecentDonations
        donations={donations}
        count={settings.count}
        themeColor={settings.themeColor}
        position={settings.position}
        fontFamily={settings.fontFamily}
        textColor={settings.textColor}
        amountColor={settings.amountColor}
        messageColor={settings.messageColor}
        bgColor={settings.bgColor}
        borderColor={settings.borderColor}
      />
    </div>
  );
}
