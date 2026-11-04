"use client";

import CountUp from "@/components/reactbits/CountUp";

/** React Bits CountUp for the result total; remounts (re-animates) when the number changes. */
export function ResultCount({ value }: { value: number }) {
  return (
    <span className="font-semibold tabular-nums text-navy">
      <CountUp key={value} to={value} from={0} duration={0.7} trigger="load" />
    </span>
  );
}
