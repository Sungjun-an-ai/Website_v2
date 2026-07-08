"use client"

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type HeroSlide = {
  id: string
  title_ko: string
  title_en: string
  subtitle_ko: string
  subtitle_en: string
  image_url: string
  cta_text_ko: string
  cta_text_en: string
  cta_href: string
  order_index: number
  is_active: boolean
}

type Stat = {
  id: string
  label_ko: string
  label_en: string
  value: string
  suffix: string
  order_index: number
  is_active: boolean
}

function CountUp({ end, suffix, started }: { end: number; suffix: string; started: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!started) return
    const duration = 3000
    const steps = 60
    const increment = end / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [end, started])

  return <span>{count.toLocaleString()}{suffix}</span>
}

const fallbackStats: Stat[] = [
  { id: 'hero-fallback-1', label_ko: '업력', label_en: 'Years', value: '36', suffix: '+', order_index: 1, is_active: true },
  { id: 'hero-fallback-2', label_ko: '거래처', label_en: 'Clients', value: '500', suffix: '+', order_index: 2, is_active: true },
  { id: 'hero-fallback-3', label_ko: '완료 프로젝트', label_en: 'Projects', value: '1000', suffix: '+', order_index: 3, is_active: true },
  { id: 'hero-fallback-4', label_ko: '진행 현장', label_en: 'Active Sites', value: '30', suffix: '+', order_index: 4, is_active: true },
]

const fallbackHeroSlides: HeroSlide[] = [
  {
    id: 'hero-fallback-slide',
    title_ko: 'BONDING TOMORROW TOGETHER',
    title_en: 'BONDING TOMORROW TOGETHER',
    subtitle_ko: '36년 우레탄 접착제·지수제 전문 제조기업',
    subtitle_en: '36 years of urethane adhesive and sealant manufacturing',
    image_url: '',
    cta_text_ko: '제품 보기',
    cta_text_en: 'View Products',
    cta_href: '/ko/products',
    order_index: 1,
    is_active: true,
  },
]

function activateSlideMedia(slideEl: Element | undefined) {
  if (!slideEl) return
  const video = slideEl.querySelector('video')
  if (video) {
    const play = (video as HTMLVideoElement).play()
    if (play && typeof play.catch === 'function') play.catch(() => {})
  }
  const bg = slideEl.querySelector<HTMLElement>('[data-hero-bg]')
  if (bg) {
    const url = bg.getAttribute('data-hero-bg')
    if (url) {
      bg.style.backgroundImage = `url(${url})`
      bg.removeAttribute('data-hero-bg')
    }
  }
}

