-- Allow admins to update lead status from the admin panel.
-- leads previously had only public INSERT + admin SELECT policies, so
-- UPDATE was denied by RLS for the browser client and status changes
-- silently failed. This adds an admin-only UPDATE policy.

DROP POLICY IF EXISTS "Admin update leads" ON leads;
CREATE POLICY "Admin update leads" ON leads
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
