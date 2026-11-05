import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createServiceClient } from "@/lib/supabase/admin";
import { contactSchema } from "@/lib/validations/enquiry";
import { notifyContact } from "@/lib/email/notify";
import { emailConfig } from "@/lib/email/config";
import { clientIp, isRateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

const fail = (error: string, status: number, fieldErrors?: Record<string, string>) =>
  NextResponse.json({ ok: false, error, ...(fieldErrors ? { fieldErrors } : {}) }, { status });

function reference() {
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  return `CM-${ymd}-${randomUUID().slice(0, 5).toUpperCase()}`;
}

/** Contact / "Talk to us" form: validate -> save -> email -> record email status -> respond. */
export async function POST(req: Request) {
  if (isRateLimited(`contact:${clientIp(req)}`, 6, 10 * 60_000)) return fail("rate", 429);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail("invalid", 400);
  }

  const parsed = contactSchema.safeParse({
    customerName: form.get("customerName") ?? "",
    email: form.get("email") ?? "",
    phone: form.get("phone") ?? "",
    companyName: form.get("companyName") ?? "",
    subject: form.get("subject") ?? "",
    message: form.get("message") ?? "",
    website: form.get("website") ?? "",
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0] ?? "form")] ??= issue.message;
    return fail("fields", 422, fieldErrors);
  }
  const data = parsed.data;

  const ref = reference();
  const createdAt = new Date();
  const db = createServiceClient();
  const cfg = emailConfig();
  const payload = (id?: string) => ({
    reference: ref,
    createdAt,
    customerName: data.customerName,
    email: data.email,
    phone: data.phone || undefined,
    companyName: data.companyName || undefined,
    subject: data.subject || undefined,
    message: data.message,
    adminUrl: id ? `${cfg.siteUrl}/admin/messages/${id}` : null,
  });

  if (!db) {
    console.warn(`[contact] Supabase not configured; ${ref} was NOT persisted.`);
    const mail = await notifyContact(payload());
    return NextResponse.json({ ok: true, persisted: false, reference: ref, emailStatus: mail.status });
  }

  const { data: row, error } = await db
    .from("contact_messages")
    .insert({
      reference_number: ref,
      customer_name: data.customerName,
      email: data.email,
      phone: data.phone || null,
      company_name: data.companyName || null,
      subject: data.subject || null,
      message: data.message,
      email_status: "pending",
    })
    .select("id")
    .single();
  if (error || !row) {
    console.error("[contact] insert failed:", error?.message);
    return fail("server", 500);
  }

  const mail = await notifyContact(payload(row.id));
  const { error: updErr } = await db
    .from("contact_messages")
    .update({
      email_status: mail.status,
      email_error: mail.error,
      email_sent_at: mail.status === "sent" ? new Date().toISOString() : null,
      email_attempts: 1,
    })
    .eq("id", row.id);
  if (updErr) console.error("[contact] email status update failed:", updErr.message);

  return NextResponse.json({ ok: true, persisted: true, reference: ref, emailStatus: mail.status });
}
