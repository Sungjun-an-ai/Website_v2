import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'

const mockStats = [
  { id: 1, label_ko: '설립연도', label_en: 'Established', value: '1988', suffix: '' },
  { id: 2, label_ko: '업력', label_en: 'Years of Experience', value: '36', suffix: '+' },
  { id: 3, label_ko: '제품 종류', label_en: 'Product Types', value: '50', suffix: '+' },
  { id: 4, label_ko: '거래처', label_en: 'Clients', value: '500', suffix: '+' },
]

export default function AdminStatsPage() {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">통계 수치 관리</h1>
          <p className="text-sm text-gray-500 mt-1">메인 페이지 통계 섹션의 숫자를 관리합니다</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockStats.map(stat => (
            <div key={stat.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl font-bold text-navy">{stat.value}{stat.suffix}</div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
              <div className="text-sm font-medium text-gray-700">{stat.label_ko}</div>
              <div className="text-xs text-gray-400">{stat.label_en}</div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
