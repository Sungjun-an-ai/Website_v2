import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import ProductDetailScroller from '@/components/products/ProductDetailScroller'
import { getProductBySlug, productCatalog } from '@/lib/products/catalog'

export function generateStaticParams() {
  return productCatalog.map((item) => ({ slug: item.slug }))
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const isKo = locale === 'ko'
  const product = getProductBySlug(slug)
  if (!product) notFound()

  return (
    <ProductDetailScroller locale={locale} isKo={isKo} product={product} />
  )
}
