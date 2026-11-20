# SalonBook — Client

SalonBook is a salon appointment booking platform where customers browse salon services, request
appointments, and pay online, while admins manage services, appointments, customers, and payments.

This repository contains the **frontend**: a Next.js (App Router) application with public marketing
pages, authenticated service details and booking, role-based Customer and Admin dashboards, and a
Stripe Checkout payment redirect. All business rules and data access live in the separate Express
API — see the [server repository](https://salonbook-sever.vercel.app).

## Important Features

**Public site**

- Home page with a hero banner, featured services (up to 6 active services), service categories, and
  an about section.
- Browse Services page with search by service name, category filtering, and price sorting.
- Protected Service Details page (`/services/[id]`) with full service information and a booking form
  (date, predefined time slot, optional message). Unauthenticated visitors are redirected to Sign In.
- Responsive navbar and footer, including a direct Dashboard link for signed-in users and a mobile
  drawer menu.

**Authentication**

- Email/password sign-up and sign-in plus Google OAuth, powered by Better Auth.
- Password complexity rules validated on the client form and enforced again by a server-side Better
  Auth hook.
- Role-based route protection for `/dashboard/customer/*` and `/dashboard/admin/*`; wrong-role access
  is redirected to an Access Denied page.
- Profile image upload during sign-up and from the profile page, hosted via ImgBB.

**Customer dashboard**

- Overview with total, pending, confirmed, and cancelled appointment counts.
- My Appointments: service details, appointment date/time, price, statuses, request date, cancel a
  pending request, and pay a confirmed appointment through Stripe Checkout.
- My Profile: update name, profile image, and phone number (role and blocked status are read-only).

**Admin dashboard**

- Overview statistics: total customers, active services, total/pending/confirmed appointments, and
  successful payments.
- Manage Services: create, edit, delete, and activate/deactivate services with image upload, price,
  duration, and status validation.
- Manage Appointments: view all requests with customer and service information, confirm pending
  requests, and cancel pending or confirmed requests.
- Manage Users: search customers, view details, and block/unblock accounts.
- Transactions: read-only payment history with customer, service, amount, currency, shortened Stripe
  session reference, and transaction date.
- My Profile: same profile management as customers.

**Cross-cutting**

- Toast notifications (sonner) for success and error states; no `alert()` dialogs.
- Loading skeletons, empty states, and friendly error states with retry actions.
- Light/dark theme support.
- Mobile-first responsive layouts (stacked cards instead of tables on small screens).

## Technology Stack

- **Next.js 16** (App Router, Turbopack, React Server Components and Server Actions)
- **React 19** and **TypeScript 5**
- **Tailwind CSS 4** with `@tailwindcss/postcss`
- **shadcn/ui** components built on **Base UI** (`@base-ui/react`), plus `class-variance-authority`
  and the `cn` class-merge helper
- **Better Auth** (`better-auth`) with the **MongoDB adapter** (`@better-auth/mongo-adapter`) and the
  native `mongodb` driver
- **Stripe Checkout** (hosted payment page; the checkout session is created by the Express API)
- **sonner** for toast notifications
- **lucide-react** for icons
- **next-themes** for light/dark theme switching
- **ImgBB API** for image hosting (called directly from the client)
- **ESLint**, **Prettier**, and the React Compiler for code quality

## Installation Instructions

**Prerequisites**

- Node.js 20 or newer and npm
- A running instance of the SalonBook Express API (see the server README)
- A MongoDB database (Better Auth stores its user/session collections here)
- Google OAuth credentials and an ImgBB API key for those features

```bash
git clone https://github.com/abdulkader02/A-9-SalonBook-frontend.git
cd A-9-SalonBook-frontend
npm install
```

## How to Run the Project Locally

1. Create a `.env.local` file in the project root and fill in the variables listed in
   [Required Environment Variables](#required-environment-variables).
2. Start the Express API first — this app depends on it for services, appointments, users, payments,
   and stats. Follow the [server README](https://github.com/abdulkader02/A-9-SalonBook-Backend#how-to-run-the-project-locally)
   and make sure it is reachable at the URL you put in `NEXT_PUBLIC_API_URL`.
3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

Useful scripts:

```bash
npm run dev        # start the development server on port 3000
npm run build      # create an optimized production build
npm start          # serve the production build
npm run lint       # run ESLint
npm run typecheck  # run TypeScript with no output files
npm run format     # format with Prettier
```

## Required Environment Variables

Create `.env.local` in the project root. Only the variable **names** are listed below — never commit
real secrets.

```bash
NEXT_PUBLIC_API_URL=your_value_here
NEXT_PUBLIC_BASE_URL=your_value_here
BETTER_AUTH_URL=your_value_here
BETTER_AUTH_SECRET=your_value_here
MONGODB_URI=your_value_here
GOOGLE_CLIENT_ID=your_value_here
GOOGLE_CLIENT_SECRET=your_value_here
NEXT_PUBLIC_IMGBB_API_KEY=your_value_here
```

| Variable                    | Purpose                                                                   |
| --------------------------- | ------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`       | Base URL of the SalonBook Express API, for example the local API address. |
| `NEXT_PUBLIC_BASE_URL`      | Public base URL of this Next.js app, used by the Better Auth client.      |
| `BETTER_AUTH_URL`           | Base URL used by Better Auth on the server.                               |
| `BETTER_AUTH_SECRET`        | Secret used by Better Auth to sign sessions and tokens.                   |
| `MONGODB_URI`               | MongoDB connection string used by the Better Auth MongoDB adapter.        |
| `GOOGLE_CLIENT_ID`          | Google OAuth client ID for social sign-in.                                |
| `GOOGLE_CLIENT_SECRET`      | Google OAuth client secret for social sign-in.                            |
| `NEXT_PUBLIC_IMGBB_API_KEY` | ImgBB API key used for profile and service image uploads.                 |

> `NEXT_PUBLIC_*` variables are exposed to the browser. Keep real secrets out of source control and
> configure them in your hosting provider's environment settings for deployment.

## Live Website Link

[https://salonbook-client-eight.vercel.app]

## Client and Server Repository Links

- **Client (this repository):** [https://github.com/abdulkader02/A-9-SalonBook-frontend](https://github.com/abdulkader02/A-9-SalonBook-frontend)
- **Server (Express API):** [https://github.com/abdulkader02/A-9-SalonBook-Backend](https://github.com/abdulkader02/A-9-SalonBook-Backend)
