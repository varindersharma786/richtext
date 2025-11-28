-- Add CJ Dropshipping token columns to store_settings
ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS cj_access_token TEXT,
ADD COLUMN IF NOT EXISTS cj_access_token_expiry TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cj_refresh_token TEXT,
ADD COLUMN IF NOT EXISTS cj_refresh_token_expiry TIMESTAMP WITH TIME ZONE;
