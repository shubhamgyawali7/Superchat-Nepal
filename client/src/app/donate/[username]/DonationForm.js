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

  const themeColor = streamer.theme_color || streamer.themeColor || "#FF4D0A";
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
    <div className="w-full rounded-3xl border border-[#e8e1d7] bg-white/90 p-4 shadow-[0_18px_55px_-32px_rgba(91,55,19,0.28)] sm:p-7 lg:p-8">
      {/* Main Donation Box (No gradients, No shadows, No colored borders) */}
      <div>
        <form onSubmit={handlePayment} className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
          {/* Amount Selector */}
          <div>
            <label className="mb-3 block text-base font-bold text-[#29231e]">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: themeColor }}>Step 1</span>
              Choose an amount <span className="text-xs font-medium text-[#887d72]">· NPR</span>
            </label>

            <div className="rounded-2xl border border-[#f0e6d8] bg-[#fffaf3] p-4 sm:p-5 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-heading font-bold" style={{ color: themeColor }}>रु</span>
                <input
                  type="number"
                  value={amount}
                  aria-label="Donation amount in Nepali rupees"
                  className="w-40 bg-transparent text-center text-5xl font-heading font-extrabold tracking-tight text-[#211d1a] outline-none placeholder:text-[#c8bbaa]"
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
                <p className="text-red-600 text-xs font-bold mt-3">{errors.amount}</p>
              )}

              {/* Quick Amount Chips */}
              <div className="mt-4 grid w-full grid-cols-3 gap-2 sm:grid-cols-6">
                {quickAmounts.map((amt) => {
                  const isSelected = amount === String(amt);
                  return (
                    <button
                      key={amt}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => {
                        setAmount(String(amt));
                        if (errors.amount) setErrors((prev) => ({ ...prev, amount: null }));
                      }}
                      className={`rounded-xl border px-2 py-2.5 text-xs font-bold transition ${isSelected
                          ? "text-white shadow-sm"
                          : "border-[#e8e1d7] bg-white text-[#51473e] hover:bg-slate-50"
                        }`}
                      style={
                        isSelected
                          ? { backgroundColor: themeColor, borderColor: themeColor }
                          : {}
                      }
                    >
                      रु {amt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Supporter Name & Message */}
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-[#29231e]">
                Your name
              </label>
              <input
                type="text"
                placeholder="e.g. Biraj, NepaliGamer"
                className="w-full rounded-xl border border-[#e8e1d7] bg-[#fffdfa] px-4 py-3 text-sm font-medium text-[#29231e] placeholder:text-[#a69a8d] outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                value={name}
                maxLength={50}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                }}
              />
              {errors.name && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.name}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-[#29231e]">
                  Message for the stream
                </label>
                <span className="text-xs tabular-nums text-[#887d72]">
                  {message.length}/300
                </span>
              </div>
              <textarea
                placeholder="Write a message to be read aloud on stream…"
                rows={4}
                className="w-full resize-none rounded-xl border border-[#e8e1d7] bg-[#fffdfa] px-4 py-3 text-sm font-medium text-[#29231e] placeholder:text-[#a69a8d] outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
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
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: themeColor }}>Step 2</label>
            <p className="mb-3 text-base font-bold text-[#29231e]">
              Choose your payment
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("esewa")}
                aria-pressed={paymentMethod === "esewa"}
                className={`rounded-xl border p-4 text-left transition ${paymentMethod === "esewa"
                    ? "ring-2"
                    : "border-[#e8e1d7] bg-white hover:border-slate-300"
                  }`}
                style={
                  paymentMethod === "esewa"
                    ? { borderColor: themeColor, backgroundColor: `${themeColor}0D`, outlineColor: themeColor }
                    : {}
                }
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-2 text-sm font-bold text-[#29231e]">
                    <Icon icon={CheckmarkCircle01Icon} size={16} className="text-emerald-600" />
                    eSewa
                  </span>
                  {paymentMethod === "esewa" && (
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColor }} />
                  )}
                </div>
                <p className="text-xs font-medium text-[#887d72]">Instant verification</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("khalti")}
                aria-pressed={paymentMethod === "khalti"}
                className={`rounded-xl border p-4 text-left transition ${paymentMethod === "khalti"
                    ? "ring-2"
                    : "border-[#e8e1d7] bg-white hover:border-slate-300"
                  }`}
                style={
                  paymentMethod === "khalti"
                    ? { borderColor: themeColor, backgroundColor: `${themeColor}0D`, outlineColor: themeColor }
                    : {}
                }
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-2 text-sm font-bold text-[#29231e]">
                    <Icon icon={Wallet01Icon} size={16} className="text-violet-600" />
                    Khalti
                  </span>
                  {paymentMethod === "khalti" && (
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColor }} />
                  )}
                </div>
                <p className="text-xs font-medium text-[#887d72]">Secure ePayment</p>
              </button>
            </div>
          </div>

          {/* Live On-Screen Preview */}
          <div className="flex flex-col rounded-2xl border border-[#f0e6d8] bg-[#fffaf3] p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#71675e]">
                <Icon icon={Radio01Icon} size={14} style={{ color: themeColor }} />
                Live On-Stream Preview
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#887d72]"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />OBS alert</span>
            </div>

            <div className="flex min-h-36 flex-1 flex-col items-center justify-center rounded-xl border border-[#eee3d5] bg-white px-4 py-5 text-center">
              <p className="text-sm font-extrabold text-[#29231e]">
                {name || "Your Name"}{" "}
                <span className="font-black" style={{ color: themeColor }}>sent रु {amount || "0"}</span>
              </p>
              {message && (
                <p className="mx-auto mt-2 max-w-sm text-sm leading-5 text-[#71675e]">
                  &ldquo;{message}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* Pay Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl px-5 py-4 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-55 lg:col-span-2 active:scale-98"
            style={{ backgroundColor: themeColor }}
          >
            {isLoading
              ? "Processing..."
              : `Send रु ${amount || "0"} superchat`}
          </button>
        <p className="-mt-4 text-center text-[11px] text-[#887d72] lg:col-span-2">Secure checkout through {paymentMethod === "esewa" ? "eSewa" : "Khalti"}.</p>
      </form>
    </div>
    </div>
  );
}
