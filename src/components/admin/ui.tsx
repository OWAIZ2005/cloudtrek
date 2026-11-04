import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { ENQUIRY_STATUS_LABELS, type EnquiryStatus } from "@/types";

const statusStyle: Record<EnquiryStatus, string> = {
  new: "bg-brand-red text-white",
  contacted: "bg-mist text-navy",
  quotation_sent: "bg-navy/90 text-white",
  approved: "border border-navy bg-white text-navy",
  completed: "bg-charcoal text-white",
  cancelled: "bg-line text-charcoal/60 line-through",
};

export function StatusBadge({ status }: { status: EnquiryStatus }) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 text-[11px] font-semibold tracking-wide", statusStyle[status])}>
      {ENQUIRY_STATUS_LABELS[status]}
    </span>
  );
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex border border-brand-red/40 bg-brand-red/5 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-red", className)}>
      Demo
    </span>
  );
}

export function PageTitle({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ title, sub, children, className }: { title?: string; sub?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("border border-line bg-white", className)}>
      {title && (
        <header className="border-b border-line px-5 py-4">
          <h2 className="font-sans text-sm font-semibold text-navy">{title}</h2>
          {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Notice({ kind, children }: { kind: "ok" | "error"; children: React.ReactNode }) {
  return (
    <p role={kind === "error" ? "alert" : "status"} className={cn("mb-6 flex gap-3 border p-3.5 text-sm", kind === "ok" ? "border-navy/20 bg-mist text-navy" : "border-brand-red/40 bg-brand-red/5 text-charcoal")}>
      {kind === "error" && <TriangleAlert className="mt-0.5 size-4 shrink-0 text-brand-red" aria-hidden />}
      {children}
    </p>
  );
}

export const primaryBtn = "inline-flex h-10 items-center justify-center gap-2 bg-navy px-5 text-sm font-medium text-white transition-colors hover:bg-navy-deep disabled:cursor-not-allowed disabled:opacity-50";
export const ghostBtn = "inline-flex h-10 items-center justify-center gap-2 border border-input bg-white px-4 text-sm font-medium text-navy transition-colors hover:border-navy disabled:cursor-not-allowed disabled:opacity-50";
export const dangerBtn = "inline-flex h-10 items-center justify-center gap-2 border border-brand-red/50 bg-white px-4 text-sm font-medium text-brand-red transition-colors hover:bg-brand-red hover:text-white disabled:cursor-not-allowed disabled:opacity-50";
export const adminInput = "h-10 w-full border border-input bg-white px-3 text-sm outline-none transition-colors focus:border-navy disabled:bg-offwhite";

export function AdminLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return <Link href={href} className={cn("text-navy underline-offset-4 hover:text-brand-red hover:underline", className)}>{children}</Link>;
}

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
}
