-- Inquiry mail settings defaults
-- These settings are editable from the admin site-settings page.

INSERT INTO site_settings (key, value) VALUES
  ('inquiry_recipient_emails', 'info@hsurethane.co.kr'),
  ('inquiry_from_name', 'Hansung Urethane'),
  ('inquiry_autoreply_enabled', 'true')
ON CONFLICT (key) DO NOTHING;