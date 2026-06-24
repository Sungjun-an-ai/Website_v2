export type ProductCategory =
  | 'sealant'
  | 'fire-door-adhesive'
  | 'general-adhesive'
  | 'interior-door-adhesive'

export interface ProductSpec {
  item: string
  method: string
  result: string
}

export interface ProductResource {
  labelKo: string
  labelEn: string
  href: string
}

export interface ProductCatalogItem {
  slug: string
  category: ProductCategory
  nameKo: string
  nameEn: string
  tagKo?: string
  tagEn?: string
  subtitleKo: string
  subtitleEn: string
  descriptionKo: string
  descriptionEn: string
  featuresKo: string[]
  featuresEn: string[]
  applicationsKo: string[]
  applicationsEn: string[]
  specs: ProductSpec[]
  resources: ProductResource[]
  heroImage?: string
}

export const productCategoryLabels: Record<ProductCategory, { ko: string; en: string }> = {
  sealant: { ko: '지수제', en: 'Water-stop Agent' },
  'fire-door-adhesive': { ko: '방화문 접착제', en: 'Fire Door Adhesive' },
  'general-adhesive': { ko: '일반 접착제', en: 'General Adhesive' },
  'interior-door-adhesive': { ko: '실내도어 접착제', en: 'Interior Door Adhesive' },
}

const commonResources: ProductResource[] = [
  { labelKo: 'MSDS 다운로드', labelEn: 'Download MSDS', href: '/resources' },
  { labelKo: '시험성적서 다운로드', labelEn: 'Download Test Report', href: '/resources' },
]

const makeSpecs = (density: string, viscosity: string, note: string): ProductSpec[] => [
  { item: '고형분 / Solid Content', method: 'ASTM D2369', result: '98% 이상' },
  { item: '점도 / Viscosity', method: 'ASTM D2196', result: viscosity },
  { item: '인장 물성 / Tensile', method: 'ASTM D412', result: '14 MPa 이상' },
  { item: '접착 강도 / Adhesion', method: 'ASTM D3674', result: 'Pass (A, B substrate)' },
  { item: '밀도 / Density', method: 'ASTM D1475', result: density },
  { item: '내수성 / Water Resistance', method: 'ASTM D870', result: note },
]

