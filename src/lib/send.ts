import "server-only";
import { orderConfirmationEmail, welcomeEmail } from "@/lib/mail-template";
import type { Order } from "@/lib/orders";

/**
 * Email delivery, independent of the provider.
 *
 * The provider is chosen by whichever credentials are present, in this
 * order: Mailgun (the HNG Stage 2 requirement), Resend, then plain SMTP. The email content itself lives
 * in mail-template.ts and knows nothing about providers, so switching
 * services is a change of environment variables rather than code.
 *
 * Every path fails softly. A mail outage must never block a paid order —
 * the order is already saved by the time we get here.
 */

type Result = { sent: boolean; reason?: "not-configured" | "provider"; detail?: string };

const FROM_FALLBACK = "Aaya Perfume <orders@example.com>";

const hasMailgun = () => Boolean(process.env.MAILGUN_DOMAIN && process.env.MAILGUN_API_KEY);

function from(): string {
  if (hasMailgun()) {
    return process.env.MAILGUN_FROM || `Aaya Perfume <postmaster@${process.env.MAILGUN_DOMAIN}>`;
  }
  return (
    process.env.RESEND_FROM ||
    process.env.SMTP_FROM ||
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
  const domain = process.env.MAILGUN_DOMAIN!.trim();
  const auth = Buffer.from(`api:${process.env.MAILGUN_API_KEY!.trim()}`).toString(
    "base64"
  );
  // EU-region Mailgun domains live on a different host.
  const base =
    process.env.MAILGUN_API_BASE ||
    (process.env.MAILGUN_REGION?.toLowerCase() === "eu"
      ? "https://api.eu.mailgun.net"
      : "https://api.mailgun.net");

  // Mailgun's messages API takes form fields, not JSON.
  const body = new URLSearchParams({
    from: from(),
    to: msg.to,
    subject: msg.subject,
    html: msg.html,
    text: msg.text,
  });

  const res = await fetch(`${base}/v3/${domain}/messages`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}` },
    body,
  });
  if (!res.ok) {
    const detail = await res.text();
    console.error("[mail] Mailgun rejected:", res.status, detail);
    return { sent: false, reason: "provider", detail: `Mailgun ${res.status}: ${detail.slice(0, 300)}` };
  }
  console.info("[mail] Mailgun accepted:", msg.subject, "->", msg.to);
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
  if (hasMailgun()) return "Mailgun";
  if (process.env.RESEND_API_KEY) return "Resend";
  if (process.env.SMTP_HOST) return "SMTP";
  return null;
}

export async function sendEmail(msg: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<Result> {
  if (hasMailgun()) return sendViaMailgun(msg);
  if (process.env.RESEND_API_KEY) return sendViaResend(msg);
  if (process.env.SMTP_HOST) return sendViaSmtp(msg);

  console.info("[mail] No email provider configured — skipped", msg.subject);
  return { sent: false, reason: "not-configured" };
}

/** Sends the order confirmation for a placed order. */
export async function sendOrderConfirmation(order: Order) {
  return sendEmail(orderConfirmationEmail(order));
}
/** Sends the "welcome to Aaya" email when an account is created. */
export async function sendWelcome(to: string, name: string) {
  return sendEmail(welcomeEmail(name, to));
}
