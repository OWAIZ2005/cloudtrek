import "server-only";
import { emailConfig } from "./config";
import { safeHeader, sendEmail, type SendResult } from "./send";
import { contactEmail, customerReceipt, enquiryEmail, type ContactEmailData, type EnquiryEmailData } from "./templates";

export type EmailOutcome = { status: "sent" | "failed"; error: string | null };

const outcome = (r: SendResult): EmailOutcome => (r.ok ? { status: "sent", error: null } : { status: "failed", error: r.error });

/** Sends the team notification for a quote enquiry. Status is "sent" only when the provider accepted it. */
export async function notifyEnquiry(d: EnquiryEmailData): Promise<EmailOutcome> {
  const c = emailConfig();
  const { html, text } = enquiryEmail(d);
  const r = await sendEmail({
    to: c.to,
    subject: `New Quote Enquiry — Cloud Trek — ${safeHeader(d.companyName || d.customerName, 90)}`,
    html,
    text,
    replyTo: d.email,
  });
  if (r.ok && c.customerConfirmation) {
    // Best-effort receipt; it never changes the team-notification status.
    await sendEmail({ to: d.email, subject: `We received your enquiry ${d.reference} — Cloud Trek`, ...customerReceipt(d.customerName, d.reference) });
  }
  return outcome(r);
}

export async function notifyContact(d: ContactEmailData): Promise<EmailOutcome> {
  const c = emailConfig();
  const { html, text } = contactEmail(d);
  const r = await sendEmail({
    to: c.to,
    subject: `New Contact Message — Cloud Trek — ${safeHeader(d.customerName, 90)}`,
    html,
    text,
    replyTo: d.email,
  });
  if (r.ok && c.customerConfirmation) {
    await sendEmail({ to: d.email, subject: `We received your message ${d.reference} — Cloud Trek`, ...customerReceipt(d.customerName, d.reference) });
  }
  return outcome(r);
}
