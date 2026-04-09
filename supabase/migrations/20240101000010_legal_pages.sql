create table if not exists legal_pages (
  id uuid primary key default gen_random_uuid(),
  type text not null, -- 'privacy' | 'terms'
  locale text not null, -- 'ko' | 'en'
  content text not null default '',
  updated_at timestamptz default now(),
  unique(type, locale)
);
