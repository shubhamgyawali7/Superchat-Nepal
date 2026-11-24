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
  Upload01Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons";

const Section = ({ title, icon, children }) => (
  <section className="bg-white dark:bg-[#131620] border border-[#E5EAF1] dark:border-[#222736] p-5 sm:p-6 rounded-2xl space-y-4 shadow-xs">
    <div className="flex items-center gap-2 pb-3 border-b border-[#E5EAF1] dark:border-[#222736]">
      <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-[#FF4D0A] flex items-center justify-center">
        <Icon icon={icon} size={15} />
      </div>
      <h2 className="text-xs font-bold text-[#1D1D20] dark:text-[#F4F5F8] uppercase tracking-wider">
        {title}
      </h2>
    </div>
    {children}
  </section>
);

const Field = ({ label, hint, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold text-[#1D1D20] dark:text-[#F4F5F8] uppercase tracking-wider">
      {label}
    </label>
    {children}
    {hint && <p className="text-xs text-[#777B87] dark:text-[#949AA8]">{hint}</p>}
  </div>
);

const inputCls =
  "w-full bg-slate-50 dark:bg-[#181C28] border border-[#E5EAF1] dark:border-[#222736] focus:border-[#FF4D0A] dark:focus:border-[#FF4D0A] px-3.5 py-2.5 rounded-xl text-xs text-[#1D1D20] dark:text-[#F4F5F8] placeholder-[#777B87] dark:placeholder-[#949AA8] outline-none transition-colors shadow-2xs";

function colorForPicker(color) {
  if (typeof color !== "string") return "#320064";
  if (/^#[\da-f]{6}$/i.test(color)) return color;
  const rgb = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!rgb) return "#320064";
  return `#${rgb.slice(1, 4).map((value) => Number(value).toString(16).padStart(2, "0")).join("")}`;
}

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
    theme_color: initialProfile?.theme_color || "#FF4D0A",
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

  useAutoSave(formData, saveProfile, 4000);

  const updateField = (key, value) => {
    setFormData((current) => ({ ...current, [key]: value }));
    setSaveStatus("changed");
  };

  const set = (key) => (e) => {
    updateField(key, e.target.value);
  };

  const toggle = (key) => () => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }));
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1550px] mx-auto text-[#1D1D20] dark:text-[#F4F5F8]">
      {/* Top Header & Save Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5EAF1] dark:border-[#222736]">
        <div>
          <p className="text-xs text-[#FF4D0A] uppercase tracking-wider font-bold mb-1">
            Dashboard / OBS Studio
          </p>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-[#1D1D20] dark:text-[#F4F5F8]">
            Alert &amp; Stream Settings
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className="text-xs font-semibold">
            {saveStatus === "saving" && (
              <span className="text-[#FF4D0A] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D0A] animate-ping" />
                Saving changes...
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Icon icon={CheckmarkCircle01Icon} size={15} /> All changes saved
              </span>
            )}
            {saveStatus === "error" && (
              <span className="text-rose-500 font-semibold">Save failed</span>
            )}
            {saveStatus === "changed" && (
              <span className="text-amber-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Unsaved changes
              </span>
            )}
          </div>

          {/* Unified Save Button */}
          <button
            type="button"
            onClick={() => saveProfile(formData)}
            disabled={saveStatus === "saving"}
            className="bg-[#FF4D0A] hover:bg-[#E04307] active:scale-98 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs disabled:opacity-50"
          >
            {saveStatus === "saving" ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Configuration */}
        <div className="lg:col-span-7 space-y-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveProfile(formData);
            }}
            className="space-y-5"
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

              <div className="pt-1">
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
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => gifInputRef.current?.click()}
                      disabled={uploading.gif}
                      className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-[#181C28] hover:bg-slate-200 dark:hover:bg-[#1E2333] border border-[#E5EAF1] dark:border-[#222736] px-4 py-2 rounded-xl text-xs font-semibold text-[#1D1D20] dark:text-[#F4F5F8] transition-colors"
                    >
                      <Icon icon={Upload01Icon} size={14} />
                      <span>
                        {uploading.gif
                          ? "Loading..."
                          : formData.alert_gif_url
                          ? "Change GIF"
                          : "Upload Custom GIF"}
                      </span>
                    </button>
                    {formData.alert_gif_url && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, alert_gif_url: "" }));
                          setSaveStatus("changed");
                        }}
                        className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-semibold px-2 py-1"
                      >
                        <Icon icon={Delete01Icon} size={13} />
                        <span>Remove Custom GIF</span>
                      </button>
                    )}
                  </div>
                </Field>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-1">
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
              <div className="grid md:grid-cols-2 gap-5 items-center">
                <Field
                  label="Enable Voice Reader"
                  hint="Reads donor name and message aloud automatically."
                >
                  <button
                    type="button"
                    onClick={toggle("tts_enabled")}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      formData.tts_enabled ? "bg-[#FF4D0A]" : "bg-slate-300 dark:bg-zinc-700"
                    }`}
                    aria-label="Toggle text to speech"
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-xs ${
                        formData.tts_enabled ? "translate-x-6" : ""
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
                    className="w-full accent-[#FF4D0A] cursor-pointer"
                    value={formData.tts_rate}
                    onChange={set("tts_rate")}
                  />
                </Field>
              </div>
            </Section>

            {/* 3. Color Styling */}
            <Section title="Color Styling" icon={PaintBoardIcon}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                <Field label="Donor Name Color">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                      value={formData.alert_text_color}
                      onChange={set("alert_text_color")}
                    />
                    <input
                      type="text"
                      className={`${inputCls} font-mono`}
                      value={formData.alert_text_color}
                      onChange={set("alert_text_color")}
                    />
                  </div>
                </Field>

                <Field label="Amount Color">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                      value={formData.alert_amount_color}
                      onChange={set("alert_amount_color")}
                    />
                    <input
                      type="text"
                      className={`${inputCls} font-mono`}
                      value={formData.alert_amount_color}
                      onChange={set("alert_amount_color")}
                    />
                  </div>
                </Field>

                <Field label="Message Text Color">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                      value={formData.alert_message_color}
                      onChange={set("alert_message_color")}
                    />
                    <input
                      type="text"
                      className={`${inputCls} font-mono`}
                      value={formData.alert_message_color}
                      onChange={set("alert_message_color")}
                    />
                  </div>
                </Field>

                <Field label="Theme / Accent Color">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                      value={formData.theme_color}
                      onChange={set("theme_color")}
                    />
                    <input
                      type="text"
                      className={`${inputCls} font-mono`}
                      value={formData.theme_color}
                      onChange={set("theme_color")}
                    />
                  </div>
                </Field>

                <Field label="Card Border Color">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                      value={formData.alert_border_color || formData.theme_color}
                      onChange={set("alert_border_color")}
                    />
                    <input
                      type="text"
                      className={`${inputCls} font-mono`}
                      value={formData.alert_border_color}
                      placeholder={formData.theme_color}
                      onChange={set("alert_border_color")}
                    />
                  </div>
                </Field>

                <Field
                  label="Card Background"
                  hint="Color or transparent"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        aria-label="Choose card background color"
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0 disabled:opacity-50"
                        value={colorForPicker(formData.alert_bg_color)}
                        disabled={formData.alert_bg_color === "transparent"}
                        onChange={(e) => updateField("alert_bg_color", e.target.value)}
                      />
                      <input
                        type="text"
                        aria-label="Card background CSS color"
                        className={`${inputCls} font-mono`}
                        value={formData.alert_bg_color}
                        onChange={set("alert_bg_color")}
                      />
                    </div>
                    <label className="inline-flex items-center gap-1.5 text-xs text-[#777B87] dark:text-[#949AA8] cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 accent-[#FF4D0A]"
                        checked={formData.alert_bg_color === "transparent"}
                        onChange={(e) =>
                          updateField(
                            "alert_bg_color",
                            e.target.checked ? "transparent" : "#131620"
                          )
                        }
                      />
                      <span>Make transparent</span>
                    </label>
                  </div>
                </Field>

                <div className="col-span-2 sm:col-span-3">
                  <Field
                    label="Alert Font Family"
                    hint="Any CSS font stack, e.g. Inter, sans-serif or Poppins."
                  >
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.alert_font_family}
                      onChange={set("alert_font_family")}
                    />
                  </Field>
                </div>
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

        {/* Right Column: Live OBS Alert Preview Section */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon icon={Tv01Icon} size={16} className="text-[#FF4D0A]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#1D1D20] dark:text-[#F4F5F8]">
                Live Alert Preview
              </h2>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#777B87] dark:text-[#949AA8] bg-slate-100 dark:bg-[#181C28] border border-[#E5EAF1] dark:border-[#222736] px-2 py-0.5 rounded-md">
              OBS 800 × 600
            </span>
          </div>

          {/* Interactive Simulation Frame */}
          <div className="bg-[#090A0F] border border-zinc-800 rounded-2xl p-4 sm:p-5 min-h-[380px] flex flex-col relative overflow-hidden shadow-md">
            {/* Position indicator */}
            <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-zinc-800 text-[10px] text-zinc-500 font-mono">
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
                  className="w-full max-w-xs sm:max-w-sm rounded-xl p-4 text-center border"
                  style={{
                    backgroundColor: formData.alert_bg_color || "rgba(11, 15, 25, 0.95)",
                    borderColor: formData.alert_border_color || formData.theme_color || "#3f3f46",
                    fontFamily: formData.alert_font_family || "Inter, sans-serif",
                  }}
                >
                  {/* GIF / Icon */}
                  {formData.alert_gif_url ? (
                    <div className="mb-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.alert_gif_url}
                        alt="Alert preview"
                        className="w-16 h-16 mx-auto object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-9 h-9 mx-auto mb-2 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#FF4D0A]">
                      <Icon icon={Tv01Icon} size={18} />
                    </div>
                  )}

                  {/* Header Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 border border-zinc-800 bg-zinc-900 text-zinc-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/logo.png"
                      alt="Logo"
                      className="w-3.5 h-3.5 object-contain"
                    />
                    <span>Superchat Nepal</span>
                  </div>

                  {/* Donor Name */}
                  <h3
                    className="text-lg font-heading font-extrabold uppercase tracking-tight truncate mb-1"
                    style={{ color: formData.alert_text_color || "#ffffff" }}
                  >
                    Rohan Sharma
                  </h3>

                  {/* Amount Badge */}
                  <div className="flex justify-center mb-2">
                    <div
                      className="px-3 py-0.5 rounded-lg font-heading font-extrabold text-lg border border-zinc-800 bg-zinc-900/90 flex items-center gap-1"
                      style={{ color: formData.alert_amount_color || "#34d399" }}
                    >
                      <span>रू</span>
                      <span>1,000</span>
                    </div>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 text-xs font-medium italic leading-relaxed"
                    style={{ color: formData.alert_message_color || "#f1f5f9" }}
                  >
                    &ldquo;Bro clutch was insane! Keep the streams coming.&rdquo;
                  </div>

                  {/* Features Footer info */}
                  <div className="flex items-center justify-center gap-2 text-[9px] text-zinc-400 font-mono mt-2.5 pt-2 border-t border-zinc-800/80">
                    <span className="flex items-center gap-1">
                      <Icon icon={VolumeHighIcon} size={10} />
                      Chime
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

          {/* Test Button */}
          <button
            type="button"
            onClick={triggerPreview}
            className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-[#181C28] hover:bg-slate-200 dark:hover:bg-[#1E2333] border border-[#E5EAF1] dark:border-[#222736] text-[#1D1D20] dark:text-[#F4F5F8] py-2.5 rounded-xl text-xs font-semibold transition-colors shadow-2xs"
          >
            <Icon
              icon={isPlayingPreview ? RefreshIcon : PlayIcon}
              size={14}
              className="text-[#FF4D0A]"
            />
            <span>{isPlayingPreview ? "Replaying Alert..." : "Test Alert Animation & Sound"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
