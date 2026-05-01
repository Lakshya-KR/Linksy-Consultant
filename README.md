# Linksy Studio — Client Project Intake & Management

A black-and-white, 3D-animated agency website with a four-step proposal form, a live client dashboard, and an admin control panel. Free-tier infra throughout.

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind v4 · shadcn-style components · React Three Fiber · Framer Motion · Supabase (Postgres + Auth + Realtime) · Nodemailer (Gmail SMTP) · Vercel.

---

## Quick start (10 minutes)

### 1 · Clone & install

```bash
npm install
cp .env.local.example .env.local
```

### 2 · Supabase

1. Sign up free at [supabase.com](https://supabase.com), create a new project (any region).
2. Go to **Project Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`
3. Open the **SQL Editor**, click **New query**, paste the contents of `supabase/migrations/0001_init.sql`, click **Run**.
4. Go to **Authentication → Providers**, ensure **Email** is enabled. (For dev, you can disable email confirmation under **Auth → Settings**.)

### 3 · Email notifications (free)

Gmail SMTP via app password — no signup beyond your existing Gmail.

1. Enable 2-Step Verification on the Gmail you'll send from.
2. Visit [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords), generate a 16-character app password.
3. In `.env.local`:
   - `GMAIL_USER` — that Gmail address
   - `GMAIL_APP_PASSWORD` — the 16-char password (with spaces or without — both work)
   - `ADMIN_EMAIL` — where notifications go (often the same as `GMAIL_USER`)

### 4 · Admin contact (for dashboard deep links)

In `.env.local`:
- `ADMIN_PHONE` — your number in E.164 *without* the `+` (e.g. `919876543210`). Used to build `wa.me` and `tel:` links on the client `/dashboard/contact` page.

> **No WhatsApp API needed.** Notifications go via email. Each email contains one-tap reply buttons (WhatsApp, call, email) that open the right app prefilled with the client's number. Zero credentials, zero rate limits.

### 5 · Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## First admin user

Supabase signup creates clients by default. To make yourself an admin:

1. Sign up via the website at `/signup`.
2. In Supabase Studio → **Table Editor → profiles**, find your row.
3. Change `role` from `client` to `admin`.
4. Refresh the site — the **Dashboard** button now routes to `/admin`.

---

## Architecture

```
app/
├── (marketing)/        Landing page (3D hero, services, process, contact)
├── (auth)/             Login, signup
├── propose/            4-step proposal form (scope → timeline → budget → review)
├── dashboard/          Client area: overview (realtime), contact, history
├── admin/              Admin: inbox, projects, project detail, clients
└── api/notify/         Notification dispatch (email + WhatsApp)

components/
├── ui/                 shadcn-style primitives (Button, Card, Input, Badge…)
├── three/              R3F scenes (HeroScene, BackgroundScene)
├── form/               Proposal form orchestration
├── landing/            ServiceGrid, ProcessSteps
├── dashboard/          Sidebar, StatusBadge, ProjectsRealtime
└── admin/              StatusSelect, PriceEditor, TaskBoard, PaymentForm

lib/
├── supabase/           Browser, server, middleware Supabase clients
├── notifications/      Email (nodemailer Gmail SMTP)
├── schemas/            Zod validation
├── types.ts            Shared TS types
└── utils.ts            cn(), formatCurrency, formatDate, timeAgo

supabase/migrations/    SQL schema + RLS + triggers
middleware.ts           Auth gate + admin role check
```

---

## Verifying the full loop

End-to-end test after setup:

1. Sign up at `/signup` → land on `/dashboard` (empty state).
2. Click **New project** → walk through `/propose/scope → timeline → budget → review` → submit.
3. Confirm two things:
   - **Email arrives** at `ADMIN_EMAIL` with the project brief and one-tap reply buttons (WhatsApp / Call / Email) pointed at the client's contact value.
   - **`/dashboard`** shows the new project with `Pending review` status.
4. Promote your row to `admin` (see above) → open `/admin` → see the proposal in the inbox.
5. Click into the project → change status to `Accepted`, set an agreed price, add a task → the client `/dashboard` updates **without refresh** (Supabase Realtime).
6. Click WhatsApp/Call/Email buttons in admin to verify deep links open with prefilled content.

---

## Deploying to Vercel

1. **Push to GitHub.** `git init`, `git add .`, `git commit -m "initial"`, `git push origin main`.
2. **Import the repo** at [vercel.com/new](https://vercel.com/new) — Vercel auto-detects Next.js.
3. **Paste env vars.** Open `.env.production.example`, paste every key into Vercel → **Project → Settings → Environment Variables**.
   - The Supabase URL/keys are the *same* as dev (Supabase doesn't have separate prod projects unless you make one).
   - Leave `NEXT_PUBLIC_SITE_URL` unset until you have a custom domain — the app falls back to the auto-assigned `VERCEL_URL` automatically.
4. **Deploy.** Vercel builds with `npm run build` (which uses our 8 GB Node heap script — Turbopack workers can OOM at default).
5. **Post-deploy in Supabase** — go to **Authentication → URL Configuration → Site URL & Redirect URLs**, add your `https://*.vercel.app` URL (and your custom domain when added) so auth emails redirect back correctly.

### Custom domain

When you add a domain in Vercel, also:
- Update `NEXT_PUBLIC_SITE_URL` in Vercel env to `https://yourdomain.com`.
- Re-deploy (Vercel does this automatically when env changes).
- Add the custom domain to Supabase's Redirect URLs list.

---

## What's intentionally out of scope (v2 candidates)

- **Engineer panel** — third role with project assignment (deferred per plan).
- **Two-way WhatsApp chat** — currently outbound notifications only.
- **Stripe / Razorpay** — payments are admin-logged manually right now.
- **File uploads** — Supabase Storage hookup for client deliverables.
- **Email confirmations to client on status changes** — only admin gets pings today.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Build fails on `dynamic({ ssr: false })` | All R3F is wrapped in `*Client.tsx` files — keep that pattern. |
| Notifications don't fire locally | The `/api/notify` route uses `NEXT_PUBLIC_SITE_URL`. In dev it falls back to `http://localhost:3000`. |
| Realtime updates don't appear | Verify `alter publication supabase_realtime add table public.projects` ran (in `0001_init.sql`). |
| `Forbidden` from admin actions | Your profile's `role` must be `admin` in the `profiles` table. |
| Client can see other clients' data | Re-run `0001_init.sql` (it's idempotent). RLS policies must exist. |
| Email not arriving | Check Gmail account hasn't been flagged for SMTP. Test with `npm run dev` then submit a proposal — server logs will show success/failure. App password must come from a 2FA-enabled Google account. |
