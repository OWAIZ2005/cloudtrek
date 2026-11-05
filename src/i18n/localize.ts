import type { Locale } from "@/types";

/**
 * Content records keep their English fields and an optional `ar` object with
 * Arabic overrides (same data structure, no parallel files per component).
 * `localize` returns the record with Arabic overrides applied when locale is "ar".
 * Missing or empty Arabic fields fall back to English, so partial data never renders empty.
 */
export type WithAr<T> = T & { ar?: Partial<T> };

export function localize<T extends { ar?: object }>(item: T, locale: Locale): T {
  if (locale !== "ar" || !item.ar) return item;
  const out: Record<string, unknown> = { ...item };
  for (const [k, v] of Object.entries(item.ar)) if (v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0)) out[k] = v;
  return out as T;
}

export const localizeAll = <T extends { ar?: object }>(items: readonly T[], locale: Locale): T[] => items.map((i) => localize(i, locale));
