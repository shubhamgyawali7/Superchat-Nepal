"use client";
import React, { useState, useCallback, useRef } from "react";
import { useToast } from "@/hooks/useToast";
import { useAutoSave } from "@/hooks/useAutoSave";

const Section = ({ title, icon, children }) => (
  <section className="bg-[#0c1220] border border-white/[0.08] p-6 rounded-3xl space-y-5">
    <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
      <span className="text-base">{icon}</span>
      <h2 className="text-xs font-black text-slate-300 uppercase tracking-wider">
        {title}
      </h2>
    </div>
    {children}
  </section>
);

const Field = ({ label, hint, children }) => (
  <div>
    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    {children}
    {hint && <p className="text-[11px] text-slate-500 mt-1">{hint}</p>}
  </div>
);

const inputCls =
  "w-full bg-black/40 border border-white/10 focus:border-orange-500 p-3 rounded-xl text-sm font-medium outline-none transition-colors text-white placeholder-slate-600";

export default function SettingsForm({ initialProfile }) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    display_name: initialProfile?.display_name || "",
    bio: initialProfile?.bio || "",
    theme_color: initialProfile?.theme_color || "#ff5500",
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
    alert_bg_color: initialProfile?.alert_bg_color || "rgba(11, 15, 25, 0.92)",
    alert_border_color: initialProfile?.alert_border_color || "",
    alert_position: initialProfile?.alert_position || "top",
    alert_animation: initialProfile?.alert_animation || "slide",
    tts_enabled: initialProfile?.tts_enabled !== false,
    tts_rate: initialProfile?.tts_rate || 0.9,
    recent_donations_position: initialProfile?.recent_donations_position || "bottom-left",
    recent_donations_count: initialProfile?.recent_donations_count ?? 5,
  });

  const [saveStatus, setSaveStatus] = useState("saved");

  const saveProfile = useCallback(async (data) => {
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/streamer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      setSaveStatus("saved");
    } catch (err) {
      console.error("Save failed:", err);
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

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      addToast("File too large. Max 3MB.", "error");
      return;
    }

    setUploading({ gif: true });
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, alert_gif_url: reader.result }));
      setSaveStatus("changed");
      setUploading({ gif: false });
      addToast("Custom alert GIF loaded!", "success");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-orange-400 uppercase tracking-widest font-black mb-1">
            Dashboard / OBS Studio
          </p>
          <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-white">
            Alert &amp; Stream Settings
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider">
            {saveStatus === "saving" && <span className="text-orange-400 animate-pulse">Saving...</span>}
            {saveStatus === "saved" && <span className="text-emerald-400">✓ Changes saved</span>}
            {saveStatus === "error" && <span className="text-red-400">Save failed</span>}
            {saveStatus === "changed" && <span className="text-amber-400">● Unsaved changes</span>}
          </span>
          <button
            type="button"
            onClick={() => saveProfile(formData)}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20"
          >
            Save Now
          </button>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); saveProfile(formData); }} className="space-y-6">
        {/* 1. OBS Popup Alert Settings */}
        <Section title="OBS Popup Alert Box" icon="🔔">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Minimum Alert Amount (NPR)" hint="Donations below this won't trigger an on-screen popup.">
              <input
                type="number"
                className={inputCls}
                placeholder="0"
                value={formData.alert_min_amount}
                onChange={set("alert_min_amount")}
              />
            </Field>

            <Field label="Alert Duration (Seconds)" hint="How many seconds the popup stays visible on stream.">
              <input
                type="number"
                className={inputCls}
                placeholder="5"
                min="2"
                max="30"
                value={formData.alert_duration}
                onChange={set("alert_duration")}
              />
            </Field>
          </div>

          <div className="pt-2">
            <Field label="Custom Alert GIF / Animation" hint="Upload a .gif or image, or leave blank to use the built-in celebration animation.">
              <input
                ref={gifInputRef}
                type="file"
                accept=".gif,.png,.webp,.jpg"
                className="hidden"
                onChange={handleFileSelect}
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => gifInputRef.current?.click()}
                  disabled={uploading.gif}
                  className="bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 transition-colors"
                >
                  {uploading.gif ? "Loading..." : formData.alert_gif_url ? "Change GIF" : "Upload Custom GIF"}
                </button>
                {formData.alert_gif_url && (
                  <button
                    type="button"
                    onClick={() => { setFormData({ ...formData, alert_gif_url: "" }); setSaveStatus("changed"); }}
                    className="text-xs text-red-400 hover:text-red-300 font-bold px-2 py-1"
                  >
                    Remove Custom GIF
                  </button>
                )}
              </div>
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-2">
            <Field label="On-Screen Position" hint="Where the alert appears in your OBS browser source.">
              <select className={inputCls} value={formData.alert_position} onChange={set("alert_position")}>
                <option value="top">Top</option>
                <option value="center">Center</option>
                <option value="bottom">Bottom</option>
              </select>
            </Field>

            <Field label="Entrance Animation" hint="Motion effect when superchat arrives.">
              <select className={inputCls} value={formData.alert_animation} onChange={set("alert_animation")}>
                <option value="slide">Smooth Slide</option>
                <option value="bounce">Bouncy Pop</option>
                <option value="fade">Gentle Fade</option>
                <option value="zoom">Zoom Impact</option>
              </select>
            </Field>
          </div>
        </Section>

        {/* 2. Text-to-Speech (TTS) Settings */}
        <Section title="Automated Text-to-Speech (TTS)" icon="🗣️">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <Field label="Enable Voice Reader" hint="Reads donor name and message aloud automatically.">
              <button
                type="button"
                onClick={toggle("tts_enabled")}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  formData.tts_enabled ? "bg-orange-500" : "bg-white/10"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    formData.tts_enabled ? "translate-x-7" : ""
                  }`}
                />
              </button>
            </Field>

            <Field label="Speech Speed" hint={`Voice pace: ${formData.tts_rate}x`}>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                className="w-full accent-orange-500 cursor-pointer"
                value={formData.tts_rate}
                onChange={set("tts_rate")}
              />
            </Field>
          </div>
        </Section>

        {/* 3. Color Scheme */}
        <Section title="Color Styling" icon="🎨">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Field label="Donor Name Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border-0 p-0"
                  value={formData.alert_text_color}
                  onChange={set("alert_text_color")}
                />
                <input
                  type="text"
                  className={`${inputCls} font-mono text-xs`}
                  value={formData.alert_text_color}
                  onChange={set("alert_text_color")}
                />
              </div>
            </Field>

            <Field label="Amount Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border-0 p-0"
                  value={formData.alert_amount_color}
                  onChange={set("alert_amount_color")}
                />
                <input
                  type="text"
                  className={`${inputCls} font-mono text-xs`}
                  value={formData.alert_amount_color}
                  onChange={set("alert_amount_color")}
                />
              </div>
            </Field>

            <Field label="Message Text Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border-0 p-0"
                  value={formData.alert_message_color}
                  onChange={set("alert_message_color")}
                />
                <input
                  type="text"
                  className={`${inputCls} font-mono text-xs`}
                  value={formData.alert_message_color}
                  onChange={set("alert_message_color")}
                />
              </div>
            </Field>

            <Field label="Theme / Accent Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border-0 p-0"
                  value={formData.theme_color}
                  onChange={set("theme_color")}
                />
                <input
                  type="text"
                  className={`${inputCls} font-mono text-xs`}
                  value={formData.theme_color}
                  onChange={set("theme_color")}
                />
              </div>
            </Field>

            <Field label="Card Border Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border-0 p-0"
                  value={formData.alert_border_color || formData.theme_color}
                  onChange={set("alert_border_color")}
                />
                <input
                  type="text"
                  className={`${inputCls} font-mono text-xs`}
                  value={formData.alert_border_color}
                  placeholder={formData.theme_color}
                  onChange={set("alert_border_color")}
                />
              </div>
            </Field>

            <Field label="Card Background" hint="Any CSS color, including rgba() for transparency.">
              <input
                type="text"
                className={`${inputCls} font-mono text-xs`}
                value={formData.alert_bg_color}
                onChange={set("alert_bg_color")}
              />
            </Field>

            <Field label="Alert Font Family" hint="Any CSS font stack, e.g. Poppins, sans-serif.">
              <input
                type="text"
                className={inputCls}
                value={formData.alert_font_family}
                onChange={set("alert_font_family")}
              />
            </Field>
          </div>
        </Section>

        {/* 4. Recent Donations Feed */}
        <Section title="Recent Donations Feed" icon="📜">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Feed Position" hint="Where the recent supporters list appears on stream.">
              <select
                className={inputCls}
                value={formData.recent_donations_position}
                onChange={set("recent_donations_position")}
              >
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
              </select>
            </Field>

            <Field label="Feed Item Count" hint="Set to 0 to hide the feed completely.">
              <input
                type="number"
                className={inputCls}
                min="0"
                max="10"
                value={formData.recent_donations_count}
                onChange={set("recent_donations_count")}
              />
            </Field>
          </div>
        </Section>

        <button
          type="submit"
          disabled={saveStatus === "saving"}
          className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 hover:from-orange-400 hover:to-amber-400 text-black font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-xl shadow-orange-500/25 disabled:opacity-50"
        >
          {saveStatus === "saving" ? "Saving Changes..." : "Save All Stream Settings"}
        </button>
      </form>
    </div>
  );
}
