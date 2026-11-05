export type Locale = "en" | "ar";

export type DataSource = "supabase" | "demo";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  isDemo?: boolean;
  /** Arabic overrides (same record, optional). */
  ar?: Partial<Pick<Category, "name" | "description">>;
}

export interface Spec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  categorySlug: string;
  images: string[];
  specifications: Spec[];
  customizationOptions: string[];
  isFeatured: boolean;
  isActive: boolean;
  /** Minimum order quantity. Only shown when known; demo values are illustrative. */
  moq?: number | null;
  isDemo?: boolean;
  ar?: Partial<Pick<Product, "name" | "shortDescription" | "description" | "specifications" | "customizationOptions">>;
}

export interface GiftingCollection {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  audience: string;
  image: string;
  suggestedProductSlugs: string[];
  isDemo: true;
  ar?: Partial<Pick<GiftingCollection, "title" | "tagline" | "description" | "audience">>;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  images: string[];
  details: Spec[];
  isFeatured: boolean;
  isDemo?: boolean;
  ar?: Partial<Pick<PortfolioProject, "title" | "category" | "description" | "details">>;
}

export const ENQUIRY_STATUSES = [
  "new",
  "contacted",
  "quotation_sent",
  "approved",
  "completed",
  "cancelled",
] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const ENQUIRY_STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quotation_sent: "Quotation Sent",
  approved: "Approved",
  completed: "Completed",
  cancelled: "Cancelled",
};

export interface EnquiryItem {
  productId: string | null;
  productName: string;
  quantity: number;
  customizationNotes?: string;
}

export type EmailStatus = "pending" | "sent" | "failed";

export interface Enquiry {
  id: string;
  enquiryNumber: string;
  customerName: string;
  companyName: string;
  email: string;
  phone: string;
  budgetRange?: string | null;
  deliveryDate?: string | null;
  customizationRequirements?: string | null;
  notes?: string | null;
  status: EnquiryStatus;
  createdAt: string;
  items: EnquiryItem[];
  logoUrl?: string | null;
  emailStatus: EmailStatus;
  emailError?: string | null;
  emailAttempts: number;
  /** True for illustrative records that never came from a real customer. */
  isDemo: boolean;
}

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
  ar?: { label: string };
}

export interface QuoteListItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  quantity: number;
  notes: string;
}

export interface ContactMessage {
  id: string;
  referenceNumber: string;
  customerName: string;
  email: string;
  phone?: string | null;
  companyName?: string | null;
  subject?: string | null;
  message: string;
  status: "new" | "handled";
  emailStatus: EmailStatus;
  emailError?: string | null;
  emailAttempts: number;
  createdAt: string;
  isDemo: boolean;
}
