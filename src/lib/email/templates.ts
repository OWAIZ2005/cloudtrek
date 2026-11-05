import "server-only";
import { emailConfig } from "./config";

/* Every user-supplied value goes through esc() before it touches HTML. */
export const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"'`]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#96;" })[c]!);

const nl2br = (s: string) => esc(s).replace(/\r?\n/g, "<br/>");
const NAVY = "#173B70";
const RED = "#C43B43";

export interface EnquiryEmailData {
  reference: string;
  createdAt: Date;
  customerName: string;
  companyName: string;
  email: string;
  phone: string;
  items: { productName: string; quantity: number; customizationNotes?: string }[];
  customizationRequirements?: string;
  budgetRange?: string;
  deliveryDate?: string;
  notes?: string;
  attachmentUrl?: string | null;
  adminUrl?: string | null;
}

export interface ContactEmailData {
  reference: string;
  createdAt: Date;
  customerName: string;
  email: string;
  phone?: string;
  companyName?: string;
  subject?: string;
  message: string;
  adminUrl?: string | null;
}

const fmt = (d: Date) => `${d.toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short", timeZone: "Asia/Bahrain" })} (Bahrain time)`;

const row = (label: string, value: string, raw = false) =>
  value
    ? `<tr><td style="padding:10px 14px;border-bottom:1px solid #E9EAEC;width:34%;color:#5B6270;font:600 12px Arial,sans-serif;text-transform:uppercase;letter-spacing:.06em;vertical-align:top">${esc(label)}</td><td style="padding:10px 14px;border-bottom:1px solid #E9EAEC;color:#20242B;font:14px/1.5 Arial,sans-serif">${raw ? value : esc(value)}</td></tr>`
    : "";

function shell(title: string, reference: string, body: string, footerNote: string) {
  const site = emailConfig().siteUrl;
  return `<!doctype html><html><body style="margin:0;background:#F7F7F5;padding:24px 12px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center">
<table role="presentation" width="620" cellspacing="0" cellpadding="0" style="max-width:620px;width:100%;background:#FFFFFF;border:1px solid #E9EAEC">
<tr><td style="padding:22px 24px;border-bottom:3px solid ${NAVY}"><img src="${esc(site)}/images/brand/cloudtrek-logo-navbar.png" alt="Cloud Trek" height="56" style="display:block;height:56px;width:auto"/></td></tr>
<tr><td style="padding:24px 24px 8px"><p style="margin:0 0 6px;color:${RED};font:700 11px Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase">${esc(title)}</p>
<h1 style="margin:0;color:${NAVY};font:700 22px Arial,sans-serif">Reference ${esc(reference)}</h1></td></tr>
<tr><td style="padding:8px 24px 24px">${body}</td></tr>
<tr><td style="padding:16px 24px;background:#F7F7F5;color:#5B6270;font:12px/1.5 Arial,sans-serif">${footerNote}</td></tr>
</table></td></tr></table></body></html>`;
}

const h2 = (t: string) => `<h2 style="margin:22px 0 8px;color:${NAVY};font:700 15px Arial,sans-serif">${t}</h2>`;
const para = (t: string) => `<p style="margin:0;font:14px/1.6 Arial,sans-serif;color:#20242B">${nl2br(t)}</p>`;
const adminButton = (url: string) =>
  `<p style="margin:18px 0 0"><a href="${esc(url)}" style="display:inline-block;background:${NAVY};color:#fff;padding:11px 18px;text-decoration:none;font:700 13px Arial,sans-serif">View in admin dashboard</a></p>`;

