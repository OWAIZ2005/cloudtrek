import "server-only";
import { cookies } from "next/headers";
import { LOCALE_COOKIE } from "./dictionaries";
import { getMessagesFor, type Messages } from "./messages";
import type { Locale } from "@/types";

export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  return jar.get(LOCALE_COOKIE)?.value === "ar" ? "ar" : "en";
}

/** Locale + the matching message catalogue, for Server Components. */
export async function getI18n(): Promise<{ locale: Locale; m: Messages; dir: "ltr" | "rtl" }> {
  const locale = await getLocale();
  return { locale, m: getMessagesFor(locale), dir: locale === "ar" ? "rtl" : "ltr" };
}
