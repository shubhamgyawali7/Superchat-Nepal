"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";

export default function DonationForm({ streamer, serverUrl }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("esewa");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const themeColor = streamer.theme_color || "#f97316";

  const quickAmounts = [100, 500, 1000, 2500];

  const validate = () => {
    const newErrors = {};
    const numericAmount = parseFloat(amount);

    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(numericAmount) || numericAmount < 10) {
      newErrors.amount = "Minimum donation is रू 10";
    } else if (numericAmount > 100000) {
      newErrors.amount = "Maximum donation is रू 100,000";
    }

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.length > 50) {
      newErrors.name = "Name must be under 50 characters";
    }

    if (message.length > 500) {
      newErrors.message = "Message must be under 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!validate()) {
      addToast("Please fix the errors in the form", "error");
      return;
    }

    if (!streamer?.username) {
      addToast("Missing streamer info", "error");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Initiate on backend
      const response = await fetch(`${serverUrl}/api/donations/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          streamerUsername: streamer.username,
          amount: parseFloat(amount),
          senderName: name,
          message: message,
          gateway: paymentMethod,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to initiate donation");
      }

      const data = await response.json();
      console.log("Dontaion Data", data);
      // 2. Handle eSewa ePay v2 redirect
      if (paymentMethod === "esewa" && data.paymentData?.formData) {
        sessionStorage.setItem("pending_donation_id", data.donationId);

        const formData = data.paymentData.formData;
        const form = document.createElement("form");
        form.method = "POST";
        form.action = formData.action;

        for (const key in formData) {
          if (key === "action") continue;
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = formData[key];
          form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
        return;
      } else {
        router.push(
          `/donate/success?name=${encodeURIComponent(name || "Anonymous")}&amount=${amount}`
        );
      }
    } catch (err) {
      console.error("Payment error:", err);
      addToast(`Payment failed: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative group max-w-xl mx-auto">
      {/* Dynamic Background Glow */}
      <div
        className="absolute -inset-4 bg-linear-to-r blur-3xl opacity-10 transition-opacity duration-1000 group-hover:opacity-25"
        style={{ backgroundImage: `linear-gradient(to right, ${themeColor}, #ffffff)` }}
      ></div>

      <form
        onSubmit={handlePayment}
        className="relative overflow-hidden bg-white/5 dark:bg-black/40 backdrop-blur-2xl border border-white/10 dark:border-white/5 p-8 sm:p-10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] space-y-10"
      >
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-heading font-bold tracking-tight">Support {streamer.display_name || streamer.username}</h2>
          <p className="text-text-muted text-sm font-medium">Send a message that appears on stream</p>
        </div>

        {/* Amount Section */}
        <div className="space-y-6">
          <div className={`relative group/amount transition-all duration-300 p-10 rounded-[2.5rem] border-2 bg-black/5 dark:bg-white/5 flex flex-col items-center justify-center ${errors.amount ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'border-white/5 focus-within:border-white/20'}`}>
            <span className={`text-[11px] font-bold uppercase tracking-[0.2em] mb-4 ${errors.amount ? 'text-red-400' : 'text-text-muted opacity-60'}`}>
              Enter Amount
            </span>
            
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-heading font-light opacity-30">रू</span>
              <input
                type="number"
                value={amount}
                className="no-spinner w-32 bg-transparent text-center text-7xl font-heading font-black outline-none placeholder:opacity-10 transition-transform focus:scale-110"
                style={{ color: errors.amount ? '#ef4444' : themeColor }}
                placeholder="500"
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors(prev => ({ ...prev, amount: null }));
                }}
              />
            </div>

            {errors.amount && (
              <p className="text-red-500 text-xs font-bold mt-4 animate-in fade-in slide-in-from-top-2">{errors.amount}</p>
            )}

            {/* Quick Amounts */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setAmount(amt);
                    if (errors.amount) setErrors(prev => ({ ...prev, amount: null }));
                  }}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 border ${amount == amt
                    ? "bg-white text-black border-white shadow-lg scale-105"
                    : "bg-white/5 text-text-muted border-white/5 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  +रू {amt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-5">
          <div className="group/input relative">
            <input
              type="text"
              placeholder="Your Name (e.g. Nepali Gamer)"
              className={`w-full bg-black/5 dark:bg-white/5 border-2 p-5 rounded-[1.5rem] outline-none transition-all text-lg font-medium placeholder:text-text-muted/40 ${errors.name ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 focus:border-white/20 focus:bg-white/10'}`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: null }));
              }}
            />
            {errors.name && <p className="text-red-500 text-[10px] font-bold mt-2 ml-4 uppercase tracking-widest">{errors.name}</p>}
          </div>

          <div className="group/textarea relative">
            <textarea
              placeholder={`Write a message to ${streamer.display_name || streamer.username}...`}
              className={`w-full bg-black/5 dark:bg-white/5 border-2 p-6 rounded-[1.5rem] outline-none transition-all h-36 resize-none text-lg placeholder:text-text-muted/40 ${errors.message ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 focus:border-white/20 focus:bg-white/10'}`}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) setErrors(prev => ({ ...prev, message: null }));
              }}
            ></textarea>
            {errors.message && <p className="text-red-500 text-[10px] font-bold mt-2 ml-4 uppercase tracking-widest">{errors.message}</p>}
            <div className="absolute bottom-5 right-6 flex items-center gap-2 pointer-events-none opacity-40">
              <span className="text-[10px] font-bold uppercase tracking-widest">Appears on stream</span>
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Gateway Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest opacity-60">Payment Gateway</span>
            <span className="text-[10px] font-medium text-text-muted/50">Secure Transaction</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod("esewa")}
              className={`relative overflow-hidden p-6 rounded-[2rem] border-2 transition-all duration-500 ${paymentMethod === "esewa"
                ? "border-green-500/50 bg-green-500/10 shadow-[0_8px_24px_rgba(34,197,94,0.15)]"
                : "border-white/5 bg-black/5 dark:bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <div className="flex flex-col items-center gap-3 relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 ${paymentMethod === 'esewa' ? 'bg-green-500 text-white rotate-6 scale-110' : 'bg-white/5 text-text-muted'}`}>
                  🌿
                </div>
                <span className={`text-[13px] font-bold tracking-tight transition-colors ${paymentMethod === 'esewa' ? 'text-green-500' : 'text-text-muted'}`}>eSewa</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("khalti")}
              className={`relative overflow-hidden p-6 rounded-[2rem] border-2 transition-all duration-500 ${paymentMethod === "khalti"
                ? "border-purple-500/50 bg-purple-500/10 shadow-[0_8px_24px_rgba(168,85,247,0.15)]"
                : "border-white/5 bg-black/5 dark:bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <div className="flex flex-col items-center gap-3 relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 ${paymentMethod === 'khalti' ? 'bg-purple-500 text-white -rotate-6 scale-110' : 'bg-white/5 text-text-muted'}`}>
                  🪁
                </div>
                <span className={`text-[13px] font-bold tracking-tight transition-colors ${paymentMethod === 'khalti' ? 'text-purple-500' : 'text-text-muted'}`}>Khalti</span>
              </div>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="group/submit relative w-full h-20 rounded-[2rem] text-white font-heading font-bold text-xl transition-all duration-500 active:scale-95 disabled:opacity-50 overflow-hidden"
          style={{ backgroundColor: themeColor }}
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/submit:translate-y-0 transition-transform duration-500"></div>
          <div className="relative z-10 flex items-center justify-center gap-3">
            <span className="tracking-tight">{isLoading ? "Processing..." : "Send Superchat"}</span>
            {!isLoading && (
              <svg className="w-6 h-6 transition-transform group-hover/submit:translate-x-1 group-hover/submit:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </div>
        </button>

        {/* Footer Info */}
        <div className="text-center">
          <p className="text-[10px] font-bold text-text-muted/40 uppercase tracking-[0.2em]">Powered by SuperChat Nepal</p>
        </div>
      </form>
    </div>
  );
}
