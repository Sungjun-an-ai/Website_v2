import { setRequestLocale } from 'next-intl/server'

const trackRecords = [
  { id: 1, year: 2024, client_ko: '현대건설', client_en: 'Hyundai Construction', project_ko: '고덕 신도시 아파트 단지 방수 공사', project_en: 'Godeok New Town Apartment Complex Waterproofing', category: 'construction' },
  { id: 2, year: 2024, client_ko: '삼성물산', client_en: 'Samsung C&T', project_ko: '송도 복합단지 지하 주차장 지수 처리', project_en: 'Songdo Complex Underground Parking Sealant Treatment', category: 'construction' },
  { id: 3, year: 2023, client_ko: '대우건설', client_en: 'Daewoo E&C', project_ko: '인천 터널 보수 프로젝트', project_en: 'Incheon Tunnel Repair Project', category: 'civil' },
  { id: 4, year: 2023, client_ko: 'LH 한국토지주택공사', client_en: 'Korea Land & Housing Corporation', project_ko: '공공 임대 아파트 방수 보수', project_en: 'Public Rental Apartment Waterproofing Repair', category: 'construction' },
  { id: 5, year: 2023, client_ko: '한국철도공사', client_en: 'KORAIL', project_ko: '철도 터널 균열 보수 및 지수', project_en: 'Railway Tunnel Crack Repair and Sealing', category: 'civil' },
  { id: 6, year: 2022, client_ko: '서울시 도시기반시설본부', client_en: 'Seoul Urban Infrastructure Headquarters', project_ko: '도심 지하도 방수 보수 공사', project_en: 'Urban Underground Tunnel Waterproofing Repair', category: 'civil' },
  { id: 7, year: 2022, client_ko: 'GS건설', client_en: 'GS Engineering & Construction', project_ko: '자이 아파트 단지 외벽 실링', project_en: 'Xi Apartment Complex Exterior Wall Sealing', category: 'construction' },
  { id: 8, year: 2021, client_ko: '포스코건설', client_en: 'POSCO E&C', project_ko: '더샵 아파트 지하 구조물 방수', project_en: 'THE SHARP Apartment Underground Structure Waterproofing', category: 'construction' },
  { id: 9, year: 2021, client_ko: '현대엔지니어링', client_en: 'Hyundai Engineering', project_ko: '플랜트 산업 설비 접착 시공', project_en: 'Plant Industrial Equipment Adhesive Construction', category: 'industrial' },
  { id: 10, year: 2020, client_ko: '케이워터', client_en: 'K-water', project_ko: '댐 균열 보수 및 지수 처리', project_en: 'Dam Crack Repair and Sealing Treatment', category: 'civil' },
  { id: 11, year: 2020, client_ko: '서울주택도시공사', client_en: 'Seoul Housing and Communities Corporation', project_ko: '공공주택 옥상 방수 공사', project_en: 'Public Housing Rooftop Waterproofing', category: 'construction' },
  { id: 12, year: 2019, client_ko: '현대자동차 남양연구소', client_en: 'Hyundai Motor Namyang R&D Center', project_ko: '자동차 부품 접합용 우레탄 공급', project_en: 'Urethane Supply for Automotive Part Bonding', category: 'industrial' },
]

const categories = [
  { key: 'all', ko: '전체', en: 'All' },
  { key: 'construction', ko: '건설', en: 'Construction' },
  { key: 'civil', ko: '토목', en: 'Civil Engineering' },
  { key: 'industrial', ko: '산업', en: 'Industrial' },
]

export default async function TrackRecordPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isKo = locale === 'ko'

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">Track Record</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {isKo ? '납품 실적' : 'Track Record'}
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            {isKo
              ? '한성우레탄의 주요 납품 및 시공 실적을 소개합니다'
              : 'Introducing major supply and construction achievements of Hansung Urethane'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { value: '500+', label: isKo ? '납품 거래처' : 'Clients' },
            { value: '1,000+', label: isKo ? '완료 프로젝트' : 'Completed Projects' },
            { value: '30+', label: isKo ? '진행 중인 현장' : 'Active Sites' },
            { value: '36+', label: isKo ? '년의 실적' : 'Years of Record' },
          ].map((stat) => (
            <div key={stat.label} className="bg-navy rounded-xl p-4 text-center text-white">
              <div className="text-2xl font-bold text-gold">{stat.value}</div>
              <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Records Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <div className="bg-navy px-6 py-4">
            <h2 className="text-white font-semibold">
              {isKo ? '주요 납품 실적' : 'Major Supply Records'}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">{isKo ? '연도' : 'Year'}</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">{isKo ? '발주처' : 'Client'}</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">{isKo ? '프로젝트' : 'Project'}</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">{isKo ? '분야' : 'Category'}</th>
                </tr>
              </thead>
              <tbody>
                {trackRecords.map((record, idx) => {
                  const cat = categories.find(c => c.key === record.category)
                  return (
                    <tr key={record.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-3 px-4 text-sm font-medium text-navy">{record.year}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {isKo ? record.client_ko : record.client_en}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {isKo ? record.project_ko : record.project_en}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          record.category === 'construction' ? 'bg-blue-100 text-blue-700'
                          : record.category === 'civil' ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                        }`}>
                          {isKo ? cat?.ko : cat?.en}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
