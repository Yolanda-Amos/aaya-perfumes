# AGENTS.md

Guidance for coding agents working in this repository.

## What this is

Aaya Perfume: a Next.js 15 (App Router, TypeScript, Tailwind v4) storefront
for 37 Arabic roll-on fragrances (the Naseem 24ml collection), plus an Expo
mobile app in `mobile/` that shares the same login, API and cart.

- Live site: https://aaya-perfume.vercel.app (Vercel project **aaya-perfume**;
  pushing to `main` deploys). A duplicate project named `aaya-perfumes` has
  no env vars and should not be used.
- Database and auth: Supabase project `kfsgnpysfpqgoungjrty` (eu-west-1).
  Google sign-in through Supabase Auth, for both web and mobile.
- Email: Mailgun (preferred), Resend, or SMTP; see `lib/send.ts`.
- This is the HNG Internship Stage 2 (shop) and Stage 3 (mobile app with
  shared login and instant cart sync) project.

## Commands

```bash
npm run dev      # dev server on :3000
npm run build    # production build (needs ~2GB heap; see Memory below)
npm run lint     # eslint (skips mobile/)
npx tsc --noEmit # typecheck (skips mobile/)

cd mobile && npm install && npx expo start   # mobile app in Expo Go
cd mobile && npx tsc --noEmit                # mobile typecheck
```

On Windows PowerShell, if `npm` is blocked ("running scripts is disabled"),
use `npm.cmd` / `npx.cmd`, or run
`Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`.

## Architecture

```
src/
  app/                      routes (all server components unless marked)
    layout.tsx              fonts (on <html>!), CartProvider, header, footer, WelcomeNotice
    page.tsx                homepage: hero, promises strip, quiz band, collection, mood, about
    checkout/
      actions.ts            "use server": placeOrder, sendTestEmail (order or welcome)
      CheckoutClient.tsx    bag state -> feeds the form
      CheckoutForm.tsx      the form + confirmed/empty states
    account/page.tsx        signed out: "Welcome to Aaya" + Google button
                            signed in: profile (photo, name, email, orders, spent, member since)
    orders/[reference]/     order lookup, linked from the confirmation email
    auth/callback/route.ts  Route Handler: exchanges the Google code, sets the
                            session cookie, sends the welcome email once
    api/products/route.ts   GET catalogue (shared with the mobile app)
    api/config/route.ts     GET public Supabase URL + anon key (for the mobile app)
    api/account/welcome/    POST with Bearer token: welcome email for mobile sign-ups
    fragrance/[slug]/       product detail page
    dev/email/              send a sample order confirmation or welcome email
  components/
    CartProvider.tsx        guest cart in localStorage; signed-in cart in Supabase + Realtime
    WelcomeNotice.tsx       toast after sign-in: new account / welcome back / failed
    ArchPhoto.tsx           product photo in the signature mihrab arch
    ProductImage.tsx        photo with CSS-bottle fallback
    HeaderActions.tsx       search, avatar + first name (signed in), cart; exports Avatar
  lib/
    types.ts                Product type, labels, formatPrice()
    products.ts             joins the three data parts into CATALOGUE
    data/part-{one,two,three}.ts   the 37 products
    product-images.ts       slug -> official Naseem photo on cdn.shopify.com
    quiz-questions.ts       the five questions + scoring weights
    quiz.ts                 recommend() and derivePersonality(), pure
    orders.ts               order types, totals, free-shipping rule, money()
    mail-template.ts        orderConfirmationEmail(), welcomeEmail(); provider-independent
    send.ts                 provider switch: Mailgun -> Resend -> SMTP
    welcome.ts              ensureWelcomed(user): sends once, records app_metadata.welcome_sent_at
    auth-notice.ts          isNewAccount(), withWelcomeFlag(path, "new" | "back")
    env.ts                  env access + "is it configured?" checks
    supabase/{client,server}.ts    session client, createAdminClient()
  middleware.ts             refreshes the Supabase session on navigation
supabase/
  config.toml
  migrations/*.sql          versioned schema (initial schema, shared cart)
mobile/                     Expo SDK 57 app, see mobile/README.md
  App.tsx                   sign-in screen, Shop and Bag tabs
  src/hooks.ts              useAuth (Google via Supabase PKCE), useProducts, useCart (Realtime)
  src/supabase.ts           client built from the site's /api/config, AsyncStorage sessions
  src/theme.ts              colours, SITE_URL, naira()
```

