// ─────────────────────────────────────────────────────────────────────────────
// AUTH PAGE — pre-baked Server Component. A signed-in user is bounced home;
// everyone else gets the sign-in / sign-up island. Styled only with the
// design tokens from app/globals.css so a redesign restyles it automatically.
// ─────────────────────────────────────────────────────────────────────────────

import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AuthForm } from "@/components/auth-form";

export default async function AuthPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-4 py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <Link href="/" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
          ← Retour à l&apos;accueil
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Bienvenue</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Connectez-vous ou créez un compte pour continuer.
        </p>
      </div>
      <AuthForm />
    </main>
  );
}
