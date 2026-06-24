import { setRequestLocale } from 'next-intl/server'
import HeroCarousel from '@/components/home/HeroCarousel'
import ChatConversationSection from '@/components/home/ChatConversationSection'
import ProductsSection from '@/components/home/ProductsSection'
import ValuesSection from '@/components/home/ValuesSection'
import ContactSection from '@/components/home/ContactSection'
import SnapPageEffect from '@/components/common/SnapPageEffect'
import { getCategoryPanels } from '@/lib/products/catalog-db'
import { getChatSlides, getContactInfo } from '@/lib/site/settings'

export const dynamic = 'force-dynamic'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const [panels, chatSlides, contact] = await Promise.all([
    getCategoryPanels(),
    getChatSlides(locale),
    getContactInfo(locale === 'ko'),
  ])

  return (
    <main className="w-full overflow-x-clip bg-navy" id="main-scroll-container">
      <SnapPageEffect />
      <HeroCarousel />
      <ChatConversationSection slides={chatSlides ?? undefined} />
      <ProductsSection panels={panels} />
      <ValuesSection />
      <ContactSection contact={contact ?? undefined} />
    </main>
  )
}
