"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type SiteSection = {
  id: string
  section_key: string
  title_ko: string
  title_en: string
  content_ko: string
  content_en: string
}

const emptySection: Omit<SiteSection, 'id'> = {
  section_key: '', title_ko: '', title_en: '', content_ko: '', content_en: '',
}

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<SiteSection[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<SiteSection | null>(null)
  const [form, setForm] = useState(emptySection)
  const [saving, setSaving] = useState(false)

  const fetchSections = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('site_sections').select('*').order('section_key')
    setSections(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchSections() }, [])

  const openAdd = () => { setEditing(null); setForm(emptySection); setOpen(true) }
  const openEdit = (s: SiteSection) => { setEditing(s); setForm({ ...s }); setOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    if (editing) {
      await supabase.from('site_sections').update(form).eq('id', editing.id)
    } else {
      await supabase.from('site_sections').insert(form)
    }
    setSaving(false)
    setOpen(false)
    fetchSections()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('섹션을 삭제하시겠습니까?')) return
    const supabase = createClient()
    await supabase.from('site_sections').delete().eq('id', id)
    fetchSections()
  }

  const f = (k: keyof typeof emptySection, v: string) => setForm(p => ({ ...p, [k]: v }))

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">섹션 관리</h1>
            <p className="text-sm text-gray-500 mt-1">각 페이지 섹션의 내용을 관리합니다</p>
          </div>
          <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />섹션 추가</Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">로딩 중...</div>
        ) : (
          <div className="space-y-3">
            {sections.map(section => (
              <div key={section.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{section.title_ko}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 font-mono">{section.section_key}</p>
                  <p className="text-sm text-gray-500 line-clamp-1">{section.content_ko}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(section)}>
                    <Edit className="h-4 w-4 mr-2" />수정
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(section.id)}>
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? '섹션 수정' : '섹션 추가'}</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              {([['section_key','섹션 키'],['title_ko','제목 (한)'],['title_en','제목 (영)']] as [keyof typeof emptySection, string][]).map(([key, label]) => (
                <div key={key} className="space-y-1">
                  <Label>{label}</Label>
                  <Input value={form[key]} onChange={e => f(key, e.target.value)} />
                </div>
              ))}
              <div className="space-y-1">
                <Label>내용 (한)</Label>
                <textarea className="w-full border border-gray-200 rounded-lg p-2 text-sm min-h-[80px]" value={form.content_ko} onChange={e => f('content_ko', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>내용 (영)</Label>
                <textarea className="w-full border border-gray-200 rounded-lg p-2 text-sm min-h-[80px]" value={form.content_en} onChange={e => f('content_en', e.target.value)} />
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
