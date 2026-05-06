"use client";
import React, { useState } from "react";

export default function SettingsForm({ initialProfile }) {
  const [formData, setFormData] = useState({
    display_name: initialProfile?.display_name || "",
    bio: initialProfile?.bio || "",
    upi_id: initialProfile?.upi_id || "",
    theme_color: initialProfile?.theme_color || "#f97316",
    welcome_title: initialProfile?.welcome_title || "Support My Stream",
    welcome_sub: initialProfile?.welcome_sub || "Your support helps me keep creating content!",
    youtube_url: initialProfile?.youtube_url || "",
    facebook_url: initialProfile?.facebook_url || "",
    alert_min_amount: initialProfile?.alert_min_amount || 0,
    alert_duration: initialProfile?.alert_duration || 5,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/streamer/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        throw new Error(data.error || "Update failed");
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 text-white">
      <h1 className="text-4xl font-black mb-2 uppercase tracking-tight">
        Settings
      </h1>
      <p className="text-slate-400 mb-8">
        Customize your profile, payment IDs, and donation page theme.
      </p>

      {message && (
        <div
          className={`mb-8 p-4 rounded-xl border ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-500"
              : "bg-red-500/10 border-red-500/20 text-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* --- PROFILE BASICS --- */}
        <section className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold border-b border-slate-800 pb-4">
            Profile Basics
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                Display Name
              </label>
              <input
                type="text"
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Ghatak Gaming"
                value={formData.display_name}
                onChange={(e) =>
                  setFormData({ ...formData, display_name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                Theme Color
              </label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  className="w-12 h-12 bg-transparent border-none cursor-pointer"
                  value={formData.theme_color}
                  onChange={(e) =>
                    setFormData({ ...formData, theme_color: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="flex-1 bg-slate-800 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-mono"
                  value={formData.theme_color}
                  onChange={(e) =>
                    setFormData({ ...formData, theme_color: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
              Bio / Description
            </label>
            <textarea
              rows="3"
              className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Tell your fans a bit about yourself..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>
        </section>

        {/* --- PAYMENT & DONATION --- */}
        <section className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold border-b border-slate-800 pb-4">
            Payment & Donation Page
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                eSewa / Khalti ID (UPI ID)
              </label>
              <input
                type="text"
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="98XXXXXXXX"
                value={formData.upi_id}
                onChange={(e) => setFormData({ ...formData, upi_id: e.target.value })}
              />
              <p className="text-[10px] text-slate-500 mt-2">
                Enter your mobile number associated with eSewa or Khalti.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 pt-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                Welcome Title
              </label>
              <input
                type="text"
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                value={formData.welcome_title}
                onChange={(e) =>
                  setFormData({ ...formData, welcome_title: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                Welcome Subtitle
              </label>
              <input
                type="text"
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                value={formData.welcome_sub}
                onChange={(e) =>
                  setFormData({ ...formData, welcome_sub: e.target.value })
                }
              />
            </div>
          </div>
        </section>

        {/* --- OBS ALERT SETTINGS --- */}
        <section className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold border-b border-slate-800 pb-4 flex items-center gap-2">
            <span>📺</span> OBS Alert Settings
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                Minimum Amount for Alert (NPR)
              </label>
              <input
                type="number"
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="0"
                value={formData.alert_min_amount}
                onChange={(e) =>
                  setFormData({ ...formData, alert_min_amount: e.target.value })
                }
              />
              <p className="text-[10px] text-slate-500 mt-2">
                Donations below this amount will not trigger an OBS popup.
              </p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                Alert Duration (Seconds)
              </label>
              <input
                type="number"
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="5"
                value={formData.alert_duration}
                onChange={(e) =>
                  setFormData({ ...formData, alert_duration: e.target.value })
                }
              />
              <p className="text-[10px] text-slate-500 mt-2">
                How long the alert stays on screen.
              </p>
            </div>
          </div>
        </section>

        {/* --- SOCIAL LINKS --- */}
        <section className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold border-b border-slate-800 pb-4">
            Social Links
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                YouTube Channel URL
              </label>
              <input
                type="url"
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="https://youtube.com/@..."
                value={formData.youtube_url}
                onChange={(e) =>
                  setFormData({ ...formData, youtube_url: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                Facebook Page URL
              </label>
              <input
                type="url"
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="https://facebook.com/..."
                value={formData.facebook_url}
                onChange={(e) =>
                  setFormData({ ...formData, facebook_url: e.target.value })
                }
              />
            </div>
          </div>
        </section>

        <div className="pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black hover:bg-slate-200 font-black py-4 rounded-2xl transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? "SAVING CHANGES..." : "SAVE ALL SETTINGS"}
          </button>
        </div>
      </form>
    </div>
  );
}
