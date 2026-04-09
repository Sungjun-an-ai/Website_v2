import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Pin } from 'lucide-react'

const mockNotices = [
  { id: 1, title_ko: '[공지] 2024년 하반기 신제품 출시 안내', is_pinned: true, view_count: 456, created_at: '2024-07-01', is_active: true },
  { id: 2, title_ko: '[안내] 여름 휴가 기간 업무 안내', is_pinned: true, view_count: 234, created_at: '2024-08-01', is_active: true },
  { id: 3, title_ko: 'ISO 9001 갱신 심사 통과', is_pinned: false, view_count: 189, created_at: '2024-06-15', is_active: true },
  { id: 4, title_ko: '2024 건설·건축 박람회 참가 안내', is_pinned: false, view_count: 312, created_at: '2024-05-20', is_active: true },
  { id: 5, title_ko: '홈페이지 리뉴얼 오픈 안내', is_pinned: false, view_count: 678, created_at: '2024-01-15', is_active: true },
]

export default function AdminNoticesPage() {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">공지사항 관리</h1>
            <p className="text-sm text-gray-500 mt-1">공지사항을 작성, 수정, 삭제합니다</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            공지 작성
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['고정', '제목', '조회수', '등록일', '상태', '작업'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockNotices.map(notice => (
                <tr key={notice.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {notice.is_pinned && <Pin className="h-4 w-4 text-gold" />}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium">{notice.title_ko}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{notice.view_count}</td>
                  <td className="py-3 px-4 text-sm text-gray-400">{notice.created_at}</td>
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
