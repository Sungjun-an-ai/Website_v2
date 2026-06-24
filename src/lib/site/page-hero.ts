import { createClient } from '@/lib/supabase/server'

export type PageHeroSection = 'history' | 'track_record' | 'notice' | 'resources'

export type PageHero = {
  titleKo: string
  titleEn: string
  subtitleKo: string
  subtitleEn: string
  imageUrl: string
}

const emptyHero: PageHero = {
  titleKo: '',
  titleEn: '',
  subtitleKo: '',
  subtitleEn: '',
  imageUrl: '',
}

export function pageHeroKeys(section: PageHeroSection) {
  return {
    titleKo: `${section}_hero_title_ko`,
    titleEn: `${section}_hero_title_en`,
    subtitleKo: `${section}_hero_subtitle_ko`,
    subtitleEn: `${section}_hero_subtitle_en`,
    imageUrl: `${section}_hero_image_url`,
  } as const
}

export async function getPageHero(section: PageHeroSection): Promise<PageHero> {
  const keys = pageHeroKeys(section)
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', Object.values(keys))
    const map: Record<string, string> = {}
    for (const row of data ?? []) map[row.key] = row.value
    return {
      titleKo: map[keys.titleKo] ?? '',
      titleEn: map[keys.titleEn] ?? '',
      subtitleKo: map[keys.subtitleKo] ?? '',
      subtitleEn: map[keys.subtitleEn] ?? '',
      imageUrl: map[keys.imageUrl] ?? '',
    }
  } catch (err) {
    console.error(`Page hero fetch error (${section}):`, err)
    return emptyHero
  }
}

/** Resolve a page hero to the active locale, returning empty strings when unset. */
export function resolvePageHero(hero: PageHero, isKo: boolean) {
  return {
    title: isKo ? hero.titleKo : hero.titleEn,
    subtitle: isKo ? hero.subtitleKo : hero.subtitleEn,
    mediaUrl: hero.imageUrl,
  }
}
