# ec-express-web-boilerplate

Boilerplate for **Excelsior Express** web builds. It is the baked starting
point of every express-generated app: the express agent only generates the
design layer (globals.css theme, landing page, header/footer shell) on top,
and OpenCode edits the app live afterwards, guided by [AGENTS.md](AGENTS.md).

Pre-wired (deterministic, no secrets in the app):

- **Auth** — Supabase cookie SSR (`@supabase/ssr`): `lib/supabase/{client,server}.ts`,
  preview-safe cookie options, `middleware.ts`, a navigation-fresh auth template,
  `/auth` page + `app/actions/auth.ts` (signIn/signUp/signOut).
- **Payments** — hosted Stripe Checkout through the platform proxy
  (`lib/payments/checkout.ts`); the app never holds a Stripe key.
- **Storage** — S3 presigned-ticket uploads through the platform proxy
  (`lib/storage/*`, `app/actions/upload.ts`); no AWS credentials in the app.
- **AI** — streaming chat through the platform proxy (`lib/ai/client.ts`,
  `app/api/chat/route.ts`); alias-based models, no provider key.
- **DB migrations** — `supabase/migrations/` workflow applied by the platform
  (see AGENTS.md § Base de données).
- **Design tokens** — `app/globals.css` token contract that the generated
  design redefines and every pre-baked page inherits.

Runtime env (injected by the platform as `.env.local`):
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`NEXT_PUBLIC_APP_ID`, `PAYMENTS_API_URL/TOKEN`, `STORAGE_API_URL/TOKEN`,
`AI_API_URL/TOKEN`, `NEXT_PUBLIC_APP_URL`. Embedded previews additionally receive
`NEXT_PUBLIC_EMBEDDED_PREVIEW=true`; production deployments do not.

```bash
npm install
npm run dev
```
