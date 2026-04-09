import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2 } from 'lucide-react'

const mockProducts = [
  { id: 1, slug: 'hs-100', name_ko: 'HS-100 우레탄 접착제', name_en: 'HS-100 Urethane Adhesive', category: '접착제', is_active: true },
  { id: 2, slug: 'hs-200', name_ko: 'HS-200 지수제', name_en: 'HS-200 Waterproof Sealant', category: '지수제', is_active: true },
  { id: 3, slug: 'hs-300', name_ko: 'HS-300 방수제', name_en: 'HS-300 Waterproofing Agent', category: '방수제', is_active: true },
  { id: 4, slug: 'hs-400', name_ko: 'HS-400 그라우트', name_en: 'HS-400 Urethane Grout', category: '그라우트', is_active: true },
]

export default function AdminProductsPage() {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">제품 관리</h1>
            <p className="text-sm text-gray-500 mt-1">제품 정보를 추가, 수정, 삭제합니다</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            제품 추가
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['슬러그', '제품명 (한)', '제품명 (영)', '카테고리', '상태', '작업'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockProducts.map(product => (
                <tr key={product.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-500 font-mono">{product.slug}</td>
                  <td className="py-3 px-4 text-sm font-medium">{product.name_ko}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{product.name_en}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">{product.category}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">활성</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400">
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
