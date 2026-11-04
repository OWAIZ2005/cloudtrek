-- Cloud Trek — initial schema, Row Level Security and storage.
-- Run in the Supabase SQL editor (or `supabase db push`). Idempotent where practical.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

-- Admin = a Supabase Auth user whose app_metadata.role is 'admin'.
-- app_metadata can only be changed server-side, never by the user. See README.
create or replace function public.is_admin() returns boolean
language sql stable as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
$$;

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  image       text,
  is_active   boolean not null default true,
  is_demo     boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists public.products (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  slug                  text not null unique,
  short_description     text,
  description           text,
  category_id           uuid references public.categories(id) on delete restrict,
  images                jsonb not null default '[]'::jsonb,   -- ["https://…", …]
  specifications        jsonb not null default '[]'::jsonb,   -- [{label, value}]
  customization_options jsonb not null default '[]'::jsonb,   -- ["Laser engraving", …]
  moq                   integer check (moq is null or moq > 0),
  is_featured           boolean not null default false,
  is_active             boolean not null default true,
  is_demo               boolean not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_active_featured_idx on public.products (is_active, is_featured);

create table if not exists public.enquiries (
  id                         uuid primary key default gen_random_uuid(),
  enquiry_number             text not null unique,
  customer_name              text not null,
  company_name               text not null,
  email                      text not null,
  phone                      text not null,
  quantity                   integer,
  budget_range               text,
  delivery_date              date,
  customization_requirements text,
  notes                      text,
  logo_path                  text,   -- path inside the private 'enquiry-uploads' bucket
  status                     text not null default 'new'
    check (status in ('new','contacted','quotation_sent','approved','completed','cancelled')),
  is_demo                    boolean not null default false,
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now()
);
create index if not exists enquiries_status_idx on public.enquiries (status);
create index if not exists enquiries_created_idx on public.enquiries (created_at desc);

create table if not exists public.enquiry_items (
  id                  uuid primary key default gen_random_uuid(),
  enquiry_id          uuid not null references public.enquiries(id) on delete cascade,
  product_id          uuid references public.products(id) on delete set null,
  product_name        text not null,   -- snapshot, survives product deletion
  quantity            integer not null check (quantity > 0),
  customization_notes text
);
create index if not exists enquiry_items_enquiry_idx on public.enquiry_items (enquiry_id);

create table if not exists public.portfolio_projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text not null unique,
  category    text,
  description text,
  images      jsonb not null default '[]'::jsonb,
  details     jsonb not null default '[]'::jsonb,   -- [{label, value}]
  is_featured boolean not null default false,
  is_demo     boolean not null default false,
  created_at  timestamptz not null default now()
);

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();
drop trigger if exists enquiries_updated_at on public.enquiries;
create trigger enquiries_updated_at before update on public.enquiries
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
--  * Public visitors: read ACTIVE catalogue + portfolio only.
--  * Enquiries: no public policies at all. Submissions are inserted by the
--    server (service role) via /api/enquiries, so a visitor can never read
--    anyone's enquiry.
--  * Admin (app_metadata.role = 'admin'): full access.
-- ---------------------------------------------------------------------------

alter table public.categories         enable row level security;
alter table public.products           enable row level security;
alter table public.enquiries          enable row level security;
alter table public.enquiry_items      enable row level security;
alter table public.portfolio_projects enable row level security;

drop policy if exists "public read active categories" on public.categories;
create policy "public read active categories" on public.categories
  for select using (is_active = true);
drop policy if exists "admin all categories" on public.categories;
create policy "admin all categories" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read active products" on public.products;
create policy "public read active products" on public.products
  for select using (is_active = true);
drop policy if exists "admin all products" on public.products;
create policy "admin all products" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read portfolio" on public.portfolio_projects;
create policy "public read portfolio" on public.portfolio_projects
  for select using (true);
drop policy if exists "admin all portfolio" on public.portfolio_projects;
create policy "admin all portfolio" on public.portfolio_projects
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin all enquiries" on public.enquiries;
create policy "admin all enquiries" on public.enquiries
  for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin all enquiry items" on public.enquiry_items;
create policy "admin all enquiry items" on public.enquiry_items
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage
--  catalogue        : public-read bucket for product / category / portfolio images
--  enquiry-uploads  : PRIVATE bucket for customer logos (service role writes,
--                     admins read through signed URLs)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('catalogue', 'catalogue', true, 5242880, array['image/png','image/jpeg','image/webp','image/avif'])
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit)
values ('enquiry-uploads', 'enquiry-uploads', false, 5242880)
on conflict (id) do nothing;

drop policy if exists "catalogue public read" on storage.objects;
create policy "catalogue public read" on storage.objects
  for select using (bucket_id = 'catalogue');
drop policy if exists "catalogue admin write" on storage.objects;
create policy "catalogue admin write" on storage.objects
  for all using (bucket_id = 'catalogue' and public.is_admin())
  with check (bucket_id = 'catalogue' and public.is_admin());
drop policy if exists "enquiry uploads admin read" on storage.objects;
create policy "enquiry uploads admin read" on storage.objects
  for select using (bucket_id = 'enquiry-uploads' and public.is_admin());
