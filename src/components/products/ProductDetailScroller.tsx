"use client"

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowLeft, Download, FileText, ShieldCheck } from 'lucide-react'
import ProductInquiryForm from '@/components/products/ProductInquiryForm'
import SnapPageEffect from '@/components/common/SnapPageEffect'
import { ProductCatalogItem, productCatalog, productCategoryLabels } from '@/lib/products/catalog'

const heroVisualByCategory = {
  sealant: '/about/Aerial_timelapse_of_subway_con_Kling_30__16770.mp4',
  'fire-door-adhesive': '/about/Aerial_timelapse_of_Seoul_at_g_Kling_30__41996.mp4',
  'general-adhesive': '/about/Aerial_timelapse_of_Seoul_at_g_Kling_30__41996.mp4',
  'interior-door-adhesive': '/about/Aerial_timelapse_of_subway_con_Kling_30__16770.mp4',
} as const

function parseProductTags(baseTag: string, detailTag?: string) {
  const detailTags = (detailTag ?? '')
    .split(/[\/\,·]/)
    .map((tag) => tag.trim())
    .filter(Boolean)

  return [baseTag, ...detailTags]
}

function fadeStyle(visible: boolean, delayMs = 0): React.CSSProperties {
  return visible
    ? { animation: `hero-fade-up 1.1s cubic-bezier(0.2, 0.85, 0.2, 1) ${delayMs}ms forwards` }
    : { opacity: 0, transform: 'translateY(18px)', filter: 'blur(5px)' }
}

function RevealSection({
  rootRef,
  sectionRef,
  className,
  children,
}: {
  rootRef: React.RefObject<HTMLDivElement | null>
  sectionRef?: React.MutableRefObject<HTMLElement | null>
  className: string
  children: (visible: boolean) => React.ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(false)
          requestAnimationFrame(() => {
            requestAnimationFrame(() => setVisible(true))
          })
        } else {
          setVisible(false)
        }
      },
      {
        root: null,
        threshold: 0.35,
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootRef])

  return (
    <section
      ref={(node) => {
        ref.current = node
        if (sectionRef) sectionRef.current = node
      }}
      className={className}
    >
      {children(visible)}
    </section>
  )
}

