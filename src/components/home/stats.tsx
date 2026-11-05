"use client";

import CountUp from "@/components/reactbits/CountUp";
import { useI18n } from "@/i18n/provider";
import type { Stat } from "@/types";

export function StatsGrid({ stats, counts }: { stats: Stat[]; counts: { name: string; count: number }[] }) {
  const { m } = useI18n();
  return (
    <section className="bg-navy text-white" aria-label={m.home.stats.aria}>
      <div className="container-x py-14 lg:py-20">
        <div className="grid gap-px overflow-hidden bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-navy px-6 py-8 lg:px-8 lg:py-10">
              <div className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">
                <CountUp to={s.value} duration={1.6} suffix={s.suffix ?? ""} />
              </div>
              <p className="mt-3 text-sm text-white/70">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md text-sm leading-relaxed text-white/65">{m.home.stats.summary}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/70">
            {counts.map((c) => (
              <li key={c.name}>
                {c.name} <span className="text-white">{c.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
