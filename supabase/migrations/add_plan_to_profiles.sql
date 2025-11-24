-- Add plan field to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan text DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro'));

-- Update existing users to free plan if they don't have a plan set
UPDATE profiles SET plan = 'free' WHERE plan IS NULL;

-- Update the handle_new_user function to set default plan
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, plan)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'free');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add admin policy to allow admins to update any user's plan
CREATE POLICY "Admins can update user plans" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
