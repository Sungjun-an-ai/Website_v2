"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import UploadField from '@/components/admin/UploadField'

type AboutSection = {
  id: string
  section_key: string
  title_ko: string
  title_en: string
  subtitle_ko: string
  subtitle_en: string
  content_ko: string
  content_en: string
  image_url: string
  order_index: number
}

const emptySection: Omit<AboutSection, 'id'> = {
  section_key: '', title_ko: '', title_en: '', subtitle_ko: '', subtitle_en: '', content_ko: '', content_en: '', image_url: '', order_index: 0
}

export default function AdminAboutPage() {
  const [sections, setSections] = useState<AboutSection[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<AboutSection | null>(null)
  const [form, setForm] = useState(emptySection)
  const [saving, setSaving] = useState(false)
  const [heroImage, setHeroImage] = useState('')
  const [heroSaving, setHeroSaving] = useState(false)
  const [heroSaved, setHeroSaved] = useState(false)

  const fetchSections = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('about_sections').select('*').order('order_index')
    setSections(data || [])
    const { data: hero } = await supabase.from('site_settings').select('value').eq('key', 'about_hero_image_url').maybeSingle()
    setHeroImage(hero?.value || '')
    setLoading(false)
  }

  useEffect(() => { fetchSections() }, [])

  const saveHero = async () => {
    setHeroSaving(true); setHeroSaved(false)
    const supabase = createClient()
    await supabase.from('site_settings').upsert({ key: 'about_hero_image_url', value: heroImage }, { onConflict: 'key' })
    setHeroSaving(false); setHeroSaved(true)
    setTimeout(() => setHeroSaved(false), 2000)
  }

  const openAdd = () => { setEditing(null); setForm(emptySection); setOpen(true) }
  const openEdit = (s: AboutSection) => { setEditing(s); setForm({ ...s }); setOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    if (editing) {
      await supabase.from('about_sections').update(form).eq('id', editing.id)
    } else {
      await supabase.from('about_sections').insert(form)
    }
    setSaving(false)
    setOpen(false)
    fetchSections()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('섹션을 삭제하시겠습니까?')) return
    const supabase = createClient()
    await supabase.from('about_sections').delete().eq('id', id)
    fetchSections()
  }

  const f = (k: keyof typeof emptySection, v: string | number) => setForm(p => ({ ...p, [k]: v }))

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">회사 소개 관리</h1>
            <p className="text-sm text-gray-500 mt-1">회사 소개 페이지의 스크롤 섹션을 관리합니다</p>
          </div>
          <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />섹션 추가</Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">상단 히어로 배경 이미지</h2>
          <p className="text-xs text-gray-500 mb-3">회사소개 최상단 (ABOUT HANSUNG URETHANE) 섹션의 배경 이미지입니다.</p>
          <UploadField label="히어로 배경 이미지" value={heroImage} onChange={setHeroImage} folder="about" />
          <div className="mt-3 flex items-center gap-3">
            <Button onClick={saveHero} disabled={heroSaving}>{heroSaving ? '저장 중...' : '히어로 저장'}</Button>
            {heroSaved && <span className="text-sm text-green-600">저장되었습니다</span>}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">로딩 중...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['순서', '섹션 키', '제목 (한국어)', '내용 (한국어)', '작업'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sections.map(section => (
                  <tr key={section.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-500">{section.order_index}</td>
                    <td className="py-3 px-4 text-sm font-mono text-gray-500">{section.section_key}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{section.title_ko}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 line-clamp-1 max-w-[200px]">{section.content_ko}</td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(section)}><Edit className="h-4 w-4 text-gray-500" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(section.id)}><Trash2 className="h-4 w-4 text-red-400" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? '섹션 수정' : '섹션 추가'}</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">제목은 큰 영문 헤딩(예: Technology), 서브타이틀은 굵은 한 줄 문구, 내용은 본문입니다.</p>
              {([['section_key','섹션 키 (예: technology)'],['title_ko','제목/헤딩 (한)'],['title_en','제목/헤딩 (영)']] as [keyof typeof form, string][]).map(([key, label]) => (
                <div key={key} className="space-y-1">
                  <Label>{label}</Label>
                  <Input value={form[key] as string} onChange={e => f(key, e.target.value)} />
                </div>
              ))}
              <UploadField label="배경 이미지" value={form.image_url} onChange={v => f('image_url', v)} folder="about" />
              <div className="space-y-1">
                <Label>순서</Label>
                <Input type="number" value={form.order_index} onChange={e => f('order_index', parseInt(e.target.value, 10) || 0)} />
              </div>
              <div className="space-y-1">
                <Label>서브타이틀 (한)</Label>
                <textarea className="w-full border border-gray-200 rounded-lg p-2 text-sm min-h-[56px]" value={form.subtitle_ko} onChange={e => f('subtitle_ko', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>서브타이틀 (영)</Label>
                <textarea className="w-full border border-gray-200 rounded-lg p-2 text-sm min-h-[56px]" value={form.subtitle_en} onChange={e => f('subtitle_en', e.target.value)} />
              </div>
              <div className="space-y-1 mt-2">
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