export const productCatalog: ProductCatalogItem[] = [
  {
    slug: 'ws-3000',
    category: 'sealant',
    nameKo: 'WS-3000',
    nameEn: 'WS-3000 Semi-Rigid Water-stop Agent',
    tagKo: '반경질',
    tagEn: 'Semi-Rigid',
    subtitleKo: '연질의 유연함, 경질의 강인함을 한번에',
    subtitleEn: 'Soft flexibility and rigid strength in one system',
    descriptionKo:
      'WS-3000은 연질 지수제의 탄성·밀착력과 경질 지수제의 구조적 강도를 동시에 구현한 반경질 타입 지수재입니다. 단일 타입 제품으로 대응하기 어려운 복합 환경에서도 안정적인 누수 차단 성능을 발휘합니다.',
    descriptionEn:
      'WS-3000 is a semi-rigid sealing agent combining the elasticity of soft systems and the structural strength of rigid systems, delivering stable leak-blocking performance in complex environments.',
    featuresKo: ['반경질 밸런스 설계', '복합 크랙 대응', '우수한 장기 밀착력', '다양한 현장 적응성'],
    featuresEn: ['Semi-rigid balanced design', 'Complex crack response', 'Long-term adhesion stability', 'High field adaptability'],
    applicationsKo: ['지하 구조물 조인트', '터널 라이닝 크랙', '복합 누수 구간'],
    applicationsEn: ['Underground joints', 'Tunnel lining cracks', 'Mixed leakage zones'],
    specs: makeSpecs('1.12 g/cm3', '1,800 mPa.s', '500h 이상 이상 없음'),
    resources: commonResources,
  },
  {
    slug: 'ws-4000',
    category: 'sealant',
    nameKo: 'WS-4000',
    nameEn: 'WS-4000 Dense Foam Water-stop Agent',
    subtitleKo: '빈틈 없는 조밀함, 신뢰할 수 있는 차단',
    subtitleEn: 'Dense cell structure for precision leak sealing',
    descriptionKo:
      'WS-4000은 발포량을 최소화해 조밀한 폼 구조를 형성하는 지수재입니다. 과도한 팽창 없이 크랙과 공극 내부를 정밀하게 채워 누수 경로를 봉쇄합니다.',
    descriptionEn:
      'WS-4000 minimizes foaming to form a dense foam structure, precisely filling cracks and voids without over-expansion for reliable water path blocking.',
    featuresKo: ['저발포 고밀도 폼', '정밀 충진 성능', '수조·터널 적합', '시공 오차 최소화'],
    featuresEn: ['Low-foam high-density', 'Precision filling', 'Ideal for tanks/tunnels', 'Reduced installation error'],
    applicationsKo: ['수조 방수', '지하 구조물 정밀 보수', '터널 국부 누수'],
    applicationsEn: ['Water tanks', 'Precision underground repair', 'Localized tunnel leakage'],
    specs: makeSpecs('1.15 g/cm3', '2,100 mPa.s', '500h 이상 이상 없음'),
    resources: commonResources,
  },
  {
    slug: 'ws-5000',
    category: 'sealant',
    nameKo: 'WS-5000',
    nameEn: 'WS-5000 General-Purpose Water-stop Agent',
    subtitleKo: '어떤 현장도 막는다, 어떤 상황에서도 믿는다.',
    subtitleEn: 'Reliable sealing in any site condition',
    descriptionKo:
      'WS-5000은 높은 발포 특성으로 다양한 현장에서 강력한 누수 차단력을 발휘하는 범용 지수재입니다. 복잡한 크랙과 넓은 공극을 효과적으로 커버합니다.',
    descriptionEn:
      'WS-5000 is a general-purpose sealing material with high foaming characteristics, effectively covering complex cracks and wide voids across various site conditions.',
    featuresKo: ['범용 현장 대응', '고발포 확장성', '넓은 공극 충진', '시공 편의성'],
    featuresEn: ['General field coverage', 'High expansion', 'Wide void filling', 'Installer-friendly'],
    applicationsKo: ['주차장 하부', '지하층 외벽', '일반 방수 보수'],
    applicationsEn: ['Parking decks', 'Basement walls', 'General waterproof repair'],
    specs: makeSpecs('1.10 g/cm3', '1,600 mPa.s', '500h 이상 이상 없음'),
    resources: commonResources,
  },
  {
    slug: 'ws-6000',
    category: 'sealant',
    nameKo: 'WS-6000',
    nameEn: 'WS-6000 Non-Regulated Water-stop Agent',
    tagKo: '비규제',
    tagEn: 'Non-Regulated',
    subtitleKo: '규제에서 자유롭게, 수축 없이 완벽하게.',
    subtitleEn: 'Regulation-friendly and non-shrinking performance',
    descriptionKo:
      'WS-6000은 규제 대상 성분을 포함하지 않으면서 무수축 특성으로 장기 지수 성능을 유지하는 제품입니다. 공공·실내 현장에도 안정적으로 적용할 수 있습니다.',
    descriptionEn:
      'WS-6000 excludes regulated components and maintains long-term sealing performance with non-shrink behavior, suitable for public and indoor projects.',
    featuresKo: ['비규제 포뮬러', '무수축 경화', '장기 밀착 유지', '공공 현장 적합'],
    featuresEn: ['Non-regulated formula', 'Non-shrink cure', 'Long-term adhesion', 'Public-project suitable'],
    applicationsKo: ['공공 건축물', '실내 지하구조', '규제 대응 공사'],
    applicationsEn: ['Public buildings', 'Indoor underground zones', 'Regulation-sensitive projects'],
    specs: makeSpecs('1.09 g/cm3', '1,700 mPa.s', '500h 이상 이상 없음'),
    resources: commonResources,
  },
  {
    slug: 'ws-7000',
    category: 'sealant',
    nameKo: 'WS-7000',
    nameEn: 'WS-7000 Solvent-Free Eco Water-stop Agent',
    tagKo: '친환경',
    tagEn: 'Eco',
    subtitleKo: '냄새없이, 제한없이, 타협없이. 지수제의 새로운 기준',
    subtitleEn: 'Zero-solvent eco sealing for safer projects',
    descriptionKo:
      'WS-7000은 VOC가 첨가되지 않은 무용제 친환경 지수재입니다. 친환경 인증이 필요한 관급 공사와 밀폐 공간 시공에 폭넓게 적용 가능한 차세대 제품입니다.',
    descriptionEn:
      'WS-7000 is a solvent-free eco-friendly sealant with zero VOC addition, ideal for public projects requiring environmental certification and enclosed-space application.',
    featuresKo: ['무용제 VOC Free', '친환경 인증 대응', '밀폐공간 시공 안전성', '위험물 분류 제외'],
    featuresEn: ['Solvent-free VOC free', 'Eco-certification ready', 'Safe for enclosed spaces', 'Non-hazardous classification'],
    applicationsKo: ['친환경 관급 공사', '지하 밀폐 공간', '저취 시공 현장'],
    applicationsEn: ['Eco public projects', 'Enclosed underground spaces', 'Low-odor work sites'],
    specs: makeSpecs('1.08 g/cm3', '1,500 mPa.s', '500h 이상 이상 없음'),
    resources: commonResources,
  },
  {
    slug: 'hs-1000',
    category: 'sealant',
    nameKo: 'HS-1000',
    nameEn: 'HS-1000 Fast-Reactive Water-stop Agent',
    subtitleKo: '빠른 반응, 유연한 차단 — 긴급 상황의 첫 번째 선택',
    subtitleEn: 'Fast reaction and flexible blocking for emergency repair',
    descriptionKo:
      'HS-1000은 초기 반응 속도가 뛰어난 연질 타입 지수재입니다. 활성 누수 현장에서도 빠르게 팽창·경화하여 긴급 보수 공사에 강점을 보입니다.',
    descriptionEn:
      'HS-1000 is a soft-type sealant with rapid initial reaction, expanding and curing quickly even in active leakage conditions for emergency maintenance.',
    featuresKo: ['초기 반응속도 우수', '활성 누수 즉시 대응', '연질 탄성 유지', '긴급 공정 최적화'],
    featuresEn: ['Fast initial response', 'Immediate active leak control', 'Soft elasticity', 'Optimized for urgent schedules'],
    applicationsKo: ['긴급 누수 보수', '터널 활성 누수', '지하층 신속 보강'],
    applicationsEn: ['Emergency leak repair', 'Active tunnel leakage', 'Rapid basement reinforcement'],
    specs: makeSpecs('1.07 g/cm3', '1,300 mPa.s', '500h 이상 이상 없음'),
    resources: commonResources,
  },
  {
    slug: 'hs-2000',
    category: 'sealant',
    nameKo: 'HS-2000',
    nameEn: 'HS-2000 High-Elastic Water-stop Agent',
    tagKo: '고탄성',
    tagEn: 'High Elasticity',
    subtitleKo: '움직이는 구조물에도 흔들리지 않는 탄성.',
    subtitleEn: 'Resilient elasticity for moving structures',
    descriptionKo:
      'HS-2000은 뛰어난 탄성 복원력을 지닌 고탄성 지수재로 반복 하중과 온도 변화 환경에서도 크랙 계면에 장기 밀착을 유지합니다.',
    descriptionEn:
      'HS-2000 is a high-elastic sealant with excellent recovery performance, maintaining long-term adhesion under cyclic loads and temperature changes.',
    featuresKo: ['고탄성 복원력', '진동/변위 대응', '장기 방수 성능', '내후성 강화'],
    featuresEn: ['High elastic recovery', 'Vibration/displacement response', 'Long-term waterproofing', 'Enhanced weather resistance'],
    applicationsKo: ['교량 구조물', '주차장 슬래브', '내진 구조 보수'],
    applicationsEn: ['Bridge structures', 'Parking slabs', 'Seismic structure repair'],
    specs: makeSpecs('1.11 g/cm3', '1,900 mPa.s', '500h 이상 이상 없음'),
    resources: commonResources,
  },
  {
    slug: 'hs-3000',
    category: 'sealant',
    nameKo: 'HS-3000',
    nameEn: 'HS-3000 Rapid-Set 9:1 Water-stop Agent',
    tagKo: '급결9:1',
    tagEn: 'Rapid 9:1',
    subtitleKo: '유속도, 저온도 — 극한 조건을 제압하는 급결 솔루션.',
    subtitleEn: 'Rapid-set solution for high-flow and low-temperature sites',
    descriptionKo:
      'HS-3000은 급결형 9:1 시스템으로 빠른 유속의 활성 누수와 저온 조건에서도 신속하게 반응·경화하여 극한 환경의 즉각 보수에 적합합니다.',
    descriptionEn:
      'HS-3000 is a rapid-setting 9:1 system engineered for active high-flow leakage and low-temperature environments, delivering immediate repair performance.',
    featuresKo: ['급결 9:1 설계', '저온 반응성', '고유속 누수 대응', '극한 현장 적용'],
    featuresEn: ['Rapid 9:1 design', 'Low-temperature reactivity', 'High-flow leak response', 'Extreme-site readiness'],
    applicationsKo: ['터널 굴착 구간', '지하철 공사', '해안 구조물'],
    applicationsEn: ['Tunnel excavation zones', 'Subway construction', 'Coastal structures'],
    specs: makeSpecs('1.13 g/cm3', '2,000 mPa.s', '500h 이상 이상 없음'),
    resources: commonResources,
  },
  {
    slug: 'hd-6000',
    category: 'sealant',
    nameKo: 'HD-6000',
    nameEn: 'HD-6000 High-Strength Rigid Water-stop Agent',
    tagKo: '고강도',
    tagEn: 'High Strength',
    subtitleKo: '구조물을 단단하게. 고강도 고정의 절대 신뢰.',
    subtitleEn: 'Structural reinforcement with high-strength locking',
    descriptionKo:
      'HD-6000은 경화 후 높은 압축강도와 구조적 접착력을 발휘하는 경질 지수재입니다. 누수 차단과 구조 보강을 동시에 수행합니다.',
    descriptionEn:
      'HD-6000 is a rigid high-strength sealant offering high compressive strength and structural adhesion after cure, enabling both leak blocking and reinforcement.',
    featuresKo: ['고강도 경질 성능', '구조 보강 동시 수행', '압축강도 우수', '노후 구조 보수 최적화'],
    featuresEn: ['High-strength rigid profile', 'Simultaneous reinforcement', 'Excellent compressive strength', 'Optimized for aging structures'],
    applicationsKo: ['노후 콘크리트 보강', '기초 보수', '중요 시설 유지관리'],
    applicationsEn: ['Aged concrete reinforcement', 'Foundation repair', 'Critical facility maintenance'],
    specs: makeSpecs('1.20 g/cm3', '2,300 mPa.s', '500h 이상 이상 없음'),
    resources: commonResources,
  },
  {
    slug: 'nflv-eco',
    category: 'fire-door-adhesive',
    nameKo: 'NFLV-친환경',
    nameEn: 'NFLV Eco Fire Door Adhesive',
    tagKo: '친환경',
    tagEn: 'Eco',
    subtitleKo: '화재를 막는 접착, 환경도 지키는 선택.',
    subtitleEn: 'Fire-resistant bonding with eco-conscious formulation',
    descriptionKo:
      'NFLV-친환경은 방화문 제조용 친환경 우레탄 접착제로, 유해 물질을 줄이면서도 강력한 접착력과 내열 성능을 동시에 제공합니다.',
    descriptionEn:
      'NFLV Eco is an eco-friendly urethane adhesive for fire-door manufacturing, combining reduced hazardous content with strong adhesion and heat resistance.',
    featuresKo: ['친환경 포뮬라', '방화문 내열 성능', '강력한 접착력', '작업환경 개선'],
    featuresEn: ['Eco formula', 'Heat resistance for fire doors', 'Strong bonding', 'Improved workplace safety'],
    applicationsKo: ['방화문 제조 라인', '내열 패널 접착', '친환경 인증 프로젝트'],
    applicationsEn: ['Fire-door production', 'Heat-resistant panel bonding', 'Eco-certified projects'],
    specs: makeSpecs('1.05 g/cm3', '1,400 mPa.s', '500h 이상 이상 없음'),
    resources: commonResources,
  },
  {
    slug: 'nflv-v',
    category: 'fire-door-adhesive',
    nameKo: 'NFLV-V',
    nameEn: 'NFLV-V Fire Door Adhesive',
    subtitleKo: '쉽게 바르고, 오래 간다 — 작업성과 품질의 완벽한 균형.',
    subtitleEn: 'Smooth application and long-term quality consistency',
    descriptionKo:
      'NFLV-V는 낮은 점도 설계와 낮은 취기로 작업성을 개선한 방화문용 접착제입니다. 저장 안정성이 우수해 대량 생산 라인에 적합합니다.',
    descriptionEn:
      'NFLV-V is a fire-door adhesive with low-viscosity design and reduced odor for better workability, delivering excellent storage stability for production lines.',
    featuresKo: ['저점도 도포성', '저취 작업성', '저장 안정성 우수', '양산 공정 최적화'],
    featuresEn: ['Low-viscosity spreadability', 'Low-odor handling', 'Excellent storage stability', 'Production-line optimized'],
    applicationsKo: ['방화문 양산', '패널 라미네이션', '장기 재고 운영 공정'],
    applicationsEn: ['Fire-door mass production', 'Panel lamination', 'Long-stock operations'],
    specs: makeSpecs('1.06 g/cm3', '1,250 mPa.s', '500h 이상 이상 없음'),
    resources: commonResources,
  },
  {
    slug: 'hanaro-p',
    category: 'general-adhesive',
    nameKo: '하나로 P',
    nameEn: 'Hanaro P Multi Adhesive',
    subtitleKo: '하나로 해결하는 만능 파트너.',
    subtitleEn: 'A versatile partner for diverse bonding jobs',
    descriptionKo:
      '하나로 P는 소량 접착부터 다품종 생산 라인까지 폭넓게 활용되는 다목적 우레탄 접착제입니다. 점도 조절과 저장 안정성이 우수합니다.',
    descriptionEn:
      'Hanaro P is a multi-purpose urethane adhesive suitable from small-batch jobs to mixed production lines, with easy viscosity control and stable storage.',
    featuresKo: ['다목적 사용성', '점도 조절 용이', '우수한 저장 안정성', '현장 즉시 사용성'],
    featuresEn: ['Multipurpose usability', 'Easy viscosity control', 'High storage stability', 'Immediate field use'],
    applicationsKo: ['소량 접착 작업', '다품종 생산 라인', '일반 산업 부착'],
    applicationsEn: ['Small bonding tasks', 'Mixed production lines', 'General industrial bonding'],
    specs: makeSpecs('1.03 g/cm3', '1,100 mPa.s', '500h 이상 이상 없음'),
    resources: commonResources,
  },
  {
    slug: 'id',
    category: 'interior-door-adhesive',
    nameKo: 'ID',
    nameEn: 'ID Interior Door Adhesive',
    subtitleKo: '실내도어 제조의 신뢰받는 기본기.',
    subtitleEn: 'Trusted baseline adhesive for interior door manufacturing',
    descriptionKo:
      'ID는 실내도어 제조 공정에 최적화된 표준형 접착제입니다. 다양한 도어 소재와 구조에 대해 일관된 접착 품질을 제공합니다.',
    descriptionEn:
      'ID is a standard adhesive optimized for interior door manufacturing, ensuring consistent bonding quality across various door materials and structures.',
    featuresKo: ['표준형 공정 적합', '일관된 접착 품질', '도어 소재 호환성', '대량 생산 안정성'],
    featuresEn: ['Standard process fit', 'Consistent bond quality', 'Door material compatibility', 'Stable mass production'],
    applicationsKo: ['실내도어 제조', '프레임-패널 접착', '대량 라인 생산'],
    applicationsEn: ['Interior door production', 'Frame-panel bonding', 'Mass line manufacturing'],
    specs: makeSpecs('1.04 g/cm3', '1,350 mPa.s', '500h 이상 이상 없음'),
    resources: commonResources,
  },
  {
    slug: 'id-2k',
    category: 'interior-door-adhesive',
    nameKo: 'ID-이액형',
    nameEn: 'ID Two-Component Adhesive',
    subtitleKo: '어디서든, 언제까지나 — 거리를 초월한 보관 안정성.',
    subtitleEn: 'Two-component stability for long-distance supply chains',
    descriptionKo:
      'ID-이액형은 장기 운송·보관 환경에서도 품질 저하를 최소화한 이액형 시스템입니다. 혼합 직전까지 성능을 유지해 장거리 납품에 적합합니다.',
    descriptionEn:
      'ID-2K is a two-component system designed to minimize quality degradation during long transport and storage, preserving performance until mixing.',
    featuresKo: ['이액형 안정 시스템', '장거리 공급 적합', '보관 안정성 우수', '혼합 직전 성능 유지'],
    featuresEn: ['Two-component stable system', 'Long-distance supply ready', 'Excellent storage stability', 'Performance retained until mixing'],
    applicationsKo: ['광역 납품 제조사', '장기 재고 운용', '품질 민감 도어 공정'],
    applicationsEn: ['Regional suppliers', 'Long-term inventory', 'Quality-sensitive door lines'],
    specs: makeSpecs('1.02 g/cm3', '1,200 mPa.s', '500h 이상 이상 없음'),
    resources: commonResources,
  },
  {
    slug: 'id-non-reg',
    category: 'interior-door-adhesive',
    nameKo: 'ID-비규제',
    nameEn: 'ID Non-Regulated Adhesive',
    subtitleKo: '규제 걱정 없이, 성능은 그대로.',
    subtitleEn: 'Regulation-safe formulation with uncompromised bonding',
    descriptionKo:
      'ID-비규제는 규제 대상 성분을 배제하면서도 실내도어 제조에 필요한 접착 성능을 제공하는 친환경 접착제입니다. 강화되는 기준 대응에 유리합니다.',
    descriptionEn:
      'ID Non-Regulated is an eco-conscious adhesive excluding regulated components while maintaining required bonding performance for interior door production.',
    featuresKo: ['비규제 성분 설계', '실내 공기질 대응', '도어 접착력 유지', '친환경 포트폴리오 강화'],
    featuresEn: ['Non-regulated composition', 'Indoor air quality compliance', 'Maintained door bonding', 'Eco portfolio enhancement'],
    applicationsKo: ['규제 대응 생산 라인', '친환경 실내 자재', '관급·민간 혼합 프로젝트'],
    applicationsEn: ['Regulation-sensitive production', 'Eco indoor materials', 'Public/private mixed projects'],
    specs: makeSpecs('1.03 g/cm3', '1,280 mPa.s', '500h 이상 이상 없음'),
    resources: commonResources,
  },
]

export function getProductBySlug(slug: string): ProductCatalogItem | undefined {
  return productCatalog.find((item) => item.slug === slug)
}
