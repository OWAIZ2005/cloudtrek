import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { StatsGrid } from "@/components/home/stats";
import {
  CategoryGrid,
  CustomizationSection,
  Divisions,
  FeaturedProducts,
  GiftingSection,
  PositioningSection,
  ProcessSection,
  WhySection,
  WorkSection,
} from "@/components/home/sections";
import { FinalCta } from "@/components/home/final-cta";
import { getCategories, getCategoryCounts, getProducts, getProjects, getStats } from "@/lib/data";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: "Cloud Trek | Corporate Gifting & Promotional Products, Bahrain" },
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [categories, counts, featured, { projects }, stats] = await Promise.all([
    getCategories(),
    getCategoryCounts(),
    getProducts({ featured: true, limit: 8 }),
    getProjects(),
    getStats(),
  ]);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Cloud Trek",
    url: siteConfig.url,
    description: siteConfig.description,
    areaServed: "BH",
    sameAs: [siteConfig.contact.instagram],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <Hero />
      <Divisions />
      <StatsGrid
        stats={stats}
        counts={categories.slice(0, 4).map((c) => ({ name: c.name, count: counts[c.slug] ?? 0 }))}
      />
      <CategoryGrid categories={categories} counts={counts} />
      <FeaturedProducts products={featured} categories={categories} />
      <GiftingSection />
      <CustomizationSection />
      <ProcessSection />
      <WhySection />
      <WorkSection projects={projects} />
      <PositioningSection />
      <FinalCta />
    </>
  );
}
