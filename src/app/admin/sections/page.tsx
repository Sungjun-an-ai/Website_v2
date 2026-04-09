import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'

const sections = [
  { key: 'stats', label: '통계 섹션', desc: '메인 페이지 통계 바' },
  { key: 'products', label: '제품 섹션', desc: '제품 라인업 섹션' },
  { key: 'values', label: '핵심 가치 섹션', desc: '핵심 가치 섹션' },
  { key: 'contact', label: '연락처 섹션', desc: '문의 폼 및 연락처' },
  { key: 'about_overview', label: '회사 개요', desc: '회사 소개 페이지 개요' },
]

export default function AdminSectionsPage() {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">섹션 관리</h1>
          <p className="text-sm text-gray-500 mt-1">각 페이지 섹션의 내용을 관리합니다</p>
        </div>
        <div className="space-y-3">
          {sections.map(section => (
            <div key={section.key} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{section.label}</h3>
                <p className="text-xs text-gray-400 mt-0.5 font-mono">{section.key}</p>
                <p className="text-sm text-gray-500">{section.desc}</p>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                수정
              </Button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
