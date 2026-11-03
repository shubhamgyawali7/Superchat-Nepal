-- ============================================================
-- Superchat Nepal - Neon PostgreSQL Schema
-- Prisma is the source of truth: see prisma/schema.prisma
-- Apply it with:  npm run db:push
-- This file is a plain-SQL reference for the same tables.
-- ============================================================

create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  password_hash text not null,
  created_at    timestamptz not null default now()
);

create table if not exists public.profiles (
  id                         uuid primary key references public.users(id) on delete cascade,
  username                   text unique not null,
  display_name               text,
  bio                        text,
  avatar_url                 text,
  theme_color                text default '#f97316',
  welcome_title              text default 'Support My Stream',
  welcome_sub                text default 'Your support helps me keep creating content!',
  youtube_url                text,
  facebook_url               text,
  upi_id                     text,
  alert_min_amount           double precision default 0,
  alert_duration             integer default 5,
  alert_gif_url              text,
  alert_font_family          text default 'Inter, sans-serif',
  alert_text_color           text default '#ffffff',
  alert_amount_color         text default '#34d399',
  alert_message_color        text default '#f1f5f9',
  alert_bg_color             text default 'rgba(0,0,0,0.85)',
  alert_border_color         text default '',
  alert_position             text default 'top',
  alert_animation            text default 'slide',
  tts_enabled                boolean default true,
  tts_rate                   double precision default 0.9,
  recent_donations_position  text default 'bottom-left',
  recent_donations_count     integer default 5,
  total_earnings             double precision not null default 0,
  last_cleared_at            timestamptz,
  created_at                 timestamptz not null default now()
);

create table if not exists public.donations (
  id               uuid primary key default gen_random_uuid(),
  streamer_id      uuid not null references public.profiles(id) on delete cascade,
  supporter_name   text not null default 'Anonymous Supporter',
  amount           double precision not null,
  message          text default 'No message',
  payment_gateway  text default 'esewa',
  status           text default 'pending',
  transaction_id   text,
  gateway_response jsonb,
  created_at       timestamptz not null default now()
);

create index if not exists idx_profiles_username on public.profiles(username);
create index if not exists idx_donations_streamer_id on public.donations(streamer_id);
create index if not exists idx_donations_status on public.donations(status);
create index if not exists idx_donations_created_at on public.donations(created_at desc);
