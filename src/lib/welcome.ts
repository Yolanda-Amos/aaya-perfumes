import "server-only";
import type { User } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/server";
import { sendWelcome } from "@/lib/send";

/**
 * Sends the welcome email once per account, whichever device created it.
 *
 * "Already welcomed" is recorded in the user's app_metadata
 * (`welcome_sent_at`). app_metadata can only be written with the
 * service-role key, so a customer cannot tamper with it. The website's auth
 * callback calls this directly; the mobile app calls POST /api/account/welcome.
 *
 * Fails softly: a mail problem must never block a sign-in.
 */
export async function ensureWelcomed(user: User): Promise<"sent" | "already" | "skipped"> {
  try {
    if (!user.email) return "skipped";
    if (user.app_metadata?.welcome_sent_at) return "already";

    const meta = user.user_metadata ?? {};
    const name =
      (typeof meta.full_name === "string" && meta.full_name) ||
      (typeof meta.name === "string" && meta.name) ||
      "";

    const result = await sendWelcome(user.email, name);
    if (!result.sent) {
      console.error("[welcome] not sent:", result.reason, result.detail ?? "");
      return "skipped";
    }

    const admin = createAdminClient();
    await admin.auth.admin.updateUserById(user.id, {
      app_metadata: { ...user.app_metadata, welcome_sent_at: new Date().toISOString() },
    });
    return "sent";
  } catch (err) {
    console.error("[welcome] failed:", err);
    return "skipped";
  }
}