export default function HeroCarousel({
  initialSlides = [],
  initialStats = [],
}: {
  initialSlides?: HeroSlide[]
  initialStats?: Stat[]
} = {}) {
  const locale = useLocale()
  const swiperRef = useRef<HTMLDivElement>(null)
  const tickerContainerRef = useRef<HTMLDivElement>(null)
  const tickerKpiStartRef = useRef<HTMLDivElement>(null)
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides)
  const [stats, setStats] = useState<Stat[]>(initialStats)
  const [showTicker, setShowTicker] = useState(false)
  const [startMarquee, setStartMarquee] = useState(false)
  const [tickerStartOffset, setTickerStartOffset] = useState(0)
  const displaySlides = slides.length > 0 ? slides : fallbackHeroSlides

  useEffect(() => {
    if (initialSlides.length > 0) return
    const supabase = createClient()
    supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('order_index')
      .then(({ data, error }) => {
        if (error) console.error('[HeroCarousel] fetch error:', error)
        setSlides(data || [])
      })
  }, [initialSlides.length])

  useEffect(() => {
    if (initialStats.length > 0) return
    const supabase = createClient()
    supabase
      .from('stats')
      .select('*')
      .eq('is_active', true)
      .order('order_index')
      .then(({ data, error }) => {
        if (error) console.error('[HeroCarousel] stats fetch error:', error)
        setStats(data || [])
      })
  }, [initialStats.length])

  useEffect(() => {
    const initSwiper = async () => {
      const { Swiper } = await import('swiper')
      const { Navigation, Pagination, Autoplay, EffectFade } = await import('swiper/modules')

      await import('swiper/css')
      await import('swiper/css/navigation')
      await import('swiper/css/pagination')
      await import('swiper/css/effect-fade')

      if (swiperRef.current) {
        new Swiper(swiperRef.current, {
          modules: [Navigation, Pagination, Autoplay, EffectFade],
          effect: 'fade',
          loop: displaySlides.length > 1,
          autoplay: displaySlides.length > 1
            ? {
                delay: 5000,
                disableOnInteraction: false,
              }
            : false,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          on: {
            init: (sw) => activateSlideMedia(sw.slides[sw.activeIndex]),
            slideChangeTransitionStart: (sw) => activateSlideMedia(sw.slides[sw.activeIndex]),
          },
        })
      }
    }
    initSwiper()
  }, [displaySlides.length])

  useEffect(() => {
    const timer = setTimeout(() => setShowTicker(true), 700)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!showTicker) return
    const marqueeTimer = setTimeout(() => setStartMarquee(true), 5000)
    return () => clearTimeout(marqueeTimer)
  }, [showTicker])

  const displayStats = stats.length > 0 ? stats : fallbackStats
  const parseValue = (value: string) => {
    const digitsOnly = value.replace(/[^0-9-]/g, '')
    return parseInt(digitsOnly, 10) || 0
  }

  const sloganText = 'BONDING TOMORROW TOGETHER · HANSUNG URETHANE'

  const tickerLine = [
    ...displayStats.map((stat) => ({ type: 'kpi' as const, stat })),
    { type: 'slogan' as const, text: sloganText },
  ]
  const kpiLine = displayStats.map((stat) => ({ type: 'kpi' as const, stat }))
  const sloganItem = { type: 'slogan' as const, text: sloganText }

  useEffect(() => {
    const measure = () => {
      const container = tickerContainerRef.current
      const kpiStart = tickerKpiStartRef.current
      if (!container || !kpiStart) return
      const offset = (container.offsetWidth - kpiStart.offsetWidth) / 2
      setTickerStartOffset(offset)
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [locale, displayStats.length, showTicker])

  const renderTickerItem = (
    item: (typeof tickerLine)[number],
    key: string,
    animatedKpi: boolean
  ) => {
    if (item.type === 'kpi') {
      // Drop Korean-only suffixes (e.g. "년") when rendering the English locale.
      const rawSuffix = item.stat.suffix || ''
      const suffix = locale === 'ko' ? rawSuffix : rawSuffix.replace(/[가-힣]/g, '')
      return (
        <div key={key} className="inline-flex items-center gap-2 md:gap-3 px-5 md:px-7">
          <span className="text-gold font-semibold text-xs md:text-sm tracking-wide whitespace-nowrap">
            {locale === 'ko' ? item.stat.label_ko : item.stat.label_en}
          </span>
          <span className="text-white font-bold text-sm md:text-base whitespace-nowrap">
            {animatedKpi ? (
              <CountUp end={parseValue(item.stat.value)} suffix={suffix} started={showTicker} />
            ) : (
              <>{parseValue(item.stat.value).toLocaleString()}{suffix}</>
            )}
          </span>
          <span className="text-white/35">•</span>
        </div>
      )
    }

    return (
      <div key={key} className="inline-flex items-center gap-3 px-6 md:px-8">
        <span className="text-white/40">•</span>
        <span className="text-gold font-semibold text-xs md:text-sm tracking-[0.12em] whitespace-nowrap">
          {item.text}
        </span>
        <span className="text-white/40">•</span>
      </div>
    )
  }

  const tickerBar = (
    <div
      className={`absolute left-0 right-0 bottom-0 z-30 transition-all duration-700 ease-out ${
        showTicker ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
      }`}
    >
      <div className="relative border-t border-white/15 bg-black/40 backdrop-blur-md overflow-hidden min-h-[56px] md:min-h-[64px]">
        <div ref={tickerContainerRef} className="ticker-marquee py-4 md:py-5">
          <div
            className={`ticker-track ${startMarquee ? 'ticker-track-running' : 'ticker-track-idle'}`}
            style={{ ['--ticker-start' as string]: `${tickerStartOffset}px` }}
          >
            <div className="inline-flex items-center">
              <div ref={tickerKpiStartRef} className="inline-flex items-center">
                {kpiLine.map((item, idx) => renderTickerItem(item, `first-kpi-${idx}`, true))}
              </div>
              {startMarquee && renderTickerItem(sloganItem, 'first-slogan', false)}
            </div>
            {startMarquee && (
              <div className="inline-flex items-center">
                {tickerLine.map((item, idx) => renderTickerItem(item, `second-${idx}`, false))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <section className="relative h-screen w-full flex-shrink-0 snap-start">
      <div ref={swiperRef} className="swiper h-full">
        <div className="swiper-wrapper">
          {displaySlides.map((slide, slideIndex) => (
            <div key={slide.id} className="swiper-slide relative h-full w-full bg-navy">
              {/* Background Media — only the first slide loads eagerly; the rest
                  load when their slide is first shown (see Swiper handlers). */}
              {slide.image_url?.match(/\.(mp4|webm|ogg)(?:\?.*)?$/i) ? (
                <video
                  src={slide.image_url}
                  autoPlay={slideIndex === 0}
                  loop
                  muted
                  playsInline
                  preload={slideIndex === 0 ? 'auto' : 'none'}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  data-hero-bg={slideIndex === 0 ? undefined : slide.image_url || undefined}
                  style={
                    slide.image_url && slideIndex === 0
                      ? { backgroundImage: `url(${slide.image_url})` }
                      : undefined
                  }
                />
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-700 to-navy-600 opacity-85" />

              {/* Content */}
              <div className="relative z-10 flex items-center h-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl">
                    <div className="hero-fade-in hero-fade-delay-1 text-gold text-sm font-semibold tracking-widest mb-4 uppercase">
                      HANSUNG URETHANE CO., LTD.
                    </div>
                    <h1 className="hero-fade-in hero-fade-delay-2 text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                      {locale === 'ko' ? slide.title_ko : slide.title_en}
                    </h1>
                    <p className="hero-fade-in hero-fade-delay-3 text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
                      {locale === 'ko' ? slide.subtitle_ko : slide.subtitle_en}
                    </p>
                    <div className="flex flex-row flex-wrap gap-3 sm:gap-4">
                      <Link
                        href={slide.cta_href}
                        className="hero-fade-in hero-fade-delay-4 inline-flex items-center justify-center px-4 py-2 text-sm sm:px-8 sm:py-4 sm:text-lg bg-gold text-white font-semibold rounded-lg hover:bg-gold-dark transition-colors"
                      >
                        {locale === 'ko' ? slide.cta_text_ko : slide.cta_text_en}
                      </Link>
                      <Link
                        href={`/${locale}#contact`}
                        className="hero-fade-in hero-fade-delay-5 inline-flex items-center justify-center px-4 py-2 text-sm sm:px-8 sm:py-4 sm:text-lg border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-navy transition-colors"
                      >
                        {locale === 'ko' ? '문의하기' : 'Contact Us'}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="swiper-pagination !bottom-24 md:!bottom-20"></div>

        {/* Navigation */}
        <div className="swiper-button-prev !text-white after:!text-2xl"></div>
        <div className="swiper-button-next !text-white after:!text-2xl"></div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-24 md:bottom-20 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <ChevronDown className="h-8 w-8 text-white opacity-70" />
      </div>

      {tickerBar}
    </section>
  )
}
