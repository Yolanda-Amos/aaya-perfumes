/**
 * Telling a brand-new Google signup apart from a returning one.
 *
 * Supabase's OAuth exchange does not return an `is_new_user` flag, but it
 * does return the `auth.users` row, which carries `created_at`. A genuine
 * first-time signup has a creation timestamp seconds old; someone signing in
 * again has one from whenever they first joined. A two-minute window is wide
 * enough to absorb a slow Google consent screen and clock drift, while being
 * far too old for any genuine repeat sign-in to fall into.
 */
const NEW_ACCOUNT_WINDOW_MS = 2 * 60 * 1000;

export function isNewAccount(createdAt?: string | null, now = Date.now()): boolean {
  if (!createdAt) return false;
  const then = Date.parse(createdAt);
  if (Number.isNaN(then)) return false;
  const age = now - then;
  // A timestamp slightly in the future means clock skew, not an old account.
  return age >= -NEW_ACCOUNT_WINDOW_MS && age < NEW_ACCOUNT_WINDOW_MS;
}

/**
 * Appends the welcome flag to the page we send the user to after signing in.
 *
 * The flag travels in the query string rather than a cookie so it cannot
 * outlive the redirect or reappear on a later visit — the notice clears the
 * URL as soon as it has been read.
 */
export type WelcomeKind = "new" | "back";

export function withWelcomeFlag(path: string, kind: WelcomeKind = "new"): string {
  const [beforeHash, hash] = path.split("#");
  const separator = beforeHash.includes("?") ? "&" : "?";
  const flagged = `${beforeHash}${separator}welcome=${kind === "new" ? "1" : "back"}`;
  return hash ? `${flagged}#${hash}` : flagged;
}