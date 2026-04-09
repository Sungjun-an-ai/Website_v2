CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON site_settings FOR SELECT USING (TRUE);
CREATE POLICY "Auth insert" ON site_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update" ON site_settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete" ON site_settings FOR DELETE USING (auth.role() = 'authenticated');

-- 기본 글씨체 설정
INSERT INTO site_settings (key, value) VALUES
  ('font_heading', 'Pretendard'),
  ('font_body', 'Pretendard')
ON CONFLICT (key) DO NOTHING;
