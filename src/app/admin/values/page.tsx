import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'

const mockValues = [
  { id: 1, title_ko: '품질 우선', title_en: 'Quality First', order_index: 1 },
  { id: 2, title_ko: '기술 혁신', title_en: 'Technological Innovation', order_index: 2 },
  { id: 3, title_ko: '고객 파트너십', title_en: 'Customer Partnership', order_index: 3 },
]

export default function AdminValuesPage() {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">핵심 가치 관리</h1>
          <p className="text-sm text-gray-500 mt-1">회사 핵심 가치 섹션을 관리합니다</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockValues.map(val => (
            <div key={val.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl font-bold text-navy/20">0{val.order_index}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
              <h3 className="font-semibold text-navy">{val.title_ko}</h3>
              <p className="text-sm text-gray-500 mt-1">{val.title_en}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
