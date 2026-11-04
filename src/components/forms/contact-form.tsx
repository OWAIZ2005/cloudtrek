"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { Field, inputCls } from "./fields";
import { ctaClass } from "@/components/shared/cta";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ number: string; persisted: boolean } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setFormError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("source", "contact");
    fd.set("items", "[]");
    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErrors(json.fieldErrors ?? {});
        setFormError(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      setDone({ number: json.enquiryNumber, persisted: json.persisted });
      form.reset();
    } catch {
      setFormError("We could not reach the server. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="border border-line bg-offwhite p-8">
        <CheckCircle2 className="size-9 text-navy" aria-hidden />
        <h3 className="mt-4 text-2xl font-semibold">Message received.</h3>
        <p className="mt-2 text-sm leading-relaxed text-charcoal/80">Reference <strong className="text-navy">{done.number}</strong>. We will be in touch shortly.</p>
        {!done.persisted && (
          <p className="mt-4 flex gap-3 border border-brand-red/30 bg-white p-3 text-sm">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-brand-red" aria-hidden />
            <span><strong>Demo mode:</strong> the database is not connected, so this message was validated but not stored.</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div aria-hidden className="absolute -start-[9999px] h-0 w-0 overflow-hidden"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="c-name" label="Full name" required error={errors.customerName}>
          <input id="c-name" name="customerName" autoComplete="name" aria-invalid={!!errors.customerName} className={inputCls} />
        </Field>
        <Field id="c-company" label="Company name" required error={errors.companyName}>
          <input id="c-company" name="companyName" autoComplete="organization" aria-invalid={!!errors.companyName} className={inputCls} />
        </Field>
        <Field id="c-email" label="Business email" required error={errors.email}>
          <input id="c-email" name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} className={inputCls} />
        </Field>
        <Field id="c-phone" label="Phone number" required error={errors.phone}>
          <input id="c-phone" name="phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} className={inputCls} />
        </Field>
      </div>
      <Field id="c-notes" label="How can we help?" required error={errors.notes}>
        <textarea id="c-notes" name="notes" rows={6} maxLength={3000} aria-invalid={!!errors.notes} className={cn(inputCls, "h-auto py-3")} />
      </Field>
      {formError && (
        <p role="alert" className="flex gap-3 border border-brand-red/40 bg-brand-red/5 p-4 text-sm"><TriangleAlert className="mt-0.5 size-4 shrink-0 text-brand-red" aria-hidden /> {formError}</p>
      )}
      <button type="submit" disabled={submitting} className={ctaClass("navy", "disabled:opacity-60")}>
        {submitting ? (<><Loader2 className="size-4 animate-spin" aria-hidden /> Sending…</>) : "Send message"}
      </button>
    </form>
  );
}
