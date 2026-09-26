-- USERS
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  discord_username text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

-- COMPLAINTS
create table if not exists public.complaints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  username text not null,
  discord_username text not null,
  reported_username text not null,
  category text not null check (category in ('Player Report','Admin Abuse','Bug Report','Cheating or Exploiting','Harassment','Other')),
  description text not null,
  status text not null default 'Pending' check (status in ('Pending','Under Review','Resolved','Rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- EVIDENCE
create table if not exists public.complaint_evidence (
  id uuid primary key default gen_random_uuid(),
  complaint_id uuid not null references public.complaints(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  uploaded_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- PRIVATE COMPLAINT CHAT
create table if not exists public.complaint_messages (
  id uuid primary key default gen_random_uuid(),
  complaint_id uuid not null references public.complaints(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  sender_role text not null default 'user' check (sender_role in ('user','admin')),
  content text not null,
  created_at timestamptz not null default now()
);

-- ADMIN-ONLY INTERNAL CHAT
create table if not exists public.admin_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  sender_role text not null default 'admin' check (sender_role in ('admin')),
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.complaints enable row level security;
alter table public.complaint_evidence enable row level security;
alter table public.complaint_messages enable row level security;
alter table public.admin_messages enable row level security;

create policy "profiles own data" on public.profiles
for all
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "users can view own complaints" on public.complaints
for select
using (auth.uid() = user_id or exists (
  select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
));

create policy "users can insert their own complaints" on public.complaints
for insert
with check (auth.uid() = user_id);

create policy "admins can update complaint status" on public.complaints
for update
using (exists (
  select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
));

create policy "users can view own complaint evidence" on public.complaint_evidence
for select
using (exists (
  select 1 from public.complaints c
  where c.id = complaint_id and (c.user_id = auth.uid() or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ))
));

create policy "users can upload valid evidence" on public.complaint_evidence
for insert
with check (auth.uid() = uploaded_by);

create policy "users and admins can read complaint messages" on public.complaint_messages
for select
using (exists (
  select 1 from public.complaints c
  where c.id = complaint_id and (c.user_id = auth.uid() or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ))
));

create policy "users and admins can insert complaint messages" on public.complaint_messages
for insert
with check (auth.uid() = sender_id);

create policy "admins can read and write admin messages" on public.admin_messages
for all
using (exists (
  select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
));

create policy "admin read profiles" on public.profiles
for select
using (exists (
  select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
));

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, discord_username, role)
  values (new.id, new.raw_user_meta_data ->> 'username', new.raw_user_meta_data ->> 'discord_username', coalesce(new.raw_user_meta_data ->> 'role', 'user'))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
