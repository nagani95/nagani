-- Nagani Slot V1 Core Foundation
-- Step 1: math versions + spin audit table

create table if not exists public.slot_math_versions (
  id uuid primary key default gen_random_uuid(),

  version_code text not null unique,
  status text not null default 'draft'
    check (status in ('draft', 'active', 'retired')),

  rtp_target numeric(5, 2) not null default 82.00,

  symbols jsonb not null default '[]'::jsonb,
  reel_strips jsonb not null default '[]'::jsonb,
  paylines jsonb not null default '[]'::jsonb,
  payout_table jsonb not null default '{}'::jsonb,

  min_bet numeric not null default 100,
  max_bet numeric not null default 1000,
  max_payout_per_spin numeric not null default 20000,

  created_at timestamptz not null default now(),
  activated_at timestamptz
);

create table if not exists public.slot_spins (
  id uuid primary key default gen_random_uuid(),

  profile_id uuid not null references public.profiles(id) on delete cascade,
  math_version_id uuid not null references public.slot_math_versions(id),

  bet_amount numeric not null check (bet_amount > 0),
  cash_amount numeric not null default 0 check (cash_amount >= 0),
  bonus_amount numeric not null default 0 check (bonus_amount >= 0),
  payout_amount numeric not null default 0 check (payout_amount >= 0),

  result_grid jsonb not null default '[]'::jsonb,
  winning_lines jsonb not null default '[]'::jsonb,
  scatter_result jsonb not null default '{}'::jsonb,
  promo_result jsonb not null default '{}'::jsonb,

  balance_before_cash numeric not null default 0,
  balance_before_bonus numeric not null default 0,
  balance_after_cash numeric not null default 0,
  balance_after_bonus numeric not null default 0,

  status text not null default 'settled'
    check (status in ('settled', 'failed', 'refunded')),

  created_at timestamptz not null default now()
);

create index if not exists slot_math_versions_status_idx
  on public.slot_math_versions(status);

create index if not exists slot_spins_profile_created_idx
  on public.slot_spins(profile_id, created_at desc);

create index if not exists slot_spins_created_idx
  on public.slot_spins(created_at desc);

alter table public.slot_math_versions enable row level security;
alter table public.slot_spins enable row level security;