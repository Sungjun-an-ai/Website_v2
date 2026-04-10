import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'

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

  const grouped = historyEvents.reduce((acc, item) => {
    const decade = Math.floor(item.year / 10) * 10
    if (!acc[decade]) acc[decade] = []
    acc[decade].push(item)
    return acc
  }, {} as Record<number, HistoryEvent[]>)

  const decades = Object.keys(grouped).map(Number).sort((a, b) => b - a)

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">History</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('title')}</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {decades.map(decade => (
          <div key={decade} className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-3xl font-bold text-navy">{decade}s</div>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="relative pl-8 border-l-2 border-navy/20 space-y-6">
              {grouped[decade]
                .sort((a, b) => b.year - a.year)
                .map((item) => (
                  <div key={`${item.year}-${item.event_ko}`} className="relative">
                    <div className="absolute -left-10 w-4 h-4 rounded-full bg-gold border-2 border-white shadow" />
                    <div className="flex items-start gap-4">
                      <div className="text-2xl font-bold text-navy w-16 flex-shrink-0">{item.year}</div>
                      <div className="flex-1 pt-1">
                        <p className="text-gray-700 leading-relaxed">
                          {isKo ? item.event_ko : item.event_en}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
