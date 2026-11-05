"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireAdminForWrite } from "@/lib/admin/auth";
import { createSessionClient } from "@/lib/supabase/server";
import { notifyContact, notifyEnquiry } from "@/lib/email/notify";
import { emailConfig } from "@/lib/email/config";
import { ENQUIRY_STATUSES, type Spec } from "@/types";

export type ActionState = { ok?: boolean; error?: string; message?: string } | undefined;

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 80);

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif"];
const MAX_IMAGE = 5 * 1024 * 1024;

const lines = (v: FormDataEntryValue | null) =>
  String(v ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
const parseSpecs = (v: FormDataEntryValue | null): Spec[] =>
  lines(v).map((l) => {
    const i = l.indexOf(":");
    return i > 0 ? { label: l.slice(0, i).trim(), value: l.slice(i + 1).trim() } : { label: l, value: "" };
  });

async function uploadImages(db: SupabaseClient, folder: string, files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const f of files) {
    if (!f || f.size === 0) continue;
    if (!IMAGE_TYPES.includes(f.type)) throw new Error(`"${f.name}" is not a supported image (PNG, JPG, WebP, AVIF).`);
    if (f.size > MAX_IMAGE) throw new Error(`"${f.name}" is larger than 5 MB.`);
    const ext = f.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `${folder}/${randomUUID()}.${ext}`;
    const { error } = await db.storage.from("catalogue").upload(path, Buffer.from(await f.arrayBuffer()), { contentType: f.type });
    if (error) throw new Error(`Image upload failed: ${error.message}`);
    urls.push(db.storage.from("catalogue").getPublicUrl(path).data.publicUrl);
  }
  return urls;
}

/** Arabic content typed in the admin forms (fields named ar_*) -> `translations` jsonb. Empty fields are omitted. */
function arTranslations(form: FormData, text: string[], lists: { key: string; kind: "specs" | "lines" }[] = []) {
  const ar: Record<string, unknown> = {};
  for (const k of text) {
    const v = String(form.get(`ar_${k}`) ?? "").trim();
    if (v) ar[k] = v;
  }
  for (const { key, kind } of lists) {
    const raw = form.get(`ar_${key}`);
    const v = kind === "specs" ? parseSpecs(raw) : lines(raw);
    if (v.length) ar[key] = v;
  }
  return Object.keys(ar).length ? { ar } : {};
}

const fail = (e: unknown): ActionState => ({ ok: false, error: e instanceof Error ? e.message : "Something went wrong." });

/* ------------------------------ Auth ------------------------------ */

export async function signIn(_: ActionState, form: FormData): Promise<ActionState> {
  const parsed = z.object({ email: z.email(), password: z.string().min(1) }).safeParse({
    email: String(form.get("email") ?? "").trim(),
    password: String(form.get("password") ?? ""),
  });
  if (!parsed.success) return { ok: false, error: "Enter a valid email and password." };
  const db = await createSessionClient();
  if (!db) return { ok: false, error: "Supabase is not configured." };
  const { data, error } = await db.auth.signInWithPassword(parsed.data);
  if (error || !data.user) return { ok: false, error: "Sign-in failed. Check your credentials." };
  if (data.user.app_metadata?.role !== "admin") {
    await db.auth.signOut();
    return { ok: false, error: "This account does not have admin access." };
  }
  redirect("/admin");
}

export async function signOut() {
  const db = await createSessionClient();
  await db?.auth.signOut();
  redirect("/admin/login");
}

/* ------------------------------ Products ------------------------------ */

