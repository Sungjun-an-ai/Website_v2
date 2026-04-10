import AdminLayout from '@/components/admin/AdminLayout'
import { MessageSquare, Bell } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

async function getDashboardStats() {
  try {
    const supabase = await createClient()

    const [leadsRes, noticesRes, recentLeadsRes] = await Promise.all([
      supabase.from('leads').select('id, status', { count: 'exact' }),
      supabase.from('notices').select('id', { count: 'exact' }).eq('is_active', true),
      supabase
        .from('leads')
        .select('id, name, company, email, product_interest, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5),
    ])

    const totalLeads = leadsRes.count ?? 0
    const newLeads = (leadsRes.data ?? []).filter(l => l.status === 'new').length
    const totalNotices = noticesRes.count ?? 0
    const recentLeads = recentLeadsRes.data ?? []

    return { totalLeads, newLeads, totalNotices, recentLeads, error: null }
  } catch {
    return { totalLeads: 0, newLeads: 0, totalNotices: 0, recentLeads: [], error: '데이터를 불러오지 못했습니다.' }
  }
}

export default async function AdminDashboardPage() {
  const { totalLeads, newLeads, totalNotices, recentLeads, error } = await getDashboardStats()

  const stats = [
    { label: '새 문의', value: String(newLeads), icon: MessageSquare, color: 'bg-blue-500', change: `총 ${totalLeads}건` },
    { label: '공지사항', value: String(totalNotices), icon: Bell, color: 'bg-purple-500', change: '활성 공지' },
  ]

  const statusMap: Record<string, { label: string; className: string }> = {
    new: { label: '신규', className: 'bg-blue-100 text-blue-700' },
    contacted: { label: '연락완료', className: 'bg-yellow-100 text-yellow-700' },
    closed: { label: '종결', className: 'bg-green-100 text-green-700' },
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-500 text-sm mt-1">한성우레탄 관리자 패널에 오신 것을 환영합니다.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm">
            ⚠️ {error} (Supabase가 설정되지 않았을 수 있습니다.)
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
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
                <div className="text-xs text-gray-400 mt-1">{stat.change}</div>
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
          {recentLeads.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              문의가 없습니다.
            </div>
          ) : (
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
                  {recentLeads.map((lead) => {
                    const statusInfo = statusMap[lead.status] ?? { label: lead.status, className: 'bg-gray-100 text-gray-600' }
                    return (
                      <tr key={lead.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium">{lead.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{lead.company}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{lead.email}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{lead.product_interest}</td>
                        <td className="py-3 px-4 text-sm text-gray-400">
                          {new Date(lead.created_at).toLocaleDateString('ko-KR')}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '히어로 관리', href: '/admin/hero', desc: '슬라이드 편집' },
            { label: '제품 관리', href: '/admin/products', desc: '제품 정보 수정' },
            { label: '연혁 관리', href: '/admin/history', desc: '회사 연혁 편집' },
            { label: '납품실적', href: '/admin/track-records', desc: '실적 추가/수정' },
            { label: '공지사항', href: '/admin/notices', desc: '공지 작성/수정' },
            { label: '자료실', href: '/admin/resources', desc: '파일 관리' },
            { label: '미디어 관리', href: '/admin/media', desc: '파일 업로드' },
            { label: '브랜딩', href: '/admin/branding', desc: '로고/색상 관리' },
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
