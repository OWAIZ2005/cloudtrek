import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import { mapCategory, mapProduct, mapProject } from "@/lib/supabase/mappers";
import { demoCategories, demoCollections, demoProducts, demoProjects, demoStats } from "@/data/demo-data";
import type { Category, DataSource, GiftingCollection, PortfolioProject, Product, Stat } from "@/types";

/**
 * Public data access. Real Supabase records take precedence; the demo layer is
 * used only when Supabase is not configured or the relevant table is empty.
 */

async function loadCatalogue(): Promise<{ categories: Category[]; products: Product[]; source: DataSource }> {
  const db = createPublicClient();
  if (db) {
    try {
      const [cats, prods] = await Promise.all([
        db.from("categories").select("*").eq("is_active", true).order("name"),
        db.from("products").select("*, categories(slug)").eq("is_active", true).order("created_at", { ascending: false }),
      ]);
      if (!cats.error && !prods.error && prods.data && prods.data.length > 0) {
        return {
          categories: (cats.data ?? []).map(mapCategory),
          products: prods.data.map((r) => mapProduct(r)),
          source: "supabase",
        };
      }
    } catch (e) {
      console.error("[data] Supabase catalogue read failed, using demo data:", e);
    }
  }
  return { categories: demoCategories, products: demoProducts, source: "demo" };
}

export async function getCatalogueSource(): Promise<DataSource> {
  return (await loadCatalogue()).source;
}

export async function getCategories(): Promise<Category[]> {
  return (await loadCatalogue()).categories.filter((c) => c.isActive);
}

export interface ProductQuery {
  q?: string;
  category?: string;
  featured?: boolean;
  limit?: number;
}

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  const { products } = await loadCatalogue();
  const q = query.q?.trim().toLowerCase();
  let out = products.filter((p) => p.isActive);
  if (query.category) out = out.filter((p) => p.categorySlug === query.category);
  if (query.featured) out = out.filter((p) => p.isFeatured);
  if (q) {
    out = out.filter((p) =>
      [p.name, p.shortDescription, p.description, p.categorySlug, ...p.customizationOptions].join(" ").toLowerCase().includes(q),
    );
  }
  return query.limit ? out.slice(0, query.limit) : out;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { products } = await loadCatalogue();
  return products.find((p) => p.slug === slug && p.isActive) ?? null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const { products } = await loadCatalogue();
  const same = products.filter((p) => p.isActive && p.id !== product.id && p.categorySlug === product.categorySlug);
  const rest = products.filter((p) => p.isActive && p.id !== product.id && p.categorySlug !== product.categorySlug);
  return [...same, ...rest].slice(0, limit);
}

export async function getProductsBySlugs(slugs: string[]): Promise<Product[]> {
  const { products } = await loadCatalogue();
  return slugs.map((s) => products.find((p) => p.slug === s)).filter((p): p is Product => Boolean(p));
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const { products } = await loadCatalogue();
  return products.reduce<Record<string, number>>((acc, p) => {
    if (p.isActive) acc[p.categorySlug] = (acc[p.categorySlug] ?? 0) + 1;
    return acc;
  }, {});
}

export async function getProjects(): Promise<{ projects: PortfolioProject[]; source: DataSource }> {
  const db = createPublicClient();
  if (db) {
    try {
      const { data, error } = await db.from("portfolio_projects").select("*").order("created_at", { ascending: false });
      if (!error && data && data.length > 0) return { projects: data.map(mapProject), source: "supabase" };
    } catch (e) {
      console.error("[data] Supabase portfolio read failed, using demo data:", e);
    }
  }
  return { projects: demoProjects, source: "demo" };
}

export async function getProjectBySlug(slug: string) {
  const { projects, source } = await getProjects();
  return { project: projects.find((p) => p.slug === slug) ?? null, source };
}

/** Gifting collections and statistics are editorial demo content (no table in the MVP schema). */
export async function getCollections(): Promise<GiftingCollection[]> {
  return demoCollections;
}

export async function getStats(): Promise<Stat[]> {
  return demoStats;
}
