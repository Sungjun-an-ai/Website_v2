import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { CheckCircle, Download, ArrowLeft, Phone, Mail } from 'lucide-react'

const categoryLabels: Record<string, { ko: string; en: string }> = {
  adhesive: { ko: '우레탄 접착제', en: 'Urethane Adhesive' },
  sealant: { ko: '지수제', en: 'Sealant' },
  waterproof: { ko: '방수제', en: 'Waterproofing' },
  grout: { ko: '그라우트', en: 'Grout' },
}

function getCategoryLabel(category: string, isKo: boolean): string {
  const labels = categoryLabels[category]
  if (!labels) return category
  return isKo ? labels.ko : labels.en
}

const productData: Record<string, {
  image: string
  category: string
  features_ko: string[]
  features_en: string[]
  applications_ko: string[]
  applications_en: string[]
  specs: Record<string, string>
  color: string
}> = {
  'hs-100': {
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    category: 'adhesive',
    features_ko: [
      '고강도 우레탄 접착력 (인장강도 ≥ 3.5MPa)',
      '우수한 내열성 (-20°C ~ +80°C)',
      '내화학성 우수',
      '단시간 경화 (20°C, 24시간)',
      'KS F 4910 규격 충족',
      '저VOC 친환경 제품',
    ],
    features_en: [
      'High-strength urethane adhesion (tensile strength ≥ 3.5MPa)',
      'Excellent heat resistance (-20°C ~ +80°C)',
      'Superior chemical resistance',
      'Fast cure time (20°C, 24 hours)',
      'Meets KS F 4910 standard',
      'Low-VOC eco-friendly product',
    ],
    applications_ko: [
      '콘크리트 접합',
      '금속 구조물 접착',
      '목재 접합',
      '복합 패널 접착',
      '건설 현장 구조 접합',
    ],
    applications_en: [
      'Concrete bonding',
      'Metal structure adhesion',
      'Wood bonding',
      'Composite panel adhesion',
      'Structural bonding at construction sites',
    ],
    specs: {
      '주성분 / Base': 'Polyurethane',
      '색상 / Color': 'Gray / Black',
      '점도 / Viscosity': '15,000~25,000 cPs (25°C)',
      '혼합비 / Mix Ratio': 'A:B = 1:1 (Vol)',
      '가사시간 / Pot Life': '30분 (25°C)',
      '완전경화 / Full Cure': '7일 (25°C)',
      '포장 / Package': '20kg/set',
    },
    color: 'from-blue-600 to-navy',
  },
  'hs-200': {
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=80',
    category: 'sealant',
    features_ko: [
      '탁월한 수밀성 (수압 0.3MPa 이상 견딤)',
      '높은 탄성 (신장률 ≥ 300%)',
      '우수한 접착성',
      '균열 추종성 우수',
      'KS F 4923 인증',
      '내구성 우수 (10년 이상)',
    ],
    features_en: [
      'Excellent watertightness (withstands water pressure ≥ 0.3MPa)',
      'High elasticity (elongation ≥ 300%)',
      'Superior adhesion',
      'Excellent crack-following ability',
      'KS F 4923 certified',
      'Outstanding durability (10+ years)',
    ],
    applications_ko: [
      '지하 구조물 방수',
      '터널 지수 처리',
      '옹벽 균열 보수',
      '지하 주차장 누수 방지',
      '상하수도관 접합부',
    ],
    applications_en: [
      'Underground structure waterproofing',
      'Tunnel sealing treatment',
      'Retaining wall crack repair',
      'Underground parking lot leak prevention',
      'Water/sewage pipe joints',
    ],
    specs: {
      '주성분 / Base': 'Polyurethane (2-component)',
      '색상 / Color': 'Dark Gray',
      '비중 / Specific Gravity': '1.3 ± 0.1',
      '혼합비 / Mix Ratio': 'A:B = 3:1 (Vol)',
      '가사시간 / Pot Life': '20분 (25°C)',
      '완전경화 / Full Cure': '72시간 (25°C)',
      '포장 / Package': '15kg/set',
    },
    color: 'from-teal-600 to-navy',
  },
  'hs-300': {
    image: 'https://images.unsplash.com/photo-1590393802688-9c90a39a2e31?w=1200&q=80',
    category: 'waterproof',
    features_ko: [
      '탄성 도막형 방수',
      '내후성 · 내자외선 우수',
      '다양한 소재 적용 가능',
      '1액형/2액형 선택 가능',
      '연속 방수층 형성',
      'KS F 4923 규격 준수',
    ],
    features_en: [
      'Elastic membrane waterproofing',
      'Excellent weather/UV resistance',
      'Applicable to various substrates',
      'Available in 1-component/2-component',
      'Continuous waterproof layer formation',
      'Complies with KS F 4923',
    ],
    applications_ko: [
      '건물 옥상 방수',
      '지붕 슬래브 방수',
      '발코니 바닥 방수',
      '주차장 상부 방수',
      '테라스 방수',
    ],
    applications_en: [
      'Building rooftop waterproofing',
      'Roof slab waterproofing',
      'Balcony floor waterproofing',
      'Parking lot top surface waterproofing',
      'Terrace waterproofing',
    ],
    specs: {
      '주성분 / Base': 'Urethane Rubber (1-component)',
      '색상 / Color': 'Gray / Silver / Ivory',
      '비중 / Specific Gravity': '1.2 ± 0.1',
      '도막두께 / Film Thickness': '2.0mm (2회 도포)',
      '건조시간 / Dry Time': '6시간 (지촉건조, 25°C)',
      '완전경화 / Full Cure': '7일 (25°C)',
      '포장 / Package': '18kg/drum',
    },
    color: 'from-indigo-600 to-navy',
  },
  'hs-400': {
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=80',
    category: 'grout',
    features_ko: [
      '고발포성 (발포배율 20~30배)',
      '수반응 급결 경화',
      '우수한 지수 성능',
      '고압 주입 가능 (10MPa)',
      '지반 강화 효과',
      '환경 친화적',
    ],
    features_en: [
      'High expansion (expansion ratio 20~30x)',
      'Water-reactive rapid setting',
      'Excellent sealing performance',
      'High-pressure injection capable (10MPa)',
      'Ground reinforcement effect',
      'Environmentally friendly',
    ],
    applications_ko: [
      '콘크리트 균열 보수',
      '터널 용수 차단',
      '지반 보강 주입',
      '댐 · 수로 보수',
      '지하 구조물 균열 지수',
    ],
    applications_en: [
      'Concrete crack repair',
      'Tunnel water blocking',
      'Ground reinforcement injection',
      'Dam and waterway repair',
      'Underground structure crack sealing',
    ],
    specs: {
      '주성분 / Base': 'Polyurethane (Water-reactive)',
      '색상 / Color': 'Amber (Before cure)',
      '비중 / Specific Gravity': '1.1 ± 0.05',
      '발포배율 / Expansion': '20~30배 (물과 반응)',
      '반응시간 / Reaction Time': '5~30초',
      '완전경화 / Full Cure': '24시간',
      '포장 / Package': '20kg/drum',
    },
    color: 'from-gray-600 to-navy',
  },
}

