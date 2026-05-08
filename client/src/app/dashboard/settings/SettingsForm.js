"use client";
import React, { useState, useCallback } from "react";
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

