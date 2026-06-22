import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import HistoryHero from '@/components/about/HistoryHero'

const fallbackHistoryEvents = [
  { year: 1988, month: null, event_ko: '한성우레탄 창업', event_en: 'Founded Hansung Urethane' },
  { year: 1992, month: null, event_ko: 'KS 인증 획득 (우레탄 접착제)', event_en: 'KS Certification (Urethane Adhesive)' },
  { year: 1996, month: null, event_ko: '경기 파주 공장 이전 및 생산 시설 확충', event_en: 'Relocated to Paju factory, expanded production facilities' },
  { year: 2000, month: null, event_ko: 'ISO 9001 품질경영시스템 인증', event_en: 'ISO 9001 Quality Management System Certification' },
  { year: 2003, month: null, event_ko: '우레탄 지수제 제품 라인 신규 출시', event_en: 'Launched new urethane sealant product line' },
  { year: 2006, month: null, event_ko: '벤처기업 인증', event_en: 'Venture Company Certification' },
  { year: 2010, month: null, event_ko: '이노비즈 기업 인증 / 연간 매출 50억 달성', event_en: 'Innobiz Certification / Annual revenue of 5 billion KRW' },
  { year: 2013, month: null, event_ko: '우레탄 방수제 특허 취득 (제10-1234567호)', event_en: 'Urethane Waterproofing Patent (No. 10-1234567)' },
  { year: 2016, month: null, event_ko: '수출 개시 (동남아시아 지역)', event_en: 'Started exports (Southeast Asia)' },
  { year: 2018, month: null, event_ko: '창립 30주년 / 생산라인 자동화 완료', event_en: '30th Anniversary / Production line automation completed' },
  { year: 2020, month: null, event_ko: '친환경 저VOC 제품 라인 개발', event_en: 'Developed eco-friendly low-VOC product line' },
  { year: 2022, month: null, event_ko: 'R&D 센터 설립 / 기업부설연구소 등록', event_en: 'Established R&D Center / Corporate research institute registration' },
  { year: 2024, month: null, event_ko: '창립 36주년 / 제2 공장 증설 계획 수립', event_en: '36th Anniversary / Second factory expansion plan' },
]

type HistoryEvent = {
  year: number
  month: number | null
  event_ko: string
  event_en: string
}

export default async function HistoryPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'history' })
  const isKo = locale === 'ko'

  let historyEvents: HistoryEvent[] = fallbackHistoryEvents

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('history_items')
      .select('year, month, event_ko, event_en')
      .order('year', { ascending: false })
      .order('order_index')
    if (data && data.length > 0) {
      historyEvents = data
    }
  } catch (err) {
    console.error('History items fetch error:', err)
    // Use fallback data
  }

  const title = t('title')

  return (
    <HistoryHero events={historyEvents} isKo={isKo} title={title} />
  )
}
