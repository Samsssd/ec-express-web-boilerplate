# Migrations

Schema changes live here as ordered SQL files: `NNNN_slug.sql` (e.g.
`0001_users.sql`, `0002_orders.sql`). The Excelsior platform applies new files
automatically after each editing turn — never run SQL yourself, and never edit
a file that has already been applied (create a new one instead).

Every table name MUST be prefixed with the app id (`<NEXT_PUBLIC_APP_ID>_`),
every table needs `ENABLE ROW LEVEL SECURITY` + policies + `GRANT` in the same
file, and all DDL must be idempotent. See AGENTS.md (§ Base de données) for the
full contract and a canonical first migration.
