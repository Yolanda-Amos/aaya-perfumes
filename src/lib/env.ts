/** Reads a public env var. Returns "" when unset so the site still builds
 *  and renders (guest checkout, catalogue from the local list). */
export function env(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export const isSupabaseConfigured = Boolean(
  env("NEXT_PUBLIC_SUPABASE_URL") && env("NEXT_PUBLIC_SUPABASE_ANON_KEY")
);

export const isMailgunConfigured = Boolean(
  env("MAILGUN_DOMAIN") && env("MAILGUN_API_KEY")
);

/** Public site origin, used for OAuth redirects and email links. */
export const siteUrl = env("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