export function enquiryEmail(d: EnquiryEmailData) {
  const items = d.items
    .map(
      (i) =>
        `<tr><td style="padding:9px 14px;border-bottom:1px solid #E9EAEC;font:14px Arial,sans-serif;color:#20242B">${esc(i.productName)}${i.customizationNotes ? `<br/><span style="color:#5B6270;font-size:12px">${esc(i.customizationNotes)}</span>` : ""}</td><td align="right" style="padding:9px 14px;border-bottom:1px solid #E9EAEC;font:700 14px Arial,sans-serif;color:${NAVY};white-space:nowrap">&times; ${esc(i.quantity)}</td></tr>`,
    )
    .join("");
  const total = d.items.reduce((s, i) => s + i.quantity, 0);
  const body = `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #E9EAEC;margin-top:12px">
${row("Received", fmt(d.createdAt))}${row("Customer", d.customerName)}${row("Company", d.companyName)}
${row("Email", `<a href="mailto:${esc(d.email)}" style="color:${NAVY}">${esc(d.email)}</a>`, true)}
${row("Phone", d.phone)}${row("Budget", d.budgetRange ?? "")}${row("Required by", d.deliveryDate ?? "")}
</table>
${h2(`Requested products (${d.items.length}) &middot; ${esc(total)} units in total`)}
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #E9EAEC">${items}</table>
${d.customizationRequirements ? h2("Customization requirements") + para(d.customizationRequirements) : ""}
${d.notes ? h2("Additional notes") + para(d.notes) : ""}
${d.attachmentUrl ? `<p style="margin:22px 0 0;font:14px Arial,sans-serif"><a href="${esc(d.attachmentUrl)}" style="color:${RED};font-weight:700">Open uploaded logo / reference file</a> <span style="color:#5B6270;font-size:12px">(secure link, expires in 7 days)</span></p>` : ""}
${d.adminUrl ? adminButton(d.adminUrl) : ""}`;
  const html = shell("New quote enquiry", d.reference, body, "Reply to this email to respond directly to the customer. Sent automatically by the Cloud Trek website.");
  const text = [
    `New Quote Enquiry ${d.reference}`,
    `Received: ${fmt(d.createdAt)}`,
    `Customer: ${d.customerName}`,
    `Company: ${d.companyName}`,
    `Email: ${d.email}`,
    `Phone: ${d.phone}`,
    d.budgetRange ? `Budget: ${d.budgetRange}` : "",
    d.deliveryDate ? `Required by: ${d.deliveryDate}` : "",
    "Products:",
    ...d.items.map((i) => `- ${i.productName} x ${i.quantity}${i.customizationNotes ? ` (${i.customizationNotes})` : ""}`),
    d.customizationRequirements ? `Customization: ${d.customizationRequirements}` : "",
    d.notes ? `Notes: ${d.notes}` : "",
    d.attachmentUrl ? `File: ${d.attachmentUrl}` : "",
    d.adminUrl ? `Admin: ${d.adminUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return { html, text };
}

export function contactEmail(d: ContactEmailData) {
  const body = `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #E9EAEC;margin-top:12px">
${row("Received", fmt(d.createdAt))}${row("Name", d.customerName)}
${row("Email", `<a href="mailto:${esc(d.email)}" style="color:${NAVY}">${esc(d.email)}</a>`, true)}
${row("Phone", d.phone ?? "")}${row("Company", d.companyName ?? "")}${row("Subject", d.subject ?? "")}
</table>
${h2("Message")}
<div style="padding:14px;background:#F7F7F5;border-left:3px solid ${RED};font:14px/1.7 Arial,sans-serif;color:#20242B">${nl2br(d.message)}</div>
${d.adminUrl ? adminButton(d.adminUrl) : ""}`;
  const html = shell("New contact message", d.reference, body, "Reply to this email to respond directly to the sender. Sent automatically by the Cloud Trek website.");
  const text = [
    `New Contact Message ${d.reference}`,
    `Received: ${fmt(d.createdAt)}`,
    `Name: ${d.customerName}`,
    `Email: ${d.email}`,
    d.phone ? `Phone: ${d.phone}` : "",
    d.companyName ? `Company: ${d.companyName}` : "",
    d.subject ? `Subject: ${d.subject}` : "",
    "",
    d.message,
    d.adminUrl ? `Admin: ${d.adminUrl}` : "",
  ]
    .filter((l) => l !== "")
    .join("\n");
  return { html, text };
}

/** Optional receipt for the customer (bilingual, no internal details). */
export function customerReceipt(name: string, reference: string) {
  const html = shell(
    "Thank you",
    reference,
    `<p style="font:15px/1.7 Arial,sans-serif;color:#20242B">Dear ${esc(name)},<br/>We have received your request and our team will get back to you shortly.</p><p dir="rtl" style="font:15px/1.9 Arial,sans-serif;color:#20242B">عزيزي ${esc(name)}،<br/>استلمنا طلبك وسيتواصل معك فريقنا قريباً.</p>`,
    "Cloud Trek · Kingdom of Bahrain",
  );
  const text = `Dear ${name},\nWe have received your request (${reference}) and will get back to you shortly.\n\nعزيزي ${name}،\nاستلمنا طلبك (${reference}) وسيتواصل معك فريقنا قريباً.`;
  return { html, text };
}
