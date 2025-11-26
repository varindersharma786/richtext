-- Migration: Categories and SEO Management
-- Date: 2025-01-26
-- Description: Adds support for product categories and SEO management for products and pages

-- 1. Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

-- 3. Add category and SEO fields to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_keywords TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug TEXT;

-- 4. Create unique index on product slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);

-- 5. Create page_seo table for managing SEO of static pages
CREATE TABLE IF NOT EXISTS page_seo (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT UNIQUE NOT NULL,
  page_name TEXT NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  og_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Insert default pages for SEO management
INSERT INTO page_seo (page_path, page_name, seo_title, seo_description) VALUES
  ('/', 'Home', 'Welcome to Our Store', 'Shop the latest products with fast shipping and great prices'),
  ('/products', 'Products', 'All Products', 'Browse our complete collection of products'),
  ('/about', 'About Us', 'About Our Store', 'Learn more about our company and mission'),
  ('/contact', 'Contact', 'Contact Us', 'Get in touch with our team')
ON CONFLICT (page_path) DO NOTHING;

-- 7. Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_seo ENABLE ROW LEVEL SECURITY;

-- 8. Create policies for categories (public read, admin write)
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert categories" ON categories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update categories" ON categories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete categories" ON categories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 9. Create policies for page_seo (public read, admin write)
CREATE POLICY "Page SEO is viewable by everyone" ON page_seo
  FOR SELECT USING (true);

CREATE POLICY "Admins can update page SEO" ON page_seo
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert page SEO" ON page_seo
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 10. Add comments for documentation
COMMENT ON TABLE categories IS 'Product categories with hierarchical support';
COMMENT ON COLUMN categories.parent_id IS 'Reference to parent category for subcategories';
COMMENT ON COLUMN categories.display_order IS 'Order for displaying categories';
COMMENT ON TABLE page_seo IS 'SEO settings for static pages';
COMMENT ON COLUMN products.category_id IS 'Reference to product category';
COMMENT ON COLUMN products.seo_title IS 'Custom SEO title for search engines';
COMMENT ON COLUMN products.seo_description IS 'Custom SEO description for search engines';
COMMENT ON COLUMN products.slug IS 'URL-friendly product identifier';
