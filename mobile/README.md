# Aaya Perfume — mobile app

The Aaya shop on your phone. It uses the **same account and the same API**
as the website (https://aaya-perfume.vercel.app):

- **Login:** Google, through the same Supabase project. One account for web and phone.
- **Products:** `GET /api/products` on the website.
- **Settings:** `GET /api/config` on the website (public Supabase URL and key), so
  there is nothing to configure here.
- **Cart:** the Supabase `cart_items` table with Realtime. Add a bottle on the
  website and it appears in the app instantly, and the other way round.

## Run it on your phone (Expo Go)

1. Install **Expo Go** from the App Store or Play Store.
2. On your computer (Node 20+), from the repo root:
   ```bash
   cd mobile
   npm install
   npx expo start
   ```
3. Scan the QR code: with the Camera app on iPhone, or inside Expo Go on Android.
   Phone and computer must be on the same Wi-Fi. If they can't be, use
   `npx expo start --tunnel`.

## One-time Supabase setting

Google sign-in returns to the app through an Expo Go link (`exp://…`).
Add it to Supabase once:

**Supabase → Authentication → URL Configuration → Redirect URLs → Add URL:**

```
exp://**
```

(Add `aaya://**` too if you later make a standalone build.)

## Test the live cart

1. Sign in on the phone and on https://aaya-perfume.vercel.app with the same Google account.
2. Add a bottle on the website. It appears in the app's **Bag** tab within a second.
3. Change a quantity in the app. The website's bag updates too.

The header shows **Live** when the realtime connection is up.

## Optional

Point the app at another copy of the site with `EXPO_PUBLIC_SITE_URL=https://… npx expo start`.
