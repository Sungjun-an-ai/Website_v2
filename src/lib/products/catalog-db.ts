import { createClient } from '@/lib/supabase/server'
import {
  productCatalog as fallbackCatalog,
  productCategoryLabels as fallbackLabels,
  ProductCatalogItem,
  ProductSpec,
  ProductResource,
} from './catalog'

export type CategoryPanel = {
  id: string
  media: string
  isVideo: boolean
  titleKo: string
  titleEn: string
  taglineKo: string
  taglineEn: string
  href: string
  placeholder: string
}

const fallbackHeroVisuals: Record<string, string> = {
  sealant: '/about/Aerial_timelapse_of_subway_con_Kling_30__16770.mp4',
  'fire-door-adhesive': '/about/Aerial_timelapse_of_Seoul_at_g_Kling_30__41996.mp4',
  'general-adhesive': '/about/Aerial_timelapse_of_Seoul_at_g_Kling_30__41996.mp4',
  'interior-door-adhesive': '/about/Aerial_timelapse_of_subway_con_Kling_30__16770.mp4',
}

const fallbackPanels: CategoryPanel[] = [
  { id: 'sealant', media: fallbackHeroVisuals.sealant, isVideo: true, titleKo: '지수제', titleEn: 'Sealing Agent', taglineKo: '누수 차단의 밀착과 내구성을 동시에', taglineEn: 'Adhesion and durability for total leak blocking', href: '/products/ws-3000', placeholder: 'linear-gradient(135deg, #1A2B6B, #0D1220)' },
  { id: 'fire-door-adhesive', media: '/about/A_photorealistic_hero_image_on_Nano_Banana_2_74206.png', isVideo: false, titleKo: '방화문 접착제', titleEn: 'Fire Door Adhesive', taglineKo: '방화 성능과 강력 접착의 완벽한 균형', taglineEn: 'A perfect balance of fire performance and strong adhesion', href: '/products/nflv-eco', placeholder: 'linear-gradient(135deg, #1E3A5F, #0D1B3E)' },
  { id: 'interior-door-adhesive', media: '/about/Aerial_timelapse_of_Seoul_at_g_Kling_30__41996.mp4', isVideo: true, titleKo: '실내문 접착제', titleEn: 'Interior Door Adhesive', taglineKo: '저VOC · 강한 초기 접착력', taglineEn: 'Low VOC with strong initial adhesion', href: '/products/id', placeholder: 'linear-gradient(135deg, #162D4A, #091525)' },
  { id: 'general-adhesive', media: '/about/An_extreme_macro_close-up_of_u_Nano_Banana_Pro_81286.png', isVideo: false, titleKo: '일반 접착제', titleEn: 'General Adhesive', taglineKo: '다양한 공정에 적용 가능한 범용 우레탄 접착', taglineEn: 'Versatile urethane adhesion for diverse processes', href: '/products/hanaro-p', placeholder: 'linear-gradient(135deg, #243B55, #141E30)' },
  { id: 'urethane-solution', media: '/about/A_photorealistic_hero_image_se_Nano_Banana_Pro_42629.png', isVideo: false, titleKo: '우레탄 솔루션', titleEn: 'Urethane Solution', taglineKo: '제품을 넘어 공정 전체를 함께 설계하는 파트너십', taglineEn: 'A partnership designing your entire process, beyond products', href: '/about', placeholder: 'linear-gradient(135deg, #1A2B6B, #243B55)' },
]

export type Catalog = {
  catalog: ProductCatalogItem[]
  categoryLabels: Record<string, { ko: string; en: string }>
  heroVisuals: Record<string, string>
}

function mapRowToItem(r: Record<string, unknown>): ProductCatalogItem {
  const asArr = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : [])
  return {
    slug: String(r.slug),
    category: String(r.category) as ProductCatalogItem['category'],
    nameKo: String(r.name_ko ?? ''),
    nameEn: String(r.name_en ?? ''),
    tagKo: (r.tag_ko as string) || undefined,
    tagEn: (r.tag_en as string) || undefined,
    subtitleKo: String(r.subtitle_ko ?? ''),
    subtitleEn: String(r.subtitle_en ?? ''),
    descriptionKo: String(r.description_ko ?? ''),
    descriptionEn: String(r.description_en ?? ''),
    featuresKo: asArr(r.features_ko),
    featuresEn: asArr(r.features_en),
    applicationsKo: asArr(r.applications_ko),
    applicationsEn: asArr(r.applications_en),
    specs: (Array.isArray(r.specs) ? (r.specs as ProductSpec[]) : []),
    resources: (Array.isArray(r.related_resources) ? (r.related_resources as ProductResource[]) : []),
  }
}

export async function getCatalog(): Promise<Catalog> {
  try {
    const supabase = await createClient()
    const [{ data: products }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*').eq('is_active', true).order('order_index'),
      supabase.from('product_categories').select('*').eq('is_active', true).order('order_index'),
    ])

    const catalog = products && products.length > 0 ? products.map(mapRowToItem) : fallbackCatalog
    const categoryLabels: Record<string, { ko: string; en: string }> = { ...fallbackLabels }
    const heroVisuals: Record<string, string> = { ...fallbackHeroVisuals }
    if (cats) {
      for (const c of cats) {
        categoryLabels[c.slug] = { ko: c.name_ko || '', en: c.name_en || c.name_ko || '' }
        if (c.hero_image_url) heroVisuals[c.slug] = c.hero_image_url
      }
    }
    return { catalog, categoryLabels, heroVisuals }
  } catch {
    return { catalog: fallbackCatalog, categoryLabels: fallbackLabels, heroVisuals: fallbackHeroVisuals }
  }
}

export async function getCategoryPanels(): Promise<CategoryPanel[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('product_categories')
      .select('*')
      .eq('is_active', true)
      .order('order_index')
    if (!data || data.length === 0) return fallbackPanels
    return data.map((c) => ({
      id: c.slug,
      media: c.hero_image_url || '',
      isVideo: c.hero_image_url ? c.hero_image_url.endsWith('.mp4') : !!c.is_video,
      titleKo: c.name_ko || '',
      titleEn: c.name_en || c.name_ko || '',
      taglineKo: c.subtitle_ko || '',
      taglineEn: c.subtitle_en || c.subtitle_ko || '',
      href: c.href || '#',
      placeholder: c.placeholder || 'linear-gradient(135deg, #1A2B6B, #0D1220)',
    }))
  } catch {
    return fallbackPanels
  }
}
