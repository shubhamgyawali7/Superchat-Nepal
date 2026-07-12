import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";

export const createClient = (req, res) => {
  return createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(req.headers.cookie ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.appendHeader(
              "Set-Cookie",
              serializeCookieHeader(name, value, {
                ...options,
                sameSite: "none",
                secure: true,
                path: "/",
              })
            )
          );
        },
      },
    }
  );
};

export const createAdminClient = () => {
  return createSupabaseClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
};