"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { Loader2, X } from "lucide-react";
import { adminInput, ghostBtn, Notice, primaryBtn } from "./ui";
import { saveCategory, saveProduct, saveProject, type ActionState } from "@/app/admin/actions";
import type { Category, PortfolioProject, Product } from "@/types";
import Link from "next/link";

type Action = (s: ActionState, f: FormData) => Promise<ActionState>;

function Row({ id, label, hint, children }: { id: string; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[13px] font-medium text-navy">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ArabicBlock({ children }: { children: React.ReactNode }) {
  return (
    <fieldset className="space-y-5 border border-line bg-offwhite/60 p-4">
      <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-navy">Arabic translation (shown when the visitor selects Arabic)</legend>
      {children}
    </fieldset>
  );
}

const area = "w-full border border-input bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-navy disabled:bg-offwhite";

function ImagePicker({ initial, name = "keepImages", fileName = "newImages", multiple = true }: { initial: string[]; name?: string; fileName?: string; multiple?: boolean }) {
  const [kept, setKept] = useState(initial);
  return (
    <div className="space-y-3">
      {kept.length > 0 && (
        <ul className="flex flex-wrap gap-3">
          {kept.map((src) => (
            <li key={src} className="relative size-24 overflow-hidden border border-line bg-offwhite">
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
              <input type="hidden" name={name} value={src} />
              <button type="button" aria-label="Remove image" onClick={() => setKept((k) => k.filter((s) => s !== src))} className="absolute end-1 top-1 bg-white p-1 text-brand-red shadow"><X className="size-3.5" /></button>
            </li>
          ))}
        </ul>
      )}
      <input type="file" name={fileName} accept="image/png,image/jpeg,image/webp,image/avif" multiple={multiple} className="block w-full text-sm file:me-3 file:border file:border-input file:bg-white file:px-3 file:py-2 file:text-sm file:text-navy" />
      <p className="text-xs text-muted-foreground">PNG, JPG, WebP or AVIF, up to 5 MB each. Stored in Supabase Storage.</p>
    </div>
  );
}

function Shell({ action, readOnly, backHref, children }: { action: Action; readOnly: boolean; backHref: string; children: React.ReactNode }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, undefined);
  return (
    <form action={formAction} className="space-y-6">
      {state?.error && <Notice kind="error">{state.error}</Notice>}
      <fieldset disabled={readOnly || pending} className="space-y-6">{children}</fieldset>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={readOnly || pending} className={primaryBtn}>{pending && <Loader2 className="size-4 animate-spin" aria-hidden />} Save</button>
        <Link href={backHref} className={ghostBtn}>Cancel</Link>
        {readOnly && <span className="text-xs text-muted-foreground">Read-only in demo mode.</span>}
      </div>
    </form>
  );
}

