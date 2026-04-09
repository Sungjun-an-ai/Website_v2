"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const products = [
  {
    slug: 'hs-100',
    category: 'adhesive',
    name_ko: 'HS-100 우레탄 접착제',
    name_en: 'HS-100 Urethane Adhesive',
    description_ko: '고강도 우레탄 접착제. 콘크리트, 금속, 목재 등 다양한 소재의 접합에 사용되는 2액형 폴리우레탄 접착제입니다.',
    description_en: 'High-strength urethane adhesive. A two-component polyurethane adhesive for bonding concrete, metal, wood, and various other substrates.',
  },
  {
    slug: 'hs-200',
    category: 'sealant',
    name_ko: 'HS-200 폴리우레탄 지수제',
    name_en: 'HS-200 Polyurethane Sealant',
    description_ko: '탁월한 수밀성의 지수제. 지하 구조물, 터널, 댐 등의 누수 방지 및 방수 처리에 적합한 2액형 폴리우레탄 지수제입니다.',
    description_en: 'Excellent watertightness sealant. A two-component polyurethane sealant suitable for waterproofing underground structures, tunnels, and dams.',
  },
  {
    slug: 'hs-300',
    category: 'waterproof',
    name_ko: 'HS-300 우레탄 방수제',
    name_en: 'HS-300 Urethane Waterproofing',
    description_ko: '탄성 도막형 방수제. 건물 옥상, 지붕, 발코니 등의 방수 시공에 사용되는 우레탄 고무계 방수재입니다.',
    description_en: 'Elastic membrane waterproofing. A urethane rubber waterproofing material for rooftops, roofs, balconies, and other surfaces.',
  },
  {
    slug: 'hs-400',
    category: 'grout',
    name_ko: 'HS-400 발포 우레탄 그라우트',
    name_en: 'HS-400 Expanding Urethane Grout',
    description_ko: '수반응 급결 그라우트. 콘크리트 균열 보수, 터널 용수 차단, 지반 보강 주입에 사용되는 고발포성 우레탄 그라우트입니다.',
    description_en: 'Water-reactive rapid-setting grout. A high-expansion urethane grout used for concrete crack repair, tunnel water blocking, and ground reinforcement.',
  },
]

const categories = [
  { key: 'all', ko: '전체', en: 'All' },
  { key: 'adhesive', ko: '접착제', en: 'Adhesive' },
  { key: 'sealant', ko: '지수제', en: 'Sealant' },
  { key: 'waterproof', ko: '방수제', en: 'Waterproofing' },
  { key: 'grout', ko: '그라우트', en: 'Grout' },
]

const categoryColors: Record<string, string> = {
  adhesive: 'bg-blue-100 text-blue-700',
  sealant: 'bg-teal-100 text-teal-700',
  waterproof: 'bg-indigo-100 text-indigo-700',
  grout: 'bg-gray-200 text-gray-700',
}

export default function ProductsPage() {
  const params = useParams()
  const locale = params.locale as string
  const isKo = locale === 'ko'
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory)

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-3">
            {isKo ? '제품소개' : 'Our Products'}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {isKo ? '한성우레탄 제품군' : 'Hansung Urethane Product Line'}
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            {isKo
              ? '36년 기술력이 담긴 우레탄 접착제·지수제·방수제·그라우트 제품을 소개합니다.'
              : '36 years of expertise in urethane adhesives, sealants, waterproofing, and grout products.'}
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b border-gray-200 sticky top-16 md:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-3 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat.key
                    ? 'bg-navy text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {isKo ? cat.ko : cat.en}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(product => (
            <div
              key={product.slug}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="p-6 flex flex-col flex-1">
                <span className={`self-start px-2.5 py-1 rounded-full text-xs font-semibold mb-3 ${categoryColors[product.category]}`}>
                  {isKo
                    ? categories.find(c => c.key === product.category)?.ko
                    : categories.find(c => c.key === product.category)?.en}
                </span>
                <h2 className="text-lg font-bold text-navy mb-2">
                  {isKo ? product.name_ko : product.name_en}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">
                  {isKo ? product.description_ko : product.description_en}
                </p>
                <Link
                  href={`/${locale}/products/${product.slug}`}
                  className="mt-5 inline-flex items-center justify-center px-4 py-2.5 bg-navy hover:bg-navy-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {isKo ? '자세히 보기' : 'Learn More'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
