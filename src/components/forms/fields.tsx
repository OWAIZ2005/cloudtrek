import { cn } from "@/lib/utils";

export const inputCls =
  "h-12 w-full border border-input bg-white px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-navy focus-visible:ring-2 focus-visible:ring-navy/15 aria-[invalid=true]:border-brand-red";

export function Field({
  id,
  label,
  error,
  required,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="block text-[13px] font-medium text-navy">
        {label}
        {required ? <span className="text-brand-red"> *</span> : <span className="font-normal text-muted-foreground"> (optional)</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-brand-red">
          {error}
        </p>
      )}
    </div>
  );
}
