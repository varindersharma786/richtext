-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  role text default 'user' check (role in ('user', 'admin'))
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- This triggers a profile creation on user signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- BLOG POSTS TABLE
create table posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  slug text unique not null,
  content text,
  featured_image text,
  meta_title text,
  meta_description text,
  published boolean default false,
  author_id uuid references auth.users not null
);

alter table posts enable row level security;

create policy "Posts are viewable by everyone." on posts
  for select using (true);

create policy "Admins can insert posts." on posts
  for insert with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins can update posts." on posts
  for update using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins can delete posts." on posts
  for delete using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- STORAGE POLICIES (Assuming bucket 'blog-images' exists)
-- You need to create the bucket 'blog-images' in the Supabase Dashboard manually or via API if possible.
-- Here are the policies for it:

-- Allow public read access to blog images
-- create policy "Public Access"
--   on storage.objects for select
--   using ( bucket_id = 'blog-images' );

-- Allow admins to upload images
-- create policy "Admin Upload"
--   on storage.objects for insert
--   with check (
--     bucket_id = 'blog-images' and
--     exists (
--       select 1 from profiles
--       where profiles.id = auth.uid() and profiles.role = 'admin'
--     )
--   );
