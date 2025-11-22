-- SUBSCRIPTIONS TABLE
create table subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  plan_id text not null, -- 'basic_monthly', 'basic_yearly', 'pro_monthly', 'pro_yearly'
  status text not null, -- 'active', 'cancelled', 'expired'
  paypal_subscription_id text unique not null,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table subscriptions enable row level security;

create policy "Users can view own subscription." on subscriptions
  for select using (auth.uid() = user_id);

-- Only service role (webhooks) should be able to insert/update subscriptions generally,
-- but for simplicity in this demo we might allow authenticated users to read.
-- Updates should ideally come from webhooks or secure server-side logic.
