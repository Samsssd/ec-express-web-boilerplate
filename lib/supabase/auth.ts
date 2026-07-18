import type { AuthError, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

const SIGNED_OUT_ERROR_NAMES = new Set(["AuthSessionMissingError"]);
const SIGNED_OUT_ERROR_CODES = new Set([
  "session_not_found",
  "refresh_token_not_found",
  "refresh_token_already_used",
  "bad_jwt",
]);

function isSignedOutError(error: AuthError): boolean {
  return (
    SIGNED_OUT_ERROR_NAMES.has(error.name) ||
    SIGNED_OUT_ERROR_CODES.has(error.code || "") ||
    error.status === 400 ||
    error.status === 401 ||
    error.status === 403
  );
}

/**
 * Returns null only for a confirmed missing/invalid session. A transient
 * Supabase failure is surfaced instead of being misreported as a logout.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (!error) return data.user;
  if (isSignedOutError(error)) return null;

  console.error("[supabase-auth] Session validation failed", {
    name: error.name,
    code: error.code,
    status: error.status,
  });
  throw new Error("Le service d’authentification est temporairement indisponible.");
}
