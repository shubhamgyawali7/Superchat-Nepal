"use client";
import React, { useState, useCallback, useRef } from "react";
import { useToast } from "@/hooks/useToast";
import { useAutoSave } from "@/hooks/useAutoSave";

const Section = ({ title, children }) => (
  <section className="bg-surface border border-surface-border p-5 rounded-xl space-y-4">
    <p className="text-[10px] text-text-muted uppercase tracking-widest border-b border-surface-border pb-3 heading font-bold">{title}</p>
    {children}
  </section>
);

const Field = ({ label, hint, children }) => (
  <div>
    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">{label}</label>
    {children}
    {hint && <p className="text-[10px] text-text-muted opacity-80 mt-1.5">{hint}</p>}
  </div>
);

const inputCls = "w-full bg-background border border-surface-border focus:border-orange-500/50 p-2.5 rounded-xl text-sm outline-none transition-colors text-foreground placeholder-text-muted";

export default function SettingsForm({ initialProfile }) {
  const { addToast } = useToast();
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
    alert_gif_url: initialProfile?.alert_gif_url || "",
    alert_font_family: initialProfile?.alert_font_family || "Inter, sans-serif",
    alert_text_color: initialProfile?.alert_text_color || "#ffffff",
    alert_amount_color: initialProfile?.alert_amount_color || "#34d399",
    alert_message_color: initialProfile?.alert_message_color || "#f1f5f9",
    alert_bg_color: initialProfile?.alert_bg_color || "rgba(0,0,0,0.85)",
    alert_border_color: initialProfile?.alert_border_color || "",
    alert_position: initialProfile?.alert_position || "top",
    alert_animation: initialProfile?.alert_animation || "slide",
    tts_enabled: initialProfile?.tts_enabled !== false,
    tts_rate: initialProfile?.tts_rate || 0.9,
    recent_donations_position: initialProfile?.recent_donations_position || "bottom-left",
    recent_donations_count: initialProfile?.recent_donations_count ?? 5,
  });

  const [saveStatus, setSaveStatus] = useState("saved"); // 'saved', 'saving', 'error'

  const saveProfile = useCallback(async (data) => {
    setSaveStatus("saving");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/streamer/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to auto-save");
      setSaveStatus("saved");
    } catch (err) {
      console.error("Auto-save failed:", err);
      setSaveStatus("error");
    }
  }, []);

  useAutoSave(formData, saveProfile, 3000);

  const set = (key) => (e) => {
    setFormData({ ...formData, [key]: e.target.value });
    setSaveStatus("changed");
  };

  const toggle = (key) => () => {
    setFormData({ ...formData, [key]: !formData[key] });
    setSaveStatus("changed");
  };

  const [uploading, setUploading] = useState({ gif: false });
  const gifInputRef = useRef(null);

  const uploadAsset = useCallback((file) => {
    if (file.size > 3 * 1024 * 1024) {
      addToast("File too large. Max 3MB.", "error");
      return;
    }

    setUploading((prev) => ({ ...prev, gif: true }));

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, alert_gif_url: reader.result }));
      setSaveStatus("changed");
      setUploading((prev) => ({ ...prev, gif: false }));
      addToast("GIF loaded! Save to apply.", "success");
    };
    reader.onerror = () => {
      addToast("Failed to read file", "error");
      setUploading((prev) => ({ ...prev, gif: false }));
    };
    reader.readAsDataURL(file);
  }, [addToast]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadAsset(file);
    e.target.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus("saving");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/streamer/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSaveStatus("saved");
        addToast("Settings saved successfully!", "success");
      } else {
        const data = await res.json();
        throw new Error(data.error || "Update failed");
      }
    } catch (err) {
      setSaveStatus("error");
      addToast(err.message, "error");
    }
  };

  return (
    <div className="text-foreground">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-text-muted uppercase tracking-widest mb-0.5">Dashboard / Settings</p>
          <h1 className="text-xl font-bold uppercase tracking-tight heading">
            Settings
          </h1>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
          {saveStatus === 'saving' && <span className="text-orange-400 animate-pulse">Saving...</span>}
          {saveStatus === 'saved' && <span className="text-emerald-500">✓ All changes saved</span>}
          {saveStatus === 'error' && <span className="text-red-500">⚠ Save failed</span>}
          {saveStatus === 'changed' && <span className="text-text-muted">Unsaved changes...</span>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Basics */}
        <Section title="Profile Basics">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Display Name">
              <input type="text" className={inputCls} placeholder="Ghatak Gaming"
                value={formData.display_name} onChange={set("display_name")} />
            </Field>
            <Field label="Theme Color">
              <div className="flex gap-3 items-center">
                <input type="color" className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-none p-0"
                  value={formData.theme_color} onChange={set("theme_color")} />
                <input type="text" className={`${inputCls} font-mono`}
                  value={formData.theme_color} onChange={set("theme_color")} />
              </div>
            </Field>
          </div>
          <Field label="Bio">
            <textarea rows="2" className={`${inputCls} resize-none`}
              placeholder="Tell your fans about yourself..."
              value={formData.bio} onChange={set("bio")} />
          </Field>
        </Section>

        {/* Payment */}
        <Section title="Payment & Donation Page">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="eSewa / Khalti ID" hint="Your mobile number registered with eSewa or Khalti.">
              <input type="text" className={inputCls} placeholder="98XXXXXXXX"
                value={formData.upi_id} onChange={set("upi_id")} />
            </Field>
          </div>
          <div className="grid md:grid-cols-2 gap-4 pt-1">
            <Field label="Welcome Title">
              <input type="text" className={inputCls}
                value={formData.welcome_title} onChange={set("welcome_title")} />
            </Field>
            <Field label="Welcome Subtitle">
              <input type="text" className={inputCls}
                value={formData.welcome_sub} onChange={set("welcome_sub")} />
            </Field>
          </div>
        </Section>

        {/* OBS Alert */}
        <Section title="📺  OBS Alert Settings">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Minimum Alert Amount (NPR)" hint="Donations below this won't trigger an OBS popup.">
              <input type="number" className={inputCls} placeholder="0"
                value={formData.alert_min_amount} onChange={set("alert_min_amount")} />
            </Field>
            <Field label="Alert Duration (Seconds)" hint="How long the alert stays on screen.">
              <input type="number" className={inputCls} placeholder="5"
                value={formData.alert_duration} onChange={set("alert_duration")} />
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-1">
            <Field label="Alert GIF / Image" hint="Upload a .gif, .png, or .webp from your device.">
              <input ref={gifInputRef} type="file" accept=".gif,.png,.webp,.jpg,.jpeg" className="hidden"
                onChange={handleFileSelect} />
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => gifInputRef.current?.click()}
                  disabled={uploading.gif}
                  className="flex-1 bg-background border border-surface-border hover:border-orange-500/50 p-2.5 rounded-xl text-sm text-text-muted transition-colors cursor-pointer disabled:opacity-50">
                  {uploading.gif ? "Uploading..." : formData.alert_gif_url ? "Change GIF" : "Choose GIF File"}
                </button>
                {formData.alert_gif_url && (
                  <button type="button" onClick={() => { setFormData({ ...formData, alert_gif_url: "" }); setSaveStatus("changed"); }}
                    className="text-red-400 hover:text-red-300 text-xs px-2 py-1">Remove</button>
                )}
              </div>
              {formData.alert_gif_url && (
                <div className="mt-2 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.alert_gif_url} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                </div>
              )}
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-1">
            <Field label="Alert Position" hint="Where the alert appears on screen.">
              <select className={inputCls}
                value={formData.alert_position} onChange={set("alert_position")}>
                <option value="top">Top</option>
                <option value="center">Center</option>
                <option value="bottom">Bottom</option>
              </select>
            </Field>
            <Field label="Alert Animation" hint="How the alert enters the screen.">
              <select className={inputCls}
                value={formData.alert_animation} onChange={set("alert_animation")}>
                <option value="slide">Slide</option>
                <option value="bounce">Bounce</option>
                <option value="fade">Fade</option>
                <option value="zoom">Zoom</option>
              </select>
            </Field>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pt-1">
            <Field label="Name Color" hint="Color of the donor name.">
              <div className="flex gap-2 items-center">
                <input type="color" className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-none p-0"
                  value={formData.alert_text_color} onChange={set("alert_text_color")} />
                <input type="text" className={`${inputCls} font-mono text-xs`}
                  value={formData.alert_text_color} onChange={set("alert_text_color")} />
              </div>
            </Field>
            <Field label="Amount Color" hint="Color of the donation amount.">
              <div className="flex gap-2 items-center">
                <input type="color" className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-none p-0"
                  value={formData.alert_amount_color} onChange={set("alert_amount_color")} />
                <input type="text" className={`${inputCls} font-mono text-xs`}
                  value={formData.alert_amount_color} onChange={set("alert_amount_color")} />
              </div>
            </Field>
            <Field label="Message Color" hint="Color of the message text.">
              <div className="flex gap-2 items-center">
                <input type="color" className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-none p-0"
                  value={formData.alert_message_color} onChange={set("alert_message_color")} />
                <input type="text" className={`${inputCls} font-mono text-xs`}
                  value={formData.alert_message_color} onChange={set("alert_message_color")} />
              </div>
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-1">
            <Field label="Alert Background" hint="Background color of the alert card.">
              <div className="flex gap-2 items-center">
                <input type="color" className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-none p-0"
                  value={formData.alert_bg_color} onChange={set("alert_bg_color")} />
                <input type="text" className={`${inputCls} font-mono text-xs`}
                  value={formData.alert_bg_color} onChange={set("alert_bg_color")} />
              </div>
            </Field>
            <Field label="Border Color" hint="Leave blank to use theme color.">
              <div className="flex gap-2 items-center">
                <input type="color" className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-none p-0"
                  value={formData.alert_border_color || formData.theme_color} onChange={set("alert_border_color")} />
                <input type="text" className={`${inputCls} font-mono text-xs`}
                  value={formData.alert_border_color} onChange={set("alert_border_color")} placeholder="theme color" />
              </div>
            </Field>
          </div>

          <Field label="Font Family" hint="Font used for alert text. Use any web-safe or Google Font name.">
            <input type="text" className={inputCls} placeholder="Inter, sans-serif"
              value={formData.alert_font_family} onChange={set("alert_font_family")} />
          </Field>

          <div className="grid md:grid-cols-2 gap-4 pt-1">
            <Field label="TTS (Text-to-Speech)" hint="Read donor name and message aloud.">
              <button type="button" onClick={toggle("tts_enabled")}
                className={`relative w-14 h-7 rounded-full transition-colors ${formData.tts_enabled ? 'bg-orange-500' : 'bg-surface-border'}`}>
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${formData.tts_enabled ? 'translate-x-7' : ''}`} />
              </button>
            </Field>
            <Field label="TTS Speed" hint="How fast the voice reads (0.1x – 2x).">
              <input type="range" min="0.1" max="2" step="0.1"
                className="w-full accent-orange-500"
                value={formData.tts_rate} onChange={set("tts_rate")} />
              <p className="text-[10px] text-text-muted mt-1">{formData.tts_rate}x</p>
            </Field>
          </div>
        </Section>

        {/* Recent Donations Overlay */}
        <Section title="📋  Recent Donations Overlay">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Position" hint="Where recent donations appear on the overlay.">
              <select className={inputCls}
                value={formData.recent_donations_position} onChange={set("recent_donations_position")}>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
              </select>
            </Field>
            <Field label="Max Items" hint="How many recent donations to show (0 to hide).">
              <input type="number" className={inputCls} placeholder="5"
                value={formData.recent_donations_count} onChange={set("recent_donations_count")} />
            </Field>
          </div>
        </Section>

        {/* Social Links */}
        <Section title="Social Links">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="YouTube URL">
              <input type="url" className={inputCls} placeholder="https://youtube.com/@..."
                value={formData.youtube_url} onChange={set("youtube_url")} />
            </Field>
            <Field label="Facebook URL">
              <input type="url" className={inputCls} placeholder="https://facebook.com/..."
                value={formData.facebook_url} onChange={set("facebook_url")} />
            </Field>
          </div>
        </Section>

        <button
          type="submit"
          disabled={saveStatus === 'saving'}
          className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold py-3.5 rounded-xl text-sm uppercase tracking-wide transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {saveStatus === 'saving' ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}

