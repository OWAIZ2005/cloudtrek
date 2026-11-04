import "server-only";
import type { EnquiryInput } from "@/lib/validations/enquiry";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export interface NotifyResult {
  adminSent: boolean;
  customerSent: boolean;
  skipped?: "not-configured";
}

/**
 * Sends the admin notification (and an optional customer receipt) through Resend.
 * Requires RESEND_API_KEY, EMAIL_FROM and ADMIN_NOTIFY_EMAIL. Without them the
 * enquiry is still saved and this function reports `skipped`.
 */
export async function notifyEnquiry(num: string, e: EnquiryInput, logoUrl?: string | null): Promise<NotifyResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = process.env.ADMIN_NOTIFY_EMAIL;
  if (!key || !from || !to) return { adminSent: false, customerSent: false, skipped: "not-configured" };

  const rows = e.items
    .map((i) => `<tr><td style="padding:6px 12px 6px 0">${esc(i.productName)}</td><td style="padding:6px 0"><b>${i.quantity}</b></td></tr>`)
    .join("");
  const html = `
    <div style="font-family:Arial,sans-serif;color:#20242B;max-width:560px">
      <h2 style="color:#173B70;margin:0 0 4px">New ${e.source === "contact" ? "contact message" : "quote enquiry"} ${esc(num)}</h2>
      <p style="margin:0 0 16px;color:#5b6270">${esc(e.customerName)} · ${esc(e.companyName)}</p>
      <p><b>Email:</b> ${esc(e.email)}<br/><b>Phone:</b> ${esc(e.phone)}${e.budgetRange ? `<br/><b>Budget:</b> ${esc(e.budgetRange)}` : ""}${e.deliveryDate ? `<br/><b>Required by:</b> ${esc(e.deliveryDate)}` : ""}</p>
      ${rows ? `<table style="border-collapse:collapse">${rows}</table>` : ""}
      ${e.customizationRequirements ? `<p><b>Customization:</b><br/>${esc(e.customizationRequirements)}</p>` : ""}
      ${e.notes ? `<p><b>Notes:</b><br/>${esc(e.notes)}</p>` : ""}
      ${logoUrl ? `<p><b>Uploaded file:</b> <a href="${esc(logoUrl)}">open (signed link)</a></p>` : ""}
    </div>`;

  const send = async (payload: Record<string, unknown>) => {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, ...payload }),
    });
    return res.ok;
  };

  const adminSent = await send({ to: [to], reply_to: e.email, subject: `[Cloud Trek] New enquiry ${num} · ${e.companyName}`, html }).catch(() => false);
  const customerSent = await send({
    to: [e.email],
    subject: `We received your enquiry ${num}`,
    html: `<div style="font-family:Arial,sans-serif;color:#20242B"><h2 style="color:#173B70">Thank you, ${esc(e.customerName)}.</h2><p>We have received your enquiry <b>${esc(num)}</b> and will come back to you with a quotation.</p><p>Cloud Trek</p></div>`,
  }).catch(() => false);

  return { adminSent, customerSent };
}