export async function saveProduct(_: ActionState, form: FormData): Promise<ActionState> {
  try {
    const { db } = await requireAdminForWrite();
    const id = String(form.get("id") ?? "");
    const name = String(form.get("name") ?? "").trim();
    if (name.length < 2) return { ok: false, error: "Product name is required." };
    const slug = slugify(String(form.get("slug") ?? "") || name);
    if (!slug) return { ok: false, error: "A valid slug could not be generated." };

    const keep = form.getAll("keepImages").map(String);
    const added = await uploadImages(db, "products", form.getAll("newImages") as File[]);
    const moqRaw = String(form.get("moq") ?? "").trim();

    const row = {
      name,
      slug,
      short_description: String(form.get("shortDescription") ?? "").trim() || null,
      description: String(form.get("description") ?? "").trim() || null,
      category_id: String(form.get("categoryId") ?? "") || null,
      images: [...keep, ...added],
      specifications: parseSpecs(form.get("specifications")),
      customization_options: lines(form.get("customizationOptions")),
      moq: moqRaw ? Math.max(1, parseInt(moqRaw, 10) || 1) : null,
      is_featured: form.get("isFeatured") === "on",
      is_active: form.get("isActive") === "on",
      translations: arTranslations(form, ["name", "shortDescription", "description"], [{ key: "specifications", kind: "specs" }, { key: "customizationOptions", kind: "lines" }]),
    };
    const q = id ? db.from("products").update(row).eq("id", id) : db.from("products").insert(row);
    const { error } = await q;
    if (error) return { ok: false, error: error.code === "23505" ? "That slug is already used by another product." : error.message };
  } catch (e) {
    return fail(e);
  }
  revalidatePath("/", "layout");
  redirect("/admin/products?saved=1");
}

export async function deleteProduct(form: FormData) {
  const { db } = await requireAdminForWrite();
  await db.from("products").delete().eq("id", String(form.get("id")));
  revalidatePath("/", "layout");
  redirect("/admin/products?deleted=1");
}

export async function toggleProduct(form: FormData) {
  const { db } = await requireAdminForWrite();
  const field = String(form.get("field"));
  if (field !== "is_active" && field !== "is_featured") return;
  await db.from("products").update({ [field]: form.get("value") === "true" }).eq("id", String(form.get("id")));
  revalidatePath("/", "layout");
}

/* ------------------------------ Categories ------------------------------ */

export async function saveCategory(_: ActionState, form: FormData): Promise<ActionState> {
  try {
    const { db } = await requireAdminForWrite();
    const id = String(form.get("id") ?? "");
    const name = String(form.get("name") ?? "").trim();
    if (name.length < 2) return { ok: false, error: "Category name is required." };
    const keep = String(form.get("keepImage") ?? "");
    const [uploaded] = await uploadImages(db, "categories", [form.get("image") as File]);
    const row = {
      name,
      slug: slugify(String(form.get("slug") ?? "") || name),
      description: String(form.get("description") ?? "").trim() || null,
      image: uploaded ?? (keep || null),
      is_active: form.get("isActive") === "on",
      translations: arTranslations(form, ["name", "description"]),
    };
    const { error } = await (id ? db.from("categories").update(row).eq("id", id) : db.from("categories").insert(row));
    if (error) return { ok: false, error: error.code === "23505" ? "That slug is already in use." : error.message };
  } catch (e) {
    return fail(e);
  }
  revalidatePath("/", "layout");
  redirect("/admin/categories?saved=1");
}

export async function deleteCategory(form: FormData) {
  const { db } = await requireAdminForWrite();
  const id = String(form.get("id"));
  const { count } = await db.from("products").select("id", { count: "exact", head: true }).eq("category_id", id);
  if (count && count > 0) redirect(`/admin/categories?error=${encodeURIComponent(`Cannot delete: ${count} product(s) still use this category.`)}`);
  await db.from("categories").delete().eq("id", id);
  revalidatePath("/", "layout");
  redirect("/admin/categories?deleted=1");
}

/* ------------------------------ Enquiries ------------------------------ */

export async function updateEnquiryStatus(form: FormData) {
  const { db } = await requireAdminForWrite();
  const id = String(form.get("id"));
  const status = String(form.get("status"));
  if (!(ENQUIRY_STATUSES as readonly string[]).includes(status)) return;
  await db.from("enquiries").update({ status }).eq("id", id);
  revalidatePath("/admin", "layout");
  redirect(`/admin/enquiries/${id}?updated=1`);
}

/* ------------------------------ Portfolio ------------------------------ */

