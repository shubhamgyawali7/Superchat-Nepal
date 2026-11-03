"use client";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

export default function CustomizePage() {
  const { profile, updateProfile, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [pageData, setPageData] = useState(null);
  const [saveStatus, setSaveStatus] = useState("saved");

  const effectiveData = pageData || {
    display_name: profile?.display_name || "",
    bio: profile?.bio || "",
    theme_color: profile?.theme_color || "#ff5500",
    welcome_title: profile?.welcome_title || "Supporting My Stream",
    welcome_sub: profile?.welcome_sub || "Send a message and it will appear on screen!",
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

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  const username = profile?.username || "streamer";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-orange-400 uppercase tracking-widest font-black mb-1">
            Dashboard / Customization
          </p>
          <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-white">
            Page &amp; Brand Editor
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider">
            {saveStatus === "saving" && <span className="text-orange-400 animate-pulse">Saving...</span>}
            {saveStatus === "saved" && <span className="text-emerald-400">✓ All changes saved</span>}
            {saveStatus === "error" && <span className="text-red-400">Save failed</span>}
            {saveStatus === "changed" && <span className="text-amber-400">● Unsaved changes</span>}
          </span>
          <button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
          >
            {saveStatus === "saving" ? "Saving..." : "Save Page"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Inputs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Appearance */}
          <div className="bg-[#0c1220] border border-white/[0.08] p-6 rounded-3xl space-y-4">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider pb-3 border-b border-white/[0.06]">
              Streamer Color Theme
            </h2>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Primary Brand Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={effectiveData.theme_color}
                  onChange={handleChange("theme_color")}
                  className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0 p-0"
                />
                <input
                  type="text"
                  value={effectiveData.theme_color}
                  onChange={handleChange("theme_color")}
                  className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="bg-[#0c1220] border border-white/[0.08] p-6 rounded-3xl space-y-4">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider pb-3 border-b border-white/[0.06]">
              Donation Page Content
            </h2>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white outline-none focus:border-orange-500"
                value={effectiveData.display_name}
                onChange={handleChange("display_name")}
                placeholder="Your Stream Name"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Bio / Stream Description
              </label>
              <textarea
                rows={2}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white outline-none focus:border-orange-500 resize-none"
                value={effectiveData.bio}
                onChange={handleChange("bio")}
                placeholder="Streaming gaming content &amp; esports every weekend!"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Headline
              </label>
              <input
                type="text"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white outline-none focus:border-orange-500"
                value={effectiveData.welcome_title}
                onChange={handleChange("welcome_title")}
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-[#0c1220] border border-white/[0.08] p-6 rounded-3xl space-y-4">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider pb-3 border-b border-white/[0.06]">
              Social Profiles
            </h2>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                YouTube Channel URL
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/@yourstream"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white outline-none focus:border-orange-500"
                value={effectiveData.youtube_url}
                onChange={handleChange("youtube_url")}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Facebook Gaming / Profile URL
              </label>
              <input
                type="url"
                placeholder="https://facebook.com/yourstream"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white outline-none focus:border-orange-500"
                value={effectiveData.facebook_url}
                onChange={handleChange("facebook_url")}
              />
            </div>
          </div>
        </div>

        {/* Live Phone Preview Mockup */}
        <div className="lg:col-span-5">
          <div className="sticky top-8">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 text-center">
              Live Viewer Preview
            </p>
            <div className="mx-auto w-[280px] rounded-[36px] bg-[#0c1220] border-4 border-white/15 p-4 shadow-2xl relative overflow-hidden">
              {/* Phone notch */}
              <div className="w-20 h-4 bg-black/60 rounded-full mx-auto mb-4" />

              <div className="text-center space-y-3">
                <div
                  className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-2xl font-black text-white shadow-lg"
                  style={{ backgroundColor: effectiveData.theme_color }}
                >
                  {(effectiveData.display_name || username).charAt(0).toUpperCase()}
                </div>

                <h3 className="text-base font-black uppercase text-white truncate">
                  {effectiveData.display_name || username}
                </h3>
                <p className="text-[10px] text-slate-400 line-clamp-2 px-2">
                  {effectiveData.bio || "Supporting the stream with eSewa & Khalti."}
                </p>

                {/* Mini mockup donation form */}
                <div className="bg-black/50 border border-white/10 rounded-2xl p-3 space-y-2 text-left">
                  <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold block">
                    Amount
                  </span>
                  <div className="text-center font-black text-xl text-white">
                    रू 100
                  </div>
                  <div
                    className="w-full py-2 rounded-xl text-center text-xs font-black uppercase text-black"
                    style={{ backgroundColor: effectiveData.theme_color }}
                  >
                    Send Superchat
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
