"use client"

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { ChevronDown } from 'lucide-react'

const slides = [
  {
    bg: 'from-navy-900 to-navy-600',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80',
    titleKey: 'slide1.title',
    subtitleKey: 'slide1.subtitle',
    ctaKey: 'ctaProducts',
    ctaHref: (locale: string) => `/${locale}/products/hs-100`,
  },
  {
    bg: 'from-navy-800 to-navy-500',
    image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1920&q=80',
    titleKey: 'slide2.title',
    subtitleKey: 'slide2.subtitle',
    ctaKey: 'ctaContact',
    ctaHref: (locale: string) => `/${locale}#contact`,
  },
  {
    bg: 'from-navy-700 to-navy-900',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1920&q=80',
    titleKey: 'slide3.title',
    subtitleKey: 'slide3.subtitle',
    ctaKey: 'ctaProducts',
    ctaHref: (locale: string) => `/${locale}/products/hs-300`,
  },
]

export default function HeroCarousel() {
  const t = useTranslations('hero')
  const locale = useLocale()
  const swiperRef = useRef<HTMLDivElement>(null)

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
  }, [])

  return (
    <section className="relative h-screen min-h-[600px]">
      <div ref={swiperRef} className="swiper h-full">
        <div className="swiper-wrapper">
          {slides.map((slide, idx) => (
            <div key={idx} className="swiper-slide relative h-screen min-h-[600px]">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              {/* Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg} opacity-75`} />

              {/* Content */}
              <div className="relative z-10 flex items-center h-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl">
                    <div className="text-gold text-sm font-semibold tracking-widest mb-4 uppercase">
                      HANSUNG URETHANE CO., LTD.
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                      {t(slide.titleKey as any)}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
                      {t(slide.subtitleKey as any)}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        href={slide.ctaHref(locale)}
                        className="inline-flex items-center justify-center px-8 py-4 bg-gold text-white font-semibold rounded-lg hover:bg-gold-dark transition-colors text-lg"
                      >
                        {t(slide.ctaKey as any)}
                      </Link>
                      <Link
                        href={`/${locale}#contact`}
                        className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-navy transition-colors text-lg"
                      >
                        {t('ctaContact')}
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
