import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_COOKIE_OPTIONS } from "@/lib/supabase/cookie-options";

const AUTH_NO_STORE = "private, no-cache, no-store, must-revalidate, max-age=0";

function applyHeaders(response: NextResponse, headers: Record<string, string> = {}) {
  for (const [name, value] of Object.entries(headers)) response.headers.set(name, value);
  response.headers.set("Cache-Control", AUTH_NO_STORE);
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
}

// Refreshes the Supabase auth session (and revalidates the JWT) on every
// request, writing rotated cookies onto the response. Do NOT run other logic
// between createServerClient and getUser (per Supabase guidance).
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: SUPABASE_COOKIE_OPTIONS,
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headersToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          applyHeaders(response, headersToSet);
        },
      },
    },
  );

  const { error } = await supabase.auth.getUser();
  if (error && error.name !== "AuthSessionMissingError") {
    console.warn("[supabase-auth] Middleware session validation failed", {
      name: error.name,
      code: error.code,
      status: error.status,
    });
  }

  applyHeaders(response);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