export default function ProductDetailScroller({
  locale,
  isKo,
  product,
  catalog: catalogProp,
  categoryLabels: categoryLabelsProp,
  heroVisuals: heroVisualsProp,
}: {
  locale: string
  isKo: boolean
  product: ProductCatalogItem
  catalog?: ProductCatalogItem[]
  categoryLabels?: Record<string, { ko: string; en: string }>
  heroVisuals?: Record<string, string>
}) {
  const catalog = catalogProp && catalogProp.length > 0 ? catalogProp : productCatalog
  const categoryLabels: Record<string, { ko: string; en: string }> =
    categoryLabelsProp ?? productCategoryLabels
  const heroVisuals: Record<string, string> = heroVisualsProp ?? heroVisualByCategory
  const labelFor = (category: string) =>
    categoryLabels[category] ?? { ko: category, en: category }
  const visualFor = (category: string) =>
    heroVisuals[category] ||
    heroVisualByCategory[category as keyof typeof heroVisualByCategory] ||
    ''

  const scrollRootRef = useRef<HTMLDivElement>(null)
  const heroTrackRef = useRef<HTMLDivElement>(null)
  const heroSectionRef = useRef<HTMLElement>(null)
  const [heroActive, setHeroActive] = useState(false)
  const [heroPaused, setHeroPaused] = useState(false)
  const [activeProductSlug, setActiveProductSlug] = useState(product.slug)

  const currentIndex = catalog.findIndex((item) => item.slug === product.slug)
  const orderedProducts = currentIndex >= 0
    ? [...catalog.slice(currentIndex), ...catalog.slice(0, currentIndex)]
    : catalog
  const loopHeroProducts = [...orderedProducts, ...orderedProducts]
  const activeProduct = catalog.find((item) => item.slug === activeProductSlug) ?? product
  const activeCategoryLabel = isKo
    ? labelFor(activeProduct.category).ko
    : labelFor(activeProduct.category).en
  const activeTitle = isKo ? activeProduct.nameKo : activeProduct.nameEn
  const activeSubtitle = isKo ? activeProduct.subtitleKo : activeProduct.subtitleEn
  const activeDescription = isKo ? activeProduct.descriptionKo : activeProduct.descriptionEn
  const activeFeatures = isKo ? activeProduct.featuresKo : activeProduct.featuresEn
  const activeApplications = isKo ? activeProduct.applicationsKo : activeProduct.applicationsEn

  useEffect(() => {
    const hero = heroSectionRef.current
    if (!hero) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroActive(entry.isIntersecting)
      },
      {
        root: null,
        threshold: 0.45,
      }
    )

    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const track = heroTrackRef.current
    if (!track || !heroActive || heroPaused) return

    const loopWidth = track.scrollWidth / 2

    const updateActiveProduct = () => {
      const slideWidth = track.clientWidth || 1
      const rawIndex = Math.round(track.scrollLeft / slideWidth)
      const normalizedIndex = ((rawIndex % orderedProducts.length) + orderedProducts.length) % orderedProducts.length
      const nextProduct = orderedProducts[normalizedIndex]
      if (nextProduct) setActiveProductSlug(nextProduct.slug)
    }

    updateActiveProduct()

    const handleScroll = () => {
      if (track.scrollLeft >= loopWidth) {
        track.scrollTo({ left: track.scrollLeft - loopWidth, behavior: 'auto' })
      } else if (track.scrollLeft < 0) {
        track.scrollTo({ left: track.scrollLeft + loopWidth, behavior: 'auto' })
      }
      updateActiveProduct()
    }

    track.addEventListener('scroll', handleScroll, { passive: true })

    const interval = window.setInterval(() => {
      const cardWidth = track.clientWidth
      const next = track.scrollLeft + cardWidth
      track.scrollTo({ left: next, behavior: 'smooth' })
    }, 3200)

    return () => {
      track.removeEventListener('scroll', handleScroll)
      window.clearInterval(interval)
    }
  }, [heroActive, heroPaused, orderedProducts])

  return (
    <div ref={scrollRootRef} className="w-full overflow-x-clip bg-slate-950 text-slate-100 antialiased tracking-tight">
      <SnapPageEffect />
      <RevealSection
        rootRef={scrollRootRef}
        sectionRef={heroSectionRef}
        className="relative snap-start [scroll-snap-stop:always] min-h-screen overflow-hidden"
      >
        {(visible) => (
          <div className="relative h-screen w-full overflow-hidden">
            <div
              ref={heroTrackRef}
              onMouseEnter={() => setHeroPaused(true)}
              onMouseLeave={() => setHeroPaused(false)}
              className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {loopHeroProducts.map((item, index) => {
                const itemTitle = isKo ? item.nameKo : item.nameEn
                const itemSubtitle = isKo ? item.subtitleKo : item.subtitleEn
                const itemCategory = isKo ? labelFor(item.category).ko : labelFor(item.category).en
                const visual = visualFor(item.category)

                return (
                  <section
                    key={`${item.slug}-${index}`}
                    className="relative flex-none snap-start h-full w-full overflow-hidden"
                  >
                    {visual.endsWith('.mp4') ? (
                      <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover object-center">
                        <source src={visual} type="video/mp4" />
                      </video>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={visual} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
                    )}
                    <div className="absolute inset-0 bg-slate-950/72" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/45" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,rgba(212,168,67,0.12),transparent_36%)]" />

                    <div className="absolute inset-0 z-20 pointer-events-none">
                      <div className="mx-auto flex h-full max-w-7xl items-center px-5 sm:px-8 lg:px-12">
                        <div className="w-full max-w-5xl text-white pt-16 lg:pt-0">
                          <Link
                            href={`/${locale}/products`}
                            className="pointer-events-auto mb-7 inline-flex items-center gap-2 text-sm text-white/80 hover:text-gold transition-colors"
                          >
                            <ArrowLeft className="h-4 w-4" />
                            {isKo ? '제품군으로' : 'Back to Product Groups'}
                          </Link>

                          <div className="mb-4 flex flex-wrap gap-2">
                            {item === activeProduct ? parseProductTags(activeCategoryLabel, isKo ? activeProduct.tagKo : activeProduct.tagEn).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex rounded-full border border-gold/45 bg-gold/15 px-4 py-1 text-xs font-semibold tracking-[0.12em] uppercase text-gold"
                              >
                                {tag}
                              </span>
                            )) : (
                              <span className="inline-flex rounded-full border border-gold/45 bg-gold/15 px-4 py-1 text-xs font-semibold tracking-[0.12em] uppercase text-gold">
                                {itemCategory}
                              </span>
                            )}
                          </div>

                          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.95] mb-5">
                            {item === activeProduct ? activeTitle : itemTitle}
                          </h1>
                          <p className="text-xl sm:text-2xl lg:text-3xl font-semibold leading-snug whitespace-pre-line mb-8 text-white/95">
                            {item === activeProduct ? activeSubtitle : itemSubtitle}
                          </p>
                          <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-white/85 max-w-[72ch]">
                            {item === activeProduct ? activeDescription : isKo ? item.descriptionKo : item.descriptionEn}
                          </p>

                          {item === activeProduct && (
                            <div className="mt-10 inline-flex items-center gap-2 text-gold/95 text-sm" style={fadeStyle(visible, 700)}>
                              <ArrowDown className="h-4 w-4 animate-bounce" />
                              {isKo ? '아래로 스크롤해 상세 정보를 확인하세요' : 'Scroll down for full product details'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                )
              })}
            </div>
          </div>
        )}
      </RevealSection>

      <RevealSection
        rootRef={scrollRootRef}
        className="relative snap-start [scroll-snap-stop:always] min-h-screen border-t border-white/10 py-20 sm:py-24"
      >
        {(visible) => (
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="mb-10">
              <p className="text-gold text-xs sm:text-sm font-semibold tracking-[0.24em] uppercase mb-4" style={fadeStyle(visible, 60)}>
                Specs
              </p>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[0.95] text-white" style={fadeStyle(visible, 180)}>
                {isKo ? 'Specs & Details' : 'Specs & Details'}
              </h2>
              <p className="mt-4 text-white/75 text-base sm:text-lg" style={fadeStyle(visible, 300)}>
                {isKo ? `${activeTitle}의 국제 시험 규격 중심 제품 성능 정보` : `Performance data for ${activeTitle} centered on international standards`}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md" style={fadeStyle(visible, 420)}>
                  <h3 className="mb-5 text-xl font-semibold text-gold">{isKo ? '핵심 특성' : 'Key Features'}</h3>
                  <ul className="space-y-3 text-white/90">
                    {activeFeatures.map((feature, index) => (
                      <li key={feature} className="flex items-start gap-3" style={fadeStyle(visible, 520 + index * 70)}>
                        <span className="mt-1 inline-block h-2 w-2 rounded-full bg-gold" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md" style={fadeStyle(visible, 500)}>
                  <h3 className="mb-5 text-xl font-semibold text-gold">{isKo ? '적용 분야' : 'Applications'}</h3>
                  <ul className="space-y-3 text-white/90">
                    {activeApplications.map((application, index) => (
                      <li key={application} className="flex items-start gap-3" style={fadeStyle(visible, 600 + index * 70)}>
                        <span className="mt-1 inline-block h-2 w-2 rounded-full bg-gold" />
                        <span>{application}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md" style={fadeStyle(visible, 460)}>
                <h3 className="mb-5 text-xl font-semibold text-gold">{isKo ? '시험 규격 하이라이트' : 'Standard Highlights'}</h3>
                <div className="space-y-3">
                  {activeProduct.specs.map((spec, index) => (
                    <div
                      key={`${spec.item}-${spec.method}`}
                      className={`rounded-xl border p-4 ${
                        spec.method.includes('ASTM D3674')
                          ? 'border-gold/40 bg-gold/10'
                          : 'border-white/10 bg-slate-900/50'
                      }`}
                      style={fadeStyle(visible, 560 + index * 70)}
                    >
                      <p className="text-xs uppercase tracking-[0.12em] text-gold/95">{spec.method}</p>
                      <p className="mt-1 text-sm text-white/80">{spec.item}</p>
                      <p className="mt-2 text-sm font-semibold text-white">{spec.result}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </RevealSection>

      <RevealSection
        rootRef={scrollRootRef}
        className="relative snap-start [scroll-snap-stop:always] min-h-screen border-t border-white/10 py-20 sm:py-24"
      >
        {(visible) => (
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="mb-10">
              <p className="text-gold text-xs sm:text-sm font-semibold tracking-[0.24em] uppercase mb-4" style={fadeStyle(visible, 60)}>
                Resources
              </p>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[0.95] text-white" style={fadeStyle(visible, 180)}>
                Resources
              </h2>
              <p className="mt-4 text-white/75 text-base sm:text-lg" style={fadeStyle(visible, 300)}>
                {isKo ? 'MSDS 및 시험성적서 자료를 바로 다운로드하세요.' : 'Download MSDS and performance certification files.'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {activeProduct.resources.map((resource, index) => (
                <div
                  key={`${resource.labelKo}-${resource.href}`}
                  className="flex items-center justify-between gap-6 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md"
                  style={fadeStyle(visible, 420 + index * 120)}
                >
                  <div>
                    <p className="text-lg font-semibold text-white">{isKo ? resource.labelKo : resource.labelEn}</p>
                    <p className="mt-2 text-sm text-white/70">{isKo ? '공식 문서 다운로드' : 'Official document download'}</p>
                  </div>
                  <Link
                    href={`/${locale}${resource.href}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-gold/55 bg-gold/20 px-4 py-3 text-sm font-semibold text-gold transition-colors hover:bg-gold/30"
                  >
                    <Download className="h-4 w-4" />
                    {isKo ? '다운로드' : 'Download'}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </RevealSection>

      <RevealSection
        rootRef={scrollRootRef}
        className="relative snap-start [scroll-snap-stop:always] min-h-screen border-t border-white/10 py-20 sm:py-24"
      >
        {(visible) => (
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-[0_24px_90px_rgba(0,0,0,0.24)] backdrop-blur-md sm:p-10">
              <div className="mb-8 flex items-center gap-3" style={fadeStyle(visible, 60)}>
                <FileText className="h-5 w-5 text-gold" />
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-[0.95] text-white">
                  {isKo ? '제품 문의' : 'Product Inquiry'}
                </h2>
              </div>
              <p className="mb-8 text-white/75 text-base sm:text-lg" style={fadeStyle(visible, 180)}>
                {isKo
                  ? `${activeTitle} 관련 기술 상담 및 견적 문의를 남겨주세요.`
                  : `Leave your technical questions and quote request for ${activeTitle}.`}
              </p>

              <div style={fadeStyle(visible, 300)}>
                <ProductInquiryForm locale={locale} productName={activeTitle} isKo={isKo} />
              </div>

              <div className="mt-8 flex items-center gap-2 text-sm text-white/65" style={fadeStyle(visible, 420)}>
                <ShieldCheck className="h-4 w-4 text-gold" />
                {isKo
                  ? '문의 내용은 안전하게 전송되며, Supabase 리드 데이터로 연동 가능합니다.'
                  : 'Inquiry data is sent securely and ready for Supabase lead integration.'}
              </div>
            </div>
          </div>
        )}
      </RevealSection>
    </div>
  )
}