import { setRequestLocale } from 'next-intl/server'
import HeroCarousel from '@/components/home/HeroCarousel'
import ChatConversationSection from '@/components/home/ChatConversationSection'
import ProductsSection from '@/components/home/ProductsSection'
import ValuesSection from '@/components/home/ValuesSection'
import ContactSection from '@/components/home/ContactSection'

export const dynamic = 'force-dynamic'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <main className="h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory hide-scrollbar scroll-smooth bg-navy" id="main-scroll-container">
      <HeroCarousel />
      <ChatConversationSection />
      <ProductsSection />
      <ValuesSection />
      <ContactSection />
    </main>
  )
}
