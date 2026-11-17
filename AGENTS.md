<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# SalonBook — Salon Appointment Booking Platform (Project Guide)

This guide summarizes the full assignment (`docs/Assignment.pdf`, extracted text cached at
`C:\Users\kader\AppData\Local\Temp\opencode\pdfx\assignment.txt`) and the actual state of both
repositories, so future sessions do not need to re-explore the codebase.

- **Client repo:** `C:\projects\salonbook-client` (this repo) — Next.js frontend
- **Server repo:** `C:\projects\salonbook-sever` (separate repo, separate GitHub repo required)

---

## A. Project Overview

**Purpose:** Customers explore salon services, view details, and request appointments online.
Admins manage services, review/confirm/cancel appointment requests, manage customers, and monitor
payments. Customers pay for **Confirmed** appointments via Stripe Checkout.

**Technology stack (per assignment):**
- Frontend: Next.js (App Router), TypeScript, Tailwind CSS 4, shadcn-style UI (Base UI), Better Auth, Stripe.js/Checkout, ImgBB (image hosting)
- Backend: Node.js, Express 5, MongoDB (driver installed; Mongoose optional), JWT verification middleware, Stripe SDK + webhook
- Deployed as **two separate deployments/repositories**; live site must have no CORS/404/504 issues and survive route reloads.

**Responsibility split:** Client = UI, pages, dashboards, auth session handling, Stripe redirect. Server = all business logic, role checks, JWT verification, MongoDB access, Stripe webhook, payment status updates.

---

## B. Existing Project Architecture

### Client (`salonbook-client`)

```
src/
  app/
    layout.tsx        # Root layout: Geist fonts, ThemeProvider, globals.css
    page.tsx          # Default Next.js starter home page (to be replaced)
    globals.css       # Tailwind 4 + shadcn theme variables
    favicon.ico
  components/
    .gitkeep
    theme-provider.tsx  # next-themes wrapper
    ui/button.tsx       # Only existing shadcn UI component
  hooks/.gitkeep
  lib/
    utils.ts          # cn() helper
```

Config: `next.config.ts` (empty), `tsconfig.json` (uses `@/*` → `src/*`), `components.json`
(shadcn, new-york style, RSC on), Prettier + Tailwind plugin, ESLint 9 (`eslint.config.mjs`).

Scripts: `dev`, `build`, `start`, `lint`, `format`, `typecheck` (`tsc --noEmit`).

**Existing dependencies (client):** `next@16.4.5`, `react@19.3.1`, `@base-ui/react`, `lucide-react`,
`next-themes`, `class-variance-authority`, `cn`, `shadcn`, `tw-animate-css`, Tailwind 4, TS 5.
**Not yet installed:** better-auth, stripe, any HTTP/fetch helper, toast library, icon-of-choice beyond lucide.

**Git state:** 1 commit (`feat: initial commit`); uncommitted restructuring moves `app/`→`src/app/`,
`Docs/`→`docs/` (assignment PDF now at `docs/Assignment.pdf`). Commit this restructuring before
feature work. Next.js 16 has breaking changes vs. training data — check `node_modules/next/dist/docs/` before writing app code.

### Server (`salonbook-sever`)

```
package.json        # name: salonbook-sever, commonjs, no source files yet
package-lock.json
node_modules/
```

**Dependencies:** `express@^5.3.0`, `mongodb@^7.9.0` (raw driver, **not** Mongoose), `cors`, `dotenv`.
**No source code exists** — no `index.js`, no routes, no models, no middleware, no `.env.example`,
and **no git repo initialized yet**.

### Implementation status

| Area | Status |
|---|---|
| Client scaffold (Next 16 + TS + Tailwind + shadcn button) | ✅ Done |
| Public pages (Home, Browse, Details, Sign In/Up) | ❌ Not implemented |
| Dashboards (customer/admin) | ❌ Not implemented |
| Better Auth | ❌ Not installed/implemented |
| Server: any endpoint, JWT middleware, models | ❌ Not implemented |
| Stripe + webhook | ❌ Not implemented |
| ImgBB image upload | ❌ Not implemented |

---

## C. Database Architecture (MongoDB — exactly these four app collections)

