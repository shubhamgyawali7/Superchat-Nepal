const KHALTI_BASE_URL =
  process.env.KHALTI_GATEWAY_URL || "https://dev.khalti.com/api/v2";

// Default Sandbox Secret Key for Khalti ePayment v2
const KHALTI_SECRET_KEY =
  process.env.KHALTI_SECRET_KEY || "live_secret_key_489d2a11419c443f9092b8e87d7a7a9c";

/**
 * Initiates a Khalti ePayment (v2)
 * Docs: https://docs.khalti.com/khalti-epayment/
 */
export async function initiateKhaltiPayment({
  returnUrl,
  websiteUrl,
  amountInPaisa,
  purchaseOrderId,
  purchaseOrderName,
  customerInfo = {},
}) {
  const url = `${KHALTI_BASE_URL}/epayment/initiate/`;

  const payload = {
    return_url: returnUrl,
    website_url: websiteUrl,
    amount: amountInPaisa,
    purchase_order_id: purchaseOrderId,
    purchase_order_name: purchaseOrderName || "Superchat Donation",
    customer_info: {
      name: customerInfo.name || "Superchat Supporter",
      email: customerInfo.email || "support@superchatnepal.com",
      phone: customerInfo.phone || "9800000000",
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Key ${KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg =
      data.detail ||
      (typeof data === "object" ? JSON.stringify(data) : "Khalti initiate error");
    throw new Error(`Khalti API Error (${response.status}): ${errorMsg}`);
  }

  return data; // { pidx, payment_url, expires_at, expires_in }
}

/**
 * Verifies/looks up a Khalti payment by pidx
 */
export async function verifyKhaltiPayment(pidx) {
  const url = `${KHALTI_BASE_URL}/epayment/lookup/`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Key ${KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pidx }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg =
      data.detail ||
      (typeof data === "object" ? JSON.stringify(data) : "Khalti lookup error");
    throw new Error(`Khalti Lookup Error (${response.status}): ${errorMsg}`);
  }

  return data; // { pidx, total_amount, status, transaction_id, fee, refunded }
}

