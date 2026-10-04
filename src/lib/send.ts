import "server-only";
import { orderConfirmationEmail, welcomeEmail } from "@/lib/mail-template";
import type { Order } from "@/lib/orders";

/**
 * Email delivery through Resend (https://resend.com).
 *
 * Needs RESEND_API_KEY. RESEND_FROM sets the sender, e.g.
 * "Aaya Perfume <hello@yourdomain.com>" on a domain verified in Resend.
 * Without a verified domain, Resend only allows the test sender
 * onboarding@resend.dev, which can deliver to your own Resend account
 * email only.
 *
 * Every path fails softly. A mail outage must never block a paid order or
 * a sign-in; the order is already saved by the time we get here.
 */

type Result = { sent: boolean; reason?: "not-configured" | "provider"; detail?: string };

type Message = { to: string; subject: string; html: string; text: string };

const FROM_FALLBACK = "Aaya Perfume <onboarding@resend.dev>";

function from(): string {
  return process.env.RESEND_FROM?.trim() || FROM_FALLBACK;
}

/** Which provider is active, for display on the dev email page. */
export function activeProvider(): "Resend" | null {
  return process.env.RESEND_API_KEY ? "Resend" : null;
}

export async function sendEmail(msg: Message): Promise<Result> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    console.info("[mail] RESEND_API_KEY is not set — skipped", msg.subject);
    return { sent: false, reason: "not-configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: from(),
        to: msg.to,
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
      }),
    });
    if (!res.ok) {
      const detail = await res.text();
      console.error("[mail] Resend rejected:", res.status, detail);
      return { sent: false, reason: "provider", detail: `Resend ${res.status}: ${detail.slice(0, 300)}` };
    }
    console.info("[mail] Resend accepted:", msg.subject, "->", msg.to);
    return { sent: true };
  } catch (err) {
    console.error("[mail] Resend request failed:", err);
    return { sent: false, reason: "provider", detail: "Could not reach Resend." };
  }
}

/** Sends the order confirmation for a placed order. */
export async function sendOrderConfirmation(order: Order) {
  return sendEmail(orderConfirmationEmail(order));
}

/** Sends the "welcome to Aaya" email when an account is created. */
export async function sendWelcome(to: string, name: string) {
  return sendEmail(welcomeEmail(name, to));
}
