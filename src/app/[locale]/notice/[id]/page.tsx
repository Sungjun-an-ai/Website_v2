import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye, Calendar } from 'lucide-react'

const notices: Record<string, {
  title_ko: string
  title_en: string
  content_ko: string
  content_en: string
  is_pinned: boolean
  view_count: number
  created_at: string
}> = {
  '1': {
    title_ko: '[공지] 2024년 하반기 신제품 출시 안내',
    title_en: '[Notice] 2024 Second Half New Product Launch',
    content_ko: `한성우레탄에서 2024년 하반기 신제품을 출시합니다.

친환경 저VOC 우레탄 접착제 HS-150과 고탄성 방수제 HS-350이 새롭게 추가됩니다.

■ HS-150 친환경 우레탄 접착제
- 기존 HS-100 대비 VOC 함량 50% 저감
- 동등 이상의 접착 성능 유지
- 실내 작업 환경 개선

■ HS-350 고탄성 방수제
- 신장률 500% 이상의 초고탄성
- 극한 기후 조건에서도 우수한 성능
- KS F 4923 인증 취득 예정

출시일: 2024년 9월 1일
문의: 031-943-8732 / info@hsurethane.co.kr`,
    content_en: `Hansung Urethane is launching new products in the second half of 2024.

The eco-friendly low-VOC urethane adhesive HS-150 and high-elasticity waterproofing agent HS-350 will be newly added.

■ HS-150 Eco-friendly Urethane Adhesive
- 50% reduction in VOC content compared to existing HS-100
- Maintained or improved adhesion performance
- Improved indoor working environment

■ HS-350 High-elasticity Waterproofing Agent
- Ultra-high elasticity with elongation over 500%
- Excellent performance even in extreme weather conditions
- KS F 4923 certification pending

Launch Date: September 1, 2024
Inquiries: +82-31-943-8732 / info@hsurethane.co.kr`,
    is_pinned: true,
    view_count: 456,
    created_at: '2024-07-01T09:00:00Z',
  },
  '2': {
    title_ko: '[안내] 여름 휴가 기간 업무 안내 (8월 12일~16일)',
    title_en: '[Notice] Summer Vacation Period Business Notice (Aug 12-16)',
    content_ko: `안녕하세요, 한성우레탄입니다.

2024년 여름 휴가 기간 동안 아래와 같이 업무가 일시 중단됩니다.

■ 휴무 기간: 2024년 8월 12일(월) ~ 8월 16일(금)
■ 정상 업무 재개: 2024년 8월 19일(월)

휴무 기간 중 긴급 연락 사항은 이메일(info@hsurethane.co.kr)로 보내주시면 업무 재개 후 순차적으로 처리해 드리겠습니다.

이용에 불편을 드려 죄송합니다.
감사합니다.`,
    content_en: `Hello, this is Hansung Urethane.

Business will be temporarily suspended during the 2024 summer vacation period.

■ Vacation Period: August 12 (Mon) ~ August 16 (Fri), 2024
■ Normal Business Resumes: August 19 (Mon), 2024

For urgent matters during the vacation period, please send an email to info@hsurethane.co.kr and we will process them sequentially after business resumes.

We apologize for the inconvenience.
Thank you.`,
    is_pinned: true,
    view_count: 234,
    created_at: '2024-08-01T09:00:00Z',
  },
  '3': {
    title_ko: 'ISO 9001 품질경영시스템 갱신 심사 통과',
    title_en: 'ISO 9001 Quality Management System Renewal Audit Passed',
    content_ko: `한성우레탄이 ISO 9001:2015 품질경영시스템 갱신 심사를 성공적으로 통과하였습니다.

이번 심사는 2024년 6월에 실시되었으며, 한성우레탄의 품질 관리 체계, 지속적 개선 프로세스, 고객 만족도 향상 노력이 높은 평가를 받았습니다.

앞으로도 한성우레탄은 최고 품질의 우레탄 제품을 공급하기 위해 최선을 다하겠습니다.

감사합니다.`,
    content_en: `Hansung Urethane has successfully passed the ISO 9001:2015 Quality Management System renewal audit.

This audit was conducted in June 2024, and Hansung Urethane's quality management system, continuous improvement process, and customer satisfaction improvement efforts received high marks.

Hansung Urethane will continue to do its best to supply the highest quality urethane products.

Thank you.`,
    is_pinned: false,
    view_count: 189,
    created_at: '2024-06-15T09:00:00Z',
  },
  '4': {
    title_ko: '2024 건설·건축 박람회 참가 안내',
    title_en: '2024 Construction & Architecture Exhibition Participation',
    content_ko: `한성우레탄이 2024 건설·건축 박람회에 참가합니다.

■ 행사명: 2024 대한민국 건설·건축 박람회
■ 일시: 2024년 9월 18일(수) ~ 9월 21일(토)
■ 장소: 킨텍스 (KINTEX) 제1전시장
■ 부스 위치: Hall 3, B-123

행사 기간 중 한성우레탄 부스에 방문하시면 최신 제품과 기술을 직접 체험하실 수 있으며, 현장 기술 상담도 진행됩니다.

많은 관심과 방문 바랍니다.`,
    content_en: `Hansung Urethane will participate in the 2024 Construction & Architecture Exhibition.

■ Event: 2024 Korea Construction & Architecture Exhibition
■ Date: September 18 (Wed) ~ September 21 (Sat), 2024
■ Venue: KINTEX Exhibition Hall 1
■ Booth Location: Hall 3, B-123

During the event, you can experience the latest products and technologies at the Hansung Urethane booth, and on-site technical consultations will also be available.

We look forward to your visit.`,
    is_pinned: false,
    view_count: 312,
    created_at: '2024-05-20T09:00:00Z',
  },
  '5': {
    title_ko: '홈페이지 리뉴얼 오픈 안내',
    title_en: 'Website Renewal Launch Notice',
    content_ko: `안녕하세요, 한성우레탄입니다.

한성우레탄 공식 홈페이지가 새롭게 리뉴얼되었습니다.

이번 리뉴얼을 통해 다음과 같이 개선되었습니다:
- 모바일 최적화 디자인
- 국문/영문 이중 언어 지원
- 제품 상세 정보 강화
- 자료실 및 카탈로그 다운로드 기능
- 온라인 문의 시스템

더욱 편리하고 유용한 홈페이지가 될 수 있도록 지속적으로 개선해 나가겠습니다.

감사합니다.`,
    content_en: `Hello, this is Hansung Urethane.

The Hansung Urethane official website has been renewed.

The following improvements were made:
- Mobile-optimized design
- Korean/English bilingual support
- Enhanced product detail information
- Resource library and catalog download function
- Online inquiry system

We will continue to improve the website to make it more convenient and useful.

Thank you.`,
    is_pinned: false,
    view_count: 678,
    created_at: '2024-01-15T09:00:00Z',
  },
}

export function generateStaticParams() {
  return Object.keys(notices).map(id => ({ id }))
}

export default async function NoticeDetailPage({
  params
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const notice = notices[id]
  if (!notice) notFound()

  const isKo = locale === 'ko'

  return (
    <div className="pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back */}
        <Link
          href={`/${locale}/notice`}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-navy transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {isKo ? '목록으로' : 'Back to List'}
        </Link>

        {/* Article */}
        <article className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-navy/5 px-8 py-6 border-b border-gray-200">
            {notice.is_pinned && (
              <span className="inline-block bg-gold text-white text-xs px-2 py-0.5 rounded-full font-medium mb-2">
                {isKo ? '공지' : 'Notice'}
              </span>
            )}
            <h1 className="text-xl md:text-2xl font-bold text-navy">
              {isKo ? notice.title_ko : notice.title_en}
            </h1>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(notice.created_at).toLocaleDateString(isKo ? 'ko-KR' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {notice.view_count}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
              {isKo ? notice.content_ko : notice.content_en}
            </div>
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-6 flex justify-center">
          <Link
            href={`/${locale}/notice`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy-700 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            {isKo ? '목록으로' : 'Back to List'}
          </Link>
        </div>
      </div>
    </div>
  )
}
