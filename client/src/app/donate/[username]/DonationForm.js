"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import Icon from "@/components/common/Icon";
import {
  CheckmarkCircle01Icon,
  Wallet01Icon,
  Radio01Icon,
} from "@hugeicons/core-free-icons";

export default function DonationForm({ streamer }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [amount, setAmount] = useState("100");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("esewa");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
      newErrors.name = "Your supporter name is required";
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
        const errorText = errorData.details
          ? `${errorData.error}: ${errorData.details}`
          : errorData.error || "Failed to initiate donation";
        throw new Error(errorText);
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
      } else if (paymentMethod === "khalti" && data.paymentData?.payment_url) {
        window.location.href = data.paymentData.payment_url;
      } else {
        router.push(`/donate/${streamer.username}/success?name=${encodeURIComponent(name)}&amount=${amount}`);
      }
    } catch (err) {
      console.error("Payment error:", err);
      addToast(err.message || "Payment initiation failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Main Donation Box (No gradients, No shadows, No colored borders) */}
      <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-6 sm:p-10">
        <form onSubmit={handlePayment} className="space-y-6">
          {/* Amount Selector */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-3">
              1. Choose Amount (NPR)
            </label>

            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-heading font-black text-zinc-500">रू</span>
                <input
                  type="number"
                  value={amount}
                  className="w-48 bg-transparent text-center text-5xl sm:text-6xl font-heading font-black text-white outline-none placeholder:text-zinc-700"
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
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                        isSelected
                          ? "bg-white text-black"
                          : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
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
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">
                2. Your Name
              </label>
              <input
                type="text"
                placeholder="e.g. Biraj, NepaliGamer"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors"
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
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-400">
                  3. Superchat Message
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {message.length}/300
                </span>
              </div>
              <textarea
                placeholder="Write a message to be read aloud via Text-to-Speech on stream..."
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors resize-none"
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
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-3">
              4. Select Payment Gateway
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("esewa")}
                className={`p-4 rounded-xl border text-left transition-colors ${
                  paymentMethod === "esewa"
                    ? "bg-zinc-900 border-zinc-500"
                    : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-2 text-sm font-bold text-white">
                    <Icon icon={CheckmarkCircle01Icon} size={16} className="text-emerald-400" />
                    eSewa
                  </span>
                  {paymentMethod === "esewa" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <p className="text-[10px] text-zinc-400 font-medium">Instant Verification</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("khalti")}
                className={`p-4 rounded-xl border text-left transition-colors ${
                  paymentMethod === "khalti"
                    ? "bg-zinc-900 border-zinc-500"
                    : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-2 text-sm font-bold text-white">
                    <Icon icon={Wallet01Icon} size={16} className="text-purple-400" />
                    Khalti
                  </span>
                  {paymentMethod === "khalti" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <p className="text-[10px] text-zinc-400 font-medium">Instant Sandbox / ePayment</p>
              </button>
            </div>
          </div>

          {/* Live On-Screen Preview */}
          <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Icon icon={Radio01Icon} size={12} className="text-violet-400" />
                Live On-Stream Preview
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">OBS Alert</span>
            </div>

            <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 text-center space-y-1.5">
              <p className="text-xs font-black uppercase tracking-tight text-white">
                {name || "Your Name"}{" "}
                <span className="text-violet-400 font-black">sent रू {amount || "0"}</span>
              </p>
              {message && (
                <p className="text-xs text-zinc-300 italic max-w-sm mx-auto">
                  &ldquo;{message}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* Pay Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-black py-4 rounded-xl text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {isLoading
              ? "Processing..."
              : `Send रू ${amount || "0"} Superchat`}
          </button>
        </form>
      </div>
    </div>
  );
}
