/**
 * Reads a public env var.
 *
 * NEXT_PUBLIC_* values MUST be referenced as full literal expressions —
 * `process.env.NEXT_PUBLIC_FOO`. Next.js replaces those at build time with
 * the real value so they reach the browser. A dynamic lookup like
 * `process.env[name]` silently resolves to `undefined` in client bundles,
 * which is why this file inlines the known names by hand.
 *
 * Server-only secrets (SUPABASE_SERVICE_ROLE_KEY, MAILGUN_*) are read the
 * normal way, since they never need to reach the browser.
 */
export function env(name: string, fallback = ""): string {
  switch (name) {
    case "NEXT_PUBLIC_SUPABASE_URL":
      return process.env.NEXT_PUBLIC_SUPABASE_URL ?? fallback;
    case "NEXT_PUBLIC_SUPABASE_ANON_KEY":
      return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? fallback;
    case "NEXT_PUBLIC_SITE_URL":
      return process.env.NEXT_PUBLIC_SITE_URL ?? fallback;
    default:
      return process.env[name] ?? fallback;
  }
}

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const isMailgunConfigured = Boolean(
  process.env.MAILGUN_DOMAIN && process.env.MAILGUN_API_KEY
);

/** Any supported email provider. See lib/send.ts for the order of preference. */
export const isEmailConfigured = Boolean(
  process.env.RESEND_API_KEY ||
    (process.env.MAILGUN_DOMAIN && process.env.MAILGUN_API_KEY) ||
    process.env.SMTP_HOST
);

/** Public site origin, used for OAuth redirects and email links. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
