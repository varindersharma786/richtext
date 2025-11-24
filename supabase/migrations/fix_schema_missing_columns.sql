-- Consolidated migration to fix missing columns in profiles table

-- 1. Add 'plan' column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan text DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro'));
UPDATE profiles SET plan = 'free' WHERE plan IS NULL;

-- 2. Add 'email' column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email text;

-- 3. Add 'is_blocked' column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_blocked boolean DEFAULT false;

-- 4. Add 'created_at' column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
UPDATE profiles SET created_at = COALESCE(updated_at, now()) WHERE created_at IS NULL;

-- 5. Update handle_new_user function to include new columns
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email, plan, created_at, updated_at)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url', 
    new.email,
    'free',
    now(),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Add admin policy for updating plans (if not exists)
-- We drop it first to ensure we can recreate it correctly without error if it exists but is different
DROP POLICY IF EXISTS "Admins can update user plans" ON profiles;
CREATE POLICY "Admins can update user plans" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 7. Add admin policy for updating is_blocked (if not exists)
DROP POLICY IF EXISTS "Admins can update is_blocked" ON profiles;
CREATE POLICY "Admins can update is_blocked" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