Better Auth manages its own auth collections (e.g., `user`, `session`, `account`, `verification`);
do not duplicate that data in a custom collection. Add role/block fields to the Better Auth user
model via its `user.additionalFields` config.

1. **users (Better Auth managed)** — `name`, `email`, `image`, `role` (`customer` | `admin`;
   default `customer`), `isBlocked` (bool, default `false`). Public signup must never create
   admins; role assigned only server-side/securely.
2. **services** — `serviceName`, `category`, `description`, `price` (positive number),
   `duration` (minutes, positive number), `image` (ImgBB URL), `status` (`active` | `inactive`,
   default `active`), `createdAt`. Only `active` services appear publicly and are bookable.
3. **appointments** — `serviceId` → services, `customerId` → users, `appointmentDate`,
   `timeSlot` (from a predefined slot list), `message` (optional), `servicePrice` (snapshot),
   `paymentStatus` (`unpaid` | `paid`, default `unpaid`), `status` (`pending` | `confirmed` |
   `cancelled`, default `pending`), `createdAt`. Unique-active-slot constraint: no duplicate
   active (pending/confirmed) appointment for same service+date+timeSlot.
4. **transactions** — `appointmentId` → appointments, `customerId` → users, `amount`, `currency`,
   `stripeSessionId`, `status` (`paid` | `failed`), `createdAt`. Created/updated **only** by the
   verified Stripe webhook; admin UI is read-only for transactions.

Relationships: appointments reference serviceId+customerId; transactions reference appointmentId+customerId.

---

## D. Authentication and Authorization

- **Better Auth** on the Next.js client (email/password + Google OAuth; secret/config in env vars).
  Sign-up fields: Full Name, Email, Password (min 6 chars, ≥1 uppercase, ≥1 lowercase), Profile
  Image (upload or URL). Admin accounts must never be creatable via public registration.
