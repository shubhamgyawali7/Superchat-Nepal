"use client";
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

export default function CustomizePage() {
  const { profile, updateProfile, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [pageData, setPageData] = useState(null);
  const [saveStatus, setSaveStatus] = useState('saved');

  const effectiveData = pageData || {
    display_name: profile?.display_name || '',
    bio: profile?.bio || '',
    theme_color: profile?.theme_color || '#f97316',
    welcome_title: profile?.welcome_title || 'Supporting My Stream',
    welcome_sub: profile?.welcome_sub || 'Send a message and it will appear on screen!',
    youtube_url: profile?.youtube_url || '',
    facebook_url: profile?.facebook_url || '',
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const result = await updateProfile(effectiveData);
      if (result.success) {
        setSaveStatus('saved');
        addToast("Design saved successfully!", "success");
      } else {
        setSaveStatus('error');
        addToast(result.error || "Failed to save design", "error");
      }
    } catch {
      setSaveStatus('error');
      addToast("Failed to save design", "error");
    }
  };

  const handleChange = (key) => (e) => {
    setPageData(prev => ({ ...effectiveData, [key]: e.target.value }));
    setSaveStatus('changed');
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  const username = profile?.username || 'streamer';

  return (
    <div className="text-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');`}</style>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-text-muted uppercase tracking-widest mb-0.5">Dashboard / Customize</p>
          <h1 className="text-xl font-bold uppercase tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            Page Editor
          </h1>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
          {saveStatus === 'saving' && <span className="text-orange-400 animate-pulse">Saving...</span>}
          {saveStatus === 'saved' && <span className="text-emerald-500">All changes saved</span>}
          {saveStatus === 'error' && <span className="text-red-500">Save failed</span>}
          {saveStatus === 'changed' && <span className="text-text-muted">Unsaved changes...</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Editor */}
        <div className="lg:col-span-3 space-y-4">

          {/* Appearance */}
          <section className="bg-surface border border-surface-border p-5 rounded-lg space-y-4">
            <p className="text-[10px] text-text-muted uppercase tracking-widest border-b border-surface-border pb-3">Appearance</p>
            <div>
              <label className="block text-[10px] text-text-muted uppercase tracking-widest mb-2">Theme Color</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={effectiveData.theme_color}
                  onChange={handleChange('theme_color')}
                  className="w-10 h-10 rounded cursor-pointer bg-transparent border-none p-0"
                />
                <span className="text-xs font-mono text-text-muted">{effectiveData.theme_color}</span>
              </div>
            </div>
          </section>

          {/* Content */}
          <section className="bg-surface border border-surface-border p-5 rounded-lg space-y-4">
            <p className="text-[10px] text-text-muted uppercase tracking-widest border-b border-surface-border pb-3">Page Content</p>
            <div>
              <label className="block text-[10px] text-text-muted uppercase tracking-widest mb-1.5">Headline</label>
              <input
                type="text"
                className="w-full bg-background border border-surface-border focus:border-orange-500/50 p-2.5 rounded text-sm outline-none transition-colors text-foreground"
                value={effectiveData.welcome_title}
                onChange={handleChange('welcome_title')}
              />
            </div>
            <div>
              <label className="block text-[10px] text-text-muted uppercase tracking-widest mb-1.5">Sub-headline</label>
              <textarea
                rows="2"
                className="w-full bg-background border border-surface-border focus:border-orange-500/50 p-2.5 rounded text-sm outline-none transition-colors resize-none text-foreground"
                value={effectiveData.welcome_sub}
                onChange={handleChange('welcome_sub')}
              />
            </div>
            <div>
              <label className="block text-[10px] text-text-muted uppercase tracking-widest mb-1.5">Display Name</label>
              <input
                type="text"
                className="w-full bg-background border border-surface-border focus:border-orange-500/50 p-2.5 rounded text-sm outline-none transition-colors text-foreground"
                value={effectiveData.display_name}
                onChange={handleChange('display_name')}
                placeholder="Your display name"
              />
            </div>
            <div>
              <label className="block text-[10px] text-text-muted uppercase tracking-widest mb-1.5">Bio</label>
              <textarea
                rows="2"
                className="w-full bg-background border border-surface-border focus:border-orange-500/50 p-2.5 rounded text-sm outline-none transition-colors resize-none text-foreground"
                value={effectiveData.bio}
                onChange={handleChange('bio')}
                placeholder="Tell your fans about yourself..."
              />
            </div>
          </section>

          {/* Social */}
          <section className="bg-surface border border-surface-border p-5 rounded-lg space-y-4">
            <p className="text-[10px] text-text-muted uppercase tracking-widest border-b border-surface-border pb-3">Social Links</p>
            <div>
              <label className="block text-[10px] text-text-muted uppercase tracking-widest mb-1.5">YouTube URL</label>
              <input
                type="url"
                placeholder="https://youtube.com/@..."
                className="w-full bg-background border border-surface-border focus:border-orange-500/50 p-2.5 rounded text-sm outline-none transition-colors placeholder-text-muted text-foreground"
                value={effectiveData.youtube_url}
                onChange={handleChange('youtube_url')}
              />
            </div>
            <div>
              <label className="block text-[10px] text-text-muted uppercase tracking-widest mb-1.5">Facebook URL</label>
              <input
                type="url"
                placeholder="https://facebook.com/..."
                className="w-full bg-background border border-surface-border focus:border-orange-500/50 p-2.5 rounded text-sm outline-none transition-colors placeholder-text-muted text-foreground"
                value={effectiveData.facebook_url}
                onChange={handleChange('facebook_url')}
              />
            </div>
          </section>

          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold py-2.5 rounded text-sm uppercase tracking-wide transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {saveStatus === 'saving' ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          <p className="text-[10px] text-text-muted uppercase tracking-widest mb-3 text-center">Mobile Preview</p>
          <div className="mx-auto w-[220px]">
            <div className="border-4 border-surface-border rounded-[28px] overflow-hidden bg-background shadow-2xl">
              {/* Phone notch */}
              <div className="bg-surface h-6 flex items-center justify-center">
                <div className="w-12 h-1.5 bg-surface-border rounded-full" />
              </div>
              {/* Content */}
              <div className="p-4 flex flex-col items-center">
                <div
                  className="w-12 h-12 rounded-full mb-3 flex items-center justify-center text-sm font-bold text-black"
                  style={{ backgroundColor: effectiveData.theme_color }}
                >
                  {username[0]?.toUpperCase()}
                </div>
                <p className="text-[11px] font-bold text-center leading-tight mb-1 text-foreground" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {effectiveData.welcome_title}
                </p>
                <p className="text-[9px] text-text-muted text-center mb-4 px-2 leading-relaxed">
                  {effectiveData.welcome_sub}
                </p>
                <div className="w-full space-y-1.5">
                  <div className="h-7 bg-surface rounded border border-surface-border w-full" />
                  <div className="h-14 bg-surface rounded border border-surface-border w-full" />
                </div>
                <div
                  className="mt-3 w-full py-2 rounded text-[10px] font-bold text-center text-black"
                  style={{ backgroundColor: effectiveData.theme_color }}
                >
                  Support Now
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
