import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Download } from 'lucide-react'
import { formatFileSize } from '@/lib/utils'

const mockResources = [
  { id: 1, title_ko: 'HS-100 기술 데이터 시트', file_type: 'PDF', file_size: 2048000, download_count: 234, is_active: true },
  { id: 2, title_ko: 'HS-200 기술 데이터 시트', file_type: 'PDF', file_size: 1824000, download_count: 187, is_active: true },
  { id: 3, title_ko: 'HS-300 기술 데이터 시트', file_type: 'PDF', file_size: 2150000, download_count: 312, is_active: true },
  { id: 4, title_ko: 'HS-400 기술 데이터 시트', file_type: 'PDF', file_size: 1950000, download_count: 156, is_active: true },
  { id: 5, title_ko: '종합 카탈로그 2024', file_type: 'PDF', file_size: 8500000, download_count: 567, is_active: true },
]

export default function AdminResourcesPage() {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">자료실 관리</h1>
            <p className="text-sm text-gray-500 mt-1">다운로드 자료를 관리합니다</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            자료 추가
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['제목', '형식', '크기', '다운로드', '상태', '작업'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockResources.map(res => (
                <tr key={res.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium">{res.title_ko}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs font-medium">{res.file_type}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{formatFileSize(res.file_size)}</td>
                  <td className="py-3 px-4 text-sm text-gray-500 flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {res.download_count}
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
