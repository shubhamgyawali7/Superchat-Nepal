"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/common/Icon";
import { CheckmarkCircle01Icon, Alert01Icon } from "@hugeicons/core-free-icons";

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
      const pidxParam = searchParams.get("pidx");
      const khaltiStatus = searchParams.get("status");
      const purchaseOrderId = searchParams.get("purchase_order_id");

      // Handle user cancellation on Khalti
      if (khaltiStatus && khaltiStatus.toLowerCase().includes("cancel")) {
        setStatus("failed");
        setErrorMsg("Payment was canceled on Khalti.");
        return;
      }

      // 1. Khalti verification
      if (pidxParam) {
        try {
          const response = await fetch("/api/donations/verify-khalti", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pidx: pidxParam,
              purchase_order_id: purchaseOrderId,
            }),
          });

          const result = await response.json().catch(() => ({}));
          if (response.ok && result.success) {
            if (result.donation?.streamer) {
              streamerRef.current = result.donation.streamer;
            }
            setStatus("completed");
            sessionStorage.removeItem("pending_donation_id");
          } else {
            setStatus("failed");
            setErrorMsg(result.message || result.error || "Khalti verification failed");
          }
        } catch (err) {
          console.error("Khalti verification error:", err);
          setStatus("failed");
          setErrorMsg(err.message || "Network error while verifying Khalti");
        }
        return;
      }

      // 2. eSewa verification
      if (dataParam) {
        try {
          const response = await fetch("/api/donations/verify-esewa", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: dataParam }),
          });

          if (response.ok) {
            const result = await response.json().catch(() => ({}));
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
        return;
      }

      const donationId = typeof window !== "undefined" ? sessionStorage.getItem("pending_donation_id") : null;
      if (!donationId) {
        setStatus("completed");
        return;
      }
      setStatus("failed");
      setErrorMsg("No payment data received from gateway.");
    };

    verifyPayment();
  }, [searchParams]);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center selection:bg-violet-900">
        <div className="w-12 h-12 rounded-full border-2 border-zinc-700 border-t-violet-500 animate-spin mb-6" />
        <h2 className="text-xl font-heading font-black uppercase tracking-tight text-white">
          Verifying Payment
        </h2>
        <p className="text-xs text-zinc-400 mt-2">
          Connecting to payment gateway to confirm your superchat...
        </p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center selection:bg-zinc-800">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-400 mb-6 mx-auto">
          <Icon icon={Alert01Icon} size={28} />
        </div>
        <h1 className="text-2xl font-heading font-black uppercase text-red-400">
          Payment Not Completed
        </h1>
        <p className="text-xs text-zinc-400 mt-2 max-w-sm mx-auto">
          {errorMsg || "The transaction could not be verified."}
        </p>
        <button
          onClick={() => router.back()}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center selection:bg-zinc-800">
      <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 mb-6 mx-auto">
        <Icon icon={CheckmarkCircle01Icon} size={28} />
      </div>

      <h1 className="text-3xl font-heading font-black uppercase text-white">
        Donation Verified
      </h1>
      <p className="text-xs text-zinc-400 mt-2 max-w-sm mx-auto">
        Your superchat has been confirmed and delivered to the stream overlay.
      </p>

      <div className="flex items-center gap-3 mt-8">
        {streamerRef.current ? (
          <Link
            href={`/donate/${streamerRef.current}`}
            className="bg-white hover:bg-zinc-200 text-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-colors"
          >
            Send Another
          </Link>
        ) : null}
        <Link
          href="/"
          className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default function DonateSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
          <div className="w-12 h-12 rounded-full border-2 border-zinc-700 border-t-violet-500 animate-spin" />
        </div>
      }
    >
      <DonateSuccessContent />
    </Suspense>
  );
}
