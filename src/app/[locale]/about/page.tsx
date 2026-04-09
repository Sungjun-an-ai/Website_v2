import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { Award, CheckCircle } from 'lucide-react'

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'about' })
  const isKo = locale === 'ko'

  const certItems = isKo ? [
    'ISO 9001 품질경영시스템 인증',
    'KS F 4910 건축용 실링재 인증',
    'KS F 4923 우레탄 고무계 방수재 인증',
    '벤처기업 인증',
    '이노비즈 기업 인증',
  ] : [
    'ISO 9001 Quality Management System Certification',
    'KS F 4910 Building Sealant Certification',
    'KS F 4923 Urethane Rubber Waterproofing Certification',
    'Venture Company Certification',
    'Innobiz Company Certification',
  ]

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="bg-navy py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">About Us</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('title')}</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <div className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">Overview</div>
            <h2 className="text-3xl font-bold text-navy mb-4">{t('title')}</h2>
            <div className="w-12 h-1 bg-gold mb-6" />
            <p className="text-gray-600 leading-relaxed text-lg">{t('overview')}</p>
          </div>
          <div className="relative">
            <div
              className="w-full h-72 rounded-2xl bg-cover bg-center shadow-xl"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80)' }}
            />
            <div className="absolute -bottom-4 -right-4 bg-gold text-white rounded-xl p-4 shadow-lg">
              <div className="text-3xl font-bold">36+</div>
              <div className="text-sm">{isKo ? '년의 경험' : 'Years of Experience'}</div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-navy rounded-2xl p-8 text-white">
            <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t('missionTitle')}</h3>
            <div className="w-10 h-0.5 bg-gold mb-4" />
            <p className="text-gray-300 leading-relaxed">{t('mission')}</p>
          </div>
          <div className="bg-gold rounded-2xl p-8 text-white">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-gold" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t('visionTitle')}</h3>
            <div className="w-10 h-0.5 bg-white mb-4" />
            <p className="text-white/90 leading-relaxed">{t('vision')}</p>
          </div>
        </div>

        {/* Certifications */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-navy">{t('certification')}</h2>
            <div className="w-12 h-1 bg-gold mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {certItems.map((cert, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <CheckCircle className="h-5 w-5 text-gold flex-shrink-0" />
                <span className="text-gray-700 text-sm">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
