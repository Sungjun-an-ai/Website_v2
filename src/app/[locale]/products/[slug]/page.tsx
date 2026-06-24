import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import ProductDetailScroller from '@/components/products/ProductDetailScroller'
import { getCatalog } from '@/lib/products/catalog-db'

export const dynamic = 'force-dynamic'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const isKo = locale === 'ko'
  const { catalog, categoryLabels, heroVisuals } = await getCatalog()
  const product = catalog.find((item) => item.slug === slug)
  if (!product) notFound()

  return (
    <ProductDetailScroller
      locale={locale}
      isKo={isKo}
      product={product}
      catalog={catalog}
      categoryLabels={categoryLabels}
      heroVisuals={heroVisuals}
    />
  )
}
