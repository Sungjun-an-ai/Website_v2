import { useTranslations } from 'next-intl'
import { Award, Lightbulb, Handshake } from 'lucide-react'

type ValueKey = 'quality' | 'innovation' | 'partnership'

const values: { key: ValueKey; icon: typeof Award; image: string; reverse: boolean }[] = [
  {
    key: 'quality',
    icon: Award,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
    reverse: false,
  },
  {
    key: 'innovation',
    icon: Lightbulb,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
    reverse: true,
  },
  {
    key: 'partnership',
    icon: Handshake,
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    reverse: false,
  },
]

export default function ValuesSection() {
  const t = useTranslations('values')

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">Core Values</div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">{t('title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('subtitle')}</p>
          <div className="w-16 h-1 bg-gold mx-auto mt-4" />
        </div>

        <div className="space-y-16 md:space-y-24">
          {values.map((value, idx) => {
            const Icon = value.icon
            return (
              <div
                key={value.key}
                className={`flex flex-col ${value.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-16`}
              >
                {/* Image */}
                <div className="w-full md:w-1/2">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${value.image})` }}
                    />
                    <div className="absolute inset-0 bg-navy opacity-20" />
                    <div className="absolute bottom-4 right-4">
                      <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
                        <Icon className="h-6 w-6 text-white" />
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
                    {t(`items.${value.key}.title`)}
                  </h3>
                  <div className="w-12 h-1 bg-gold mb-4" />
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                    {t(`items.${value.key}.description`)}
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
