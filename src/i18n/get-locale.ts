import "server-only";
import { cookies } from "next/headers";
import { LOCALE_COOKIE } from "./dictionaries";
import type { Locale } from "@/types";

export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  return jar.get(LOCALE_COOKIE)?.value === "ar" ? "ar" : "en";
}
