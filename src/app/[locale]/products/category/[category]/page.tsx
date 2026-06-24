import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import ProductListByCategory from '@/components/products/ProductListByCategory'
import { getCatalog } from '@/lib/products/catalog-db'

export const dynamic = 'force-dynamic'

export default async function ProductCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>
}) {
  const { locale, category } = await params
  setRequestLocale(locale)

  const isKo = locale === 'ko'
  const { catalog, categoryLabels, heroVisuals } = await getCatalog()
  const products = catalog.filter((item) => item.category === category)
  if (products.length === 0) notFound()

  const label = categoryLabels[category] ?? { ko: category, en: category }

  return (
    <ProductListByCategory
      locale={locale}
      isKo={isKo}
      categoryId={category}
      categoryLabel={label}
      products={products}
      heroVisual={heroVisuals[category]}
    />
  )
}
