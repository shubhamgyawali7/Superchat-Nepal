// app/donate/success/page.js
"use client";
import { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
        const donationId = sessionStorage.getItem("pending_donation_id");

        if (!donationId) {
          setStatus("completed");
          return;
        }
        setStatus("failed");
        setErrorMsg("No payment data received from gateway.");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/donations/verify-esewa`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: dataParam }),
          }
        );

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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4" />
        <p className="text-lg font-medium">Verifying your payment...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl font-bold text-red-500">Payment Failed</p>
        <p className="text-gray-600 mt-2">{errorMsg}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-6 py-2 bg-red-100 text-red-700 rounded-lg font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-3xl font-bold text-green-600">Donation Successful!</p>
      <p className="text-gray-500 mt-2 text-lg">Thank you for your support!</p>
      <button
        onClick={() => router.push(`/donate/${streamerRef.current}`)}
        className="mt-8 px-8 py-3 bg-green-500 hover:bg-green-600 transition-colors text-white rounded-xl font-bold"
      >
        Support More
      </button>
    </div>
  );
}

export default function DonateSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4" />
        <p className="text-lg font-medium">Loading...</p>
      </div>
    }>
      <DonateSuccessContent />
    </Suspense>
  );
}
