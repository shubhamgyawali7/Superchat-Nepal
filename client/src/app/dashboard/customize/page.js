"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import Icon from "@/components/common/Icon";
import { CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";

export default function CustomizePage() {
  const { profile, updateProfile, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [pageData, setPageData] = useState(null);
  const [saveStatus, setSaveStatus] = useState("saved");

  const effectiveData = pageData || {
    display_name: profile?.display_name || "",
    bio: profile?.bio || "",
    theme_color: profile?.theme_color || "#7c3aed",
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
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-zinc-700 border-t-violet-500" />
      </div>
    );
  }

  const username = profile?.username || "streamer";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-violet-400 uppercase tracking-widest font-black mb-1">
            Dashboard / Customization
          </p>
          <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-white">
            Page &amp; Brand Editor
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
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {saveStatus === "saving" ? "Saving..." : "Save Page"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Inputs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Appearance */}
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <h2 className="text-xs font-black text-zinc-400 uppercase tracking-wider pb-3 border-b border-zinc-800">
              Streamer Color Theme
            </h2>
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Primary Brand Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={effectiveData.theme_color}
                  onChange={handleChange("theme_color")}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                />
                <input
                  type="text"
                  value={effectiveData.theme_color}
                  onChange={handleChange("theme_color")}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm font-mono text-white outline-none focus:border-zinc-600"
                />
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <h2 className="text-xs font-black text-zinc-400 uppercase tracking-wider pb-3 border-b border-zinc-800">
              Donation Page Content
            </h2>
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm font-medium text-white outline-none focus:border-zinc-600"
                value={effectiveData.display_name}
                onChange={handleChange("display_name")}
                placeholder="Your Stream Name"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Bio / Stream Description
              </label>
              <textarea
                rows={2}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm font-medium text-white outline-none focus:border-zinc-600 resize-none"
                value={effectiveData.bio}
                onChange={handleChange("bio")}
                placeholder="Streaming gaming content &amp; esports every weekend!"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Headline
              </label>
              <input
                type="text"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm font-medium text-white outline-none focus:border-zinc-600"
                value={effectiveData.welcome_title}
                onChange={handleChange("welcome_title")}
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <h2 className="text-xs font-black text-zinc-400 uppercase tracking-wider pb-3 border-b border-zinc-800">
              Social Profiles
            </h2>
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                YouTube Channel URL
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/@yourstream"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm font-medium text-white outline-none focus:border-zinc-600"
                value={effectiveData.youtube_url}
                onChange={handleChange("youtube_url")}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Facebook Gaming / Profile URL
              </label>
              <input
                type="url"
                placeholder="https://facebook.com/yourstream"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm font-medium text-white outline-none focus:border-zinc-600"
                value={effectiveData.facebook_url}
                onChange={handleChange("facebook_url")}
              />
            </div>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 space-y-4">
            <p className="text-xs font-black uppercase tracking-wider text-zinc-400">
              Live Preview
            </p>
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-heading font-black text-white text-lg">
                  {(effectiveData.display_name || username)[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="font-heading font-black text-base text-white">
                    {effectiveData.display_name || username}
                  </h3>
                  <p className="text-xs text-zinc-400">@{username}</p>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                {effectiveData.bio || "No bio set."}
              </p>

              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-2">
                <p className="text-xs font-bold text-white uppercase tracking-wider">
                  {effectiveData.welcome_title}
                </p>
                <p className="text-xs text-zinc-400">
                  {effectiveData.welcome_sub}
                </p>
              </div>

              <a
                href={`/donate/${username}`}
                target="_blank"
                rel="noreferrer"
                className="block text-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white py-3 rounded-xl transition-colors"
              >
                View Public Donation Page ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
