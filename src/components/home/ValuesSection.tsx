import { Award, Lightbulb, Handshake, type LucideIcon } from 'lucide-react'
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

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">Core Values</div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            {isKo ? '핵심 가치' : 'Core Values'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {isKo
              ? '한성우레탄이 36년간 지켜온 기업 철학'
              : 'The corporate philosophy Hansung Urethane has upheld for 36 years'}
          </p>
          <div className="w-16 h-1 bg-gold mx-auto mt-4" />
        </div>

        <div className="space-y-16 md:space-y-24">
          {values.map((value, idx) => {
            const Icon: LucideIcon = iconMap[value.icon] ?? Award
            const reverse = idx % 2 === 1
            return (
              <div
                key={value.id}
                className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-16`}
              >
                {/* Icon visual block */}
                <div className="w-full md:w-1/2">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video bg-navy flex items-center justify-center">
                    <div className="absolute inset-0 bg-navy opacity-90" />
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center">
                        <Icon className="h-10 w-10 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full md:w-1/2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center">
                      <Icon className="h-5 w-5 text-gold" />
                    </div>
                    <span className="text-gold text-sm font-semibold tracking-widest uppercase">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-navy mb-4">
                    {isKo ? value.title_ko : value.title_en}
                  </h3>
                  <div className="w-12 h-1 bg-gold mb-4" />
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                    {isKo ? value.description_ko : value.description_en}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
