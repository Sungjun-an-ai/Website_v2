"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Pin } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Notice = {
  id: string
  title_ko: string
  title_en: string
  content_ko: string
  content_en: string
  is_pinned: boolean
  is_active: boolean
  view_count: number
  created_at: string
}

const emptyNotice: Omit<Notice, 'id' | 'view_count' | 'created_at'> = {
  title_ko: '', title_en: '', content_ko: '', content_en: '',
  is_pinned: false, is_active: true,
}

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Notice | null>(null)
  const [form, setForm] = useState(emptyNotice)
  const [saving, setSaving] = useState(false)

  const fetchNotices = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('notices').select('*').order('created_at', { ascending: false })
    setNotices(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchNotices() }, [])

  const openAdd = () => { setEditing(null); setForm(emptyNotice); setOpen(true) }
  const openEdit = (n: Notice) => {
    setEditing(n)
    setForm({ title_ko: n.title_ko, title_en: n.title_en, content_ko: n.content_ko, content_en: n.content_en, is_pinned: n.is_pinned, is_active: n.is_active })
    setOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    if (editing) {
      await supabase.from('notices').update(form).eq('id', editing.id)
    } else {
      await supabase.from('notices').insert(form)
    }
    setSaving(false)
    setOpen(false)
    fetchNotices()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('공지사항을 삭제하시겠습니까?')) return
    const supabase = createClient()
    await supabase.from('notices').delete().eq('id', id)
    fetchNotices()
  }

  const f = (k: keyof typeof emptyNotice, v: string | boolean) => setForm(p => ({ ...p, [k]: v }))

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">공지사항 관리</h1>
            <p className="text-sm text-gray-500 mt-1">공지사항을 작성, 수정, 삭제합니다</p>
          </div>
          <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />공지 작성</Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">로딩 중...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>{['고정', '제목', '조회수', '등록일', '상태', '작업'].map(h => <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500">{h}</th>)}</tr>
              </thead>
              <tbody>
                {notices.map(notice => (
                  <tr key={notice.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{notice.is_pinned && <Pin className="h-4 w-4 text-gold" />}</td>
                    <td className="py-3 px-4 text-sm font-medium">{notice.title_ko}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{notice.view_count}</td>
                    <td className="py-3 px-4 text-sm text-gray-400">{new Date(notice.created_at).toLocaleDateString('ko-KR')}</td>
                    <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs ${notice.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{notice.is_active ? '활성' : '비활성'}</span></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(notice)}><Edit className="h-4 w-4 text-gray-500" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(notice.id)}><Trash2 className="h-4 w-4 text-red-400" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? '공지 수정' : '공지 작성'}</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              {([['title_ko','제목 (한)'],['title_en','제목 (영)']] as [keyof typeof emptyNotice, string][]).map(([key, label]) => (
                <div key={key} className="space-y-1">
                  <Label>{label}</Label>
                  <Input value={form[key] as string} onChange={e => f(key, e.target.value)} />
                </div>
              ))}
              <div className="space-y-1">
                <Label>내용 (한)</Label>
                <textarea className="w-full border border-gray-200 rounded-lg p-2 text-sm min-h-[100px]" value={form.content_ko} onChange={e => f('content_ko', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>내용 (영)</Label>
                <textarea className="w-full border border-gray-200 rounded-lg p-2 text-sm min-h-[100px]" value={form.content_en} onChange={e => f('content_en', e.target.value)} />
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="is_pinned" checked={form.is_pinned} onChange={e => f('is_pinned', e.target.checked)} className="h-4 w-4" />
                  <Label htmlFor="is_pinned">상단 고정</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="is_active_notice" checked={form.is_active} onChange={e => f('is_active', e.target.checked)} className="h-4 w-4" />
                  <Label htmlFor="is_active_notice">활성</Label>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2 mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>취소</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? '저장 중...' : '저장'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
