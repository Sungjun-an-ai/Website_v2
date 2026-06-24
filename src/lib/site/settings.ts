import { createClient } from '@/lib/supabase/server'

export type ContactInfo = {
  address: string
  phone: string
  fax: string
  email: string
  hours: string
}

export type TrackStat = { value: string; label_ko: string; label_en: string }

export type ChatSlide = {
  customer: string
  hansung: string
  image: string
  name: string
  tag: string
  cta: string
  href: string
}

const defaultStats: TrackStat[] = [
  { value: '500+', label_ko: '납품 거래처', label_en: 'Clients' },
  { value: '1,000+', label_ko: '완료 프로젝트', label_en: 'Completed Projects' },
  { value: '30+', label_ko: '진행 중인 현장', label_en: 'Active Sites' },
  { value: '36+', label_ko: '년의 실적', label_en: 'Years of Record' },
]

export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('site_settings').select('key, value')
    const map: Record<string, string> = {}
    for (const row of data ?? []) map[row.key] = row.value
    return map
  } catch {
    return {}
  }
}

export function contactFromSettings(
  settings: Record<string, string>,
  isKo: boolean
): ContactInfo | null {
  const address = isKo ? settings.contact_address_ko : settings.contact_address_en
  const phone = isKo ? settings.contact_phone : settings.contact_phone_en || settings.contact_phone
  const fax = isKo ? settings.contact_fax : settings.contact_fax_en || settings.contact_fax
  const email = settings.contact_email
  const hours = isKo ? settings.contact_hours_ko : settings.contact_hours_en
  if (!address && !phone && !email) return null
  return {
    address: address ?? '',
    phone: phone ?? '',
    fax: fax ?? '',
    email: email ?? '',
    hours: hours ?? '',
  }
}

export async function getContactInfo(isKo: boolean): Promise<ContactInfo | null> {
  const settings = await getSiteSettings()
  return contactFromSettings(settings, isKo)
}

export function statsFromSettings(settings: Record<string, string>): TrackStat[] {
  const raw = settings.track_record_stats
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as TrackStat[]
    } catch {
      // ignore parse errors, use default
    }
  }
  return defaultStats
}

export async function getChatSlides(locale: string): Promise<ChatSlide[] | null> {
  const isKo = locale === 'ko'
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('is_active', true)
      .order('order_index')
    if (!data || data.length === 0) return null
    return data.map((m) => {
      const href = (m.href as string) || '#'
      return {
        customer: isKo ? m.customer_ko : m.customer_en || m.customer_ko,
        hansung: isKo ? m.hansung_ko : m.hansung_en || m.hansung_ko,
        image: m.image_url || '',
        name: isKo ? m.name_ko : m.name_en || m.name_ko,
        tag: isKo ? m.tag_ko : m.tag_en || m.tag_ko,
        cta: isKo ? m.cta_ko : m.cta_en || m.cta_ko,
        href: `/${locale}${href}`,
      }
    })
  } catch {
    return null
  }
}

export type HeroSlideRow = {
  id: string
  title_ko: string
  title_en: string
  subtitle_ko: string
  subtitle_en: string
  image_url: string
  cta_text_ko: string
  cta_text_en: string
  cta_href: string
  order_index: number
  is_active: boolean
}

export type HeroStatRow = {
  id: string
  label_ko: string
  label_en: string
  value: string
  suffix: string
  order_index: number
  is_active: boolean
}

export async function getHeroSlides(): Promise<HeroSlideRow[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('order_index')
    return (data as HeroSlideRow[]) || []
  } catch {
    return []
  }
}

export async function getHeroStats(): Promise<HeroStatRow[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('stats')
      .select('*')
      .eq('is_active', true)
      .order('order_index')
    return (data as HeroStatRow[]) || []
  } catch {
    return []
  }
}
