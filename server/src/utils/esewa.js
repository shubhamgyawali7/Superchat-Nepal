import crypto from "crypto";

/**
 * Generate HMAC SHA256 hash for eSewa signature
 */
export const generateEsewaSignature = (data) => {
  const SECRET_KEY = process.env.ESEWA_SECRET_KEY;

  if (!data || !SECRET_KEY) {
    throw new Error("Missing data or eSewa secret key for signature generation.");
  }

  return crypto
    .createHmac("sha256", SECRET_KEY)
    .update(data)
    .digest("base64");
};

export const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";

/**
 * Verify eSewa payment status
 */
export const verifyEsewaStatus = async ({ amount, transaction_uuid }) => {
  const ESEWA_MERCHANT_ID = ESEWA_PRODUCT_CODE;
  const ESEWA_STATUS_URL = process.env.ESEWA_STATUS_URL || "https://rc-epay.esewa.com.np/api/epay/transaction/status/";

  try {
    const cleanAmount = parseFloat(String(amount).replace(/,/g, '')).toString();

    const statusUrl = `${ESEWA_STATUS_URL}?product_code=${ESEWA_MERCHANT_ID}&total_amount=${cleanAmount}&transaction_uuid=${transaction_uuid}`;

    console.log("[ESEWA-UTILS] Checking status via:", statusUrl);

    const response = await fetch(statusUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[ESEWA-UTILS] API Error Response:", errorText);
      console.error("[ESEWA-UTILS] Status Code:", response.status);
      throw new Error(`eSewa API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("[ESEWA-UTILS] Status response:", data);

    return data;
  } catch (error) {
    console.error("[ESEWA-UTILS] Status check failed:", error.message);
    throw error;
  }
};
