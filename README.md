# Cloud Trek: Corporate Website MVP

Premium B2B website for **Cloud Trek** (Bahrain): promotional products, corporate gifting, events management, publicity and advertising. Quotation-based (no checkout), with a Supabase backend, an admin dashboard and Vercel-ready deployment.

> **Honesty notes (read before presenting)**
> - **Logo:** the official logo is integrated via `src/components/brand/cloudtrek-logo.tsx` (`full` / `navbar` / `emblem` variants). Assets in `public/images/brand/` are crops of the supplied artwork, regenerated with `node scripts/prepare-logo.cjs <source image>`. It is never redrawn or recoloured.
> - **All catalogue, collection, portfolio, statistics, enquiry and chart data is illustrative demo content** (`src/data/demo-data.ts`), labelled as such in the UI. Statistics (250+, 30+, 100+, 3) are sample values, not company facts.
> - **Contact details** (email, phone, WhatsApp, address, map) are placeholders until supplied via environment variables.
> - **Branding techniques** and **Arabic strings** need confirmation by Cloud Trek / a native speaker.
> - Photography is from Unsplash (free licence), stored in `public/images/`. Replace with Cloud Trek's own imagery when available.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Lucide · **React Bits** (via shadcn registry) · `motion` · Zod · Supabase (Postgres, Auth, Storage) · Recharts (admin charts only) · Resend (optional email).

## Quick start

```bash
npm install
cp .env.example .env.local     # optional: leave Supabase empty for demo mode
npm run dev                    # http://localhost:3000
```

With no Supabase variables the site runs in **demo mode**:
- Catalogue, gifting, portfolio and the admin dashboard use the demo data layer.
- The quote/contact forms validate fully but report clearly that nothing was stored ("Demo mode").
- `/admin` is a **read-only** demo dashboard (sample data, no sign-in needed because there is nothing real to protect).

When Supabase **is** configured, real records take precedence over demo data (`src/lib/data.ts`), and `/admin` requires a signed-in admin.

## React Bits

Registry configured in `components.json`:

```json
"registries": { "@react-bits": "https://reactbits.dev/r/{name}.json" }
```

shadcn MCP is configured in `.mcp.json` (`npx shadcn@latest mcp`), as documented at reactbits.dev/get-started/mcp. **Restart Claude Code once** so the MCP server loads, then ask e.g. "show me React Bits backgrounds". (The registry itself was verified from the CLI: `npx shadcn@latest search @react-bits -q blur` and `view`/`add`. The MCP server connection itself has to be confirmed after a restart.)

Installed and used, each inspected and customised to the brand (source in `src/components/reactbits/`, kept unmodified and excluded from lint):

| Component | Where |
|---|---|
| `BlurText` | Hero headline (full text stays in an sr-only node, so it is readable if animation fails) |
| `DotGrid` | Very light hero texture (desktop only) |
| `CountUp` | Statistics band |
| `AnimatedContent` | Scroll reveals via `components/shared/reveal.tsx` (once-only, brand easing) |
| `GlareHover` | Product card image interaction |
| `FluxLines` | **Global background** (one fixed WebGL2 instance in the root layout, `components/brand/global-background.tsx`; static CSS fallback without WebGL2 / on weak devices; disabled in `/admin`) |
| `SplitText` | Section headings |
| `ScrollReveal` | Positioning statement (scroll-scrubbed words) |
| `SpotlightCard` | "Why Cloud Trek" cards |
| `TrueFocus` | Headline emphasis via `components/shared/focus-heading.tsx` (customization + final CTA) |
| `Magnet` | Header "Request a Quote" CTA |

`FadeContent` (footer entrance) and `AnimatedContent` wipe (division images) are also used; `Magnet` now wraps all solid CTAs. Add more with `npx shadcn@latest add @react-bits/<Name>-TS-TW`.

## Supabase setup

1. Create a project at supabase.com.
2. SQL editor → run, in order, `supabase/migrations/0001_init.sql` (tables, indexes, RLS, storage buckets `catalogue` and `enquiry-uploads`) and `supabase/migrations/0002_email_contact_translations.sql` (email delivery tracking, `contact_messages`, Arabic `translations` columns).
3. *(Optional demo catalogue)* run `supabase/seed.sql` (rows flagged `is_demo = true`). Regenerate with `npm run seed:generate`. `supabase/demo-enquiries.sql` is a **separate, optional** file of clearly flagged `DEMO-` enquiries; never run it against a live customer database.
4. Copy the project URL, the **publishable** key (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; legacy `..._ANON_KEY` also works) and the **secret** key (`SUPABASE_SECRET_KEY`; legacy `SUPABASE_SERVICE_ROLE_KEY` also works) into `.env.local` / Vercel. **The secret key is server-only; never prefix it with `NEXT_PUBLIC_`.**

