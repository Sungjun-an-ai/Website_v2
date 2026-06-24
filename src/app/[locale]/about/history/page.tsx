import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import HistoryHero from '@/components/about/HistoryHero'
import { getPageHero, resolvePageHero } from '@/lib/site/page-hero'

const fallbackHistoryEvents = [
  { year: 1991, month: 3, event_ko: '한성우레탄 설립', event_en: 'Founded Hansung Urethane' },
  { year: 1993, month: 11, event_ko: '일액형 우레탄접착제(하나로) 개발', event_en: 'Developed one-component urethane adhesive (Hanaro)' },
  { year: 1995, month: 6, event_ko: '연질지수제 HS-1000, HS-2000 개발', event_en: 'Developed soft-type waterstop sealants HS-1000, HS-2000' },
  { year: 1995, month: 12, event_ko: '무발포 연질형 우레탄 접착제 개발', event_en: 'Developed non-foaming soft-type urethane adhesive' },
  { year: 1998, month: 2, event_ko: '한성우레탄 사업장 이전(파주시 광탄면 분수리)', event_en: 'Relocated business to Bunsu-ri, Gwangtan-myeon, Paju' },
  { year: 2000, month: 10, event_ko: '한성우레탄㈜ 법인 변경', event_en: 'Incorporated as Hansung Urethane Co., Ltd.' },
  { year: 2004, month: 7, event_ko: '방화문 접착제 친환경 건축자재 인증서 획득', event_en: 'Obtained eco-friendly building material certification for fire-door adhesive' },
  { year: 2005, month: 2, event_ko: '경질지수제 WS-4000, WS-5000 개발', event_en: 'Developed rigid-type waterstop sealants WS-4000, WS-5000' },
  { year: 2005, month: 11, event_ko: '속건용 일액형 우레탄접착제 개발', event_en: 'Developed fast-curing one-component urethane adhesive' },
  { year: 2006, month: 6, event_ko: '실내도어용 일액형 우레탄접착제 개발', event_en: 'Developed one-component urethane adhesive for interior doors' },
  { year: 2007, month: 3, event_ko: '고강도 이액형 지수제 개발', event_en: 'Developed high-strength two-component waterstop sealant' },
  { year: 2007, month: 3, event_ko: 'WS-3000 이액형 지수제 개발', event_en: 'Developed WS-3000 two-component waterstop sealant' },
  { year: 2009, month: 4, event_ko: '이액형 고강도 접착제(AD-700) 개발', event_en: 'Developed two-component high-strength adhesive (AD-700)' },
  { year: 2010, month: 5, event_ko: '고탄성 우레탄접착제(ANP-S) 개발', event_en: 'Developed high-elasticity urethane adhesive (ANP-S)' },
  { year: 2013, month: 7, event_ko: '실내도어 이액형 우레탄접착제 개발', event_en: 'Developed two-component urethane adhesive for interior doors' },
  { year: 2013, month: 12, event_ko: '실내도어 속건형 우레탄접착제 개발', event_en: 'Developed fast-curing urethane adhesive for interior doors' },
  { year: 2014, month: 9, event_ko: '준불연 이액형 우레탄접착제(NF-A) 개발', event_en: 'Developed semi-noncombustible two-component urethane adhesive (NF-A)' },
  { year: 2014, month: 10, event_ko: '폴리에틸렌글리콜 중합수지를 이용한 하니콤보드 특허 출원', event_en: 'Filed patent for honeycomb board using polyethylene glycol polymer resin' },
  { year: 2015, month: 8, event_ko: '일액형 난연 우레탄접착제(NFLV-D) 개발', event_en: 'Developed one-component flame-retardant urethane adhesive (NFLV-D)' },
  { year: 2015, month: 8, event_ko: '제2공장 신축 및 생산시설 확장', event_en: 'Built second plant and expanded production facilities' },
  { year: 2016, month: 1, event_ko: '2015년 중소기업경영대상 우레탄접착제 부문 수상', event_en: 'Won 2015 SME Management Award (Urethane Adhesive category)' },
  { year: 2016, month: 12, event_ko: '일액형 준불연 우레탄접착제(NFLV-V) 개발', event_en: 'Developed one-component semi-noncombustible urethane adhesive (NFLV-V)' },
  { year: 2017, month: 2, event_ko: '일액형 준불연 우레탄접착제(NFLV-V) 시험인증 획득', event_en: 'Obtained test certification for one-component semi-noncombustible adhesive (NFLV-V)' },
  { year: 2018, month: 2, event_ko: '준불연 우레탄접착제(NFLV-V) 친환경 건축자재 인증서 획득', event_en: 'Obtained eco-friendly building material certification for semi-noncombustible adhesive (NFLV-V)' },
  { year: 2019, month: 1, event_ko: 'NFVL-V 준불연 접착제 시험인증 획득', event_en: 'Obtained test certification for NFVL-V semi-noncombustible adhesive' },
  { year: 2019, month: 1, event_ko: 'NFVL-D 난연 접착제 시험인증 획득', event_en: 'Obtained test certification for NFVL-D flame-retardant adhesive' },
  { year: 2021, month: 4, event_ko: '국토교통과학기술진흥원(KAIA) 지원 연구개발 과제 내진 보강시스템 / 경상국립대학교 산학협력단 MOU 체결', event_en: 'KAIA-funded R&D project on seismic reinforcement system / Signed MOU with Gyeongsang National University Industry-Academic Cooperation Foundation' },
  { year: 2021, month: 7, event_ko: 'NF505 친환경 준불연 접착제 시험인증 획득', event_en: 'Obtained test certification for NF505 eco-friendly semi-noncombustible adhesive' },
  { year: 2021, month: 11, event_ko: 'NFVL 친환경 준불연 접착제 시험인증 획득', event_en: 'Obtained test certification for NFVL eco-friendly semi-noncombustible adhesive' },
  { year: 2021, month: 11, event_ko: 'NFVL-V 비규제 준불연 접착제 시험인증 획득', event_en: 'Obtained test certification for NFVL-V non-regulated semi-noncombustible adhesive' },
  { year: 2022, month: 1, event_ko: '실내도어 비규제 우레탄접착제 시험인증 획득', event_en: 'Obtained test certification for non-regulated urethane adhesive for interior doors' },
  { year: 2022, month: 3, event_ko: 'NFVL 친환경 건축자재 인증서 획득(한국공기청정협회)', event_en: 'Obtained eco-friendly building material certification for NFVL (Korea Air Cleaning Association)' },
  { year: 2022, month: 3, event_ko: 'NF-505(HYBRID 무기접착제) 친환경 건축자재 인증서 획득(한국공기청정협회)', event_en: 'Obtained eco-friendly building material certification for NF-505 (HYBRID inorganic adhesive) (Korea Air Cleaning Association)' },
  { year: 2025, month: 4, event_ko: 'NFVL 친환경 건축자재 단체표준 인증서 획득(한국공기청정협회)', event_en: 'Obtained group-standard eco-friendly building material certification for NFVL (Korea Air Cleaning Association)' },
  { year: 2025, month: 12, event_ko: '화학물질 저장소 증설', event_en: 'Expanded chemical storage facility' },
  { year: 2026, month: 2, event_ko: 'HS-3000 급결지수제 개발', event_en: 'Developed HS-3000 rapid-setting waterstop sealant' },
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
      .order('year', { ascending: true })
      .order('order_index')
    if (data && data.length > 0) {
      historyEvents = data
    }
  } catch (err) {
    console.error('History items fetch error:', err)
    // Use fallback data
  }

  const hero = resolvePageHero(await getPageHero('history'), isKo)
  const title = hero.title || t('title')

  return (
    <HistoryHero
      events={historyEvents}
      isKo={isKo}
      title={title}
      subtitle={hero.subtitle}
      mediaUrl={hero.mediaUrl}
    />
  )
}
