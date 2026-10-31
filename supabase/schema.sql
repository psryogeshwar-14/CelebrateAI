-- ============================================================================
-- CelebrateAI Initial Database Schema
-- Supabase Postgres with Enums, Row-Level Security (RLS) & Indexes
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
create type event_type_enum as enum ('wedding', 'birthday', 'community_event');
create type event_status_enum as enum ('draft', 'planning', 'confirmed', 'completed');
create type budget_category_enum as enum (
  'venue',
  'catering',
  'decor',
  'photography',
  'entertainment',
  'apparel_makeup',
  'invitations_favors',
  'logistics_permits',
  'contingency'
);
create type task_status_enum as enum ('todo', 'in_progress', 'done', 'overdue');
create type task_priority_enum as enum ('low', 'medium', 'high', 'critical');
create type vendor_status_enum as enum ('shortlisted', 'contacted', 'quoted', 'booked', 'cancelled');
create type idea_kind_enum as enum ('theme', 'menu', 'risk', 'run_sheet', 'saving_tip');

-- ----------------------------------------------------------------------------
-- Table: events
-- ----------------------------------------------------------------------------
create table public.events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  event_type event_type_enum not null,
  title text not null,
  city text not null default 'Bengaluru',
  event_date date not null,
  guest_count integer not null check (guest_count > 0),
  total_budget numeric(14, 2) not null check (total_budget >= 0),
  currency text not null default 'INR',
  style text not null,
  dietary_needs text[] not null default '{}',
  accessibility_needs text[] not null default '{}',
  special_requests text,
  status event_status_enum not null default 'planning',
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_events_user_id on public.events(user_id);
create index idx_events_is_demo on public.events(is_demo);
create index idx_events_date on public.events(event_date);