export function generateStaticParams() {
  return Object.keys(productData).map(slug => ({ slug }))
}

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const product = productData[slug]
  if (!product) notFound()

  const t = await getTranslations({ locale, namespace: 'products' })

  const isKo = locale === 'ko'
  const features = isKo ? product.features_ko : product.features_en
  const applications = isKo ? product.applications_ko : product.applications_en
  const nameKey = `items.${slug}.name` as any
  const descKey = `items.${slug}.description` as any

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${product.image})` }}
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${product.color} opacity-80`} />
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {isKo ? '제품 목록으로' : 'Back to Products'}
            </Link>
            <div className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">
              {getCategoryLabel(product.category, isKo)}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {t(nameKey)}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <p className="text-gray-600 text-lg leading-relaxed">{t(descKey)}</p>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-2xl font-bold text-navy mb-4">{t('features')}</h2>
              <div className="w-12 h-1 bg-gold mb-6" />
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Applications */}
            <div>
              <h2 className="text-2xl font-bold text-navy mb-4">{t('applications')}</h2>
              <div className="w-12 h-1 bg-gold mb-6" />
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {applications.map((app, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{app}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div>
              <h2 className="text-2xl font-bold text-navy mb-4">{t('specifications')}</h2>
              <div className="w-12 h-1 bg-gold mb-6" />
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specs).map(([key, value], idx) => (
                      <tr key={key} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-3 px-4 font-medium text-navy text-sm w-1/2">{key}</td>
                        <td className="py-3 px-4 text-gray-700 text-sm">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Download CTA */}
            <div className="bg-navy rounded-xl p-6 text-white">
              <h3 className="font-semibold mb-3">{t('downloadCatalog')}</h3>
              <p className="text-gray-300 text-sm mb-4">
                {isKo
                  ? '상세 기술 데이터 시트를 다운로드하세요'
                  : 'Download the detailed technical data sheet'}
              </p>
              <Link
                href={`/${locale}/resources`}
                className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white rounded-lg px-4 py-3 text-sm font-medium transition-colors w-full"
              >
                <Download className="h-4 w-4" />
                {t('downloadCatalog')}
              </Link>
            </div>

            {/* Inquiry CTA */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-navy mb-3">{t('inquiry')}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {isKo ? '제품 관련 문의 사항이 있으시면 연락해 주세요.' : 'Contact us for product inquiries.'}
              </p>
              <div className="space-y-2">
                <a
                  href="tel:031-943-8732"
                  className="flex items-center gap-2 text-navy hover:text-gold transition-colors text-sm font-medium"
                >
                  <Phone className="h-4 w-4" />
                  031-943-8732
                </a>
                <a
                  href="mailto:info@hsurethane.co.kr"
                  className="flex items-center gap-2 text-navy hover:text-gold transition-colors text-sm font-medium"
                >
                  <Mail className="h-4 w-4" />
                  info@hsurethane.co.kr
                </a>
              </div>
              <Link
                href={`/${locale}#contact`}
                className="mt-4 flex items-center justify-center bg-navy hover:bg-navy-700 text-white rounded-lg px-4 py-3 text-sm font-medium transition-colors w-full"
              >
                {t('inquiry')}
              </Link>
            </div>

            {/* Other products */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-navy mb-3">
                {isKo ? '다른 제품 보기' : 'Other Products'}
              </h3>
              <ul className="space-y-2">
                {Object.keys(productData).filter(s => s !== slug).map(s => (
                  <li key={s}>
                    <Link
                      href={`/${locale}/products/${s}`}
                      className="text-sm text-gray-600 hover:text-navy hover:font-medium transition-all"
                    >
                      {s.toUpperCase()} - {getCategoryLabel(productData[s].category, isKo)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
