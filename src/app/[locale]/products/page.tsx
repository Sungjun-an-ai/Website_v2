"use client"

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

type ProductGroup = {
  key: string
  labelKo: string
  labelEn: string
  subtitleKo: string
  subtitleEn: string
  href: (locale: string) => string
  image: string
}

const productGroups: ProductGroup[] = [
  {
    key: 'sealant',
    labelKo: '지수제',
    labelEn: 'Sealing Agent',
    subtitleKo: '누수 차단의 정밀함과 내구성을 동시에',
    subtitleEn: 'Precision leak-blocking with lasting durability',
    href: (locale) => `/${locale}/products/ws-3000`,
    image: '/about/Aerial_timelapse_of_subway_con_Kling_30__16770.mp4',
  },
  {
    key: 'fire-door-adhesive',
    labelKo: '방화문 접착제',
    labelEn: 'Fire Door Adhesive',
    subtitleKo: '내열 성능과 안정 접착을 위한 방화문 솔루션',
    subtitleEn: 'Heat-resistant bonding solution for fire doors',
    href: (locale) => `/${locale}/products/nflv-eco`,
    image: '/about/A_photorealistic_hero_image_on_Nano_Banana_2_74206.png',
  },
  {
    key: 'interior-door-adhesive',
    labelKo: '실내문 접착제',
    labelEn: 'Interior Door Adhesive',
    subtitleKo: '실내도어 양산 공정을 위한 균일 접착 성능',
    subtitleEn: 'Consistent bonding for interior door production',
    href: (locale) => `/${locale}/products/id`,
    image: '/about/Aerial_timelapse_of_Seoul_at_g_Kling_30__41996.mp4',
  },
  {
    key: 'general-adhesive',
    labelKo: '일반 접착제',
    labelEn: 'General Adhesive',
    subtitleKo: '다양한 공정에 적용 가능한 범용 우레탄 접착',
    subtitleEn: 'Versatile urethane bonding across processes',
    href: (locale) => `/${locale}/products/hanaro-p`,
    image: '/about/An_extreme_macro_close-up_of_u_Nano_Banana_Pro_81286.png',
  },
  {
    key: 'urethane-solution',
    labelKo: '우레탄 솔루션',
    labelEn: 'Urethane Solution',
    subtitleKo: '제품을 넘어 공정 전체를 함께 설계하는 파트너십',
    subtitleEn: 'Process-wide partnership beyond products',
    href: (locale) => `/${locale}/about`,
    image: '/about/A_photorealistic_hero_image_se_Nano_Banana_Pro_42629.png',
  },
]

export default function ProductsPage() {
  const params = useParams()
  const locale = params.locale as string
  const isKo = locale === 'ko'
  const [showCardEntrance, setShowCardEntrance] = useState(false)
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const loopGroups = [...productGroups, ...productGroups]

  const fadeIn = (delayMs: number): React.CSSProperties =>
    showCardEntrance
      ? { animation: `hero-fade-up 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms both` }
      : { opacity: 0, transform: 'translateY(20px)', filter: 'blur(4px)' }

  const cardEntranceStyle = (order: number): React.CSSProperties => fadeIn(200 + order * 260)

  useEffect(() => {
    requestAnimationFrame(() => setShowCardEntrance(true))
  }, [])

  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    const interval = window.setInterval(() => {
      const columnWidth = slider.clientWidth / 3
      const next = slider.scrollLeft + columnWidth
      const firstLoopEnd = columnWidth * productGroups.length

      if (next > firstLoopEnd + 2) {
        slider.scrollTo({ left: 0, behavior: 'auto' })
        return
      }

      slider.scrollTo({ left: next, behavior: 'smooth' })
    }, 3600)

    return () => window.clearInterval(interval)
  }, [productGroups.length])

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: "url('/about/Same_image_change_to_169_ratio_Nano_Banana_2_00205.png')" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(27, 42, 107, 0.60) 0%, rgba(27, 42, 107, 0.42) 38%, rgba(27, 42, 107, 0.18) 68%, rgba(2, 6, 23, 0.35) 100%)',
        }}
      />
      <div className="absolute inset-0 bg-slate-950/10" />

      <section className="relative z-10 flex flex-col pt-28 md:pt-36">
        <div className="mx-auto w-full max-w-7xl mb-8 px-5 pt-6 sm:px-8 md:pt-8 lg:px-12 lg:pt-10">
          <p className="text-gold text-xs sm:text-sm font-semibold tracking-[0.24em] uppercase mb-4" style={fadeIn(0)}>Products</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[0.95] text-white" style={fadeIn(120)}>
            {isKo ? '한성우레탄 제품군' : 'Hansung Urethane Product Groups'}
          </h1>
          <p className="mt-5 text-base sm:text-lg text-white/80 max-w-4xl leading-relaxed" style={fadeIn(260)}>
            {isKo
              ? '좌우로 스크롤하며 5개 제품군의 대표 이미지를 3분할 화면으로 확인하세요.'
              : 'Scroll horizontally to explore 5 product groups in split-screen visuals.'}
          </p>
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 h-[64vh] min-h-[440px] max-h-[640px]">
          <div
            ref={sliderRef}
            className="h-full overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex h-full snap-x snap-mandatory gap-0">
              {loopGroups.map((group, index) => (
                <Link
                  key={`${group.key}-${index}`}
                  href={group.href(locale)}
                  className="group relative h-full basis-1/3 flex-none snap-start overflow-hidden"
                  style={index < 3 ? cardEntranceStyle(index) : undefined}
                >
                  {group.image.endsWith('.mp4') ? (
                    <video autoPlay muted loop playsInline className="h-full w-full object-cover object-center">
                      <source src={group.image} type="video/mp4" />
                    </video>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={group.image} alt="" className="h-full w-full object-cover object-center" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/22 to-black/34" />

                  <div className="absolute top-6 right-6 z-10 max-w-[82%] text-right md:top-10 md:right-10 drop-shadow-[0_8px_26px_rgba(0,0,0,0.66)]">
                    <h2
                      className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-[0.98] text-gold transition-colors"
                      style={{ WebkitTextStroke: '0.55px rgba(255,255,255,0.92)', paintOrder: 'stroke fill' }}
                    >
                      {isKo ? group.labelKo : group.labelEn}
                    </h2>
                    <p className="mt-3 text-xs sm:text-sm lg:text-base text-white/95 leading-relaxed">
                      {isKo ? group.subtitleKo : group.subtitleEn}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
