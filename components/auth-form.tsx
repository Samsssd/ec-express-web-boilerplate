"use client";

// ─────────────────────────────────────────────────────────────────────────────
// AUTH FORM — pre-baked "use client" island driven by useActionState.
// Wiring contract: `const [state, formAction, pending] = useActionState(action, null)`
// with `<form action={formAction}>` — never wrap the action in an inline async
// handler (it would swallow the returned { error }).
// Styled ONLY with the design tokens from app/globals.css.
// ─────────────────────────────────────────────────────────────────────────────

import { useActionState, useState } from "react";
import { signIn, signUp } from "@/app/actions/auth";

type Mode = "signin" | "signup";

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("signin");
  const [signInState, signInAction, signInPending] = useActionState(signIn, null);
  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, null);

  const isSignIn = mode === "signin";
  const state = isSignIn ? signInState : signUpState;
  const pending = isSignIn ? signInPending : signUpPending;

  return (
    <div className="w-full max-w-md rounded-[var(--radius)] border border-border bg-card p-8 shadow-sm">
      <div className="mb-6 grid grid-cols-2 rounded-[calc(var(--radius)*0.75)] bg-muted p-1 text-sm font-medium">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={`rounded-[calc(var(--radius)*0.6)] px-3 py-2 transition-colors ${
            isSignIn ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          Connexion
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`rounded-[calc(var(--radius)*0.6)] px-3 py-2 transition-colors ${
            !isSignIn ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          Inscription
        </button>
      </div>

      <form action={isSignIn ? signInAction : signUpAction} className="flex flex-col gap-4">
        {!isSignIn && (
          <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
            Nom complet
            <input
              type="text"
              name="full_name"
              autoComplete="name"
              className="rounded-[calc(var(--radius)*0.75)] border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
              placeholder="Votre nom"
            />
          </label>
        )}
        <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
          E-mail
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="rounded-[calc(var(--radius)*0.75)] border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
            placeholder="vous@exemple.fr"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
          Mot de passe
          <input
            type="password"
            name="password"
            required
            minLength={6}
            autoComplete={isSignIn ? "current-password" : "new-password"}
            className="rounded-[calc(var(--radius)*0.75)] border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
            placeholder="••••••••"
          />
        </label>

        {state?.error && (
          <p className="rounded-[calc(var(--radius)*0.75)] bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-1 rounded-[calc(var(--radius)*0.75)] bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Un instant…" : isSignIn ? "Se connecter" : "Créer mon compte"}
        </button>
      </form>
    </div>
  );
}
