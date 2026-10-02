# AGENTS.md

Guidance for coding agents working in this repository.

## What this is

Aaya Perfume — a Next.js 15 (App Router, TypeScript, Tailwind v4) storefront
for 37 Arabic roll-on fragrances. Orders are written to Postgres via Supabase;
confirmations are sent through Resend, Mailgun or plain SMTP.

## Commands

```bash
npm run dev      # dev server on :3000
npm run build    # production build (needs ~2GB heap; see Memory below)
npm run lint     # eslint
npx tsc --noEmit # typecheck
```

## Architecture

```
src/
  app/                      routes (all server components unless marked)
    layout.tsx              fonts, CartProvider, SiteHeader, SiteFooter
    page.tsx                homepage: hero, collection, quiz, mood, about
    checkout/
      actions.ts            "use server" — placeOrder + sendTestEmail
      CheckoutClient.tsx    bag state -> feeds the form
      CheckoutForm.tsx      the actual form + confirmed/empty states
    account/page.tsx        Google sign-in + order history
    orders/[reference]/     order lookup, linked from the confirmation email
    auth/callback/page.tsx  completes the Google OAuth handshake
    fragrance/[slug]/       product detail page
    dev/email/              preview the confirmation email (no order saved)
  components/               presentation only
  lib/
    types.ts                Product type, labels, formatPrice()
    products.ts             joins the three data parts into CATALOGUE
    data/part-{one,two,three}.ts   the 37 products
    quiz-questions.ts       the five questions + scoring weights
    quiz.ts                 recommend() and derivePersonality() — pure
    orders.ts               order types, totals, free-shipping rule, money()
    mail-template.ts        email content, provider-independent
    send.ts                 provider switch: Resend / Mailgun / SMTP
    env.ts                  env access + "is it configured?" checks
    supabase/{client,server}.ts    session client, createAdminClient()
  middleware.ts             refreshes the Supabase session on navigation
supabase/schema.sql         run once in the SQL editor
```

## Rules that are easy to break

**1. Never put a service-role key anywhere the browser can reach.**
`SUPABASE_SERVICE_ROLE_KEY` bypasses row-level security. It is only ever
imported inside a `"use server"` action. The `anon` key is browser-safe.

**2. The orders table has RLS on with a SELECT-only policy.** The anon key
*cannot* insert. All writes go through `createAdminClient()` in
`lib/supabase/server.ts`. Reading a session or listing a customer's own
orders uses the anon `createClient()`.

**3. `NEXT_PUBLIC_*` must be written as a full literal.**
`process.env.NEXT_PUBLIC_FOO` is inlined at build time;
`process.env[name]` silently resolves to `undefined` in the browser. See the
switch statement in `lib/env.ts`.

**4. Prices are kobo, never floats.** `price_minor: 1250000` renders as
`₦12,500`. Always format through `formatPrice()` (catalogue) or `money()`
(orders). Never hardcode a currency or write `Intl.NumberFormat` inline.

**5. The cart hands off a string, not objects.** `CartProvider` stores
`{slug, qty}[]` in localStorage; `toCartValue()` serialises to
`"slug:qty,slug:qty"`, which the existing server action parses and
re-prices. Do not "improve" the checkout to accept a different shape.

**6. Prices are recalculated server-side from the catalogue.** Never trust a
price from the browser payload. `parseCart()` looks slugs up by slug.

**7. Sold-out products are filtered before quiz scoring.** `recommend()`
drops `stock === 0` first so it can never recommend something unbuyable.

## Conventions

- Client components start with `"use client"`. The rest are server components
  by default.
- Design tokens live in `src/app/globals.css` under `@theme`. Do not use
  arbitrary hex values in components — add a token.
- Motion goes through the existing `.rise` / `.settle` / `.swap` / `.drift`
  classes. Everything is already wrapped in `prefers-reduced-motion`.
- Buttons use `.btn` + a variant (`.btn-primary`, `.btn-sage`, `.btn-ghost`).
  Minimum 46px touch target.
- Call `useCart()` only inside `<CartProvider>`.

## Memory constraint

This project has been built on machines with under 1GB free RAM, and the
production build OOM-killed twice. If a build appears to hang, check
whether the node process still exists and is consuming CPU:

```bash
set NODE_OPTIONS=--max-old-space-size=2048 && npx next build
```

`useSearchParams` in a client component also requires a `<Suspense>` wrapper
or the build will hang indefinitely — see `ShopGrid.tsx`.

## Environment

Copy `.env.example` to `.env.local`. `.env.local` is git-ignored and must
never be committed. Every value can be left blank while working locally; the
site renders with the built-in catalogue and skips the features you have not
configured.

## Before you push

1. `npx tsc --noEmit` must be clean.
2. `npm run lint` must have no errors.
3. Scan for committed secrets:
   ```bash
   git ls-files | xargs grep -lE 're_[A-Za-z0-9]{20,}|eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyJpc3MiOiJzdXBhYmFzZS'
   ```

## Known gaps

- **Payments are not live.** The card form validates the shape of the number
  and stores nothing; it never charges anyone. Wire Stripe, Paystack or
  Telr before taking real orders.
- **Photography is optional per product.** `Product.image` is merged in
  from `lib/product-images.ts` (slug to filename) inside `lib/products.ts`.
  Files live in `public/products/`. `components/ProductImage.tsx` renders
  the photo and falls back to the `Bottle` CSS illustration when a product
  has no entry *or* the file 404s, so a missing or mistyped filename degrades
  to the illustration instead of a broken image. Adding a photo = drop the
  file in plus one line in the map. With `fit="cover"` the photo fills its
  parent, so the parent must set the frame and `overflow-hidden`.
- **Note pyramids are editorial.** `notes` on each product was written here,
  not supplied by the fragrance vendor.