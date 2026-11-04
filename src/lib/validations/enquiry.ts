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

const phone = z
  .string()
  .trim()
  .min(6, "Please enter a valid phone number")
  .max(30)
  .regex(/^[+\d][\d\s().-]{5,}$/, "Please enter a valid phone number");

export const enquiryItemSchema = z.object({
  productId: z.string().max(64).nullable().optional(),
  productName: z.string().trim().min(1).max(200),
  quantity: z.coerce.number().int("Quantity must be a whole number").min(1, "Quantity must be at least 1").max(1_000_000),
  customizationNotes: z.string().trim().max(1000).optional().default(""),
});

export const enquirySchema = z
  .object({
    source: z.enum(["quote", "contact"]).default("quote"),
    customerName: z.string().trim().min(2, "Please enter your full name").max(120),
    companyName: z.string().trim().min(2, "Please enter your company name").max(160),
    email: z.string().trim().max(200).pipe(z.email("Please enter a valid business email")),
    phone,
    budgetRange: z.string().trim().max(60).optional().default(""),
    deliveryDate: z
      .string()
      .trim()
      .optional()
      .default("")
      .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), "Invalid date"),
    customizationRequirements: z.string().trim().max(2000).optional().default(""),
    notes: z.string().trim().max(3000).optional().default(""),
    items: z.array(enquiryItemSchema).max(40).default([]),
    /** Honeypot: real users never fill this. */
    website: z.string().max(0).optional().default(""),
  })
  .superRefine((v, ctx) => {
    if (v.source === "quote" && v.items.length === 0) {
      ctx.addIssue({ code: "custom", path: ["items"], message: "Add at least one product to your enquiry" });
    }
    if (v.source === "contact" && !v.notes) {
      ctx.addIssue({ code: "custom", path: ["notes"], message: "Please tell us how we can help" });
    }
  });

export type EnquiryInput = z.infer<typeof enquirySchema>;

export function validateUpload(file: File): string | null {
  if (file.size === 0) return null;
  if (file.size > MAX_UPLOAD_BYTES) return "File is too large. The maximum size is 5 MB.";
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const typeOk = (ALLOWED_UPLOAD_TYPES as readonly string[]).includes(file.type) || file.type === "";
  const extOk = (ALLOWED_UPLOAD_EXTENSIONS as readonly string[]).includes(ext);
  if (!extOk || !typeOk) return "Unsupported file type. Please upload PNG, JPG, WebP, SVG, PDF, AI, EPS or PSD.";
  return null;
}
