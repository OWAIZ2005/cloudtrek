import type { Locale } from "@/types";

/**
 * Translation-ready UI strings. English is the default and the only fully
 * populated locale. Arabic strings below cover navigation and common UI only,
 * and MUST be reviewed by a native speaker / the client before launch.
 */
export const dictionaries = {
  en: {
    nav: {
      home: "Home",
      products: "Products",
      gifting: "Corporate Gifting",
      services: "Services",
      work: "Our Work",
      about: "About Us",
      contact: "Contact",
    },
    cta: { quote: "Request a Quote", explore: "Explore Products", language: "العربية", menu: "Menu", close: "Close" },
    list: "Enquiry list",
  },
  ar: {
    nav: {
      home: "الرئيسية",
      products: "المنتجات",
      gifting: "الهدايا المؤسسية",
      services: "الخدمات",
      work: "أعمالنا",
      about: "من نحن",
      contact: "اتصل بنا",
    },
    cta: { quote: "اطلب عرض سعر", explore: "استكشف المنتجات", language: "English", menu: "القائمة", close: "إغلاق" },
    list: "قائمة الطلب",
  },
} as const;

export type Dictionary = (typeof dictionaries)["en"] | (typeof dictionaries)["ar"];

export const LOCALE_COOKIE = "ct_locale";
export const isRtl = (l: Locale) => l === "ar";
export const getDictionary = (l: Locale): Dictionary => dictionaries[l] ?? dictionaries.en;
