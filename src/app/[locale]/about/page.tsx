import { setRequestLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import AboutSections from '@/components/about/AboutSections'

const sections = [
  {
    mainTitle: 'Technology',
    subtitle: '우레탄 하나만 36년,\n그래서 깊습니다.',
    image: '/about/An_extreme_macro_close-up_of_u_Nano_Banana_Pro_81286.png',
    body: `한성우레탄은 창업 이래 우레탄 접착제·지수제 단일 분야에만 집중해왔습니다.

여러 제품을 동시에 다루는 종합 화학사와 달리, 한 분야의 전문성을 극한까지 높여,
우레탄에 쌓인 노하우로 고객의 문제를 해결하는 방향을 선택했습니다.

국내 최초 일액형 지수제 생산부터, 지속적인 우레탄 제품의 혁신까지,
한성우레탄 36년의 역사가 기술력을 말해줍니다.

또한 원료 배합부터 생산·품질 검사까지 전 공정을 모두 자체 관리 및 생산하며,
시장 변화에 대응하는 지속적인 R&D를 통해 제품 경쟁력을 강화하고 있습니다.

✔️ 우레탄 36년 단일 분야 집중
✔️ 전 공정 자체 관리로 로트 간 품질 편차 최소화
✔️ 친환경·난연·준불연 접착제로 제품군 지속 확대`,
  },
  {
    mainTitle: 'Trust',
    subtitle: '탄탄한 기술력과 재무구조,\n신뢰는 우리의 자산입니다.',
    image: '/about/A_photorealistic_hero_image_se_Nano_Banana_Pro_42629.png',
    body: `36년간 지하철, 터널, 공항, 아파트, 발전소 현장까지. 고객이 어디에 있든, 얼마나 크든,
규모와 난이도에 관계없이 한성우레탄은 고객과의 약속을 철저히 지켜왔습니다.
엄격한 공정 관리와 유연한 대응 체계를 바탕으로, 대내외적 상황 변화에도 안정적인 공급을 유지합니다.

부채비율 0%, 무차입 경영, 규모보다는 내실을 다지는 회사 운영을 통해
수많은 위기와 파동을 넘어 시장에서 가장 안정적인 회사로 인정 받아왔습니다.
안정적인 재무구조에 기반한 원재료 바잉파워를 통해 안정적 수급구조를 구축,
누구보다 신뢰할 수 있는 공급사로 자리매김 했습니다.

✔️ 36년의 안정적 납품 실적 — 지하철·터널·공항·발전소 등 대형 현장 포함
✔️ 공정 관리 기반 납기 준수 및 안정적 공급
✔️ 탄탄한 재무구조를 바탕으로 한 안정적 원재료 수급 및 제품 공급`,
  },
  {
    mainTitle: 'Chemical Solution',
    subtitle: '고객사의 문제가 우리의 문제입니다.',
    image: '/about/A_photorealistic_hero_image_on_Nano_Banana_2_74206.png',
    body: `한성우레탄은 제품을 공급하는 것에서 멈추지 않습니다.
고객의 문제가 우리의 문제라는 마음으로, 문제가 해결되는 것까지가 한성우레탄은 함께합니다.

케미컬 솔루션과 테크니컬 솔루션을 통합 제공하며, 맞춤형 연구개발 과 함께, 기술영업 전문가가 납품 이후에도 고객사와 함께합니다.

✔️ 현장 용도별 최적 제품 설계 및 케미컬 솔루션 제안
✔️ 지속적인 맞춤형 연구개발을 통한 솔루션 설계
✔️ 기술영업 통합 관리 — 납품 후에도 지속 동행`,
  },
  {
    mainTitle: 'Vision',
    subtitle: '소재의 한계를 넘어, 더 나은 세상을 연결합니다.',
    image: '/about/A_wide_panoramic_photorealisti_Nano_Banana_2_72262.png',
    body: `1991년 창업 이래, 한성우레탄은 단순히 제품을 공급하는 것이 아닌
고객의 현장에서 실질적인 변화를 만드는 케미컬 솔루션 파트너였습니다.

고객이 보관하기 쉽고, 작업자가 쾌적하게 시공할 수 있도록,
그리고 우리의 가장 궁극적인 파트너인 환경에 부담이 가지 않도록
지속적인 연구개발을 통해 우레탄의 가치를 높이며,
우리는 오늘도 고객과 함께 더 나은 내일을 만들어갑니다.`,
  },
]

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const supabase = await createClient()
  await supabase
    .from('about_sections')
    .select('*')
    .order('order_index')

  return <AboutSections sections={sections} />
}

