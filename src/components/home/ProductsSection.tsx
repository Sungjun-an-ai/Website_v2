import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'

type Product = {
  id: string
  slug: string
  name_ko: string
  name_en: string
  description_ko: string
  description_en: string
  category: string
  image_url: string
  order_index: number
  is_active: boolean
}

const categoryLabels: Record<string, { ko: string; en: string }> = {
  adhesive: { ko: '접착제', en: 'Adhesive' },
  sealant: { ko: '지수제', en: 'Sealant' },
  waterproof: { ko: '방수제', en: 'Waterproofing' },
  grout: { ko: '그라우트', en: 'Grout' },
}

export default async function ProductsSection() {
  const locale = await getLocale()
  const isKo = locale === 'ko'

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('order_index')

  if (error) console.error('[ProductsSection] fetch error:', error)
  const products: Product[] = data || []

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">Products</div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            {isKo ? '제품 라인업' : 'Product Lineup'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {isKo
              ? '다양한 산업 분야에 최적화된 우레탄 접착·지수 솔루션'
              : 'Urethane adhesive and sealing solutions optimized for diverse industries'}
          </p>
          <div className="w-16 h-1 bg-gold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const categoryLabel = categoryLabels[product.category]
            return (
              <div
                key={product.id}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: product.image_url ? `url(${product.image_url})` : undefined }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-navy to-navy-900 opacity-50" />
                  {categoryLabel && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-gold text-white text-xs font-medium rounded-full">
                        {isKo ? categoryLabel.ko : categoryLabel.en}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-navy mb-2">
                    {isKo ? product.name_ko : product.name_en}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {isKo ? product.description_ko : product.description_en}
                  </p>
                  <Link
                    href={`/${locale}/products/${product.slug}`}
                    className="inline-flex items-center gap-1 text-navy font-medium text-sm hover:text-gold transition-colors"
                  >
                    {isKo ? '자세히 보기' : 'View Details'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
