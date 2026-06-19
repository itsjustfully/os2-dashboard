-- Customers table for portal login (Customer ID + PIN)
-- board_id is the Trello board short link or id (set when PIN is generated)
-- customer_id (e.g. PO-1259) is unique per board, not globally
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  customer_id text not null,
  display_name text not null,
  pin_hash text,
  match_value text not null,
  board_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customers_customer_id_idx on public.customers (customer_id);
create index if not exists customers_board_id_idx on public.customers (board_id);

create unique index if not exists customers_board_match_unique_idx
  on public.customers (board_id, lower(match_value));

create unique index if not exists customers_board_customer_unique_idx
  on public.customers (board_id, customer_id);

alter table public.customers enable row level security;
