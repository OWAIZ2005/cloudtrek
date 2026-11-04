"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import type { QuoteListItem } from "@/types";

interface Ctx {
  items: QuoteListItem[];
  count: number;
  ready: boolean;
  add: (item: Omit<QuoteListItem, "quantity" | "notes"> & Partial<Pick<QuoteListItem, "quantity" | "notes">>) => void;
  update: (productId: string, patch: Partial<Pick<QuoteListItem, "quantity" | "notes">>) => void;
  remove: (productId: string) => void;
  clear: () => void;
  has: (productId: string) => boolean;
}

const KEY = "cloudtrek.enquiry-list.v1";
const EMPTY: QuoteListItem[] = [];

/* A tiny localStorage-backed external store: SSR-safe and consistent across tabs. */
let cache: { raw: string | null; items: QuoteListItem[] } = { raw: null, items: EMPTY };
const listeners = new Set<() => void>();

function readSnapshot(): QuoteListItem[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return cache.items;
  }
  if (raw !== cache.raw) {
    let items = EMPTY;
    try {
      const parsed = raw ? JSON.parse(raw) : EMPTY;
      items = Array.isArray(parsed) ? parsed : EMPTY;
    } catch {
      items = EMPTY;
    }
    cache = { raw, items };
  }
  return cache.items;
}

function write(items: QuoteListItem[]) {
  const raw = JSON.stringify(items);
  try {
    localStorage.setItem(KEY, raw);
  } catch {
    /* storage unavailable: keep in-memory only */
  }
  cache = { raw, items };
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

const QuoteContext = createContext<Ctx | null>(null);

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, readSnapshot, () => EMPTY);
  const ready = useSyncExternalStore(() => () => {}, () => true, () => false);

  const add = useCallback<Ctx["add"]>((item) => {
    const cur = readSnapshot();
    if (cur.some((i) => i.productId === item.productId)) return;
    write([...cur, { quantity: 100, notes: "", ...item }]);
  }, []);
  const update = useCallback<Ctx["update"]>(
    (id, patch) => write(readSnapshot().map((i) => (i.productId === id ? { ...i, ...patch } : i))),
    [],
  );
  const remove = useCallback((id: string) => write(readSnapshot().filter((i) => i.productId !== id)), []);
  const clear = useCallback(() => write([]), []);

  const value = useMemo<Ctx>(
    () => ({ items, count: items.length, ready, add, update, remove, clear, has: (id) => items.some((i) => i.productId === id) }),
    [items, ready, add, update, remove, clear],
  );
  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used within QuoteProvider");
  return ctx;
}
