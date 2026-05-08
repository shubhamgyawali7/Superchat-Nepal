"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";

export default function DonateSuccessPage() {
  const [status, setStatus] = useState("checking"); // checking | completed | failed
  const [errorMsg, setErrorMsg] = useState("");
  const [donateData, setDonateData] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const username = params.username;

  useEffect(() => {
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
          /** result = {
           * success: true,
                message: "Donation verified and alert triggered",
                donation: {
                  name: donation.supporter_name,
                  amount: donation.amount,
                  streamer: streamerUsername
                }
           * **/
          if (result.success) {
            setDonateData(result.donation);
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
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 selection:bg-orange-500/30">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full blur-[180px] opacity-20 bg-orange-500/10 animate-pulse"></div>
        </div>

        <div className="relative z-10 w-full max-w-lg text-center space-y-12">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-20 scale-150 animate-pulse"></div>
            <div className="w-20 h-20 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mx-auto shadow-2xl"></div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-heading font-black tracking-tight uppercase">Verifying Transaction</h2>
            <p className="text-lg text-text-muted font-medium opacity-70 animate-pulse">
              Connecting to payment gateway...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 selection:bg-red-500/30">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full blur-[180px] opacity-20 bg-red-500/20"></div>
        </div>

        <div className="relative z-10 w-full max-w-lg text-center space-y-10">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-red-500 blur-3xl opacity-20 scale-150 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-red-500/10 border-2 border-red-500/30 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-heading font-black tracking-tight leading-none uppercase">
              Payment <span className="text-red-500">Failed</span>
            </h1>
            <p className="text-lg text-text-muted font-medium opacity-70">
              {errorMsg || "We couldn't verify your transaction with the payment gateway."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="bg-red-500 text-white px-10 py-5 rounded-2xl text-base font-black uppercase tracking-widest hover:bg-red-600 transition-all hover:scale-105 shadow-xl shadow-red-500/10"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push(`/donate/${username}`)}
              className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl text-base font-black uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 selection:bg-orange-500/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full blur-[180px] opacity-20 animate-pulse bg-emerald-500/30"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg text-center space-y-10">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 scale-150 animate-pulse"></div>
          <div className="relative w-24 h-24 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-2xl">
            <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-heading font-black tracking-tight leading-none uppercase">
            Donation <span className="text-emerald-500">Successful!</span>
          </h1>
          <p className="text-lg text-text-muted font-medium opacity-70">
            Your support has been sent and will appear on stream instantly.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-xs font-black uppercase tracking-widest text-text-muted opacity-50">Supporter</span>
              <span className="text-base font-bold">{donateData?.name || "Supporter"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-text-muted opacity-50">Amount Sent</span>
              <span className="text-2xl font-black text-emerald-500">रू {donateData?.amount || "0"}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push(`/donate/${username}`)}
            className="bg-white text-black px-10 py-5 rounded-2xl text-base font-black uppercase tracking-widest hover:bg-white/90 transition-all hover:scale-105 shadow-xl shadow-white/5"
          >
            Support More
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl text-base font-black uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            Go Home
          </button>
        </div>

        <p className="text-[11px] font-black text-text-muted/30 uppercase tracking-[0.4em] pt-8">
          Transaction Reference: {Math.random().toString(36).substring(7).toUpperCase()}
        </p>
      </div>
    </div>
  );
}
