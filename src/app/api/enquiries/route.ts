import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createServiceClient } from "@/lib/supabase/admin";
import { enquirySchema, validateUpload } from "@/lib/validations/enquiry";
import { notifyEnquiry } from "@/lib/email/notify";

export const runtime = "nodejs";

/** Very small in-memory throttle (per server instance). Use a shared store for strict limits. */
const hits = new Map<string, number[]>();
function throttled(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 8;
}

function enquiryNumber() {
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  return `CT-${ymd}-${randomUUID().slice(0, 5).toUpperCase()}`;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (throttled(ip)) {
    return NextResponse.json({ ok: false, error: "Too many submissions. Please try again shortly." }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  let rawItems: unknown = [];
  try {
    rawItems = JSON.parse(String(form.get("items") ?? "[]"));
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid product list." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse({
    source: form.get("source") ?? "quote",
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
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", fieldErrors }, { status: 422 });
  }
  const data = parsed.data;

  const file = form.get("file");
  const upload = file instanceof File && file.size > 0 ? file : null;
  if (upload) {
    const problem = validateUpload(upload);
    if (problem) return NextResponse.json({ ok: false, error: problem, fieldErrors: { file: problem } }, { status: 422 });
  }

  const num = enquiryNumber();
  const db = createServiceClient();

  // Local development / no Supabase: validate, but be explicit that nothing was stored.
  if (!db) {
    console.warn(`[enquiries] Supabase not configured; enquiry ${num} was validated but NOT persisted.`);
    return NextResponse.json({ ok: true, persisted: false, enquiryNumber: num, mode: "demo" });
  }

  let logoPath: string | null = null;
  if (upload) {
    const ext = upload.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
    logoPath = `${num}/${randomUUID()}.${ext}`;
    const { error } = await db.storage
      .from("enquiry-uploads")
      .upload(logoPath, Buffer.from(await upload.arrayBuffer()), { contentType: upload.type || "application/octet-stream" });
    if (error) {
      console.error("[enquiries] upload failed:", error.message);
      return NextResponse.json({ ok: false, error: "We could not store your file. Please try again or submit without it." }, { status: 502 });
    }
  }

  const { data: row, error } = await db
    .from("enquiries")
    .insert({
      enquiry_number: num,
      customer_name: data.customerName,
      company_name: data.companyName,
      email: data.email,
      phone: data.phone,
      quantity: data.items.reduce((s, i) => s + i.quantity, 0) || null,
      budget_range: data.budgetRange || null,
      delivery_date: data.deliveryDate || null,
      customization_requirements: data.customizationRequirements || null,
      notes: data.source === "contact" ? `[Contact form] ${data.notes}` : data.notes || null,
      logo_path: logoPath,
      status: "new",
    })
    .select("id")
    .single();

  if (error || !row) {
    console.error("[enquiries] insert failed:", error?.message);
    return NextResponse.json({ ok: false, error: "We could not save your enquiry. Please try again." }, { status: 500 });
  }

  if (data.items.length) {
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
  }

  let signed: string | null = null;
  if (logoPath) {
    const { data: s } = await db.storage.from("enquiry-uploads").createSignedUrl(logoPath, 60 * 60 * 24 * 7);
    signed = s?.signedUrl ?? null;
  }
  const mail = await notifyEnquiry(num, data, signed);

  return NextResponse.json({ ok: true, persisted: true, enquiryNumber: num, emailSent: mail.adminSent });
}