### How sign-in works
- Web: `GoogleSignIn` -> Supabase -> Google -> `/auth/callback` (Route Handler)
  -> session cookie -> redirect with `?welcome=1` (new) or `?welcome=back`.
- Mobile: `signInWithOAuth` with `skipBrowserRedirect`, opened in
  `expo-web-browser`, returning to `Linking.createURL("auth-callback")`
  (`exp://…/--/auth-callback` in Expo Go); then `exchangeCodeForSession`.
- Supabase -> Authentication -> URL Configuration must list:
  Site URL `https://aaya-perfume.vercel.app`; Redirect URLs
  `https://aaya-perfume.vercel.app/**`, `http://localhost:3000/**`, `exp://**`
  (and `aaya://**` for a standalone build).
- Sign-out uses `signOut({ scope: "local" })` on both web and mobile, so
  signing out on one device does not sign out the other. Do not change
  this to the default (global) scope.

### How the shared cart works
- Table `public.cart_items (user_id, slug, qty 1–10, updated_at)`, primary
  key `(user_id, slug)`, RLS: each user can select/insert/update/delete only
  their own rows. Replica identity full; in the `supabase_realtime` publication.
- Web (`CartProvider`) and mobile (`useCart`) write optimistically with
  upsert/delete, and subscribe to `postgres_changes` filtered by
  `user_id=eq.<uid>`; any change reloads the cart (debounced 120ms).
- Guests use localStorage; on sign-in the guest cart is merged
  (max of the two quantities) into `cart_items`, then cleared locally.

### Email
- `sendEmail()` picks Mailgun when `MAILGUN_DOMAIN` + `MAILGUN_API_KEY` are
  set, else Resend, else SMTP. Mailgun's API takes **form fields**
  (URLSearchParams), not JSON. EU domains need `MAILGUN_REGION=eu`.
- Sandbox Mailgun domains only deliver to Authorized Recipients added in
  the Mailgun dashboard.
- Order confirmation: sent by `placeOrder` after the order is saved.
- Welcome email: `ensureWelcomed(user)` sends once per account and stamps
  `app_metadata.welcome_sent_at` with the admin client. Called by the web
  callback and by `POST /api/account/welcome` (mobile).
- Check delivery at `/dev/email`: it shows the provider's exact error.

## Rules that are easy to break

**1. Never put a service-role key anywhere the browser can reach.**
`SUPABASE_SERVICE_ROLE_KEY` bypasses row-level security. Only server code
(`"use server"` actions, Route Handlers, `lib/welcome.ts`) may use
`createAdminClient()`. The anon key is browser-safe and is served to the
mobile app by `/api/config`.

**2. The orders table has RLS on with a SELECT-only policy.** The anon key
*cannot* insert. All writes go through `createAdminClient()`.

**3. `NEXT_PUBLIC_*` must be written as a full literal.**
`process.env.NEXT_PUBLIC_FOO` is inlined at build time;
`process.env[name]` silently resolves to `undefined` in the browser. See the
switch statement in `lib/env.ts`.

**4. Prices are kobo, never floats.** `price_minor: 1250000` renders as
`₦12,500`. Format through `formatPrice()` (catalogue), `money()` (orders) or
`naira()` (mobile). Never hardcode a currency inline.

**5. The checkout takes a string, not objects.** The server action parses
`"slug:qty,slug:qty"` and re-prices it. Do not change that shape.

**6. Prices are recalculated server-side from the catalogue.** Never trust a
price from the browser payload.

**7. Auth callbacks must be Route Handlers.** Next.js forbids setting
cookies while rendering a Server Component page, and the server client
swallows that error, so a page-based callback silently drops the session.