-- ----------------------------------------------------------------------------
-- Table: budget_items
-- ----------------------------------------------------------------------------
create table public.budget_items (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  category budget_category_enum not null,
  planned_amount numeric(14, 2) not null check (planned_amount >= 0),
  actual_amount numeric(14, 2) not null default 0.00 check (actual_amount >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_budget_items_event_id on public.budget_items(event_id);
create index idx_budget_items_category on public.budget_items(category);

-- ----------------------------------------------------------------------------
-- Table: timeline_tasks
-- ----------------------------------------------------------------------------
create table public.timeline_tasks (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  title text not null,
  description text,
  owner text not null default 'Host',
  due_date date not null,
  status task_status_enum not null default 'todo',
  priority task_priority_enum not null default 'medium',
  dependency_task_id uuid references public.timeline_tasks(id) on delete set null,
  is_ai_generated boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_timeline_tasks_event_id on public.timeline_tasks(event_id);
create index idx_timeline_tasks_due_date on public.timeline_tasks(due_date);
create index idx_timeline_tasks_status on public.timeline_tasks(status);

-- ----------------------------------------------------------------------------
-- Table: vendors
-- ----------------------------------------------------------------------------
create table public.vendors (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  vendor_type text not null,
  name text,
  contact text,
  quote_amount numeric(14, 2) check (quote_amount >= 0),
  status vendor_status_enum not null default 'shortlisted',
  booking_deadline date not null,
  questions text[] not null default '{}',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_vendors_event_id on public.vendors(event_id);
create index idx_vendors_deadline on public.vendors(booking_deadline);
create index idx_vendors_status on public.vendors(status);

-- ----------------------------------------------------------------------------
-- Table: ideas
-- ----------------------------------------------------------------------------
create table public.ideas (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  kind idea_kind_enum not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index idx_ideas_event_id on public.ideas(event_id);
create index idx_ideas_kind on public.ideas(kind);

-- ----------------------------------------------------------------------------
-- Auto-update updated_at Trigger
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_events_updated_at
before update on public.events
for each row execute function public.set_updated_at();

create trigger trigger_budget_items_updated_at
before update on public.budget_items
for each row execute function public.set_updated_at();

create trigger trigger_timeline_tasks_updated_at
before update on public.timeline_tasks
for each row execute function public.set_updated_at();

create trigger trigger_vendors_updated_at
before update on public.vendors
for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Row-Level Security (RLS) Policies
-- ----------------------------------------------------------------------------
alter table public.events enable row level security;
alter table public.budget_items enable row level security;
alter table public.timeline_tasks enable row level security;
alter table public.vendors enable row level security;
alter table public.ideas enable row level security;

-- Events Policies:
-- 1. Anyone can view demo events (is_demo = true).
-- 2. Authenticated users can view, insert, update, delete their own events (auth.uid() = user_id).
create policy "events_select_policy" on public.events
  for select using (
    is_demo = true or (auth.uid() is not null and auth.uid() = user_id)
  );

create policy "events_insert_policy" on public.events
  for insert with check (
    auth.uid() is not null and auth.uid() = user_id
  );

create policy "events_update_policy" on public.events
  for update using (
    auth.uid() is not null and auth.uid() = user_id
  );

create policy "events_delete_policy" on public.events
  for delete using (
    auth.uid() is not null and auth.uid() = user_id
  );

-- Budget Items Policies (Cascade from events):
create policy "budget_items_select_policy" on public.budget_items
  for select using (
    exists (
      select 1 from public.events
      where events.id = budget_items.event_id
      and (events.is_demo = true or (auth.uid() is not null and events.user_id = auth.uid()))
    )
  );

create policy "budget_items_insert_policy" on public.budget_items
  for insert with check (
    exists (
      select 1 from public.events
      where events.id = budget_items.event_id
      and auth.uid() is not null and events.user_id = auth.uid()
    )
  );

create policy "budget_items_update_policy" on public.budget_items
  for update using (
    exists (
      select 1 from public.events
      where events.id = budget_items.event_id
      and auth.uid() is not null and events.user_id = auth.uid()
    )
  );

create policy "budget_items_delete_policy" on public.budget_items
  for delete using (
    exists (
      select 1 from public.events
      where events.id = budget_items.event_id
      and auth.uid() is not null and events.user_id = auth.uid()
    )
  );

-- Timeline Tasks Policies:
create policy "timeline_tasks_select_policy" on public.timeline_tasks
  for select using (
    exists (
      select 1 from public.events
      where events.id = timeline_tasks.event_id
      and (events.is_demo = true or (auth.uid() is not null and events.user_id = auth.uid()))
    )
  );

create policy "timeline_tasks_insert_policy" on public.timeline_tasks
  for insert with check (
    exists (
      select 1 from public.events
      where events.id = timeline_tasks.event_id
      and auth.uid() is not null and events.user_id = auth.uid()
    )
  );

create policy "timeline_tasks_update_policy" on public.timeline_tasks
  for update using (
    exists (
      select 1 from public.events
      where events.id = timeline_tasks.event_id
      and auth.uid() is not null and events.user_id = auth.uid()
    )
  );

create policy "timeline_tasks_delete_policy" on public.timeline_tasks
  for delete using (
    exists (
      select 1 from public.events
      where events.id = timeline_tasks.event_id
      and auth.uid() is not null and events.user_id = auth.uid()
    )
  );

-- Vendors Policies:
create policy "vendors_select_policy" on public.vendors
  for select using (
    exists (
      select 1 from public.events
      where events.id = vendors.event_id
      and (events.is_demo = true or (auth.uid() is not null and events.user_id = auth.uid()))
    )
  );

create policy "vendors_insert_policy" on public.vendors
  for insert with check (
    exists (
      select 1 from public.events
      where events.id = vendors.event_id
      and auth.uid() is not null and events.user_id = auth.uid()
    )
  );

create policy "vendors_update_policy" on public.vendors
  for update using (
    exists (
      select 1 from public.events
      where events.id = vendors.event_id
      and auth.uid() is not null and events.user_id = auth.uid()
    )
  );

create policy "vendors_delete_policy" on public.vendors
  for delete using (
    exists (
      select 1 from public.events
      where events.id = vendors.event_id
      and auth.uid() is not null and events.user_id = auth.uid()
    )
  );

-- Ideas Policies:
create policy "ideas_select_policy" on public.ideas
  for select using (
    exists (
      select 1 from public.events
      where events.id = ideas.event_id
      and (events.is_demo = true or (auth.uid() is not null and events.user_id = auth.uid()))
    )
  );

create policy "ideas_insert_policy" on public.ideas
  for insert with check (
    exists (
      select 1 from public.events
      where events.id = ideas.event_id
      and auth.uid() is not null and events.user_id = auth.uid()
    )
  );

create policy "ideas_update_policy" on public.ideas
  for update using (
    exists (
      select 1 from public.events
      where events.id = ideas.event_id
      and auth.uid() is not null and events.user_id = auth.uid()
    )
  );

create policy "ideas_delete_policy" on public.ideas
  for delete using (
    exists (
      select 1 from public.events
      where events.id = ideas.event_id
      and auth.uid() is not null and events.user_id = auth.uid()
    )
  );
