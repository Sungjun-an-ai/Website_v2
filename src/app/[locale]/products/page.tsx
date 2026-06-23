import { redirect } from 'next/navigation'
import { getCatalog } from '@/lib/products/catalog-db'

export const dynamic = 'force-dynamic'

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { catalog } = await getCatalog()
  const first = catalog[0]?.slug ?? 'ws-3000'
  redirect(`/${locale}/products/${first}`)
}
