"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Minus, Paperclip, Plus, Trash2, TriangleAlert } from "lucide-react";
import { useQuote } from "@/components/quote/quote-provider";
import { Field, inputCls } from "./fields";
import { ctaClass } from "@/components/shared/cta";
import { budgetRanges } from "@/config/content";
import { MAX_UPLOAD_BYTES, validateUpload } from "@/lib/validations/enquiry";
import { cn } from "@/lib/utils";

interface CatalogueOption {
  id: string;
  slug: string;
  name: string;
  image: string;
}

type Result = { ok: true; enquiryNumber: string; persisted: boolean } | null;

export function QuoteForm({ catalogue, preselect }: { catalogue: CatalogueOption[]; preselect: CatalogueOption[] }) {
  const { items, add, update, remove, clear, ready } = useQuote();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [fileName, setFileName] = useState("");
  const [picker, setPicker] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const seeded = useRef(false);

  useEffect(() => {
    if (!ready || seeded.current) return;
    seeded.current = true;
    preselect.forEach((p) => add({ productId: p.id, slug: p.slug, name: p.name, image: p.image }));
  }, [ready, preselect, add]);

  const available = catalogue.filter((c) => !items.some((i) => i.productId === c.id));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    setErrors({});
    const form = e.currentTarget;
    const fd = new FormData(form);

    const file = fd.get("file");
    if (file instanceof File && file.size > 0) {
      const problem = validateUpload(file);
      if (problem) {
        setErrors({ file: problem });
        return;
      }
    }
    fd.set("source", "quote");
    fd.set(
      "items",
      JSON.stringify(
        items.map((i) => ({
          productId: i.productId,
          productName: i.name,
          quantity: i.quantity,
          customizationNotes: i.notes,
        })),
      ),
    );

    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErrors(json.fieldErrors ?? {});
        setFormError(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      setResult({ ok: true, enquiryNumber: json.enquiryNumber, persisted: json.persisted });
      clear();
      form.reset();
      setFileName("");
    } catch {
      setFormError("We could not reach the server. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div role="status" className="border border-line bg-offwhite p-8 sm:p-12">
        <CheckCircle2 className="size-10 text-navy" aria-hidden />
        <h2 className="mt-5 text-3xl font-semibold">Thank you. Your enquiry is in.</h2>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-charcoal/80">
          Your reference is <strong className="text-navy">{result.enquiryNumber}</strong>. We will review your requirements and come back to you with a quotation.
        </p>
        {!result.persisted && (
          <p className="mt-5 flex max-w-xl gap-3 border border-brand-red/30 bg-white p-4 text-sm text-charcoal">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-brand-red" aria-hidden />
            <span><strong>Demo mode:</strong> the database is not connected on this deployment, so this enquiry was validated but <em>not stored</em>.</span>
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/products" className={ctaClass("navy")}>Continue browsing</Link>
          <Link href="/" className={ctaClass("outline")}>Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-12 lg:grid-cols-12" aria-describedby={formError ? "form-error" : undefined}>
      {/* Products */}
      <section className="lg:col-span-7" aria-labelledby="items-title">
        <h2 id="items-title" className="text-2xl font-semibold">1. Your products</h2>
        <p className="mt-1 text-sm text-muted-foreground">Add one or more products with estimated quantities.</p>

        <div className="mt-6 divide-y divide-line border-y border-line" aria-live="polite">
          {items.length === 0 && (
            <p className="py-8 text-sm text-muted-foreground">
              Your enquiry list is empty. Choose a product below or <Link href="/products" className="text-navy underline underline-offset-4">browse the catalogue</Link>.
            </p>
          )}
          {items.map((i) => (
            <div key={i.productId} className="grid gap-4 py-5 sm:grid-cols-[72px_1fr]">
              <div className="relative size-[72px] overflow-hidden bg-offwhite">
                <Image src={i.image} alt="" fill sizes="72px" className="object-cover" />
              </div>
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/products/${i.slug}`} className="text-base font-semibold leading-snug text-navy hover:text-brand-red">{i.name}</Link>
                  <button type="button" onClick={() => remove(i.productId)} aria-label={`Remove ${i.name}`} className="p-1 text-muted-foreground hover:text-brand-red">
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="flex flex-wrap items-end gap-4">
                  <div>
                    <label htmlFor={`qty-${i.productId}`} className="mb-1.5 block text-xs font-medium text-navy">Estimated quantity</label>
                    <div className="flex items-center">
                      <button type="button" aria-label="Decrease quantity" onClick={() => update(i.productId, { quantity: Math.max(1, i.quantity - 10) })} className="flex size-11 items-center justify-center border border-input hover:bg-offwhite"><Minus className="size-3.5" /></button>
                      <input
                        id={`qty-${i.productId}`}
                        type="number"
                        inputMode="numeric"
                        min={1}
                        value={i.quantity}
                        onChange={(e) => update(i.productId, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                        className="h-11 w-24 border-y border-input bg-white text-center text-sm outline-none focus:border-navy"
                      />
                      <button type="button" aria-label="Increase quantity" onClick={() => update(i.productId, { quantity: i.quantity + 10 })} className="flex size-11 items-center justify-center border border-input hover:bg-offwhite"><Plus className="size-3.5" /></button>
                    </div>
                  </div>
                  <div className="min-w-[200px] flex-1">
                    <label htmlFor={`note-${i.productId}`} className="mb-1.5 block text-xs font-medium text-navy">Customization for this item <span className="font-normal text-muted-foreground">(optional)</span></label>
                    <input id={`note-${i.productId}`} value={i.notes} onChange={(e) => update(i.productId, { notes: e.target.value })} maxLength={300} placeholder="e.g. engraved logo, navy colour" className={cn(inputCls, "h-11")} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {errors.items && <p role="alert" className="mt-3 text-sm font-medium text-brand-red">{errors.items}</p>}

        {available.length > 0 && (
          <div className="mt-5 flex gap-2">
            <label htmlFor="picker" className="sr-only">Add another product</label>
            <select id="picker" value={picker} onChange={(e) => setPicker(e.target.value)} className={cn(inputCls, "flex-1")}>
              <option value="">Add a product from the catalogue…</option>
              {available.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
            <button
              type="button"
              disabled={!picker}
              onClick={() => {
                const c = catalogue.find((x) => x.id === picker);
                if (c) add({ productId: c.id, slug: c.slug, name: c.name, image: c.image });
                setPicker("");
              }}
              className="inline-flex h-12 items-center gap-2 border border-navy px-5 text-sm font-medium text-navy transition-colors hover:bg-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="size-4" aria-hidden /> Add
            </button>
          </div>
        )}
      </section>

      {/* Details */}
      <section className="space-y-5 lg:col-span-5" aria-labelledby="details-title">
        <h2 id="details-title" className="text-2xl font-semibold">2. Your details</h2>
        <div aria-hidden className="absolute -start-[9999px] h-0 w-0 overflow-hidden"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <Field id="customerName" label="Full name" required error={errors.customerName}>
          <input id="customerName" name="customerName" autoComplete="name" aria-invalid={!!errors.customerName} className={inputCls} />
        </Field>
        <Field id="companyName" label="Company name" required error={errors.companyName}>
          <input id="companyName" name="companyName" autoComplete="organization" aria-invalid={!!errors.companyName} className={inputCls} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <Field id="email" label="Business email" required error={errors.email}>
            <input id="email" name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} className={inputCls} />
          </Field>
          <Field id="phone" label="Phone number" required error={errors.phone}>
            <input id="phone" name="phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} className={inputCls} />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <Field id="budgetRange" label="Budget range" error={errors.budgetRange}>
            <select id="budgetRange" name="budgetRange" defaultValue="" className={inputCls}>
              <option value="">Select…</option>
              {budgetRanges.map((b) => (<option key={b}>{b}</option>))}
            </select>
          </Field>
          <Field id="deliveryDate" label="Required delivery date" error={errors.deliveryDate}>
            <input id="deliveryDate" name="deliveryDate" type="date" className={inputCls} />
          </Field>
        </div>
      </section>

      <section className="space-y-5 lg:col-span-12" aria-labelledby="custom-title">
        <h2 id="custom-title" className="text-2xl font-semibold">3. Customization &amp; notes</h2>
        <div className="grid gap-5 lg:grid-cols-2">
          <Field id="customizationRequirements" label="Customization requirements" error={errors.customizationRequirements} hint="Logo placement, colours, personalisation, packaging…">
            <textarea id="customizationRequirements" name="customizationRequirements" rows={5} maxLength={2000} className={cn(inputCls, "h-auto py-3")} />
          </Field>
          <Field id="notes" label="Additional notes" error={errors.notes}>
            <textarea id="notes" name="notes" rows={5} maxLength={3000} className={cn(inputCls, "h-auto py-3")} />
          </Field>
        </div>
        <Field id="file" label="Logo or reference file" error={errors.file} hint={`PNG, JPG, WebP, SVG, PDF, AI, EPS or PSD · up to ${MAX_UPLOAD_BYTES / 1024 / 1024} MB`}>
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileRef}
              id="file"
              name="file"
              type="file"
              accept=".png,.jpg,.jpeg,.webp,.svg,.pdf,.ai,.eps,.psd"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              className="sr-only"
            />
            <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex h-12 items-center gap-2 border border-input bg-white px-5 text-sm font-medium text-navy hover:border-navy">
              <Paperclip className="size-4" aria-hidden /> Choose file
            </button>
            <span className="text-sm text-muted-foreground">{fileName || "No file selected"}</span>
          </div>
        </Field>
      </section>

      <div className="lg:col-span-12">
        {formError && (
          <p id="form-error" role="alert" className="mb-5 flex gap-3 border border-brand-red/40 bg-brand-red/5 p-4 text-sm text-charcoal">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-brand-red" aria-hidden /> {formError}
          </p>
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <button type="submit" disabled={submitting} className={ctaClass("red", "min-w-56 disabled:opacity-60")}>
            {submitting ? (<><Loader2 className="size-4 animate-spin" aria-hidden /> Sending…</>) : "Submit enquiry"}
          </button>
          <p className="text-xs text-muted-foreground">There is no payment at this stage. We will respond with a quotation.</p>
        </div>
      </div>
    </form>
  );
}
