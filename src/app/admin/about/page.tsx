import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'

export default function AdminAboutPage() {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">회사 소개 관리</h1>
          <p className="text-sm text-gray-500 mt-1">회사 소개 페이지 내용을 관리합니다</p>
        </div>
        <div className="space-y-4">
          {[
            { title: '회사 개요', desc: '한성우레탄 소개 텍스트' },
            { title: '미션 & 비전', desc: '사명 및 비전 문구' },
            { title: '인증 현황', desc: '보유 인증 목록' },
            { title: '연혁', desc: '회사 연혁 데이터' },
          ].map(section => (
            <div key={section.title} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{section.title}</h3>
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
