import type { MetadataRoute } from 'next'
import { getCatalog } from '@/lib/products/catalog-db'
import { createClient } from '@/lib/supabase/server'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hsurethane.com').replace(/\/$/, '')

type Entry = MetadataRoute.Sitemap[number]

function entry(
  path: string,
  opts: { lastModified?: Date; priority?: number; changeFrequency?: Entry['changeFrequency'] } = {},
): Entry {
  return {
    url: `${siteUrl}/ko${path}`,
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency ?? 'weekly',
    priority: opts.priority ?? 0.7,
    alternates: {
      languages: {
        ko: `${siteUrl}/ko${path}`,
        en: `${siteUrl}/en${path}`,
      },
    },
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: Entry[] = [
    entry('', { priority: 1, changeFrequency: 'daily' }),
    entry('/about', { priority: 0.8 }),
    entry('/about/history', { priority: 0.6 }),
    entry('/about/track-record', { priority: 0.6 }),
    entry('/products', { priority: 0.9 }),
    entry('/resources', { priority: 0.6 }),
    entry('/notice', { priority: 0.6 }),
    entry('/privacy', { priority: 0.3, changeFrequency: 'yearly' }),
    entry('/terms', { priority: 0.3, changeFrequency: 'yearly' }),
  ]

  const dynamicEntries: Entry[] = []

  try {
    const { catalog } = await getCatalog()
    const categories = Array.from(new Set(catalog.map((p) => p.category)))
    for (const c of categories) {
      dynamicEntries.push(entry(`/products/category/${c}`, { priority: 0.8 }))
    }
    for (const p of catalog) {
      dynamicEntries.push(entry(`/products/${p.slug}`, { priority: 0.7 }))
    }
  } catch (err) {
    console.error('[sitemap] product fetch failed:', err)
  }

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('notices')
      .select('id, created_at')
      .eq('is_active', true)
    for (const n of data ?? []) {
      dynamicEntries.push(
        entry(`/notice/${n.id}`, {
          priority: 0.5,
          lastModified: n.created_at ? new Date(n.created_at) : undefined,
        }),
      )
    }
  } catch (err) {
    console.error('[sitemap] notice fetch failed:', err)
  }

  return [...staticEntries, ...dynamicEntries]
}
