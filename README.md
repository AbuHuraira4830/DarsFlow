# DarsFlow

DarsFlow is a mobile-first, multi-tenant SaaS MVP for Quran, Arabic and Islamic studies academies. It preserves the public fictional lesson-draft demo and adds private academy workspaces for teachers, students, guardians, classes, lesson history, reviewed communications, subscriptions and platform operations.

## What works

- Email/password accounts with database-backed sessions through Better Auth
- Academy-owner onboarding with timezone and teaching tracks
- Server-scoped academy memberships and owner, manager and teacher roles
- Expiring, single-use academy invitation architecture with copyable links
- Student and guardian records with validated contact details
- One-to-one and small-group class records in the academy timezone
- Persistent individual lesson records and deterministic parent, handover and management drafts
- WhatsApp and email compose links with honest share semantics
- Academy dashboard, lesson history, subscription usage and manual-payment requests
- Restricted platform administration configured by email allowlist
- Public pricing, contact, provisional policy and spam-protected academy access-request pages
- Platform lead review, status history, configurable public support channels and secure owner invitations
- Fictional, idempotent local seed data with no seeded login password

## Local setup

Requires Node.js 20.9 or newer and npm. Docker and external accounts are not required. Local development uses PGlite, a real embedded PostgreSQL engine, stored under `data/darsflow-pg` by default.

```bash
npm install
copy .env.example .env.local
npm run db:setup
npm run dev
```

Generate a secret of at least 32 random characters and place it in `BETTER_AUTH_SECRET` inside `.env.local`. Never commit that file. Open http://localhost:3000.

Database commands:

```bash
npm run db:migrate
npm run db:seed
npm run db:setup
```

Hosted invitation-only pilots set `PILOT_MODE=invitation_only`. Only an unexpired invited email or an email explicitly listed in `PLATFORM_ADMIN_EMAILS` may create an account. Without Resend, invitation links must be copied and shared manually; the production email outbox is inaccessible and the application never claims delivery.

Prospects use `/request-access`; requests are stored as platform-level leads and never create academy records. A platform administrator reviews them at `/platform/leads`, then may generate a seven-day, single-use owner invitation and share it manually. Configure the optional public business name, support email, WhatsApp number and support hours from `/platform`; no contact detail is invented when these fields are blank.

After applying migrations to a new hosted database, run `npm run db:bootstrap:production`. This idempotent command creates only active plan definitions and required platform settings. It creates no academy, person, login credential, or demonstration data.

The seed is safe to rerun. It creates fictional academy, student, guardian, class and configurable plan records. It deliberately creates no user account or predictable password. Register through `/register` to create an owner account and academy.

## Platform administrator

Register normally, then add that account’s email to `PLATFORM_ADMIN_EMAILS` in `.env.local` as a comma-separated allowlist. Restart the server and visit `/platform`. There is no default administrator credential.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
git diff --check
```

## Honest integration boundaries

- The public demo is fictional and not saved.
- Authenticated academy records are saved to the configured database.
- WhatsApp and email actions open another application with prepared content; DarsFlow does not claim delivery.
- Manual-payment requests require platform-admin approval or rejection. No gateway charges a customer.
- Password recovery uses Better Auth’s expiring-token architecture. Until an email provider is configured, no recovery email is claimed as sent.
- No AI, WhatsApp Business, transactional email or payment provider is configured.

## PostgreSQL environments

DarsFlow uses one Drizzle `pg-core` schema and one PostgreSQL migration history. Local development and integration tests use PGlite. Hosted environments use the transaction-capable `postgres` driver with a Neon pooled `DATABASE_URL`; migrations may use a direct `DATABASE_MIGRATION_URL`.

Run `npm run db:migrate` once during a release. Migrations never run during requests. Hosted environments have no SQLite or writable-filesystem fallback. The pre-existing SQLite database and legacy migration history remain preserved but are not read by the application.

## Current limitations

The MVP does not include automatic message delivery, payment-gateway charging, parent accounts, video/calendar integrations, native applications, automated Tajweed analysis or certified compliance claims. Teacher/class assignment management, draft editing/version regeneration and CSV export have schema and authorization foundations but require further interface depth before production rollout.
