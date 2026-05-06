// lib/esewa.js
import crypto from "crypto";

const ESEWA_ACCESS_KEY =
    process.env.ESEWA_ACCESS_KEY || "LB0REg8HUSw3MTYrI1s6JTE8Kyc6JyAqJiA3MQ==";
const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || "INTENT";

export function generateSignature(fields) {
    // fields: { product_code, amount, transaction_uuid } or { booking_id, product_code, correlation_id }
    const message = Object.values(fields).join(",");
    // e.g. "product_code=INTENT,amount=100,transaction_uuid=txn-001"
    const formattedMessage = Object.entries(fields)
        .map(([k, v]) => `${k}=${v}`)
        .join(",");

    const hash = crypto
        .createHmac("sha256", ESEWA_ACCESS_KEY)
        .update(formattedMessage)
        .digest("base64");

    return hash;
}

export { ESEWA_PRODUCT_CODE };