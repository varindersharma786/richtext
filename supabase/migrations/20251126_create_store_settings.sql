-- Create store_settings table
CREATE TABLE IF NOT EXISTS public.store_settings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    store_name text NOT NULL DEFAULT 'YourStore',
    support_email text NOT NULL DEFAULT 'support@example.com',
    social_links jsonb DEFAULT '{"facebook": "", "twitter": "", "instagram": "", "youtube": ""}'::jsonb,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" ON public.store_settings
    FOR SELECT USING (true);

CREATE POLICY "Allow admin update access" ON public.store_settings
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT id FROM public.profiles WHERE role = 'admin'
        )
    );

CREATE POLICY "Allow admin insert access" ON public.store_settings
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT id FROM public.profiles WHERE role = 'admin'
        )
    );

-- Insert default settings if not exists
INSERT INTO public.store_settings (store_name, support_email)
SELECT 'YourStore', 'support@example.com'
WHERE NOT EXISTS (SELECT 1 FROM public.store_settings);