- **JWT verification middleware on the Express backend** (challenge requirement #2): protected
  server routes verify the Better Auth-issued JWT/session token and extract role.
- **Server-side role verification on every protected API** — hiding UI links is not sufficient.
- **Client route protection:** all `/dashboard/*` routes; role-based (customer vs admin); users
  typing another role's dashboard URL must be denied; unauthenticated users redirected to Sign In.
- **Blocked users** cannot access any protected platform feature (enforce server-side too).
- After login, redirect by role (customer → customer dashboard, admin → admin dashboard).
- Navbar/profile dropdown must update immediately on auth state change.

---

## E. Application Features

### Public website
- **Navbar:** "SalonBook" logo/name; public links (Home, Browse Services, Sign In, Sign Up);
  authenticated links (Home, Salon Details, Dashboard by role); profile dropdown (User Name,
  Dashboard, Logout).
- **Footer:** logo + short description, important nav links, contact info, address + opening
  hours, social links, copyright.
- **Home:** banner (title, short description, "Explore Salon Services" CTA, salon background
  image); Featured Services (≥6 active services from DB with image, name, category, price,
  duration, short description, View Details); Service Categories section (Haircut & Styling, Hair
  Coloring, Hair Treatment, Facial & Skincare, Makeup, Manicure & Pedicure, Spa & Massage) with
  category exploration; +1 extra self-designed section.
- **Browse Services:** public; responsive cards of active services; **search by name**,
  **category filter**, **sort by price** (challenge requirements).
- **Service Details `/services/[id]`:** protected (redirect to Sign In); full service info +
  booking option; invalid ID → appropriate error; only active services bookable; admins cannot
  submit appointment requests.

### Customer dashboard (sidebar layout)
- **Overview:** total requests, pending, confirmed, cancelled counts.
- **My Appointments:** own appointments only (service name/image/category, date, time, price,
  appointment status, payment status, request date); view details; cancel **pending** only; pay
  **confirmed** only (Pay Now → Stripe Checkout).
- **My Profile:** update name, profile image, phone/other basic info; never own role/blocked
  status; never another user's profile.

### Admin dashboard (sidebar layout)
- **Overview:** total customers, active services, total requests, pending, confirmed, total
  successful payments.
- **Manage Services:** list/add/update/delete services, activate/deactivate; image is an
  **upload** (ImgBB), not URL; price & duration must be positive; default status Active.
- **Manage Appointments:** view all requests + details (customer info, service info, date/time,
  message, price, statuses, request date); confirm **pending**; cancel pending or confirmed.
- **Manage Users:** view all customers, details, block/unblock (blocked users lose protected access).
- **Transactions:** read-only list (customer, service, appointment date, amount, currency,
  shortened Stripe session ID, payment status, transaction date); admin must not manually mark
  payments successful.

### Appointment booking (service details page)
Form: date, time slot (predefined list), optional message → saved to `appointments` as
Pending/Unpaid. Only authenticated customers; no inactive services; no duplicate active slots.

### Payment flow
Pending+Unpaid → Admin confirms → customer clicks Pay Now → Stripe Checkout → success page
(confirm, save transaction, update payment status after verified webhook) or cancel page.
Payment status is updated **only** by a verified Stripe webhook.

---

## F. API Architecture

**Existing endpoints: none.** The server repo has no code yet. Planned endpoints (do not implement
until instructed; URLs are proposals — confirm before use):

Server (Express, all under `/api`, JWT+role middleware on protected routes):
- `GET /api/services` — public list; supports `?search=` (name), `?category=`, `?sort=price` order; only active for public consumers
- `GET /api/services/:id` — public detail (invalid ID → error)
- `POST /api/services` (admin), `PUT /api/services/:id` (admin), `DELETE /api/services/:id` (admin), `PATCH /api/services/:id/status` (admin)
- `POST /api/appointments` (customer; validates active service + duplicate slot)
- `GET /api/appointments` (admin: all; customer: own only)
- `GET /api/appointments/:id` (owner or admin)
- `PATCH /api/appointments/:id/cancel` (customer own + pending only; admin pending/confirmed)
- `PATCH /api/appointments/:id/confirm` (admin; pending only)
- `POST /api/payments/checkout-session` (customer; only Confirmed+Unpaid own appointments)
- `POST /api/payments/webhook` (Stripe webhook, no auth, signature verification; updates payment status + writes transaction)
- `GET /api/transactions` (admin all; customer own history)
- `GET /api/users` (admin), `PATCH /api/users/:id/block` / `unblock` (admin)
- `GET /api/admin/stats` (overview counts), `GET /api/customer/stats`
- Profile update: Better Auth client-side update or `PATCH /api/users/me` (name/image/phone only; never role/isBlocked)

Image upload flow: client → ImgBB directly using ImgBB API key (env), stores returned URL.

---

## G. Business Logic and Security Rules (must hold server-side)

1. Only Admin can create/update/delete services.
2. Customers can access only their own appointments.
3. Customers can cancel only their own **Pending** appointments.
4. Only **Pending** appointments can be confirmed (by Admin).
5. Only **Confirmed** appointments can be paid.
6. Inactive services cannot be booked and don't appear publicly.
7. Duplicate **active** (pending/confirmed) appointments for same service+date+slot are rejected.
8. Blocked users cannot access protected features (client and server).
9. Payment status changes **only** via verified Stripe webhook; admins cannot mark payments successful manually.
10. Users cannot change their own role or blocked status; cannot edit other users' profiles.
11. Admins cannot submit customer appointment requests.
12. JWT verification middleware required on all protected Express routes.
13. Never push `.env` or secrets; all credentials in environment variables (MongoDB URI, Better
    Auth secret, Google OAuth, Stripe secret + webhook secret, ImgBB key, app URLs).

---

## H. Development Rules

- Reuse existing components/utilities (`src/components/ui/*`, `cn()`); add more shadcn components via the existing `components.json` config.
- Avoid unnecessary dependencies and abstractions; server already uses the raw `mongodb` driver — do not add Mongoose without approval.
- Follow existing conventions: TypeScript everywhere (client), 2-space indent, Prettier, `@/*` path alias, App Router with `src/`.
- Keep frontend/backend responsibilities separate: no DB access from the Next.js client; no business rules in the UI.
- Do not duplicate existing functionality; check before writing.
- Do not change existing API URLs or environment variable names without explicit approval.
- Never expose secrets or commit `.env` files; use `.env.example`-style docs with names only.
- Preserve existing UI/functionality unless explicitly asked to change it.
- Proper loading, error, and success states everywhere; toast notifications (no `alert()`).
- Meaningful Git commit messages; ≥20 client commits, ≥12 server commits across development.
- Also maintain README files in both repos (features, stack, install/run instructions, env var names only, live link, both repo links).
- Before writing Next.js code, consult `node_modules/next/dist/docs/` — Next 16 differs from older conventions.

---

## I. Assignment Requirements Checklist

Legend: ✅ implemented · 🟡 partial · ❌ not implemented · ❓ needs verification

**Infrastructure**
- ❓ Client repo restructure committed (src/ move currently uncommitted)
- ❌ Better Auth installed/configured (client)
- ❌ Express server skeleton, CORS, env config, DB connection (server has deps only)
- ❌ Server git repo initialized
- ❌ Env variable setup both repos (names only in README)

**Database**
- ❌ Four collections with schema validation/indexes (incl. duplicate-slot unique index)

**Auth**
- ❌ Sign up (name/email/password/profile image, password rules)
- ❌ Google OAuth
- ❌ Role field + secure admin assignment
- ❌ JWT verification middleware (Express) — challenge requirement
- ❌ Protected routes client + server, role-based dashboard access
- ❌ Blocked user enforcement

**Public frontend**
- ❌ Navbar/Footer with auth-state reactivity
- ❌ Home (banner, featured ≥6, categories, extra section)
- ❌ Browse Services with search/category/price-sort (challenge requirements)
- ❌ Service Details `/services/[id]` protected + invalid-ID error

**Dashboards**
- ❌ Dashboard layout (sidebar + content, role-based nav)
- ❌ Customer: overview, my appointments, profile
- ❌ Admin: overview, manage services (CRUD + image upload + activate/deactivate), manage appointments (confirm/cancel), manage users (block/unblock), transactions (read-only), profile

**Booking & payments**
- ❌ Booking form (date, predefined slot, message), Pending/Unpaid defaults
- ❌ Duplicate-slot prevention, inactive-service prevention
- ❌ Stripe Checkout + success/cancel pages
- ❌ Verified webhook → payment status + transaction record

**Cross-cutting**
- ❌ Loading states, error handling (404, API failures, form validation, unauthorized, upload failure, booking conflicts, payment failure), toasts
- ❌ Responsive/professional salon-themed UI
- ✅ Existing scaffold: layout, theme, button, `cn()`

**Submission**
- ❌ ≥20 client / ≥12 server meaningful commits
- ❌ READMEs both repos
- ❌ Deployment (client + server), no CORS/404/504, reload-safe routes, Stripe live-flow, admin creds working
- ❓ Verify search + sorting exist somewhere (they are on Browse Services plan)

---

## J. Implementation Roadmap (dependency-aware)

1. **Foundations:** commit the client restructure; init git in server repo; create Express entry
   point (`index.js`/`app.js`) with cors, dotenv, `/api` router, MongoDB connection helper; define
   env var names (both repos) + `.env.example`; pick public URLs.
2. **Database layer:** connection + collection helpers/models for `services`, `appointments`,
   `transactions`; Better Auth user config (`role`, `isBlocked` additional fields); indexes (e.g.,
   unique active-slot rule).
3. **Auth:** Better Auth in Next.js (email/password + Google), sign-up/in pages, role-aware
   session; Express JWT verification middleware; secure admin seeding.
4. **Core server APIs:** services CRUD + public list (search/filter/sort), service detail.
5. **Public frontend:** Navbar/Footer, Home, Browse Services (search/filter/sort), Service
   Details with protected access.
6. **Admin features:** dashboard layout, overview stats, manage services (with ImgBB upload),
   manage users.
7. **Customer features + booking:** dashboard, booking form, my appointments, cancel pending.
8. **Appointment workflow + Stripe:** admin confirm/cancel, checkout session creation, success/
   cancel pages, webhook (payment status + transactions), transactions page.
9. **Hardening:** loading/error/toast states, blocked-user enforcement, role URL abuse checks,
   profile management.
10. **Testing & deployment:** full role/permission testing, Stripe test flow, deploy both apps,
    READMEs, commit-count audit, submission package (admin creds, live link, repo links).

Build and test one feature at a time; commit after each meaningful unit.
