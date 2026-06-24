import { setRequestLocale } from 'next-intl/server'
import CategoryOverview from '@/components/products/CategoryOverview'
import { getCategoryPanels } from '@/lib/products/catalog-db'

export const dynamic = 'force-dynamic'

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const panels = await getCategoryPanels()

  return <CategoryOverview panels={panels} />
}
