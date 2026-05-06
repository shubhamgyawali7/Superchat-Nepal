"use client";
import React, { useState, useEffect } from 'react';

export default function CustomizePage() {
  const [username, setUsername] = useState('streamer');
  const [pageData, setPageData] = useState({
    welcomeTitle: 'Supporting My Stream',
    welcomeSub: 'Send a message and it will appear on screen!',
    themeColor: '#f97316', // Default Orange
    youtubeUrl: '',
    facebookUrl: '',
    bannerUrl: '', // For a custom top image
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
    alert("Design updated successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto py-8 text-white">
      <h1 className="text-3xl font-black mb-6 uppercase tracking-tight">Public Page Editor</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Side */}
        <div className="space-y-6">
          <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-500 uppercase">Appearance</h2>
            <div>
              <label className="block text-xs mb-2">Theme Accent Color</label>
              <div className="flex gap-4 items-center">
                <input 
                  type="color" 
                  value={pageData.themeColor}
                  onChange={(e) => setPageData({...pageData, themeColor: e.target.value})}
                  className="w-12 h-12 rounded bg-transparent cursor-pointer"
                />
                <span className="font-mono text-sm">{pageData.themeColor}</span>
              </div>
            </div>
          </section>

          <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-500 uppercase">Content</h2>
            <div>
              <label className="block text-xs mb-1">Headline</label>
              <input 
                type="text" 
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none"
                value={pageData.welcomeTitle}
                onChange={(e) => setPageData({...pageData, welcomeTitle: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Sub-headline</label>
              <textarea 
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none"
                value={pageData.welcomeSub}
                onChange={(e) => setPageData({...pageData, welcomeSub: e.target.value})}
              />
            </div>
          </section>

          <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-500 uppercase">Social Links</h2>
            <input 
              type="text" 
              placeholder="YouTube Channel URL"
              className="w-full bg-slate-800 p-3 rounded-xl outline-none"
              onChange={(e) => setPageData({...pageData, youtubeUrl: e.target.value})}
            />
          </section>

          <button 
            onClick={handleSave}
            className="w-full bg-orange-600 hover:bg-orange-700 font-bold py-4 rounded-xl transition-all"
          >
            Save Design Changes
          </button>
        </div>

        {/* Live Preview Side */}
        <div className="sticky top-8">
          <h2 className="text-xs font-bold text-slate-500 uppercase mb-4 text-center tracking-widest">Live Mobile Preview</h2>
          <div className="border-8 border-slate-800 rounded-[3rem] h-150 w-75 mx-auto overflow-hidden bg-slate-950 relative shadow-2xl">
             {/* The Preview Content */}
             <div className="p-4 flex flex-col items-center pt-10">
                <div 
                  className="w-16 h-16 rounded-full mb-4 flex items-center justify-center font-bold"
                  style={{ backgroundColor: pageData.themeColor }}
                >
                  {username[0]?.toUpperCase()}
                </div>
                <h3 className="font-bold text-center text-lg leading-tight">{pageData.welcomeTitle}</h3>
                <p className="text-[10px] text-slate-400 text-center mt-2 px-4">{pageData.welcomeSub}</p>
                
                <div className="w-full mt-6 space-y-2">
                  <div className="h-10 bg-slate-900 rounded-lg border border-white/10 w-full flex items-center px-3">
                    <div className="w-4 h-4 rounded bg-slate-700 mr-2"></div>
                    <div className="h-2 bg-slate-700 w-20 rounded"></div>
                  </div>
                  <div className="h-24 bg-slate-900 rounded-lg border border-white/10 w-full"></div>
                </div>

                <div 
                  className="mt-6 w-full py-3 rounded-xl font-bold text-sm text-center"
                  style={{ backgroundColor: pageData.themeColor }}
                >
                  Support Now
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}