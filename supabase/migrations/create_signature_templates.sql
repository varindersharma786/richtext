-- Create signature_templates table
CREATE TABLE IF NOT EXISTS signature_templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  data jsonb NOT NULL, -- Stores rows/columns/elements structure
  container_style jsonb, -- Stores container styling
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE signature_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own templates" ON signature_templates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own templates" ON signature_templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates" ON signature_templates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates" ON signature_templates
  FOR DELETE USING (auth.uid() = user_id);

-- Admins can view all templates
CREATE POLICY "Admins can view all templates" ON signature_templates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS signature_templates_user_id_idx ON signature_templates(user_id);
CREATE INDEX IF NOT EXISTS signature_templates_created_at_idx ON signature_templates(created_at DESC);
