export type ResourceCategory =
  | 'company'
  | 'catalog'
  | 'msds'
  | 'testReport'
  | 'supplyApproval'

export type ResourceGroup =
  | 'common'
  | 'sealant'
  | 'fireDoor'
  | 'interiorDoor'
  | 'general'
  | 'solution'

export type ResourceFormat = 'PDF' | 'DOCX' | 'DOC' | 'HWP'

export type Resource = {
  id: string
  category: ResourceCategory
  group: ResourceGroup
  product: string
  name_ko: string
  name_en: string
  format: ResourceFormat
  size: number // bytes
}

export const categoryLabels: Record<ResourceCategory, { ko: string; en: string }> = {
  company: { ko: '회사소개', en: 'Company' },
  catalog: { ko: '카탈로그', en: 'Catalog' },
  msds: { ko: 'MSDS', en: 'MSDS' },
  testReport: { ko: '시험성적서', en: 'Test Report' },
  supplyApproval: { ko: '자재공급승인요청서', en: 'Material Supply Approval' },
}

export const categoryOrder: ResourceCategory[] = [
  'company',
  'catalog',
  'msds',
  'testReport',
  'supplyApproval',
]

export const groupLabels: Record<ResourceGroup, { ko: string; en: string }> = {
  common: { ko: '공통', en: 'Common' },
  sealant: { ko: '지수제', en: 'Sealing Agent' },
  fireDoor: { ko: '방화문 접착제', en: 'Fire Door Adhesive' },
  interiorDoor: { ko: '실내문 접착제', en: 'Interior Door Adhesive' },
  general: { ko: '일반 접착제', en: 'General Adhesive' },
  solution: { ko: '우레탄 솔루션', en: 'Urethane Solution' },
}

export const resources: Resource[] = [
  {
    id: 'r1',
    category: 'company',
    group: 'common',
    product: '한성우레탄',
    name_ko: '한성우레탄 회사소개서',
    name_en: 'Hansung Urethane Company Profile',
    format: 'PDF',
    size: 5452595,
  },
  {
    id: 'r2',
    category: 'company',
    group: 'common',
    product: '한성우레탄',
    name_ko: '연혁 및 인증 현황',
    name_en: 'History & Certifications',
    format: 'DOC',
    size: 655360,
  },
  {
    id: 'r3',
    category: 'catalog',
    group: 'common',
    product: '한성우레탄',
    name_ko: '종합 카탈로그 2024',
    name_en: 'General Catalog 2024',
    format: 'PDF',
    size: 8912896,
  },
  {
    id: 'r4',
    category: 'catalog',
    group: 'sealant',
    product: 'HS-200',
    name_ko: '지수제 제품 카탈로그',
    name_en: 'Sealing Agent Catalog',
    format: 'PDF',
    size: 3250586,
  },
  {
    id: 'r5',
    category: 'catalog',
    group: 'interiorDoor',
    product: 'ID-100',
    name_ko: '실내문 접착제 카탈로그',
    name_en: 'Interior Door Adhesive Catalog',
    format: 'PDF',
    size: 2936013,
  },
  {
    id: 'r6',
    category: 'catalog',
    group: 'solution',
    product: '맞춤 배합',
    name_ko: '우레탄 솔루션 소개서',
    name_en: 'Urethane Solution Brochure',
    format: 'PDF',
    size: 4404019,
  },
  {
    id: 'r7',
    category: 'msds',
    group: 'sealant',
    product: 'HS-200',
    name_ko: '지수제 물질안전보건자료',
    name_en: 'Sealing Agent MSDS',
    format: 'PDF',
    size: 1258291,
  },
  {
    id: 'r8',
    category: 'msds',
    group: 'fireDoor',
    product: 'NFLV-ECO',
    name_ko: '방화문 접착제 MSDS',
    name_en: 'Fire Door Adhesive MSDS',
    format: 'PDF',
    size: 1468006,
  },
  {
    id: 'r9',
    category: 'msds',
    group: 'interiorDoor',
    product: 'ID-100',
    name_ko: '실내문 접착제 MSDS',
    name_en: 'Interior Door Adhesive MSDS',
    format: 'PDF',
    size: 1153434,
  },
  {
    id: 'r10',
    category: 'msds',
    group: 'general',
    product: 'HANARO-P',
    name_ko: '일반 접착제 MSDS',
    name_en: 'General Adhesive MSDS',
    format: 'PDF',
    size: 1363148,
  },
  {
    id: 'r11',
    category: 'testReport',
    group: 'sealant',
    product: 'HS-200',
    name_ko: '지수제 KS 시험성적서',
    name_en: 'Sealing Agent KS Test Report',
    format: 'PDF',
    size: 2097152,
  },
  {
    id: 'r12',
    category: 'testReport',
    group: 'fireDoor',
    product: 'NFLV-ECO',
    name_ko: '방화문 접착제 내화 시험성적서',
    name_en: 'Fire Door Adhesive Fire-Resistance Report',
    format: 'PDF',
    size: 2726297,
  },
  {
    id: 'r13',
    category: 'testReport',
    group: 'general',
    product: 'HANARO-P',
    name_ko: '일반 접착제 물성 시험성적서',
    name_en: 'General Adhesive Properties Test Report',
    format: 'PDF',
    size: 1992294,
  },
  {
    id: 'r14',
    category: 'supplyApproval',
    group: 'common',
    product: '한성우레탄',
    name_ko: '자재공급승인요청서 양식 (DOCX)',
    name_en: 'Material Supply Approval Form (DOCX)',
    format: 'DOCX',
    size: 327680,
  },
  {
    id: 'r15',
    category: 'supplyApproval',
    group: 'common',
    product: '한성우레탄',
    name_ko: '자재공급승인요청서 양식 (HWP)',
    name_en: 'Material Supply Approval Form (HWP)',
    format: 'HWP',
    size: 184320,
  },
]
