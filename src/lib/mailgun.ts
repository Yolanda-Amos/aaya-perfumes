import "server-only";
import { env, isMailgunConfigured, siteUrl } from "@/lib/env";
import type { Order, OrderItem } from "@/lib/orders";
import { money } from "@/lib/orders";

const IVORY = "#fbf7f1";
const ESPRESSO = "#1e1a17";
const GOLD = "#b08d57";
const TAUPE = "#6e655b";
const LINE = "#e3d9cb";

function shell(title: string, inner: string) {
  return `<!doctype html>
<html><body style="margin:0;background:${IVORY};padding:32px 16px;
  font-family:Georgia,'Times New Roman',serif;color:${ESPRESSO};">
  <div style="max-width:560px;margin:0 auto;background:#fff;padding:36px 32px;
    border:1px solid ${LINE};">
    <p style="font-family:'Snell Roundhand','Segoe Script',cursive;font-size:34px;
      line-height:1;margin:0 0 4px;color:${ESPRESSO};">Aaya</p>
    <p style="font-size:10px;letter-spacing:.3em;color:${GOLD};margin:0 0 28px;">
      PARFUMS</p>
    <h1 style="font-weight:300;font-size:28px;line-height:1.2;margin:0 0 24px;">${title}</h1>
    ${inner}
    <p style="font-size:12px;color:${TAUPE};margin-top:32px;border-top:1px solid ${LINE};
      padding-top:16px;line-height:1.7;">
      Aaya Perfumes · Dubai, UAE<br/>
      <a href="${siteUrl}" style="color:${GOLD};">${siteUrl.replace(/^https?:\/\//, "")}</a>
    </p>
  </div>
</body></html>`;
}

function row(label: string, value: string, strong = false) {
  return `<tr>
    <td style="padding:7px 0;font-size:14px;color:${TAUPE};">${label}</td>
    <td style="padding:7px 0;font-size:14px;text-align:right;color:${ESPRESSO};${
      strong ? "font-weight:bold;" : ""
    }">${value}</td>
  </tr>`;
}

/** Sends the order confirmation. Fails softly so a mail outage never
 *  blocks a paid order — the order is already saved either way. */
export async function sendOrderConfirmation(order: Order) {
  if (!isMailgunConfigured) {
    console.info("[mail] Mailgun not configured — skipping confirmation for", order.reference);
    return { sent: false, reason: "not-configured" as const };
  }

  const lines = order.items
    .map((i: OrderItem) =>
      row(`${i.name} · ${i.size_ml}ml roll-on`, `${money(i.unit_minor * i.qty)}`)
    )
    .join("");

  const html = shell(
    `Thank you, ${order.customer_name.split(" ")[0]}`,
    `<p style="font-size:15px;line-height:1.7;color:${TAUPE};margin:0 0 24px;">
      Your order <strong style="color:${ESPRESSO};">${order.reference}</strong> is
      confirmed. Two samples are packed alongside your bottles, and you will get a
      second email the moment the parcel leaves us.
    </p>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid ${LINE};
      padding-top:8px;">${lines}
      ${row("Subtotal", money(order.subtotal_minor))}
      ${row("Delivery", order.shipping_minor === 0 ? "Free" : money(order.shipping_minor))}
      ${row("Total", money(order.total_minor), true)}
    </table>
    <p style="margin:28px 0 0;">
      <a href="${siteUrl}/orders/${order.reference}"
        style="display:inline-block;background:${ESPRESSO};color:${IVORY};
        text-decoration:none;padding:13px 26px;font-size:14px;">View your order</a>
    </p>
    <p style="font-size:14px;line-height:1.7;color:${TAUPE};margin:24px 0 0;">
      Delivering to ${order.shipping_address}
    </p>`
  );


  const auth = Buffer.from(
    `api:${env("MAILGUN_API_KEY")}`
  ).toString("base64");

  const res = await fetch(
    `https://api.mailgun.net/v3/${env("MAILGUN_DOMAIN")}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env("MAILGUN_FROM", "Aaya Perfumes <orders@mail.example.com>"),
        to: order.customer_email,
        subject: `Order ${order.reference} confirmed — Aaya Perfumes`,
        html,
        text: `Thank you, ${order.customer_name}. Order ${order.reference} is confirmed. Total: ${money(order.total_minor)}. Two samples are included. Track it at ${siteUrl}/orders/${order.reference}`,
      }),
    }
  );

  if (!res.ok) {
    const detail = await res.text();
    console.error("[mail] Mailgun rejected the message:", res.status, detail);
    return { sent: false, reason: "provider" as const };
  }
  return { sent: true as const };
}
