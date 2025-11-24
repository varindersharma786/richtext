-- Add is_blocked column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_blocked boolean DEFAULT false;

-- Create policy to prevent blocked users from reading profiles (optional, depending on requirements)
-- For now, we just want to track the status. Application logic will handle the blocking effect (e.g. middleware).

-- Allow admins to update is_blocked status
CREATE POLICY "Admins can update is_blocked" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
