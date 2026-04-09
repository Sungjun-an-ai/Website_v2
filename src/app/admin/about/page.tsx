"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Edit } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type AboutSection = {
  id: string
  section_key: string
  title_ko: string
  title_en: string
  content_ko: string
  content_en: string
  image_url: string
  order_index: number
}

export default function AdminAboutPage() {
  const [sections, setSections] = useState<AboutSection[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<AboutSection | null>(null)
  const [form, setForm] = useState<Omit<AboutSection, 'id'>>({ section_key: '', title_ko: '', title_en: '', content_ko: '', content_en: '', image_url: '', order_index: 0 })
  const [saving, setSaving] = useState(false)

  const fetchSections = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('about_sections').select('*').order('order_index')
    setSections(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchSections() }, [])

  const openEdit = (s: AboutSection) => { setEditing(s); setForm({ ...s }); setOpen(true) }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('about_sections').update(form).eq('id', editing.id)
    setSaving(false)
    setOpen(false)
    fetchSections()
  }

  const f = (k: keyof typeof form, v: string | number) => setForm(p => ({ ...p, [k]: v }))

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">회사 소개 관리</h1>
          <p className="text-sm text-gray-500 mt-1">회사 소개 페이지 내용을 관리합니다</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">로딩 중...</div>
        ) : (
          <div className="space-y-4">
            {sections.map(section => (
              <div key={section.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{section.title_ko}</h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{section.section_key}</p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{section.content_ko}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => openEdit(section)}>
                  <Edit className="h-4 w-4 mr-2" />수정
                </Button>
              </div>
            ))}
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>섹션 수정</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              {([['section_key','섹션 키'],['title_ko','제목 (한)'],['title_en','제목 (영)'],['image_url','이미지 URL']] as [keyof typeof form, string][]).map(([key, label]) => (
                <div key={key} className="space-y-1">
                  <Label>{label}</Label>
                  <Input value={form[key] as string} onChange={e => f(key, e.target.value)} />
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
