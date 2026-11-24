"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useToast } from "@/hooks/useToast";
import { useAutoSave } from "@/hooks/useAutoSave";
import Icon from "@/components/common/Icon";
import {
  Notification01Icon,
  Mic01Icon,
  PaintBoardIcon,
  Invoice01Icon,
  CheckmarkCircle01Icon,
  Tv01Icon,
  PlayIcon,
  VolumeHighIcon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";

const Section = ({ title, icon, children }) => (
  <section className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-5">
    <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-800">
      <Icon icon={icon} size={18} className="text-violet-400" />
      <h2 className="text-xs font-black text-zinc-300 uppercase tracking-wider">
        {title}
      </h2>
    </div>
    {children}
  </section>
);

const Field = ({ label, hint, children }) => (
  <div>
    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    {children}
    {hint && <p className="text-[11px] text-zinc-500 mt-1">{hint}</p>}
  </div>
);

const inputCls =
  "w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 p-3 rounded-xl text-sm font-medium outline-none transition-colors text-white placeholder-zinc-600";

function playChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.55);
    });
  } catch (err) {
    console.warn("Chime preview error:", err);
  }
}

function speakPreview(text, rate) {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate || 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

export default function SettingsForm({ initialProfile }) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    display_name: initialProfile?.display_name || "",
    bio: initialProfile?.bio || "",
    theme_color: initialProfile?.theme_color || "#7c3aed",
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
    alert_bg_color: initialProfile?.alert_bg_color || "rgba(11, 15, 25, 0.95)",
    alert_border_color: initialProfile?.alert_border_color || "",
    alert_position: initialProfile?.alert_position || "top",
    alert_animation: initialProfile?.alert_animation || "slide",
    tts_enabled: initialProfile?.tts_enabled !== false,
    tts_rate: initialProfile?.tts_rate || 0.9,
    recent_donations_position: initialProfile?.recent_donations_position || "bottom-left",
    recent_donations_count: initialProfile?.recent_donations_count ?? 5,
  });

  const [saveStatus, setSaveStatus] = useState("saved");
  const [previewKey, setPreviewKey] = useState(0);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

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
      addToast("Settings saved successfully!", "success");
    } catch (err) {
      console.error("Save failed:", err);
      setSaveStatus("error");
      addToast("Failed to save settings", "error");
    }
  }, [addToast]);

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

  const triggerPreview = () => {
    setPreviewKey((k) => k + 1);
    setIsPlayingPreview(true);
    playChime();
    if (formData.tts_enabled) {
      speakPreview("Rohan Sharma sent 1000 rupees. Bro clutch was insane!", formData.tts_rate);
    }
    setTimeout(() => {
      setIsPlayingPreview(false);
    }, (formData.alert_duration || 5) * 1000);
  };

  // Entrance animation variants for the preview
  const getAnimationVariants = () => {
    switch (formData.alert_animation) {
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
      case "zoom":
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8 },
        };
      case "bounce":
        return {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -30 },
        };
      case "slide":
      default:
        return {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
        };
    }
  };

  const positionClass =
    formData.alert_position === "bottom"
      ? "justify-end pb-4"
      : formData.alert_position === "center"
      ? "justify-center"
      : "justify-start pt-4";

  return (
    <div className="space-y-6">
      {/* Top Header & Save Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-violet-400 uppercase tracking-widest font-black mb-1">
            Dashboard / OBS Studio
          </p>
          <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-white">
            Alert &amp; Stream Settings
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider">
            {saveStatus === "saving" && <span className="text-violet-400">Saving...</span>}
            {saveStatus === "saved" && (
              <span className="text-emerald-400 flex items-center gap-1">
                <Icon icon={CheckmarkCircle01Icon} size={14} /> Saved
              </span>
            )}
            {saveStatus === "error" && <span className="text-red-400">Save failed</span>}
            {saveStatus === "changed" && <span className="text-indigo-400">● Unsaved changes</span>}
          </span>
          <button
            type="button"
            onClick={() => saveProfile(formData)}
            className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors"
          >
            Save Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Settings Configuration Form */}
        <div className="lg:col-span-7 space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveProfile(formData);
            }}
            className="space-y-6"
          >
            {/* 1. OBS Popup Alert Settings */}
            <Section title="OBS Popup Alert Box" icon={Notification01Icon}>
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="Minimum Alert Amount (NPR)"
                  hint="Donations below this won't trigger an on-screen popup."
                >
                  <input
                    type="number"
                    className={inputCls}
                    placeholder="0"
                    value={formData.alert_min_amount}
                    onChange={set("alert_min_amount")}
                  />
                </Field>

                <Field
                  label="Alert Duration (Seconds)"
                  hint="How many seconds the popup stays visible on stream."
                >
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
                <Field
                  label="Custom Alert GIF / Animation"
                  hint="Upload a .gif or image, or leave blank to use the built-in celebration animation."
                >
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
                      className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-300 transition-colors"
                    >
                      {uploading.gif
                        ? "Loading..."
                        : formData.alert_gif_url
                        ? "Change GIF"
                        : "Upload Custom GIF"}
                    </button>
                    {formData.alert_gif_url && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, alert_gif_url: "" });
                          setSaveStatus("changed");
                        }}
                        className="text-xs text-red-400 hover:text-red-300 font-bold px-2 py-1"
                      >
                        Remove Custom GIF
                      </button>
                    )}
                  </div>
                </Field>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <Field
                  label="On-Screen Position"
                  hint="Where the alert appears in your OBS browser source."
                >
                  <select
                    className={inputCls}
                    value={formData.alert_position}
                    onChange={set("alert_position")}
                  >
                    <option value="top">Top</option>
                    <option value="center">Center</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </Field>

                <Field
                  label="Entrance Animation"
                  hint="Motion effect when superchat arrives."
                >
                  <select
                    className={inputCls}
                    value={formData.alert_animation}
                    onChange={set("alert_animation")}
                  >
                    <option value="slide">Smooth Slide</option>
                    <option value="bounce">Bouncy Pop</option>
                    <option value="fade">Gentle Fade</option>
                    <option value="zoom">Zoom Impact</option>
                  </select>
                </Field>
              </div>
            </Section>

            {/* 2. Text-to-Speech (TTS) Settings */}
            <Section title="Automated Text-to-Speech (TTS)" icon={Mic01Icon}>
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <Field
                  label="Enable Voice Reader"
                  hint="Reads donor name and message aloud automatically."
                >
                  <button
                    type="button"
                    onClick={toggle("tts_enabled")}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      formData.tts_enabled ? "bg-violet-600" : "bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        formData.tts_enabled ? "translate-x-7" : ""
                      }`}
                    />
                  </button>
                </Field>

                <Field
                  label="Speech Speed"
                  hint={`Voice pace: ${formData.tts_rate}x`}
                >
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    className="w-full accent-violet-500 cursor-pointer"
                    value={formData.tts_rate}
                    onChange={set("tts_rate")}
                  />
                </Field>
              </div>
            </Section>

            {/* 3. Color Scheme */}
            <Section title="Color Styling" icon={PaintBoardIcon}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Field label="Donor Name Color">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0 p-0"
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
                      className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0 p-0"
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
                      className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0 p-0"
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
                      className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0 p-0"
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
                      className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0 p-0"
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

                <Field
                  label="Card Background"
                  hint="Any CSS color, including rgba() for transparency."
                >
                  <input
                    type="text"
                    className={`${inputCls} font-mono text-xs`}
                    value={formData.alert_bg_color}
                    onChange={set("alert_bg_color")}
                  />
                </Field>

                <Field
                  label="Alert Font Family"
                  hint="Any CSS font stack, e.g. Poppins, sans-serif."
                >
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
            <Section title="Recent Donations Feed" icon={Invoice01Icon}>
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="Feed Position"
                  hint="Where the recent supporters list appears on stream."
                >
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

                <Field
                  label="Feed Item Count"
                  hint="Set to 0 to hide the feed completely."
                >
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
          </form>
        </div>

        {/* Right Column: Live OBS Alert Preview Section Before Saving */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon icon={Tv01Icon} size={16} className="text-violet-400" />
              <p className="text-xs font-black uppercase tracking-wider text-white">
                Live Alert Preview
              </p>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
              OBS 800 × 600
            </span>
          </div>

          {/* Interactive Simulation Frame */}
          <div className="bg-black border border-zinc-800 rounded-2xl p-4 sm:p-6 min-h-[360px] flex flex-col relative overflow-hidden">
            {/* Position indicator & Header bar */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-zinc-800/80 text-[10px] text-zinc-500 font-mono">
              <span>Position: {formData.alert_position}</span>
              <span>Animation: {formData.alert_animation}</span>
            </div>

            {/* Simulated OBS Browser Stage */}
            <div className={`flex-1 flex flex-col items-center ${positionClass}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  {...getAnimationVariants()}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="w-full max-w-sm rounded-xl p-5 text-center border"
                  style={{
                    backgroundColor: formData.alert_bg_color || "rgba(11, 15, 25, 0.95)",
                    borderColor: formData.alert_border_color || formData.theme_color || "#3f3f46",
                    fontFamily: formData.alert_font_family || "Inter, sans-serif",
                  }}
                >
                  {/* Visual Gift/Image or Default Badge */}
                  {formData.alert_gif_url ? (
                    <div className="mb-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.alert_gif_url}
                        alt="Alert preview gif"
                        className="w-20 h-20 mx-auto object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-violet-400">
                      <Icon icon={Tv01Icon} size={20} />
                    </div>
                  )}

                  {/* Header Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 border border-zinc-800 bg-zinc-900 text-zinc-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/logo.png"
                      alt="Logo"
                      className="w-3.5 h-3.5 rounded-sm object-contain"
                    />
                    SuperChat Nepal
                  </div>

                  {/* Donor Name */}
                  <h3
                    className="text-xl font-black uppercase tracking-tight truncate mb-1"
                    style={{ color: formData.alert_text_color || "#ffffff" }}
                  >
                    Rohan Sharma
                  </h3>

                  {/* Amount Badge */}
                  <div className="flex justify-center mb-2.5">
                    <div
                      className="px-4 py-1 rounded-lg font-black text-xl border border-zinc-800 bg-zinc-900 flex items-center gap-1"
                      style={{ color: formData.alert_amount_color || "#34d399" }}
                    >
                      <span>रू</span>
                      <span>1,000</span>
                    </div>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className="px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-medium italic leading-relaxed"
                    style={{ color: formData.alert_message_color || "#f1f5f9" }}
                  >
                    &ldquo;Bro clutch was insane! Keep the streams coming.&rdquo;
                  </div>

                  {/* Features Footer info */}
                  <div className="flex items-center justify-center gap-2 text-[9px] text-zinc-400 font-mono mt-3 pt-2 border-t border-zinc-800">
                    <span className="flex items-center gap-1">
                      <Icon icon={VolumeHighIcon} size={10} />
                      Audio Chime
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Icon icon={Mic01Icon} size={10} />
                      TTS ({formData.tts_rate}x)
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Preview Trigger and Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={triggerPreview}
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Icon icon={isPlayingPreview ? RefreshIcon : PlayIcon} size={15} className="text-violet-400" />
              <span>{isPlayingPreview ? "Replaying Alert..." : "Test Alert Animation & Sound"}</span>
            </button>

            <button
              type="button"
              onClick={() => saveProfile(formData)}
              disabled={saveStatus === "saving"}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {saveStatus === "saving" ? "Saving..." : "Save All Stream Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
