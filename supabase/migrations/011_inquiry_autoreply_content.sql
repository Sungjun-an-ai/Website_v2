insert into site_settings (key, value)
values
  ('inquiry_autoreply_subject_ko', '한성우레탄 문의가 접수되었습니다'),
  ('inquiry_autoreply_subject_en', 'Your inquiry has been received - Hansung Urethane'),
  ('inquiry_autoreply_body_ko', '문의해 주셔서 감사합니다.\n접수된 문의는 검토 후 빠른 시일 내에 답변 드리겠습니다.'),
  ('inquiry_autoreply_body_en', 'Thank you for contacting Hansung Urethane Co., Ltd.\nWe have received your inquiry and will respond as soon as possible.')
on conflict (key) do update set value = excluded.value;