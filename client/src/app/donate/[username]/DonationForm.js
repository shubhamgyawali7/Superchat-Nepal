"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function DonationForm({ streamer, serverUrl }) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("esewa");
  const [isLoading, setIsLoading] = useState(false);

  const themeColor = streamer.theme_color || "#f97316";

  const quickAmounts = [100, 500, 1000, 2500];

  const handlePayment = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount < 10) {
      alert("Minimum donation is रू 10");
      return;
    }
    if (!streamer?.username) {
      alert("Missing streamer info");
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
          amount: numericAmount,
          senderName: name,
          message: message,
          gateway: paymentMethod,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to initiate donation");
      }

      const data = await response.json();  // parse the data


      // 2. Handle eSewa ePay v2 redirect
      if (paymentMethod === "esewa" && data.paymentData?.formData) {
        // Store donationId in sessionStorage for success verification
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
        // Other gateways or fallback
        router.push(
          `/donate/success?name=${encodeURIComponent(name || "Anonymous")}&amount=${amount}`
        );
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert(`Failed to initiate payment: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative group">
      {/* Background Glow */}
      <div
        className="absolute -inset-1 bg-linear-to-r blur-xl opacity-20 transition duration-1000 group-hover:opacity-40"
        style={{ backgroundImage: `linear-gradient(to right, ${themeColor}, #fff)` }}
      ></div>

      <form
        onSubmit={handlePayment}
        className="relative bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl space-y-8"
      >
        {/* Amount Section */}
        <div className="space-y-4">
          <div className="text-center bg-slate-950/40 p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group/amount">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
              Set Your Amount
            </span>
            <div className="relative mt-4 flex items-center justify-center">
              <span className="text-2xl font-black opacity-30 mr-2">रू</span>
              <input
                type="number"
                required
                value={amount}
                className="no-spinner w-full bg-transparent text-center text-6xl font-black outline-none transition-all placeholder:opacity-10 selection:bg-orange-500/30"
                style={{ color: themeColor }}
                placeholder="500"
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* Quick Select Buttons */}
            <div className="flex justify-center gap-2 mt-6">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${amount == amt
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                    }`}
                >
                  +रू {amt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Group */}
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Your Name (e.g. Ghatak Fan)"
              required
              className="w-full bg-slate-950/30 border border-white/5 p-5 rounded-2xl outline-none focus:border-white/20 focus:bg-slate-950/50 transition-all text-lg font-medium"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="relative">
            <textarea
              placeholder={`Write a message to ${streamer.display_name || streamer.username}...`}
              className="w-full bg-slate-950/30 border border-white/5 p-5 rounded-2xl outline-none focus:border-white/20 focus:bg-slate-950/50 transition-all h-32 resize-none text-lg"
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <div className="absolute bottom-4 right-4 text-[10px] text-slate-600 font-bold uppercase">
              Appears in Live Alert
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
            Select Payment Gateway
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod("esewa")}
              className={`relative overflow-hidden p-5 rounded-3xl border-2 transition-all group/btn ${paymentMethod === "esewa"
                ? "border-green-500 bg-green-500/5"
                : "border-white/5 bg-slate-950/20 hover:border-white/10"
                }`}
            >
              <div className="flex flex-col items-center gap-2 relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${paymentMethod === 'esewa' ? 'bg-green-500 text-white' : 'bg-slate-800'}`}>
                  🌿
                </div>
                <span className={`text-xs font-black uppercase tracking-tighter ${paymentMethod === 'esewa' ? 'text-green-500' : 'text-slate-400'}`}>eSewa</span>
              </div>
              {paymentMethod === 'esewa' && <div className="absolute inset-0 bg-green-500/5 animate-pulse"></div>}
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("khalti")}
              className={`relative overflow-hidden p-5 rounded-3xl border-2 transition-all group/btn ${paymentMethod === "khalti"
                ? "border-purple-500 bg-purple-500/5"
                : "border-white/5 bg-slate-950/20 hover:border-white/10"
                }`}
            >
              <div className="flex flex-col items-center gap-2 relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${paymentMethod === 'khalti' ? 'bg-purple-500 text-white' : 'bg-slate-800'}`}>
                  🪁
                </div>
                <span className={`text-xs font-black uppercase tracking-tighter ${paymentMethod === 'khalti' ? 'text-purple-500' : 'text-slate-400'}`}>Khalti</span>
              </div>
              {paymentMethod === 'khalti' && <div className="absolute inset-0 bg-purple-500/5 animate-pulse"></div>}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full relative overflow-hidden group/submit py-6 rounded-3xl text-white font-black text-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all active:scale-[0.98] disabled:opacity-50"
          style={{ backgroundColor: themeColor }}
        >
          <div className="relative z-10 flex items-center justify-center gap-3">
            <span>{isLoading ? "Processing..." : `Send Superchat`}</span>
            {!isLoading && <span className="text-2xl animate-bounce-x">🚀</span>}
          </div>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/submit:translate-y-0 transition-transform duration-300"></div>
        </button>

      </form>
    </div>
  );
}
