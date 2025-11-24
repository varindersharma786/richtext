-- Add created_at column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Update existing rows to have a created_at (using updated_at or now if null)
-- Note: updated_at might also be null, so we default to now()
UPDATE profiles SET created_at = COALESCE(updated_at, now()) WHERE created_at IS NULL;
