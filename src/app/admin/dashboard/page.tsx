import AdminLayout from '@/components/admin/AdminLayout'
import { MessageSquare, Eye, Download, Bell } from 'lucide-react'

export default function AdminDashboardPage() {
  const stats = [
    { label: '새 문의', value: '12', icon: MessageSquare, color: 'bg-blue-500', change: '+3 오늘' },
    { label: '총 조회수', value: '8,432', icon: Eye, color: 'bg-green-500', change: '+234 이번 주' },
    { label: '자료 다운로드', value: '1,567', icon: Download, color: 'bg-gold', change: '+89 이번 달' },
    { label: '공지사항', value: '5', icon: Bell, color: 'bg-purple-500', change: '2개 고정' },
  ]

  const recentLeads = [
    { name: '김철수', company: '현대건설', email: 'kim@hyundai.co.kr', product: 'HS-100', date: '2024-08-20', status: 'new' },
    { name: '이영희', company: '삼성물산', email: 'lee@samsung.co.kr', product: 'HS-200', date: '2024-08-19', status: 'contacted' },
    { name: 'John Smith', company: 'ABC Corp', email: 'john@abc.com', product: 'HS-300', date: '2024-08-18', status: 'new' },
    { name: '박민준', company: 'LH공사', email: 'park@lh.or.kr', product: 'HS-400', date: '2024-08-17', status: 'closed' },
    { name: '최수진', company: '대우건설', email: 'choi@daewoo.co.kr', product: 'HS-100', date: '2024-08-16', status: 'contacted' },
  ]

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-500 text-sm mt-1">한성우레탄 관리자 패널에 오신 것을 환영합니다.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">{stat.label}</span>
                  <div className={`${stat.color} p-2 rounded-lg`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-green-600 mt-1">{stat.change}</div>
              </div>
            )
          })}
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">최근 문의</h2>
            <a href="/admin/leads" className="text-sm text-navy hover:text-gold transition-colors">
              전체 보기 →
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['이름', '회사', '이메일', '관심 제품', '날짜', '상태'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead, idx) => (
                  <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium">{lead.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{lead.company}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{lead.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{lead.product}</td>
                    <td className="py-3 px-4 text-sm text-gray-400">{lead.date}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        lead.status === 'new' ? 'bg-blue-100 text-blue-700'
                        : lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                      }`}>
                        {lead.status === 'new' ? '신규' : lead.status === 'contacted' ? '연락완료' : '종결'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '히어로 관리', href: '/admin/hero', desc: '슬라이드 편집' },
            { label: '제품 관리', href: '/admin/products', desc: '제품 정보 수정' },
            { label: '공지사항', href: '/admin/notices', desc: '공지 작성/수정' },
            { label: '자료실', href: '/admin/resources', desc: '파일 관리' },
          ].map(link => (
            <a
              key={link.href}
              href={link.href}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:border-navy transition-colors"
            >
              <div className="font-medium text-navy text-sm">{link.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{link.desc}</div>
            </a>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
