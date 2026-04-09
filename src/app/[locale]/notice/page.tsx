import { setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { Pin, Eye } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const notices = [
  {
    id: '1',
    title_ko: '[공지] 2024년 하반기 신제품 출시 안내',
    title_en: '[Notice] 2024 Second Half New Product Launch',
    content_ko: '한성우레탄에서 2024년 하반기 신제품을 출시합니다. 친환경 저VOC 우레탄 접착제 HS-150과 고탄성 방수제 HS-350이 새롭게 추가됩니다.',
    content_en: 'Hansung Urethane is launching new products in the second half of 2024. The eco-friendly low-VOC urethane adhesive HS-150 and high-elasticity waterproofing agent HS-350 will be newly added.',
    is_pinned: true,
    view_count: 456,
    created_at: '2024-07-01T09:00:00Z',
  },
  {
    id: '2',
    title_ko: '[안내] 여름 휴가 기간 업무 안내 (8월 12일~16일)',
    title_en: '[Notice] Summer Vacation Period Business Notice (Aug 12-16)',
    content_ko: '2024년 여름 휴가 기간(8월 12일~16일) 동안 업무가 일시 중단됩니다. 긴급 연락은 이메일로 해주시기 바랍니다.',
    content_en: 'Business will be temporarily suspended during the summer vacation period (August 12-16, 2024). For urgent contact, please use email.',
    is_pinned: true,
    view_count: 234,
    created_at: '2024-08-01T09:00:00Z',
  },
  {
    id: '3',
    title_ko: 'ISO 9001 품질경영시스템 갱신 심사 통과',
    title_en: 'ISO 9001 Quality Management System Renewal Audit Passed',
    content_ko: '한성우레탄이 ISO 9001 품질경영시스템 갱신 심사를 무사히 통과하였습니다. 앞으로도 더욱 높은 품질의 제품을 공급하겠습니다.',
    content_en: 'Hansung Urethane has successfully passed the ISO 9001 Quality Management System renewal audit.',
    is_pinned: false,
    view_count: 189,
    created_at: '2024-06-15T09:00:00Z',
  },
  {
    id: '4',
    title_ko: '2024 건설·건축 박람회 참가 안내',
    title_en: '2024 Construction & Architecture Exhibition Participation',
    content_ko: '한성우레탄이 2024년 건설·건축 박람회에 참가합니다. 최신 제품과 기술을 직접 확인하실 수 있습니다.',
    content_en: 'Hansung Urethane will participate in the 2024 Construction & Architecture Exhibition.',
    is_pinned: false,
    view_count: 312,
    created_at: '2024-05-20T09:00:00Z',
  },
  {
    id: '5',
    title_ko: '홈페이지 리뉴얼 오픈 안내',
    title_en: 'Website Renewal Launch Notice',
    content_ko: '한성우레탄 공식 홈페이지가 새롭게 리뉴얼되었습니다. 더욱 편리한 환경에서 제품 정보를 확인하실 수 있습니다.',
    content_en: 'The Hansung Urethane official website has been renewed. You can now access product information in a more convenient environment.',
    is_pinned: false,
    view_count: 678,
    created_at: '2024-01-15T09:00:00Z',
  },
]

export default async function NoticePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isKo = locale === 'ko'

  const pinnedNotices = notices.filter(n => n.is_pinned)
  const regularNotices = notices.filter(n => !n.is_pinned)

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">Notice</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {isKo ? '공지사항' : 'Notice Board'}
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            {isKo
              ? '한성우레탄의 최신 소식과 공지사항을 확인하세요'
              : 'Check the latest news and announcements from Hansung Urethane'}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table header */}
          <div className="bg-navy/5 px-6 py-3 border-b border-gray-200 grid grid-cols-12 gap-4">
            <div className="col-span-1 text-xs font-semibold text-gray-500 text-center">No.</div>
            <div className="col-span-7 text-xs font-semibold text-gray-500">{isKo ? '제목' : 'Title'}</div>
            <div className="col-span-2 text-xs font-semibold text-gray-500 text-center">{isKo ? '조회' : 'Views'}</div>
            <div className="col-span-2 text-xs font-semibold text-gray-500 text-center">{isKo ? '날짜' : 'Date'}</div>
          </div>

          {/* Pinned */}
          {pinnedNotices.map((notice) => (
            <Link
              key={notice.id}
              href={`/${locale}/notice/${notice.id}`}
              className="block border-b border-gray-100 hover:bg-gold/5 transition-colors"
            >
              <div className="px-6 py-4 grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1 flex justify-center">
                  <Pin className="h-4 w-4 text-gold" />
                </div>
                <div className="col-span-7">
                  <span className="inline-flex items-center gap-2">
                    <span className="bg-gold text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      {isKo ? '공지' : 'Notice'}
                    </span>
                    <span className="font-medium text-navy text-sm">
                      {isKo ? notice.title_ko : notice.title_en}
                    </span>
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-center gap-1 text-gray-400 text-xs">
                  <Eye className="h-3 w-3" />
                  {notice.view_count}
                </div>
                <div className="col-span-2 text-xs text-gray-400 text-center">
                  {new Date(notice.created_at).toLocaleDateString(isKo ? 'ko-KR' : 'en-US')}
                </div>
              </div>
            </Link>
          ))}

          {/* Regular */}
          {regularNotices.map((notice, idx) => (
            <Link
              key={notice.id}
              href={`/${locale}/notice/${notice.id}`}
              className="block border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
            >
              <div className="px-6 py-4 grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1 text-center text-sm text-gray-400">
                  {pinnedNotices.length + regularNotices.length - idx}
                </div>
                <div className="col-span-7">
                  <span className="text-sm text-gray-800 hover:text-navy transition-colors">
                    {isKo ? notice.title_ko : notice.title_en}
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-center gap-1 text-gray-400 text-xs">
                  <Eye className="h-3 w-3" />
                  {notice.view_count}
                </div>
                <div className="col-span-2 text-xs text-gray-400 text-center">
                  {new Date(notice.created_at).toLocaleDateString(isKo ? 'ko-KR' : 'en-US')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
