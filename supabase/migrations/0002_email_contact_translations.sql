-- Cloud Trek — migration 0002
--   * email delivery tracking on enquiries
--   * contact_messages table
--   * Arabic translations column on catalogue tables
-- Run after 0001_init.sql (Supabase SQL editor or `supabase db push`). Idempotent.

-- ---------------------------------------------------------------------------
-- Email delivery tracking (quote enquiries)
-- ---------------------------------------------------------------------------
alter table public.enquiries
  add column if not exists email_status   text not null default 'pending'
    check (email_status in ('pending', 'sent', 'failed')),
  add column if not exists email_error    text,
  add column if not exists email_sent_at  timestamptz,
  add column if not exists email_attempts integer not null default 0;

create index if not exists enquiries_email_status_idx on public.enquiries (email_status);

-- ---------------------------------------------------------------------------
-- Contact messages ("Talk to us" form)
-- ---------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id               uuid primary key default gen_random_uuid(),
  reference_number text not null unique,
  customer_name    text not null,
  email            text not null,
  phone            text,
  company_name     text,
  subject          text,
  message          text not null,
  status           text not null default 'new' check (status in ('new', 'handled')),
  email_status     text not null default 'pending' check (email_status in ('pending', 'sent', 'failed')),
  email_error      text,
  email_sent_at    timestamptz,
  email_attempts   integer not null default 0,
  is_demo          boolean not null default false,
  created_at       timestamptz not null default now()
);

create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);
create index if not exists contact_messages_email_status_idx on public.contact_messages (email_status);

-- RLS: NO public policies. Visitors submit through the server route (/api/contact),
-- which writes with the service role, so no visitor can read, edit or delete messages.
alter table public.contact_messages enable row level security;

drop policy if exists "admin all contact messages" on public.contact_messages;
create policy "admin all contact messages" on public.contact_messages
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Arabic translations for catalogue content
--   { "ar": { "name": "...", "shortDescription": "...", "description": "...",
--             "specifications": [{"label":"..","value":".."}], "customizationOptions": ["..."] } }
-- ---------------------------------------------------------------------------
alter table public.categories         add column if not exists translations jsonb not null default '{}'::jsonb;
alter table public.products           add column if not exists translations jsonb not null default '{}'::jsonb;
alter table public.portfolio_projects add column if not exists translations jsonb not null default '{}'::jsonb;
