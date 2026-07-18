// Every Supabase client must use the exact same cookie name and attributes.
// Embedded previews are cross-site iframes, so their cookies must explicitly opt
// into that context. `Partitioned` keeps the session scoped to the builder site.
const embeddedPreview = process.env.NEXT_PUBLIC_EMBEDDED_PREVIEW === "true";
const appId = (process.env.NEXT_PUBLIC_APP_ID || "app").replace(/[^a-zA-Z0-9_-]/g, "_");

export const SUPABASE_COOKIE_OPTIONS = {
  name: `sb-${appId}-auth-token`,
  path: "/",
  sameSite: embeddedPreview ? ("none" as const) : ("lax" as const),
  secure: embeddedPreview || process.env.NODE_ENV === "production",
  ...(embeddedPreview ? { partitioned: true } : {}),
};
