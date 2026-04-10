-- Branding settings (logo, colors)
INSERT INTO site_settings (key, value) VALUES
  ('header_logo_url', ''),
  ('header_bg_color', '#ffffff'),
  ('favicon_url', ''),
  ('font_size_body', '16'),
  ('font_weight_heading', 'bold'),
  ('font_weight_body', 'normal'),
  ('text_align_body', 'left')
ON CONFLICT (key) DO NOTHING;

-- Supabase Storage bucket for media uploads
-- Run this in the Supabase dashboard > Storage > New bucket:
-- Bucket name: media
-- Public bucket: true
-- Allowed MIME types: image/*, video/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document
-- Max file size: 50MB (52428800 bytes)
