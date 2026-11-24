"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Icon from "@/components/common/Icon";
import { CheckmarkCircle01Icon, Alert01Icon } from "@hugeicons/core-free-icons";

function DonateSuccessContent() {
  const [status, setStatus] = useState("checking");
  const [errorMsg, setErrorMsg] = useState("");
  const [donateData, setDonateData] = useState(null);
  const [transactionRef] = useState(() => Math.random().toString(36).substring(7).toUpperCase());
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const username = params.username;

  useEffect(() => {
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

      // 1. Khalti Verification
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
            setDonateData(result.donation);
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

      // 2. eSewa Verification
      if (dataParam) {
        try {
          const response = await fetch("/api/donations/verify-esewa", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: dataParam }),
          });
          const result = await response.json().catch(() => ({}));
          if (response.ok && result.success) {
            setDonateData(result.donation);
            setStatus("completed");
            sessionStorage.removeItem("pending_donation_id");
          } else {
            setStatus("failed");
            setErrorMsg(result.message || result.error || "eSewa verification failed");
          }
        } catch (err) {
          console.error("eSewa verification error:", err);
          setStatus("failed");
          setErrorMsg(err.message || "Network error");
        }
        return;
      }

      // 3. Fallback check
      const donationId = sessionStorage.getItem("pending_donation_id");
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
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-violet-900">
        <div className="w-full max-w-lg text-center space-y-6">
          <div className="w-12 h-12 border-2 border-zinc-700 border-t-violet-500 rounded-full animate-spin mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-heading font-black tracking-tight uppercase text-white">
              Verifying Transaction
            </h2>
            <p className="text-sm text-zinc-400 font-medium">
              Connecting to payment gateway...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-zinc-800">
        <div className="w-full max-w-lg text-center space-y-6">
          <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto text-red-400">
            <Icon icon={Alert01Icon} size={32} />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-heading font-black tracking-tight uppercase text-white">
              Payment <span className="text-red-400">Failed</span>
            </h1>
            <p className="text-sm text-zinc-400 font-medium max-w-md mx-auto">
              {errorMsg || "We couldn't verify your transaction with the payment gateway."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button
              onClick={() => router.back()}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push(`/donate/${username}`)}
              className="bg-zinc-900 border border-zinc-800 text-white px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-zinc-800">
      <div className="w-full max-w-lg text-center space-y-8">
        <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
          <Icon icon={CheckmarkCircle01Icon} size={32} />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight uppercase text-white">
            Donation <span className="text-emerald-400">Successful</span>
          </h1>
          <p className="text-sm text-zinc-400 font-medium max-w-md mx-auto">
            Your support has been sent and will appear on stream instantly.
          </p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Supporter</span>
              <span className="text-sm font-bold text-white">{donateData?.name || "Supporter"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Amount Sent</span>
              <span className="text-2xl font-black text-emerald-400">रू {donateData?.amount || "0"}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push(`/donate/${username}`)}
            className="bg-white hover:bg-zinc-200 text-black px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors"
          >
            Support More
          </button>
          <button
            onClick={() => router.push("/")}
            className="bg-zinc-900 border border-zinc-800 text-white px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-zinc-800 transition-colors"
          >
            Go Home
          </button>
        </div>

        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pt-4">
          Ref: {transactionRef}
        </p>
      </div>
    </div>
  );
}

export default function DonateSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
          <div className="w-12 h-12 border-2 border-zinc-700 border-t-violet-500 rounded-full animate-spin mx-auto" />
        </div>
      }
    >
      <DonateSuccessContent />
    </Suspense>
  );
}
