import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { GlobalBackground } from "@/components/brand/global-background";
import { QuoteProvider } from "@/components/quote/quote-provider";
import { siteConfig } from "@/config/site";
import { getI18n } from "@/i18n/get-locale";
import { I18nProvider } from "@/i18n/provider";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"], display: "swap" });
const arabic = Noto_Sans_Arabic({ variable: "--font-arabic", subsets: ["arabic"], display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const { locale, m } = await getI18n();
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: m.meta.siteTitle, template: `%s | ${m.brand.name}` },
    description: m.meta.siteDescription,
    applicationName: "Cloud Trek",
    openGraph: {
      type: "website",
      siteName: m.brand.name,
      locale: locale === "ar" ? "ar_BH" : "en_BH",
      title: m.meta.siteTitle,
      description: m.meta.siteDescription,
      images: [{ url: "/images/brand/og-image.png", width: 1200, height: 630, alt: "Cloud Trek" }],
    },
    twitter: { card: "summary_large_image" },
    alternates: { languages: { en: "/", ar: "/" } },
  };
}

export const viewport: Viewport = { themeColor: "#173B70", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { locale, m, dir } = await getI18n();

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${interTight.variable} ${arabic.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <noscript>
          <style>{`.split-parent{visibility:visible!important}`}</style>
        </noscript>
        <GlobalBackground />
        <I18nProvider locale={locale}>
        <QuoteProvider>
          <div className="relative z-10 flex min-h-full flex-1 flex-col">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
          >
            {m.a11y.skip}
          </a>
          {children}
          </div>
        </QuoteProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
