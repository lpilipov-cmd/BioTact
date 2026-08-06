create table public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_profiles enable row level security;

revoke all on table public.admin_profiles from public, anon, authenticated;
grant select on table public.admin_profiles to authenticated;

create policy "authenticated users can read their own admin profile"
on public.admin_profiles
for select
to authenticated
using ((select auth.uid()) = user_id);

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = (select auth.uid())
  );
$$;

revoke execute on function private.is_admin() from public, anon, authenticated;
grant execute on function private.is_admin() to authenticated;

grant select, insert, update on table public.packages to authenticated;
grant select on table public.leads to authenticated;
grant update (status) on table public.leads to authenticated;

create policy "administrators can read packages"
on public.packages
for select
to authenticated
using ((select private.is_admin()));

create policy "administrators can create packages"
on public.packages
for insert
to authenticated
with check ((select private.is_admin()));

create policy "administrators can update packages"
on public.packages
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "administrators can read leads"
on public.leads
for select
to authenticated
using ((select private.is_admin()));

create policy "administrators can update lead status"
on public.leads
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));
