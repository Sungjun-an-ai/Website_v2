import { setRequestLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import TrackRecordHero from '@/components/track-record/TrackRecordHero'
import { getSiteSettings, statsFromSettings } from '@/lib/site/settings'

type TrackRecord = {
  id?: string | number
  year: number
  client_name_ko: string
  client_name_en: string
  project_ko: string
  project_en: string
  category: string
}

const fallbackTrackRecords: TrackRecord[] = [
  { id: 1, year: 2024, client_name_ko: '현대건설', client_name_en: 'Hyundai Construction', project_ko: '고덕 신도시 아파트 단지 방수 공사', project_en: 'Godeok New Town Apartment Complex Waterproofing', category: 'construction' },
  { id: 2, year: 2024, client_name_ko: '삼성물산', client_name_en: 'Samsung C&T', project_ko: '송도 복합단지 지하 주차장 지수 처리', project_en: 'Songdo Complex Underground Parking Sealant Treatment', category: 'construction' },
  { id: 3, year: 2023, client_name_ko: '대우건설', client_name_en: 'Daewoo E&C', project_ko: '인천 터널 보수 프로젝트', project_en: 'Incheon Tunnel Repair Project', category: 'civil' },
  { id: 4, year: 2023, client_name_ko: 'LH 한국토지주택공사', client_name_en: 'Korea Land & Housing Corporation', project_ko: '공공 임대 아파트 방수 보수', project_en: 'Public Rental Apartment Waterproofing Repair', category: 'construction' },
  { id: 5, year: 2023, client_name_ko: '한국철도공사', client_name_en: 'KORAIL', project_ko: '철도 터널 균열 보수 및 지수', project_en: 'Railway Tunnel Crack Repair and Sealing', category: 'civil' },
  { id: 6, year: 2022, client_name_ko: '서울시 도시기반시설본부', client_name_en: 'Seoul Urban Infrastructure Headquarters', project_ko: '도심 지하도 방수 보수 공사', project_en: 'Urban Underground Tunnel Waterproofing Repair', category: 'civil' },
  { id: 7, year: 2022, client_name_ko: 'GS건설', client_name_en: 'GS Engineering & Construction', project_ko: '자이 아파트 단지 외벽 실링', project_en: 'Xi Apartment Complex Exterior Wall Sealing', category: 'construction' },
  { id: 8, year: 2021, client_name_ko: '포스코건설', client_name_en: 'POSCO E&C', project_ko: '더샵 아파트 지하 구조물 방수', project_en: 'THE SHARP Apartment Underground Structure Waterproofing', category: 'construction' },
  { id: 9, year: 2021, client_name_ko: '현대엔지니어링', client_name_en: 'Hyundai Engineering', project_ko: '플랜트 산업 설비 접착 시공', project_en: 'Plant Industrial Equipment Adhesive Construction', category: 'industrial' },
  { id: 10, year: 2020, client_name_ko: '케이워터', client_name_en: 'K-water', project_ko: '댐 균열 보수 및 지수 처리', project_en: 'Dam Crack Repair and Sealing Treatment', category: 'civil' },
  { id: 11, year: 2020, client_name_ko: '서울주택도시공사', client_name_en: 'Seoul Housing and Communities Corporation', project_ko: '공공주택 옥상 방수 공사', project_en: 'Public Housing Rooftop Waterproofing', category: 'construction' },
  { id: 12, year: 2019, client_name_ko: '현대자동차 남양연구소', client_name_en: 'Hyundai Motor Namyang R&D Center', project_ko: '자동차 부품 접합용 우레탄 공급', project_en: 'Urethane Supply for Automotive Part Bonding', category: 'industrial' },
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
      .order('year', { ascending: false })
      .order('order_index')
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

