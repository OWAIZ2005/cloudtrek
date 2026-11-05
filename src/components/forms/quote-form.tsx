"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Minus, Paperclip, Plus, Trash2, TriangleAlert } from "lucide-react";
import { useQuote } from "@/components/quote/quote-provider";
import { Field, inputCls } from "./fields";
import { ctaClass } from "@/components/shared/cta";
import { MAX_UPLOAD_BYTES, validateUpload } from "@/lib/validations/enquiry";
import { messages } from "@/i18n/messages";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

interface CatalogueOption {
  id: string;
  slug: string;
  name: string;
  image: string;
}

type Result = { reference: string; persisted: boolean; emailStatus: "sent" | "failed" | "pending" } | null;

export function QuoteForm({ catalogue, preselect }: { catalogue: CatalogueOption[]; preselect: CatalogueOption[] }) {
  const { m } = useI18n();
  const { items, add, update, remove, clear, ready } = useQuote();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [fileName, setFileName] = useState("");
  const [picker, setPicker] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const seeded = useRef(false);

  const err = (code?: string) => (code ? ((m.quote.errors as Record<string, string>)[code] ?? m.quote.errors.generic) : undefined);
  const fieldErr = (name: string) => err(errors[name]);

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
    // Budget is stored in English so the team sees one consistent value.
    const bi = Number(fd.get("budgetIndex"));
    fd.delete("budgetIndex");
    fd.set("budgetRange", Number.isInteger(bi) && bi >= 0 ? (messages.en.budgets[bi] ?? "") : "");
    fd.set("items", JSON.stringify(items.map((i) => ({ productId: i.productId, productName: i.name, quantity: i.quantity, customizationNotes: i.notes }))));

    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErrors(json.fieldErrors ?? {});
        setFormError(err(json.error) ?? m.quote.errors.generic);
        return;
      }
      setResult({ reference: json.reference, persisted: json.persisted, emailStatus: json.emailStatus });
      clear();
      form.reset();
      setFileName("");
    } catch {
      setFormError(m.quote.errors.network);
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div role="status" className="border border-line bg-offwhite p-8 sm:p-12">
        <CheckCircle2 className="size-10 text-navy" aria-hidden />
        <h2 className="mt-5 text-3xl font-semibold">{m.quote.thanksTitle}</h2>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-charcoal/80">
          {m.quote.thanksText} <strong className="text-navy" dir="ltr">{result.reference}</strong>. {m.quote.thanksText2}
        </p>
        {result.persisted && result.emailStatus === "failed" && (
          <p className="mt-5 flex max-w-xl gap-3 border border-navy/25 bg-white p-4 text-sm text-charcoal">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />
            <span>{m.quote.emailDelayed}</span>
          </p>
        )}
        {!result.persisted && (
          <p className="mt-5 flex max-w-xl gap-3 border border-brand-red/30 bg-white p-4 text-sm text-charcoal">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-brand-red" aria-hidden />
            <span><strong>{m.quote.demoMode}</strong> {m.quote.demoQuote}</span>
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/products" className={ctaClass("navy")}>{m.quote.continueBrowsing}</Link>
          <Link href="/" className={ctaClass("outline")}>{m.cta.backHome}</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-12 lg:grid-cols-12" aria-describedby={formError ? "form-error" : undefined}>
      {/* Products */}
      <section className="lg:col-span-7" aria-labelledby="items-title">
        <h2 id="items-title" className="text-2xl font-semibold">{m.quote.s1}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{m.quote.s1Sub}</p>

        <div className="mt-6 divide-y divide-line border-y border-line" aria-live="polite">
          {items.length === 0 && (
            <p className="py-8 text-sm text-muted-foreground">
              {m.quote.emptyList} <Link href="/products" className="text-navy underline underline-offset-4">{m.quote.browse}</Link>.
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
                  <button type="button" onClick={() => remove(i.productId)} aria-label={m.quote.remove(i.name)} className="p-1 text-muted-foreground hover:text-brand-red">
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="flex flex-wrap items-end gap-4">
                  <div>
                    <label htmlFor={`qty-${i.productId}`} className="mb-1.5 block text-xs font-medium text-navy">{m.quote.qty}</label>
                    <div className="flex items-center">
                      <button type="button" aria-label={m.quote.qtyDown} onClick={() => update(i.productId, { quantity: Math.max(1, i.quantity - 10) })} className="flex size-11 items-center justify-center border border-input hover:bg-offwhite"><Minus className="size-3.5" /></button>
                      <input
                        id={`qty-${i.productId}`}
                        type="number"
                        inputMode="numeric"
                        min={1}
                        dir="ltr"
                        value={i.quantity}
                        onChange={(e) => update(i.productId, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                        className="h-11 w-24 border-y border-input bg-white text-center text-sm outline-none focus:border-navy"
                      />
                      <button type="button" aria-label={m.quote.qtyUp} onClick={() => update(i.productId, { quantity: i.quantity + 10 })} className="flex size-11 items-center justify-center border border-input hover:bg-offwhite"><Plus className="size-3.5" /></button>
                    </div>
                  </div>
                  <div className="min-w-[200px] flex-1">
                    <label htmlFor={`note-${i.productId}`} className="mb-1.5 block text-xs font-medium text-navy">{m.quote.itemNote} <span className="font-normal text-muted-foreground">({m.quote.optional})</span></label>
                    <input id={`note-${i.productId}`} value={i.notes} onChange={(e) => update(i.productId, { notes: e.target.value })} maxLength={300} placeholder={m.quote.itemNotePh} className={cn(inputCls, "h-11")} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {errors.items && <p role="alert" className="mt-3 text-sm font-medium text-brand-red">{fieldErr("items")}</p>}

        {available.length > 0 && (
          <div className="mt-5 flex gap-2">
            <label htmlFor="picker" className="sr-only">{m.quote.pickerPlaceholder}</label>
            <select id="picker" value={picker} onChange={(e) => setPicker(e.target.value)} className={cn(inputCls, "flex-1")}>
              <option value="">{m.quote.pickerPlaceholder}</option>
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
              <Plus className="size-4" aria-hidden /> {m.quote.add}
            </button>
          </div>
        )}
      </section>

      {/* Details */}
      <section className="space-y-5 lg:col-span-5" aria-labelledby="details-title">
        <h2 id="details-title" className="text-2xl font-semibold">{m.quote.s2}</h2>
        <div aria-hidden className="absolute -start-[9999px] h-0 w-0 overflow-hidden"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <Field id="customerName" label={m.quote.f.name} required error={fieldErr("customerName")}>
          <input id="customerName" name="customerName" autoComplete="name" aria-invalid={!!errors.customerName} className={inputCls} />
        </Field>
        <Field id="companyName" label={m.quote.f.company} required error={fieldErr("companyName")}>
          <input id="companyName" name="companyName" autoComplete="organization" aria-invalid={!!errors.companyName} className={inputCls} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <Field id="email" label={m.quote.f.email} required error={fieldErr("email")}>
            <input id="email" name="email" type="email" dir="ltr" autoComplete="email" aria-invalid={!!errors.email} className={cn(inputCls, "text-start")} />
          </Field>
          <Field id="phone" label={m.quote.f.phone} required error={fieldErr("phone")}>
            <input id="phone" name="phone" type="tel" dir="ltr" autoComplete="tel" aria-invalid={!!errors.phone} className={cn(inputCls, "text-start")} />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <Field id="budgetIndex" label={m.quote.f.budget}>
            <select id="budgetIndex" name="budgetIndex" defaultValue="" className={inputCls}>
              <option value="">{m.quote.select}</option>
              {m.budgets.map((b, i) => (<option key={i} value={i}>{b}</option>))}
            </select>
          </Field>
          <Field id="deliveryDate" label={m.quote.f.date} error={fieldErr("deliveryDate")}>
            <input id="deliveryDate" name="deliveryDate" type="date" className={inputCls} />
          </Field>
        </div>
      </section>

      <section className="space-y-5 lg:col-span-12" aria-labelledby="custom-title">
        <h2 id="custom-title" className="text-2xl font-semibold">{m.quote.s3}</h2>
        <div className="grid gap-5 lg:grid-cols-2">
          <Field id="customizationRequirements" label={m.quote.f.requirements} hint={m.quote.f.requirementsHint}>
            <textarea id="customizationRequirements" name="customizationRequirements" rows={5} maxLength={2000} className={cn(inputCls, "h-auto py-3")} />
          </Field>
          <Field id="notes" label={m.quote.f.notes}>
            <textarea id="notes" name="notes" rows={5} maxLength={3000} className={cn(inputCls, "h-auto py-3")} />
          </Field>
        </div>
        <Field id="file" label={m.quote.f.file} error={fieldErr("file")} hint={m.quote.fileHint(MAX_UPLOAD_BYTES / 1024 / 1024)}>
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
              <Paperclip className="size-4" aria-hidden /> {m.quote.chooseFile}
            </button>
            <span className="text-sm text-muted-foreground" dir="auto">{fileName || m.quote.noFile}</span>
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
            {submitting ? (<><Loader2 className="size-4 animate-spin" aria-hidden /> {m.quote.sending}</>) : m.quote.submit}
          </button>
          <p className="text-xs text-muted-foreground">{m.quote.noPayment}</p>
        </div>
      </div>
    </form>
  );
}
