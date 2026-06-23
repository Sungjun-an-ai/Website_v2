-- Phase E: admin allowlist + RLS hardening
-- Previously ANY authenticated Supabase user had full write access to every
-- content table (policy `auth.role() = 'authenticated'`). This restricts write
-- (and sensitive reads) to an explicit allowlist while keeping public reads.
-- Idempotent.

-- 1. Allowlist table -------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text DEFAULT '',
  role text DEFAULT 'admin',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Seed the current admin first so the hardened policies below don't lock anyone out.
INSERT INTO admin_users (user_id, email, role)
VALUES ('117ace35-7e81-420b-bcaf-1328bdb53ac4', 'josiahsungjun.an@gmail.com', 'owner')
ON CONFLICT (user_id) DO UPDATE SET is_active = true;

-- 2. is_admin() helper -----------------------------------------------------
-- SECURITY DEFINER so it can read admin_users without tripping its own RLS
-- (avoids infinite recursion when used inside admin_users policies).
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- 3. admin_users RLS -------------------------------------------------------
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins read" ON admin_users;
DROP POLICY IF EXISTS "Admins manage" ON admin_users;
CREATE POLICY "Admins read" ON admin_users FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins manage" ON admin_users FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4. Tighten content tables: "Auth full access" -> admin-only ---------------
DO $$
DECLARE
  t text;
  content_tables text[] := ARRAY[
    'about_sections','chat_messages','core_values','hero_slides','history_items',
    'legal_pages','notices','product_categories','products','resources',
    'site_sections','site_settings','stats','track_records'
  ];
BEGIN
  FOREACH t IN ARRAY content_tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Auth full access" ON %I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Admin full access" ON %I', t);
    EXECUTE format(
      'CREATE POLICY "Admin full access" ON %I FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin())',
      t
    );
  END LOOP;
END $$;

-- 5. Sensitive reads (customer/traffic data) -> admin-only ------------------
-- leads & catalog_downloads keep their public INSERT policies (forms/anon),
-- but reads are restricted to admins. page_views read restricted to admins.
DROP POLICY IF EXISTS "Allow read for auth on leads" ON leads;
DROP POLICY IF EXISTS "Admin read leads" ON leads;
CREATE POLICY "Admin read leads" ON leads FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Allow read for auth on catalog_downloads" ON catalog_downloads;
DROP POLICY IF EXISTS "Admin read catalog_downloads" ON catalog_downloads;
CREATE POLICY "Admin read catalog_downloads" ON catalog_downloads FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Auth read" ON page_views;
DROP POLICY IF EXISTS "Admin read" ON page_views;
CREATE POLICY "Admin read" ON page_views FOR SELECT USING (public.is_admin());
