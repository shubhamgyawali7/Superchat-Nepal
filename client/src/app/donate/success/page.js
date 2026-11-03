"use client";
import React, { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function DonateSuccessContent() {
  const [status, setStatus] = useState("checking");
  const [errorMsg, setErrorMsg] = useState("");
  const streamerRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlStreamer = searchParams.get("streamer");
    if (urlStreamer) streamerRef.current = urlStreamer;

    const verifyPayment = async () => {
      const dataParam = searchParams.get("data");

      if (!dataParam) {
        const donationId = typeof window !== "undefined" ? sessionStorage.getItem("pending_donation_id") : null;
        if (!donationId) {
          setStatus("completed");
          return;
        }
        setStatus("failed");
        setErrorMsg("No payment data received from gateway.");
        return;
      }

      try {
        const response = await fetch("/api/donations/verify-esewa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: dataParam }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            if (result.donation?.streamer) {
              streamerRef.current = result.donation.streamer;
            }
            setStatus("completed");
            sessionStorage.removeItem("pending_donation_id");
          } else {
            setStatus("failed");
            setErrorMsg(result.message || "Verification failed");
          }
        } else {
          const err = await response.json().catch(() => ({}));
          setStatus("failed");
          setErrorMsg(err.error || "Verification failed");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("failed");
        setErrorMsg(err.message || "Network error");
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-[#070a13] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin mb-6" />
        <h2 className="text-2xl font-heading font-black uppercase tracking-tight">
          Verifying Payment
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Connecting to eSewa to confirm your superchat...
        </p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-[#070a13] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-3xl mb-6 shadow-xl">
          ❌
        </div>
        <h1 className="text-3xl font-heading font-black uppercase text-red-400">
          Payment Not Completed
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-sm">
          {errorMsg || "The transaction could not be verified with eSewa."}
        </p>
        <button
          onClick={() => router.back()}
          className="mt-8 bg-red-500 hover:bg-red-600 text-white px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070a13] text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-[#0c1220]/90 backdrop-blur-2xl border border-white/[0.08] p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-4xl mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
          🎉
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Payment Verified
          </span>
          <h1 className="text-3xl font-heading font-black uppercase tracking-tight text-white mt-3">
            SuperChat Sent!
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Your message and alert have been sent to the streamer&apos;s live broadcast!
          </p>
        </div>

        <div className="pt-2 space-y-3">
          {streamerRef.current ? (
            <button
              onClick={() => router.push(`/donate/${streamerRef.current}`)}
              className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 text-black py-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.02] shadow-xl shadow-orange-500/20"
            >
              Support More
            </button>
          ) : (
            <Link
              href="/"
              className="block w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 text-black py-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.02] shadow-xl shadow-orange-500/20"
            >
              Back to Home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DonateSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070a13] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin mb-4" />
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
            Loading Confirmation...
          </p>
        </div>
      }
    >
      <DonateSuccessContent />
    </Suspense>
  );
}
