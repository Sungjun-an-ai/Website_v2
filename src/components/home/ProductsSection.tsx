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
    <section className="relative h-screen w-full flex-shrink-0 snap-start flex flex-col pt-16 md:pt-20 bg-gray-900 overflow-hidden">
      {/* Title Overlay */}
      <div className="absolute top-24 md:top-32 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none w-full px-4">
        <div className="bg-black/40 backdrop-blur-md inline-block px-8 py-4 rounded-2xl border border-white/10 shadow-2xl">
          <div className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">Products</div>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            {isKo ? '제품 라인업' : 'Product Lineup'}
          </h2>
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row h-full w-full group">
        {products.map((product) => {
          const categoryLabel = categoryLabels[product.category]
          return (
            <div
              key={product.id}
              className="group/item flex-1 hover:flex-[2] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] relative flex flex-col justify-end overflow-hidden border-b md:border-r border-white/10 last:border-0"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover/item:scale-105"
                style={{ backgroundImage: `url(${product.image_url})` }}
              />
              
              {/* Overlays */}
              <div className="absolute inset-0 bg-navy/80 md:bg-navy/90 group-hover/item:bg-navy/40 transition-colors duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover/item:block" />

              {/* Content Container */}
              <div className="relative z-10 p-6 md:p-8 flex flex-col justify-end h-full w-full transition-transform duration-500 transform md:translate-y-8 group-hover/item:translate-y-0">
                {categoryLabel && (
                  <div className="mb-4 transform -translate-y-4 opacity-0 group-hover/item:translate-y-0 group-hover/item:opacity-100 transition-all duration-500 delay-100">
                    <span className="px-3 py-1.5 bg-gold text-white text-xs font-bold rounded-full tracking-wider shadow-lg">
                      {isKo ? categoryLabel.ko : categoryLabel.en}
                    </span>
                  </div>
                )}
                
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-2 tracking-tight group-hover/item:text-gold transition-colors duration-300">
                  {isKo ? product.name_ko : product.name_en}
                </h3>
                
                <p className="text-gray-300 text-sm md:text-base mb-6 leading-relaxed hidden md:block opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 delay-150 line-clamp-3">
                  {isKo ? product.description_ko : product.description_en}
                </p>

                {/* Mobile description */}
                <p className="text-gray-400 text-xs mb-4 leading-relaxed md:hidden line-clamp-2">
                  {isKo ? product.description_ko : product.description_en}
                </p>

                <div className="mt-auto pt-4 md:opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 delay-200">
                  <Link
                    href={`/${locale}/products/${product.slug}`}
                    className="inline-flex items-center gap-2 text-white bg-white/10 hover:bg-gold backdrop-blur-sm px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 w-fit subgroup-hover"
                  >
                    {isKo ? '자세히 보기' : 'View Details'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
