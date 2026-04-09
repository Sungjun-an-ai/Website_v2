import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'

const mockSlides = [
  { id: 1, title_ko: '우레탄 접착제의 새로운 기준', title_en: 'A New Standard in Urethane Adhesives', order_index: 1, is_active: true },
  { id: 2, title_ko: 'BONDING TOMORROW TOGETHER', title_en: 'BONDING TOMORROW TOGETHER', order_index: 2, is_active: true },
  { id: 3, title_ko: '혁신적인 지수 기술', title_en: 'Innovative Waterproofing Technology', order_index: 3, is_active: true },
]

export default function AdminHeroPage() {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">히어로 슬라이드 관리</h1>
            <p className="text-sm text-gray-500 mt-1">메인 페이지 히어로 캐러셀 슬라이드를 관리합니다</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            슬라이드 추가
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">순서</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">제목 (한국어)</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">제목 (영어)</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">상태</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">작업</th>
              </tr>
            </thead>
            <tbody>
              {mockSlides.map(slide => (
                <tr key={slide.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-500">{slide.order_index}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{slide.title_ko}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{slide.title_en}</td>
                  <td className="py-3 px-4">
                    <button className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      slide.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {slide.is_active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      {slide.is_active ? '활성' : '비활성'}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
