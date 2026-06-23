-- Phase C: chat conversation bubbles (메인페이지 메시지 UI)
-- Idempotent.

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_ko text DEFAULT '',
  customer_en text DEFAULT '',
  hansung_ko text DEFAULT '',
  hansung_en text DEFAULT '',
  image_url text DEFAULT '',
  name_ko text DEFAULT '',
  name_en text DEFAULT '',
  tag_ko text DEFAULT '',
  tag_en text DEFAULT '',
  cta_ko text DEFAULT '',
  cta_en text DEFAULT '',
  href text DEFAULT '',
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read" ON chat_messages;
CREATE POLICY "Public read" ON chat_messages FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Auth full access" ON chat_messages;
CREATE POLICY "Auth full access" ON chat_messages FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
