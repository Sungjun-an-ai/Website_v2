import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2 } from 'lucide-react'

const mockUsers = [
  { id: 1, email: 'admin@hsurethane.co.kr', role: 'admin', created_at: '2024-01-01' },
  { id: 2, email: 'editor@hsurethane.co.kr', role: 'editor', created_at: '2024-03-15' },
]

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">사용자 관리</h1>
            <p className="text-sm text-gray-500 mt-1">관리자 사용자를 관리합니다</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            사용자 추가
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['이메일', '권한', '등록일', '작업'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockUsers.map(user => (
                <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role === 'admin' ? '관리자' : '편집자'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">{user.created_at}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {user.role !== 'admin' && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
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
