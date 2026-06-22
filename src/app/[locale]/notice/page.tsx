import { setRequestLocale } from 'next-intl/server'
import NoticeHero from '@/components/notice/NoticeHero'
import { notices } from '@/data/notices'

export default async function NoticePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isKo = locale === 'ko'

  return <NoticeHero notices={notices} isKo={isKo} locale={locale} />
}
