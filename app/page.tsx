// Placeholder landing — replaced by the generated design. Kept minimal and
// styled only with the design tokens so the boilerplate stands alone.

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
        Votre application arrive
      </span>
      <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-foreground">
        Cette page sera bientôt remplacée par votre design.
      </h1>
      <p className="max-w-md text-base leading-7 text-muted-foreground">
        L&apos;agent génère votre page d&apos;accueil et votre identité visuelle. En attendant,
        l&apos;authentification est déjà prête.
      </p>
      <Link
        href="/auth"
        className="rounded-[calc(var(--radius)*0.75)] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
      >
        Se connecter
      </Link>
    </main>
  );
}
