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

  const themeColor = streamer.theme_color || "#0f172a"; // Slate-900
  const quickAmounts = [100, 500, 1000, 2500];

  const validate = () => {
    const newErrors = {};
    const numericAmount = parseFloat(amount);

    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(numericAmount) || numericAmount < 10) {
      newErrors.amount = "Minimum रू 10";
    } else if (numericAmount > 100000) {
      newErrors.amount = "Maximum रू 100,000";
    }

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.length > 50) {
      newErrors.name = "Name too long";
    }

    if (message.length > 500) {
      newErrors.message = "Message too long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!validate()) {
      addToast("Please check the form for errors", "error");
      return;
    }

    setIsLoading(true);
    try {
      if (paymentMethod === "khalti") {
        router.push("/donate/khalti-coming-soon");
        return;
      }

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
      if (paymentMethod === "esewa" && data.paymentData?.formData) {
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
      } else {
        router.push(`/donate/success?name=${encodeURIComponent(name)}&amount=${amount}`);
      }
    } catch (err) {
      console.error("Payment error:", err);
      addToast(err.message || "Payment initiation failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const displayName = streamer.display_name || streamer.username || "Streamer";

  return (
    <div className="relative group w-full">
      {/* Dynamic Background Glow */}
      <div
        className="absolute -inset-6 bg-linear-to-r blur-3xl opacity-10 transition-opacity duration-1000 group-hover:opacity-25"
        style={{ backgroundImage: `linear-gradient(to right, ${themeColor}, #ffffff)` }}
      ></div>

      <form
        onSubmit={handlePayment}
        className="relative overflow-hidden bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-10 sm:p-14 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] space-y-12"
      >
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-14 h-14 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center text-2xl font-heading font-black text-white shadow-inner">
                {displayName[0].toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-[#0f172a] animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-lg font-heading font-black text-white tracking-tight">{displayName}</h3>
              <p className="text-xs text-text-muted font-black uppercase tracking-[0.2em] opacity-50">Verified Creator</p>
            </div>
          </div>
          <div className="flex items-center gap-3 border border-white/10 bg-white/5 px-4 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[11px] font-black text-white/60 tracking-widest uppercase">Live Now</span>
          </div>
        </div>

        {/* Amount Section */}
        <div className="space-y-8">
          <div className={`relative group/amount transition-all duration-500 p-12 rounded-[2.5rem] border-2 bg-white/[0.02] flex flex-col items-center justify-center ${errors.amount ? 'border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.05)]' : 'border-white/5 focus-within:border-white/20'}`}>
            <span className={`text-xs font-black uppercase tracking-[0.3em] mb-6 ${errors.amount ? 'text-red-400' : 'text-text-muted opacity-40'}`}>
              Support Amount
            </span>

            <div className="flex items-center justify-center gap-4">
              <span className="text-4xl font-heading font-light opacity-20 text-white">रू</span>
              <input
                type="number"
                value={amount}
                className="no-spinner w-48 bg-transparent text-center text-8xl font-heading font-black text-white outline-none placeholder:opacity-5 transition-transform focus:scale-105"
                placeholder="0"
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors(prev => ({ ...prev, amount: null }));
                }}
              />
            </div>

            {errors.amount && (
              <p className="text-red-500 text-xs font-black mt-6 uppercase tracking-widest animate-in fade-in slide-in-from-top-2">{errors.amount}</p>
            )}

            {/* Quick Amounts */}
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setAmount(String(amt));
                    if (errors.amount) setErrors(prev => ({ ...prev, amount: null }));
                  }}
                  className={`px-6 py-3 rounded-2xl text-xs font-black transition-all duration-300 border-2 ${amount == String(amt)
                    ? "bg-white text-black border-white shadow-2xl shadow-white/10 scale-110"
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
        <div className="space-y-8">
          <div className="group/input relative">
            <label className="text-xs font-black text-text-muted uppercase tracking-[0.2em] ml-6 mb-3 block opacity-50">Your Name</label>
            <input
              type="text"
              placeholder="e.g. Nepali Gamer"
              className={`w-full bg-white/[0.03] border-2 p-6 rounded-[1.8rem] outline-none transition-all text-base font-bold text-white placeholder:text-white/10 ${errors.name ? 'border-red-500/20 bg-red-500/[0.02]' : 'border-white/5 focus:border-white/20 focus:bg-white/[0.05]'}`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: null }));
              }}
            />
            {errors.name && <p className="text-red-500 text-xs font-black mt-3 ml-6 uppercase tracking-widest">{errors.name}</p>}
          </div>

          <div className="group/textarea relative">
            <label className="text-xs font-black text-text-muted uppercase tracking-[0.2em] ml-6 mb-3 block opacity-50">Message</label>
            <textarea
              placeholder="Write a message to appear on stream..."
              className={`w-full bg-white/[0.03] border-2 p-8 rounded-[2rem] outline-none transition-all h-40 resize-none text-base font-bold text-white placeholder:text-white/10 ${errors.message ? 'border-red-500/20 bg-red-500/[0.02]' : 'border-white/5 focus:border-white/20 focus:bg-white/[0.05]'}`}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) setErrors(prev => ({ ...prev, message: null }));
              }}
            ></textarea>
          </div>
        </div>

        {/* Gateway Selection */}
        <div className="space-y-6">
          <label className="text-xs font-black text-text-muted uppercase tracking-[0.2em] ml-6 block opacity-50">Payment Gateway</label>
          <div className="grid grid-cols-2 gap-5">
            <button
              type="button"
              onClick={() => setPaymentMethod("esewa")}
              className={`relative overflow-hidden p-8 rounded-[2rem] border-2 transition-all duration-500 ${paymentMethod === "esewa"
                ? "border-green-500/40 bg-green-500/10 shadow-2xl shadow-green-500/5"
                : "border-white/5 bg-white/[0.02] hover:border-white/20"
                }`}
            >
              <div className="flex flex-col items-center gap-3 relative z-10">
                <span className={`text-sm font-black tracking-[0.3em] uppercase transition-colors ${paymentMethod === 'esewa' ? 'text-green-400' : 'text-text-muted'}`}>eSewa</span>
                <div className={`w-2 h-2 rounded-full transition-all duration-500 ${paymentMethod === 'esewa' ? 'bg-green-500 scale-100' : 'bg-transparent scale-0'}`}></div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("khalti")}
              className={`relative overflow-hidden p-8 rounded-[2rem] border-2 transition-all duration-500 ${paymentMethod === "khalti"
                ? "border-purple-500/40 bg-purple-500/10 shadow-2xl shadow-purple-500/5"
                : "border-white/5 bg-white/[0.02] hover:border-white/20"
                }`}
            >
              <div className="flex flex-col items-center gap-3 relative z-10">
                <span className={`text-sm font-black tracking-[0.3em] uppercase transition-colors ${paymentMethod === 'khalti' ? 'text-purple-400' : 'text-text-muted'}`}>Khalti</span>
                <div className={`w-2 h-2 rounded-full transition-all duration-500 ${paymentMethod === 'khalti' ? 'bg-purple-500 scale-100' : 'bg-transparent scale-0'}`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="group/submit relative w-full h-24 rounded-[2.5rem] text-white font-heading font-black text-2xl transition-all duration-500 active:scale-[0.98] disabled:opacity-50 overflow-hidden shadow-2xl"
          style={{ backgroundColor: themeColor }}
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/submit:translate-y-0 transition-transform duration-500"></div>
          <div className="relative z-10 flex items-center justify-center gap-4">
            <span className="tracking-tight">{isLoading ? "Processing Transaction..." : `Send रू ${amount || '0'}`}</span>
            {!isLoading && (
              <svg className="w-8 h-8 transition-transform group-hover/submit:translate-x-2 group-hover/submit:-translate-y-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </div>
        </button>

        {/* Footer Info */}
        <div className="text-center pt-4">
          <p className="text-[11px] font-black text-text-muted/30 uppercase tracking-[0.4em]">Transaction secured with AES-256 Encryption</p>
        </div>
      </form>
    </div>
  );
}