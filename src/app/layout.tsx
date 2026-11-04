import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { GlobalBackground } from "@/components/brand/global-background";
import { QuoteProvider } from "@/components/quote/quote-provider";
import { siteConfig } from "@/config/site";
import { getLocale } from "@/i18n/get-locale";
import { isRtl } from "@/i18n/dictionaries";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"], display: "swap" });
const arabic = Noto_Sans_Arabic({ variable: "--font-arabic", subsets: ["arabic"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: "Cloud Trek | Corporate Gifting & Promotional Products, Bahrain", template: "%s | Cloud Trek" },
  description: siteConfig.description,
  applicationName: "Cloud Trek",
  openGraph: {
    type: "website",
    siteName: "Cloud Trek",
    locale: "en_BH",
    title: "Cloud Trek | Corporate Gifting & Promotional Products, Bahrain",
    description: siteConfig.description,
    images: [{ url: "/images/brand/og-image.png", width: 1200, height: 630, alt: "Cloud Trek — Corporate Events, Publicity and Advertising" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#173B70", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      dir={isRtl(locale) ? "rtl" : "ltr"}
      className={`${inter.variable} ${interTight.variable} ${arabic.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <noscript>
          <style>{`.split-parent{visibility:visible!important}`}</style>
        </noscript>
        <GlobalBackground />
        <QuoteProvider>
          <div className="relative z-10 flex min-h-full flex-1 flex-col">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          {children}
          </div>
        </QuoteProvider>
      </body>
    </html>
  );
}
