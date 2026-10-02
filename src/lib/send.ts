import "server-only";
import { orderConfirmationEmail } from "@/lib/mail-template";
import type { Order } from "@/lib/orders";

/**
 * Email delivery, independent of the provider.
 *
 * The provider is chosen by whichever credentials are present, in this
 * order: Resend, Mailgun, then plain SMTP. The email content itself lives
 * in mail-template.ts and knows nothing about providers, so switching
 * services is a change of environment variables rather than code.
 *
 * Every path fails softly. A mail outage must never block a paid order —
 * the order is already saved by the time we get here.
 */

type Result = { sent: boolean; reason?: "not-configured" | "provider" };

const FROM_FALLBACK = "Aaya Perfumes <orders@example.com>";

function from(): string {
  return (
    process.env.RESEND_FROM ??
    process.env.MAILGUN_FROM ??
    process.env.SMTP_FROM ??
    FROM_FALLBACK
  );
}

async function sendViaResend(msg: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<Result> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
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
    console.error("[mail] Resend rejected:", res.status, await res.text());
    return { sent: false, reason: "provider" };
  }
  return { sent: true };
}

async function sendViaMailgun(msg: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<Result> {
  const domain = process.env.MAILGUN_DOMAIN!;
  const auth = Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString(
    "base64"
  );

  const res = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
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
    console.error("[mail] Mailgun rejected:", res.status, await res.text());
    return { sent: false, reason: "provider" };
  }
  return { sent: true };
}

async function sendViaSmtp(msg: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<Result> {
  // Imported lazily so nodemailer is only needed when SMTP is the choice.
  const nodemailer = (await import("nodemailer")).default;
  const port = Number(process.env.SMTP_PORT ?? 587);

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });

  try {
    await transport.sendMail({ from: from(), ...msg });
    return { sent: true };
  } catch (err) {
    console.error("[mail] SMTP failed:", err);
    return { sent: false, reason: "provider" };
  }
}

/** Which provider is active, for display on the dev email page. */
export function activeProvider(): "Resend" | "Mailgun" | "SMTP" | null {
  if (process.env.RESEND_API_KEY) return "Resend";
  if (process.env.MAILGUN_DOMAIN && process.env.MAILGUN_API_KEY) return "Mailgun";
  if (process.env.SMTP_HOST) return "SMTP";
  return null;
}

export async function sendEmail(msg: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<Result> {
  if (process.env.RESEND_API_KEY) return sendViaResend(msg);
  if (process.env.MAILGUN_DOMAIN && process.env.MAILGUN_API_KEY)
    return sendViaMailgun(msg);
  if (process.env.SMTP_HOST) return sendViaSmtp(msg);

  console.info("[mail] No email provider configured — skipped", msg.subject);
  return { sent: false, reason: "not-configured" };
}

/** Sends the order confirmation for a placed order. */
export async function sendOrderConfirmation(order: Order) {
  return sendEmail(orderConfirmationEmail(order));
}