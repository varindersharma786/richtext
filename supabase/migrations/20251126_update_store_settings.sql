-- Add logo_url and maintenance_mode to store_settings
ALTER TABLE public.store_settings
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS maintenance_mode boolean DEFAULT false;
