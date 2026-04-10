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
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  },
  {
    slug: 'hs-200',
    category: 'sealant',
    name_ko: 'HS-200 폴리우레탄 지수제',
    name_en: 'HS-200 Polyurethane Sealant',
    description_ko: '탁월한 수밀성의 지수제. 지하 구조물, 터널, 댐 등의 누수 방지 및 방수 처리에 적합한 2액형 폴리우레탄 지수제입니다.',
    description_en: 'Excellent watertightness sealant. A two-component polyurethane sealant suitable for waterproofing underground structures, tunnels, and dams.',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80',
  },
  {
    slug: 'hs-300',
    category: 'waterproof',
    name_ko: 'HS-300 우레탄 방수제',
    name_en: 'HS-300 Urethane Waterproofing',
    description_ko: '탄성 도막형 방수제. 건물 옥상, 지붕, 발코니 등의 방수 시공에 사용되는 우레탄 고무계 방수재입니다.',
    description_en: 'Elastic membrane waterproofing. A urethane rubber waterproofing material for rooftops, roofs, balconies, and other surfaces.',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',
  },
  {
    slug: 'hs-400',
    category: 'grout',
    name_ko: 'HS-400 발포 우레탄 그라우트',
    name_en: 'HS-400 Expanding Urethane Grout',
    description_ko: '수반응 급결 그라우트. 콘크리트 균열 보수, 터널 용수 차단, 지반 보강 주입에 사용되는 고발포성 우레탄 그라우트입니다.',
    description_en: 'Water-reactive rapid-setting grout. A high-expansion urethane grout used for concrete crack repair, tunnel water blocking, and ground reinforcement.',
    image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&q=80',
  },
]

const categories = [
  { key: 'all', ko: '전체', en: 'All' },
  { key: 'adhesive', ko: '접착제', en: 'Adhesive' },
  { key: 'sealant', ko: '지수제', en: 'Sealant' },
  { key: 'waterproof', ko: '방수제', en: 'Waterproofing' },
  { key: 'grout', ko: '그라우트', en: 'Grout' },
]

export default function ProductsPage() {
  const params = useParams()
  const locale = params.locale as string
  const isKo = locale === 'ko'
  const [activeCategory, setActiveCategory] = useState('all')
  const [hovered, setHovered] = useState<string | null>(null)

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

      {/* 4-Column Horizontal Image Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 rounded-2xl overflow-hidden shadow-xl border border-gray-200">
          {filtered.map((product) => {
            const catLabel = isKo
              ? categories.find(c => c.key === product.category)?.ko
              : categories.find(c => c.key === product.category)?.en
            const isHovered = hovered === product.slug

            return (
              <Link
                key={product.slug}
                href={`/${locale}/products/${product.slug}`}
                className="relative h-80 sm:h-96 overflow-hidden group cursor-pointer"
                onMouseEnter={() => setHovered(product.slug)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${product.image})` }}
                />

                {/* Gradient overlay */}
                <div className={`absolute inset-0 transition-all duration-300 ${
                  isHovered
                    ? 'bg-navy/80'
                    : 'bg-gradient-to-t from-navy/90 via-navy/40 to-transparent'
                }`} />

                {/* Content - always visible at bottom, full reveal on hover */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
                  {/* Category badge */}
                  <span className={`text-xs font-semibold tracking-widest uppercase text-gold mb-2 transition-all duration-300 ${
                    isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                  }`}>
                    {catLabel}
                  </span>

                  {/* Product Name */}
                  <h2 className={`text-lg font-bold leading-snug transition-all duration-300 ${
                    isHovered ? 'translate-y-0' : 'translate-y-8'
                  }`}>
                    {isKo ? product.name_ko : product.name_en}
                  </h2>

                  {/* Description - only on hover */}
                  <p className={`text-sm text-gray-200 mt-2 leading-relaxed transition-all duration-300 ${
                    isHovered ? 'opacity-100 translate-y-0 max-h-32' : 'opacity-0 translate-y-4 max-h-0 overflow-hidden'
                  }`}>
                    {isKo ? product.description_ko : product.description_en}
                  </p>

                  {/* CTA */}
                  <span className={`mt-4 inline-flex items-center gap-1 text-xs font-semibold text-gold transition-all duration-300 ${
                    isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    {isKo ? '자세히 보기 →' : 'Learn More →'}
                  </span>
                </div>

                {/* Bottom strip - visible when not hovered */}
                <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${
                  isHovered ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}>
                  <p className="text-xs font-medium text-gold/80 tracking-wider uppercase">{catLabel}</p>
                  <h3 className="text-sm font-bold text-white mt-0.5 line-clamp-2">
                    {isKo ? product.name_ko : product.name_en}
                  </h3>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