export function ProductForm({ product, categories, readOnly }: { product?: (Product & { categoryId?: string }) | null; categories: Category[]; readOnly: boolean }) {
  const p = product;
  const selected = p?.categoryId ?? "";
  return (
    <Shell action={saveProduct} readOnly={readOnly} backHref="/admin/products">
      {p && !readOnly && <input type="hidden" name="id" value={p.id} />}
      <div className="grid gap-5 md:grid-cols-2">
        <Row id="name" label="Name"><input id="name" name="name" required defaultValue={p?.name} className={adminInput} /></Row>
        <Row id="slug" label="Slug" hint="Leave blank to generate from the name."><input id="slug" name="slug" defaultValue={p?.slug} className={adminInput} /></Row>
        <Row id="categoryId" label="Category">
          <select id="categoryId" name="categoryId" defaultValue={selected} className={adminInput}>
            <option value="">Uncategorised</option>
            {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
        </Row>
        <Row id="moq" label="Minimum order quantity" hint="Leave blank if not yet known."><input id="moq" name="moq" type="number" min={1} defaultValue={p?.moq ?? ""} className={adminInput} /></Row>
      </div>
      <Row id="shortDescription" label="Short description"><input id="shortDescription" name="shortDescription" defaultValue={p?.shortDescription} maxLength={200} className={adminInput} /></Row>
      <Row id="description" label="Description"><textarea id="description" name="description" rows={5} defaultValue={p?.description} className={area} /></Row>
      <div className="grid gap-5 md:grid-cols-2">
        <Row id="specifications" label="Specifications" hint="One per line, as Label: Value."><textarea id="specifications" name="specifications" rows={5} defaultValue={p?.specifications.map((s) => `${s.label}: ${s.value}`).join("\n")} className={area} /></Row>
        <Row id="customizationOptions" label="Customization options" hint="One per line."><textarea id="customizationOptions" name="customizationOptions" rows={5} defaultValue={p?.customizationOptions.join("\n")} className={area} /></Row>
      </div>
      <ArabicBlock>
        <Row id="ar_name" label="Name (Arabic)"><input id="ar_name" name="ar_name" dir="rtl" defaultValue={p?.ar?.name} className={adminInput} /></Row>
        <Row id="ar_shortDescription" label="Short description (Arabic)"><input id="ar_shortDescription" name="ar_shortDescription" dir="rtl" defaultValue={p?.ar?.shortDescription} className={adminInput} /></Row>
        <Row id="ar_description" label="Description (Arabic)"><textarea id="ar_description" name="ar_description" dir="rtl" rows={4} defaultValue={p?.ar?.description} className={area} /></Row>
        <div className="grid gap-5 md:grid-cols-2">
          <Row id="ar_specifications" label="Specifications (Arabic)" hint="One per line, as Label: Value."><textarea id="ar_specifications" name="ar_specifications" dir="rtl" rows={4} defaultValue={p?.ar?.specifications?.map((s) => `${s.label}: ${s.value}`).join("\n")} className={area} /></Row>
          <Row id="ar_customizationOptions" label="Customization options (Arabic)" hint="One per line."><textarea id="ar_customizationOptions" name="ar_customizationOptions" dir="rtl" rows={4} defaultValue={p?.ar?.customizationOptions?.join("\n")} className={area} /></Row>
        </div>
      </ArabicBlock>
      <Row id="images" label="Images"><ImagePicker initial={p?.images ?? []} /></Row>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isFeatured" defaultChecked={p?.isFeatured} className="size-4 accent-[#173b70]" /> Featured on homepage</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isActive" defaultChecked={p ? p.isActive : true} className="size-4 accent-[#173b70]" /> Active (visible on website)</label>
      </div>
    </Shell>
  );
}

export function CategoryForm({ category, readOnly }: { category?: Category | null; readOnly: boolean }) {
  const c = category;
  return (
    <Shell action={saveCategory} readOnly={readOnly} backHref="/admin/categories">
      {c && !readOnly && <input type="hidden" name="id" value={c.id} />}
      <div className="grid gap-5 md:grid-cols-2">
        <Row id="name" label="Name"><input id="name" name="name" required defaultValue={c?.name} className={adminInput} /></Row>
        <Row id="slug" label="Slug"><input id="slug" name="slug" defaultValue={c?.slug} className={adminInput} /></Row>
      </div>
      <Row id="description" label="Description"><textarea id="description" name="description" rows={3} defaultValue={c?.description} className={area} /></Row>
      <ArabicBlock>
        <Row id="ar_name" label="Name (Arabic)"><input id="ar_name" name="ar_name" dir="rtl" defaultValue={c?.ar?.name} className={adminInput} /></Row>
        <Row id="ar_description" label="Description (Arabic)"><textarea id="ar_description" name="ar_description" dir="rtl" rows={3} defaultValue={c?.ar?.description} className={area} /></Row>
      </ArabicBlock>
      <Row id="image" label="Image">
        <input type="hidden" name="keepImage" value={c?.image ?? ""} />
        {c?.image && <div className="relative mb-3 size-24 overflow-hidden border border-line"><Image src={c.image} alt="" fill sizes="96px" className="object-cover" /></div>}
        <ImagePicker initial={[]} fileName="image" multiple={false} />
      </Row>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isActive" defaultChecked={c ? c.isActive : true} className="size-4 accent-[#173b70]" /> Active</label>
    </Shell>
  );
}

export function ProjectForm({ project, readOnly }: { project?: PortfolioProject | null; readOnly: boolean }) {
  const p = project;
  return (
    <Shell action={saveProject} readOnly={readOnly} backHref="/admin/portfolio">
      {p && !readOnly && <input type="hidden" name="id" value={p.id} />}
      <div className="grid gap-5 md:grid-cols-2">
        <Row id="title" label="Title"><input id="title" name="title" required defaultValue={p?.title} className={adminInput} /></Row>
        <Row id="slug" label="Slug"><input id="slug" name="slug" defaultValue={p?.slug} className={adminInput} /></Row>
        <Row id="category" label="Category"><input id="category" name="category" defaultValue={p?.category} className={adminInput} /></Row>
      </div>
      <Row id="description" label="Description"><textarea id="description" name="description" rows={4} defaultValue={p?.description} className={area} /></Row>
      <Row id="details" label="Project details" hint="One per line, as Label: Value."><textarea id="details" name="details" rows={4} defaultValue={p?.details.map((s) => `${s.label}: ${s.value}`).join("\n")} className={area} /></Row>
      <ArabicBlock>
        <Row id="ar_title" label="Title (Arabic)"><input id="ar_title" name="ar_title" dir="rtl" defaultValue={p?.ar?.title} className={adminInput} /></Row>
        <Row id="ar_category" label="Category (Arabic)"><input id="ar_category" name="ar_category" dir="rtl" defaultValue={p?.ar?.category} className={adminInput} /></Row>
        <Row id="ar_description" label="Description (Arabic)"><textarea id="ar_description" name="ar_description" dir="rtl" rows={3} defaultValue={p?.ar?.description} className={area} /></Row>
        <Row id="ar_details" label="Project details (Arabic)" hint="One per line, as Label: Value."><textarea id="ar_details" name="ar_details" dir="rtl" rows={3} defaultValue={p?.ar?.details?.map((s) => `${s.label}: ${s.value}`).join("\n")} className={area} /></Row>
      </ArabicBlock>
      <Row id="images" label="Images"><ImagePicker initial={p?.images ?? []} /></Row>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isFeatured" defaultChecked={p?.isFeatured} className="size-4 accent-[#173b70]" /> Featured</label>
    </Shell>
  );
}
