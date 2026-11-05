"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { Field, inputCls } from "./fields";
import { ctaClass } from "@/components/shared/cta";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const { m } = useI18n();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ reference: string; persisted: boolean; emailStatus: string } | null>(null);

  const err = (code?: string) => (code ? ((m.quote.errors as Record<string, string>)[code] ?? m.quote.errors.generic) : undefined);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setFormError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErrors(json.fieldErrors ?? {});
        setFormError(err(json.error) ?? m.quote.errors.generic);
        return;
      }
      setDone({ reference: json.reference, persisted: json.persisted, emailStatus: json.emailStatus });
      form.reset();
    } catch {
      setFormError(m.quote.errors.network);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="border border-line bg-offwhite p-8">
        <CheckCircle2 className="size-9 text-navy" aria-hidden />
        <h3 className="mt-4 text-2xl font-semibold">{m.quote.messageSent}</h3>
        <p className="mt-2 text-sm leading-relaxed text-charcoal/80">
          {m.quote.contactRef} <strong className="text-navy" dir="ltr">{done.reference}</strong>. {m.quote.contactDone}
        </p>
        {done.persisted && done.emailStatus === "failed" && (
          <p className="mt-4 flex gap-3 border border-navy/25 bg-white p-3 text-sm">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />
            <span>{m.quote.emailDelayed}</span>
          </p>
        )}
        {!done.persisted && (
          <p className="mt-4 flex gap-3 border border-brand-red/30 bg-white p-3 text-sm">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-brand-red" aria-hidden />
            <span><strong>{m.quote.demoMode}</strong> {m.quote.demoContact}</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div aria-hidden className="absolute -start-[9999px] h-0 w-0 overflow-hidden"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="c-name" label={m.quote.f.name} required error={err(errors.customerName)}>
          <input id="c-name" name="customerName" autoComplete="name" aria-invalid={!!errors.customerName} className={inputCls} />
        </Field>
        <Field id="c-company" label={m.quote.f.company} error={err(errors.companyName)}>
          <input id="c-company" name="companyName" autoComplete="organization" aria-invalid={!!errors.companyName} className={inputCls} />
        </Field>
        <Field id="c-email" label={m.quote.f.email} required error={err(errors.email)}>
          <input id="c-email" name="email" type="email" dir="ltr" autoComplete="email" aria-invalid={!!errors.email} className={cn(inputCls, "text-start")} />
        </Field>
        <Field id="c-phone" label={m.quote.f.phone} error={err(errors.phone)}>
          <input id="c-phone" name="phone" type="tel" dir="ltr" autoComplete="tel" aria-invalid={!!errors.phone} className={cn(inputCls, "text-start")} />
        </Field>
      </div>
      <Field id="c-subject" label={m.quote.f.subject} error={err(errors.subject)}>
        <input id="c-subject" name="subject" maxLength={160} placeholder={m.quote.subjectPh} className={inputCls} />
      </Field>
      <Field id="c-message" label={m.quote.f.message} required error={err(errors.message)}>
        <textarea id="c-message" name="message" rows={6} maxLength={4000} aria-invalid={!!errors.message} className={cn(inputCls, "h-auto py-3")} />
      </Field>
      {formError && (
        <p role="alert" className="flex gap-3 border border-brand-red/40 bg-brand-red/5 p-4 text-sm"><TriangleAlert className="mt-0.5 size-4 shrink-0 text-brand-red" aria-hidden /> {formError}</p>
      )}
      <button type="submit" disabled={submitting} className={ctaClass("navy", "disabled:opacity-60")}>
        {submitting ? (<><Loader2 className="size-4 animate-spin" aria-hidden /> {m.quote.sending}</>) : m.quote.send}
      </button>
    </form>
  );
}
