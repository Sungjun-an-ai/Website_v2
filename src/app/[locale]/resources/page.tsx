import ResourcesHero from '@/components/resources/ResourcesHero'
import { createClient } from '@/lib/supabase/server'
import type { Resource } from '@/data/resources'
import { getPageHero, resolvePageHero } from '@/lib/site/page-hero'

export const dynamic = 'force-dynamic'

export default async function ResourcesPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isKo = locale === 'ko'
  let resources: Resource[] = []
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('resources')
      .select('*')
    if (error) {
      throw error
    }

    if (data) {
      const visibleRows = data.filter((r: any) => r.is_active !== false)

      const sortedRows = [...visibleRows].sort((a: any, b: any) => {
        const aOrder = typeof a.order_index === 'number' ? a.order_index : Number.MAX_SAFE_INTEGER
        const bOrder = typeof b.order_index === 'number' ? b.order_index : Number.MAX_SAFE_INTEGER
        if (aOrder !== bOrder) return aOrder - bOrder
        return 0
      })

      resources = sortedRows.map((r: any) => ({
        id: r.id,
        category: r.category,
        group: r.group_key,
        product: r.product || '',
        name_ko: r.title_ko,
        name_en: r.title_en,
        format: r.file_type,
        size: r.file_size || 0,
        file_url: r.file_url || '',
      })) as Resource[]
    }
  } catch (err) {
    console.error('Resources fetch error:', err)
  }

  const hero = resolvePageHero(await getPageHero('resources'), isKo)

  return (
    <ResourcesHero
      resources={resources}
      title={hero.title}
      subtitle={hero.subtitle}
      mediaUrl={hero.mediaUrl}
    />
  )
}
