import { money, type Order, type OrderItem } from "@/lib/orders";
import { siteUrl } from "@/lib/env";

// Matches the site: ivory page, espresso band, antique brass accents.
const IVORY = "#faf7f2";
const ESPRESSO = "#302824";
const NIGHT = "#2b231f";
const GOLD = "#b89462";
const TAUPE = "#80756d";
const LINE = "#e8e1d8";
const SERIF = "'Cormorant Garamond',Georgia,'Times New Roman',serif";
const SANS = "Manrope,'Segoe UI',Helvetica,Arial,sans-serif";

function shell(title: string, inner: string) {
  return `<!doctype html>
<html><head><meta name="viewport" content="width=device-width,initial-scale=1"/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&family=Manrope:wght@400;600&display=swap" rel="stylesheet"/></head>
<body style="margin:0;background:${IVORY};padding:28px 14px;font-family:${SANS};color:${ESPRESSO};">
  <div style="max-width:560px;margin:0 auto;background:#fffefb;border:1px solid ${LINE};border-radius:20px;overflow:hidden;">
    <div style="background:${NIGHT};padding:26px 32px;">
      <p style="margin:0;font-family:${SANS};font-size:15px;letter-spacing:.34em;color:${IVORY};">AAYA</p>
    </div>
    <div style="padding:34px 32px 30px;">
      <h1 style="font-family:${SERIF};font-weight:500;font-size:34px;line-height:1.1;margin:0;color:${ESPRESSO};">${title}</h1>
      <div style="width:64px;height:1px;background:${GOLD};margin:20px 0 24px;"></div>
      ${inner}
      <p style="font-size:12px;color:${TAUPE};margin:32px 0 0;border-top:1px solid ${LINE};padding-top:16px;line-height:1.7;">
        Aaya Perfume, Lagos, Nigeria<br/>
        <a href="${siteUrl}" style="color:${GOLD};">${siteUrl.replace(/^https?:\/\//, "")}</a>
      </p>
    </div>
  </div>
</body></html>`;
}

function button(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;background:${NIGHT};color:${IVORY};text-decoration:none;padding:13px 26px;border-radius:999px;font-size:14px;font-weight:600;">${label}</a>`;
}

function row(label: string, value: string, strong = false) {
  return `<tr>
    <td style="padding:7px 0;font-size:14px;color:${TAUPE};">${label}</td>
    <td style="padding:7px 0;font-size:14px;text-align:right;color:${ESPRESSO};${
      strong ? "font-weight:bold;" : ""
    }">${value}</td>
  </tr>`;
}

/** The confirmation email content. Provider-independent — see send.ts. */
export function orderConfirmationEmail(order: Order) {
  const lines = order.items
    .map((i: OrderItem) =>
      row(`${i.name}, ${i.size_ml}ml roll-on × ${i.qty}`, `${money(i.unit_minor * i.qty)}`)
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
      ${button(`${siteUrl}/orders/${order.reference}`, "View your order")}
    </p>
    <p style="font-size:14px;line-height:1.7;color:${TAUPE};margin:24px 0 0;">
      Delivering to ${order.shipping_address}
    </p>`
  );

  const text = `Thank you, ${order.customer_name}. Order ${
    order.reference
  } is confirmed.

${order.items
  .map((i) => `${i.name} (${i.size_ml}ml) x${i.qty} — ${money(i.unit_minor * i.qty)}`)
  .join("\n")}

Subtotal: ${money(order.subtotal_minor)}
Delivery: ${order.shipping_minor === 0 ? "Free" : money(order.shipping_minor)}
Total: ${money(order.total_minor)}

Two samples are included. Track your order at ${siteUrl}/orders/${order.reference}

Aaya Perfume, Lagos, Nigeria`;

  return {
    to: order.customer_email,
    subject: `Order ${order.reference} confirmed — Aaya Perfume`,
    html,
    text,
  };
}
/** Sent once, when a customer's account is created (web or mobile). */
export function welcomeEmail(name: string, to: string) {
  const first = name.trim().split(/\s+/)[0] || "there";
  const html = shell(
    `Welcome to Aaya, ${first}`,
    `<p style="font-size:15px;line-height:1.75;color:${TAUPE};margin:0 0 18px;">
      Your account is ready. You signed in with Google, so there is no password to
      remember. Use the same account on the website and in the Aaya app, and your
      bag follows you between them.
    </p>
    <p style="font-size:15px;line-height:1.75;color:${TAUPE};margin:0 0 26px;">
      Not sure where to start? Our five-question scent quiz matches you to three of
      our 37 roll-ons and tells you why each one fits.
    </p>
    <p style="margin:0 0 12px;">${button(`${siteUrl}/#quiz`, "Find your scent")}</p>
    <p style="font-size:13px;line-height:1.7;color:${TAUPE};margin:22px 0 0;">
      Your orders and saved scents live at
      <a href="${siteUrl}/account" style="color:${GOLD};">your account</a>.
    </p>`
  );
  const text = `Welcome to Aaya, ${first}.

Your account is ready. You signed in with Google, so there is no password to remember. Use the same account on the website and in the Aaya app, and your bag follows you between them.

Find your scent: ${siteUrl}/#quiz
Your account: ${siteUrl}/account

Aaya Perfume, Lagos, Nigeria`;
  return { to, subject: "Welcome to Aaya Perfume", html, text };
}
