import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageViewTracker from '@/components/common/PageViewTracker'
import RouteScrollReset from '@/components/common/RouteScrollReset'
import { createClient } from '@/lib/supabase/server'
import { getContactInfo } from '@/lib/site/settings'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'ko' | 'en')) {
    notFound()
  }

  const messages = await getMessages()

  let logoUrl = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'header_logo_url').single()
    if (data?.value) logoUrl = data.value
  } catch (error) {
    console.error('[Layout] Failed to fetch logo:', error)
  }

  const contact = await getContactInfo(locale === 'ko')

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <PageViewTracker locale={locale} />
      <RouteScrollReset />
      <Header initialLogoUrl={logoUrl} />
      <main>{children}</main>
      <Footer contact={contact ?? undefined} />
    </NextIntlClientProvider>
  )
}