### Create an admin account
1. Supabase → Authentication → Users → *Add user* (email + password, tick auto-confirm).
2. Mark them admin (this lives in `app_metadata`, which users cannot edit themselves):
   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'
   where email = 'admin@your-domain.example';
   ```
3. Sign in at `/admin/login`.

### Security model
- Public visitors can read only **active** products/categories and portfolio entries (RLS).
- `enquiries` / `enquiry_items` have **no public policies**. Submissions are written server-side through `/api/enquiries` using the service role, so nobody can read anyone's enquiry from the browser.
- Customer uploads go to the **private** `enquiry-uploads` bucket (PNG/JPG/WebP/SVG/PDF/AI/EPS/PSD, ≤ 5 MB, validated client- and server-side); admins view them through short-lived signed URLs.
- Admin = `app_metadata.role = 'admin'`, enforced in `src/proxy.ts` (optimistic redirect), `requireAdmin()` on every admin page/action, and again by RLS in the database.
- Honeypot field plus a small per-instance rate limit on the enquiry endpoint (use a shared store such as Upstash for strict limits).

## Email (Resend)

Every quote enquiry and every contact message is emailed to **`CLOUDTREK_ENQUIRY_EMAIL`** (default `aslam@cloudtrekbh.com`).

Flow: validate on the server → save to Supabase → send the email → store the delivery status → respond. `email_status` is `pending`, `sent` or `failed`; **`sent` is stored only when Resend accepted the message**. If the email fails the submission is **kept** (never discarded), the visitor is told it was saved but the team notification is delayed, and an admin can press **Retry email** on the enquiry or message page. Without Supabase the form still tries to email the team but tells the visitor nothing was stored.

Required variables (server-side only): `RESEND_API_KEY`, `CLOUDTREK_FROM_EMAIL`, `CLOUDTREK_ENQUIRY_EMAIL`. Optional: `CLOUDTREK_SEND_CUSTOMER_CONFIRMATION=true` sends the customer a bilingual receipt.

**Sender domain:** Resend only delivers from a domain you have verified. In Resend → Domains, add `cloudtrekbh.com`, then add exactly the DNS records Resend shows (SPF/TXT, DKIM, and optional DMARC) at the domain's DNS host, wait for "Verified", and set `CLOUDTREK_FROM_EMAIL` to an address on that domain. Until then Resend rejects sends (recorded as `failed`, retryable).

Safety: the API key never reaches the browser; all user input is HTML-escaped in templates; subject lines and reply-to values are stripped of line breaks (no header injection); a honeypot field and per-IP rate limiting guard both endpoints; uploads are type- and size-checked and stored in a private bucket.

## Editable content map

| What | Where |
|---|---|
| Contact details, logo, feature flags | `.env.local` + `src/config/site.ts` |
| Divisions, techniques, process, values | `src/config/content.ts` |
| Demo products, collections, projects, stats, enquiries | `src/data/demo-data.ts` |
| Navigation + UI strings (EN/AR) | `src/config/site.ts`, `src/i18n/dictionaries.ts` |
| Colours / typography | `src/app/globals.css` (`@theme`) |

Gifting collections and statistics are editorial content (no table in the MVP schema). Testimonials / client logos are intentionally **not** shown (`siteConfig.features`); the homepage uses a positioning section until verified material exists.

## Languages (English / Arabic)

One application, two languages. The choice is stored in the `ct_locale` cookie and applied on the server (`<html lang dir>`), so there is no flash of the wrong language or direction, and it persists across navigation and refresh.

- **UI copy:** `src/i18n/messages.ts` holds English and Arabic side by side; the Arabic object is typed against the English one, so a missing translation fails the build.
- **Content (products, categories, collections, projects, services, steps, values, statistics):** each record keeps its English fields plus an `ar` object (`src/data/demo-data.ar.ts`, `src/config/content.ts`). For database records, Arabic is stored in the `translations` JSON column and can be entered from the admin product, category and project forms. Missing Arabic falls back to English.
- **RTL:** logical Tailwind utilities (`ps/pe/ms/me/start/end`), mirrored directional arrows, `:dir(rtl)` typography rules (no letter-spacing, taller line height), Noto Sans Arabic. Logos, photographs, phone numbers and e-mail addresses are not mirrored.
- The **admin dashboard is English-only** by design (internal staff tool) and stays left-to-right.
- The Arabic wording is written as natural business Arabic but should be reviewed by Cloud Trek before launch. The Arabic brand name matches the official logo spelling (كلاودترك).

## Deploy to Vercel

1. Push to GitHub and import the repo in Vercel (framework: Next.js; no special build settings).
2. Add the environment variables from `.env.example` (Production + Preview).
3. Set `NEXT_PUBLIC_SITE_URL` to the final domain (sitemap, canonical, Open Graph).
4. Deploy, then complete the Supabase steps above and add the Vercel domain under Supabase → Authentication → URL configuration.

`next.config.ts` pins `turbopack.root` (a stray lockfile in a parent folder otherwise breaks workspace detection) and allows Supabase Storage images automatically when `NEXT_PUBLIC_SUPABASE_URL` is set.

## Scripts

```bash
npm run dev | build | start | lint | typecheck | seed:generate
```

## Route map

`/` · `/products` (search + category filters via URL) · `/products/[slug]` · `/corporate-gifting` · `/services` · `/our-work` · `/about` · `/contact` · `/quote` (multi-product enquiry list, `?product=slug`, `?collection=slug`) · `/admin` (overview, enquiries, products, categories, portfolio) · `/sitemap.xml` · `/robots.txt`
