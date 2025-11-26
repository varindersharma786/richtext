-- Migration: Announcements and Banners Management
-- Date: 2025-11-26
-- Description: Adds support for announcement bars and promotional banners with admin management

-- 1. Create announcements table for site-wide announcement bars
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  link_url TEXT,
  link_text TEXT,
  background_color TEXT DEFAULT '#000000',
  text_color TEXT DEFAULT '#FFFFFF',
  is_active BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create banners table for promotional banners/offers
CREATE TABLE IF NOT EXISTS banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  button_text TEXT,
  position TEXT DEFAULT 'home' CHECK (position IN ('home', 'products', 'all')),
  is_active BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(is_active, position, display_order);

-- 4. Enable Row Level Security
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- 5. Create policies for announcements (public read, admin write)
CREATE POLICY "Announcements are viewable by everyone" ON announcements
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert announcements" ON announcements
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update announcements" ON announcements
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete announcements" ON announcements
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 6. Create policies for banners (public read, admin write)
CREATE POLICY "Banners are viewable by everyone" ON banners
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert banners" ON banners
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update banners" ON banners
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete banners" ON banners
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 7. Add comments for documentation
COMMENT ON TABLE announcements IS 'Site-wide announcement bars with customizable colors';
COMMENT ON COLUMN announcements.display_order IS 'Order for displaying multiple announcements (lower = first)';
COMMENT ON COLUMN announcements.is_active IS 'Whether the announcement is currently visible on the site';
COMMENT ON TABLE banners IS 'Promotional banners/offers with images for homepage and product pages';
COMMENT ON COLUMN banners.position IS 'Where to display the banner: home, products, or all pages';
COMMENT ON COLUMN banners.display_order IS 'Order for displaying multiple banners (lower = first)';
