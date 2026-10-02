# Aaya Perfume

A modern fragrance boutique for Arabic roll-ons, built with Next.js 15,
Supabase (database + Google sign-in) and Resend/Mailgun/SMTP (order emails).

## Design system

| token | value | used for |
|---|---|---|
| `--color-ivory` | `#faf7f2` | page background |
| `--color-sage` | `#eef3ed` | quiet panels, quiz band |
| `--color-sage-mid` | `#8fa58f` | accent, chips, quiz fills |
| `--color-rose` | `#d9b8b0` | wishlist, mood card |
| `--color-peach` | `#f3ddd0` | mood card, about image |
| `--color-espresso` | `#302824` | headings, primary button |
| `--color-taupe` | `#80756d` | secondary text |

Display type is **DM Serif Display**; UI and body are **Manrope**. The
wordmark is Manrope at 0.34em tracking, not a script face.

**Prices are Naira.** `price_minor` is stored in kobo, so `1250000` renders
as ₦12,500 via `formatPrice()` in `lib/types.ts`. Checkout and the order
email use `money()` in `lib/orders.ts`. Never format prices inline.

- **Storefront** — 37 roll-ons, filterable by family and audience, two-up on
  mobile, with note pyramids that unfurl on hover or focus
- **Product pages** — `/fragrance/[slug]` with imagery, notes, quantity, Buy Now
- **Cart** — slide-out drawer backed by localStorage; hands the same
  `slug:qty` string to the existing checkout
- **Mood browsing** — Fresh / Sweet / Floral / Bold, filtered from real family data
- **Scent quiz** — five questions (mood, setting, family, impression,
  personality) score all 37 and return three matches, each with a reason,
  plus a derived fragrance personality
- **Checkout** — live bag with quantity controls, server-validated form
- **Accounts** — Google sign-in, order history at `/account`
- **Order lookup** — `/orders/AAYA-XXXXXX`, the link in every confirmation email
- **Persistence** — every order is written to Postgres via Supabase
- **Email** — a styled HTML receipt after each order, via Resend, Mailgun or plain SMTP

The site **runs with no credentials at all**: the catalogue falls back to
`src/lib/data/*.ts` and checkout works as a guest. Add credentials one at a
time, in the order below.

---

## 1. Run it locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

---

## 2. The catalogue and the quiz

Everything about a perfume lives in `src/lib/types.ts` as one `Product` type:

| field | what it drives |
|---|---|
| `family` | quiz scoring, the filter chips, the card label |
| `audience` | the "For her / For him / Unisex" filters |
| `intensity` | 1 = close to skin, 3 = fills a room; scored by the quiz |
| `seasons` | "Hot months" vs "Cold months" answers |
| `occasion` | "Every day" vs "Occasions that matter" answers |
| `notes` | the top/heart/base pyramid on hover |
| `price_minor` | 1575 = Dhs 15.75 — always minor units, never floats |
| `stock` | 0 means sold out; the quiz never recommends it |

Products are split across `src/lib/data/part-one|two|three.ts` purely to keep
each file readable. `src/lib/products.ts` joins them and re-exports
`CATALOGUE`.

**The note pyramids and the family/intensity/season tags are merchandising I
wrote, not supplier data** — the source collection does not publish a note
breakdown. Replace them with real copy as you get it from your supplier; the
quiz will immediately score against the new values.

### How the quiz scores

`src/lib/quiz.ts` is pure and has no React in it, so you can test it in Node.
Each answer contributes weights rather than a verdict:

| dimension | weight |
|---|---|
| family match | 10 |
| occasion match | 8 |
| intensity match | up to 7, tapering to a third two steps away |
| season match | 6 |
| audience match | 4 |

Sold-out products are filtered out before scoring, so the quiz can never
recommend something unbuyable. The "why" text under each match is generated
from the same weights, so it is always traceable to an answer the shopper gave.


## 3. The database — Supabase or Neon

**Supabase (recommended — it also gives you Google sign-in for free)**

1. Create a free project at <https://supabase.com>.
2. Open **SQL Editor** (left sidebar → SQL Editor → New query).
3. Paste everything from [`supabase/schema.sql`](./supabase/schema.sql) and
   press **Run**. It creates the `orders` and `products` tables plus the row
   security policies.
4. Go to **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / publishable key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role / secret key** → `SUPABASE_SERVICE_ROLE_KEY`

**Neon (plain Postgres, if you already have a Neon account)**

Neon gives you a database but *not* authentication, so it cannot do Google
sign-in. Two options:

- Use Neon for the database **and** Supabase for auth (they connect fine), or
- Stick with Supabase entirely.

The schema file is standard Postgres, so it runs on Neon unchanged. The code
talks to Supabase, so a pure-Neon setup needs a small change to
`src/lib/supabase/server.ts` — tell me if that's the route you want and I'll
write it.

**Never put the `service_role` key in the browser.** Only `NEXT_PUBLIC_*`
variables reach the client.

---

## 4. Google sign-in

Supabase brokers the Google handshake, so there is no Google SDK to install.
You copy two values from Google Cloud Console into Supabase.

**a. In Google Cloud Console** — <https://console.cloud.google.com>

1. Pick (or create) a project. The project picker is the blue bar at the top.
2. Open **APIs & Services → OAuth consent screen**.
3. Choose **External**, then **Create**. Fill in:
   - App name: `Aaya Perfumes`
   - User support email: your email
   - Developer contact: your email
   - Under **Scopes**, add `.../auth/userinfo.email` and
     `.../auth/userinfo.profile`
4. While the app is in "Testing" status, add your own Gmail under
   **Test users** — otherwise Google refuses anyone not listed.
5. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
6. Choose **Web application**.
7. Under **Authorized redirect URIs** add:
   ```
   https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
   ```
8. Click Create. Copy the **Client ID** and **Client secret**.

**b. In Supabase** — **Authentication → Providers → Google**

9. Turn Google **on**.
10. Paste the Client ID and Client secret.
11. Set the **Site URL** to `http://localhost:3000` (later, your real domain).
12. Under **Redirect URLs**, add:

---

## 5. Order emails

The email content lives in [`src/lib/mail-template.ts`](./src/lib/mail-template.ts)
and knows nothing about any provider. [`src/lib/send.ts`](./src/lib/send.ts)
picks whichever provider you have configured, in this order: **Resend →
Mailgun → SMTP**. Switching is a change of environment variables, not code.

Preview the email without placing a real order at **/dev/email**.

### Option A — Resend (recommended, easiest)

1. Sign up at <https://resend.com> and verify your email.
2. **API Keys → Create API key**. Copy it.
3. **Domains → Add Domain**, then add the DNS records Resend gives you. Once it
   verifies, you can send from any address on that domain.
4. In `.env.local`:
   ```bash
   RESEND_API_KEY=re_xxxxxxxx
   RESEND_FROM=Aaya Perfumes <orders@yourdomain.com>
   ```

The free tier is 3,000 emails a month and does not require business
verification, which makes it the quickest route for a small shop. To start
without a domain, Resend lets you send from `onboarding@resend.dev` to your own
address only.

### Option B — plain SMTP (works with anything)

Use this if you have a mailbox already. Find your provider's SMTP settings
(Gmail: `smtp.gmail.com` port 587; Outlook: `smtp.office365.com`), then:

```bash
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=orders@yourdomain.com
SMTP_PASS=your-app-password
SMTP_FROM=Aaya Perfumes <orders@yourdomain.com>
```

Most providers want an **app password** rather than your real login password.

### Option C — Mailgun

Mailgun requires completed business verification before it will send, including
a published privacy policy linked from every email. That is fine for an
established business but is the slowest option for getting started.

1. <https://www.mailgun.com> → verify your account and complete business
   verification.
2. **Sending → Domains → Add domain**, then add the DNS records (TXT, MX, and
   two CNAMEs) at your registrar and wait for the green tick.
3. **Sending → API keys → Create API key**, select **Sending** only.
4. In `.env.local`:
   ```bash
   MAILGUN_DOMAIN=mg.yourdomain.com
   MAILGUN_API_KEY=key-xxxxxxxx
   MAILGUN_FROM=Aaya Perfumes <orders@mg.yourdomain.com>
   ```

If any provider errors, the order is still saved and the reason is logged — a
mail outage never blocks a purchase.

---

## 6. Put it online

1. Push the folder to a private GitHub repository.
2. On <https://vercel.com>, **Add New → Project** and import it. Vercel detects
   Next.js on its own.
3. Paste your `.env.local` values into **Project Settings → Environment
   Variables** (mark `RESEND_API_KEY`, `MAILGUN_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` as
   production-only).
4. Set `NEXT_PUBLIC_SITE_URL` to your live domain.
5. In Supabase and Google Cloud Console, add the live domain to the redirect URL
   lists from section 4.

---

## How the code fits together

```
src/
  app/
    page.tsx                     storefront
    checkout/
      page.tsx                   reads the URL, shows your Google session
      CheckoutClient.tsx         bag, form, confirmation screen
      actions.ts                 placeOrder() — validates, saves, emails
    account/page.tsx             sign-in + order history
    orders/[reference]/page.tsx  single order (linked from the email)
    auth/callback/page.tsx       completes Google's redirect
  components/                    ProductCard, Bottle, ShopGrid, ScentQuiz,
                                 QuizResult, OrderSummary, Icon, GoogleSignIn,
                                 Field, SignOutButton
  lib/
    types.ts                   Product type + labels + price formatting
    data/part-*.ts            the 37 roll-ons
    products.ts               joins the catalogue
    quiz-questions.ts         the five questions
    quiz.ts                   scoring + the Match type
    orders.ts                    types, totals, free-shipping rule
    mail-template.ts             email content (provider-independent)
    send.ts                      provider switch: Resend / Mailgun / SMTP
    env.ts                       safe env access + "is it configured?" checks
    supabase/{client,server}.ts  Supabase clients
  middleware.ts                  keeps the sign-in session fresh
supabase/schema.sql              run this in your database
```

### Security notes

- **Prices are recalculated on the server** from the catalogue. A tampered
  browser payload cannot change what you charge.
- The card form validates the *shape* of the number and stores nothing. It does
  **not** process real payments — wire it to Stripe Checkout, Paystack or
  Flutterwave before taking money. `status` starts at `'paid'` as a placeholder.
- Orders are inserted with the service-role key from a server action, so the
  public key can never write to your database. Row Level Security lets a user
  read only their own orders.
- The order page is visible to the owner or to anyone holding the reference
  code, which is what makes the email link work for guest checkout.

### Accessibility and quality

Skip link, labelled inputs with per-field errors, visible focus rings, 44px
touch targets, `aria-live` on the quantity counter, full `prefers-reduced-motion`
support, and no emoji standing in for icons. Verified at 375, 768, 1024 and
1440px.

    ```
    http://localhost:3000/auth/callback
    https://your-domain.com/auth/callback
    ```

Nothing goes in `.env.local` for Google — those credentials live in Supabase.
The app handles the rest: `src/components/GoogleSignIn.tsx` starts the flow and
`src/app/auth/callback/route.ts` finishes it.
