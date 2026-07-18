import Link from "next/link";
import { signOut } from "@/app/actions/auth";

const YEAR = new Date().getFullYear();

export function Footer({ userLabel }: { userLabel: string | null }) {
  return (
    <footer className="mt-auto border-t border-border bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <Link className="text-base font-bold tracking-tight text-foreground no-underline" href="/">
            Mon application
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">Application générée avec Excelsior</p>
        </div>
        {userLabel === null ? (
          <Link className="text-sm font-semibold text-foreground no-underline hover:opacity-70" href="/auth">
            Se connecter
          </Link>
        ) : (
          <div className="flex max-w-full flex-wrap items-center gap-3">
            <span className="max-w-56 truncate text-sm font-medium text-foreground" title={userLabel}>
              {userLabel}
            </span>
            <form action={signOut}>
              <button className="text-sm font-semibold text-foreground hover:opacity-70" type="submit">
                Déconnexion
              </button>
            </form>
          </div>
        )}
        <p className="text-sm text-muted-foreground">© {YEAR} Mon application</p>
      </div>
    </footer>
  );
}
