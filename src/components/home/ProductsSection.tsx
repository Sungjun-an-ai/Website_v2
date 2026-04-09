import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight, Layers, Droplets, Shield, Wrench } from 'lucide-react'

const products = [
  {
    slug: 'hs-100',
    icon: Layers,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    category: 'adhesive',
    color: 'from-blue-600 to-navy',
  },
  {
    slug: 'hs-200',
    icon: Droplets,
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80',
    category: 'sealant',
    color: 'from-teal-600 to-navy',
  },
  {
    slug: 'hs-300',
    icon: Shield,
    image: 'https://images.unsplash.com/photo-1590393802688-9c90a39a2e31?w=600&q=80',
    category: 'waterproof',
    color: 'from-indigo-600 to-navy',
  },
  {
    slug: 'hs-400',
    icon: Wrench,
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80',
    category: 'grout',
    color: 'from-gray-600 to-navy',
  },
]

export default function ProductsSection() {
  const t = useTranslations('products')
  const locale = useLocale()

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">Products</div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">{t('title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('subtitle')}</p>
          <div className="w-16 h-1 bg-gold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const Icon = product.icon
            return (
              <div
                key={product.slug}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-70`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className="h-16 w-16 text-white opacity-80" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-gold text-white text-xs font-medium rounded-full">
                      {t(`categories.${product.category}` as any)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-navy mb-2">
                    {t(`items.${product.slug}.name` as any)}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {t(`items.${product.slug}.description` as any)}
                  </p>
                  <Link
                    href={`/${locale}/products/${product.slug}`}
                    className="inline-flex items-center gap-1 text-navy font-medium text-sm hover:text-gold transition-colors"
                  >
                    {t('viewDetail')}
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
