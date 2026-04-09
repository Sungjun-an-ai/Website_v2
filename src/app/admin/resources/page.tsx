"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Download } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatFileSize } from '@/lib/utils'

type Resource = {
  id: string
  title_ko: string
  title_en: string
  description_ko: string
  description_en: string
  file_url: string
  file_type: string
  file_size: number
  download_count: number
  is_active: boolean
}

const emptyResource: Omit<Resource, 'id' | 'download_count'> = {
  title_ko: '', title_en: '', description_ko: '', description_en: '',
  file_url: '', file_type: 'PDF', file_size: 0, is_active: true,
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Resource | null>(null)
  const [form, setForm] = useState(emptyResource)
  const [saving, setSaving] = useState(false)

  const fetchResources = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('resources').select('*').order('created_at', { ascending: false })
    setResources(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchResources() }, [])

  const openAdd = () => { setEditing(null); setForm(emptyResource); setOpen(true) }
  const openEdit = (r: Resource) => {
    setEditing(r)
    setForm({ title_ko: r.title_ko, title_en: r.title_en, description_ko: r.description_ko, description_en: r.description_en, file_url: r.file_url, file_type: r.file_type, file_size: r.file_size, is_active: r.is_active })
    setOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    if (editing) {
      await supabase.from('resources').update(form).eq('id', editing.id)
    } else {
      await supabase.from('resources').insert(form)
    }
    setSaving(false)
    setOpen(false)
    fetchResources()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('자료를 삭제하시겠습니까?')) return
    const supabase = createClient()
    await supabase.from('resources').delete().eq('id', id)
    fetchResources()
  }

  const f = (k: keyof typeof emptyResource, v: string | number | boolean) => setForm(p => ({ ...p, [k]: v }))

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">자료실 관리</h1>
            <p className="text-sm text-gray-500 mt-1">다운로드 자료를 관리합니다</p>
          </div>
          <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />자료 추가</Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">로딩 중...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>{['제목', '형식', '크기', '다운로드', '상태', '작업'].map(h => <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500">{h}</th>)}</tr>
              </thead>
              <tbody>
                {resources.map(res => (
                  <tr key={res.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium">{res.title_ko}</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs font-medium">{res.file_type}</span></td>
                    <td className="py-3 px-4 text-sm text-gray-500">{formatFileSize(res.file_size)}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Download className="h-3 w-3" />{res.download_count}</span>
                    </td>
                    <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs ${res.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{res.is_active ? '활성' : '비활성'}</span></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(res)}><Edit className="h-4 w-4 text-gray-500" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(res.id)}><Trash2 className="h-4 w-4 text-red-400" /></Button>
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
            <DialogHeader><DialogTitle>{editing ? '자료 수정' : '자료 추가'}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-2">
              {([['title_ko','제목 (한)'],['title_en','제목 (영)'],['file_url','파일 URL'],['file_type','파일 형식']] as [keyof typeof emptyResource, string][]).map(([key, label]) => (
                <div key={key} className="space-y-1">
                  <Label>{label}</Label>
                  <Input value={form[key] as string} onChange={e => f(key, e.target.value)} />
                </div>
              ))}
              <div className="space-y-1">
                <Label>파일 크기 (bytes)</Label>
                <Input type="number" value={form.file_size} onChange={e => f('file_size', parseInt(e.target.value, 10) || 0)} />
              </div>
              <div className="space-y-1 flex items-center gap-2 pt-5">
                <input type="checkbox" id="is_active_res" checked={form.is_active} onChange={e => f('is_active', e.target.checked)} className="h-4 w-4" />
                <Label htmlFor="is_active_res">활성</Label>
              </div>
              <div className="space-y-1 col-span-2">
                <Label>설명 (한)</Label>
                <Input value={form.description_ko} onChange={e => f('description_ko', e.target.value)} />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>설명 (영)</Label>
                <Input value={form.description_en} onChange={e => f('description_en', e.target.value)} />
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
