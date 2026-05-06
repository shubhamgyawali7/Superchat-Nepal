import { createBrowserClient } from "@supabase/ssr";

// ─── Supabase Browser Client ─────────────────────────────────────────────────
// Use this in Client Components ("use client") for auth listeners,
// real-time subscriptions, and direct table queries.
//
// For Server Components or API routes, use createServerClient instead.

let client = null;

export function getSupabaseBrowser() {
  if (client) return client;
  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  return client;
}

export default getSupabaseBrowser;