**8. Schema changes go in a new file under `supabase/migrations/`.** Name it
`<YYYYMMDDHHMMSS>_what_it_does.sql`, make every statement re-runnable, and
apply it to the live database (Supabase MCP `apply_migration`, or paste it
into the SQL editor). Do not assume a GitHub integration will apply it.

**9. Sold-out products are filtered before quiz scoring.**

**10. Fill images need a framed parent.** `ProductImage` with
`fit="cover"` (and `ArchPhoto`'s image) is `absolute inset-0`; its parent
must be `relative` with `overflow-hidden`, or the photo escapes and covers
the page (this happened on the quiz result).

**11. Font variables go on `<html>`.** Tailwind's `@theme` resolves
`--font-display` at `:root`; next/font variables set on `<body>` are
undefined there and every page falls back to the system font.

## Design system

- Palette (tokens in `globals.css` `@theme`): ivory `#faf7f2` base, sage
  `#eef3ed`, espresso text `#302824`, deep `night` `#2b231f` for the hero
  frame, quiz band, profile card and footer, antique `brass` `#b89462` for
  hairlines, icons and one main action per dark panel. Rose/peach sparingly.
- Type: Cormorant Garamond (display) + Manrope (UI/body). Avoid ALL-CAPS
  eyebrows; the AAYA wordmark is the exception.
- Signature element: product photos in mihrab arches (`.arch`,
  `.arch-line`, `ArchPhoto`). Naseem photos are bottles on white, so they
  are `object-contain` with `mix-blend-multiply` over a tint.
- Buttons: `.btn` + `.btn-primary` / `.btn-ghost` / `.btn-sage`, and on dark
  panels `.btn-brass` / `.btn-ivory-ghost`. Minimum 46px touch target.
- The quiz is a featured section high on the homepage and has a nav pill.
- Motion: `.rise`, `.settle`, `.swap`, `.drift`, `.arch-rise`, all wrapped in
  `prefers-reduced-motion`.

## Conventions

- Client components start with `"use client"`.
- No arbitrary hex values in components; add a token.
- Call `useCart()` only inside `<CartProvider>`.
- In `mobile/`, install packages with `npx expo install` (with
  `EXPO_OFFLINE=1` if the network blocks api.expo.dev). Read the SDK 57 docs
  before using Expo APIs; see `mobile/AGENTS.md`.

## Memory constraint

This project has been built on machines with under 1GB free RAM, and the
production build OOM-killed twice. If a build appears to hang, check
whether the node process still exists and is consuming CPU:

```bash
set NODE_OPTIONS=--max-old-space-size=2048 && npx next build
```

`useSearchParams` in a client component also requires a `<Suspense>` wrapper
or the build will hang indefinitely; see `ShopGrid.tsx` and `layout.tsx`.

## Environment

Copy `.env.example` to `.env.local` (git-ignored). Names only, never values:
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`NEXT_PUBLIC_SITE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `MAILGUN_API_KEY`,
`MAILGUN_DOMAIN`, `MAILGUN_FROM`, optional `MAILGUN_REGION`, `RESEND_*`, `SMTP_*`.
The mobile app needs none; optional `EXPO_PUBLIC_SITE_URL`.

## Before you push

1. `npx tsc --noEmit` must be clean (and in `mobile/` if you touched it).
2. `npm run lint` must have no errors.
3. Scan for committed secrets:
   ```bash
   git ls-files | xargs grep -lE 're_[A-Za-z0-9]{20,}|eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyJpc3MiOiJzdXBhYmFzZS'
   ```
4. Vercel preview URLs require a Vercel login; use a share link
   (`_vercel_share`) to view them.

## Known gaps

- **Payments are not live.** The card form validates the shape of the number
  and stores nothing. Wire Paystack or similar before taking real orders.
- **The cart is not emptied after an order.** The drawer passes the cart to
  `/checkout?add=slug:qty,...`; nothing calls `clear()` on success yet.
- **Google shows "continue to …supabase.co"** on its sign-in screen. Changing
  it needs a Supabase custom domain or Google's own button with
  `signInWithIdToken`.
- **Note pyramids are editorial**, written here, not supplied by Naseem.
