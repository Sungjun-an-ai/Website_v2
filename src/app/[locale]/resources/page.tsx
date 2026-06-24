import ResourcesHero from '@/components/resources/ResourcesHero'
import { createClient } from '@/lib/supabase/server'
import { resources as fallbackResources, type Resource } from '@/data/resources'
import { getPageHero, resolvePageHero } from '@/lib/site/page-hero'

export const dynamic = 'force-dynamic'

export default async function ResourcesPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isKo = locale === 'ko'
  let resources: Resource[] = fallbackResources
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('resources')
      .select('*')
      .eq('is_active', true)
      .order('order_index')
    if (data && data.length > 0) {
      resources = data.map((r) => ({
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
