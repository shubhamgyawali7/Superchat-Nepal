// ─── Shared Utility Functions ────────────────────────────────────────────────

// ── Currency ──────────────────────────────────────────────────────────────────

/**
 * Format a number as Nepali Rupees.
 * e.g. 1500 → "Rs. 1,500"
 */
export function formatNPR(amount) {
  if (amount === null || amount === undefined) return "Rs. 0";
  return `Rs. ${Number(amount).toLocaleString("en-NP")}`;
}

/**
 * Convert NPR to paisa (for Khalti API).
 * e.g. 150 → 15000
 */
export function toPaisa(amountInNPR) {
  return Math.round(Number(amountInNPR) * 100);
}

// ── Date & Time ───────────────────────────────────────────────────────────────

/**
 * Format a UTC timestamp to a readable Nepali date string.
 * e.g. "2024-01-15T10:30:00Z" → "Jan 15, 2024 · 4:15 PM"
 */
export function formatDate(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }) + " · " + date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Get a relative time string.
 * e.g. "2 minutes ago", "just now"
 */
export function timeAgo(isoString) {
  if (!isoString) return "";
  const seconds = Math.floor((Date.now() - new Date(isoString)) / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return formatDate(isoString);
}

// ── Validation ────────────────────────────────────────────────────────────────

/**
 * Validate a donation amount.
 * Minimum is Rs. 10, maximum is Rs. 100,000.
 */
export function validateAmount(amount) {
  const num = Number(amount);
  if (isNaN(num) || num <= 0) return "Please enter a valid amount.";
  if (num < 10) return "Minimum donation is Rs. 10.";
  if (num > 100000) return "Maximum donation is Rs. 1,00,000.";
  return null; // valid
}

/**
 * Sanitize a display name — strip HTML tags and trim.
 */
export function sanitizeName(name) {
  if (!name) return "Anonymous";
  return name.replace(/<[^>]*>/g, "").trim().slice(0, 50);
}

// ── URL & Route Helpers ───────────────────────────────────────────────────────

/**
 * Build the public donation page URL for a streamer.
 * e.g. getDonationUrl("bikash") → "http://localhost:3000/donate/bikash"
 */
export function getDonationUrl(username) {
  const base = process.env.NEXT_PUBLIC_CLIENT_URL || window.location.origin;
  return `${base}/donate/${username}`;
}

/**
 * Build the OBS overlay URL for a streamer.
 * e.g. getOverlayUrl("bikash") → "http://localhost:3000/overlay/bikash"
 */
export function getOverlayUrl(username) {
  const base = process.env.NEXT_PUBLIC_CLIENT_URL || window.location.origin;
  return `${base}/overlay/${username}`;
}

// ── Misc ──────────────────────────────────────────────────────────────────────

/**
 * Copy text to clipboard and return a success boolean.
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate initials from a display name for avatar fallback.
 * e.g. "Bikash Thapa" → "BT"
 */
export function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Truncate a long message for display in a list.
 */
export function truncate(str, maxLength = 60) {
  if (!str) return "";
  return str.length > maxLength ? str.slice(0, maxLength) + "…" : str;
}