-- ============================================================
-- Superchat Nepal - Database Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. PROFILES TABLE
-- Created automatically on signup via trigger
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique not null,
  display_name  text,
  bio           text,
  avatar_url    text,
  theme_color   text default '#f97316',
  welcome_title text default 'Support My Stream',
  welcome_sub   text default 'Your support helps me keep creating content!',
  youtube_url   text,
  facebook_url  text,
  upi_id        text,
  alert_min_amount numeric default 0,
  alert_duration   integer default 5,

  -- Overlay customization
  alert_gif_url         text,
  alert_font_family     text default 'Inter, sans-serif',
  alert_text_color      text default '#ffffff',
  alert_amount_color    text default '#34d399',
  alert_message_color   text default '#f1f5f9',
  alert_bg_color        text default 'rgba(0,0,0,0.85)',
  alert_border_color    text default '',
  alert_position        text default 'top',
  alert_animation       text default 'slide',
  tts_enabled           boolean default true,
  tts_rate              numeric default 0.9,
  recent_donations_position text default 'bottom-left',
  recent_donations_count    integer default 5,

  total_earnings   numeric default 0,
  last_cleared_at  timestamptz,
  created_at    timestamptz default now()
);

-- 2. DONATIONS TABLE
create table if not exists public.donations (
  id               uuid primary key default gen_random_uuid(),
  streamer_id      uuid not null references public.profiles(id) on delete cascade,
  supporter_name   text not null default 'Anonymous Supporter',
  amount           numeric not null,
  message          text default 'No message',
  payment_gateway  text default 'esewa',
  status           text default 'pending',
  transaction_id   text,
  gateway_response jsonb,
  created_at       timestamptz default now()
);

-- 3. INDEXES for performance
create index if not exists idx_profiles_username on public.profiles(username);
create index if not exists idx_donations_streamer_id on public.donations(streamer_id);
create index if not exists idx_donations_status on public.donations(status);
create index if not exists idx_donations_created_at on public.donations(created_at desc);

-- 4. AUTO-CREATE PROFILE on user signup
-- This trigger fires after a new user is created in auth.users
-- and inserts a row into public.profiles using the username from user metadata.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

-- Drop the trigger if it already exists, then recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5. AUTO-UPDATE total_earnings when a donation is verified
create or replace function public.update_streamer_earnings()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if new.status = 'verified' and (old.status is null or old.status != 'verified') then
    update public.profiles
    set total_earnings = total_earnings + new.amount
    where id = new.streamer_id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_donation_verified on public.donations;
create trigger on_donation_verified
  after update on public.donations
  for each row execute function public.update_streamer_earnings();

-- 6. ROW LEVEL SECURITY (RLS)
-- Enable RLS on both tables
alter table public.profiles enable row level security;
alter table public.donations enable row level security;

-- PROFILES policies
-- Anyone can read any profile (public page)
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

-- Users can update only their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Profiles are auto-created by the trigger (security definer), no insert policy needed for users

-- DONATIONS policies
-- Anyone can insert a donation (public donation page)
create policy "Anyone can insert donations"
  on public.donations for insert
  with check (true);

-- Anyone can read donations (for overlays and dashboard - auth is done server-side via service role)
create policy "Donations are viewable by everyone"
  on public.donations for select
  using (true);

-- Only server (service role) can update donations (verification)
-- No update/delete policy for anon - server uses service role client

-- 7. REALTIME - Enable realtime on donations table for live overlays
alter publication supabase_realtime add table public.donations;

-- 8. OVERLAY CUSTOMIZATION COLUMNS (run if profiles table already exists)
-- Safe to run multiple times (uses IF NOT EXISTS)
alter table public.profiles add column if not exists alert_gif_url              text;
alter table public.profiles add column if not exists alert_font_family          text default 'Inter, sans-serif';
alter table public.profiles add column if not exists alert_text_color           text default '#ffffff';
alter table public.profiles add column if not exists alert_amount_color         text default '#34d399';
alter table public.profiles add column if not exists alert_message_color        text default '#f1f5f9';
alter table public.profiles add column if not exists alert_bg_color             text default 'rgba(0,0,0,0.85)';
alter table public.profiles add column if not exists alert_border_color         text default '';
alter table public.profiles add column if not exists alert_position             text default 'top';
alter table public.profiles add column if not exists alert_animation            text default 'slide';
alter table public.profiles add column if not exists tts_enabled                boolean default true;
alter table public.profiles add column if not exists tts_rate                   numeric default 0.9;
alter table public.profiles add column if not exists recent_donations_position  text default 'bottom-left';
alter table public.profiles add column if not exists recent_donations_count     integer default 5;
