"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { QRCodeCanvas } from "qrcode.react";
import Icon from "@/components/common/Icon";
import {
  Menu01Icon,
  Cancel01Icon,
  ArrowRight01Icon,
  Radio01Icon,
  Tv01Icon,
  Wallet01Icon,
  CheckmarkCircle01Icon,
  VolumeHighIcon,
  Mic01Icon,
  QrCodeIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";

export default function VideoHero({ user = null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0: OBS Alert, 1: Dashboard & QR, 2: Donation Page

  // Always auto-advance clip in an infinite continuous loop every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-black text-white flex flex-col justify-between overflow-hidden">
      {/* Subtle Background Glow & Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-violet-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-10 left-1/3 w-[500px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      {/* Top Overlay: Navigation Bar */}
      <nav
        aria-label="Main Navigation"
        className="relative z-30 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Superchat Nepal"
                width={36}
                height={36}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <span className="text-base sm:text-lg font-heading font-black tracking-tight uppercase text-white">
              Superchat <span className="text-violet-400">Nepal</span>
            </span>
          </Link>

          {/* Desktop Navigation Links (14px UI Text) */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-wider text-zinc-400">
            <Link href="#features" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#gateways" className="hover:text-white transition-colors">
              eSewa &amp; Khalti
            </Link>
            <Link href="#overlay" className="hover:text-white transition-colors">
              OBS Overlay
            </Link>
            <Link href="#faq" className="hover:text-white transition-colors">
              FAQ
            </Link>
          </div>

          {/* Desktop Action Buttons (14px UI Text) */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-black uppercase tracking-wider text-sm transition-colors shadow-lg shadow-violet-600/20"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-bold uppercase tracking-wider text-zinc-300 hover:text-white px-4 py-2 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-black uppercase tracking-wider text-sm transition-colors shadow-lg shadow-violet-600/20"
                >
                  Start Streaming Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white transition-colors"
          >
            <Icon icon={mobileMenuOpen ? Cancel01Icon : Menu01Icon} size={20} />
          </button>
        </div>

        {/* Mobile Collapsible Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden px-5 pt-3 pb-6 border-t border-zinc-800 bg-zinc-950 space-y-4"
            >
              <div className="flex flex-col space-y-3 text-sm font-bold uppercase tracking-wider text-zinc-300">
                <Link
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-white transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#gateways"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-white transition-colors"
                >
                  eSewa &amp; Khalti
                </Link>
                <Link
                  href="#overlay"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-white transition-colors"
                >
                  OBS Overlay
                </Link>
                <Link
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex flex-col gap-2">
                {user ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-violet-600 text-white py-3 rounded-xl font-black uppercase tracking-wider text-sm transition-colors"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center border border-zinc-800 bg-zinc-900 py-3 rounded-xl font-bold uppercase tracking-wider text-sm text-white transition-colors"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center bg-violet-600 text-white py-3 rounded-xl font-black uppercase tracking-wider text-sm transition-colors"
                    >
                      Start Streaming Free
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Hero Body */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-10 md:py-16 w-full flex flex-col items-center">
        {/* Top Header & Value Proposition */}
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-10 md:mb-12">
          {/* Live Badge (12px caption) */}
          <div className="inline-flex items-center gap-2 border border-zinc-800 bg-zinc-900/90 px-4 py-1.5 rounded-full text-zinc-300 backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider">
              Live Monetization for Nepali Streamers
            </span>
          </div>

          {/* Heading H1 (35px-50px desktop; 28px-40px mobile) */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black tracking-tight uppercase leading-[1.08] text-white">
            Turn Live Streams into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-emerald-400">
              Instant Income.
            </span>
          </h1>

          {/* Body Paragraph (16px-18px) */}
          <p className="text-base sm:text-lg text-zinc-300 font-medium leading-relaxed max-w-2xl mx-auto">
            Accept superchats directly via <strong className="text-white">eSewa</strong> &amp;{" "}
            <strong className="text-white">Khalti</strong>. Get zero-latency OBS audio alerts, on-screen donor cards,
            and automated Nepali Text-to-Speech without overseas fees.
          </p>

          {/* CTA Buttons (14px-16px) */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href={user ? "/dashboard" : "/register"}
              className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-7 py-4 rounded-xl text-sm sm:text-base font-black uppercase tracking-wider text-center transition-all shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40"
            >
              <span>{user ? "Go to Dashboard" : "Start Streaming Free"}</span>
              <Icon icon={ArrowRight01Icon} size={18} />
            </Link>

            <Link
              href="#overlay"
              className="inline-flex items-center justify-center gap-2 border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white px-6 py-4 rounded-xl text-sm sm:text-base font-bold uppercase tracking-wider text-center transition-colors"
            >
              <span>Explore Features</span>
            </Link>
          </div>

          {/* Feature Highlights Pills (12px Caption) */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Icon icon={CheckmarkCircle01Icon} size={15} className="text-emerald-400" />
              &lt; 100ms OBS Latency
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Icon icon={CheckmarkCircle01Icon} size={15} className="text-violet-400" />
              eSewa &amp; Khalti Native
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Icon icon={CheckmarkCircle01Icon} size={15} className="text-indigo-400" />
              Audio Chimes + TTS
            </span>
          </div>
        </div>

        {/* 🎬 The Platform Clip Preview Showcase */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/95 shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Window Topbar */}
            <div className="px-5 py-3.5 border-b border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between">
              {/* Window Controls & Address */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-xs font-mono text-zinc-400 font-bold ml-2">
                  superchat-nepal://stream-preview
                </span>
              </div>

              {/* Always Looping Live Indicator */}
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Live Stream Clip
                </span>
              </div>
            </div>

            {/* Display Stage with Animated Content */}
            <div className="p-6 sm:p-8 min-h-[360px] sm:min-h-[400px] flex items-center justify-center bg-gradient-to-b from-zinc-950 via-zinc-950 to-black">
              <AnimatePresence mode="wait">
                {/* 1. LIVE OBS ALERT CLIP */}
                {activeTab === 0 && (
                  <motion.div
                    key="obs-alert"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-lg mx-auto text-center space-y-4"
                  >
                    <div className="inline-flex items-center gap-2 bg-violet-600/10 border border-violet-500/20 px-3 py-1 rounded-full text-violet-400 text-xs font-bold uppercase tracking-wider">
                      <Icon icon={Radio01Icon} size={14} className="text-emerald-400 animate-pulse" />
                      <span>OBS Studio Broadcast View (WebSocket Live)</span>
                    </div>

                    {/* OBS Screen Alert Box Simulation */}
                    <div className="p-6 sm:p-7 rounded-2xl bg-zinc-900/90 border border-violet-500/30 shadow-2xl relative overflow-hidden text-center space-y-4">
                      {/* Audio Soundwaves Animation */}
                      <div className="flex items-center justify-center gap-1 h-6">
                        {[40, 75, 100, 60, 90, 45, 80, 50, 95, 30].map((h, i) => (
                          <span
                            key={i}
                            className="w-1 bg-violet-400 rounded-full animate-pulse"
                            style={{
                              height: `${h}%`,
                              animationDelay: `${i * 0.1}s`,
                              animationDuration: "0.8s",
                            }}
                          />
                        ))}
                      </div>

                      <div>
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-400 bg-zinc-950 px-3 py-1 rounded-md border border-zinc-800">
                          eSewa Superchat Alert
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-white mt-3">
                          Aayush Sharma
                        </h3>
                      </div>

                      <div className="inline-block bg-zinc-950 border border-emerald-500/30 px-6 py-2 rounded-xl text-emerald-400 font-heading font-black text-3xl shadow-inner">
                        रू 500
                      </div>

                      <div className="bg-zinc-950/80 border border-zinc-800 p-4 rounded-xl text-sm text-zinc-200 italic font-medium leading-relaxed max-w-md mx-auto">
                        &ldquo;Brother insane 1v4 clutch in Pochinki! Aaja chicken dinner pakka ho! Keep streaming 🔥&rdquo;
                      </div>

                      <div className="flex items-center justify-center gap-4 text-xs text-zinc-400 font-mono pt-1">
                        <span className="flex items-center gap-1.5 text-zinc-300">
                          <Icon icon={VolumeHighIcon} size={15} className="text-violet-400" />
                          Ding Dong Chime
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5 text-zinc-300">
                          <Icon icon={Mic01Icon} size={15} className="text-emerald-400" />
                          Nepali Text-to-Speech
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. STREAMER DASHBOARD & QR CLIP */}
                {activeTab === 1 && (
                  <motion.div
                    key="dashboard-qr"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-2xl mx-auto space-y-4"
                  >
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-zinc-400 font-bold uppercase tracking-wider">
                        Streamer Portal: <span className="text-violet-400 font-mono">@nodex-gaming</span>
                      </span>
                      <span className="text-xs text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-0.5 rounded font-bold">
                        ● All Gateways Online
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                        <p className="text-xs text-zinc-400 uppercase tracking-widest font-black">Total Earnings</p>
                        <p className="text-2xl font-heading font-black text-violet-400 mt-1">रू 54,250</p>
                        <p className="text-xs text-zinc-500 mt-1">42 donors this week</p>
                      </div>

                      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                        <p className="text-xs text-zinc-400 uppercase tracking-widest font-black">Gateways</p>
                        <div className="mt-2 space-y-1">
                          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                            <Icon icon={CheckmarkCircle01Icon} size={14} /> eSewa (Active)
                          </span>
                          <span className="text-xs text-purple-400 font-bold flex items-center gap-1">
                            <Icon icon={CheckmarkCircle01Icon} size={14} /> Khalti (Active)
                          </span>
                        </div>
                      </div>

                      {/* Centered Logo QR Generator Showcase */}
                      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-xs text-zinc-400 uppercase tracking-widest font-black">Donation QR</p>
                          <p className="text-sm text-white font-bold mt-1">With App Logo</p>
                          <span className="text-xs text-violet-400 font-mono font-bold">Instant Scan</span>
                        </div>
                        <div className="bg-white p-1 rounded-lg flex items-center justify-center">
                          <QRCodeCanvas
                            value="https://superchat-nepal.com/donate/nodex-gaming"
                            size={72}
                            level="H"
                            marginSize={1}
                            imageSettings={{
                              src: "/logo.png",
                              height: 16,
                              width: 16,
                              excavate: true,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mini Recent Donations Feed */}
                    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5 space-y-2">
                      <p className="text-xs text-zinc-400 uppercase tracking-widest font-black px-1">
                        Live Stream Superchat Ticker
                      </p>
                      <div className="space-y-1.5 text-xs sm:text-sm">
                        <div className="flex items-center justify-between bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/60">
                          <span className="font-bold text-white">Suman Gurung</span>
                          <span className="text-zinc-400 italic text-xs truncate max-w-[200px]">
                            &ldquo;Chicken dinner celebration!&rdquo;
                          </span>
                          <span className="text-emerald-400 font-bold font-mono">रू 500</span>
                        </div>
                        <div className="flex items-center justify-between bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/60">
                          <span className="font-bold text-white">Pradeep K.</span>
                          <span className="text-zinc-400 italic text-xs truncate max-w-[200px]">
                            &ldquo;Keep it up bro!!&rdquo;
                          </span>
                          <span className="text-purple-400 font-bold font-mono">रू 250</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3. VIEWER SUPERCHAT FORM CLIP */}
                {activeTab === 2 && (
                  <motion.div
                    key="viewer-donation"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md mx-auto space-y-4"
                  >
                    <div className="text-center space-y-1">
                      <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 mx-auto flex items-center justify-center text-xl font-heading font-black text-white">
                        N
                      </div>
                      <h4 className="text-xl font-heading font-black uppercase text-white">
                        Donate to nodex-gaming
                      </h4>
                      <p className="text-sm text-zinc-400 font-medium">
                        Select amount &amp; support directly with eSewa or Khalti
                      </p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-4">
                      {/* Quick Amounts (14px font-bold) */}
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                          Quick Amount (NPR)
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {["100", "250", "500", "1000"].map((amt, idx) => (
                            <div
                              key={amt}
                              className={`py-2 text-center rounded-lg text-sm font-mono font-bold border transition-colors ${
                                idx === 2
                                  ? "bg-violet-600 text-white border-violet-500"
                                  : "bg-zinc-950 border-zinc-800 text-zinc-300"
                              }`}
                            >
                              रू {amt}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Method Selector (14px font-bold) */}
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                          Payment Gateway
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2.5 rounded-xl border border-emerald-500 bg-emerald-950/20 text-emerald-400 text-sm font-bold flex items-center justify-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span>eSewa ePay</span>
                          </div>
                          <div className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-400 text-sm font-bold flex items-center justify-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-zinc-600" />
                            <span>Khalti Wallet</span>
                          </div>
                        </div>
                      </div>

                      {/* Mock Submit Button (14px UI Text) */}
                      <button
                        type="button"
                        className="w-full py-3 rounded-xl bg-emerald-600 text-white font-black uppercase tracking-wider text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <Icon icon={Wallet01Icon} size={16} />
                        <span>Pay रू 500 via eSewa</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Status Footer with 3 Looping Indicator Dots */}
            <div className="px-5 py-3 border-t border-zinc-800/80 bg-zinc-900/40 flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-400" />
                <span>
                  {activeTab === 0 && "Live OBS Alert Simulation"}
                  {activeTab === 1 && "Streamer Analytics & QR Generator"}
                  {activeTab === 2 && "Supporter eSewa & Khalti Checkout"}
                </span>
              </span>
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeTab === i ? "w-6 bg-violet-500" : "w-1.5 bg-zinc-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
