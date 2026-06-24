-- Phase B: rich product fields + product categories (landing 제품군 panels)
-- Idempotent.

-- 1) Extend products to hold catalog.ts rich fields
ALTER TABLE products ADD COLUMN IF NOT EXISTS tag_ko text DEFAULT '';
ALTER TABLE products ADD COLUMN IF NOT EXISTS tag_en text DEFAULT '';
ALTER TABLE products ADD COLUMN IF NOT EXISTS subtitle_ko text DEFAULT '';
ALTER TABLE products ADD COLUMN IF NOT EXISTS subtitle_en text DEFAULT '';
ALTER TABLE products ADD COLUMN IF NOT EXISTS specs jsonb DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS related_resources jsonb DEFAULT '[]'::jsonb;

-- 2) Product categories = landing 제품군 panels + product-detail hero/label source
CREATE TABLE IF NOT EXISTS product_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  name_ko text NOT NULL DEFAULT '',
  name_en text NOT NULL DEFAULT '',
  subtitle_ko text DEFAULT '',
  subtitle_en text DEFAULT '',
  hero_image_url text DEFAULT '',
  is_video boolean DEFAULT false,
  href text DEFAULT '',
  placeholder text DEFAULT '',
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read" ON product_categories;
CREATE POLICY "Public read" ON product_categories FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Auth full access" ON product_categories;
CREATE POLICY "Auth full access" ON product_categories FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
