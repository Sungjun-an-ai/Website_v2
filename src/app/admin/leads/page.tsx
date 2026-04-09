"use client"

import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Download, Eye } from 'lucide-react'
import { csvExport } from '@/lib/utils'

const mockLeads = [
  { id: 1, name: '김철수', company: '현대건설', email: 'kim@hyundai.co.kr', phone: '010-1234-5678', product_interest: 'HS-100', message: '제품 견적 문의드립니다.', status: 'new', locale: 'ko', created_at: '2024-08-20' },
  { id: 2, name: '이영희', company: '삼성물산', email: 'lee@samsung.co.kr', phone: '010-9876-5432', product_interest: 'HS-200', message: '대량 구매 가능한지 문의합니다.', status: 'contacted', locale: 'ko', created_at: '2024-08-19' },
  { id: 3, name: 'John Smith', company: 'ABC Corp', email: 'john@abc.com', phone: '+1-555-0123', product_interest: 'HS-300', message: 'Interested in export pricing.', status: 'new', locale: 'en', created_at: '2024-08-18' },
  { id: 4, name: '박민준', company: 'LH공사', email: 'park@lh.or.kr', phone: '010-5555-6666', product_interest: 'HS-400', message: '터널 보수 프로젝트에 사용할 제품 문의', status: 'closed', locale: 'ko', created_at: '2024-08-17' },
  { id: 5, name: '최수진', company: '대우건설', email: 'choi@daewoo.co.kr', phone: '010-7777-8888', product_interest: 'HS-100', message: '기술 데이터 시트 요청', status: 'contacted', locale: 'ko', created_at: '2024-08-16' },
]

export default function AdminLeadsPage() {
  const handleExport = () => {
    csvExport(mockLeads.map(lead => ({
      이름: lead.name,
      회사: lead.company,
      이메일: lead.email,
      전화: lead.phone,
      관심제품: lead.product_interest,
      문의내용: lead.message,
      상태: lead.status,
      언어: lead.locale,
      등록일: lead.created_at,
    })), '문의목록')
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">문의 관리</h1>
            <p className="text-sm text-gray-500 mt-1">고객 문의를 확인하고 관리합니다</p>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            CSV 내보내기
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {['전체', '신규', '연락완료', '종결'].map(filter => (
            <button
              key={filter}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === '전체' ? 'bg-navy text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-navy'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['이름', '회사', '이메일', '관심제품', '등록일', '상태', '상세'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockLeads.map(lead => (
                <tr key={lead.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium">{lead.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{lead.company}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{lead.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{lead.product_interest}</td>
                  <td className="py-3 px-4 text-sm text-gray-400">{lead.created_at}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      lead.status === 'new' ? 'bg-blue-100 text-blue-700'
                      : lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                    }`}>
                      {lead.status === 'new' ? '신규' : lead.status === 'contacted' ? '연락완료' : '종결'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
