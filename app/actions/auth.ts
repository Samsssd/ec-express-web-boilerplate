"use server";

// ─────────────────────────────────────────────────────────────────────────────
// AUTH SERVER ACTIONS — pre-baked, follow the platform auth contract exactly.
//
// signIn / signUp are useActionState REDUCERS: (prevState, formData) => state.
// Sessions live in cookies (@supabase/ssr) — no client auth store, no
// AuthProvider, no email-confirmation step (disabled on the shared project:
// signUp() returns an active session immediately).
//
// The profile row lives in the app-scoped `${NEXT_PUBLIC_APP_ID}_users` table.
// On a fresh app that table may not exist yet (no migration has created it);
// the upsert tolerates ONLY that case. Once you add the users migration
// (see AGENTS.md), the upsert becomes authoritative.
// ─────────────────────────────────────────────────────────────────────────────

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error: string } | null;

const USERS_TABLE = `${process.env.NEXT_PUBLIC_APP_ID || "app"}_users`;

/** Table-missing errors (migration not applied yet) — the only tolerated upsert failure. */
const MISSING_TABLE_CODES = new Set(["42P01", "PGRST205", "PGRST204", "PGRST202"]);

type ServerClient = Awaited<ReturnType<typeof createClient>>;

async function upsertProfile(
  supabase: ServerClient,
  user: User,
  fullName?: string,
): Promise<string | null> {
  const { error } = await supabase.from(USERS_TABLE).upsert(
    {
      id: user.id,
      email: user.email,
      ...(fullName ? { full_name: fullName } : {}),
    },
    { onConflict: "id" }
  );
  if (error && !MISSING_TABLE_CODES.has(error.code ?? "")) return error.message;
  return null;
}

export async function signIn(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!email || !password) return { error: "Renseignez votre e-mail et votre mot de passe." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  if (!data.user || !data.session) return { error: "La session n’a pas pu être créée." };

  const profileError = await upsertProfile(supabase, data.user);
  if (profileError) return { error: profileError };

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signUp(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("full_name") || "").trim();
  if (!email || !password) return { error: "Renseignez votre e-mail et votre mot de passe." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: fullName ? { data: { full_name: fullName } } : undefined,
  });
  if (error) return { error: error.message };

  // Email confirmation is OFF, so a session is active now. Belt-and-suspenders:
  // if it is unexpectedly missing, sign in directly — never show an email step.
  let activeUser = data.user;
  if (!data.session || !activeUser) {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) return { error: signInError.message };
    if (!signInData.user || !signInData.session) return { error: "La session n’a pas pu être créée." };
    activeUser = signInData.user;
  }

  const profileError = await upsertProfile(supabase, activeUser, fullName || undefined);
  if (profileError) return { error: profileError };

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error("La déconnexion a échoué. Veuillez réessayer.");
  revalidatePath("/", "layout");
  redirect("/auth");
}
