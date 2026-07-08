import { Award, Lightbulb, Handshake, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { getLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'

type CoreValue = {
  id: string
  title_ko: string
  title_en: string
  description_ko: string
  description_en: string
  icon: string
  order_index: number
  is_active: boolean
}

const iconMap: Record<string, LucideIcon> = {
  award: Award,
  lightbulb: Lightbulb,
  handshake: Handshake,
}

export default async function ValuesSection() {
  const locale = await getLocale()
  const isKo = locale === 'ko'

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('core_values')
    .select('*')
    .eq('is_active', true)
    .order('order_index')

  if (error) console.error('[ValuesSection] fetch error:', error)
  const values: CoreValue[] = data || []

  // Default images for values if they don't have one, just to make the background look premium
  const bgImages = [
    'https://images.unsplash.com/photo-1504917595217-d4f3915ce113?w=1920&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80'
  ]

  return (
    <section className="relative h-screen w-full flex-shrink-0 snap-start flex flex-col bg-navy pt-16 md:pt-20 overflow-hidden">
      {/* Title Overlay */}
      <div className="absolute top-24 md:top-32 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none w-full px-4">
        <div className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">Core Values</div>
        <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-xl mb-4">
          {isKo ? '핵심 가치' : 'Core Values'}
        </h2>
        <div className="w-16 h-1 bg-gold mx-auto" />
      </div>

      <div className="flex-grow flex flex-col h-full w-full group pt-32 pb-8 md:pt-36">
        {values.map((value, idx) => {
          const Icon: LucideIcon = iconMap[value.icon] ?? Award
          const bgImg = bgImages[idx % bgImages.length]

          return (
            <Link
              key={value.id}
              href={`/${locale}/about`}
              aria-label={isKo ? '회사소개로 이동' : 'Go to About'}
              className="group/item flex-1 hover:flex-[1.5] transition-all duration-700 ease-out relative flex items-center justify-center overflow-hidden border-b border-white/5 last:border-b-0 cursor-pointer"
            >
              {/* Background Image & Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover/item:scale-105"
                style={{ backgroundImage: `url(${bgImg})` }}
              />
              <div className="absolute inset-0 bg-navy/85 group-hover/item:bg-navy/70 transition-colors duration-500" />
              
              {/* Content Container */}
              <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-6 md:gap-12 transition-transform duration-500">
                {/* Number & Icon */}
                <div className="flex flex-col items-center justify-center text-gold opacity-80 group-hover/item:opacity-100 transition-opacity duration-300 md:w-32">
                  <span className="text-xs font-bold tracking-[0.2em] mb-2 uppercase">0{idx + 1}</span>
                  <Icon className="h-10 w-10 md:h-12 md:w-12 transform group-hover/item:scale-110 transition-transform duration-500" />
                </div>

                {/* Text Content */}
                <div className="text-center md:text-left flex-1 md:pr-12 md:opacity-75 group-hover/item:opacity-100 transition-opacity duration-500">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">
                    {isKo ? value.title_ko : value.title_en}
                  </h3>
                  <div className="w-12 h-0.5 bg-gold mx-auto md:mx-0 mb-3 md:mb-4 transform origin-left md:scale-x-100 scale-x-50 group-hover/item:scale-x-100 transition-transform duration-500" />
                  
                  <p className="text-gray-300 text-sm md:text-lg leading-relaxed max-w-3xl hidden md:block opacity-0 md:opacity-100 transform translate-y-4 group-hover/item:translate-y-0 transition-all duration-500">
                     {isKo ? value.description_ko : value.description_en}
                  </p>
                  {/* Mobile exact description mapping */}
                  <p className="text-gray-300 text-sm leading-relaxed md:hidden">
                     {isKo ? value.description_ko : value.description_en}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
