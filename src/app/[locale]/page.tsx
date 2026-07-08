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

  const [panels, catalogData, chatSlides, contact, heroSlides, heroStats] = await Promise.all([
    getCategoryPanels(),
    getCatalog(),
    getChatSlides(locale),
    getContactInfo(locale === 'ko'),
    getHeroSlides(),
    getHeroStats(),
  ])

  const productNames = catalogData.catalog.map((item) =>
    locale === 'ko' ? item.nameKo : item.nameEn,
  )

  return (
    <main className="w-full overflow-x-clip bg-navy" id="main-scroll-container">
      <SnapPageEffect />
      <HeroCarousel initialSlides={heroSlides} initialStats={heroStats} />
      <ChatConversationSection slides={chatSlides ?? undefined} />
      <ProductsSection panels={panels} />
      <ValuesSection />
      <ContactSection contact={contact ?? undefined} productOptions={productNames} />
    </main>
  )
}
