import { setRequestLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import TrackRecordHero from '@/components/track-record/TrackRecordHero'
import { getSiteSettings, statsFromSettings } from '@/lib/site/settings'

type TrackRecord = {
  id?: string | number
  year?: number
  client_name_ko: string
  client_name_en: string
  project_ko: string
  project_en: string
  category: string
}

const fallbackTrackRecords: TrackRecord[] = [
  { id: 1, client_name_ko: '원선케미칼', client_name_en: '원선케미칼', project_ko: '부산 지하철 누수보수 공사', project_en: '부산 지하철 누수보수 공사', category: 'sealant' },
  { id: 2, client_name_ko: '우창방수기업㈜', client_name_en: '우창방수기업㈜', project_ko: '대구지하철 1호선 10개 공구 누수보수 공사', project_en: '대구지하철 1호선 10개 공구 누수보수 공사', category: 'sealant' },
  { id: 3, client_name_ko: '대림산업㈜', client_name_en: '대림산업㈜', project_ko: '서울지하철 7-25공구(광명역)누수 보수공사', project_en: '서울지하철 7-25공구(광명역)누수 보수공사', category: 'sealant' },
  { id: 4, client_name_ko: '한일건설㈜', client_name_en: '한일건설㈜', project_ko: '서울지하철 6-19 공구(고속터미널역)누수 공사', project_en: '서울지하철 6-19 공구(고속터미널역)누수 공사', category: 'sealant' },
  { id: 5, client_name_ko: '㈜동아지질', client_name_en: '㈜동아지질', project_ko: '인천 LNG기지 누수보수 공사', project_en: '인천 LNG기지 누수보수 공사', category: 'sealant' },
  { id: 6, client_name_ko: '현대산업개발㈜', client_name_en: '현대산업개발㈜', project_ko: '분당선지하철 6공구 누수보수 공사', project_en: '분당선지하철 6공구 누수보수 공사', category: 'sealant' },
]

export default async function TrackRecordPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isKo = locale === 'ko'

  let trackRecords: TrackRecord[] = fallbackTrackRecords

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('track_records')
      .select('id, year, client_name_ko, client_name_en, project_ko, project_en, category')
      .order('order_index', { ascending: true })
    if (data && data.length > 0) {
      trackRecords = data
    }
  } catch (err) {
    console.error('Track records fetch error:', err)
    // Use fallback data
  }

  const settings = await getSiteSettings()
  const stats = statsFromSettings(settings).map((s) => ({
    value: s.value,
    label: isKo ? s.label_ko : s.label_en,
  }))

  return (
    <TrackRecordHero stats={stats} records={trackRecords} isKo={isKo} />
  )
}

