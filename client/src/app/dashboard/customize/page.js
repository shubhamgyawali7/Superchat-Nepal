"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import Icon from "@/components/common/Icon";
import {
  CheckmarkCircle01Icon,
  PaintBoardIcon,
  FileEditIcon,
  Share01Icon,
  Globe02Icon,
  Wallet01Icon,
  ExternalLinkIcon,
} from "@hugeicons/core-free-icons";

const PRESET_COLORS = [
  { name: "Superchat Orange", hex: "#FF4D0A" },
  { name: "Neon Violet", hex: "#8B5CF6" },
  { name: "Emerald Green", hex: "#10B981" },
  { name: "Sky Blue", hex: "#0EA5E9" },
  { name: "Rose Pink", hex: "#F43F5E" },
  { name: "Amber Gold", hex: "#F59E0B" },
];

export default function CustomizePage() {
  const { profile, updateProfile, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [pageData, setPageData] = useState(null);
  const [saveStatus, setSaveStatus] = useState("saved");

  const effectiveData = pageData || {
    display_name: profile?.display_name || "",
    bio: profile?.bio || "",
    theme_color: profile?.theme_color || "#FF4D0A",
    welcome_title: profile?.welcome_title || "Support My Stream",
    welcome_sub: profile?.welcome_sub || "Your support helps me keep creating content!",
    youtube_url: profile?.youtube_url || "",
    facebook_url: profile?.facebook_url || "",
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const result = await updateProfile(effectiveData);
      if (result.success) {
        setSaveStatus("saved");
        addToast("Streamer profile saved successfully!", "success");
      } else {
        setSaveStatus("error");
        addToast(result.error || "Failed to save design", "error");
      }
    } catch {
      setSaveStatus("error");
      addToast("Failed to save design", "error");
    }
  };

  const handleChange = (key) => (e) => {
    setPageData((prev) => ({ ...effectiveData, [key]: e.target.value }));
    setSaveStatus("changed");
  };

  const selectColor = (hex) => {
    setPageData((prev) => ({ ...effectiveData, theme_color: hex }));
    setSaveStatus("changed");
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#E5EAF1] border-t-[#FF4D0A]" />
      </div>
    );
  }

  const username = profile?.username || "streamer";
  const brandColor = effectiveData.theme_color || "#FF4D0A";

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1550px] mx-auto text-[#1D1D20] dark:text-[#F4F5F8]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5EAF1] dark:border-[#222736]">
        <div>
          <p className="text-xs text-[#FF4D0A] uppercase tracking-wider font-bold mb-1">
            Dashboard / Customization
          </p>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-[#1D1D20] dark:text-[#F4F5F8]">
            Page &amp; Brand Editor
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className="text-xs font-semibold">
            {saveStatus === "saving" && (
              <span className="text-[#FF4D0A] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D0A] animate-ping" />
                Saving...
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Icon icon={CheckmarkCircle01Icon} size={15} /> Saved
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

          <button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="bg-[#FF4D0A] hover:bg-[#E04307] active:scale-98 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs disabled:opacity-50"
          >
            {saveStatus === "saving" ? "Saving..." : "Save Page"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Editor */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Theme Color */}
          <div className="bg-white dark:bg-[#131620] border border-[#E5EAF1] dark:border-[#222736] p-5 sm:p-6 rounded-2xl space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E5EAF1] dark:border-[#222736]">
              <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-[#FF4D0A] flex items-center justify-center">
                <Icon icon={PaintBoardIcon} size={15} />
              </div>
              <h2 className="text-xs font-bold text-[#1D1D20] dark:text-[#F4F5F8] uppercase tracking-wider">
                Streamer Color Theme
              </h2>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#1D1D20] dark:text-[#F4F5F8] uppercase tracking-wider">
                Primary Brand Color
              </label>

              <div className="flex flex-wrap items-center gap-2">
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => selectColor(preset.hex)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      effectiveData.theme_color.toLowerCase() === preset.hex.toLowerCase()
                        ? "border-[#1D1D20] dark:border-white shadow-xs font-bold"
                        : "border-[#E5EAF1] dark:border-[#222736] hover:bg-slate-50 dark:hover:bg-[#181C28]"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: preset.hex }}
                    />
                    <span className="text-[#1D1D20] dark:text-[#F4F5F8]">{preset.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <input
                  type="color"
                  value={effectiveData.theme_color}
                  onChange={handleChange("theme_color")}
                  className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border-0 p-0 shrink-0"
                  aria-label="Pick custom theme color"
                />
                <input
                  type="text"
                  value={effectiveData.theme_color}
                  onChange={handleChange("theme_color")}
                  className="bg-slate-50 dark:bg-[#181C28] border border-[#E5EAF1] dark:border-[#222736] focus:border-[#FF4D0A] rounded-xl px-3.5 py-2 text-xs font-mono text-[#1D1D20] dark:text-[#F4F5F8] outline-none max-w-xs"
                />
              </div>
            </div>
          </div>

          {/* 2. Page Content */}
          <div className="bg-white dark:bg-[#131620] border border-[#E5EAF1] dark:border-[#222736] p-5 sm:p-6 rounded-2xl space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E5EAF1] dark:border-[#222736]">
              <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-[#FF4D0A] flex items-center justify-center">
                <Icon icon={FileEditIcon} size={15} />
              </div>
              <h2 className="text-xs font-bold text-[#1D1D20] dark:text-[#F4F5F8] uppercase tracking-wider">
                Donation Page Content
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1D1D20] dark:text-[#F4F5F8] uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-50 dark:bg-[#181C28] border border-[#E5EAF1] dark:border-[#222736] focus:border-[#FF4D0A] rounded-xl px-3.5 py-2.5 text-xs text-[#1D1D20] dark:text-[#F4F5F8] placeholder-[#777B87] outline-none"
                  value={effectiveData.display_name}
                  onChange={handleChange("display_name")}
                  placeholder="Your stream name or gaming handle"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1D1D20] dark:text-[#F4F5F8] uppercase tracking-wider mb-1.5">
                  Bio / Stream Description
                </label>
                <textarea
                  rows={2}
                  className="w-full bg-slate-50 dark:bg-[#181C28] border border-[#E5EAF1] dark:border-[#222736] focus:border-[#FF4D0A] rounded-xl px-3.5 py-2.5 text-xs text-[#1D1D20] dark:text-[#F4F5F8] placeholder-[#777B87] outline-none resize-none leading-relaxed"
                  value={effectiveData.bio}
                  onChange={handleChange("bio")}
                  placeholder="Streaming gaming content & esports every weekend!"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1D1D20] dark:text-[#F4F5F8] uppercase tracking-wider mb-1.5">
                    Headline
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 dark:bg-[#181C28] border border-[#E5EAF1] dark:border-[#222736] focus:border-[#FF4D0A] rounded-xl px-3.5 py-2.5 text-xs text-[#1D1D20] dark:text-[#F4F5F8] placeholder-[#777B87] outline-none"
                    value={effectiveData.welcome_title}
                    onChange={handleChange("welcome_title")}
                    placeholder="Support My Stream"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1D1D20] dark:text-[#F4F5F8] uppercase tracking-wider mb-1.5">
                    Support Message
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 dark:bg-[#181C28] border border-[#E5EAF1] dark:border-[#222736] focus:border-[#FF4D0A] rounded-xl px-3.5 py-2.5 text-xs text-[#1D1D20] dark:text-[#F4F5F8] placeholder-[#777B87] outline-none"
                    value={effectiveData.welcome_sub}
                    onChange={handleChange("welcome_sub")}
                    placeholder="Your support helps me keep creating content!"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Social Profiles */}
          <div className="bg-white dark:bg-[#131620] border border-[#E5EAF1] dark:border-[#222736] p-5 sm:p-6 rounded-2xl space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E5EAF1] dark:border-[#222736]">
              <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-[#FF4D0A] flex items-center justify-center">
                <Icon icon={Share01Icon} size={15} />
              </div>
              <h2 className="text-xs font-bold text-[#1D1D20] dark:text-[#F4F5F8] uppercase tracking-wider">
                Social Profiles
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1D1D20] dark:text-[#F4F5F8] uppercase tracking-wider mb-1.5">
                  YouTube Channel URL
                </label>
                <input
                  type="url"
                  placeholder="https://youtube.com/@yourchannel"
                  className="w-full bg-slate-50 dark:bg-[#181C28] border border-[#E5EAF1] dark:border-[#222736] focus:border-[#FF4D0A] rounded-xl px-3.5 py-2.5 text-xs text-[#1D1D20] dark:text-[#F4F5F8] placeholder-[#777B87] outline-none"
                  value={effectiveData.youtube_url}
                  onChange={handleChange("youtube_url")}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1D1D20] dark:text-[#F4F5F8] uppercase tracking-wider mb-1.5">
                  Facebook Gaming / Profile URL
                </label>
                <input
                  type="url"
                  placeholder="https://facebook.com/yourstream"
                  className="w-full bg-slate-50 dark:bg-[#181C28] border border-[#E5EAF1] dark:border-[#222736] focus:border-[#FF4D0A] rounded-xl px-3.5 py-2.5 text-xs text-[#1D1D20] dark:text-[#F4F5F8] placeholder-[#777B87] outline-none"
                  value={effectiveData.facebook_url}
                  onChange={handleChange("facebook_url")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Donation Page Preview */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon icon={Globe02Icon} size={16} className="text-[#FF4D0A]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#1D1D20] dark:text-[#F4F5F8]">
                Live Donation Page Preview
              </h2>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#777B87] dark:text-[#949AA8] bg-slate-100 dark:bg-[#181C28] border border-[#E5EAF1] dark:border-[#222736] px-2 py-0.5 rounded-md">
              Public View
            </span>
          </div>

          {/* Realistic Streamer Donation Card Preview Frame */}
          <div className="bg-white dark:bg-[#131620] border border-[#E5EAF1] dark:border-[#222736] rounded-2xl overflow-hidden shadow-sm">
            {/* Top Brand Banner Strip */}
            <div
              className="h-20 w-full transition-colors relative"
              style={{ backgroundColor: brandColor }}
            >
              <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Profile Info Overlay */}
            <div className="px-5 pb-5 -mt-8 relative space-y-4">
              <div className="flex items-end justify-between">
                <div
                  className="w-16 h-16 rounded-2xl border-4 border-white dark:border-[#131620] flex items-center justify-center font-heading font-black text-white text-xl shadow-md transition-colors"
                  style={{ backgroundColor: brandColor }}
                >
                  {(effectiveData.display_name || username)[0]?.toUpperCase()}
                </div>

                <div className="flex items-center gap-1.5 pb-1">
                  {effectiveData.youtube_url && (
                    <span className="w-6 h-6 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 flex items-center justify-center text-xs font-bold" title="YouTube">
                      YT
                    </span>
                  )}
                  {effectiveData.facebook_url && (
                    <span className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center text-xs font-bold" title="Facebook">
                      FB
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-heading font-bold text-base text-[#1D1D20] dark:text-[#F4F5F8]">
                  {effectiveData.display_name || username}
                </h3>
                <p className="text-xs text-[#777B87] dark:text-[#949AA8] font-mono">@{username}</p>
                <p className="text-xs text-[#1D1D20] dark:text-[#F4F5F8] mt-2 leading-relaxed">
                  {effectiveData.bio || "Streaming live gaming moments & esports."}
                </p>
              </div>

              {/* Donation Support Box Preview */}
              <div className="bg-slate-50 dark:bg-[#181C28] border border-[#E5EAF1] dark:border-[#222736] p-4 rounded-xl space-y-3">
                <div>
                  <p className="text-xs font-bold text-[#1D1D20] dark:text-[#F4F5F8]">
                    {effectiveData.welcome_title}
                  </p>
                  <p className="text-xs text-[#777B87] dark:text-[#949AA8] mt-0.5">
                    {effectiveData.welcome_sub}
                  </p>
                </div>

                {/* Amount Chips Mock */}
                <div className="grid grid-cols-4 gap-1.5 text-xs font-mono font-semibold">
                  {["रू 50", "रू 100", "रू 250", "रू 500"].map((amt, idx) => (
                    <div
                      key={amt}
                      className={`text-center py-1.5 rounded-lg border text-xs ${
                        idx === 1
                          ? "bg-white dark:bg-[#131620] border-[#FF4D0A] text-[#FF4D0A] font-bold"
                          : "bg-white/60 dark:bg-[#131620]/60 border-[#E5EAF1] dark:border-[#222736] text-[#777B87] dark:text-[#949AA8]"
                      }`}
                    >
                      {amt}
                    </div>
                  ))}
                </div>

                {/* Gateways Supported */}
                <div className="flex items-center justify-between text-[11px] text-[#777B87] dark:text-[#949AA8] pt-1 border-t border-[#E5EAF1] dark:border-[#222736]">
                  <span className="flex items-center gap-1">
                    <Icon icon={Wallet01Icon} size={12} className="text-emerald-500" />
                    eSewa &amp; Khalti
                  </span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    Instant Verified
                  </span>
                </div>
              </div>

              {/* View Public Page Action */}
              <a
                href={`/donate/${username}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-[#181C28] hover:bg-slate-200 dark:hover:bg-[#1E2333] border border-[#E5EAF1] dark:border-[#222736] text-[#1D1D20] dark:text-[#F4F5F8] text-xs font-semibold py-2.5 rounded-xl transition-colors"
              >
                <span>View Public Donation Page</span>
                <Icon icon={ExternalLinkIcon} size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
