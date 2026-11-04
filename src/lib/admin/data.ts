import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { demoCategories, demoEnquiries, demoMonthlyEnquiries, demoProducts, demoProjects } from "@/data/demo-data";
import { mapCategory, mapEnquiry, mapProduct, mapProject } from "@/lib/supabase/mappers";
import { ENQUIRY_STATUSES, type Category, type Enquiry, type PortfolioProject, type Product } from "@/types";
import type { AdminContext } from "./auth";


export async function adminCategories(ctx: AdminContext): Promise<Category[]> {
  if (ctx.mode === "demo") return demoCategories;
  const { data } = await ctx.db.from("categories").select("*").order("name");
  return (data ?? []).map(mapCategory);
}

export async function adminProducts(ctx: AdminContext): Promise<Product[]> {
  if (ctx.mode === "demo") return demoProducts;
  const { data } = await ctx.db.from("products").select("*, categories(slug)").order("created_at", { ascending: false });
  return (data ?? []).map((r) => mapProduct(r));
}

export async function adminProduct(ctx: AdminContext, id: string): Promise<(Product & { categoryId?: string }) | null> {
  if (ctx.mode === "demo") return demoProducts.find((p) => p.id === id) ?? null;
  const { data } = await ctx.db.from("products").select("*, categories(slug)").eq("id", id).maybeSingle();
  return data ? { ...mapProduct(data), categoryId: data.category_id } : null;
}

export async function adminProjects(ctx: AdminContext): Promise<PortfolioProject[]> {
  if (ctx.mode === "demo") return demoProjects;
  const { data } = await ctx.db.from("portfolio_projects").select("*").order("created_at", { ascending: false });
  return (data ?? []).map(mapProject);
}

export async function adminProject(ctx: AdminContext, id: string): Promise<PortfolioProject | null> {
  if (ctx.mode === "demo") return demoProjects.find((p) => p.id === id) ?? null;
  const { data } = await ctx.db.from("portfolio_projects").select("*").eq("id", id).maybeSingle();
  return data ? mapProject(data) : null;
}

export async function adminEnquiries(ctx: AdminContext): Promise<Enquiry[]> {
  if (ctx.mode === "demo") return demoEnquiries;
  const { data } = await ctx.db.from("enquiries").select("*, enquiry_items(*)").order("created_at", { ascending: false }).limit(500);
  return (data ?? []).map(mapEnquiry);
}

export async function adminEnquiry(ctx: AdminContext, id: string): Promise<Enquiry | null> {
  if (ctx.mode === "demo") return demoEnquiries.find((e) => e.id === id) ?? null;
  const { data } = await ctx.db.from("enquiries").select("*, enquiry_items(*)").eq("id", id).maybeSingle();
  if (!data) return null;
  const e = mapEnquiry(data);
  if (data.logo_path) {
    const { data: s } = await ctx.db.storage.from("enquiry-uploads").createSignedUrl(data.logo_path, 60 * 15);
    e.logoUrl = s?.signedUrl ?? null;
  }
  return e;
}

export interface Overview {
  totalProducts: number;
  totalEnquiries: number;
  pendingEnquiries: number;
  statusDistribution: { status: string; count: number }[];
  categoryDistribution: { name: string; count: number }[];
  monthly: { month: string; enquiries: number }[];
  recent: Enquiry[];
  isDemo: boolean;
}

export async function adminOverview(ctx: AdminContext): Promise<Overview> {
  const [products, categories, enquiries] = await Promise.all([adminProducts(ctx), adminCategories(ctx), adminEnquiries(ctx)]);
  const isDemo = ctx.mode === "demo";

  const statusDistribution = ENQUIRY_STATUSES.map((s) => ({ status: s, count: enquiries.filter((e) => e.status === s).length }));
  const categoryDistribution = categories
    .map((c) => ({ name: c.name, count: products.filter((p) => p.categorySlug === c.slug).length }))
    .filter((c) => c.count > 0);

  let monthly = demoMonthlyEnquiries;
  if (!isDemo) {
    const now = new Date();
    monthly = Array.from({ length: 6 }, (_, k) => {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (5 - k), 1));
      const count = enquiries.filter((e) => {
        const c = new Date(e.createdAt);
        return c.getUTCFullYear() === d.getUTCFullYear() && c.getUTCMonth() === d.getUTCMonth();
      }).length;
      return { month: d.toLocaleString("en", { month: "short", timeZone: "UTC" }), enquiries: count };
    });
  }

  return {
    totalProducts: products.length,
    totalEnquiries: enquiries.length,
    pendingEnquiries: enquiries.filter((e) => e.status === "new" || e.status === "contacted").length,
    statusDistribution,
    categoryDistribution,
    monthly,
    recent: enquiries.slice(0, 6),
    isDemo,
  };
}

export type { SupabaseClient };
