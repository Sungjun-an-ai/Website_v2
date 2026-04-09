-- Hansung Urethane Website - Database Migration
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Hero Slides
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_ko TEXT NOT NULL,
  title_en TEXT NOT NULL,
  subtitle_ko TEXT DEFAULT '',
  subtitle_en TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  cta_text_ko TEXT DEFAULT '더 보기',
  cta_text_en TEXT DEFAULT 'Learn More',
  cta_href TEXT DEFAULT '/',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name_ko TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ko TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  category TEXT DEFAULT 'adhesive',
  features_ko TEXT[] DEFAULT '{}',
  features_en TEXT[] DEFAULT '{}',
  applications_ko TEXT[] DEFAULT '{}',
  applications_en TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Core Values
CREATE TABLE IF NOT EXISTS core_values (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_ko TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_ko TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  icon TEXT DEFAULT 'star',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stats
CREATE TABLE IF NOT EXISTS stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  label_ko TEXT NOT NULL,
  label_en TEXT NOT NULL,
  value TEXT NOT NULL,
  suffix TEXT DEFAULT '',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- About Sections
CREATE TABLE IF NOT EXISTS about_sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  title_ko TEXT NOT NULL,
  title_en TEXT NOT NULL,
  content_ko TEXT DEFAULT '',
  content_en TEXT DEFAULT '',
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- History Items
CREATE TABLE IF NOT EXISTS history_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  year INTEGER NOT NULL,
  month INTEGER,
  event_ko TEXT NOT NULL,
  event_en TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Track Records
CREATE TABLE IF NOT EXISTS track_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_name_ko TEXT NOT NULL,
  client_name_en TEXT NOT NULL,
  project_ko TEXT NOT NULL,
  project_en TEXT NOT NULL,
  year INTEGER NOT NULL,
  category TEXT DEFAULT 'construction',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resources
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_ko TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_ko TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  file_url TEXT DEFAULT '',
  thumbnail_url TEXT,
  file_type TEXT DEFAULT 'PDF',
  file_size INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notices
CREATE TABLE IF NOT EXISTS notices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_ko TEXT NOT NULL,
  title_en TEXT NOT NULL,
  content_ko TEXT DEFAULT '',
  content_en TEXT DEFAULT '',
  is_pinned BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads (Inquiries)
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  product_interest TEXT,
  message TEXT NOT NULL,
  locale TEXT DEFAULT 'ko',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Catalog Downloads
CREATE TABLE IF NOT EXISTS catalog_downloads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  resource_id UUID REFERENCES resources(id),
  locale TEXT DEFAULT 'ko',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Sections
CREATE TABLE IF NOT EXISTS site_sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  title_ko TEXT NOT NULL,
  title_en TEXT NOT NULL,
  content_ko TEXT DEFAULT '',
  content_en TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_downloads ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anonymous users (for contact forms)
CREATE POLICY "Allow insert for all" ON leads FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Allow insert for all" ON catalog_downloads FOR INSERT WITH CHECK (TRUE);

-- Allow read only for authenticated users (admin)
CREATE POLICY "Allow read for auth" ON leads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read for auth" ON catalog_downloads FOR SELECT USING (auth.role() = 'authenticated');

-- Public read for content tables
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON hero_slides FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read" ON products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read" ON core_values FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read" ON stats FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read" ON notices FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read" ON resources FOR SELECT USING (is_active = TRUE);

-- Admin full access
CREATE POLICY "Auth full access" ON hero_slides USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON products USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON core_values USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON stats USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON notices USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON resources USING (auth.role() = 'authenticated');

-- Seed Data
INSERT INTO hero_slides (title_ko, title_en, subtitle_ko, subtitle_en, order_index) VALUES
  ('우레탄 접착제의 새로운 기준', 'A New Standard in Urethane Adhesives', '36년의 기술력으로 만들어진 최고의 접착 솔루션', 'Premium bonding solutions backed by 36 years of expertise', 1),
  ('BONDING TOMORROW TOGETHER', 'BONDING TOMORROW TOGETHER', '건설·산업·자동차 분야의 신뢰받는 파트너', 'Your trusted partner in construction, industrial, and automotive sectors', 2),
  ('혁신적인 지수 기술', 'Innovative Waterproofing Technology', '완벽한 방수와 지수 성능으로 미래를 잇다', 'Connecting the future with perfect waterproofing performance', 3);

INSERT INTO stats (label_ko, label_en, value, suffix, order_index) VALUES
  ('설립연도', 'Established', '1988', '', 1),
  ('업력', 'Years of Experience', '36', '+', 2),
  ('제품 종류', 'Product Types', '50', '+', 3),
  ('거래처', 'Clients', '500', '+', 4);
