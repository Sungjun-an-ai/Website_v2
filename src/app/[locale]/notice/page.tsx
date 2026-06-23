import { setRequestLocale } from 'next-intl/server'
import NoticeHero from '@/components/notice/NoticeHero'
import { createClient } from '@/lib/supabase/server'
import { notices as fallbackNotices, type Notice } from '@/data/notices'

export const dynamic = 'force-dynamic'

export default async function NoticePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isKo = locale === 'ko'

  let notices: Notice[] = fallbackNotices
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('notices')
      .select('id, title_ko, title_en, content_ko, content_en, is_pinned, view_count, created_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    if (data && data.length > 0) {
      notices = data as Notice[]
    }
  } catch (err) {
    console.error('Notices fetch error:', err)
  }

  return <NoticeHero notices={notices} isKo={isKo} locale={locale} />
}
