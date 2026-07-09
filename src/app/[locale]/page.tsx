import { setRequestLocale } from 'next-intl/server'
import HeroCarousel from '@/components/home/HeroCarousel'
import ChatConversationSection from '@/components/home/ChatConversationSection'
import ProductsSection from '@/components/home/ProductsSection'
import ValuesSection from '@/components/home/ValuesSection'
import ContactSection from '@/components/home/ContactSection'
import SnapPageEffect from '@/components/common/SnapPageEffect'
import { getCatalog, getCategoryPanels } from '@/lib/products/catalog-db'
import { getChatSlides, getContactInfo, getHeroSlides, getHeroStats } from '@/lib/site/settings'

export const dynamic = 'force-dynamic'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const isKo = locale === 'ko'
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hsurethane.com').replace(/\/$/, '')

  const [panels, catalogData, chatSlides, contact, heroSlides, heroStats] = await Promise.all([
    getCategoryPanels(),
    getCatalog(),
    getChatSlides(locale),
    getContactInfo(isKo),
    getHeroSlides(),
    getHeroStats(),
  ])

  const productNames = catalogData.catalog.map((item) =>
    locale === 'ko' ? item.nameKo : item.nameEn,
  )

  const organizationId = `${siteUrl}#organization`
  const websiteId = `${siteUrl}#website`
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: isKo ? '한성우레탄 주식회사' : 'Hansung Urethane Co., Ltd.',
        alternateName: isKo ? 'Hansung Urethane Co., Ltd.' : '한성우레탄 주식회사',
        url: siteUrl,
        logo: `${siteUrl}/logo_ko.png`,
        slogan: 'BONDING TOMORROW TOGETHER',
        description: isKo
          ? '우레탄 접착제 및 지수제 전문 제조기업'
          : 'Specialized manufacturer of urethane adhesives and water-stop agents.',
        areaServed: 'KR',
        knowsAbout: [
          isKo ? '지수제' : 'Water-stop agents',
          isKo ? '우레탄 접착제' : 'Urethane adhesives',
          isKo ? '방화문 접착제' : 'Fire door adhesives',
          isKo ? '실내문 접착제' : 'Interior door adhesives',
        ],
        address: contact?.address
          ? {
              '@type': 'PostalAddress',
              streetAddress: contact.address,
              addressCountry: 'KR',
            }
          : undefined,
        contactPoint: contact?.phone || contact?.email
          ? [
              {
                '@type': 'ContactPoint',
                contactType: 'customer support',
                telephone: contact?.phone || undefined,
                email: contact?.email || undefined,
                availableLanguage: ['ko', 'en'],
              },
            ]
          : undefined,
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: siteUrl,
        name: 'Hansung Urethane',
        inLanguage: ['ko-KR', 'en-US'],
        publisher: {
          '@id': organizationId,
        },
      },
    ],
  }

  return (
    <main className="w-full overflow-x-clip bg-navy" id="main-scroll-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <SnapPageEffect />
      <HeroCarousel initialSlides={heroSlides} initialStats={heroStats} />
      <ChatConversationSection slides={chatSlides ?? undefined} />
      <ProductsSection panels={panels} />
      <ValuesSection />
      <ContactSection contact={contact ?? undefined} productOptions={productNames} />
    </main>
  )
}
