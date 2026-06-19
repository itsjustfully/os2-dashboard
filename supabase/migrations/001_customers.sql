-- Customers table for portal login (Customer ID + PIN)

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  customer_id text unique not null,
  display_name text not null,
  pin_hash text,
  match_value text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customers_customer_id_idx on public.customers (customer_id);

create unique index if not exists customers_match_value_unique_idx
  on public.customers (lower(match_value));

alter table public.customers enable row level security;
