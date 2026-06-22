import { setRequestLocale } from 'next-intl/server'
import { notFound, redirect } from 'next/navigation'
import { notices } from '@/data/notices'

export function generateStaticParams() {
  return notices.map((n) => ({ id: n.id }))
}

export default async function NoticeDetailPage({
  params
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const notice = notices.find((n) => n.id === id)
  if (!notice) notFound()

  // Detail content is rendered in-card on the notice board; deep links open it there.
  redirect(`/${locale}/notice?post=${id}`)
}
