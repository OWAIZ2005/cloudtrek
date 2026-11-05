"use client";

import { createContext, useContext } from "react";
import { getMessagesFor, type Messages } from "./messages";
import type { Locale } from "@/types";

interface Ctx {
  locale: Locale;
  m: Messages;
  dir: "ltr" | "rtl";
}
const I18nContext = createContext<Ctx>({ locale: "en", m: getMessagesFor("en"), dir: "ltr" });

/** Gives Client Components the active locale and its messages. */
export function I18nProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <I18nContext.Provider value={{ locale, m: getMessagesFor(locale), dir: locale === "ar" ? "rtl" : "ltr" }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
