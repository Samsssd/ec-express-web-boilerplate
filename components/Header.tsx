import Link from "next/link";
import { signOut } from "@/app/actions/auth";

export function Header({ userLabel }: { userLabel: string | null }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          className="min-w-0 truncate text-base font-bold tracking-tight text-foreground no-underline"
          href="/"
        >
          Mon application
        </Link>
        <nav className="ml-auto hidden items-center md:flex" aria-label="Navigation principale">
          <Link
            className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-muted-foreground no-underline transition-colors hover:bg-muted hover:text-foreground"
            href="/"
          >
            Accueil
          </Link>
        </nav>
        {userLabel === null ? (
          <Link
            className="ml-auto inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground no-underline transition-opacity hover:opacity-85 md:ml-2"
            href="/auth"
          >
            Se connecter
          </Link>
        ) : (
          <div className="ml-auto flex min-w-0 items-center gap-2 md:ml-2">
            <span className="hidden max-w-40 truncate text-sm font-medium text-foreground sm:block" title={userLabel}>
              {userLabel}
            </span>
            <form action={signOut} className="shrink-0">
              <button
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                type="submit"
              >
                Déconnexion
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
