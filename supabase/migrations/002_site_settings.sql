CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON site_settings FOR SELECT USING (TRUE);
CREATE POLICY "Auth full access" ON site_settings USING (auth.role() = 'authenticated');

-- 기본 글씨체 설정
INSERT INTO site_settings (key, value) VALUES
  ('font_heading', 'Pretendard'),
  ('font_body', 'Pretendard')
ON CONFLICT (key) DO NOTHING;
