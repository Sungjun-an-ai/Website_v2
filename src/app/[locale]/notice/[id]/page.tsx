import { setRequestLocale } from 'next-intl/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function NoticeDetailPage({
  params
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  setRequestLocale(locale)

  // Detail content is rendered in-card on the notice board; deep links open it there.
  redirect(`/${locale}/notice?post=${id}`)
}
