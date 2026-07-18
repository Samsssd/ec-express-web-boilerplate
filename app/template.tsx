import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCurrentUser } from "@/lib/supabase/auth";

// Unlike a layout, a template receives a fresh Server Component render on
// navigation. The visual auth shell therefore cannot retain a stale user label.
export default async function AppTemplate({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const user = await getCurrentUser();
  const fullName = user?.user_metadata?.full_name;
  const userLabel =
    typeof fullName === "string" && fullName.trim() ? fullName : user?.email ?? null;

  return (
    <>
      <Header userLabel={userLabel} />
      {children}
      <Footer userLabel={userLabel} />
    </>
  );
}
