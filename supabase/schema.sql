create extension if not exists "pgcrypto";

create table if not exists public.lists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text,
  icon text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.list_members (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references public.lists(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'editor', 'viewer')),
  created_at timestamptz not null default now(),
  unique (list_id, user_id)
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references public.lists(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('text', 'audio', 'image', 'video', 'doodle')),
  title text not null,
  notes text,
  media_url text,
  status text not null default 'open' check (status in ('open', 'completed')),
  reminder_at timestamptz,
  recurrence_rule text,
  priority text not null default 'low' check (priority in ('low', 'medium', 'high')),
  due_date date,
  reminder_channel text,
  reminder_time time,
  location_label text,
  location_coords text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.item_media (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  media_type text not null check (media_type in ('audio', 'image', 'video', 'doodle')),
  media_path text not null,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists lists_set_updated_at on public.lists;
create trigger lists_set_updated_at
before update on public.lists
for each row execute function public.set_updated_at();

drop trigger if exists items_set_updated_at on public.items;
create trigger items_set_updated_at
before update on public.items
for each row execute function public.set_updated_at();

alter table public.lists enable row level security;
alter table public.list_members enable row level security;
alter table public.items enable row level security;
alter table public.item_media enable row level security;

drop policy if exists "lists_select_member" on public.lists;
drop policy if exists "lists_insert_owner" on public.lists;
drop policy if exists "lists_update_owner" on public.lists;
drop policy if exists "lists_delete_owner" on public.lists;

create policy "lists_select_member"
on public.lists for select
using (
  owner_id = auth.uid()
  or exists (
    select 1 from public.list_members
    where list_members.list_id = lists.id
      and list_members.user_id = auth.uid()
  )
);

create policy "lists_insert_owner"
on public.lists for insert
with check (owner_id = auth.uid());

create policy "lists_update_owner"
on public.lists for update
using (owner_id = auth.uid());

create policy "lists_delete_owner"
on public.lists for delete
using (owner_id = auth.uid());

drop policy if exists "list_members_select_member" on public.list_members;
drop policy if exists "list_members_insert_owner" on public.list_members;
drop policy if exists "list_members_update_owner" on public.list_members;
drop policy if exists "list_members_delete_owner" on public.list_members;

create policy "list_members_select_member"
on public.list_members for select
using (
  list_members.user_id = auth.uid()
  or exists (
    select 1 from public.lists
    where lists.id = list_members.list_id
      and lists.owner_id = auth.uid()
  )
);

create policy "list_members_insert_owner"
on public.list_members for insert
with check (
  exists (
    select 1 from public.lists
    where lists.id = list_members.list_id
      and lists.owner_id = auth.uid()
  )
);

create policy "list_members_update_owner"
on public.list_members for update
using (
  exists (
    select 1 from public.lists
    where lists.id = list_members.list_id
      and lists.owner_id = auth.uid()
  )
);

create policy "list_members_delete_owner"
on public.list_members for delete
using (
  exists (
    select 1 from public.lists
    where lists.id = list_members.list_id
      and lists.owner_id = auth.uid()
  )
);

drop policy if exists "items_select_member" on public.items;
drop policy if exists "items_insert_editor" on public.items;
drop policy if exists "items_update_editor" on public.items;
drop policy if exists "items_delete_editor" on public.items;

create policy "items_select_member"
on public.items for select
using (
  exists (
    select 1 from public.list_members
    where list_members.list_id = items.list_id
      and list_members.user_id = auth.uid()
  )
);

create policy "items_insert_editor"
on public.items for insert
with check (
  exists (
    select 1 from public.list_members
    where list_members.list_id = items.list_id
      and list_members.user_id = auth.uid()
      and list_members.role in ('owner', 'editor')
  )
  and created_by = auth.uid()
);

create policy "items_update_editor"
on public.items for update
using (
  exists (
    select 1 from public.list_members
    where list_members.list_id = items.list_id
      and list_members.user_id = auth.uid()
      and list_members.role in ('owner', 'editor')
  )
);

create policy "items_delete_editor"
on public.items for delete
using (
  exists (
    select 1 from public.list_members
    where list_members.list_id = items.list_id
      and list_members.user_id = auth.uid()
      and list_members.role in ('owner', 'editor')
  )
);

drop policy if exists "item_media_select_member" on public.item_media;
drop policy if exists "item_media_insert_editor" on public.item_media;
drop policy if exists "item_media_delete_editor" on public.item_media;

create policy "item_media_select_member"
on public.item_media for select
using (
  exists (
    select 1
    from public.items
    join public.list_members
      on list_members.list_id = items.list_id
    where items.id = item_media.item_id
      and list_members.user_id = auth.uid()
  )
);

create policy "item_media_insert_editor"
on public.item_media for insert
with check (
  exists (
    select 1
    from public.items
    join public.list_members
      on list_members.list_id = items.list_id
    where items.id = item_media.item_id
      and list_members.user_id = auth.uid()
      and list_members.role in ('owner', 'editor')
  )
  and created_by = auth.uid()
);

create policy "item_media_delete_editor"
on public.item_media for delete
using (
  exists (
    select 1
    from public.items
    join public.list_members
      on list_members.list_id = items.list_id
    where items.id = item_media.item_id
      and list_members.user_id = auth.uid()
      and list_members.role in ('owner', 'editor')
  )
);

create or replace function public.handle_new_user()
returns trigger as $$
declare
  list_id uuid;
  list_name text;
begin
  perform set_config('request.jwt.claim.sub', new.id::text, true);
  perform set_config('request.jwt.claim.role', 'authenticated', true);
  foreach list_name in array array['Work', 'Personal', 'Shopping']
  loop
    insert into public.lists (owner_id, name)
    values (new.id, list_name)
    returning id into list_id;
  end loop;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.handle_list_owner_membership()
returns trigger as $$
begin
  insert into public.list_members (list_id, user_id, role)
  values (new.id, new.owner_id, 'owner')
  on conflict (list_id, user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_list_created on public.lists;
create trigger on_list_created
after insert on public.lists
for each row execute function public.handle_list_owner_membership();

insert into storage.buckets (id, name, public)
values ('media', 'media', false)
on conflict (id) do nothing;

drop policy if exists "media_read_own" on storage.objects;
drop policy if exists "media_write_own" on storage.objects;

create policy "media_read_own"
on storage.objects for select
using (bucket_id = 'media' and owner = auth.uid());

create policy "media_write_own"
on storage.objects for insert
with check (bucket_id = 'media' and owner = auth.uid());

alter publication supabase_realtime drop table public.lists;
alter publication supabase_realtime drop table public.items;
alter publication supabase_realtime drop table public.list_members;
alter publication supabase_realtime drop table public.item_media;

alter publication supabase_realtime add table public.lists;
alter publication supabase_realtime add table public.items;
alter publication supabase_realtime add table public.list_members;
alter publication supabase_realtime add table public.item_media;
