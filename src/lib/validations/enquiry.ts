import { z } from "zod";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_UPLOAD_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "application/postscript", // .ai / .eps
  "image/vnd.adobe.photoshop",
] as const;
export const ALLOWED_UPLOAD_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "svg", "pdf", "ai", "eps", "psd"] as const;

/**
 * Validation messages are stable error CODES, not sentences. The client maps each
 * code to the visitor's language (see messages.quote.errors), so the server never
 * has to know which language is active.
 */
const noCtl = (max: number) => z.string().trim().max(max).refine((v) => !/[\r\n\u0000]/.test(v), "invalid");

const phone = z
  .string()
  .trim()
  .min(6, "phone_invalid")
  .max(30, "phone_invalid")
  .regex(/^[+\d][\d\s().-]{5,}$/, "phone_invalid");

export const enquiryItemSchema = z.object({
  productId: z.string().max(64).nullable().optional(),
  productName: z.string().trim().min(1).max(200),
  quantity: z.coerce.number().int("qty_invalid").min(1, "qty_invalid").max(1_000_000, "qty_invalid"),
  customizationNotes: z.string().trim().max(1000).optional().default(""),
});

const base = {
  customerName: noCtl(120).pipe(z.string().min(2, "name_required")),
  email: z.string().trim().max(200).pipe(z.email("email_invalid")),
  /** Honeypot: real users never fill this. */
  website: z.string().max(0).optional().default(""),
};

export const enquirySchema = z
  .object({
    ...base,
    companyName: noCtl(160).pipe(z.string().min(2, "company_required")),
    phone,
    budgetRange: noCtl(60).optional().default(""),
    deliveryDate: z
      .string()
      .trim()
      .optional()
      .default("")
      .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), "date_invalid"),
    customizationRequirements: z.string().trim().max(2000).optional().default(""),
    notes: z.string().trim().max(3000).optional().default(""),
    items: z.array(enquiryItemSchema).max(40).default([]),
  })
  .superRefine((v, ctx) => {
    if (v.items.length === 0) ctx.addIssue({ code: "custom", path: ["items"], message: "items_required" });
  });

export const contactSchema = z.object({
  ...base,
  companyName: noCtl(160).optional().default(""),
  phone: z.string().trim().max(30).optional().default("").refine((v) => !v || /^[+\d][\d\s().-]{5,}$/.test(v), "phone_invalid"),
  subject: noCtl(160).optional().default(""),
  message: z.string().trim().min(2, "message_required").max(4000),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
export type ContactInput = z.infer<typeof contactSchema>;

/** Returns an error CODE (see messages.quote.errors) or null. */
export function validateUpload(file: File): "file_too_large" | "file_type" | null {
  if (file.size === 0) return null;
  if (file.size > MAX_UPLOAD_BYTES) return "file_too_large";
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const typeOk = (ALLOWED_UPLOAD_TYPES as readonly string[]).includes(file.type) || file.type === "";
  const extOk = (ALLOWED_UPLOAD_EXTENSIONS as readonly string[]).includes(ext);
  if (!extOk || !typeOk) return "file_type";
  return null;
}
