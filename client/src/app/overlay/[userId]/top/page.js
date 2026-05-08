"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";

export default function TopDonationsOverlay() {
  const { userId } = useParams();
  const [topDonations, setTopDonations] = useState([]);
  const [settings, setSettings] = useState({
    themeColor: "#f97316",
  });
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchSettingsAndDonations = async () => {
      try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        
        // Fetch Settings
        const profileRes = await fetch(`${serverUrl}/api/streamer/profile/${userId}`);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setSettings({
            themeColor: profileData.theme_color || "#f97316",
          });
        }

        // Fetch Top Donations
        const topRes = await fetch(`${serverUrl}/api/streamer/top-donations/${userId}`);
        if (topRes.ok) {
          const donations = await topRes.json();
          setTopDonations(donations);
        }
      } catch (err) {
        console.error("Failed to load overlay data:", err);
      }
    };

    fetchSettingsAndDonations();

    // Setup Socket.io
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
    socketRef.current = io(serverUrl);

    socketRef.current.on("connect", () => {
      console.log("Top Overlay connected to socket server");
      socketRef.current.emit("join-streamer", userId);
    });

    socketRef.current.on("new-donation", (data) => {
      const { name, amount, message } = data;
      
      setTopDonations((prev) => {
        const newDonation = {
          id: Date.now(),
          supporter_name: name,
          amount: parseFloat(amount),
          message: message,
        };

        const updatedList = [...prev, newDonation]
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5);

        return updatedList;
      });
    });

    socketRef.current.on("stream-reset", () => {
      setTopDonations([]);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [userId]);

  return (
    <div className="w-screen h-screen bg-transparent overflow-hidden flex flex-col items-center justify-start p-10" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
      
      {topDonations.length > 0 && (
        <div className="w-[400px]">
          <div className="text-center mb-6 relative">
             <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] italic drop-shadow-lg" style={{ color: settings.themeColor }}>
                Top 5 Supporters
             </h2>
          </div>

          <div className="space-y-4">
            {topDonations.map((d, index) => (
              <div 
                key={d.id}
                className="relative bg-black/80 backdrop-blur-xl border-l-4 rounded-r-2xl p-4 flex items-center justify-between overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform transition-all duration-500 animate-fade-in"
                style={{ borderColor: settings.themeColor }}
              >
                {/* Background glow for #1 */}
                {index === 0 && (
                  <div 
                    className="absolute inset-0 opacity-20 blur-2xl"
                    style={{ backgroundColor: settings.themeColor }}
                  />
                )}

                <div className="flex items-center gap-4 relative z-10">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xl ${index === 0 ? 'bg-gradient-to-br from-yellow-300 to-yellow-600 text-black' : 'bg-white/10 text-white'}`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg leading-tight truncate max-w-[180px]">{d.supporter_name}</p>
                  </div>
                </div>

                <div className="relative z-10 text-right">
                  <p className="text-2xl font-black drop-shadow-md" style={{ color: settings.themeColor }}>
                    रू {d.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DEV HELPER */}
      <div className="fixed top-0 right-0 p-2 opacity-0 hover:opacity-100 transition-opacity">
        <p className="text-[10px] text-white bg-black/20 p-1 rounded">
          Top Overlay Active: {userId}
        </p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
}
