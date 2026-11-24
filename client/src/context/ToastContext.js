"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Icon from "@/components/common/Icon";
import {
  CheckmarkCircle01Icon,
  Alert01Icon,
  Notification01Icon,
  InformationCircleIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";

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

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return CheckmarkCircle01Icon;
      case "error":
        return Alert01Icon;
      case "warning":
        return Notification01Icon;
      default:
        return InformationCircleIcon;
    }
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-auto flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
            >
              <div className="flex items-center gap-3">
                <Icon
                  icon={getIcon(toast.type)}
                  size={18}
                  className={
                    toast.type === "success"
                      ? "text-emerald-400"
                      : toast.type === "error"
                      ? "text-red-400"
                      : toast.type === "warning"
                      ? "text-amber-400"
                      : "text-zinc-400"
                  }
                />
                <span className="text-xs font-semibold text-zinc-100 leading-snug">
                  {toast.message}
                </span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-3 text-zinc-500 hover:text-white transition-colors"
                aria-label="Close notification"
              >
                <Icon icon={Cancel01Icon} size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
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
