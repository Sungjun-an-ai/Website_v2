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

export default function HeroCarousel() {
  const locale = useLocale()
  const swiperRef = useRef<HTMLDivElement>(null)
  const [slides, setSlides] = useState<HeroSlide[]>([])

  useEffect(() => {
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
  }, [])

  useEffect(() => {
    if (slides.length === 0) return

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
          loop: true,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        })
      }
    }
    initSwiper()
  }, [slides])

  if (slides.length === 0) {
    return (
      <section
        className="relative h-screen min-h-[600px] bg-navy"
        aria-label={locale === 'ko' ? '로딩 중' : 'Loading...'}
        aria-busy="true"
      >
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white opacity-70" />
        </div>
      </section>
    )
  }

  return (
    <section className="relative h-screen min-h-[600px]">
      <div ref={swiperRef} className="swiper h-full">
        <div className="swiper-wrapper">
          {slides.map((slide) => (
            <div key={slide.id} className="swiper-slide relative h-screen min-h-[600px]">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image_url})` }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-navy-900 to-navy-600 opacity-75" />

              {/* Content */}
              <div className="relative z-10 flex items-center h-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl">
                    <div className="text-gold text-sm font-semibold tracking-widest mb-4 uppercase">
                      HANSUNG URETHANE CO., LTD.
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                      {locale === 'ko' ? slide.title_ko : slide.title_en}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
                      {locale === 'ko' ? slide.subtitle_ko : slide.subtitle_en}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        href={slide.cta_href}
                        className="inline-flex items-center justify-center px-8 py-4 bg-gold text-white font-semibold rounded-lg hover:bg-gold-dark transition-colors text-lg"
                      >
                        {locale === 'ko' ? slide.cta_text_ko : slide.cta_text_en}
                      </Link>
                      <Link
                        href={`/${locale}#contact`}
                        className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-navy transition-colors text-lg"
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
        <div className="swiper-pagination !bottom-8"></div>

        {/* Navigation */}
        <div className="swiper-button-prev !text-white after:!text-2xl"></div>
        <div className="swiper-button-next !text-white after:!text-2xl"></div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <ChevronDown className="h-8 w-8 text-white opacity-70" />
      </div>
    </section>
  )
}
