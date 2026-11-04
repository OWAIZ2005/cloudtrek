"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { LOCALE_COOKIE } from "./dictionaries";
import type { Locale } from "@/types";

export async function setLocale(locale: Locale) {
  const jar = await cookies();
  jar.set(LOCALE_COOKIE, locale === "ar" ? "ar" : "en", { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  revalidatePath("/", "layout");
}
