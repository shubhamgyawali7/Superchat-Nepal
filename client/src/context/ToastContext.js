"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl shadow-2xl border backdrop-blur-2xl transition-all animate-slide-in ${
              toast.type === "success"
                ? "bg-[#0c1220]/95 border-emerald-500/40 text-emerald-400 shadow-emerald-500/10"
                : toast.type === "error"
                ? "bg-[#0c1220]/95 border-red-500/40 text-red-400 shadow-red-500/10"
                : toast.type === "warning"
                ? "bg-[#0c1220]/95 border-amber-500/40 text-amber-400 shadow-amber-500/10"
                : "bg-[#0c1220]/95 border-orange-500/40 text-orange-400 shadow-orange-500/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-base">
                {toast.type === "success" && "✅"}
                {toast.type === "error" && "⚠️"}
                {toast.type === "warning" && "🔔"}
                {toast.type === "info" && "⚡"}
              </span>
              <span className="text-xs font-bold text-white leading-snug">
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
