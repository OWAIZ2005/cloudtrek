import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createServiceClient } from "@/lib/supabase/admin";
import { enquirySchema, validateUpload } from "@/lib/validations/enquiry";
import { notifyEnquiry } from "@/lib/email/notify";
import { emailConfig } from "@/lib/email/config";
import { clientIp, isRateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

const fail = (error: string, status: number, fieldErrors?: Record<string, string>) =>
  NextResponse.json({ ok: false, error, ...(fieldErrors ? { fieldErrors } : {}) }, { status });

function reference() {
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  return `CT-${ymd}-${randomUUID().slice(0, 5).toUpperCase()}`;
}

/**
 * Quote enquiry. Flow: validate -> save to Supabase -> send team email -> record
 * email status -> respond. If the email fails the enquiry is KEPT and marked
 * `failed` so it can be retried from the admin dashboard.
 * Error values are stable codes; the client translates them (messages.quote.errors).
 */
export async function POST(req: Request) {
  if (isRateLimited(`enq:${clientIp(req)}`, 8, 10 * 60_000)) return fail("rate", 429);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail("invalid", 400);
  }

  let rawItems: unknown = [];
  try {
    rawItems = JSON.parse(String(form.get("items") ?? "[]"));
  } catch {
    return fail("invalid", 400);
  }

  const parsed = enquirySchema.safeParse({
    customerName: form.get("customerName") ?? "",
    companyName: form.get("companyName") ?? "",
    email: form.get("email") ?? "",
    phone: form.get("phone") ?? "",
    budgetRange: form.get("budgetRange") ?? "",
    deliveryDate: form.get("deliveryDate") ?? "",
    customizationRequirements: form.get("customizationRequirements") ?? "",
    notes: form.get("notes") ?? "",
    items: rawItems,
    website: form.get("website") ?? "",
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0] ?? "form")] ??= issue.message;
    return fail("fields", 422, fieldErrors);
  }
  const data = parsed.data;

  const file = form.get("file");
  const upload = file instanceof File && file.size > 0 ? file : null;
  if (upload) {
    const problem = validateUpload(upload);
    if (problem) return fail(problem, 422, { file: problem });
  }

  const ref = reference();
  const createdAt = new Date();
  const db = createServiceClient();
  const cfg = emailConfig();

  const emailPayload = (attachmentUrl: string | null, id?: string) => ({
    reference: ref,
    createdAt,
    customerName: data.customerName,
    companyName: data.companyName,
    email: data.email,
    phone: data.phone,
    items: data.items,
    customizationRequirements: data.customizationRequirements,
    budgetRange: data.budgetRange,
    deliveryDate: data.deliveryDate,
    notes: data.notes,
    attachmentUrl,
    adminUrl: id ? `${cfg.siteUrl}/admin/enquiries/${id}` : null,
  });

  // Database not connected: still try to notify the team, but report honestly that nothing was stored.
  if (!db) {
    console.warn(`[enquiries] Supabase not configured; ${ref} was NOT persisted.`);
    const mail = await notifyEnquiry(emailPayload(null));
    return NextResponse.json({ ok: true, persisted: false, reference: ref, emailStatus: mail.status });
  }

  let logoPath: string | null = null;
  if (upload) {
    const ext = upload.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
    logoPath = `${ref}/${randomUUID()}.${ext}`;
    const { error } = await db.storage
      .from("enquiry-uploads")
      .upload(logoPath, Buffer.from(await upload.arrayBuffer()), { contentType: upload.type || "application/octet-stream" });
    if (error) {
      console.error("[enquiries] upload failed:", error.message);
      return fail("upload", 502);
    }
  }

  const { data: row, error } = await db
    .from("enquiries")
    .insert({
      enquiry_number: ref,
      customer_name: data.customerName,
      company_name: data.companyName,
      email: data.email,
      phone: data.phone,
      quantity: data.items.reduce((s, i) => s + i.quantity, 0) || null,
      budget_range: data.budgetRange || null,
      delivery_date: data.deliveryDate || null,
      customization_requirements: data.customizationRequirements || null,
      notes: data.notes || null,
      logo_path: logoPath,
      status: "new",
      email_status: "pending",
    })
    .select("id")
    .single();

  if (error || !row) {
    console.error("[enquiries] insert failed:", error?.message);
    return fail("server", 500);
  }

  const { error: itemsErr } = await db.from("enquiry_items").insert(
    data.items.map((i) => ({
      enquiry_id: row.id,
      product_id: i.productId && /^[0-9a-f-]{36}$/i.test(i.productId) ? i.productId : null,
      product_name: i.productName,
      quantity: i.quantity,
      customization_notes: i.customizationNotes || null,
    })),
  );
  if (itemsErr) console.error("[enquiries] items insert failed:", itemsErr.message);

  let signed: string | null = null;
  if (logoPath) {
    const { data: s } = await db.storage.from("enquiry-uploads").createSignedUrl(logoPath, 60 * 60 * 24 * 7);
    signed = s?.signedUrl ?? null;
  }

  const mail = await notifyEnquiry(emailPayload(signed, row.id));
  const { error: updErr } = await db
    .from("enquiries")
    .update({
      email_status: mail.status,
      email_error: mail.error,
      email_sent_at: mail.status === "sent" ? new Date().toISOString() : null,
      email_attempts: 1,
    })
    .eq("id", row.id);
  if (updErr) console.error("[enquiries] email status update failed:", updErr.message);

  return NextResponse.json({ ok: true, persisted: true, reference: ref, emailStatus: mail.status });
}
