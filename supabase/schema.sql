-- AceDBE user data. Run once in Supabase → SQL Editor.
-- Accounts use Supabase Auth with the email "<username>@acedbe.app" (never mailed; "Confirm email" must be off).
-- Every table is row-level secured: a signed-in user can only read and write their own rows.

-- ── Profiles ─────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username ~ '^[a-z]+(\.[a-z]+)+[0-9]{2}$'),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own" on public.profiles
  for select to authenticated using (id = auth.uid());

-- Creates the profile from the sign-up email; rejects usernames that are not in the name.surnameYY format.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, lower(split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Module progress (tracker) ────────────────────────────────────────────────
create table if not exists public.module_progress (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  subject_code text not null,
  module text not null,
  video boolean not null default false,
  questions boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, subject_code, module)
);

alter table public.module_progress enable row level security;

drop policy if exists "progress: read own" on public.module_progress;
create policy "progress: read own" on public.module_progress
  for select to authenticated using (user_id = auth.uid());
drop policy if exists "progress: insert own" on public.module_progress;
create policy "progress: insert own" on public.module_progress
  for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "progress: update own" on public.module_progress;
create policy "progress: update own" on public.module_progress
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ── Quiz attempts (history) ──────────────────────────────────────────────────
-- set_keys: "CLA|<bank>" / "Exam|<bank>" for every set the attempt touched (drives the History button).
-- units: per set+module breakdown, e.g. [{ "key": "CLA|CLA 1|3", "set": "CLA|CLA 1", "module": "3",
--        "correct": 4, "wrong": 1, "unanswered": 0, "total": 5 }].
-- answers: { "<source>::<question id>": ["A"] } for every answered question.
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  subject_code text not null,
  mode text not null check (mode in ('practice', 'cbt')),
  set_keys text[] not null,
  units jsonb not null,
  correct int not null,
  wrong int not null,
  total int not null,
  time_sec int not null,
  answers jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists quiz_attempts_user_subject_idx
  on public.quiz_attempts (user_id, subject_code, created_at desc);

alter table public.quiz_attempts enable row level security;

drop policy if exists "attempts: read own" on public.quiz_attempts;
create policy "attempts: read own" on public.quiz_attempts
  for select to authenticated using (user_id = auth.uid());
drop policy if exists "attempts: insert own" on public.quiz_attempts;
create policy "attempts: insert own" on public.quiz_attempts
  for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "attempts: delete own" on public.quiz_attempts;
create policy "attempts: delete own" on public.quiz_attempts
  for delete to authenticated using (user_id = auth.uid());

-- Signed-out visitors get no access at all.
revoke all on public.profiles, public.module_progress, public.quiz_attempts from anon;
