import type { Category, ContactMessage, EmailStatus, Enquiry, EnquiryItem, EnquiryStatus, PortfolioProject, Product, Spec } from "@/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

export const mapCategory = (r: any): Category => ({
  id: r.id, name: r.name, slug: r.slug, description: r.description ?? "", image: r.image ?? "/images/categories/stationery.jpg", isActive: r.is_active,
  ar: r.translations?.ar,
});

export const mapProduct = (r: any, categorySlug?: string): Product => ({
  id: r.id, name: r.name, slug: r.slug,
  shortDescription: r.short_description ?? "",
  description: r.description ?? "",
  categorySlug: categorySlug ?? r.categories?.slug ?? "",
  images: arr<string>(r.images).length ? arr<string>(r.images) : ["/images/hero/gift-boxes-ribbon.jpg"],
  specifications: arr<Spec>(r.specifications),
  customizationOptions: arr<string>(r.customization_options),
  isFeatured: r.is_featured, isActive: r.is_active, moq: r.moq,
  ar: r.translations?.ar,
});

export const mapProject = (r: any): PortfolioProject => ({
  id: r.id, title: r.title, slug: r.slug, category: r.category ?? "",
  description: r.description ?? "",
  images: arr<string>(r.images).length ? arr<string>(r.images) : ["/images/hero/gift-boxes-ribbon.jpg"],
  details: arr<Spec>(r.details), isFeatured: r.is_featured,
  ar: r.translations?.ar,
});

export const mapEnquiry = (r: any): Enquiry => ({
  id: r.id, enquiryNumber: r.enquiry_number, customerName: r.customer_name, companyName: r.company_name,
  email: r.email, phone: r.phone, budgetRange: r.budget_range, deliveryDate: r.delivery_date,
  customizationRequirements: r.customization_requirements, notes: r.notes,
  status: r.status as EnquiryStatus, createdAt: r.created_at, logoUrl: r.logo_url,
  emailStatus: (r.email_status ?? "pending") as EmailStatus, emailError: r.email_error, emailAttempts: r.email_attempts ?? 0,
  items: arr<any>(r.enquiry_items).map((i): EnquiryItem => ({
    productId: i.product_id, productName: i.product_name ?? i.products?.name ?? "Product",
    quantity: i.quantity, customizationNotes: i.customization_notes ?? undefined,
  })),
  isDemo: false,
});

export const mapMessage = (r: any): ContactMessage => ({
  id: r.id, referenceNumber: r.reference_number, customerName: r.customer_name, email: r.email, phone: r.phone,
  companyName: r.company_name, subject: r.subject, message: r.message, status: r.status,
  emailStatus: (r.email_status ?? "pending") as EmailStatus, emailError: r.email_error, emailAttempts: r.email_attempts ?? 0,
  createdAt: r.created_at, isDemo: !!r.is_demo,
});
