"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";

export default function DonationForm({ streamer }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [amount, setAmount] = useState("100");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("esewa");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const themeColor = streamer.theme_color || "#ff5500";
  const quickAmounts = [50, 100, 250, 500, 1000, 2500];

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
      newErrors.name = "Your streamer/supporter name is required";
    } else if (name.length > 50) {
      newErrors.name = "Name must be under 50 characters";
    }

    if (message.length > 300) {
      newErrors.message = "Message must be under 300 characters";
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

      const response = await fetch("/api/donations/initiate", {
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
    <div className="w-full space-y-8">
      {/* Main Donation Box */}
      <div className="relative rounded-3xl bg-[#0c1220]/95 backdrop-blur-2xl border border-white/[0.08] p-6 sm:p-10 shadow-2xl">
        <form onSubmit={handlePayment} className="space-y-7">
          {/* Amount Selector */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
              1. Choose Amount (NPR)
            </label>

            <div className="relative rounded-2xl bg-black/40 border border-white/10 p-6 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-heading font-black text-slate-500">रू</span>
                <input
                  type="number"
                  value={amount}
                  className="w-48 bg-transparent text-center text-6xl sm:text-7xl font-heading font-black text-white outline-none placeholder:text-slate-700"
                  placeholder="100"
                  min="10"
                  max="100000"
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (errors.amount) setErrors((prev) => ({ ...prev, amount: null }));
                  }}
                />
              </div>

              {errors.amount && (
                <p className="text-red-400 text-xs font-bold mt-3">{errors.amount}</p>
              )}

              {/* Quick Amount Chips */}
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {quickAmounts.map((amt) => {
                  const isSelected = amount === String(amt);
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setAmount(String(amt));
                        if (errors.amount) setErrors((prev) => ({ ...prev, amount: null }));
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                        isSelected
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-lg shadow-orange-500/20 scale-105"
                          : "bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border border-white/[0.06]"
                      }`}
                    >
                      रू {amt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Supporter Name & Message */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                2. Your Name
              </label>
              <input
                type="text"
                placeholder="e.g. Biraj, NepaliGamer_99"
                className={`w-full bg-black/40 border rounded-xl px-4 py-3.5 text-sm font-bold text-white placeholder-slate-600 outline-none transition-all ${
                  errors.name
                    ? "border-red-500/50"
                    : "border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                }`}
                value={name}
                maxLength={50}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                }}
              />
              {errors.name && <p className="text-red-400 text-xs font-bold mt-1.5">{errors.name}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400">
                  3. Superchat Message
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {message.length}/300
                </span>
              </div>
              <textarea
                placeholder="Write a message to be read aloud via Text-to-Speech on stream..."
                rows={3}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium text-white placeholder-slate-600 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all resize-none"
                value={message}
                maxLength={300}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (errors.message) setErrors((prev) => ({ ...prev, message: null }));
                }}
              />
            </div>
          </div>

          {/* Gateway Selector */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
              4. Select Payment Gateway
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("esewa")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  paymentMethod === "esewa"
                    ? "bg-emerald-500/15 border-emerald-500/50 shadow-lg shadow-emerald-500/10"
                    : "bg-black/30 border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base font-black text-emerald-400">🟢 eSewa</span>
                  {paymentMethod === "esewa" && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Instant Verification</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("khalti")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  paymentMethod === "khalti"
                    ? "bg-purple-500/15 border-purple-500/50 shadow-lg shadow-purple-500/10"
                    : "bg-black/30 border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base font-black text-purple-400">🟣 Khalti</span>
                  {paymentMethod === "khalti" && (
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Coming Soon</p>
              </button>
            </div>
          </div>

          {/* Live On-Screen Preview */}
          <div className="rounded-2xl bg-black/50 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                Live On-Stream Preview
              </span>
              <span className="text-[10px] text-slate-500 font-mono">OBS Alert</span>
            </div>

            <div className="rounded-xl bg-[#121929] border border-orange-500/30 p-4 text-center space-y-2 shadow-inner">
              <p className="text-xs font-black uppercase tracking-tight text-white">
                {name || "Your Name"}{" "}
                <span className="text-orange-400 font-black">sent रू {amount || "0"}</span>
              </p>
              {message && (
                <p className="text-xs text-slate-300 italic max-w-sm mx-auto">
                  &ldquo;{message}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* Pay Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 hover:from-orange-400 hover:to-amber-400 text-black py-4 rounded-2xl text-base font-black uppercase tracking-wider transition-all shadow-xl shadow-orange-500/25 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {isLoading ? "Redirecting to Gateway..." : `Send रू ${amount || "0"} Superchat →`}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-slate-500 font-medium">
        🔒 Encrypted &amp; direct payments to {displayName}. No middleman fees.
      </p>
    </div>
  );
}
