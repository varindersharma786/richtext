-- Create saved_signatures table
create table if not exists saved_signatures (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  elements jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table saved_signatures enable row level security;

-- Policies
create policy "Users can view their own saved signatures"
  on saved_signatures for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own saved signatures"
  on saved_signatures for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own saved signatures"
  on saved_signatures for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own saved signatures"
  on saved_signatures for delete
  using ( auth.uid() = user_id );

-- Trigger for updated_at
create trigger handle_updated_at before update on saved_signatures
  for each row execute procedure moddatetime (updated_at);
