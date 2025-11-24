-- Add email column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email text;

-- Update trigger function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, plan, email)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url', 
    'free',
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Backfill email for existing profiles (this requires running a script or manual update if doing it via SQL only is hard without permissions, 
-- but we can try to update from auth.users if we had access, which we don't easily from here. 
-- For now, we'll assume new users get it, and we might need a separate script for backfill if this was production).
-- actually, we can't easily access auth.users emails from a simple query here without special permissions setup.
-- We will rely on the trigger for new users. For existing, they might show empty email until updated.
