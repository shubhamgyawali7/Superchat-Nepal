"use client";
import React, { useState, useEffect } from 'react';

export default function CustomizePage() {
  const [username, setUsername] = useState('streamer');
  const [pageData, setPageData] = useState({
    welcomeTitle: 'Supporting My Stream',
    welcomeSub: 'Send a message and it will appear on screen!',
    themeColor: '#f97316',
    youtubeUrl: '',
    facebookUrl: '',
    bannerUrl: '',
  });

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("user_session") || "{}");
    if (session.username) {
      setUsername(session.username);
      const saved = localStorage.getItem(`${session.username}_page_design`);
      if (saved) setPageData(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(`${username}_page_design`, JSON.stringify(pageData));
    alert("Design updated!");
  };

  return (
    <div className="text-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');`}</style>

      <div className="mb-6">
        <p className="text-[10px] text-text-muted uppercase tracking-widest mb-0.5">Dashboard / Customize</p>
        <h1 className="text-xl font-bold uppercase tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
          Page Editor
        </h1>
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
                  value={pageData.themeColor}
                  onChange={(e) => setPageData({ ...pageData, themeColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer bg-transparent border-none p-0"
                />
                <span className="text-xs font-mono text-text-muted">{pageData.themeColor}</span>
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
                value={pageData.welcomeTitle}
                onChange={(e) => setPageData({ ...pageData, welcomeTitle: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] text-text-muted uppercase tracking-widest mb-1.5">Sub-headline</label>
              <textarea
                rows="2"
                className="w-full bg-background border border-surface-border focus:border-orange-500/50 p-2.5 rounded text-sm outline-none transition-colors resize-none text-foreground"
                value={pageData.welcomeSub}
                onChange={(e) => setPageData({ ...pageData, welcomeSub: e.target.value })}
              />
            </div>
          </section>

          {/* Social */}
          <section className="bg-surface border border-surface-border p-5 rounded-lg space-y-4">
            <p className="text-[10px] text-text-muted uppercase tracking-widest border-b border-surface-border pb-3">Social Links</p>
            <div>
              <label className="block text-[10px] text-text-muted uppercase tracking-widest mb-1.5">YouTube URL</label>
              <input
                type="text"
                placeholder="https://youtube.com/@..."
                className="w-full bg-background border border-surface-border focus:border-orange-500/50 p-2.5 rounded text-sm outline-none transition-colors placeholder-text-muted text-foreground"
                onChange={(e) => setPageData({ ...pageData, youtubeUrl: e.target.value })}
              />
            </div>
          </section>

          <button
            onClick={handleSave}
            className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold py-2.5 rounded text-sm uppercase tracking-wide transition-all active:scale-[0.98]"
          >
            Save Changes
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
                  style={{ backgroundColor: pageData.themeColor }}
                >
                  {username[0]?.toUpperCase()}
                </div>
                <p className="text-[11px] font-bold text-center leading-tight mb-1 text-foreground" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {pageData.welcomeTitle}
                </p>
                <p className="text-[9px] text-text-muted text-center mb-4 px-2 leading-relaxed">
                  {pageData.welcomeSub}
                </p>
                <div className="w-full space-y-1.5">
                  <div className="h-7 bg-surface rounded border border-surface-border w-full" />
                  <div className="h-14 bg-surface rounded border border-surface-border w-full" />
                </div>
                <div
                  className="mt-3 w-full py-2 rounded text-[10px] font-bold text-center text-black"
                  style={{ backgroundColor: pageData.themeColor }}
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