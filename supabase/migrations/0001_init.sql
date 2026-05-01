-- =====================================================================
-- Studio — Initial schema
-- Run this in Supabase SQL Editor (Dashboard → SQL → New query → paste → Run)
-- =====================================================================

-- Enums --------------------------------------------------------------
do $$ begin
  create type user_role as enum ('client', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type project_status as enum (
    'pending', 'negotiating', 'accepted', 'in_progress',
    'review', 'completed', 'cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type service_type as enum (
    'website', 'ai_agent', 'system_design',
    'scraping', 'website_fix', 'custom'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type contact_method as enum ('whatsapp', 'call', 'meeting', 'email');
exception when duplicate_object then null; end $$;

-- Tables -------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  role user_role not null default 'client',
  whatsapp_number text,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  service_type service_type not null,
  scope_details jsonb,
  timeline_weeks int,
  start_date date,
  budget_min numeric,
  budget_max numeric,
  agreed_price numeric,
  status project_status not null default 'pending',
  preferred_contact contact_method,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo','doing','done')),
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.project_messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  client_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric not null,
  note text,
  paid_at timestamptz not null default now()
);

-- Indexes ------------------------------------------------------------
create index if not exists idx_projects_client_status on public.projects (client_id, status);
create index if not exists idx_projects_status_created on public.projects (status, created_at desc);
create index if not exists idx_tasks_project on public.project_tasks (project_id, position);
create index if not exists idx_messages_project on public.project_messages (project_id, created_at desc);
create index if not exists idx_payments_client on public.payments (client_id, paid_at desc);

-- updated_at trigger -------------------------------------------------
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_projects_updated on public.projects;
create trigger trg_projects_updated
  before update on public.projects
  for each row execute function public.tg_set_updated_at();

-- Profile bootstrap on signup ----------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, phone, whatsapp_number, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'whatsapp_number',
    'client'
  );
  return new;
end $$;

drop trigger if exists trg_on_auth_user_created on auth.users;
create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS ----------------------------------------------------------------
alter table public.profiles         enable row level security;
alter table public.projects         enable row level security;
alter table public.project_tasks    enable row level security;
alter table public.project_messages enable row level security;
alter table public.payments         enable row level security;

-- Helper: is_admin() -------------------------------------------------
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- profiles policies
drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

-- projects policies
drop policy if exists "projects_select" on public.projects;
create policy "projects_select" on public.projects
  for select using (client_id = auth.uid() or public.is_admin());

drop policy if exists "projects_insert" on public.projects;
create policy "projects_insert" on public.projects
  for insert with check (client_id = auth.uid());

drop policy if exists "projects_update_admin" on public.projects;
create policy "projects_update_admin" on public.projects
  for update using (public.is_admin());

-- project_tasks policies
drop policy if exists "tasks_select" on public.project_tasks;
create policy "tasks_select" on public.project_tasks
  for select using (
    public.is_admin()
    or exists (select 1 from public.projects p where p.id = project_id and p.client_id = auth.uid())
  );

drop policy if exists "tasks_admin_all" on public.project_tasks;
create policy "tasks_admin_all" on public.project_tasks
  for all using (public.is_admin()) with check (public.is_admin());

-- project_messages policies
drop policy if exists "messages_select" on public.project_messages;
create policy "messages_select" on public.project_messages
  for select using (
    public.is_admin()
    or exists (select 1 from public.projects p where p.id = project_id and p.client_id = auth.uid())
  );

drop policy if exists "messages_insert" on public.project_messages;
create policy "messages_insert" on public.project_messages
  for insert with check (
    sender_id = auth.uid() and (
      public.is_admin()
      or exists (select 1 from public.projects p where p.id = project_id and p.client_id = auth.uid())
    )
  );

-- payments policies
drop policy if exists "payments_select" on public.payments;
create policy "payments_select" on public.payments
  for select using (client_id = auth.uid() or public.is_admin());

drop policy if exists "payments_admin_all" on public.payments;
create policy "payments_admin_all" on public.payments
  for all using (public.is_admin()) with check (public.is_admin());

-- Realtime publication ----------------------------------------------
-- Wrapped so re-running the migration is safe (alter publication ... add
-- raises "relation is already member" otherwise).
do $$ begin
  alter publication supabase_realtime add table public.projects;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.project_tasks;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.project_messages;
exception when duplicate_object then null; end $$;
