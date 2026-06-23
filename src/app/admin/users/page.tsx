"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Mail, ShieldCheck, ShieldOff } from 'lucide-react'

type User = {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string
  is_admin: boolean
  role: string | null
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [inviteMsg, setInviteMsg] = useState('')
  const [inviteError, setInviteError] = useState(false)

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (data.users) setUsers(data.users)
      else setError(data.error || '사용자 목록을 불러오지 못했습니다.')
    } catch {
      setError('API 오류가 발생했습니다.')
    }
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [])

  const handleToggleAdmin = async (user: User) => {
    const next = !user.is_admin
    const verb = next ? '부여' : '해제'
    if (!confirm(`${user.email} 계정의 관리자 권한을 ${verb}하시겠습니까?`)) return
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, email: user.email, is_admin: next }),
      })
      const data = await res.json()
      if (data.error) alert('오류: ' + data.error)
      else fetchUsers()
    } catch {
      alert('오류가 발생했습니다.')
    }
  }

  const handleInvite = async () => {
    setInviting(true)
    setInviteMsg('')
    setInviteError(false)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail }),
      })
      const data = await res.json()
      if (data.error) {
        setInviteMsg('오류: ' + data.error)
        setInviteError(true)
      } else {
        setInviteMsg('초대 이메일이 발송되었습니다.')
        setInviteError(false)
        setInviteEmail('')
        fetchUsers()
      }
    } catch {
      setInviteMsg('오류가 발생했습니다.')
      setInviteError(true)
    }
    setInviting(false)
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">사용자 관리</h1>
            <p className="text-sm text-gray-500 mt-1">관리자 사용자를 관리합니다</p>
          </div>
          <Button onClick={() => { setInviteOpen(true); setInviteMsg(''); setInviteError(false) }}><Plus className="h-4 w-4 mr-2" />사용자 초대</Button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

        {loading ? (
          <div className="text-center py-12 text-gray-400">로딩 중...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>{['이메일', '관리자 권한', '마지막 로그인', '등록일', ''].map(h => <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500">{h}</th>)}</tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium">
                      <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" />{user.email}</span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {user.is_admin ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                          <ShieldCheck className="h-3.5 w-3.5" />{user.role === 'owner' ? '소유자' : '관리자'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
                          <ShieldOff className="h-3.5 w-3.5" />권한 없음
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-400">{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('ko-KR') : '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-400">{new Date(user.created_at).toLocaleDateString('ko-KR')}</td>
                    <td className="py-3 px-4 text-sm text-right">
                      {user.role !== 'owner' && (
                        <Button variant="outline" size="sm" onClick={() => handleToggleAdmin(user)}>
                          {user.is_admin ? '권한 해제' : '권한 부여'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>사용자 초대</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-1">
                <Label>이메일 주소</Label>
                <Input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="admin@example.com" />
              </div>
              {inviteMsg && <p className={`text-sm ${inviteError ? 'text-red-600' : 'text-green-600'}`}>{inviteMsg}</p>}
            </div>
            <DialogFooter className="gap-2 mt-4">
              <Button variant="outline" onClick={() => setInviteOpen(false)}>취소</Button>
              <Button onClick={handleInvite} disabled={inviting || !inviteEmail}>{inviting ? '발송 중...' : '초대 이메일 발송'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
