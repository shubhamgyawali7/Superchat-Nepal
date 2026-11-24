"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import Icon from "@/components/common/Icon";
import {
  Menu01Icon,
  Cancel01Icon,
  ArrowRight01Icon,
  Radio01Icon,
} from "@hugeicons/core-free-icons";

export default function VideoHero({
  user = null,
  videoSrc = "/videos/hero-bg.mp4",
  badge = "Live Monetization for Nepali Streamers",
  heading = (
    <>
      Turn Live Streams into <br className="hidden sm:inline" />
      <span className="text-violet-400">Instant Income.</span>
    </>
  ),
  paragraph = "Accept superchats directly via eSewa and Khalti. Get instantaneous OBS sound alerts, on-screen donor popups, and automated Text-to-Speech built exclusively for Nepali creators.",
  primaryCta = {
    label: "Start Streaming Free",
    href: "/register",
  },
  secondaryCta = {
    label: "Explore Features",
    href: "#features",
  },
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <section className="relative w-full h-screen min-h-[100dvh] overflow-hidden flex flex-col justify-between bg-black">
      {/* 1. Autoplaying, Looping, Muted Background Video filling edge-to-edge */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support HTML5 background video.
      </video>

      {/* 2. Semi-Transparent Solid Dimming Layer (No Gradients) */}
      <div
        className="absolute inset-0 z-10 pointer-events-none bg-black/75"
        aria-hidden="true"
      />

      {/* 3. Top Overlay: Horizontal Navigation Bar absolutely positioned at top */}
      <nav
        aria-label="Main Navigation"
        className="absolute top-0 left-0 right-0 z-30 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Superchat Nepal"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <span className="text-base sm:text-lg font-heading font-black tracking-tight uppercase text-white">
              Superchat <span className="text-violet-400">Nepal</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-zinc-300">
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

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-lg font-black uppercase tracking-wider text-xs transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white px-4 py-2 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-lg font-black uppercase tracking-wider text-xs transition-colors"
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
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white focus:outline-none transition-colors"
          >
            <Icon icon={mobileMenuOpen ? Cancel01Icon : Menu01Icon} size={20} />
          </button>
        </div>

        {/* Mobile Collapsible Menu Drawer (Motion / Animate UI) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden px-5 pt-3 pb-6 border-t border-zinc-800 bg-zinc-950 space-y-4"
            >
              <div className="flex flex-col space-y-3 text-xs font-bold uppercase tracking-wider text-zinc-300">
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
                    className="w-full text-center bg-violet-600 text-white py-3 rounded-lg font-black uppercase tracking-wider text-xs transition-colors"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center border border-zinc-800 bg-zinc-900 py-3 rounded-lg font-bold uppercase tracking-wider text-xs text-white transition-colors"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center bg-violet-600 text-white py-3 rounded-lg font-black uppercase tracking-wider text-xs transition-colors"
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

      {/* 4. Bottom Overlay: Anchored vertical stack above video & dimming layers */}
      <div
        role="region"
        aria-label="Hero overview"
        className="relative z-20 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pb-12 sm:pb-16 md:pb-20 pt-28 sm:pt-36 flex flex-col justify-end"
      >
        <div className="max-w-4xl space-y-4 sm:space-y-6">
          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center gap-2 border border-zinc-800 bg-zinc-900 px-3.5 sm:px-4 py-1.5 rounded-full text-zinc-300">
              <Icon icon={Radio01Icon} size={14} className="text-violet-400" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                {badge}
              </span>
            </div>
          )}

          {/* Heading on its own line (No Gradients) */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black tracking-tight uppercase leading-[1.05] text-white">
            {heading}
          </h1>

          {/* Supporting paragraph directly below heading at comfortable reading width */}
          <p className="text-base sm:text-lg md:text-xl text-zinc-300 font-medium leading-relaxed max-w-2xl">
            {paragraph}
          </p>

          {/* Horizontal row of two CTA buttons sitting side by side on the same baseline (No Hover Scales, No Shadows) */}
          <div className="pt-2 sm:pt-4 flex flex-row items-center gap-3 sm:gap-4">
            {/* Primary button on the left */}
            <Link
              href={user ? "/dashboard" : primaryCta.href}
              className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider text-center transition-colors"
            >
              <span>{user ? "Go to Dashboard" : primaryCta.label}</span>
              <Icon icon={ArrowRight01Icon} size={16} />
            </Link>

            {/* Secondary button on the right */}
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center justify-center border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-white px-5 sm:px-7 py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-center transition-colors"
            >
              {secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
