"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_COOKIE_OPTIONS } from "@/lib/supabase/cookie-options";

// Browser Supabase client. Session is stored in cookies (shared with the
// server) by @supabase/ssr, so RSC, Server Actions and the middleware all see
// the same auth state. Use ONLY in "use client" components.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookieOptions: SUPABASE_COOKIE_OPTIONS },
  );
}
