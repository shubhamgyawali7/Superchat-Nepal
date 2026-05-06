// ─── Khalti Payment Helper ───────────────────────────────────────────────────
// Handles initiating donations and launching Khalti's payment widget.
//
// Flow:
//   1. Call `initiateDonation()` → creates a pending record in DB → returns donationId
//   2. Call `initiateKhaltiPayment()` → calls Khalti initiate API → gets pidx
//   3. Redirect user to Khalti's hosted checkout page
//   4. Khalti redirects back to your verify endpoint with `pidx` in query params
//   5. Server calls Khalti's lookup API to verify, updates DB, fires Socket.io alert
//
// Docs: https://docs.khalti.com/khalti-epayment/

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

// Khalti initiate endpoint (called server-side for security — see note below)
// In a real app you should NOT call Khalti's API directly from the browser
// because it requires your secret key. Route it through your Express backend.
const KHALTI_INITIATE_URL = `${SERVER_URL}/api/donations/khalti-initiate`;

// ── Step 1: Create pending donation record ────────────────────────────────────
export async function initiateDonation({ streamerUsername, amount, senderName, message }) {
    const res = await fetch(`${SERVER_URL}/api/donations/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ streamerUsername, amount, senderName, message }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to initiate donation");

    return data.donationId;
}

// ── Step 2: Call Khalti initiate API (via your backend) ───────────────────────
// Your backend calls:  POST https://dev.khalti.com/api/v2/epayment/initiate/
// and returns the `pidx` and `payment_url` from Khalti's response.
export async function initiateKhaltiPayment({ donationId, amount, senderName, streamerUsername }) {
    const res = await fetch(KHALTI_INITIATE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            donationId,
            // Khalti expects amount in paisa (1 NPR = 100 paisa)
            amount: Math.round(amount * 100),
            customerName: senderName || "Anonymous",
            streamerUsername,
            returnUrl: `${SERVER_URL}/api/donations/verify-khalti`,
            websiteUrl: window.location.origin,
        }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Khalti initiation failed");

    return data; // { pidx, payment_url }
}

// ── Step 3: Redirect to Khalti checkout ──────────────────────────────────────
export function redirectToKhalti(paymentUrl) {
    window.location.href = paymentUrl;
}

// ── Combined helper: initiate then redirect ───────────────────────────────────
export async function payWithKhalti({ streamerUsername, amount, senderName, message }) {
    // 1. Create DB record
    const donationId = await initiateDonation({ streamerUsername, amount, senderName, message });

    // 2. Get Khalti payment URL from backend
    const { payment_url } = await initiateKhaltiPayment({
        donationId,
        amount,
        senderName,
        streamerUsername,
    });

    // 3. Send user to Khalti
    redirectToKhalti(payment_url);
}

export default payWithKhalti;