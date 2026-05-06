"use client";
import { useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useAlertStore } from "@/store/alertStore";

// ─── useSocket hook ──────────────────────────────────────────────────────────
// Usage:
//   const { socket, isConnected } = useSocket(username);   // in overlay page
//   const { socket }              = useSocket();            // elsewhere
//
export function useSocket(streamerUsername = null) {
  const socketRef = useRef(null);
  const addAlert = useAlertStore((s) => s.addAlert);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const socket = io(process.env.NEXT_PUBLIC_SERVER_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);

      // Join the streamer's room so we receive their donation events
      if (streamerUsername) {
        socket.emit("join-streamer", streamerUsername);
        console.log(`📡 Joined room: ${streamerUsername}`);
      }
    });

    // ── Handle incoming donation alert ─────────────────────────────────────
    socket.on("new-donation", (donationData) => {
      console.log("💸 New donation received:", donationData);
      addAlert(donationData); // push to Zustand store → triggers overlay UI
    });

    socket.on("disconnect", (reason) => {
      console.log("🔴 Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    socketRef.current = socket;
  }, [streamerUsername, addAlert]);

  useEffect(() => {
    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [connect]);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected ?? false,
  };
}

export default useSocket;