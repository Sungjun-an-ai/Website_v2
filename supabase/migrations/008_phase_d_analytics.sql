-- Phase D: first-party traffic analytics
-- Idempotent.

CREATE TABLE IF NOT EXISTS page_views (
  id bigserial PRIMARY KEY,
  visitor_id text DEFAULT '',
  path text DEFAULT '',
  locale text DEFAULT '',
  referrer text DEFAULT '',
  device text DEFAULT '',
  is_bot boolean DEFAULT false,
  user_agent text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views (created_at);
CREATE INDEX IF NOT EXISTS page_views_path_idx ON page_views (path);
CREATE INDEX IF NOT EXISTS page_views_visitor_idx ON page_views (visitor_id);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Only authenticated (admin) sessions may read traffic logs. Inserts happen via
-- the service-role client (bypasses RLS), so no public insert policy is exposed.
DROP POLICY IF EXISTS "Auth read" ON page_views;
CREATE POLICY "Auth read" ON page_views FOR SELECT USING (auth.role() = 'authenticated');

-- Aggregate helpers (SECURITY INVOKER: RLS still applies, so anon gets nothing).
CREATE OR REPLACE FUNCTION analytics_summary()
RETURNS TABLE (pv_today bigint, dau_today bigint, pv_7d bigint, mau_30d bigint, pv_total bigint)
LANGUAGE sql STABLE AS $$
  WITH base AS (SELECT * FROM page_views WHERE NOT is_bot)
  SELECT
    (SELECT count(*) FROM base WHERE (created_at AT TIME ZONE 'Asia/Seoul')::date = (now() AT TIME ZONE 'Asia/Seoul')::date),
    (SELECT count(DISTINCT visitor_id) FROM base WHERE (created_at AT TIME ZONE 'Asia/Seoul')::date = (now() AT TIME ZONE 'Asia/Seoul')::date),
    (SELECT count(*) FROM base WHERE created_at >= now() - interval '7 days'),
    (SELECT count(DISTINCT visitor_id) FROM base WHERE created_at >= now() - interval '30 days'),
    (SELECT count(*) FROM base);
$$;

CREATE OR REPLACE FUNCTION analytics_daily(p_days int DEFAULT 30)
RETURNS TABLE (day date, pv bigint, uv bigint)
LANGUAGE sql STABLE AS $$
  SELECT
    (created_at AT TIME ZONE 'Asia/Seoul')::date AS day,
    count(*) AS pv,
    count(DISTINCT visitor_id) AS uv
  FROM page_views
  WHERE NOT is_bot
    AND created_at >= now() - (p_days || ' days')::interval
  GROUP BY 1
  ORDER BY 1;
$$;

CREATE OR REPLACE FUNCTION analytics_top_paths(p_days int DEFAULT 30, p_limit int DEFAULT 10)
RETURNS TABLE (path text, pv bigint)
LANGUAGE sql STABLE AS $$
  SELECT path, count(*) AS pv
  FROM page_views
  WHERE NOT is_bot AND created_at >= now() - (p_days || ' days')::interval
  GROUP BY path
  ORDER BY pv DESC
  LIMIT p_limit;
$$;

CREATE OR REPLACE FUNCTION analytics_top_referrers(p_days int DEFAULT 30, p_limit int DEFAULT 10)
RETURNS TABLE (referrer text, pv bigint)
LANGUAGE sql STABLE AS $$
  SELECT
    CASE WHEN coalesce(referrer, '') = '' THEN '(direct)' ELSE referrer END AS referrer,
    count(*) AS pv
  FROM page_views
  WHERE NOT is_bot AND created_at >= now() - (p_days || ' days')::interval
  GROUP BY 1
  ORDER BY pv DESC
  LIMIT p_limit;
$$;
