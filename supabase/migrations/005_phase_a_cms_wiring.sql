-- Phase A: secure unprotected tables + extend schema so public pages can read CMS data
-- Idempotent: safe to re-run.

-- 1) Enable RLS + public-read / auth-write on tables that were left unprotected
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['about_sections','history_items','legal_pages','site_sections','track_records']
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "Public read" ON %I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Auth full access" ON %I', t);
    EXECUTE format('CREATE POLICY "Public read" ON %I FOR SELECT USING (TRUE)', t);
    EXECUTE format($f$CREATE POLICY "Auth full access" ON %I USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated')$f$, t);
  END LOOP;
END $$;

-- 2) about_sections: subtitle (heading=title_*, body=content_*, subtitle=new)
ALTER TABLE about_sections ADD COLUMN IF NOT EXISTS subtitle_ko TEXT DEFAULT '';
ALTER TABLE about_sections ADD COLUMN IF NOT EXISTS subtitle_en TEXT DEFAULT '';

-- 3) resources: classification fields used by the public resources board
ALTER TABLE resources ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'catalog';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS group_key TEXT DEFAULT 'common';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS product TEXT DEFAULT '';

-- 4) editable about hero background image
INSERT INTO site_settings (key, value) VALUES
  ('about_hero_image_url', '')
ON CONFLICT (key) DO NOTHING;