export async function saveProject(_: ActionState, form: FormData): Promise<ActionState> {
  try {
    const { db } = await requireAdminForWrite();
    const id = String(form.get("id") ?? "");
    const title = String(form.get("title") ?? "").trim();
    if (title.length < 2) return { ok: false, error: "Project title is required." };
    const keep = form.getAll("keepImages").map(String);
    const added = await uploadImages(db, "portfolio", form.getAll("newImages") as File[]);
    const row = {
      title,
      slug: slugify(String(form.get("slug") ?? "") || title),
      category: String(form.get("category") ?? "").trim() || null,
      description: String(form.get("description") ?? "").trim() || null,
      images: [...keep, ...added],
      details: parseSpecs(form.get("details")),
      is_featured: form.get("isFeatured") === "on",
      translations: arTranslations(form, ["title", "category", "description"], [{ key: "details", kind: "specs" }]),
    };
    const { error } = await (id ? db.from("portfolio_projects").update(row).eq("id", id) : db.from("portfolio_projects").insert(row));
    if (error) return { ok: false, error: error.code === "23505" ? "That slug is already in use." : error.message };
  } catch (e) {
    return fail(e);
  }
  revalidatePath("/", "layout");
  redirect("/admin/portfolio?saved=1");
}

export async function deleteProject(form: FormData) {
  const { db } = await requireAdminForWrite();
  await db.from("portfolio_projects").delete().eq("id", String(form.get("id")));
  revalidatePath("/", "layout");
  redirect("/admin/portfolio?deleted=1");
}

/* ------------------------------ Email retry & messages ------------------------------ */

/** Re-sends the team notification for a saved enquiry (never creates or alters the enquiry itself). */
export async function retryEnquiryEmail(form: FormData) {
  const { db } = await requireAdminForWrite();
  const id = String(form.get("id"));
  const { data: e } = await db.from("enquiries").select("*, enquiry_items(*)").eq("id", id).maybeSingle();
  if (!e) redirect("/admin/enquiries");
  let attachmentUrl: string | null = null;
  if (e.logo_path) {
    const { data: s } = await db.storage.from("enquiry-uploads").createSignedUrl(e.logo_path, 60 * 60 * 24 * 7);
    attachmentUrl = s?.signedUrl ?? null;
  }
  const mail = await notifyEnquiry({
    reference: e.enquiry_number,
    createdAt: new Date(e.created_at),
    customerName: e.customer_name,
    companyName: e.company_name,
    email: e.email,
    phone: e.phone,
    items: (e.enquiry_items ?? []).map((i: { product_name: string; quantity: number; customization_notes: string | null }) => ({ productName: i.product_name, quantity: i.quantity, customizationNotes: i.customization_notes ?? "" })),
    customizationRequirements: e.customization_requirements ?? "",
    budgetRange: e.budget_range ?? "",
    deliveryDate: e.delivery_date ?? "",
    notes: e.notes ?? "",
    attachmentUrl,
    adminUrl: `${emailConfig().siteUrl}/admin/enquiries/${id}`,
  });
  await db.from("enquiries").update({ email_status: mail.status, email_error: mail.error, email_sent_at: mail.status === "sent" ? new Date().toISOString() : null, email_attempts: (e.email_attempts ?? 0) + 1 }).eq("id", id);
  revalidatePath("/admin", "layout");
  redirect(`/admin/enquiries/${id}?retried=${mail.status}`);
}

export async function retryContactEmail(form: FormData) {
  const { db } = await requireAdminForWrite();
  const id = String(form.get("id"));
  const { data: r } = await db.from("contact_messages").select("*").eq("id", id).maybeSingle();
  if (!r) redirect("/admin/messages");
  const mail = await notifyContact({
    reference: r.reference_number,
    createdAt: new Date(r.created_at),
    customerName: r.customer_name,
    email: r.email,
    phone: r.phone ?? undefined,
    companyName: r.company_name ?? undefined,
    subject: r.subject ?? undefined,
    message: r.message,
    adminUrl: `${emailConfig().siteUrl}/admin/messages/${id}`,
  });
  await db.from("contact_messages").update({ email_status: mail.status, email_error: mail.error, email_sent_at: mail.status === "sent" ? new Date().toISOString() : null, email_attempts: (r.email_attempts ?? 0) + 1 }).eq("id", id);
  revalidatePath("/admin", "layout");
  redirect(`/admin/messages/${id}?retried=${mail.status}`);
}

export async function setMessageStatus(form: FormData) {
  const { db } = await requireAdminForWrite();
  const id = String(form.get("id"));
  const status = String(form.get("status")) === "handled" ? "handled" : "new";
  await db.from("contact_messages").update({ status }).eq("id", id);
  revalidatePath("/admin", "layout");
  redirect(`/admin/messages/${id}?updated=1`);
}
