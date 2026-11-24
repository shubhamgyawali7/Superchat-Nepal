"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/common/Icon";
import {
  Menu01Icon,
  Cancel01Icon,
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  Mic01Icon,
  Tv01Icon,
  VolumeHighIcon,
} from "@hugeicons/core-free-icons";

const navigation = [
  ["Features", "#features"],
  ["How it works", "#how-it-works"],
];

export default function VideoHero({ user = null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#E9E4DB] bg-[#FAF7F1]/90 backdrop-blur-lg">
        <div className="mx-auto grid h-[68px] w-full max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8 lg:px-12">
          <Link href="/" className="flex w-fit items-center gap-2.5" aria-label="Superchat Nepal home">
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white">
              <Image src="/logo.png" alt="" width={36} height={36} className="h-full w-full object-contain" priority />
            </span>
            <span className="font-heading text-sm font-bold tracking-tight text-[#1D1D20] sm:text-base">Superchat <span className="text-[#E8470A]">Nepal</span></span>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm font-medium text-[#5F5B55] md:flex">
            {navigation.map(([label, href]) => (
              <Link key={href} href={href} className="transition-colors hover:text-[#E8470A]">{label}</Link>
            ))}
          </nav>

          <div className="hidden items-center justify-self-end gap-3 md:flex">
            {!user && <Link href="/login" className="px-3 py-2 text-sm font-medium text-[#514D47] transition-colors hover:text-[#E8470A]">Log in</Link>}
            <Link href={user ? "/dashboard" : "/register"} className="rounded-lg bg-[#FF4D0A] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#E74408]">
              {user ? "Dashboard" : "Get started"}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="col-start-3 flex h-10 w-10 items-center justify-self-end rounded-lg border border-[#E9E4DB] bg-white text-[#1D1D20] md:hidden"
          >
            <Icon icon={mobileMenuOpen ? Cancel01Icon : Menu01Icon} size={19} />
          </button>
        </div>

        {mobileMenuOpen && (
          <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-[#E9E4DB] bg-[#FAF7F1] px-5 py-3 text-sm text-[#514D47] md:hidden">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-1">
              {navigation.map(([label, href]) => (
                <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2.5 font-medium hover:bg-[#FFF0DF] hover:text-[#E8470A]">{label}</Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[#E9E4DB] pt-3">
                {!user && <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="rounded-lg border border-[#E9E4DB] bg-white px-3 py-2.5 text-center font-semibold">Log in</Link>}
                <Link href={user ? "/dashboard" : "/register"} onClick={() => setMobileMenuOpen(false)} className="rounded-lg bg-[#FF4D0A] px-3 py-2.5 text-center font-semibold text-white">{user ? "Dashboard" : "Get started"}</Link>
              </div>
            </div>
          </nav>
        )}
      </header>

      <section className="bg-[#FAF7F1] px-5 pb-14 pt-10 sm:px-8 sm:pb-16 sm:pt-14 lg:px-12 lg:pb-20 lg:pt-16">
        <div className="mx-auto grid w-full max-w-[1440px] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 xl:gap-20">
          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#F4D6BC] bg-[#FFF0DF] px-3.5 py-1.5 text-xs font-semibold text-[#A83A12]">
              <NepalFlag />
              Made for Nepali creators
            </p>
            <h1 className="font-heading text-[2.125rem] font-bold leading-[1.12] tracking-[-0.04em] text-[#1D1D20] sm:text-[2.5rem] lg:text-[3rem] xl:text-[3.5rem]">
              Bring your community into the stream.
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-[15px] leading-7 text-[#77736C] sm:text-base lg:mx-0">
              A simple way for viewers in Nepal to support you with eSewa or Khalti and celebrate together on screen.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link href={user ? "/dashboard" : "/register"} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF4D0A] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#E74408]">
                {user ? "Open dashboard" : "Get started"} <Icon icon={ArrowRight01Icon} size={16} />
              </Link>
              <Link href="#how-it-works" className="inline-flex items-center justify-center rounded-lg border border-[#DCD6CC] bg-white px-5 py-3 text-sm font-semibold text-[#1D1D20] transition-colors hover:border-[#E6A47C] hover:bg-[#FFF9F3]">
                See how it works
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-[#77736C] lg:justify-start">
              <span>0% monthly platform fee</span><span aria-hidden="true" className="text-[#C7BFB3]">•</span>
              <span>NPR donations</span><span aria-hidden="true" className="text-[#C7BFB3]">•</span><span>OBS ready</span>
            </div>
          </div>

          <StreamProductPreview />
        </div>
      </section>
    </>
  );
}

function StreamProductPreview() {
  return (
    <div className="product-preview mx-auto w-full max-w-2xl rounded-2xl border border-[#E9E4DB] bg-white p-3 shadow-[0_18px_55px_rgba(50,40,20,0.10)] sm:p-4">
      <div className="flex items-center justify-between gap-3 px-2 pb-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF0DF] text-[#E8470A]"><Icon icon={Tv01Icon} size={17} /></span>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-[#1D1D20] sm:text-sm">OBS browser source</p>
            <p className="text-[11px] text-[#77736C]">superchatnepal.com/overlay</p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#EAF5ED] px-2.5 py-1 text-[11px] font-semibold text-[#277443]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#36A263]" /> Connected
        </span>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-[#1D1D20] p-4 text-white sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3 text-[11px] font-medium text-white/70 sm:text-xs">
          <span className="inline-flex items-center gap-2"><span className="rounded bg-[#D83232] px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">LIVE</span> Stream preview</span>
          <span className="hidden sm:inline">Donation alert / preview</span>
        </div>

        <div className="relative flex min-h-[236px] items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-[#28282D] p-4 sm:min-h-[286px] sm:p-7">
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-16 border-t border-white/5 bg-[#222227]" />
          <div aria-hidden="true" className="absolute bottom-16 left-[8%] h-20 w-[14%] rounded-t bg-[#34343A]" />
          <div aria-hidden="true" className="absolute bottom-16 right-[10%] h-28 w-[18%] rounded-t bg-[#323238]" />
          <div className="relative z-10 w-full max-w-sm rounded-xl border border-white/10 bg-[#111113]/95 p-4 text-center shadow-2xl sm:p-5">
            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#FF4D0A] font-heading text-sm font-extrabold text-white">N</div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">Superchat received</p>
            <p className="mt-1 font-heading text-lg font-bold text-white sm:text-xl">Aayush Sharma</p>
            <p className="mt-1 font-heading text-2xl font-extrabold text-[#FF8A50] sm:text-3xl">NPR 500</p>
            <p className="mt-3 rounded-lg bg-white/[0.06] px-3 py-2 text-xs leading-5 text-white/80 sm:text-sm">“GG! That clutch was unreal. Keep going!”</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <span className="rounded-md bg-[#FFF0DF] px-2.5 py-1 text-[10px] font-bold text-[#A83A12]">eSewa</span>
              <span className="rounded-md bg-[#FFF0DF] px-2.5 py-1 text-[10px] font-bold text-[#A83A12]">Khalti</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-medium text-white/65 sm:justify-between">
          <span className="inline-flex items-center gap-1.5"><Icon icon={VolumeHighIcon} size={14} /> Audio chime</span>
          <span className="inline-flex items-center gap-1.5"><Icon icon={Mic01Icon} size={14} /> Text-to-speech</span>
          <span className="inline-flex items-center gap-1.5"><Icon icon={CheckmarkCircle01Icon} size={14} /> Payment verified</span>
        </div>
      </div>
    </div>
  );
}

function NepalFlag() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 32" className="h-4 w-3.5 shrink-0">
      <path d="M2 2v28M3 3l17 8H3m0 1 13 7H3" fill="#DC2626" stroke="#1E3A8A" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
