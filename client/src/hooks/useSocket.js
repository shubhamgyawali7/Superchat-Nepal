"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useAlertStore } from "@/store/alertStore";
import { useToast } from "@/hooks/useToast";

export function useSocket(streamerUsername = null) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const connectionAttemptRef = useRef(0);
  const addAlert = useAlertStore((s) => s.addAlert);
  const { addToast } = useToast();

  const getSocket = useCallback(() => socketRef.current, []);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const socket = io(process.env.NEXT_PUBLIC_SERVER_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
      randomizationFactor: 0.5,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
      connectionAttemptRef.current = 0;

      if (streamerUsername) {
        socket.emit("join-streamer", streamerUsername);
        console.log(`Joined room: ${streamerUsername}`);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
      if (reason === "io server disconnect") {
        socket.connect();
      }
    });

    socket.on("connect_error", (err) => {
      connectionAttemptRef.current += 1;
      console.error("Socket connection error:", err.message);
      if (connectionAttemptRef.current === 5) {
        addToast("Connection issues detected. Trying to reconnect...", "warning");
      }
    });

    socket.on("new-donation", (donationData) => {
      console.log("New donation received:", donationData);
      addAlert(donationData);
    });

    socketRef.current = socket;
  }, [streamerUsername, addAlert, addToast]);

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
    getSocket,
    isConnected,
  };
}

export default useSocket;
